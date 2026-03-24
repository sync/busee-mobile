import { v } from 'convex/values';

import { internal } from './_generated/api';
import { internalAction, internalMutation, query } from './_generated/server';

const STOP_SLUG = 'altona';
const SOURCE_URL = 'https://busee-production.up.railway.app/scrape-altona';

type TrackerStop = {
  destination: string;
  stops: string;
  time: string;
};

function isTrackerStop(value: unknown): value is TrackerStop {
  const candidate = value as Record<string, unknown> | null;

  return (
    candidate !== null &&
    typeof candidate === 'object' &&
    typeof candidate.destination === 'string' &&
    typeof candidate.stops === 'string' &&
    typeof candidate.time === 'string'
  );
}

function extractFirstStop(payload: unknown): TrackerStop {
  if (!Array.isArray(payload) || payload.length === 0) {
    throw new Error('Tracker payload was empty');
  }

  const firstStop = payload[0];

  if (!isTrackerStop(firstStop)) {
    throw new Error('Tracker payload shape changed');
  }

  return firstStop;
}

export const getAltonaLatest = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('trackerStates')
      .withIndex('by_stopSlug', (q) => q.eq('stopSlug', STOP_SLUG))
      .unique();
  },
});

export const upsertAltonaLatest = internalMutation({
  args: {
    destination: v.optional(v.string()),
    stops: v.optional(v.string()),
    time: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
    lastAttemptedAt: v.number(),
    lastError: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('trackerStates')
      .withIndex('by_stopSlug', (q) => q.eq('stopSlug', STOP_SLUG))
      .unique();

    const isSuccessfulRefresh =
      args.destination !== undefined ||
      args.stops !== undefined ||
      args.time !== undefined ||
      args.sourceUrl !== undefined;

    if (isSuccessfulRefresh) {
      if (
        args.destination === undefined ||
        args.stops === undefined ||
        args.time === undefined ||
        args.sourceUrl === undefined
      ) {
        throw new Error('Successful tracker refreshes require full stop data');
      }

      const patch = {
        destination: args.destination,
        stops: args.stops,
        time: args.time,
        sourceUrl: args.sourceUrl,
        lastAttemptedAt: args.lastAttemptedAt,
        lastSucceededAt: args.lastAttemptedAt,
        lastError: undefined,
      };

      if (existing) {
        await ctx.db.patch(existing._id, patch);
        return existing._id;
      }

      return await ctx.db.insert('trackerStates', {
        stopSlug: STOP_SLUG,
        ...patch,
      });
    }

    if (!existing) {
      return null;
    }

    await ctx.db.patch(existing._id, {
      lastAttemptedAt: args.lastAttemptedAt,
      lastError: args.lastError ?? 'Unknown refresh error',
    });

    return existing._id;
  },
});

export const refreshAltonaFromSource = internalAction({
  args: {},
  handler: async (ctx) => {
    const lastAttemptedAt = Date.now();

    try {
      const response = await fetch(SOURCE_URL, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`Tracker request failed (${response.status})`);
      }

      const payload: unknown = await response.json();
      const firstStop = extractFirstStop(payload);

      await ctx.runMutation(internal.tracker.upsertAltonaLatest, {
        destination: firstStop.destination,
        stops: firstStop.stops,
        time: firstStop.time,
        sourceUrl: SOURCE_URL,
        lastAttemptedAt,
      });

      return {
        ok: true,
        refreshedAt: lastAttemptedAt,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown refresh error';

      await ctx.runMutation(internal.tracker.upsertAltonaLatest, {
        lastAttemptedAt,
        lastError: message,
      });

      throw new Error(message);
    }
  },
});
