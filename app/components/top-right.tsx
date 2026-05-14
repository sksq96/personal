'use client'

import { Clock } from './clock'
import ThemeToggle from './theme-toggle'

export default function TopRight() {
  return (
    <div className="flex items-center gap-3">
      <Clock />
      <ThemeToggle />
    </div>
  )
}
