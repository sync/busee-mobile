import { makeUseQueryWithStatus } from 'convex-helpers/react';
import { ConvexReactClient, useQueries } from 'convex/react';

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw new Error(
    'Missing EXPO_PUBLIC_CONVEX_URL. Run `npx convex dev` to configure Convex.',
  );
}

export const convex = new ConvexReactClient(convexUrl, {
  unsavedChangesWarning: false,
});

export const useQueryWithStatus = makeUseQueryWithStatus(useQueries);
