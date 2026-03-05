import { useState, useEffect } from 'react';

/**
 * useLocalStorage — syncs state with localStorage.
 * @param {string} key - localStorage key
 * @param {*} initialValue - fallback value
 */
export default function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch {
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(storedValue));
        } catch {
            console.error(`Failed to save "${key}" to localStorage`);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}
