import React from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';

import { CharacterSheetListItemVM } from '~domains/view.models';

type Props = {
  charSheet: CharacterSheetListItemVM;
  onPress?: () => void;
};
export function CharSheetListItem({ charSheet, onPress }: Props) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.wrapper}>
        <Text key={charSheet.id}>
          {charSheet.name} - {charSheet.class}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 10,
  },
});
