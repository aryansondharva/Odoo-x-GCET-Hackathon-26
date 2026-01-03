const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const cacheManager = {
  get: (key: string) => {
    const item = cache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > CACHE_DURATION) {
      cache.delete(key)
      return null
    }

    return item.data
  },

  set: (key: string, data: any) => {
    cache.set(key, {
      data,
      timestamp: Date.now(),
    })
  },

  clear: () => cache.clear(),

  delete: (key: string) => cache.delete(key),
}

// Debounce function for search and filters
export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Memoization for expensive computations
export const memoize = (fn: Function) => {
  const cache = new Map()
  return (...args: any[]) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)
    }
    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}
