import React, { Component } from 'react'
import { FlatList, TouchableWithoutFeedback, View } from 'react-native'
import Mck from './Mck'

class ListMck extends Component {

  _getMck(mck) {
    this.props.nav.navigate('Detail', { mck: mck })
  }

  render() {
    const { mcks } = this.props
    return (
      <FlatList
        data={mcks}
        renderItem={({ item }) =>
          <TouchableWithoutFeedback
            onPress={() => this._getMck(item)}
            useForeground={false}>
            <View>
              <Mck mck={item} />
            </View>
          </TouchableWithoutFeedback>
        }
        keyExtractor={item => String(item.id)}
      />
    )
  }
}

export default ListMck
