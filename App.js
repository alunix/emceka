import React from 'react'
import { createStackNavigator, createSwitchNavigator } from 'react-navigation'
import {
  HomeScreen,
  LoginScreen,
  RegisterScreen,
  DetailScreen,
  MapScreen
} from './screens'

const navigationOptions = {
  headerStyle: {
    backgroundColor: '#7f81ff',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  }
}

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  Register: RegisterScreen
}, {
    initialRouteName: 'Login', navigationOptions: navigationOptions
  })

const AppStack = createStackNavigator({
  Home: HomeScreen,
  Detail: DetailScreen,
  Map: MapScreen
}, {
    initialRouteName: 'Home', navigationOptions: navigationOptions
  })

const Navigator = createSwitchNavigator({
  Auth: AuthStack,
  App: AppStack
}, {
    initialRouteName: 'App'
  })

const App = () => {
  return (<Navigator />)
}

export default App
