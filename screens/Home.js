import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { ListMck, SearchMck } from '../components/home'
import Api from '../utils/Api'

class HomeScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'EMCEKA',
      headerLeft: (
        <TouchableOpacity
          style={{ paddingLeft: 10 }}
          onPress={navigation.getParam('mainMenu')}>
          <MaterialCommunityIcons name="menu" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity
          style={{ paddingRight: 10 }}
          onPress={navigation.getParam('addMck')}>
          <MaterialIcons name="add-a-photo" size={24} color="white" />
        </TouchableOpacity>
      )
    }
  }

  constructor() {
    super()
    this.state = {
      mcks: []
    }

    this._addMck = this._addMck.bind(this)
    this._mainMenu = this._mainMenu.bind(this)
  }

  componentDidMount() {
    this.props.navigation.setParams({ addMck: this._addMck, mainMenu: this._mainMenu })
    this._getData()
  }

  async _getData() {
    const response = await Api.get('mcks')
    this.setState({ mcks: response.data })
  }

  _addMck() {
    this.props.navigation.navigate('AddMck')
  }

  _mainMenu() {
    Alert.alert('Info', 'Emceka version 1.0.0')
  }

  render() {
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
