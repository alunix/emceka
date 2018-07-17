import React, { Component } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import StarRating from 'react-native-star-rating'
import Separator from './Separator'
import Api from '../../utils/Api'

class Review extends Component {

  _getUser(userId) {
    return Api.get(`users/get&userId=${userId}`)
      .then(res => console.log(res.data))
      .catch(err => console.log(err))
  }

  render() {
    const reviews = this.props.reviews
    return (
      <View style={styles.reviewContainer}>
        <Text
          style={styles.reviewTitle}>
          REVIEWS
      </Text>
        <Separator color="#787878" />
        {
          reviews && <FlatList
            data={reviews}
            renderItem={({ item }) => {
              return (
                <View
                  style={styles.reviewItem}
                  key={item.id}>
                  <View style={styles.itemView}>
                    <Text
                      style={styles.itemUser}>
                      {
                        item.userReview.userId
                      }
                    </Text>
                    <StarRating
                      style={styles.itemRating}
                      disabled={true}
                      maxStars={5}
                      starSize={16}
                      rating={item.rating}
                      emptyStar={'star-border'}
                      fullStar={'star'}
                      halfStar={'star-half'}
                      iconSet={'MaterialIcons'}
                      fullStarColor={'#7f81ff'}
                    />
                  </View>
                  <Text
                    style={styles.itemComment}>
                    {item.review}
                  </Text>
                </View>
              )
            }}
            keyExtractor={item => item._id}
          />
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  reviewContainer: {
    padding: 10
  },
  reviewTitle: {
    fontWeight: 'bold',
    marginBottom: 10
  },
  reviewItem: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 10,
    padding: 10
  },
  itemView: {
    flex: 1,
    flexDirection: 'row'
  },
  itemUser: {
    flex: 1,
    fontWeight: 'bold'
  },
  itemRating: {
    flex: 1
  },
  itemComment: {
    flex: 1
  }
})

export default Review
