import { VoltraAndroid } from 'voltra/android';

export default [
  {
    size: { width: 250, height: 110 },
    content: (
      <VoltraAndroid.Box
        style={{
          width: '100%',
          height: '100%',
          padding: 16,
          backgroundColor: '#133043',
          borderRadius: 28,
        }}
      >
        <VoltraAndroid.Column style={{ gap: 10 }}>
          <VoltraAndroid.Text
            style={{
              color: '#fffdf7',
              fontSize: 16,
              fontWeight: '800',
            }}
          >
            Next departure
          </VoltraAndroid.Text>
          <VoltraAndroid.Text
            style={{
              color: '#c7d8e4',
              fontSize: 11,
            }}
          >
            Connecting to Convex...
          </VoltraAndroid.Text>
          <VoltraAndroid.Text
            style={{
              color: '#fffdf7',
              fontSize: 18,
              fontWeight: '800',
            }}
          >
            Loading
          </VoltraAndroid.Text>
          <VoltraAndroid.Text
            style={{
              color: '#c7d8e4',
              fontSize: 12,
              numberOfLines: 2,
            }}
          >
            Loading the latest saved departure...
          </VoltraAndroid.Text>
        </VoltraAndroid.Column>
      </VoltraAndroid.Box>
    ),
  },
];
