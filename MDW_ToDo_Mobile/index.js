/* eslint-disable prettier/prettier */
/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Provider } from 'react-redux';
import store from './src/redux/store/store';
import { PaperProvider } from 'react-native-paper';
console.disableYellowBox = true;
import {
  MD3LightTheme as DefaultTheme,
  // PaperProvider,
} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
const theme = {
  ...DefaultTheme,
  // Specify custom property
  myOwnProperty: true,
  // Specify custom property in nested object
  colors: {
    ...DefaultTheme.colors,
    myOwnColor: '#BADA55',
  },

};
const RNRedux = () => (
    // <AntdProvider>


      <Provider store = { store }>
         <NavigationContainer


>

       <PaperProvider
       theme={theme}

       >

        <App />
       </PaperProvider>
</NavigationContainer>
      </Provider>


    )
    AppRegistry.registerComponent(appName, () => RNRedux);
