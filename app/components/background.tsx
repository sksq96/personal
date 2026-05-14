'use client';

import { useEffect, useState } from 'react';
import styles from './background.module.css';

const Background = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check localStorage for theme
    const savedTheme = localStorage.getItem('theme');
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Initial theme setup
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      setIsDark(darkModeQuery.matches);
    }

    // Listen for system dark mode changes
    const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      if (!localStorage.getItem('theme')) {
        setIsDark(e.matches);
      }
    };
    
    darkModeQuery.addEventListener('change', updateTheme);

    // Listen for storage changes (when theme is changed by ThemeToggle)
    const handleStorageChange = () => {
      const theme = localStorage.getItem('theme');
      if (theme) {
        setIsDark(theme === 'dark');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for theme changes from ThemeToggle on the same tab
    const handleThemeChange = () => {
      const theme = localStorage.getItem('theme');
      if (theme) {
        setIsDark(theme === 'dark');
      }
    };
    
    // Check for theme changes periodically (for same-tab updates)
    const interval = setInterval(handleThemeChange, 100);

    return () => {
      darkModeQuery.removeEventListener('change', updateTheme);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);


  return (
    <div
      className={`${styles.root} ${styles.animation_ready} ${isDark ? styles.dark : ''}`}
    >
      <div className={styles.dappled_light}>
        <div className={styles.glow}></div>
        <div className={styles.glow_bounce}></div>
        <div className={styles.perspective}>
          <div className={styles.leaves}>
            <svg style={{ width: 0, height: 0, position: 'absolute' }}>
              <defs>
                <filter id="wind" x="-20%" y="-20%" width="140%" height="140%">
                  <feTurbulence type="fractalNoise" numOctaves="1" seed="1">
                    <animate
                      attributeName="baseFrequency"
                      dur="20s"
                      keyTimes="0;0.5;1"
                      values="0.005 0.003;0.008 0.006;0.005 0.003"
                      repeatCount="indefinite"
                    />
                  </feTurbulence>
                  <feDisplacementMap in="SourceGraphic">
                    <animate
                      attributeName="scale"
                      dur="24s"
                      keyTimes="0;0.5;1"
                      values="45;60;45"
                      repeatCount="indefinite"
                    />
                  </feDisplacementMap>
                </filter>
              </defs>
            </svg>
          </div>
          <div className={styles.blinds}>
            <div className={styles.shutters}>
              {Array.from({ length: 23 }).map((_, i) => (
                <div key={i} className={styles.shutter}></div>
              ))}
            </div>
            <div className={styles.vertical}>
              <div className={styles.bar}></div>
              <div className={styles.bar}></div>
            </div>
          </div>
        </div>
        <div className={styles.progressive_blur}>
          <div className={styles.blur_layer1}></div>
          <div className={styles.blur_layer2}></div>
          <div className={styles.blur_layer3}></div>
          <div className={styles.blur_layer4}></div>
        </div>
      </div>
    </div>
  );
};

export default Background; 