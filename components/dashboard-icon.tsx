export function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Caja inferior */}
      <rect x="4" y="12" width="6" height="6" rx="1" />

      {/* Caja superior */}
      <rect x="14" y="6" y="12" width="6" height="6" rx="1" />

      {/* Caja superior */}
      <rect x="14" y="6" width="6" height="6" rx="1" />

      {/* Caja media */}
      <rect x="4" y="6" width="6" height="6" rx="1" opacity="0.7" />

      {/* Flecha circular */}
      <path d="M19 3v4h-4" strokeWidth="1.5" className="text-accent" />
      <path d="M5 21v-4h4" strokeWidth="1.5" className="text-accent" />
      <path d="M21 12c0 4.97-4.03 9-9 9" strokeWidth="1.5" className="text-accent" />
      <path d="M3 12c0-4.97 4.03-9 9-9" strokeWidth="1.5" className="text-accent" />
    </svg>
  )
}
