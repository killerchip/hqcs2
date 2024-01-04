import { Stack } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { Text, TextInput, StyleSheet, View } from 'react-native';

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

  const weaponsString =
    viewData.weapons.length === 0 ? 'None' : viewData.weapons.join(', ');

  const armorsString =
    viewData.armors.length === 0 ? 'None' : viewData.armors.join(', ');

  const itemsString =
    viewData.items.length === 0 ? 'None' : viewData.items.join(', ');

  const spellsString =
    viewData.spells?.length === 0 ? 'None' : viewData.spells?.join(', ');

  return (
    <>
      <Stack.Screen
        options={{
          title: viewData.name,
          headerBackTitleVisible: false,
        }}
      />
      <View style={styles.wrapper}>
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
          value={`${viewData.move} ${viewData.moveTypeString}`}
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
        <Text>Weapon</Text>
        <TextInput
          style={styles.textInput}
          value={weaponsString}
          editable={false}
        />
        <Text>Armor</Text>
        <TextInput
          style={styles.textInput}
          value={armorsString}
          editable={false}
        />
        <Text>Current Body Points</Text>
        <TextInput
          style={styles.textInput}
          value={viewData.currentBodyPoints.toString()}
          editable={false}
        />
        <Text>Gold</Text>
        <TextInput
          style={styles.textInput}
          value={viewData.gold.toString()}
          editable={false}
        />
        <Text>Items</Text>
        <TextInput
          style={styles.textInput}
          value={itemsString}
          editable={false}
        />
        {viewData.spells && (
          <>
            <Text>Spells</Text>
            <TextInput
              style={styles.textInput}
              value={spellsString}
              editable={false}
            />
          </>
        )}
      </View>
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
  wrapper: {
    padding: 10,
  },
  textInput: {
    backgroundColor: 'white',
    marginBottom: 10,
  },
});
