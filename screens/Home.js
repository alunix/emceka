import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { ListMck, SearchMck } from '../components/home'
import Api from '../utils/Api'
import * as firebase from 'firebase'

class HomeScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'EMCEKA',
      headerLeft: (
        <TouchableOpacity
          style={{ paddingLeft: 10 }}
          onPress={navigation.getParam('addMck')}>
          <MaterialIcons name="add-a-photo" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity
          style={{ paddingRight: 10 }}
          onPress={navigation.getParam('signOut')}>
          <MaterialIcons name="exit-to-app" size={24} color="white" />
        </TouchableOpacity>
      )
    }
  }

  constructor() {
    super()
    this.state = {
      mcks: [],
      user: {}
    }

    this._addMck = this._addMck.bind(this)
    this._signOut = this._signOut.bind(this)
  }

  componentDidMount() {
    this.props.navigation.setParams({ addMck: this._addMck, signOut: this._signOut })
    this._getData()
  }

  async _getData() {
    const response = await Api.get('mcks')
    console.log(response.data)
    this.setState({ mcks: response.data })

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        /*
        const dataUser = this.props.navigation.getParam('dataUser')
        const newUserKey = firebase.database().ref().child('users').push().key
        firebase.database().ref('users/').update({
          [newUserKey]: dataUser
        })

        firebase.database().ref('users/' + newUserKey).on('value', snapshot => {
          const user = Object.create(snapshot.val())
          this.setState({ user: user })
        })
        */
        this.setState({ user: user })
      }
    })
  }

  _addMck() {
    this.props.navigation.navigate('AddMck', { userId: this.state.user.uid })
  }

  _signOut() {
    firebase.auth().signOut()
      .then(() => {
        this.props.navigation.navigate('Login')
        Alert.alert('Success', 'Thank you for using the app')
      })
      .catch(err => console.log(err))
  }

  render() {
    console.log(this.state.user)
    return (
      <View style={styles.homeContainer}>
        <StatusBar barStyle="light-content" hidden={false} />
        <SearchMck />
        <View style={styles.listContainer}>
          <ListMck mcks={this.state.mcks} nav={this.props.navigation} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  homeContainer: {

  },
  listContainer: {
    padding: 10
  }
})

export default HomeScreen
