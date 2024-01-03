import { Stack } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { Text, TextInput, StyleSheet } from 'react-native';

import { Injectables } from '~config/ioc/injectables';
import { createScreenPresenterContext } from '~config/ioc/injection.react';
import {
  CharSheetScreenPresenter,
  CharSheetScreenPresenterFactory,
} from '~domains/charsheets/CharSheetScreen/CharSheetScreenPresenter';

function CharSheetScreenComponent() {
  const { viewData } = useCharSheetScreenPresenter();

  // TODO: display something if presenter.viewData is undefined
  // TODO: handle loading state

  if (!viewData) return null;

  return (
    <>
      <Stack.Screen
        options={{
          title: viewData.name,
          headerBackTitleVisible: false,
        }}
      />
      <Text>Name</Text>
      <TextInput
        style={styles.textInput}
        value={viewData.name}
        editable={false}
      />
      <Text>Class</Text>
      <TextInput
        style={styles.textInput}
        value={viewData.class}
        editable={false}
      />
      <Text>Movement</Text>
      <TextInput
        style={styles.textInput}
        value={viewData.move.toString()}
        editable={false}
      />
      <Text>Attack</Text>
      <TextInput
        style={styles.textInput}
        value={viewData.attack.toString()}
        editable={false}
      />
      <Text>Defense</Text>
      <TextInput
        style={styles.textInput}
        value={viewData.defense.toString()}
        editable={false}
      />

      <Text>Body Points</Text>
      <TextInput
        style={styles.textInput}
        value={viewData.bodyPoints.toString()}
        editable={false}
      />
      <Text>Mind Points</Text>
      <TextInput
        style={styles.textInput}
        value={viewData.mindPoints.toString()}
        editable={false}
      />
    </>
  );
}

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
  observer(CharSheetScreenComponent),
);

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: 'white',
    marginBottom: 10,
  },
});
