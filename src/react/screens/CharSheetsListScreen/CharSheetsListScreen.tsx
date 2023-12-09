import { Stack } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { FlatList, ListRenderItem } from 'react-native';

import { withInjections } from '~config/ioc/injection.react';
import { CharSheetsListScreenPresenter } from '~domains/charsheets/CharSheetsListScreen/CharSheetsListScreenPresenter';
import { CharSheetListItemVM } from '~domains/view.models';
import { CharSheetsListItem } from '~react/screens/CharSheetsListScreen/components/CharSheetsListItem';

type Props = {
  presenter: CharSheetsListScreenPresenter;
};
function CharSheetListScreenComponent({ presenter }: Props) {
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
export const CharSheetsListScreen = withInjections<Props>({
  presenter: CharSheetsListScreenPresenter,
})(observer(CharSheetListScreenComponent));
