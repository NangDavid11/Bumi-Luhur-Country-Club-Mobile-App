import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

/* Renders a scannable QR code as an SVG (white modules on transparent by
   default, matching the member card). */
export default function QrCode({ value, size = 202, color = '#ffffff', background = '#0000', label }) {
  const [svg, setSvg] = useState('');
  useEffect(() => {
    let alive = true;
    QRCode.toString(value, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: color, light: background } })
      .then((s) => { if (alive) setSvg(s.replace('<svg', '<svg shape-rendering="crispEdges" width="100%" height="100%"')); })
      .catch(() => setSvg(''));
    return () => { alive = false; };
  }, [value, color, background]);
  return <div className="qr" role="img" aria-label={label ?? `QR code ${value}`} style={{ width: size, height: size }} dangerouslySetInnerHTML={{ __html: svg }} />;
}
