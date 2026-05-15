import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      <input
        className={`w-full rounded-md border border-[#cbd8cf] bg-white px-3 py-2 text-sm outline-none focus:border-leaf focus:ring-2 focus:ring-leaf/20 ${className}`}
        {...props}
      />
      {error ? <p className="mt-1 text-sm text-clay">{error}</p> : null}
    </label>
  );
}
