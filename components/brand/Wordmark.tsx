export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`display italic ${className}`}>
      Sabi <span className="text-accent">Fit</span>
    </span>
  );
}
