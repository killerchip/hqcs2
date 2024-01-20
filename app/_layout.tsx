// noinspection JSUnusedGlobalSymbols

import 'reflect-metadata';
import { Stack } from 'expo-router';
import { configure } from 'mobx';
import { RootSiblingParent } from 'react-native-root-siblings';

import { container } from '~config/ioc/AppIOC';
import { InjectionProvider } from '~config/ioc/injection.react';
import { useAppFonts } from '~react/common-styles';

configure({
  enforceActions: 'always',
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
});
export default function HomeLayout() {
  const fontsLoaded = useAppFonts();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <InjectionProvider container={container}>
      <RootSiblingParent>
        <Stack />
      </RootSiblingParent>
    </InjectionProvider>
  );
}
