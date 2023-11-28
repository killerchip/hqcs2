import { CharacterSheetDto, NewCharacterSheetDto } from '../gateways/dto.types';

export type CharacterSheet = CharacterSheetDto;
export type NewCharacterSheet = Omit<CharacterSheet, 'id'>;

export function isNewCharSheet(
  charSheet: NewCharacterSheetDto | CharacterSheetDto,
): charSheet is NewCharacterSheetDto {
  return (charSheet as CharacterSheetDto).id === undefined;
}
