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
import getDirections from 'react-native-google-maps-directions'

const screen = Dimensions.get('window')

class DetailScreen extends Component {

  static navigationOptions = {
    title: 'Detail'
  }

  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
      swipeToClose: true,
      enablePermission: false,
      review: {
        title: '',
        star: 0,
        content: ''
      },
      reviewId: '',
      isUpdate: false,
      position: {
        latitude: 0,
        longitude: 0
      },
      mck: props.data.mck
    }

    this._showLocation = this._showLocation.bind(this)
    this._showRateReview = this._showRateReview.bind(this)
    this._showSharing = this._showSharing.bind(this)
  }

  async _getPermission() {
    const { Permissions, Location } = Expo
    const { status } = await Permissions.askAsync(Permissions.LOCATION)

    if (status === 'granted') {
      Location.getCurrentPositionAsync({ enableHighAccuracy: true })
        .then(res => {
          this.setState({
            position: {
              latitude: res.coords.latitude,
              longitude: res.coords.longitude
            },
            permissionStatus: true
          })
        })
        .catch(err => console.log(err))
    } else {
      throw new Error('Location permission not granted')
    }
  }

  _showSharing() {
    Share.share({
      message: this.state.mck.description,
      url: this.state.mck.images[0].uri,
      title: this.state.mck.name
    }, {
        // Android
        dialogTitle: 'Sharing',
        // IOS
        excludedActivityTypes: [

        ]
      })
  }

  _showRateReview() {
    const { reviews } = this.state.mck
    const user = this.props.data.user
    const found = reviews.filter(review => review.userReview.userId == user.uid)

    if (found.length > 0) {
      const updatedReview = Object.assign({}, found[0], {
        title: found[0].title,
        star: found[0].rating,
        content: found[0].review
      })

      this.setState({
        review: updatedReview,
        isUpdate: true,
        reviewId: found[0]._id
      })
    }

    this.refs.modalRateReview.open()
  }

  _closeRateReview() {
    this.refs.modalRateReview.close()
  }

  _showLocation() {
    this.refs.modalLocation.open()
    this._getPermission()
  }

  _getDirection() {
    if (this.state.permissionStatus) {
      const { mck } = this.state
      const data = {
        source: this.state.position,
        destination: mck.location,
        params: [
          {
            key: "travelmode",
            value: "driving" // may be "walking", "bicycling" or "transit" as well
          },
          {
            key: "dir_action",
            value: "navigate" // this instantly initializes navigation using the given travel mode
          }
        ]
      }

      getDirections(data)
    }
  }

  _ratingPress(rating) {
    const review = Object.assign({}, this.state.review, { star: rating })
    this.setState({
      review
    })
  }

  _updateReview(mck_id) {
    let { title, content, star } = this.state.review
    if (!title || !content || !star) {
      Alert.alert('Fail', 'Please fill title, review, and give rating!')
    } else {
      let dataReview = {
        title: this.state.review.title,
        rating: this.state.review.star,
        review: this.state.review.content,
      }

      Api.post(`mcks/review/update&review_id=${this.state.reviewId}`, dataReview)
        .then(res => {
          const { mck } = this.state
          const updateReview = mck.reviews.map(review => {
            if (review._id == this.state.reviewId) {
              review.title = dataReview.title,
                review.rating = dataReview.rating,
                review.review = dataReview.review
            }

            return review
          })

          mck.reviews = updateReview
          this.setState({
            mck: mck,
            isUpdate: false
          })
          Alert.alert('Success', 'Review has been updated')
        }).catch(err => {
          console.log(err)
          Alert.alert('Fail', 'Review failed to being updated')
        })

      const review = Object.assign({}, this.state.review,
        { title: '', star: 0, content: '' })
      this.setState({ review })
    }
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
          const { mck } = this.state
          mck.reviews.push(dataReview)
          this.props.getMck(mck)
          this.setState({
            mck: mck
          })
          Alert.alert('Success', 'Review has been submit')
        }).catch(err => {
          console.log(err)
          Alert.alert('Fail', 'Review failed to being submitted')
        })

      const review = Object.assign({}, this.state.review,
        { title: '', star: 0, content: '' })
      this.setState({ review })
    }
  }

  render() {
    const { mck } = this.state
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
            <View style={styles.submitView}>
              <TouchableHighlight
                style={styles.submitRateReview}
                onPress={() => this._getDirection()}>
                <View style={styles.submitButton}>
                  <MaterialIcons name="map" size={28} color="white" />
                  <Text style={styles.buttonText}>Direction</Text>
                </View>
              </TouchableHighlight>
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
              {
                !this.state.isUpdate ? <TouchableHighlight
                  style={styles.submitRateReview}
                  onPress={() => this._submitReview(mck._id)}>
                  <View style={styles.submitButton}>
                    <MaterialIcons name="save" size={28} color="white" />
                    <Text style={styles.buttonText}>Submit</Text>
                  </View>
                </TouchableHighlight> : <TouchableHighlight
                  style={styles.submitRateReview}
                  onPress={() => this._updateReview(mck._id)}>
                    <View style={styles.submitButton}>
                      <MaterialIcons name="update" size={28} color="white" />
                      <Text style={styles.buttonText}>Update</Text>
                    </View>
                  </TouchableHighlight>
              }
              <TouchableHighlight
                style={styles.closeRateReview}
                onPress={() => this._closeRateReview()}>
                <View style={styles.submitButton}>
                  <MaterialIcons name="close" size={28} color="white" />
                  <Text style={styles.buttonText}>Close</Text>
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
    padding: 5,
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
    marginBottom: 10,
    flex: 1
  },
  closeRateReview: {
    alignItems: 'center',
    backgroundColor: '#515151',
    padding: 10,
    marginBottom: 10,
    flex: 1
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
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center'
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
    height: (screen.height - screen.height / 4) - 100,
    width: screen.width - 20,
    marginBottom: 10
  },
  map: {
    height: (screen.height - screen.height / 4) - 100,
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
