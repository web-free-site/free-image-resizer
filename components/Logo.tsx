export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-label="Free Image Resizer">
      <rect width="64" height="64" rx="14" fill="#0f766e" />
      <path d="M14 44V20l14 12 10-12 12 24H14z" fill="#99f6e4" />
      <circle cx="22" cy="24" r="4" fill="#fef9c3" />
    </svg>
  );
}
