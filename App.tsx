import { ConvexProvider } from 'convex/react';
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { api } from './convex/_generated/api';
import { convex, useQueryWithStatus } from './lib/convex';

function formatUpdatedTime(timestamp: number | undefined) {
  if (timestamp === undefined) {
    return 'Waiting for the first successful refresh...';
  }

  return `Updated ${new Date(timestamp).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })}`;
}

function AppContent() {
  const { width } = useWindowDimensions();
  const tracker = useQueryWithStatus(api.tracker.getAltonaLatest);

  const compactLayout = width < 390;

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
                {tracker.isPending
                  ? 'Connecting to Convex...'
                  : tracker.isError
                    ? 'Unable to read tracker data.'
                    : formatUpdatedTime(tracker.data?.lastSucceededAt)}
              </Text>
              <Text selectable style={styles.autoRefreshMeta}>
                Auto-refreshes every minute
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            {tracker.isPending ? (
              <View style={styles.loadingState}>
                <ActivityIndicator color="#0f172a" size="small" />
                <Text selectable style={styles.loadingText}>
                  Loading the latest saved departure...
                </Text>
              </View>
            ) : tracker.isError ? (
              <View style={styles.errorState}>
                <Text selectable style={styles.errorLabel}>
                  Unable to load tracker
                </Text>
                <Text selectable style={styles.errorMessage}>
                  {tracker.error.message}
                </Text>
              </View>
            ) : tracker.data === null ? (
              <View style={styles.emptyState}>
                <Text selectable style={styles.emptyLabel}>
                  Waiting for tracker data
                </Text>
                <Text selectable style={styles.emptyMessage}>
                  Convex is connected, but the first successful refresh has not
                  landed yet.
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
                      {tracker.data.time}
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
                      {tracker.data.destination}
                    </Text>
                  </View>
                  <View style={styles.detailCard}>
                    <Text selectable style={styles.detailLabel}>
                      Service pattern
                    </Text>
                    <Text selectable style={styles.detailValue}>
                      {tracker.data.stops}
                    </Text>
                  </View>
                </View>

                {tracker.data.lastError ? (
                  <View style={styles.noticeCard}>
                    <Text selectable style={styles.noticeText}>
                      Showing the most recent successful result. Latest refresh
                      failed: {tracker.data.lastError}
                    </Text>
                  </View>
                ) : null}
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
    <ConvexProvider client={convex}>
      <AppContent />
    </ConvexProvider>
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
  autoRefreshMeta: {
    color: '#8eb1c7',
    fontSize: 13,
    lineHeight: 18,
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
  emptyState: {
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
  emptyLabel: {
    color: '#20445a',
    fontSize: 18,
    fontWeight: '700',
  },
  emptyMessage: {
    color: '#506573',
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
  noticeCard: {
    borderRadius: 20,
    borderCurve: 'continuous',
    backgroundColor: '#fff2e2',
    padding: 16,
  },
  noticeText: {
    color: '#7d4e16',
    fontSize: 14,
    lineHeight: 20,
  },
});
