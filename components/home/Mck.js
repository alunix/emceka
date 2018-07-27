import React from 'react'
import { View, Image, Text, StyleSheet } from 'react-native'
import StarRating from 'react-native-star-rating'
import { calculateRating } from '../../utils/Common'

const Mck = (props) => {
  const mck = props.mck
  const avg = calculateRating(mck.reviews)
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardView}>
        <Image source={{ uri: mck.images[0].uri }} style={styles.cardImage} />
        <View style={styles.cardTitle}>
          <Text style={{ flex: 1 }} >{mck.name}</Text>
          <Text style={{ flex: 1, fontSize: 12 }} >{mck.description}</Text>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <View style={{ flex: 1 }}></View>
            <StarRating
              style={{ flex: 1 }}
              disabled={true}
              maxStars={5}
              starSize={24}
              rating={avg}
              emptyStar={'star-border'}
              fullStar={'star'}
              halfStar={'star-half'}
              iconSet={'MaterialIcons'}
              fullStarColor={'#7f81ff'}
            />
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 5,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    borderWidth: 1,
  },
  cardView: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1
  },
  cardImage: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: '#ececec'
  },
  cardTitle: {
    padding: 10,
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  cardTitle1: {
    flex: 1,
    fontWeight: 'bold'
  },
  cardTitle2: {
    flex: 1,
    fontSize: 12
  }
})

export default Mck
