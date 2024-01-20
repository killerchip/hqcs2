import React from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';

import { CharSheetListItemVM } from '~domains/view.models';
import { Texturina } from '~react/common-styles';

type Props = {
  charSheet: CharSheetListItemVM;
  onPress?: () => void;
};
export function CharSheetsListItem({ charSheet, onPress }: Props) {
  return (
    <Pressable onPress={onPress} key={charSheet.id}>
      <View style={styles.wrapper}>
        <Text style={styles.name}>{charSheet.name}</Text>
        <Text style={styles.class}>{charSheet.class}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 10,
  },
  name: {
    fontSize: 16,
    fontFamily: Texturina.Texturina_400Regular,
  },
  class: {
    fontSize: 20,
    fontFamily: Texturina.Texturina_400Regular,
  },
});
