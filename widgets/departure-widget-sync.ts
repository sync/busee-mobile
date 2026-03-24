import { Platform } from 'react-native';

import { createDepartureAndroidWidgetVariants } from './departure-widget-android';
import { createDepartureIosWidgetVariants } from './departure-widget-ios';
import {
  DEPARTURE_WIDGET_ID,
  type DepartureWidgetState,
} from './departure-widget-state';

let widgetSyncSupported: boolean | null = null;

function reportUnavailableRuntime(error: unknown) {
  if (widgetSyncSupported === false) {
    return;
  }

  widgetSyncSupported = false;

  if (__DEV__) {
    const message =
      error instanceof Error ? error.message : 'Unknown Voltra widget error';

    console.warn(
      `Voltra widget sync is unavailable in this build. Use a native build or Expo dev client after running prebuild. (${message})`,
    );
  }
}

export async function syncDepartureWidgets(state: DepartureWidgetState) {
  if (widgetSyncSupported === false) {
    return;
  }

  if (Platform.OS === 'ios') {
    try {
      const { updateWidget } = await import('voltra/client');

      await updateWidget(
        DEPARTURE_WIDGET_ID,
        createDepartureIosWidgetVariants(state),
      );

      widgetSyncSupported = true;
    } catch (error) {
      reportUnavailableRuntime(error);
    }

    return;
  }

  if (Platform.OS === 'android') {
    try {
      const { updateAndroidWidget } = await import('voltra/android/client');

      await updateAndroidWidget(
        DEPARTURE_WIDGET_ID,
        createDepartureAndroidWidgetVariants(state),
      );

      widgetSyncSupported = true;
    } catch (error) {
      reportUnavailableRuntime(error);
    }
  }
}
