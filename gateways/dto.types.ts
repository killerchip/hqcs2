export type NewCharacterSheetDto = {
  name: string;
  class: string;
  move: number;
  attack: number;
  defense: number;
  bodyPoints: number;
  mindPoints: number;
};

export type CharacterSheetDto = NewCharacterSheetDto & { id: string };

export function isNewCharSheetDto(
  charSheet: NewCharacterSheetDto | CharacterSheetDto,
): charSheet is NewCharacterSheetDto {
  return (charSheet as CharacterSheetDto).id === undefined;
}
