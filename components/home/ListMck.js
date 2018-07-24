import React, { Component } from 'react'
import { FlatList, TouchableWithoutFeedback, View } from 'react-native'
import Mck from './Mck'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getMck } from '../../store/actions'

class ListMck extends Component {

  _getMck(mck) {
    this.props.nav.navigate('Detail')
    this.props.getMck(mck)
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
        keyExtractor={item => item._id}
      />
    )
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({ getMck }, dispatch)

export default connect(null, mapDispatchToProps)(ListMck)
