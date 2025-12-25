import { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export function Textarea({
  label,
  error,
  helperText,
  className = '',
  ...props
}: TextareaProps) {
  const hasError = !!error

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full px-4 py-3 border-2 rounded-lg
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
          disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60
          resize-none
          ${hasError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-200'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}
