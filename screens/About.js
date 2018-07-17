import React, { Component } from 'react'
import { View, TouchableOpacity, Platform, Alert } from 'react-native'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'

class AboutScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'About',
      headerLeft: (
        <TouchableOpacity
          style={{ paddingLeft: 10 }}
          onPress={navigation.getParam('mainMenu')}>
          {
            Platform.select({
              ios: <Ionicons name="ios-help-circle" size={24} color="white" />,
              android: <MaterialCommunityIcons name="help-circle" size={24} color="white" />
            })
          }
        </TouchableOpacity>
      )
    }
  }

  constructor() {
    super()

    this._mainMenu = this._mainMenu.bind(this)
  }

  componentDidMount() {
    this.props.navigation.setParams({ mainMenu: this._mainMenu })
  }

  _mainMenu() {
    Alert.alert('Info', 'Emceka version 1.0.0')
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
    )
  }
}

export default AboutScreen
