import { Link, Stack } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Text } from 'react-native';

import { withInjections } from '~config/ioc/injection.react';
import { CharacterSheetsListScreenPresenter } from '~domains/character-sheets/CharacterSheetsListScreen/CharacterSheetsListScreenPresenter';

type Props = {
  presenter: CharacterSheetsListScreenPresenter;
};
function CharSheetListScreenComponent({ presenter }: Props) {
  useEffect(() => {
    presenter.load().then();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'Character Sheets' }} />
      {presenter.viewModel.map((sheet) => (
        <Text key={sheet.id}>
          {sheet.name} - {sheet.class}
        </Text>
      ))}
      <Link href={{ pathname: '/charsheets/[id]', params: { id: 'abc123' } }}>
        <Text>Character Sheets</Text>
      </Link>
    </>
  );
}
export const CharSheetListScreen = withInjections<Props>({
  presenter: CharacterSheetsListScreenPresenter,
})(observer(CharSheetListScreenComponent));
