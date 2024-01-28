import {
  CharSheetDto,
  isNewCharSheetDto,
  NewCharSheetDto,
} from '~gateways/dto.models';

describe('DTO models', () => {
  describe('isNewCharSheetDto', () => {
    it('should return true when a CharSheet is new', () => {
      const charSheet: NewCharSheetDto = {
        name: 'name',
        class: 'class',
        move: 1,
        attack: 2,
        defense: 3,
        bodyPoints: 4,
        mindPoints: 5,
        moveType: 'dice',
        currentBodyPoints: 4,
        weapons: [],
        armors: [],
        gold: 0,
        items: [],
        spells: null,
      };
      expect(isNewCharSheetDto(charSheet)).toBe(true);
    });

    it('should return false if its an existing CharSheet', () => {
      const charSheet: CharSheetDto = {
        id: 'id',
        name: 'name',
        class: 'class',
        move: 1,
        attack: 2,
        defense: 3,
        bodyPoints: 4,
        mindPoints: 5,
        moveType: 'dice',
        currentBodyPoints: 4,
        weapons: [],
        armors: [],
        gold: 0,
        items: [],
        spells: null,
      };

      expect(isNewCharSheetDto(charSheet)).toBe(false);
    });
  });
});
