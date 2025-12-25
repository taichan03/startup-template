import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  hoverable?: boolean
  bordered?: boolean
  padding?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Card({
  children,
  hoverable = false,
  bordered = true,
  padding = 'md',
  className = '',
}: CardProps) {
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      className={`
        bg-white rounded-xl
        ${bordered ? 'border border-gray-200' : ''}
        ${hoverable ? 'shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out' : 'shadow-md'}
        ${paddingStyles[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
