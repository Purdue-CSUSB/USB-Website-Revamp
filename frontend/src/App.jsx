import Homepage from './Homepage'
import BlogList from './Blog/BlogList'
import BlogPost from './Blog/BlogPost'
import StudentWiki from './StudentWiki/StudentWikiList'
import StudentWikiPost from './StudentWiki/StudentWikiPost'
import InitiativesIndex from './Initiatives/Index'
import ClubHub from './Initiatives/ClubHub/ClubHub'
import Contact from './Contact/Contact'
import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  // Use BrowserRouter with basename for GitHub Pages compatibility
  return (
    <BrowserRouter basename="/USB-Website-Revamp">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/initiatives/blog" element={<BlogList />} />
        <Route path="/initiatives/blog/:slug" element={<BlogPost />} />
        <Route path="/initiatives" element={<InitiativesIndex />} />
        <Route path="/initiatives/club-hub" element={<ClubHub />} />
        <Route path="/student-wiki" element={<StudentWiki />} />
        <Route path="/student-wiki/:slug" element={<StudentWikiPost />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
