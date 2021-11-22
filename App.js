//libraries
import React, { useEffect } from 'react';
import {  ActivityIndicator, Alert } from 'react-native';
import { 
  NavigationContainer, 
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { 
  Provider as PaperProvider, 
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme 
} from 'react-native-paper';

//screens

import HomeScreen from './src/components/HomeScreen';
import StackScreen from './src/components/StackScreen';
import MainTabScreen from './src/components/MainTabScreen';
import { DrawerContent } from './src/components/DrawerContent';
import { View } from 'react-native-animatable';
import { AuthContext } from './src/components/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react/cjs/react.development';

const Drawer = createDrawerNavigator();

const App = () => {
  // const [isLoading, setIsLoading] = React.useState(true);
  // const [userToken, setUserToken] = React.useState(null); 
  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const loginReducer = (prevState, action) => {
    switch( action.type ) {
      case 'RETRIEVE_TOKEN': 
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN': 
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT': 
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);
  const[token,setToken]= useState([]);

  const authContext = React.useMemo(() => ({
    signIn: async(username,password) => {
      let userToken;
      userToken= null;
     if(username !="" && password !=""){
      fetch("http://192.168.0.123:8000/api/login",{
        method:"POST",
        headers:{
          'Accept': 'application/json',
          'Content-type':'application/json'
        },
        body:JSON.stringify({
          'username': username,
          'password_laravel':password, 
        })
      }).then((response)=> response.json())
      .then((responseData)=>{
        console.log(responseData);
        Alert.alert(
          "Login Success!"
        )
      })
      userToken='hola';
    }
    dispatch({ type: 'LOGIN', id: username, token: userToken });
      // console.log('user token: ', userToken);
    },
    signOut: async() => {
      // setUserToken(null);
      // setIsLoading(false);
      try {
        await AsyncStorage.removeItem('userToken');
      } catch(e) {
        console.log(e);
      }
      dispatch({ type: 'LOGOUT' });
    },
    signUp: () => {
      // setUserToken('fgkj');
      // setIsLoading(false);
    },
    toggleTheme: () => {
      setIsDarkTheme( isDarkTheme => !isDarkTheme );
    }
  }), []);

  useEffect(() => {
    setTimeout(async() => {
      // setIsLoading(false);
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch(e) {
        console.log(e);
      }
      // console.log('user token: ', userToken);
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
    }, 1000);
  }, []);

  if( loginState.isLoading ) {
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size="large"/>
      </View>
    );
  }

  return(
    <AuthContext.Provider value={authContext}>
    <NavigationContainer>
      { loginState.userToken !== null ?(
        <Drawer.Navigator drawerContent={props=> <DrawerContent {...props}/>}>
        <Drawer.Screen name="Menu" component={MainTabScreen}/>
        </Drawer.Navigator>
      )
    :
      <StackScreen/>
    }
    </NavigationContainer>
    </AuthContext.Provider>
  );
}
export default App;