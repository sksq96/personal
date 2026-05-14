'use client'

import { useEffect, useState } from 'react'

export default function AnimationToggle() {
  const [animationEnabled, setAnimationEnabled] = useState(true)

  useEffect(() => {
    const savedAnimation = localStorage.getItem('animation') || 'enabled'
    const isEnabled = savedAnimation === 'enabled'
    setAnimationEnabled(isEnabled)
    document.documentElement.classList.toggle('animation-disabled', !isEnabled)
  }, [])

  const toggleAnimation = () => {
    const newState = !animationEnabled
    setAnimationEnabled(newState)
    localStorage.setItem('animation', newState ? 'enabled' : 'disabled')
    document.documentElement.classList.toggle('animation-disabled', !newState)
  }

  return (
    <button
      onClick={toggleAnimation}
      className="p-2 text-[var(--text-primary)] hover:text-[var(--text-secondary)] transition-colors"
      aria-label="Toggle background animation"
    >
      {animationEnabled ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 5.25v13.5m-7.5-13.5v13.5"
          />
        </svg>
      )}
    </button>
  )
} 