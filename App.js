import React, { useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './StackNavigator';
import {prevScreensCon} from './globalState/PrevScreenContext';

const App = () => {
  const [prevScreens, setPrevScreens] = useState([]);
  return (
    <prevScreensCon.Provider value={{prevScreens, setPrevScreens}}>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </prevScreensCon.Provider>
  );
};
export default App;
