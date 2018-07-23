import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Platform,
  StatusBar,
  StyleSheet,
  TextInput,
  Dimensions
} from 'react-native'
import { MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons'
import Expo, { MapView } from 'expo'
import haversine from 'haversine'
import { calculateRating } from '../utils/Common'
import Api from '../utils/Api'
const { width, height } = Dimensions.get('window')

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
      permissionStatus: false,
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0
      },
      query: ''
    }

    this._mainMenu = this._mainMenu.bind(this)
  }

  componentDidMount() {
    this._getCurrentLocation()
  }

  async _getMarker() {
    const response = await Api.get('mcks')
    this.setState({ markers: response.data })
  }

  _getData() {
    let { region } = this.state
    this._getMarker()
    if (this.state.permissionStatus) {
      let markers = this.state.markers
      markers.filter(marker => {
        let userLocation = {
          latitude: region.latitude,
          longitude: region.longitude
        }

        let markerLocation = {
          latitude: marker.location.latitude,
          longitude: marker.location.longitude
        }
        console.log(haversine(userLocation, markerLocation, { unit: 'meter' }))
        return haversine(userLocation, markerLocation, { unit: 'meter' }) < 5000
      })
    }
    return []
  }

  async _getCurrentLocation() {
    const { Location, Permissions } = Expo
    const { status } = await Permissions.askAsync(Permissions.LOCATION)

    if (status === 'granted') {
      Location.getCurrentPositionAsync({ enableHighAccuracy: true })
        .then(res => {
          this.setState({
            region: {
              latitude: res.coords.latitude,
              longitude: res.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            },
            permissionStatus: true
          })
          this._getData()
        })
        .catch(err => console.log(err))
    } else {
      throw new Error('Location permission not granted')
    }
  }

  _mainMenu() {
    Alert.alert('Info', 'Emceka version 1.0.0')
  }

  async _showNearest() {
    if (this.state.permissionStatus) {
      Expo.Location.geocodeAsync(this.state.query)
        .then(res => {
          this.setState({
            region: {
              latitude: res[0].latitude,
              longitude: res[0].longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            },
            permissionStatus: true
          })
          this._getData()
        })
        .catch(err => console.log(err))

      this.setState({ query: '' })
    }
  }

  render() {
    const markers = this.state.markers

    return (
      <View style={styles.mapContainer}>
        <StatusBar barStyle="light-content" hidden={false} />
        <View style={styles.searchContainer}>
          <View style={styles.searchView}>
            <TextInput
              placeholder="Type your search"
              underlineColorAndroid={'rgba(0,0,0,0)'}
              style={styles.searchTextInput}
              autoCapitalize="none"
              value={this.state.query}
              onChangeText={(text) => this.setState({ query: text })}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => this._showNearest()}>
              <MaterialIcons name="search" size={28} color="#7f81ff" />
            </TouchableOpacity>
          </View>
        </View>
        <MapView
          style={styles.map}
          mapType="standard"
          showsUserLocation={true}
          followUserLocation={true}
          showsCompass={false}
          showsPointOfInterest={false}
          zoomEnabled={true}
          scrollEnabled={true}
          region={this.state.region}>
          <MapView.Marker
            coordinate={{
              latitude: this.state.region.latitude,
              longitude: this.state.region.longitude,
            }}
            title={'Me'}
            description={'My location'}
            image={require('../assets/me.png')}
          />
          {
            markers.length > 0 && markers.map((marker, i) => {

              if (marker.reviews.length > 0) {
                return (
                  <MapView.Marker
                    key={i}
                    coordinate={{
                      latitude: marker.location.latitude,
                      longitude: marker.location.longitude,
                    }}
                    title={marker.name}
                    description={marker.description}
                    image={
                      calculateRating(marker.reviews) > 4 ? require('../assets/emo5.png') : (calculateRating(marker.reviews) > 3 && calculateRating(reviews) <= 4) ? require('../assets/emo4.png') : (calculateRating(reviews) > 2 && calculateRating(reviews) <= 3) ? require('../assets/emo3.png') : (calculateRating(reviews) > 1 && calculateRating(reviews) <= 2) ? require('../assets/emo2.png') : require('../assets/emo1.png')
                    }
                  />
                )
              } else {
                return (
                  <MapView.Marker
                    key={i}
                    coordinate={{
                      latitude: marker.location.latitude,
                      longitude: marker.location.longitude,
                    }}
                    title={marker.name}
                    description={marker.description}
                  />
                )
              }
            })
          }
        </MapView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1
  },
  map: {
    width: width,
    height: height
  },
  searchContainer: {
    backgroundColor: '#fff'
  },
  searchView: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row'
  },
  searchTextInput: {
    flex: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 5
  },
  searchButton: {
    flex: 1,
    marginLeft: 10
  }
})

export default MapScreen
