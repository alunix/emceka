import React, { Component } from 'react'
import { View, TouchableHighlight, Text } from 'react-native'

class LoginScreen extends Component {

  static navigationOptions = {
    title: 'EMCEKA - Login'
  }

  render() {
    return (
      <View>
        <TouchableHighlight
          onPress={() => this.props.navigation.navigate('Home')}>
          <Text>Home</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => this.props.navigation.navigate('Register')}>
          <Text>Register</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

export default LoginScreen
