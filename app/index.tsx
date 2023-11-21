import { Link, Stack } from 'expo-router';
import { Text } from 'react-native';
export default function HomePage() {
  return (
    <>
      <Stack.Screen options={{ title: 'Character Sheets' }} />
      <Text>Hello world</Text>
      <Link href={{ pathname: '/charsheets/[id]', params: { id: 'abc123' } }}>
        <Text>Character Sheets</Text>
      </Link>
    </>
  );
}
