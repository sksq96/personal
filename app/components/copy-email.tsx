'use client'

import { useState } from 'react'

const EMAIL = 'sksq96@gmail.com'

export function CopyEmail({ label = 'email' }: { label?: string }) {
  const [copied, setCopied] = useState(false)

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`copy ${EMAIL} to clipboard`}
      className="underline underline-offset-4 decoration-1 cursor-pointer bg-transparent p-0 border-0 font-inherit text-inherit"
    >
      {copied ? 'copied!' : label}
    </button>
  )
}
