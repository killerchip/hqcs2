import { Stack } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { Text } from 'react-native';

import { Injectables } from '~config/ioc/injectables';
import { createScreenPresenterContext } from '~config/ioc/injection.react';
import {
  CharSheetScreenPresenter,
  CharSheetScreenPresenterFactory,
} from '~domains/charsheets/CharSheetScreen/CharSheetScreenPresenter';

export const CharSheetScreenComponent = observer(
  function CharSheetScreenComponent() {
    // TODO: strongly type params
    const { viewData } = useCharSheetScreenPresenter();

    // TODO: display something if presenter.viewData is undefined
    // TODO: handle loading state

    return (
      <>
        <Stack.Screen
          options={{
            title: viewData?.name,
            headerBackTitleVisible: false,
          }}
        />
        <Text>{JSON.stringify(viewData)}</Text>
      </>
    );
  },
);

export const {
  HoC: CharSheetScreenPresenterHoC,
  useHook: useCharSheetScreenPresenter,
} = createScreenPresenterContext<
  CharSheetScreenPresenter,
  object,
  { id: string }
>((params, container) =>
  container.get<CharSheetScreenPresenterFactory>(
    Injectables.CharSheetScreenPresenterFactory,
  )(params.id),
);

export const CharSheetScreen = CharSheetScreenPresenterHoC()(
  CharSheetScreenComponent,
);
