'use client'

import { useEffect, useState } from 'react'
import styles from './background.module.css'

export default function Background() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const sync = () => setIsDark(root.classList.contains('dark'))
    sync()

    const observer = new MutationObserver(sync)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return (
    <div className={`${styles.root} ${styles.animation_ready} ${isDark ? styles.dark : ''}`}>
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
  )
}
