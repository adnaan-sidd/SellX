import Redis from 'ioredis'

// Redis client for server-side caching
let redisClient: Redis | null = null

// Initialize Redis client
export function getRedisClient(): Redis | null {
  if (!redisClient && process.env.REDIS_URL) {
    try {
      redisClient = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        enableReadyCheck: false,
        lazyConnect: true,
      })

      redisClient.on('error', (err) => {
        console.error('Redis connection error:', err)
        redisClient = null
      })

      redisClient.on('connect', () => {
        console.log('Connected to Redis')
      })
    } catch (error) {
      console.error('Failed to initialize Redis:', error)
      redisClient = null
    }
  }

  return redisClient
}

// In-memory cache for development/fallback
const memoryCache = new Map<string, { data: any; expires: number }>()

// Cache configuration
export const CACHE_KEYS = {
  PRODUCTS_LIST: (filters: any) => `products:list:${JSON.stringify(filters)}`,
  PRODUCT_DETAIL: (id: string) => `products:detail:${id}`,
  USER_PROFILE: (id: string) => `users:profile:${id}`,
  CATEGORIES: 'categories:list',
  SUBCATEGORIES: (categoryId: string) => `subcategories:${categoryId}`,
  USER_PRODUCTS: (userId: string) => `users:products:${userId}`,
} as const

export const CACHE_TTL = {
  PRODUCTS_LIST: 300, // 5 minutes
  PRODUCT_DETAIL: 600, // 10 minutes
  USER_PROFILE: 1800, // 30 minutes
  CATEGORIES: 3600, // 1 hour
  SUBCATEGORIES: 3600, // 1 hour
  USER_PRODUCTS: 300, // 5 minutes
} as const

// Cache operations
export class CacheManager {
  private redis: Redis | null

  constructor() {
    this.redis = getRedisClient()
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      if (this.redis) {
        const data = await this.redis.get(key)
        if (data) {
          return JSON.parse(data)
        }
      } else {
        // Fallback to memory cache
        const cached = memoryCache.get(key)
        if (cached && Date.now() < cached.expires) {
          return cached.data
        } else if (cached) {
          memoryCache.delete(key)
        }
      }
    } catch (error) {
      console.error('Cache get error:', error)
    }
    return null
  }

  async set(key: string, data: any, ttlSeconds: number = 300): Promise<void> {
    try {
      const expires = Date.now() + (ttlSeconds * 1000)

      if (this.redis) {
        await this.redis.setex(key, ttlSeconds, JSON.stringify(data))
      } else {
        // Fallback to memory cache
        memoryCache.set(key, { data, expires })

        // Clean up expired entries periodically
        if (memoryCache.size > 1000) {
          this.cleanupMemoryCache()
        }
      }
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }

  async delete(key: string): Promise<void> {
    try {
      if (this.redis) {
        await this.redis.del(key)
      } else {
        memoryCache.delete(key)
      }
    } catch (error) {
      console.error('Cache delete error:', error)
    }
  }

  async deletePattern(pattern: string): Promise<void> {
    try {
      if (this.redis) {
        const keys = await this.redis.keys(pattern)
        if (keys.length > 0) {
          await this.redis.del(...keys)
        }
      } else {
        // For memory cache, we can't efficiently delete by pattern
        // This is a limitation of the in-memory fallback
        console.warn('Pattern deletion not supported in memory cache')
      }
    } catch (error) {
      console.error('Cache delete pattern error:', error)
    }
  }

  async clear(): Promise<void> {
    try {
      if (this.redis) {
        await this.redis.flushall()
      } else {
        memoryCache.clear()
      }
    } catch (error) {
      console.error('Cache clear error:', error)
    }
  }

  private cleanupMemoryCache(): void {
    const now = Date.now()
    for (const [key, value] of memoryCache.entries()) {
      if (now > value.expires) {
        memoryCache.delete(key)
      }
    }
  }

  // Get cache statistics
  async getStats(): Promise<{
    redis: boolean
    memoryCacheSize: number
    redisInfo?: any
  }> {
    const stats: {
      redis: boolean
      memoryCacheSize: number
      redisInfo?: any
    } = {
      redis: !!this.redis,
      memoryCacheSize: memoryCache.size,
    }

    if (this.redis) {
      try {
        const info = await this.redis.info()
        stats.redisInfo = {
          connected_clients: info.match(/connected_clients:(\d+)/)?.[1],
          used_memory: info.match(/used_memory:(\d+)/)?.[1],
          total_connections_received: info.match(/total_connections_received:(\d+)/)?.[1],
        }
      } catch (error) {
        console.error('Failed to get Redis stats:', error)
      }
    }

    return stats
  }
}

// Export singleton instance
export const cacheManager = new CacheManager()

// Utility functions for common cache operations
export const cacheProductsList = async (filters: any, products: any, ttl?: number) => {
  const key = CACHE_KEYS.PRODUCTS_LIST(filters)
  await cacheManager.set(key, products, ttl || CACHE_TTL.PRODUCTS_LIST)
}

export const getCachedProductsList = async (filters: any) => {
  const key = CACHE_KEYS.PRODUCTS_LIST(filters)
  return await cacheManager.get(key)
}

export const invalidateProductsCache = async () => {
  await cacheManager.deletePattern('products:*')
}

export const cacheProductDetail = async (productId: string, product: any, ttl?: number) => {
  const key = CACHE_KEYS.PRODUCT_DETAIL(productId)
  await cacheManager.set(key, product, ttl || CACHE_TTL.PRODUCT_DETAIL)
}

export const getCachedProductDetail = async (productId: string) => {
  const key = CACHE_KEYS.PRODUCT_DETAIL(productId)
  return await cacheManager.get(key)
}

export const invalidateProductCache = async (productId: string) => {
  const key = CACHE_KEYS.PRODUCT_DETAIL(productId)
  await cacheManager.delete(key)
}

export const cacheUserProducts = async (userId: string, products: any, ttl?: number) => {
  const key = CACHE_KEYS.USER_PRODUCTS(userId)
  await cacheManager.set(key, products, ttl || CACHE_TTL.USER_PRODUCTS)
}

export const getCachedUserProducts = async (userId: string) => {
  const key = CACHE_KEYS.USER_PRODUCTS(userId)
  return await cacheManager.get(key)
}

export const invalidateUserProductsCache = async (userId: string) => {
  const key = CACHE_KEYS.USER_PRODUCTS(userId)
  await cacheManager.delete(key)
}