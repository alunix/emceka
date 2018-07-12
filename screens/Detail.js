import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Text,
  ScrollView,
  Dimensions,
  TextInput,
  Share,
  StyleSheet
} from 'react-native'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { Rating, Review, Facility, User } from '../components/detail'
import Swiper from 'react-native-swiper'
import Modal from 'react-native-modalbox'
import StarRating from 'react-native-star-rating'

const screen = Dimensions.get('window')

class DetailScreen extends Component {

  static navigationOptions = {
    title: 'Detail'
  }

  constructor() {
    super()
    this.state = {
      isOpen: false,
      swipeToClose: true
    }

    this._showLocation = this._showLocation.bind(this)
    this._showRateReview = this._showRateReview.bind(this)
    this._showSharing = this._showSharing.bind(this)
  }

  _showSharing() {

    const mck = this.props.navigation.getParam('mck')

    Share.share({
      message: mck.description,
      url: mck.images[0],
      title: mck.name
    }, {
        // Android
        dialogTitle: 'Sharing',
        // IOS
        excludedActivityTypes: [

        ]
      })
  }

  _showRateReview() {
    this.refs.modalRateReview.open()
  }

  _showLocation() {
    this.refs.modalLocation.open()
  }

  render() {

    const mck = this.props.navigation.getParam('mck')

    return (
      <ScrollView style={styles.detailContainer}>
        <View style={styles.detailView}>
          <Swiper height={250}>
            {
              mck.images.map((image, index) => <Image key={index} source={{ uri: image }} style={styles.detailImage} />)
            }
          </Swiper>
          <View style={styles.detailLocation}>
            <Text style={styles.detailName}>{mck.name}</Text>
            <Text style={styles.detailAddress}>{mck.address}</Text>
          </View>
          <User user={mck.user_created} />
          <View style={styles.detailFeatureContainer}>
            <View style={styles.featureContainer}>
              <TouchableOpacity
                style={styles.featureButton}
                onPress={this._showLocation}>
                <MaterialCommunityIcons name="map-marker-radius" size={24} color="#7f81ff" />
                <Text style={styles.featureText}>Location</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.featureContainer}>
              <TouchableOpacity
                style={styles.featureButton}
                onPress={this._showRateReview}>
                <MaterialCommunityIcons name="star" size={24} color="#7f81ff" />
                <Text style={styles.featureText}>Rate and Review</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.featureContainer}>
              <TouchableOpacity
                style={styles.featureButton}
                onPress={this._showSharing}>
                <MaterialCommunityIcons name="share" size={24} color="#7f81ff" />
                <Text style={styles.featureText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Facility facilities={mck.facilities} />
          <Rating rating={mck.rating} />
          <Review reviews={mck.reviews} />

          <Modal
            style={[styles.modal, styles.modalLocation]}
            ref={"modalLocation"}
            position={"top"}
            swipeToClose={this.state.swipeToClose}>
            <View style={styles.modalView}>
              <Text
                style={styles.modalTitle}>
                LOCATION
            </Text>
            </View>
            <View style={styles.locationContainer}></View>
          </Modal>

          <Modal
            style={[styles.modal, styles.modalRateReview]}
            ref={"modalRateReview"}
            position={"top"}
            swipeToClose={this.state.swipeToClose}>
            <View style={styles.modalView}>
              <Text
                style={styles.modalTitle}>
                RATE AND REVIEW
            </Text>
            </View>
            <View style={styles.ratingView}>
              <Text style={styles.ratingTitle}>Give me rating!</Text>
              <StarRating
                disabled={true}
                maxStars={5}
                starSize={32}
                rating={3}
                emptyStar={'star-border'}
                fullStar={'star'}
                halfStar={'star-half'}
                iconSet={'MaterialIcons'}
                fullStarColor={'#ff7fc6'}
                style={styles.ratingStar}
              />
            </View>
            <View style={styles.reviewView}>
              <Text style={styles.reviewTitle}>Give me review!</Text>
              <TextInput
                placeholder="Your review here"
                multiline={true}
                numberOfLines={4}
                style={styles.reviewInput}
              />
            </View>
            <View style={styles.submitView}>
              <TouchableHighlight
                style={styles.submitRateReview}
                onPress={() => console.log('click')}>
                <View style={styles.submitButton}>
                  <MaterialIcons name="save" size={24} color="white" />
                  <Text style={styles.buttonText}>Submit</Text>
                </View>
              </TouchableHighlight>
            </View>
          </Modal>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  detailContainer: {
    padding: 10,
    flex: 1
  },
  detailView: {
    borderColor: '#ececec',
    backgroundColor: '#fff',
    borderWidth: 1,
  },
  detailImage: {
    width: '100%',
    height: 200,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailLocation: {
    padding: 10
  },
  detailName: {
    fontWeight: 'bold'
  },
  detailAddress: {
    fontSize: 12
  },
  detailFeatureContainer: {
    padding: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  featureContainer: {
    width: 100,
    alignItems: 'center'
  },
  featureButton: {
    alignItems: 'center'
  },
  featureText: {
    fontSize: 12
  },
  modal: {
    alignItems: 'center'
  },
  modalLocation: {
    height: screen.height - screen.height / 3,
    width: screen.width - screen.width / 6
  },
  modalRateReview: {
    height: screen.height / 2
  },
  modalSharing: {
    height: screen.height
  },
  submitRateReview: {
    backgroundColor: '#ff7fc6',
    padding: 10
  },
  modalView: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ff7fc6',
    backgroundColor: '#ff7fc6'
  },
  modalTitle: {
    padding: 10,
    fontWeight: 'bold',
    color: '#fff'
  },
  ratingView: {
    marginBottom: 10
  },
  ratingTitle: {
    padding: 10,
    textAlign: 'center'
  },
  ratingStar: {

  },
  reviewView: {
    marginBottom: 10
  },
  reviewTitle: {
    padding: 10,
    textAlign: 'center'
  },
  reviewInput: {

  },
  submitView: {
    height: 42
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white'
  },
  locationContainer: {
    borderWidth: 1,
    borderColor: '#ececec',
    height: (screen.height - screen.height / 3) - 60,
    width: (screen.width - screen.width / 6) - 20
  }
})

export default DetailScreen
