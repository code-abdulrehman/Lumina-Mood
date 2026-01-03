import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { MoodProvider } from './src/context/MoodContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { APP_ROUTES } from './src/navigation/routes';
import {
  useFonts,
  NunitoSans_400Regular,
  NunitoSans_600SemiBold,
  NunitoSans_700Bold,
  NunitoSans_800ExtraBold,
  NunitoSans_900Black
} from '@expo-google-fonts/nunito-sans';
import { Text, TextInput, View, ActivityIndicator } from 'react-native';

// Deep linking configuration
const linking = {
  prefixes: ['luminamood://', 'https://luminamood.app'],
  config: {
    screens: {
      Onboarding: 'onboarding',
      Main: {
        path: '',
        screens: Object.fromEntries(
          APP_ROUTES.map(route => [route.name, route.path])
        ),
      },
    },
  },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    NunitoSans_400Regular,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
    NunitoSans_800ExtraBold,
    NunitoSans_900Black,
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Set default font family for Text
      const TextWithDefault = Text as any;
      const oldTextRender = TextWithDefault.render;
      TextWithDefault.defaultProps = TextWithDefault.defaultProps || {};
      TextWithDefault.defaultProps.style = [{ fontFamily: 'NunitoSans_400Regular' }, TextWithDefault.defaultProps.style];

      // Set default font family for TextInput
      const TextInputWithDefault = TextInput as any;
      TextInputWithDefault.defaultProps = TextInputWithDefault.defaultProps || {};
      TextInputWithDefault.defaultProps.style = [{ fontFamily: 'NunitoSans_400Regular' }, TextInputWithDefault.defaultProps.style];
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <MoodProvider>
        <NavigationContainer linking={linking}>
          <RootNavigator />
          <StatusBar style="dark" />
        </NavigationContainer>
      </MoodProvider>
    </SafeAreaProvider>
  );
}
