import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { router } from 'expo-router';
import Toast from 'react-native-root-toast';

import { BaseIOC } from './BaseIOC';
import { Injectables } from './injectables';

export const container = new BaseIOC().buildBaseTemplate();

container
  .bind<typeof AsyncStorage>(Injectables.AsyncStorage)
  .toConstantValue(AsyncStorage);
container.bind(Injectables.GetUuid).toConstantValue(Crypto.randomUUID);
container.bind(Injectables.Router).toConstantValue(router);
container.bind(Injectables.Toast).toConstantValue(Toast);
