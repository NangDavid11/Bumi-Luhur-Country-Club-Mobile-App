import { useCallback, useEffect, useState } from 'react';

/* Captures the browser's install prompt (Android/Chrome/Edge) and detects
   iOS Safari, where installing goes through Share → Add to Home Screen. */
let deferred = null;
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e; });
}

export function useInstallPrompt() {
  const [canInstall, setCanInstall] = useState(!!deferred);
  const [installed, setInstalled] = useState(
    typeof window !== 'undefined' && (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true),
  );
  const isIos = typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);

  useEffect(() => {
    const onPrompt = (e) => { e.preventDefault(); deferred = e; setCanInstall(true); };
    const onInstalled = () => { setInstalled(true); setCanInstall(false); deferred = null; };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferred) return false;
    deferred.prompt();
    const { outcome } = await deferred.userChoice;
    deferred = null;
    setCanInstall(false);
    return outcome === 'accepted';
  }, []);

  return { canInstall, installed, isIos, install };
}
