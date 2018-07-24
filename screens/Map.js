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
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setMarkers } from '../store/actions'

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

  _getData() {
    let { region } = this.state
    if (this.state.permissionStatus) {
      let markers = this.props.data.mcks
      const newMarkers = markers.filter(marker => {
        let userLocation = {
          latitude: region.latitude,
          longitude: region.longitude
        }

        let markerLocation = {
          latitude: marker.location.latitude,
          longitude: marker.location.longitude
        }

        return haversine(userLocation, markerLocation, { unit: 'meter' }) < 5000
      })
      this.props.setMarkers(newMarkers)
    }
    this.props.setMarkers([])
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
    const { markers } = this.props.data
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
            markers && markers.map((marker, i) => {
              const { reviews, name, description, location } = marker
              if (reviews.length > 0) {
                const rating = calculateRating(reviews)
                return (
                  <MapView.Marker
                    key={i}
                    coordinate={location}
                    title={name}
                    description={description}
                    image={
                      rating > 4 ? require('../assets/emo5.png') : (rating > 3 && rating <= 4) ? require('../assets/emo4.png') : (rating > 2 && rating <= 3) ? require('../assets/emo3.png') : (rating > 1 && rating <= 2) ? require('../assets/emo2.png') : require('../assets/emo1.png')
                    }
                  />
                )
              } else {
                return (
                  <MapView.Marker
                    key={i}
                    coordinate={location}
                    title={name}
                    description={description}
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

const mapStateToProps = (state) => {
  return {
    data: state
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({ setMarkers }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen)
