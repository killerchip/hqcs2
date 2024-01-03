export type NewCharSheetDto = {
  name: string;
  class: string;
  move: number;
  moveType: 'dice' | 'squares';
  attack: number;
  defense: number;
  bodyPoints: number;
  mindPoints: number;
};

export type CharSheetDto = NewCharSheetDto & { id: string };

export function isNewCharSheetDto(
  charSheet: NewCharSheetDto | CharSheetDto,
): charSheet is NewCharSheetDto {
  return (charSheet as CharSheetDto).id === undefined;
}
