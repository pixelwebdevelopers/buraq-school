/**
 * Utility: Concatenate CSS class names, filtering out falsy values.
 * @param  {...string} classes
 * @returns {string}
 */
export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

/**
 * Utility: Format a date string to a human-readable format.
 * @param {string|Date} date
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string}
 */
export function formatDate(date, options = {}) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...options,
    }).format(new Date(date));
}

/**
 * Utility: Truncate text to a maximum length with ellipsis.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
}
