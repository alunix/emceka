import React, { Component } from 'react'
import { View, TouchableOpacity, Platform, Alert, Text } from 'react-native'
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
      <View style={{ padding: 5 }}>
        <View style={{ backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
          <Text style={{ padding: 10, color: '#fff', backgroundColor: '#ff7fc6', fontWeight: 'bold', textAlign: 'center' }}>EMCEKA App</Text>
          <Text style={{ marginVertical: 10, padding: 10 }}>
            Find the nearest loos/toilets, know the detail, give rating, add new place.
        </Text>
        </View>
      </View>
    )
  }
}

export default AboutScreen
