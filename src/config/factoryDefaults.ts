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
      name: 'Yagonan',
      class: 'Barbarian',
      move: 2,
      moveType: 'dice',
      attack: 3,
      defense: 2,
      bodyPoints: 8,
      currentBodyPoints: 8,
      mindPoints: 2,
      weapons: ['Broadsword'],
      armors: [],
      gold: 0,
      items: [],
      spells: null,
    },
    {
      id: uuidGenerator(),
      name: 'Legolily',
      class: 'Elf',
      move: 2,
      moveType: 'dice',
      attack: 2,
      defense: 2,
      bodyPoints: 6,
      currentBodyPoints: 6,
      mindPoints: 4,
      weapons: ['Shortsword'],
      armors: [],
      gold: 0,
      items: [],
      spells: [],
    },
    {
      id: uuidGenerator(),
      name: 'Thorlin',
      class: 'Dwarf',
      move: 2,
      moveType: 'dice',
      attack: 2,
      defense: 2,
      bodyPoints: 7,
      currentBodyPoints: 7,
      mindPoints: 3,
      weapons: ['Shortsword'],
      armors: [],
      gold: 0,
      items: [],
      spells: null,
    },
    {
      id: uuidGenerator(),
      name: 'Sarumon',
      class: 'Wizard',
      move: 2,
      moveType: 'dice',
      attack: 1,
      defense: 2,
      bodyPoints: 4,
      currentBodyPoints: 4,
      mindPoints: 6,
      weapons: ['Dagger'],
      armors: [],
      gold: 0,
      items: [],
      spells: [],
    },
  ];

  return defaults;
}

export function resetFactoryDefaults() {
  defaults = null;
}
