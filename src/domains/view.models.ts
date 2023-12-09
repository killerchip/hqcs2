import { CharSheet } from '~domains/data.models';

export type CharSheetListItemVM = {
  id: string;
  name: string;
  class: string;
};

export function getCharSheetListItemVM(
  charSheet: CharSheet,
): CharSheetListItemVM {
  return {
    id: charSheet.id,
    name: charSheet.name,
    class: charSheet.class,
  };
}
