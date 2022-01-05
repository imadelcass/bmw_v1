import React from 'react';
import tw from 'tailwind-rn';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ListScreen from './screens/ListScreen';
import SerieScreen from './screens/SerieScreen';
import ModelScreen from './screens/ModelScreen';
import IndexScreen from './screens/IndexScreen';
import PdfScreen from './screens/PdfScreen';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Navbar from './components/Navbar';

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

function ShowTab() {
  return (
    <>
      <Navbar />
      <Tab.Navigator backBehavior="history" screenOptions={{lazy: true}}>
        <Tab.Screen
          name="Serie"
          component={SerieScreen}
          options={{title: 'Series'}}
        />
        <Tab.Screen
          name="Model"
          component={ModelScreen}
          options={{title: 'models'}}
        />
        <Tab.Screen
          name="Index"
          component={IndexScreen}
          options={{title: 'Index'}}
        />
        <Tab.Screen
          name="List"
          component={ListScreen}
          options={{title: 'List'}}
        />
      </Tab.Navigator>
    </>
  );
}
const StackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        lazy: true,
        headerShown: false,
      }}>
      <Stack.Screen name="ShowTab" component={ShowTab} />
      <Stack.Screen name="Pdf" component={PdfScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;

