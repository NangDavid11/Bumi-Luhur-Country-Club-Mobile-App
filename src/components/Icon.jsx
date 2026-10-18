/* Inline SVG icons. Every icon in src/assets/icons is drawn with
   currentColor, so colour follows the CSS `color` of the parent. */
const files = import.meta.glob('../assets/icons/*.svg', { query: '?raw', import: 'default', eager: true });

const ICONS = Object.fromEntries(
  Object.entries(files).map(([path, svg]) => {
    const name = path.split('/').pop().replace('.svg', '');
    // drop fixed width/height so the wrapper controls the size
    const clean = svg.replace(/\s(width|height)="[^"]*"/g, '').replace('<svg', '<svg aria-hidden="true" focusable="false"');
    return [name, clean];
  }),
);

export default function Icon({ name, size = 24, width, height, className = '', style, label }) {
  const svg = ICONS[name];
  if (!svg) {
    if (import.meta.env.DEV) console.warn(`Unknown icon: ${name}`);
    return null;
  }
  return (
    <span
      className={`icon ${className}`}
      style={{ width: width ?? size, height: height ?? size, ...style }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
