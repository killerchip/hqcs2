import { CharacterSheet } from '~domains/data.models';

export type CharacterSheetListItemVM = {
  id: string;
  name: string;
  class: string;
};

export function getCharacterSheetListItemVM(
  characterSheet: CharacterSheet,
): CharacterSheetListItemVM {
  return {
    id: characterSheet.id,
    name: characterSheet.name,
    class: characterSheet.class,
  };
}
