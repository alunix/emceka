import React from 'react'
import { createStackNavigator, createSwitchNavigator } from 'react-navigation'
import {
  HomeScreen,
  LoginScreen,
  RegisterScreen
} from './screens'

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  Register: RegisterScreen
}, {
    initialRouteName: 'Login'
  })

const AppStack = createStackNavigator({
  Home: HomeScreen
}, {
    initialRouteName: 'Home'
  })

const Navigator = createSwitchNavigator({
  Auth: AuthStack,
  App: AppStack
}, {
    initialRouteName: 'Auth'
  })

const App = () => {
  return (<Navigator />)
}

export default App
