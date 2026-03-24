import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
    },
  },
});

const TRACKER_QUERY_KEY = ['altona-tracker'];
const TRACKER_URL = 'https://busee-production.up.railway.app/scrape-altona';

type BusStop = {
  destination: string;
  stops: string;
  time: string;
};

function AppContent() {
  const { width } = useWindowDimensions();
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);

  const { data, error, isPending, isFetching, refetch } = useQuery({
    queryKey: TRACKER_QUERY_KEY,
    queryFn: async () => {
      const response = await fetch(TRACKER_URL, {
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

      if (!Array.isArray(payload) || payload.length === 0) {
        throw new Error('Tracker payload was empty');
      }

      const firstStop = payload[0];

      if (
        typeof firstStop !== 'object' ||
        firstStop === null ||
        typeof firstStop.destination !== 'string' ||
        typeof firstStop.stops !== 'string' ||
        typeof firstStop.time !== 'string'
      ) {
        throw new Error('Tracker payload shape changed');
      }

      setLastUpdatedAt(
        new Date().toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
        }),
      );

      return firstStop satisfies BusStop;
    },
  });

  const compactLayout = width < 390;

  const handleRefresh = () => {
    void refetch();
  };

  return (
    <View style={styles.appShell}>
      <StatusBar style="dark" />
      <ScrollView
        alwaysBounceHorizontal={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroPanel}>
          <View style={styles.glowPrimary} />
          <View style={styles.glowSecondary} />
          <View
            style={[
              styles.refreshRow,
              compactLayout ? styles.refreshRowCompact : null,
            ]}
          >
            <View style={styles.titleBlock}>
              <Text selectable style={styles.title}>
                Next departure
              </Text>
              <Text selectable style={styles.updatedMeta}>
                {isFetching
                  ? 'Refreshing from network...'
                  : `Updated ${lastUpdatedAt ?? 'just now'}`}
              </Text>
            </View>
            <Pressable
              accessibilityHint="Refreshes the live tracker data from the network."
              accessibilityLabel="Refresh tracker"
              accessibilityRole="button"
              disabled={isFetching}
              onPress={handleRefresh}
              style={({ pressed }) => [
                styles.refreshButton,
                isFetching ? styles.refreshButtonDisabled : null,
                pressed ? styles.refreshButtonPressed : null,
              ]}
            >
              <Text selectable={false} style={styles.refreshSymbol}>
                ↻
              </Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            {isPending ? (
              <View style={styles.loadingState}>
                <ActivityIndicator color="#0f172a" size="small" />
                <Text selectable style={styles.loadingText}>
                  Pulling the latest bus timing...
                </Text>
              </View>
            ) : error instanceof Error ? (
              <View style={styles.errorState}>
                <Text selectable style={styles.errorLabel}>
                  Unable to load tracker
                </Text>
                <Text selectable style={styles.errorMessage}>
                  {error.message}
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.cardTopRow}>
                  <View style={styles.timeCluster}>
                    <Text selectable style={styles.timeLabel}>
                      Due
                    </Text>
                    <Text selectable style={styles.timeValue}>
                      {data.time}
                    </Text>
                  </View>
                  <View style={styles.statusPill}>
                    <View style={styles.statusDot} />
                    <Text selectable style={styles.statusPillText}>
                      Live
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailsGrid}>
                  <View style={styles.detailCard}>
                    <Text selectable style={styles.detailLabel}>
                      Destination
                    </Text>
                    <Text selectable style={styles.detailValue}>
                      {data.destination}
                    </Text>
                  </View>
                  <View style={styles.detailCard}>
                    <Text selectable style={styles.detailLabel}>
                      Service pattern
                    </Text>
                    <Text selectable style={styles.detailValue}>
                      {data.stops}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  appShell: {
    flex: 1,
    backgroundColor: '#f5efe3',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  heroPanel: {
    gap: 20,
    overflow: 'hidden',
    borderRadius: 32,
    borderCurve: 'continuous',
    backgroundColor: '#133043',
    padding: 24,
    boxShadow: '0 24px 80px rgba(15, 23, 42, 0.14)',
  },
  glowPrimary: {
    position: 'absolute',
    top: -60,
    right: -20,
    height: 220,
    width: 220,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 182, 72, 0.22)',
  },
  glowSecondary: {
    position: 'absolute',
    bottom: -80,
    left: -40,
    height: 240,
    width: 240,
    borderRadius: 999,
    backgroundColor: 'rgba(112, 202, 255, 0.14)',
  },
  refreshRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  refreshRowCompact: {
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  titleBlock: {
    flex: 1,
    gap: 8,
  },
  title: {
    color: '#fffdf7',
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
  },
  updatedMeta: {
    color: '#c7d8e4',
    fontSize: 14,
    lineHeight: 20,
  },
  refreshButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    width: 52,
    borderRadius: 18,
    borderCurve: 'continuous',
    backgroundColor: '#f9d89c',
    boxShadow: '0 12px 28px rgba(249, 216, 156, 0.28)',
    alignSelf: 'flex-start',
  },
  refreshButtonDisabled: {
    opacity: 0.72,
  },
  refreshButtonPressed: {
    transform: [{ scale: 0.96 }],
  },
  refreshSymbol: {
    color: '#0f172a',
    fontSize: 24,
    fontWeight: '700',
  },
  card: {
    gap: 20,
    borderRadius: 28,
    borderCurve: 'continuous',
    backgroundColor: '#fffaf0',
    padding: 22,
    boxShadow: '0 16px 40px rgba(12, 22, 32, 0.12)',
  },
  loadingState: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 28,
  },
  loadingText: {
    color: '#43505c',
    fontSize: 15,
  },
  errorState: {
    gap: 10,
  },
  errorLabel: {
    color: '#8a2d1e',
    fontSize: 18,
    fontWeight: '700',
  },
  errorMessage: {
    color: '#5f3a30',
    fontSize: 15,
    lineHeight: 22,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  timeCluster: {
    flex: 1,
    gap: 6,
  },
  timeLabel: {
    color: '#466172',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  timeValue: {
    color: '#10202f',
    fontSize: 42,
    fontWeight: '800',
    lineHeight: 46,
    fontVariant: ['tabular-nums'],
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    borderCurve: 'continuous',
    backgroundColor: '#eef9f2',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusDot: {
    height: 9,
    width: 9,
    borderRadius: 999,
    backgroundColor: '#18a957',
  },
  statusPillText: {
    color: '#18733f',
    fontSize: 13,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#ecdfc8',
  },
  detailsGrid: {
    gap: 12,
  },
  detailCard: {
    gap: 8,
    borderRadius: 20,
    borderCurve: 'continuous',
    backgroundColor: '#f9f1e3',
    padding: 16,
  },
  detailLabel: {
    color: '#6f6253',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  detailValue: {
    color: '#132738',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
});
