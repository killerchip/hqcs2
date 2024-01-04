export const Injectables = {
  AsyncStorage: Symbol.for('AsyncStorage'),
  GetUuid: Symbol.for('GetUuid'),
  Router: Symbol.for('Router'),
  Toast: Symbol.for('Toast'),

  // Factories
  CharSheetScreenPresenterFactory: Symbol.for(
    'CharSheetScreenPresenterFactory',
  ),
  CharSheetScreenPresenterFactoryArgs: Symbol.for(
    'CharSheetScreenPresenterFactoryArgs',
  ),
};
