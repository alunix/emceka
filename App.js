import React from 'react'
import { Platform } from 'react-native'
import {
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator,
} from 'react-navigation'
import {
  HomeScreen,
  LoginScreen,
  RegisterScreen,
  DetailScreen,
  MapScreen,
  AboutScreen,
  AddMckScreen
} from './screens'

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'

import { Provider } from 'react-redux'
import store from './store'

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
  AddMck: AddMckScreen
}, {
    initialRouteName: 'Home', navigationOptions: navigationOptions
  })

AppStack.navigationOptions = ({ navigation }) => {
  if (navigation.state.index == 1) {
    return {
      tabBarVisible: false
    }
  }
  return {
    tabBarVisible: true
  }
}

const MapStack = createStackNavigator({
  Map: MapScreen,
  Detail: DetailScreen
}, {
    initialRouteName: 'Map', navigationOptions: navigationOptions
  })

MapStack.navigationOptions = ({ navigation }) => {
  if (navigation.state.index == 1) {
    return {
      tabBarVisible: false
    }
  }
  return {
    tabBarVisible: true
  }
}

const AboutStack = createStackNavigator({
  About: AboutScreen
}, {
    initialRouteName: 'About', navigationOptions: navigationOptions
  })

const TabIOSStack = createBottomTabNavigator({
  Home: AppStack,
  Map: MapStack,
  About: AboutStack
}, {
    initialRouteName: 'Home', navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state
        let iconName
        if (routeName === 'Home') {
          iconName = `ios-home${focused ? '' : '-outline'}`
        } else if (routeName === 'Map') {
          iconName = `ios-map${focused ? '' : '-outline'}`
        } else if (routeName === 'About') {
          iconName = `ios-help-circle${focused ? '' : '-outline'}`
        }

        return <Ionicons name={iconName} size={25} color={tintColor} />
      },
      tabBarOptions: {
        activeTintColor: '#7f81ff',
        inactiveTintColor: 'gray',
      },
    }),
    animationEnabled: true,
    swipeEnabled: true
  })

const TabAndroidStack = createBottomTabNavigator({
  Home: AppStack,
  Map: MapStack,
  About: AboutScreen
}, {
    initialRouteName: 'Home', navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state
        let iconName
        if (routeName === 'Home') {
          iconName = `home${focused ? '' : '-outline'}`
        } else if (routeName === 'Map') {
          iconName = `map-marker${focused ? '' : '-outline'}`
        } else if (routeName === 'About') {
          iconName = `help-circle${focused ? '' : '-outline'}`
        }

        return <MaterialCommunityIcons name={iconName} size={25} color={tintColor} />
      },
      tabBarOptions: {
        activeTintColor: '#7f81ff',
        inactiveTintColor: 'gray',
      },
    }),
    animationEnabled: true,
    swipeEnabled: true
  })

const Navigator = createSwitchNavigator({
  Auth: AuthStack,
  App: Platform.select({ ios: TabIOSStack, android: TabAndroidStack })
}, {
    initialRouteName: 'Auth'
  })

const App = () => {
  return (
    <Provider store={store}>
      <Navigator />
    </Provider>
  )
}

export default App
