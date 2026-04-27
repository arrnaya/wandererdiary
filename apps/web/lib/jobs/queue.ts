import { Queue, Worker, type Job } from 'bullmq'
import IORedis from 'ioredis'

const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL

let redisConnection: IORedis | null = null

if (redisUrl) {
  try {
    redisConnection = new IORedis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    })
  } catch (e) {
    console.warn('Redis connection failed, falling back to direct execution:', e)
  }
}

export const aiStoryQueue = redisConnection
  ? new Queue('ai-story-generation', { connection: redisConnection })
  : null

export const aiCommunityQueue = redisConnection
  ? new Queue('ai-community-post', { connection: redisConnection })
  : null

export async function addStoryJob(data: {
  destination: any
  angle: string
  aiAuthorId: string
}): Promise<Job | any> {
  if (aiStoryQueue) {
    return aiStoryQueue.add('generate-story', data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    })
  }
  // Fallback: process immediately
  const { processStoryJob } = await import('./processors/story')
  return processStoryJob(data)
}

export async function addCommunityJob(data: {
  destination: any
  type: 'photo-story' | 'travel-tip'
  aiAuthorId: string
}): Promise<Job | any> {
  if (aiCommunityQueue) {
    return aiCommunityQueue.add('generate-community-post', data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    })
  }
  // Fallback: process immediately
  const { processCommunityJob } = await import('./processors/community')
  return processCommunityJob(data)
}

// Initialize workers only on server runtime with Redis
if (redisConnection && typeof window === 'undefined') {
  const storyWorker = new Worker(
    'ai-story-generation',
    async (job) => {
      const { processStoryJob } = await import('./processors/story')
      return processStoryJob(job.data)
    },
    { connection: redisConnection, concurrency: 2 }
  )

  const communityWorker = new Worker(
    'ai-community-post',
    async (job) => {
      const { processCommunityJob } = await import('./processors/community')
      return processCommunityJob(job.data)
    },
    { connection: redisConnection, concurrency: 2 }
  )

  storyWorker.on('failed', (job, err) => {
    console.error(`Story job ${job?.id} failed:`, err)
  })

  communityWorker.on('failed', (job, err) => {
    console.error(`Community job ${job?.id} failed:`, err)
  })
}
