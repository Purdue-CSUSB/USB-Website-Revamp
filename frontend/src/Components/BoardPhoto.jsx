import React from 'react';

// The circle renders at 176px (base), 192px (sm) and 224px (lg).
const SIZES = '(min-width: 1024px) 224px, (min-width: 640px) 192px, 176px';
const WIDTHS = [256, 512];

const srcSetFor = (base, ext) => WIDTHS.map((w) => `${base}-${w}.${ext} ${w}w`).join(', ');

/**
 * Board member avatar.
 *
 * The blurred placeholder is a ~100 byte data URI that ships inside
 * board-members.json, so it paints with the first frame instead of leaving a
 * white circle. The real image draws straight over it — there is no opacity
 * transition to get stuck at 0 when the file comes back from disk cache on a
 * refresh.
 */
export default function BoardPhoto({ member, fallback, priority = false }) {
  const base = member.srcBase || fallback?.srcBase;
  const blur = member.blur || fallback?.blur;
  const blurColor = member.blurColor || fallback?.blurColor || '#e5e7eb';

  const placeholder = {
    backgroundColor: blurColor,
    ...(blur
      ? {
          backgroundImage: `url("${blur}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      : null),
  };

  // Legacy rows that predate the optimizer still carry only `photo`.
  if (!base) {
    return (
      <img
        src={encodeURI(`/Board Member Photos/${member.photo}`)}
        alt={member.name}
        className="w-full h-full object-cover"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        width="512"
        height="512"
        style={placeholder}
      />
    );
  }

  return (
    <picture>
      <source type="image/avif" srcSet={srcSetFor(base, 'avif')} sizes={SIZES} />
      <source type="image/webp" srcSet={srcSetFor(base, 'webp')} sizes={SIZES} />
      <img
        src={`${base}-512.webp`}
        alt={member.name}
        className="w-full h-full object-cover"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        width="512"
        height="512"
        style={placeholder}
        onError={(e) => {
          if (!fallback?.srcBase || e.currentTarget.dataset.fallback) return;
          e.currentTarget.dataset.fallback = '1';
          e.currentTarget.src = `${fallback.srcBase}-512.webp`;
        }}
      />
    </picture>
  );
}
