import { CharacterSheetDto } from '~gateways/dto.models';

let defaults: CharacterSheetDto[] | null = null;

export function getFactoryDefaultCharacterSheets(
  uuidGenerator: () => string,
): CharacterSheetDto[] {
  if (defaults) {
    return defaults;
  }

  defaults = [
    {
      id: uuidGenerator(),
      name: 'Conan',
      class: 'Barbarian',
      move: 2,
      attack: 2,
      defense: 2,
      bodyPoints: 10,
      mindPoints: 2,
    },
    {
      id: uuidGenerator(),
      name: 'Legolas',
      class: 'Elf',
      move: 2,
      attack: 2,
      defense: 2,
      bodyPoints: 7,
      mindPoints: 3,
    },
  ];

  return defaults;
}

export function resetFactoryDefaults() {
  defaults = null;
}
