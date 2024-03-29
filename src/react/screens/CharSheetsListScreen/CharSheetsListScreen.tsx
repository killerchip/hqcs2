import { Stack } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { FlatList, ListRenderItem } from 'react-native';

import { createInjectableContext } from '~config/ioc/injection.react';
import { CharSheetsListScreenPresenter } from '~domains/charsheets/CharSheetsListScreen/CharSheetsListScreenPresenter';
import { CharSheetListItemVM } from '~domains/view.models';
import { CharSheetsListItem } from '~react/screens/CharSheetsListScreen/components/CharSheetsListItem';

export const {
  HoC: CharSheetListPresenterHoC,
  useHook: useCharSheetListPresenter,
} = createInjectableContext<CharSheetsListScreenPresenter>();

function CharSheetListScreenComponent() {
  const presenter = useCharSheetListPresenter();
  useEffect(() => {
    presenter.load().then();
  }, []);

  const renderItem: ListRenderItem<CharSheetListItemVM> = ({ item }) => (
    <CharSheetsListItem
      charSheet={item}
      onPress={() => presenter.goToCharSheetPage(item.id)}
    />
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Char Sheets' }} />
      <FlatList<CharSheetListItemVM>
        data={presenter.charSheetList}
        renderItem={renderItem}
      />
    </>
  );
}

export const CharSheetsListScreen = CharSheetListPresenterHoC(
  CharSheetsListScreenPresenter,
)(observer(CharSheetListScreenComponent));
