import React, { Component } from 'react'
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

class SearchMck extends Component {
  render() {
    return (
      <View style={styles.searchContainer}>
        <View style={styles.searchView}>
          <TextInput
            placeholder="Type your search"
            underlineColorAndroid={'rgba(0,0,0,0)'}
            style={styles.searchTextInput}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.searchButton}
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
