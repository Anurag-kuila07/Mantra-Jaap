"use client";

import { useState, useEffect } from 'react';

function getStorageValue<T>(key: string, defaultValue: T): T {
  // getting stored value
  if (typeof window === "undefined") {
    return defaultValue;
  }
  const saved = localStorage.getItem(key);
  try {
    const initial = saved ? (JSON.parse(saved) as T) : defaultValue;
    return initial;
  } catch (e) {
    return defaultValue;
  }
}

export function useLocalStorage<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    // storing value
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch(e) {
      console.error(`Error setting localStorage key “${key}”:`, e);
    }
  }, [key, value]);

  return [value, setValue];
}
