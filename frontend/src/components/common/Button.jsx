import { cn } from '@/utils/helpers';

/**
 * Button — reusable button component with variant support.
 * Variants: primary (default), secondary, outline, ghost
 */
export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    loading = false,
    ...props
}) {
    const baseStyles =
        'inline-flex items-center justify-center font-semibold rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-light focus:ring-primary/50',
        secondary: 'bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary/50',
        outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50',
        ghost: 'text-text-secondary hover:bg-border/50 focus:ring-primary/50',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
            )}
            {children}
        </button>
    );
}
