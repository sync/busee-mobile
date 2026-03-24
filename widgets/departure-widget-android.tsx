import { VoltraAndroid } from 'voltra/android';
import type { AndroidWidgetVariants } from 'voltra/android/client';

import {
  initialDepartureWidgetState,
  type DepartureWidgetState,
} from './departure-widget-state';

const colors = {
  accent: '#ffb648',
  background: '#133043',
  muted: '#c7d8e4',
  primary: '#fffdf7',
  warning: '#f6d365',
};

function Header({ updatedText }: { updatedText: string }) {
  return (
    <VoltraAndroid.Column style={{ gap: 4 }}>
      <VoltraAndroid.Text
        style={{
          color: colors.primary,
          fontSize: 16,
          fontWeight: '800',
        }}
      >
        Next departure
      </VoltraAndroid.Text>
      <VoltraAndroid.Text
        style={{
          color: colors.muted,
          fontSize: 11,
        }}
      >
        {updatedText}
      </VoltraAndroid.Text>
    </VoltraAndroid.Column>
  );
}

function ReadyState({
  destination,
  notice,
  stops,
  time,
}: Extract<DepartureWidgetState, { kind: 'ready' }>) {
  return (
    <VoltraAndroid.Column style={{ gap: 10 }}>
      <VoltraAndroid.Row
        verticalAlignment="center-vertically"
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <VoltraAndroid.Column style={{ gap: 4 }}>
          <VoltraAndroid.Text
            style={{
              color: colors.muted,
              fontSize: 10,
              fontWeight: '700',
            }}
          >
            Due
          </VoltraAndroid.Text>
          <VoltraAndroid.Text
            style={{
              color: colors.primary,
              fontSize: 28,
              fontWeight: '900',
            }}
          >
            {time}
          </VoltraAndroid.Text>
        </VoltraAndroid.Column>
        <VoltraAndroid.Text
          style={{
            color: colors.accent,
            fontSize: 11,
            fontWeight: '800',
          }}
        >
          LIVE
        </VoltraAndroid.Text>
      </VoltraAndroid.Row>

      <VoltraAndroid.Text
        style={{
          color: colors.primary,
          fontSize: 13,
          fontWeight: '700',
          numberOfLines: 1,
        }}
      >
        {destination}
      </VoltraAndroid.Text>

      <VoltraAndroid.Text
        style={{
          color: colors.muted,
          fontSize: 11,
          numberOfLines: 1,
        }}
      >
        {stops}
      </VoltraAndroid.Text>

      {notice ? (
        <VoltraAndroid.Text
          style={{
            color: colors.warning,
            fontSize: 10,
            numberOfLines: 2,
          }}
        >
          {notice}
        </VoltraAndroid.Text>
      ) : null}
    </VoltraAndroid.Column>
  );
}

function StateMessage({ message, title }: { message: string; title: string }) {
  return (
    <VoltraAndroid.Column style={{ gap: 6 }}>
      <VoltraAndroid.Text
        style={{
          color: colors.primary,
          fontSize: 18,
          fontWeight: '800',
        }}
      >
        {title}
      </VoltraAndroid.Text>
      <VoltraAndroid.Text
        style={{
          color: colors.muted,
          fontSize: 12,
          numberOfLines: 3,
        }}
      >
        {message}
      </VoltraAndroid.Text>
    </VoltraAndroid.Column>
  );
}

function renderWideWidget(state: DepartureWidgetState) {
  return (
    <VoltraAndroid.Box
      style={{
        width: '100%',
        height: '100%',
        padding: 16,
        backgroundColor: colors.background,
        borderRadius: 28,
      }}
    >
      <VoltraAndroid.Column style={{ gap: 10 }}>
        <Header updatedText={state.updatedText} />
        {state.kind === 'ready' ? (
          <ReadyState {...state} />
        ) : state.kind === 'loading' ? (
          <StateMessage title="Loading" message={state.message} />
        ) : (
          <StateMessage title={state.title} message={state.message} />
        )}
      </VoltraAndroid.Column>
    </VoltraAndroid.Box>
  );
}

export function createDepartureAndroidWidgetVariants(
  state: DepartureWidgetState,
): AndroidWidgetVariants {
  return [
    {
      size: { width: 250, height: 110 },
      content: renderWideWidget(state),
    },
  ];
}

export default createDepartureAndroidWidgetVariants(
  initialDepartureWidgetState,
);
