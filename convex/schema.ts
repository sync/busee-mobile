import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  trackerStates: defineTable({
    stopSlug: v.literal('altona'),
    destination: v.string(),
    stops: v.string(),
    time: v.string(),
    sourceUrl: v.string(),
    lastAttemptedAt: v.number(),
    lastSucceededAt: v.optional(v.number()),
    lastError: v.optional(v.string()),
  }).index('by_stopSlug', ['stopSlug']),
});
