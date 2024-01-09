import { Stack } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { Text, TextInput, StyleSheet, ScrollView } from 'react-native';

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
      <ScrollView style={styles.wrapper}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.textInput}
          value={viewData.name}
          editable={false}
        />
        <Text style={styles.label}>Class</Text>
        <TextInput
          style={styles.textInput}
          value={viewData.class}
          editable={false}
        />
        <Text style={styles.label}>Movement</Text>
        <TextInput
          style={styles.textInput}
          value={`${viewData.move} ${viewData.moveTypeString}`}
          editable={false}
        />
        <Text style={styles.label}>Attack</Text>
        <TextInput
          style={styles.textInput}
          value={viewData.attack.toString()}
          editable={false}
        />
        <Text style={styles.label}>Defense</Text>
        <TextInput
          style={styles.textInput}
          value={viewData.defense.toString()}
          editable={false}
        />
        <Text style={styles.label}>Body Points</Text>
        <TextInput
          style={styles.textInput}
          value={viewData.bodyPoints.toString()}
          editable={false}
        />
        <Text style={styles.label}>Mind Points</Text>
        <TextInput
          style={styles.textInput}
          value={viewData.mindPoints.toString()}
          editable={false}
        />
        <Text style={styles.label}>Weapon</Text>
        <TextInput
          style={styles.textInput}
          value={weaponsString}
          editable={false}
        />
        <Text style={styles.label}>Armor</Text>
        <TextInput
          style={styles.textInput}
          value={armorsString}
          editable={false}
        />
        <Text style={styles.label}>Current Body Points</Text>
        <TextInput
          style={styles.textInput}
          value={viewData.currentBodyPoints.toString()}
          editable={false}
        />
        <Text style={styles.label}>Gold</Text>
        <TextInput
          style={styles.textInput}
          value={viewData.gold.toString()}
          editable={false}
        />
        <Text style={styles.label}>Items</Text>
        <TextInput
          style={styles.textInput}
          value={itemsString}
          editable={false}
        />
        {viewData.spells && (
          <>
            <Text style={styles.label}>Spells</Text>
            <TextInput
              style={styles.textInput}
              value={spellsString}
              editable={false}
            />
          </>
        )}
      </ScrollView>
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
    fontFamily: 'texturina',
    fontWeight: '700',
  },
  label: {
    fontFamily: 'antiqua400',
  },
});
