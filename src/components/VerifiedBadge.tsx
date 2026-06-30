interface VerifiedBadgeProps {
  verified: boolean;
}

export function VerifiedBadge({ verified }: VerifiedBadgeProps) {
  if (!verified) return null;
  return (
    <span
      role="img"
      aria-label="Verified account"
      className="inline-flex items-center justify-center w-4 h-4 bg-teal text-paper rounded-full text-[10px] ml-1"
    >
      ✓
    </span>
  );
}