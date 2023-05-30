import React, { useEffect } from 'react';
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';

//ekranlar
import Anasayfa from './views/Anasayfa';
import Siparis from './views/Siparis';
import Takip from './views/Takip';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="anasayfa"
        screenOptions={{
          headerShown: false, 
          gestureEnabled: false,
          ...TransitionPresets.ModalTransition, 
        }}>
          <Stack.Screen name="anasayfa" component={Anasayfa} />
          <Stack.Screen name="siparis" component={Siparis} />
          <Stack.Screen name="takip" component={Takip} />
        </Stack.Navigator>

      </NavigationContainer>
    </NativeBaseProvider>
  );
}

