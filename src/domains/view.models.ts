import { CharSheet, CharSheetTemplate } from '~domains/data.models';

export type CharSheetListItemVM = {
  id: string;
  name: string;
  class: string;
  image?: CharSheet['image'];
};

export function getCharSheetListItemVM(
  charSheet: CharSheet,
): CharSheetListItemVM {
  return {
    id: charSheet.id,
    name: charSheet.name,
    class: charSheet.class,
    image: charSheet.image,
  };
}

export type CharSheetFormVM = CharSheet & { moveTypeString: string };

export function getCharSheetFormVM(charSheet: CharSheet): CharSheetFormVM {
  let moveTypeString: string = charSheet.moveType;
  if (charSheet.moveType === 'dice' && charSheet.move === 1) {
    moveTypeString = 'die';
  }

  if (charSheet.moveType === 'squares') {
    moveTypeString = charSheet.move === 1 ? 'square' : 'squares';
  }

  return { ...charSheet, moveTypeString } as CharSheetFormVM;
}

export type CharSheetTemplateListItemVM = {
  id: string;
  class: string;
  image?: CharSheetTemplate['image'];
};

export function getCharSheetTemplateListItemVM(
  charSheetTemplate: CharSheetTemplate,
): CharSheetTemplateListItemVM {
  return {
    id: charSheetTemplate.id,
    class: charSheetTemplate.class,
    image: charSheetTemplate.image,
  };
}
