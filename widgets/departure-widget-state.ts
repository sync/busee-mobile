export const DEPARTURE_WIDGET_ID = 'next_departure';

export type DepartureWidgetState =
  | {
      kind: 'loading';
      updatedText: string;
      message: string;
    }
  | {
      kind: 'error';
      updatedText: string;
      title: string;
      message: string;
    }
  | {
      kind: 'empty';
      updatedText: string;
      title: string;
      message: string;
    }
  | {
      kind: 'ready';
      updatedText: string;
      time: string;
      destination: string;
      stops: string;
      notice?: string;
    };

export const initialDepartureWidgetState: DepartureWidgetState = {
  kind: 'loading',
  updatedText: 'Connecting to Convex...',
  message: 'Loading the latest saved departure...',
};
