import React, { Component } from 'react'
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import axios from 'axios'

class SearchMck extends Component {

  state = {
    query: ''
  }

  _searchMck() {
    axios.get(`http://localhost:4000/mcks/search&q=${this.state.query}`)
      .then(res => console.log(res.data))
      .catch(err => console.log(err))
  }

  render() {
    return (
      <View style={styles.searchContainer}>
        <View style={styles.searchView}>
          <TextInput
            placeholder="Type your search"
            underlineColorAndroid={'rgba(0,0,0,0)'}
            style={styles.searchTextInput}
            autoCapitalize="none"
            onChangeText={(text) => this.setState({ query: text })}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => this._searchMck}
          >
            <MaterialIcons name="search" size={28} color="#7f81ff" />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: '#fff',
    marginBottom: 5
  },
  searchView: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row'
  },
  searchTextInput: {
    flex: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    height: 30,
  },
  searchButton: {
    flex: 1,
    marginLeft: 10
  }
})

export default SearchMck
