// noinspection JSUnusedGlobalSymbols

import { Stack } from 'expo-router';
import { configure } from 'mobx';

configure({
  enforceActions: 'always',
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
});
export default function HomeLayout() {
  return <Stack />;
}
