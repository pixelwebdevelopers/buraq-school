import { cn } from '@/utils/helpers';

/**
 * Input — reusable form input component with label and error support.
 */
export default function Input({
    label,
    id,
    error,
    className = '',
    ...props
}) {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="mb-1 block text-sm font-medium text-text-secondary">
                    {label}
                </label>
            )}
            <input
                id={id}
                className={cn(
                    'w-full rounded-lg border bg-background px-4 py-2.5 text-text-primary outline-none transition',
                    error
                        ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
                        : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20',
                    className
                )}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-error">{error}</p>}
        </div>
    );
}
