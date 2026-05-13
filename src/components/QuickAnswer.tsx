import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function QuickAnswer({ children }: Props) {
  return (
    <div
      className="pixel-border-green bg-sky-top p-5 my-6"
      role="region"
      aria-label="Quick answer"
    >
      <div className="flex items-start gap-3">
        <span className="text-lg leading-none mt-0.5">💡</span>
        <div className="flex-1">
          <p className="text-[10px] text-accent-green mb-2 normal-case font-semibold tracking-wider">
            Quick answer
          </p>
          <div className="text-[11px] leading-relaxed text-wood-mid normal-case">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
