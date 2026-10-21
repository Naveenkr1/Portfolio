import React, { useEffect } from 'react';

const SitePet = () => {
  useEffect(() => {
    let isMounted = true;

    const checkAndInitPet = async () => {
      let isEnabled = true;

      // 1. Try fetching from dynamic API (Express)
      try {
        const res = await fetch(`/api/settings/site-pet?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          isEnabled = data.enabled !== false;
        } else {
          // 2. Fallback to static settings file (Vercel / Static Build)
          const res2 = await fetch(`/site-pet-settings.json?t=${Date.now()}`);
          if (res2.ok) {
            const data2 = await res2.json();
            isEnabled = data2.enabled !== false;
          }
        }
      } catch (err) {
        try {
          const res2 = await fetch(`/site-pet-settings.json?t=${Date.now()}`);
          if (res2.ok) {
            const data2 = await res2.json();
            isEnabled = data2.enabled !== false;
          }
        } catch (e) {
          isEnabled = true;
        }
      }

      if (!isMounted) return;

      if (isEnabled) {
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
          if (window.SitePet) {
            if (typeof window.SitePet.show === 'function') {
              window.SitePet.show();
            }
          } else {
            let script = document.getElementById('site-pet-script');
            if (!script) {
              window.SitePetConfig = {
                scale: 0.9,
                follow: 130,
                greeting: 'mrrp.',
                hoverSelector: 'a,button,[data-pet]',
              };
              script = document.createElement('script');
              script.id = 'site-pet-script';
              script.src = '/site-pet.js';
              script.async = true;
              document.body.appendChild(script);
            }
          }
        }
      } else {
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
          if (window.SitePet && typeof window.SitePet.destroy === 'function') {
            window.SitePet.destroy();
          } else if (window.SitePet && typeof window.SitePet.hide === 'function') {
            window.SitePet.hide();
          }
          const host = document.getElementById('site-pet-host');
          if (host && host.parentNode) {
            host.parentNode.removeChild(host);
          }
          const script = document.getElementById('site-pet-script');
          if (script && script.parentNode) {
            script.parentNode.removeChild(script);
          }
          delete window.SitePet;
        }
      }
    };

    checkAndInitPet();

    return () => {
      isMounted = false;
    };
  }, []);

  return null;
};

export default SitePet;
