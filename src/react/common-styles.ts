import { CaesarDressing_400Regular } from '@expo-google-fonts/caesar-dressing';
import {
  Caudex_400Regular,
  Caudex_400Regular_Italic,
  Caudex_700Bold,
  Caudex_700Bold_Italic,
  useFonts,
} from '@expo-google-fonts/caudex';
import {
  Texturina_100Thin,
  Texturina_100Thin_Italic,
  Texturina_200ExtraLight,
  Texturina_200ExtraLight_Italic,
  Texturina_300Light,
  Texturina_300Light_Italic,
  Texturina_400Regular,
  Texturina_400Regular_Italic,
  Texturina_500Medium,
  Texturina_500Medium_Italic,
  Texturina_600SemiBold,
  Texturina_600SemiBold_Italic,
  Texturina_700Bold,
  Texturina_700Bold_Italic,
  Texturina_800ExtraBold,
  Texturina_800ExtraBold_Italic,
  Texturina_900Black,
  Texturina_900Black_Italic,
} from '@expo-google-fonts/texturina';

export const enum Texturina {
  Texturina_100Thin = 'Texturina_100Thin',
  Texturina_100Thin_Italic = 'Texturina_100Thin_Italic',
  Texturina_200ExtraLight = 'Texturina_200ExtraLight',
  Texturina_200ExtraLight_Italic = 'Texturina_200ExtraLight_Italic',
  Texturina_300Light = 'Texturina_300Light',
  Texturina_300Light_Italic = 'Texturina_300Light_Italic',
  Texturina_400Regular = 'Texturina_400Regular',
  Texturina_400Regular_Italic = 'Texturina_400Regular_Italic',
  Texturina_500Medium = 'Texturina_500Medium',
  Texturina_500Medium_Italic = 'Texturina_500Medium_Italic',
  Texturina_600SemiBold = 'Texturina_600SemiBold',
  Texturina_600SemiBold_Italic = 'Texturina_600SemiBold_Italic',
  Texturina_700Bold = 'Texturina_700Bold',
  Texturina_700Bold_Italic = 'Texturina_700Bold_Italic',
  Texturina_800ExtraBold = 'Texturina_800ExtraBold',
  Texturina_800ExtraBold_Italic = 'Texturina_800ExtraBold_Italic',
  Texturina_900Black = 'Texturina_900Black',
  Texturina_900Black_Italic = 'Texturina_900Black_Italic',
}

export const enum Caudex {
  Regular = 'Caudex_400Regular',
  RegularItalic = 'Caudex_400Regular_Italic',
  Bold = 'Caudex_700Bold',
  BoldItalic = 'Caudex_700Bold_Italic',
}

export const enum CaesarDressing {
  Regular = 'CaesarDressing_400Regular',
}

export function useAppFonts() {
  const [fontsLoaded] = useFonts({
    Caudex_400Regular,
    Caudex_400Regular_Italic,
    Caudex_700Bold,
    Caudex_700Bold_Italic,
    CaesarDressing_400Regular,
    Texturina_100Thin,
    Texturina_100Thin_Italic,
    Texturina_200ExtraLight,
    Texturina_200ExtraLight_Italic,
    Texturina_300Light,
    Texturina_300Light_Italic,
    Texturina_400Regular,
    Texturina_400Regular_Italic,
    Texturina_500Medium,
    Texturina_500Medium_Italic,
    Texturina_600SemiBold,
    Texturina_600SemiBold_Italic,
    Texturina_700Bold,
    Texturina_700Bold_Italic,
    Texturina_800ExtraBold,
    Texturina_800ExtraBold_Italic,
    Texturina_900Black,
    Texturina_900Black_Italic,
  });

  return fontsLoaded;
}
