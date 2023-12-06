import { CharacterSheetDto, NewCharacterSheetDto } from '~gateways/dto.models';

export type CharacterSheet = CharacterSheetDto;
export type NewCharacterSheet = Omit<CharacterSheet, 'id'>;

export function isNewCharSheet(
  charSheet: NewCharacterSheetDto | CharacterSheetDto,
): charSheet is NewCharacterSheetDto {
  return (charSheet as CharacterSheetDto).id === undefined;
}

export function toCharacterSheet(dto: CharacterSheetDto): CharacterSheet {
  return dto as CharacterSheet;
}
