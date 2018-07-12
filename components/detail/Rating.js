import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import StarRating from 'react-native-star-rating'
import Separator from './Separator'

const Rating = (props) => {
  const rating = props.rating
  return (
    <View style={styles.ratingContainer}>
      <Text
        style={styles.ratingTitle}>
        OVERALL RATING
      </Text>
      <Separator color="#787878" />
      <View style={styles.ratingItem}>
        <StarRating
          disabled={true}
          maxStars={5}
          starSize={32}
          rating={rating}
          emptyStar={'star-border'}
          fullStar={'star'}
          halfStar={'star-half'}
          iconSet={'MaterialIcons'}
          fullStarColor={'#7f81ff'}
          style={styles.itemStar}
        />
        <Text
          style={styles.itemNumber}>
          {rating}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  ratingContainer: {
    padding: 10
  },
  ratingTitle: {
    fontWeight: 'bold',
    marginBottom: 5
  },
  ratingItem: {
    flex: 1,
    flexDirection: 'row'
  },
  itemStar: {
    flex: 2
  },
  itemNumber: {
    flex: 1,
    textAlign: 'center',
    fontSize: 32
  }
})

export default Rating
