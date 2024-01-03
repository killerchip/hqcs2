import { CharSheetDto } from '~gateways/dto.models';

let defaults: CharSheetDto[] | null = null;

export function getFactoryDefaultCharSheets(
  uuidGenerator: () => string,
): CharSheetDto[] {
  if (defaults) {
    return defaults;
  }

  defaults = [
    {
      id: uuidGenerator(),
      name: 'Conan',
      class: 'Barbarian',
      move: 2,
      moveType: 'dice',
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
      moveType: 'dice',
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
