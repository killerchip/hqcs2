import { CharSheetDto, NewCharSheetDto } from '~gateways/dto.models';

export type CharSheet = CharSheetDto;
export type NewCharSheet = Omit<CharSheet, 'id'>;

export function isNewCharSheet(
  charSheet: NewCharSheetDto | CharSheetDto,
): charSheet is NewCharSheetDto {
  return (charSheet as CharSheetDto).id === undefined;
}

export function toCharSheet(dto: CharSheetDto): CharSheet {
  return dto as CharSheet;
}
