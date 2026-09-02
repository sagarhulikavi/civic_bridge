import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Password input with an inline show/hide (visibility) toggle.
 * - Shows an "eye" icon when hidden and switches input to text on click.
 * - Shows an "eye-off" icon when visible and switches back to password on click.
 * - The entered value is never cleared or changed by toggling (only `type` flips).
 * - `type="button"` prevents the toggle from submitting its parent form.
 */
export const PasswordInput = ({
  value,
  onChange,
  placeholder,
  required,
  minLength,
  id,
  autoComplete,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className="relative">
      <input
        id={id}
        type={showPassword ? 'text' : 'password'}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full py-2.5 pl-3.5 pr-11 rounded-xl border border-surface-border focus:ring-2 focus:ring-brand-500 outline-none"
      />
      <button
        type="button"
        onClick={toggleVisibility}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        title={showPassword ? 'Hide password' : 'Show password'}
        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-dark-500 hover:text-dark-700 transition"
      >
        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
};
