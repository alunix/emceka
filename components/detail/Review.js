import React from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import StarRating from 'react-native-star-rating'
import Separator from './Separator'

const Review = (props) => {
  const { reviews } = props
  return (
    <View style={styles.reviewContainer}>
      <Text
        style={styles.reviewTitle}>
        REVIEWS
      </Text>
      <Separator color="#787878" />
      {
        reviews !== null ? <ScrollView>
          {
            reviews.map((review, index) => {
              return (
                <View
                  key={index}
                  style={styles.reviewItem}>
                  <View style={styles.itemView}>
                    <Text
                      style={styles.itemUser}>
                      {
                        review.userReview.name
                      }
                    </Text>
                    <StarRating
                      style={styles.itemRating}
                      disabled={true}
                      maxStars={5}
                      starSize={16}
                      rating={review.rating}
                      emptyStar={'star-border'}
                      fullStar={'star'}
                      halfStar={'star-half'}
                      iconSet={'MaterialIcons'}
                      fullStarColor={'#7f81ff'}
                    />
                  </View>
                  <Text
                    style={styles.itemComment}>
                    {review.review}
                  </Text>
                </View>
              )
            })
          }
        </ScrollView> : ''
      }
    </View>
  )
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
