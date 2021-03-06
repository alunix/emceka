import React, { Component } from 'react'
import { View, TouchableOpacity, Alert, StyleSheet, TextInput, Text, TouchableHighlight, Image, StatusBar } from 'react-native'
import { MaterialIcons, FontAwesome, Octicons } from '@expo/vector-icons'
import Expo, { ImagePicker } from 'expo'
import Api from '../utils/Api'
import * as firebase from 'firebase'
import { YOUR_API_FOR_UPLOAD, YOUR_UPLOAD_PRESET } from 'react-native-dotenv'

class RegisterScreen extends Component {

  static navigationOptions = {
    headerTitle: (
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={require('../assets/nav.png')}
          style={{ width: 30, height: 30 }}
        />
        <Text style={{
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 18,
          marginLeft: 10
        }}>ToiRate</Text>
      </View>
    )
  }

  constructor() {
    super()

    this.state = {
      avatar: '',
      fullname: '',
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
    Alert.alert('About ToiRate', 'ToiRate version 1.0.0')
  }

  async _uploadAvatar() {
    const { Permissions } = Expo
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)

    if (status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [3, 3],
        base64: true
      })

      if (!result.cancelled) {
        let base64Img = `data:image/jpg;base64,${result.base64}`
        let uploadImageApi = YOUR_API_FOR_UPLOAD

        let data = {
          file: base64Img,
          upload_preset: YOUR_UPLOAD_PRESET
        }

        Api.post(uploadImageApi, data)
          .then(res => {
            const imageUploaded = res.data
            const image = {
              uri: imageUploaded.secure_url
            }

            this.setState({
              avatar: image
            })
          })
          .catch(err => console.log(err))
      }
    } else {
      throw new Error('Camera permission not granted')
    }
  }

  _signUp() {
    let { avatar, fullname, email, password } = this.state
    if (!fullname) {
      this.setState({
        errorMessage: 'Fullname still blank'
      })
    } else if (!email) {
      this.setState({
        errorMessage: 'Email still blank'
      })
    } else if (!password) {
      this.setState({
        errorMessage: 'Password still blank'
      })
    } else {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
          let user = firebase.auth().currentUser
          user.updateProfile({
            displayName: fullname,
            photoURL: avatar.uri
          }).then(() => {
            this.setState({ errorMessage: '' })
            this.props.navigation.navigate('Home')
            Alert.alert('Success', 'Your account has been created')
          }).catch(err => { this.setState({ errorMessage: err.message }) })
        })
        .catch(err => {
          this.setState({ errorMessage: err.message })
        })
    }
  }

  render() {
    return (
      <View style={styles.registerContainer}>
        <StatusBar
          backgroundColor="#4c4d99"
          barStyle="light-content"
          hidden={false} />
        <View style={styles.formContainer}>
          {
            this.state.avatar ? (<View style={styles.avatarContainer}>
              <View style={{ marginVertical: 10 }}>
                <Image source={{ uri: this.state.avatar.uri }} style={styles.avatar} />
              </View></View>) : (<View style={styles.avatarContainer}>
                <TouchableOpacity
                  style={[styles.avatar, styles.avatarContainer]}
                  onPress={() => this._uploadAvatar()}>
                  <FontAwesome name="user-circle-o" size={64} color="#fff" />
                </TouchableOpacity>
              </View>)
          }
          <View style={{ padding: 10 }}>
            <TextInput
              placeholder="Fill the fullname"
              onChangeText={(text) => this.setState({ fullname: text })}
              keyboardType="default"
              autoCapitalize="none"
              underlineColorAndroid={'rgba(0,0,0,0)'}
              style={styles.inputText}
            />
            <TextInput
              placeholder="Fill the email"
              onChangeText={(text) => this.setState({ email: text })}
              keyboardType="email-address"
              textContentType="emailAddress"
              autoCapitalize="none"
              underlineColorAndroid={'rgba(0,0,0,0)'}
              style={styles.inputText}
            />
            <TextInput
              placeholder="Fill the password"
              onChangeText={(text) => this.setState({ password: text })}
              secureTextEntry={true}
              underlineColorAndroid={'rgba(0,0,0,0)'}
              style={styles.inputText}
            />
            {
              !!this.state.errorMessage && (<Text style={styles.errorMessage}>{this.state.errorMessage}</Text>)
            }
          </View>
        </View>
        <TouchableHighlight
          onPress={() => this._signUp()}
          style={styles.buttonRegister}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Octicons name="person" size={28} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 5 }}>Sign Up</Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: '#fff',
  },
  registerContainer: {
    display: 'flex',
    padding: 5
  },
  inputText: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  buttonRegister: {
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
    backgroundColor: '#777'
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd'
  }
})

export default RegisterScreen
