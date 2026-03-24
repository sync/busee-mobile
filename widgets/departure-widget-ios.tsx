import type { ReactNode } from 'react';
import { Voltra } from 'voltra';
import type { WidgetVariants } from 'voltra';

import {
  initialDepartureWidgetState,
  type DepartureWidgetState,
} from './departure-widget-state';

const colors = {
  accent: '#ffb648',
  background: '#133043',
  divider: '#2b5368',
  muted: '#c7d8e4',
  pill: '#1d485f',
  primary: '#fffdf7',
  warning: '#f6d365',
};

function Shell({
  children,
  padding,
}: {
  children: ReactNode;
  padding: number;
}) {
  return (
    <Voltra.VStack
      spacing={12}
      style={{
        width: '100%',
        height: '100%',
        padding,
        backgroundColor: colors.background,
        borderRadius: 28,
      }}
    >
      {children}
    </Voltra.VStack>
  );
}

function Header({ updatedText }: { updatedText: string }) {
  return (
    <Voltra.VStack spacing={4}>
      <Voltra.Text
        style={{
          color: colors.primary,
          fontSize: 18,
          fontWeight: '800',
        }}
      >
        Next departure
      </Voltra.Text>
      <Voltra.Text
        style={{
          color: colors.muted,
          fontSize: 12,
        }}
      >
        {updatedText}
      </Voltra.Text>
    </Voltra.VStack>
  );
}

function StatusPill() {
  return (
    <Voltra.HStack
      alignment="center"
      spacing={6}
      style={{
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: colors.pill,
        borderRadius: 999,
      }}
    >
      <Voltra.View
        style={{
          width: 8,
          height: 8,
          backgroundColor: colors.accent,
          borderRadius: 999,
        }}
      />
      <Voltra.Text
        style={{
          color: colors.primary,
          fontSize: 11,
          fontWeight: '700',
        }}
      >
        Live
      </Voltra.Text>
    </Voltra.HStack>
  );
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <Voltra.VStack spacing={4}>
      <Voltra.Text
        style={{
          color: colors.muted,
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Voltra.Text>
      <Voltra.Text
        style={{
          color: colors.primary,
          fontSize: 14,
          fontWeight: '700',
        }}
      >
        {value}
      </Voltra.Text>
    </Voltra.VStack>
  );
}

function StateMessage({ title, message }: { title: string; message: string }) {
  return (
    <Voltra.VStack spacing={6}>
      <Voltra.Text
        style={{
          color: colors.primary,
          fontSize: 20,
          fontWeight: '800',
        }}
      >
        {title}
      </Voltra.Text>
      <Voltra.Text
        style={{
          color: colors.muted,
          fontSize: 13,
          lineHeight: 18,
        }}
      >
        {message}
      </Voltra.Text>
    </Voltra.VStack>
  );
}

function MediumReadyState({
  destination,
  notice,
  stops,
  time,
}: Extract<DepartureWidgetState, { kind: 'ready' }>) {
  return (
    <Voltra.VStack spacing={10}>
      <Voltra.HStack
        layout="flex"
        alignment="center"
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Voltra.VStack spacing={4}>
          <Voltra.Text
            style={{
              color: colors.muted,
              fontSize: 11,
              fontWeight: '700',
            }}
          >
            Due
          </Voltra.Text>
          <Voltra.Text
            style={{
              color: colors.primary,
              fontSize: 28,
              fontWeight: '900',
            }}
          >
            {time}
          </Voltra.Text>
        </Voltra.VStack>
        <StatusPill />
      </Voltra.HStack>

      <Voltra.View
        style={{
          width: '100%',
          height: 1,
          backgroundColor: colors.divider,
        }}
      />

      <DetailBlock label="Destination" value={destination} />
      <DetailBlock label="Service pattern" value={stops} />

      {notice ? (
        <Voltra.Text
          style={{
            color: colors.warning,
            fontSize: 11,
            lineHeight: 15,
          }}
        >
          {notice}
        </Voltra.Text>
      ) : null}
    </Voltra.VStack>
  );
}

function LargeReadyState({
  destination,
  notice,
  stops,
  time,
}: Extract<DepartureWidgetState, { kind: 'ready' }>) {
  return (
    <Voltra.VStack spacing={12}>
      <Voltra.HStack
        layout="flex"
        alignment="center"
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Voltra.VStack spacing={4}>
          <Voltra.Text
            style={{
              color: colors.muted,
              fontSize: 11,
              fontWeight: '700',
            }}
          >
            Due
          </Voltra.Text>
          <Voltra.Text
            style={{
              color: colors.primary,
              fontSize: 32,
              fontWeight: '900',
            }}
          >
            {time}
          </Voltra.Text>
        </Voltra.VStack>
        <StatusPill />
      </Voltra.HStack>

      <Voltra.View
        style={{
          width: '100%',
          height: 1,
          backgroundColor: colors.divider,
        }}
      />

      <Voltra.HStack spacing={16}>
        <Voltra.View style={{ flex: 1 }}>
          <DetailBlock label="Destination" value={destination} />
        </Voltra.View>
        <Voltra.View style={{ flex: 1 }}>
          <DetailBlock label="Service pattern" value={stops} />
        </Voltra.View>
      </Voltra.HStack>

      {notice ? (
        <Voltra.Text
          style={{
            color: colors.warning,
            fontSize: 12,
            lineHeight: 17,
          }}
        >
          {notice}
        </Voltra.Text>
      ) : null}
    </Voltra.VStack>
  );
}

function renderMediumWidget(state: DepartureWidgetState) {
  return (
    <Shell padding={18}>
      <Header updatedText={state.updatedText} />
      {state.kind === 'ready' ? (
        <MediumReadyState {...state} />
      ) : state.kind === 'loading' ? (
        <StateMessage title="Loading" message={state.message} />
      ) : (
        <StateMessage title={state.title} message={state.message} />
      )}
    </Shell>
  );
}

function renderLargeWidget(state: DepartureWidgetState) {
  return (
    <Shell padding={22}>
      <Header updatedText={state.updatedText} />
      {state.kind === 'ready' ? (
        <LargeReadyState {...state} />
      ) : state.kind === 'loading' ? (
        <StateMessage title="Loading" message={state.message} />
      ) : (
        <StateMessage title={state.title} message={state.message} />
      )}
    </Shell>
  );
}

export function createDepartureIosWidgetVariants(
  state: DepartureWidgetState,
): WidgetVariants {
  return {
    systemLarge: renderLargeWidget(state),
    systemMedium: renderMediumWidget(state),
  };
}

export default createDepartureIosWidgetVariants(initialDepartureWidgetState);
