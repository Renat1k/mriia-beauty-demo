export function Flower({ className = '', petals = 8 }: { className?: string; petals?: number }) {
  return (
    <svg className={`flower ${className}`} viewBox="0 0 80 80" fill="none" aria-hidden="true">
      {Array.from({ length: petals }, (_, i) => (
        <ellipse key={i} cx="40" cy="23" rx="10" ry="21" fill="currentColor" transform={`rotate(${i * 360 / petals} 40 40)`} />
      ))}
      <circle cx="40" cy="40" r="12" className="flower-center" />
    </svg>
  )
}
