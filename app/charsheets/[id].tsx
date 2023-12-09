import { Stack, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

export default function CharSheetPage() {
  const params = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <Stack.Screen options={{ title: params.id }} />
      <Text>{JSON.stringify(params)}</Text>
    </>
  );
}
