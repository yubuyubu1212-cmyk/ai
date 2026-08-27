'use client'

import * as React from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [storedValue, setStoredValue] = React.useState<T>(initialValue)
  const [isHydrated, setIsHydrated] = React.useState(false)

  React.useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item !== null) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
    } finally {
      setIsHydrated(true)
    }
  }, [key])

  const setValue = React.useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setStoredValue((prev) => {
          const nextValue = value instanceof Function ? value(prev) : value
          if (typeof window !== 'undefined') {
            if (nextValue === null || nextValue === undefined) {
              window.localStorage.removeItem(key)
            } else {
              window.localStorage.setItem(key, JSON.stringify(nextValue))
            }
          }
          return nextValue
        })
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key]
  )

  return [storedValue, setValue, isHydrated]
}
