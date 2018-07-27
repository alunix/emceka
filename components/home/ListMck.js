import React, { Component } from 'react'
import { ScrollView, TouchableWithoutFeedback, View } from 'react-native'
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
      <ScrollView>
        {
          mcks.map(mck => {
            return (
              <TouchableWithoutFeedback
                key={mck._id}
                onPress={() => this._getMck(mck)}
                useForeground={false}>
                <View>
                  <Mck mck={mck} />
                </View>
              </TouchableWithoutFeedback>
            )
          })
        }
      </ScrollView>
    )
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({ getMck }, dispatch)

export default connect(null, mapDispatchToProps)(ListMck)
