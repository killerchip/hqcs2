import { Stack } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { FlatList, ListRenderItem } from 'react-native';

import { withInjections } from '~config/ioc/injection.react';
import { CharacterSheetsListScreenPresenter } from '~domains/character-sheets/CharacterSheetsListScreen/CharacterSheetsListScreenPresenter';
import { CharacterSheetListItemVM } from '~domains/view.models';
import { CharSheetListItem } from '~react/screens/CharSheetListScreen/components/CharSheetListItem';

type Props = {
  presenter: CharacterSheetsListScreenPresenter;
};
function CharSheetListScreenComponent({ presenter }: Props) {
  useEffect(() => {
    presenter.load().then();
  }, []);

  const renderItem: ListRenderItem<CharacterSheetListItemVM> = ({ item }) => (
    <CharSheetListItem
      charSheet={item}
      onPress={() => presenter.goToCharSheetPage(item.id)}
    />
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Character Sheets' }} />
      <FlatList<CharacterSheetListItemVM>
        data={presenter.charSheetList}
        renderItem={renderItem}
      />
    </>
  );
}
export const CharSheetListScreen = withInjections<Props>({
  presenter: CharacterSheetsListScreenPresenter,
})(observer(CharSheetListScreenComponent));
