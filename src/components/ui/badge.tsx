import * as React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className = '', variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300',
      success: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
      warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
      danger: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
      info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400',
    };

    return (
      <div
        ref={ref}
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;