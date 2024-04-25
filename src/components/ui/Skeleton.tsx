export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl [background-color:hsl(240_4.8%_95.9%)] ${className}`}
    ></div>
  );
}
