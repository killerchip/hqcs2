import { Stack } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { FlatList, ListRenderItem } from 'react-native';

import { createInjectableContext } from '~config/ioc/injection.react';
import { CharSheetTemplatesListPresenter } from '~domains/charsheet-templates/CharSheetTemplatesList/CharSheetTemplatesListPresenter';
import {
  CharSheetListItemVM,
  CharSheetTemplateListItemVM,
} from '~domains/view.models';
import { CharSheetTemplatesListItem } from '~react/screens/CharSheetTemplatesListScreen/CharSheetTemplatesListItem';

export const {
  HoC: CharSheetTemplatesListPresenterHoC,
  useHook: useCharSheetTemplatesListPresenter,
} = createInjectableContext<CharSheetTemplatesListPresenter>();

function CharSheetTemplatesListScreenComponent() {
  const presenter = useCharSheetTemplatesListPresenter();

  const renderItem: ListRenderItem<CharSheetTemplateListItemVM> = ({
    item,
  }) => <CharSheetTemplatesListItem template={item} />;

  return (
    <>
      <Stack.Screen options={{ title: 'Character Templates' }} />
      <FlatList<CharSheetTemplateListItemVM>
        data={presenter?.list}
        renderItem={renderItem}
      />
    </>
  );
}

export const CharSheetsListScreen = CharSheetTemplatesListPresenterHoC(
  CharSheetTemplatesListPresenter,
)(observer(CharSheetTemplatesListScreenComponent));
