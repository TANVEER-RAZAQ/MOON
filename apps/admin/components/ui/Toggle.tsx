'use client';

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={!!checked}
      onClick={() => onChange(!checked)}
      style={{
        position: 'relative',
        width: 38, height: 22,
        borderRadius: 999,
        border: '1px solid var(--line-strong)',
        background: checked ? 'var(--saffron)' : 'var(--bg-sunk)',
        transition: 'background .2s ease',
        cursor: 'pointer',
        padding: 0,
        flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute',
        top: 2, left: checked ? 18 : 2,
        width: 16, height: 16,
        borderRadius: '50%',
        background: '#FFF8EC',
        boxShadow: '0 1px 3px rgba(50,30,10,0.25)',
        transition: 'left .2s cubic-bezier(.4,1.4,.6,1)',
      }} />
      {label && <span className="sr-only">{label}</span>}
    </button>
  );
}
