interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  variant?: 'gold' | 'green' | 'neutral';
  className?: string;
}

const sizeMap = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };
const variantMap = {
  gold: 'bg-gold-500',
  green: 'bg-green-500',
  neutral: 'bg-neutral-500',
};

export default function ProgressBar({ value, max = 100, size = 'md', showLabel = false, variant = 'gold', className = '' }: ProgressBarProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`flex-1 bg-neutral-200 rounded-full overflow-hidden ${sizeMap[size]}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
        <div className={`${variantMap[variant]} h-full rounded-full transition-all duration-500 ease-out`} style={{ width: `${pct}%` }} />
      </div>
      {showLabel && <span className="text-xs font-semibold text-neutral-600 flex-shrink-0">{Math.round(pct)}%</span>}
    </div>
  );
}

interface Step {
  num: number;
  label: string;
}

export function StepIndicator({ steps, current }: { steps: Step[]; current: number }) {
  return (
    <div className="flex items-center justify-center gap-4">
      {steps.map((s, i) => (
        <div key={s.num} className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${current >= s.num ? 'bg-gold-500 text-white' : 'bg-neutral-200 text-neutral-500'}`}>
              {s.num}
            </div>
            <span className={`text-sm font-medium ${current >= s.num ? 'text-neutral-800' : 'text-neutral-400'}`}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && <div className="w-12 h-0.5 bg-neutral-200" />}
        </div>
      ))}
    </div>
  );
}
