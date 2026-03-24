import { Voltra } from 'voltra';

export default {
  systemLarge: (
    <Voltra.VStack
      spacing={12}
      style={{
        width: '100%',
        height: '100%',
        padding: 22,
        backgroundColor: '#133043',
        borderRadius: 28,
      }}
    >
      <Voltra.Text
        style={{
          color: '#fffdf7',
          fontSize: 18,
          fontWeight: '800',
        }}
      >
        Next departure
      </Voltra.Text>
      <Voltra.Text
        style={{
          color: '#c7d8e4',
          fontSize: 12,
        }}
      >
        Connecting to Convex...
      </Voltra.Text>
      <Voltra.Text
        style={{
          color: '#fffdf7',
          fontSize: 20,
          fontWeight: '800',
        }}
      >
        Loading
      </Voltra.Text>
      <Voltra.Text
        style={{
          color: '#c7d8e4',
          fontSize: 13,
          lineHeight: 18,
        }}
      >
        Loading the latest saved departure...
      </Voltra.Text>
    </Voltra.VStack>
  ),
  systemMedium: (
    <Voltra.VStack
      spacing={12}
      style={{
        width: '100%',
        height: '100%',
        padding: 18,
        backgroundColor: '#133043',
        borderRadius: 28,
      }}
    >
      <Voltra.Text
        style={{
          color: '#fffdf7',
          fontSize: 18,
          fontWeight: '800',
        }}
      >
        Next departure
      </Voltra.Text>
      <Voltra.Text
        style={{
          color: '#c7d8e4',
          fontSize: 12,
        }}
      >
        Connecting to Convex...
      </Voltra.Text>
      <Voltra.Text
        style={{
          color: '#fffdf7',
          fontSize: 20,
          fontWeight: '800',
        }}
      >
        Loading
      </Voltra.Text>
      <Voltra.Text
        style={{
          color: '#c7d8e4',
          fontSize: 13,
          lineHeight: 18,
        }}
      >
        Loading the latest saved departure...
      </Voltra.Text>
    </Voltra.VStack>
  ),
};
