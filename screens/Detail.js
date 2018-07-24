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
  StyleSheet,
  Alert
} from 'react-native'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { Rating, Review, Facility, User } from '../components/detail'
import Swiper from 'react-native-swiper'
import Modal from 'react-native-modalbox'
import StarRating from 'react-native-star-rating'
import Api from '../utils/Api'
import { calculateRating } from '../utils/Common'
import Expo, { MapView } from 'expo'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getMck } from '../store/actions'

const screen = Dimensions.get('window')

class DetailScreen extends Component {

  static navigationOptions = {
    title: 'Detail'
  }

  constructor() {
    super()
    this.state = {
      isOpen: false,
      swipeToClose: true,
      enablePermission: false,
      review: {
        title: '',
        star: 0,
        content: ''
      }
    }

    this._showLocation = this._showLocation.bind(this)
    this._showRateReview = this._showRateReview.bind(this)
    this._showSharing = this._showSharing.bind(this)
  }

  async _getPermission() {
    const { Permissions } = Expo
    const { status } = await Permissions.askAsync(Permissions.LOCATION)

    if (status === 'granted') {
      this.setState({
        enablePermission: true
      })
    } else {
      throw new Error('Location permission not granted')
    }
  }

  _showSharing() {
    const mck = this.props.data.mck

    Share.share({
      message: mck.description,
      url: mck.images[0].uri,
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
    this._getPermission()
  }

  _ratingPress(rating) {
    const review = Object.assign({}, this.state.review, { star: rating })
    this.setState({
      review
    })
  }

  _submitReview(mck_id) {
    let { title, content, star } = this.state.review
    if (!title || !content || !star) {
      Alert.alert('Fail', 'Please fill title, review, and give rating!')
    } else {
      const user = this.props.data.user
      let dataReview = {
        title: this.state.review.title,
        rating: this.state.review.star,
        review: this.state.review.content,
        userReview: {
          userId: user.uid,
          name: user.displayName
        }
      }

      Api.post(`mcks/review&mck_id=${mck_id}`, dataReview)
        .then(res => {
          let mck = this.props.data.mck
          mck.reviews.push(dataReview)
          this.props.getMck(mck)
          Alert.alert('Success', 'Review has been submit')
        }).catch(err => {
          console.log(err)
          Alert.alert('Fail', 'Review failed to being submitted')
        })

      const review = Object.assign({}, this.state.review,
        { title: '', star: 0, content: '' })
      this.setState({ review })
      setTimeout(() => this.refs.modalLocation.close(), 500)
    }
  }

  render() {
    const mck = this.props.data.mck
    let user = {
      name: mck.userCreated.name,
      description: mck.userCreated.description,
      avatar: mck.userCreated.avatar
    }
    const averageRating = calculateRating(mck.reviews)

    return (
      <ScrollView style={styles.detailContainer}>
        <View style={styles.detailView}>
          <Swiper height={250}>
            {
              mck.images.map((image, index) => <Image key={index} source={{ uri: image.uri }} style={styles.detailImage} />)
            }
          </Swiper>
          <View style={styles.detailLocation}>
            <Text style={styles.detailName}>{mck.name}</Text>
            <Text style={styles.detailAddress}>{mck.address}</Text>
          </View>
          <User user={user} />
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
          <Rating rating={averageRating} />
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
            <View style={styles.locationContainer}>
              <MapView
                style={styles.map}
                mapType="standard"
                showsUserLocation={true}
                followUserLocation={true}
                showsCompass={false}
                showsPointOfInterest={false}
                zoomEnabled={true}
                scrollEnabled={true}
                region={{
                  latitude: mck.location.latitude,
                  longitude: mck.location.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421
                }}>
                <MapView.Marker
                  coordinate={mck.location}
                  title={mck.name}
                  description={mck.address}
                />
              </MapView>
            </View>
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
                disabled={false}
                maxStars={5}
                starSize={32}
                rating={this.state.review.star}
                emptyStar={'star-border'}
                fullStar={'star'}
                halfStar={'star-half'}
                iconSet={'MaterialIcons'}
                fullStarColor={'#ff7fc6'}
                style={styles.ratingStar}
                selectedStar={(rating) => this._ratingPress(rating)}
              />
            </View>
            <View style={styles.reviewView}>
              <Text style={styles.reviewTitle}>Give me title!</Text>
              <TextInput
                placeholder="Your title's review here"
                style={styles.reviewInput}
                onChangeText={(text) => {
                  const review = Object.assign({}, this.state.review, { title: text })
                  this.setState({ review })
                }}
                value={this.state.review.title}
              />
              <Text style={styles.reviewTitle}>Give me review!</Text>
              <TextInput
                placeholder="Your review here"
                multiline={true}
                numberOfLines={4}
                style={[styles.reviewInput, { height: 90 }]}
                onChangeText={(text) => {
                  const review = Object.assign({}, this.state.review, { content: text })
                  this.setState({ review })
                }}
                value={this.state.review.content}
              />
            </View>
            <View style={styles.submitView}>
              <TouchableHighlight
                style={styles.submitRateReview}
                onPress={() => this._submitReview(mck._id)}>
                <View style={styles.submitButton}>
                  <MaterialIcons name="save" size={28} color="white" />
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
    marginBottom: 20
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
    height: screen.height - screen.height / 4,
    width: screen.width
  },
  modalRateReview: {
    height: screen.height - screen.height / 4
  },
  modalSharing: {
    height: screen.height
  },
  submitRateReview: {
    alignItems: 'center',
    backgroundColor: '#ff7fc6',
    padding: 10,
    marginBottom: 10
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

  },
  ratingTitle: {
    textAlign: 'center',
    marginVertical: 10
  },
  ratingStar: {

  },
  reviewView: {
    width: '100%',
    padding: 10
  },
  reviewTitle: {
    padding: 10,
    textAlign: 'center'
  },
  reviewInput: {
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  submitView: {
    width: '100%'
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5
  },
  locationContainer: {
    borderWidth: 1,
    borderColor: '#ececec',
    height: (screen.height - screen.height / 4) - 60,
    width: screen.width - 20
  },
  map: {
    height: (screen.height - screen.height / 4) - 60,
    width: screen.width - 20,
    borderWidth: 1,
    borderColor: '#ddd'
  },
})

const mapStateToProps = (state) => {
  return {
    data: state
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({ getMck }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(DetailScreen)
