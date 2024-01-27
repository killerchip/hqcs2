import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CharSheetListItemVM } from '~domains/view.models';
import { Texturina } from '~react/common-styles';
import { Images } from '~react/images';
import { blurhash } from '~react/screens/CharSheetsListScreen/components/Blurhash';

type Props = {
  charSheet: CharSheetListItemVM;
  onPress?: () => void;
};

export function CharSheetsListItem({ charSheet, onPress }: Props) {
  const source = charSheet.image ? Images[charSheet.image] : blurhash;
  return (
    <Pressable onPress={onPress} key={charSheet.id}>
      <View style={styles.wrapper}>
        <Image
          source={source}
          style={styles.imageStyle}
          placeholder={blurhash}
        />
        <View style={styles.textPartWrapper}>
          <Text style={styles.name}>{charSheet.name}</Text>
          <Text style={styles.class}>{charSheet.class}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageStyle: { width: 80, height: 80 },
  name: {
    fontSize: 16,
    fontFamily: Texturina.Texturina_400Regular,
  },
  class: {
    fontSize: 20,
    fontFamily: Texturina.Texturina_400Regular,
  },
  textPartWrapper: {
    marginLeft: 8,
  },
});
