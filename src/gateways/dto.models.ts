export type NewCharSheetDto = {
  image?: ContentImage;
  name: string;
  class: string;
  move: number;
  moveType: 'dice' | 'squares';
  attack: number;
  defense: number;
  bodyPoints: number;
  mindPoints: number;
  currentBodyPoints: number;
  weapons: string[];
  armors: string[];
  gold: number;
  items: string[];
  spells: null | string[];
};

export type CharSheetDto = NewCharSheetDto & { id: string };

export function isNewCharSheetDto(
  charSheet: NewCharSheetDto | CharSheetDto,
): charSheet is NewCharSheetDto {
  return (charSheet as CharSheetDto).id === undefined;
}

export type ContentImage =
  | 'BarbarianMale'
  | 'ElfFemale'
  | 'DwarfMale'
  | 'WizardMale';
