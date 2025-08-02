import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import Splash from './src/screen/splash';
import Login from './src/screen/login/Login';
import Register from './src/screen/login/Register';
import TabNavigator from './src/navigation/TabNavigator';
import ChestBackWorkout from './src/screen/workouts/ChestBackWorkout';
import ArmsWorkout from './src/screen/workouts/armsWorkout';
import LegsWorkout from './src/screen/workouts/legsWorkout';
import PlankChallenge from './src/screen/challenges/PlankChallenge';
import CyclingChallenge from './src/screen/challenges/CyclingChallenge';
import SwimChallenge from './src/screen/challenges/SwimChallenge';
import ForgotPassword from './src/screen/login/ForgotPassword';
import KetoDiet from './src/screen/diets/KetoDiet';
import SprintChallenge from './src/screen/challenges/SprintChallange';
import ShouldersWorkout from './src/screen/workouts/shouldersWorkout';
import AtkinsDiet from './src/screen/diets/AtkinsDiet';
import IntermittentFastingDiet from './src/screen/diets/IntermittentFastingDiet';
import HighProteinDiet from './src/screen/diets/HighProteinDiet';
import MediterraneanDiet from './src/screen/diets/MediterraneanDiet';
import VeganDiet from './src/screen/diets/VeganDiet';
import VegetarianDiet from './src/screen/diets/VegetarianDiet';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#1a1a1a' }
        }}
      >
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen 
          name="MainApp" 
          component={TabNavigator} 
          options={{ 
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="ChestBackWorkout" component={ChestBackWorkout} />
        <Stack.Screen name="ArmsWorkout" component={ArmsWorkout} />
        <Stack.Screen name="LegsWorkout" component={LegsWorkout} />
        <Stack.Screen name="PlankChallenge" component={PlankChallenge} />
        <Stack.Screen name="CyclingChallenge" component={CyclingChallenge} />
        <Stack.Screen name="SwimChallenge" component={SwimChallenge}/>
        <Stack.Screen name="SprintChallenge" component={SprintChallenge} />
        <Stack.Screen name="KetoDiet" component={KetoDiet} />
        <Stack.Screen name="ShouldersWorkout" component={ShouldersWorkout}/>
        <Stack.Screen name="AtkinsDiet" component={AtkinsDiet} />
        <Stack.Screen name="IntermittentFastingDiet" component={IntermittentFastingDiet} />
        <Stack.Screen name="HighProteinDiet" component={HighProteinDiet} />
        <Stack.Screen name="MediterraneanDiet" component={MediterraneanDiet} />
        <Stack.Screen name="VeganDiet" component={VeganDiet} />
        <Stack.Screen name="VegetarianDiet" component={VegetarianDiet} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
