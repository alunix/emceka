import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native'
import { MapView } from 'expo'
import StarRating from 'react-native-star-rating'
import Api from '../utils/Api'
import { calculateRating } from '../utils/Common'
import { SearchMck } from '../components/home'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'

const { width, height } = Dimensions.get('window')
const CARD_HEIGHT = height / 4
const CARD_WIDTH = CARD_HEIGHT - 50

class MapScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Nearest Me',
      headerLeft: (
        <TouchableOpacity
          style={{ paddingLeft: 10 }}
          onPress={navigation.getParam('mainMenu')}>
          {
            Platform.select({
              ios: <Ionicons name="ios-map" size={24} color="white" />,
              android: <MaterialCommunityIcons name="map-marker" size={24} color="white" />
            })
          }
        </TouchableOpacity>
      )
    }
  }

  constructor() {
    super()
    this.state = {
      markers: [],
      region: {
        latitude: -5.6598117,
        longitude: 105.6365743,
        latitudeDelta: 0.04864195044303443,
        longitudeDelta: 0.040142817690068,
      },
      initialPosition: 'unknown',
      lastPosition: 'unknown'
    }

    this._mainMenu = this._mainMenu.bind(this)
  }

  _mainMenu() {
    Alert.alert('Info', 'Emceka version 1.0.0')
  }

  componentWillMount() {
    this.index = 0
    this.animation = new Animated.Value(0)
  }

  componentDidMount() {
    this.props.navigation.setParams({ mainMenu: this._mainMenu })
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const initialPosition = position
        console.log(initialPosition)
        this.setState({ initialPosition })
      },
      (error) => alert(error.message),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000
      }
    )

    this.watchID = navigator.geolocation.watchPosition((position) => {
      const lastPosition = position
      console.log(lastPosition)
      this.setState({ lastPosition })
    })

    Api.get(`http://localhost:4000/mcks`).then(response => {
      const mcks = response.data
      const markers = mcks.map(mck => {
        return {
          coordinate: mck.location,
          title: mck.name,
          description: mck.description,
          image: { uri: mck.images[0].uri },
          rating: calculateRating(mck.reviews)
        }
      })

      this.setState({ markers: markers })
    }).catch(err => console.log(err))

    // We should detect when scrolling has stopped then animate
    // We should just debounce the event listener here
    this.animation.addListener(({ value }) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3) // animate 30% away from landing on the next item
      if (index >= this.state.markers.length) {
        index = this.state.markers.length - 1
      }
      if (index <= 0) {
        index = 0
      }

      clearTimeout(this.regionTimeout)
      this.regionTimeout = setTimeout(() => {
        if (this.index !== index) {
          this.index = index
          const { coordinate } = this.state.markers[index]
          this.map.animateToRegion(
            {
              ...coordinate,
              latitudeDelta: this.state.region.latitudeDelta,
              longitudeDelta: this.state.region.longitudeDelta,
            },
            350
          )
        }
      }, 10)
    })
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID)
  }

  render() {
    const interpolations = this.state.markers.map((marker, index) => {
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * CARD_WIDTH,
        ((index + 1) * CARD_WIDTH),
      ]
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 2.5, 1],
        extrapolate: 'clamp',
      })
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0.35, 1, 0.35],
        extrapolate: 'clamp',
      })
      return { scale, opacity }
    })

    /*
    let lastRegion = this.state.region
    let newRegion = {
      latitude: this.state.lastPosition.coords.latitude,
      longitude: this.state.lastPosition.coords.longitude,
      latitudeDelta: lastRegion.latitudeDelta,
      longitudeDelta: lastRegion.longitudeDelta
    }
    */

    return (
      <View style={styles.container}>
        <SearchMck />
        <MapView
          ref={map => this.map = map}
          initialRegion={this.state.region}
          style={styles.container}>
          {this.state.markers.map((marker, index) => {
            const scaleStyle = {
              transform: [
                {
                  scale: interpolations[index].scale,
                },
              ],
            }
            const opacityStyle = {
              opacity: interpolations[index].opacity,
            }
            return (
              <MapView.Marker key={index} coordinate={marker.coordinate}>
                <Animated.View style={[styles.markerWrap, opacityStyle]}>
                  <Animated.View style={[styles.ring, scaleStyle]} />
                  <View style={styles.marker} />
                </Animated.View>
              </MapView.Marker>
            );
          })}
        </MapView>
        <Animated.ScrollView
          horizontal
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: this.animation,
                  },
                },
              },
            ],
            { useNativeDriver: true }
          )}
          style={styles.scrollView}
          contentContainerStyle={styles.endPadding}>
          {this.state.markers.map((marker, index) => (
            <View style={styles.card} key={index}>
              <Image
                source={marker.image}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.textContent}>
                <Text numberOfLines={3} style={styles.cardtitle}>{marker.title}</Text>
                <StarRating
                  style={{ flex: 1 }}
                  disabled={true}
                  maxStars={5}
                  starSize={12}
                  rating={marker.rating}
                  emptyStar={'star-border'}
                  fullStar={'star'}
                  halfStar={'star-half'}
                  iconSet={'MaterialIcons'}
                  fullStarColor={'#7f81ff'}
                />
              </View>
            </View>
          ))}
        </Animated.ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    padding: 10,
    elevation: 2,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH + 10,
    overflow: 'hidden',
  },
  cardImage: {
    flex: 4,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: 'bold',
    color: '#7f81ff'
  },
  cardRating: {
    alignItems: 'center',
  },
  markerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(130,4,150, 0.9)',
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(130,4,150, 0.3)',
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(130,4,150, 0.5)',
  }
})

export default MapScreen
