import { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
  className?: string
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`max-w-7xl mx-auto px-6 py-12 ${className}`}>
      {children}
    </div>
  )
}
