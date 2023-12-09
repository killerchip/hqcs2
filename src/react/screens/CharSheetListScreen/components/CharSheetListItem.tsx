import { Link } from 'expo-router';
import { Text, StyleSheet, Pressable } from 'react-native';

import { CharacterSheetListItemVM } from '~domains/view.models';

type Props = {
  charSheet: CharacterSheetListItemVM;
};
export function CharSheetListItem({ charSheet }: Props) {
  return (
    <Link
      href={{ pathname: '/charsheets/[id]', params: { id: charSheet.id } }}
      style={styles.wrapper}
      asChild
    >
      <Pressable>
        <Text key={charSheet.id}>
          {charSheet.name} - {charSheet.class}
        </Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 10,
  },
});
