'use client'

import { useState, useEffect } from 'react'

export function Clock() {
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatDate = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    const day = days[date.getDay()]
    const month = months[date.getMonth()]
    const dayOfMonth = date.getDate()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    
    return `${day} ${month} ${dayOfMonth} • ${hours}:${minutes}:${seconds}`
  }

  return (
    <>
      <style jsx>{`
        .clock {
          color: var(--footer-version);
        }
      `}</style>
      <div className="text-xs clock">
        {formatDate(date)}
      </div>
    </>
  )
} 