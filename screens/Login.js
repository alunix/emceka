import React, { Component } from 'react'
import { View, TouchableHighlight, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, Alert } from 'react-native'
import { MaterialIcons, FontAwesome, Octicons } from '@expo/vector-icons'
import * as firebase from 'firebase'

let config = {
  apiKey: 'YOUR_FIREBASE_API_KEY',
  authDomain: 'YOUR_FIREBASE_AUTH_DOMAIN',
  databaseURL: 'YOUR_FIREBASE_DATABASE_URL'
}

firebase.initializeApp(config)

class LoginScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Sign In',
      headerLeft: (
        <TouchableOpacity
          style={{ paddingLeft: 10 }}
          onPress={navigation.getParam('aboutApp')}>
          <MaterialIcons name="apps" size={24} color="white" />
        </TouchableOpacity>
      )
    }
  }

  constructor() {
    super()

    this.state = {
      email: '',
      password: '',
      errorMessage: ''
    }

    this._aboutApp = this._aboutApp.bind(this)
  }

  componentDidMount() {
    this.props.navigation.setParams({ aboutApp: this._aboutApp })
  }

  _aboutApp() {
    Alert.alert('About Emceka', 'Emceka version 1.0.0')
  }

  _signIn() {
    let { email, password } = this.state
    if (!email) {
      this.setState({
        errorMessage: 'Email still blank'
      })
    } else if (!password) {
      this.setState({
        errorMessage: 'Password still blank'
      })
    } else {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
          this.setState({ errorMessage: '' })
          this.props.navigation.navigate('Home')
          Alert.alert('Success', 'Welcome to Emceka App')
        })
        .catch(err => {
          this.setState({ errorMessage: err.message })
        })
    }
  }



  render() {
    return (
      <View style={styles.loginContainer}>
        <StatusBar barStyle="light-content" hidden={false} />
        <View style={styles.formContainer}>
          <View style={styles.avatarContainer}>
            <View style={{ marginVertical: 10 }}>
              <FontAwesome name="user-circle-o" size={64} color="#fff" />
            </View>
          </View>
          <View style={{ padding: 10 }}>
            <TextInput
              placeholder="Fill the email"
              onChangeText={(text) => this.setState({ email: text })}
              keyboardType="email-address"
              textContentType="emailAddress"
              autoCapitalize="none"
              style={styles.inputText}
            />
            <TextInput
              placeholder="Fill the password"
              onChangeText={(text) => this.setState({ password: text })}
              secureTextEntry={true}
              style={styles.inputText}
            />
            {
              this.state.errorMessage ? <Text style={styles.errorMessage}>{this.state.errorMessage}</Text> : ''
            }
          </View>
        </View>
        <TouchableHighlight
          onPress={() => this._signIn()}
          style={styles.buttonLogin}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Octicons name="sign-in" size={28} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 5 }}>Sign In</Text>
          </View>
        </TouchableHighlight>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <Text>
            Don't have account?
          </Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Register')}>
            <Text style={{ marginLeft: 5, color: '#7f81ff', fontWeight: 'bold' }}>Sign Up here.</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  loginContainer: {
    display: 'flex',
    padding: 10
  },
  formContainer: {
    backgroundColor: '#fff'
  },
  inputText: {
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  buttonLogin: {
    alignItems: 'center',
    backgroundColor: '#ff7fc6',
    padding: 10,
    marginBottom: 10
  },
  errorMessage: {
    padding: 10,
    color: 'red'
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7f81ff'
  },
})

export default LoginScreen
