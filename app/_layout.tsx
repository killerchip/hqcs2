// noinspection JSUnusedGlobalSymbols

import 'reflect-metadata';
import { Stack } from 'expo-router';
import { configure } from 'mobx';
import { RootSiblingParent } from 'react-native-root-siblings';

import { container } from '~config/ioc/AppIOC';
import { InjectionProvider } from '~config/ioc/injection.react';

configure({
  enforceActions: 'always',
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
});
export default function HomeLayout() {
  return (
    <InjectionProvider container={container}>
      <RootSiblingParent>
        <Stack />
      </RootSiblingParent>
    </InjectionProvider>
  );
}
