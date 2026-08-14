import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync, existsSync, readdirSync, readFileSync, mkdirSync, createReadStream } from 'fs'
import { join, dirname } from 'path'
import { pathToFileURL } from 'url'

// The camera-resolution board photos (210MB, up to 23MB each) are inputs to
// scripts/optimize-board-photos.mjs, so they live in board-photo-originals/
// rather than public/ - Vite copies public/ verbatim, and copying 210MB into
// dist on every build is both slow and, on a tight disk, fatal.
//
// They are not entirely unused: a handful of blog and wiki posts reference them
// directly as author avatars. This plugin serves those from the originals during
// dev, and copies only the referenced ones into dist at build time.
const ORIGINALS_DIR = 'board-photo-originals'
const URL_PREFIX = '/Board Member Photos/'

/** Files under "Board Member Photos/<png|webp>/..." referenced by shipped content. */
const scanReferences = (roots) => {
  const referenced = new Set(['png/None.png', 'webp/None.webp'])
  const walk = (dir) => {
    if (!existsSync(dir)) return
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (/\.(json|md)$/i.test(entry.name)) {
        for (const m of readFileSync(full, 'utf8').matchAll(
          /Board Member Photos\/(png|webp)\/([^"'\s)\\]+)/gi
        )) {
          referenced.add(`${m[1].toLowerCase()}/${decodeURIComponent(m[2])}`)
        }
      }
    }
  }
  roots.forEach(walk)
  return referenced
}

const boardPhotoOriginalsPlugin = () => ({
  name: 'board-photo-originals',

  // Dev: resolve /Board Member Photos/png/X.png out of the originals directory
  // so blog and wiki avatars look the same locally as in production.
  configureServer(server) {
    const originals = join(import.meta.dirname, ORIGINALS_DIR)
    server.middlewares.use((req, res, next) => {
      let url
      try {
        url = decodeURIComponent((req.url || '').split('?')[0])
      } catch {
        return next()
      }
      if (!url.startsWith(URL_PREFIX)) return next()
      const rel = url.slice(URL_PREFIX.length)
      // Only these two subdirectories, and no traversal out of them.
      if (!/^(png|webp)\/[^/]+$/.test(rel)) return next()
      const file = join(originals, rel)
      if (!file.startsWith(originals) || !existsSync(file)) return next()
      res.setHeader('Content-Type', rel.endsWith('.png') ? 'image/png' : 'image/webp')
      createReadStream(file).pipe(res)
    })
  },

  // Build: copy across only what the shipped content actually references.
  closeBundle() {
    const dist = join(import.meta.dirname, 'dist')
    const originals = join(import.meta.dirname, ORIGINALS_DIR)
    if (!existsSync(originals)) return

    const referenced = scanReferences([join(dist, 'Blog'), join(dist, 'Student Wiki')])
    let copied = 0
    const missing = []
    for (const rel of referenced) {
      const src = join(originals, rel)
      if (!existsSync(src)) {
        missing.push(rel)
        continue
      }
      const dest = join(dist, 'Board Member Photos', rel)
      mkdirSync(dirname(dest), { recursive: true })
      copyFileSync(src, dest)
      copied++
    }
    console.log(`\u2713 Copied ${copied} board photo original(s) referenced by blog/wiki`)
    if (missing.length) {
      console.warn(`  note: ${missing.length} referenced photo(s) do not exist: ${missing.join(', ')}`)
    }
  },
})

// Runs the Vercel serverless functions in api/ during `npm run dev`, so the
// Instagram carousel shows real MongoDB data locally instead of silently
// falling back to the checked-in insta_posts.json. In production Vercel serves
// these itself; this only fills the gap in Vite's dev server.
const apiDevServerPlugin = () => ({
  name: 'api-dev-server',
  apply: 'serve',
  configureServer(server) {
    const repoRoot = join(import.meta.dirname, '..')
    const apiDir = join(repoRoot, 'api')

    // The functions read process.env; load the root .env the same way Vercel
    // injects project env vars. Server-side only - nothing reaches the bundle.
    const envFile = join(repoRoot, '.env')
    if (existsSync(envFile)) {
      for (const line of readFileSync(envFile, 'utf8').split('\n')) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)
        if (!m) continue
        const value = m[2].trim().replace(/^["']|["']$/g, '')
        if (value && !(m[1] in process.env)) process.env[m[1]] = value
      }
    }

    /** Map /api/a/b to api/a/b.js, falling back to a [param].js in that folder. */
    const resolveHandler = (pathname) => {
      const parts = pathname.replace(/^\/api\//, '').replace(/\/+$/, '').split('/')
      if (parts.some((p) => !p || p === '.' || p === '..')) return null
      const exact = join(apiDir, ...parts) + '.js'
      if (existsSync(exact)) return { file: exact, params: {} }
      const dir = join(apiDir, ...parts.slice(0, -1))
      if (!existsSync(dir)) return null
      const dynamic = readdirSync(dir)
        .map((f) => f.match(/^\[(.+)\]\.js$/))
        .find(Boolean)
      if (!dynamic) return null
      return {
        file: join(dir, dynamic[0]),
        params: { [dynamic[1]]: parts[parts.length - 1] },
      }
    }

    server.middlewares.use(async (req, res, next) => {
      const url = (req.url || '').split('?')[0]
      if (!url.startsWith('/api/')) return next()

      const match = resolveHandler(url)
      if (!match) {
        res.statusCode = 404
        res.setHeader('Content-Type', 'application/json')
        return res.end(JSON.stringify({ error: 'no_such_function', path: url }))
      }

      try {
        // pathToFileURL + plain import bypasses Vite's transform pipeline, so the
        // handlers run under Node exactly as they do on Vercel.
        const mod = await import(`${pathToFileURL(match.file).href}?t=${Date.now()}`)
        const query = Object.fromEntries(new URL(req.url, 'http://localhost').searchParams)
        req.query = { ...query, ...match.params }
        await mod.default(req, res)
      } catch (err) {
        server.config.logger.error(`[api-dev] ${url}: ${err.stack || err}`)
        if (!res.headersSent) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'dev_handler_failed', message: String(err.message || err) }))
        }
      }
    })

    server.config.logger.info('  \u279c  API:      /api/* served from ./api (dev only)')
  },
})

// Plugin to copy index.html to 404.html for GitHub Pages SPA support
const copy404Plugin = () => {
  return {
    name: 'copy-404',
    closeBundle() {
      // After build, copy index.html to 404.html for GitHub Pages
      const distPath = join(import.meta.dirname, 'dist')
      try {
        copyFileSync(
          join(distPath, 'index.html'),
          join(distPath, '404.html')
        )
        console.log('✓ Copied index.html to 404.html for GitHub Pages support')
      } catch (error) {
        console.warn('Could not copy index.html to 404.html:', error.message)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), apiDevServerPlugin(), boardPhotoOriginalsPlugin(), copy404Plugin()],
  base: '/',
  preview: {
    // Configure preview server to handle SPA routing
    // This ensures that refreshing on any route works in preview mode
    port: 4173,
    strictPort: false,
  },
  server: {
    // Configure dev server to handle SPA routing
    // This ensures that refreshing on any route works in dev mode
    port: 5173,
    strictPort: false,
  },
  build: {
    // Ensure proper handling of SPA routes in production build
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
