import { Stack, useLocalSearchParams } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useContext, useState } from 'react';
import { Text } from 'react-native';

import { Injectables } from '~config/ioc/injectables';
import { InversifyContext } from '~config/ioc/injection.react';
import {
  CharSheetScreenPresenter,
  CharSheetScreenPresenterFactory,
} from '~domains/charsheets/CharSheetScreen/CharSheetScreenPresenter';

export const CharSheetScreen = observer(function CharSheetScreen() {
  // TODO: strongly type params
  const params = useLocalSearchParams<{ id: string }>() as { id: string };
  const { container } = useContext(InversifyContext);
  const [presenter] = useState<CharSheetScreenPresenter>(() =>
    container!.get<CharSheetScreenPresenterFactory>(
      Injectables.CharSheetScreenPresenterFactory,
    )(params.id),
  );

  // TODO: display something if presenter.viewData is undefined
  // TODO: handle loading state

  return (
    <>
      <Stack.Screen
        options={{
          title: presenter.viewData?.name,
          headerBackTitleVisible: false,
        }}
      />
      <Text>{JSON.stringify(presenter.viewData)}</Text>
    </>
  );
});
