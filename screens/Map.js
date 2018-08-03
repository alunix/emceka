import React, { Component } from 'react'
import {
    View,
    TouchableOpacity,
    Platform,
    StatusBar,
    StyleSheet,
    Alert,
    Dimensions,
    Text
} from 'react-native'
import { MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons'
import Expo, { MapView } from 'expo'
import haversine from 'haversine'
import { calculateRating } from '../utils/Common'
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getMck } from '../store/actions'
import getDirections from 'react-native-google-maps-directions'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { YOUR_GOOGLE_MAPS_API_LOCATION } from 'react-native-dotenv'

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
            ),
            headerRight: (
                <TouchableOpacity
                    style={{ paddingRight: 10 }}
                    onPress={navigation.getParam('locateMe')}>
                    {
                        Platform.select({
                            ios: <Ionicons name="ios-locate" size={24} color="white" />,
                            android: <MaterialIcons name="my-location" size={24} color="white" />
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
            query: '',
            markers: [],
            locationName: '',
            locationAddress: ''
        }

        this._mainMenu = this._mainMenu.bind(this)
        this._locateMe = this._locateMe.bind(this)
    }

    componentDidMount() {
        this._getCurrentLocation()
        this.props.navigation.setParams({ locateMe: this._locateMe, mainMenu: this._mainMenu })
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
            this.setState({ markers: newMarkers })
        }
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
        Alert.alert('Info', 'ToiRate version 1.0.0')
    }

    _locateMe() {
        this._getCurrentLocation()
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

    _getDirection(location = {}) {
        if (this.state.permissionStatus) {
            const data = {
                source: {
                    latitude: this.state.region.latitude,
                    longitude: this.state.region.longitude
                },
                destination: location,
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

    _getDetail(marker) {
        this.props.navigation.navigate('Detail')
        this.props.getMck(marker)
    }

    render() {
        const { markers } = this.state
        return (
            <View style={styles.mapContainer}>
                <StatusBar
                    backgroundColor="#4c4d99"
                    barStyle="light-content"
                    hidden={false} />
                <View style={styles.searchContainer}>
                    <View style={styles.searchView}>
                        <GooglePlacesAutocomplete
                            placeholder='Enter Location'
                            minLength={2}
                            autoFocus={false}
                            fetchDetails={true}
                            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                                this.setState({
                                    region: {
                                        latitude: details.geometry.location.lat,
                                        longitude: details.geometry.location.lng,
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421
                                    },
                                    locationName: details.name,
                                    locationAddress: details.formatted_address
                                })
                                this._getData()
                            }}
                            getDefaultValue={() => ''}
                            query={{
                                key: YOUR_GOOGLE_MAPS_API_LOCATION,
                                language: 'en', // language of the results
                                types: 'geocode' // default: 'geocode'
                            }}
                            styles={{
                                textInputContainer: {
                                    backgroundColor: 'rgba(0,0,0,0)',
                                    borderTopWidth: 0,
                                    borderBottomWidth: 0
                                },
                                textInput: {
                                    marginLeft: 5,
                                    marginRight: 5,
                                    height: 32,
                                    color: '#5d5d5d',
                                    borderWidth: 1,
                                    borderColor: '#ddd',
                                    borderRadius: 10,
                                    padding: 5
                                }
                            }}
                            currentLocation={false}
                            returnKeyType={'search'}
                            listViewDisplayed={false}
                        //filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                        />
                    </View>
                </View>
                <MapView
                    style={styles.map}
                    mapType="standard"
                    //showsUserLocation={true}
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
                        title={this.state.locationName || 'Me'}
                        description={this.state.locationAddress || 'My location'}
                        image={require('../assets/me.png')}
                    />
                    {
                        !!markers && (markers.map((marker, i) => {
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
                                        }>
                                        <MapView.Callout>
                                            <View style={styles.callout}>
                                                <Text style={{ fontWeight: 'bold' }}>{name}</Text>
                                                <Text>{description}</Text>
                                                <View style={{
                                                    width: '100%',
                                                    flexDirection: 'row',
                                                    justifyContent: 'center'
                                                }}>
                                                    <TouchableOpacity
                                                        style={styles.callDirection}
                                                        onPress={() => this._getDetail(marker)}>
                                                        <View style={styles.callButton}>
                                                            <MaterialIcons name="pageview" size={28} color="#ff7fc6" />
                                                        </View>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={styles.callDirection}
                                                        onPress={() => this._getDirection(location)}>
                                                        <View style={styles.submitButton}>
                                                            <MaterialIcons name="directions" size={28} color="#515151" />
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </MapView.Callout>
                                    </MapView.Marker>
                                )
                            } else {
                                return (
                                    <MapView.Marker
                                        key={i}
                                        coordinate={location}
                                        title={name}
                                        description={description}
                                        image={require('../assets/wc.png')}>
                                        <MapView.Callout>
                                            <View style={styles.callout}>
                                                <Text style={{ fontWeight: 'bold' }}>{name}</Text>
                                                <Text>{description}</Text>
                                                <View style={{
                                                    width: '100%',
                                                    flexDirection: 'row',
                                                    justifyContent: 'center'
                                                }}>
                                                    <TouchableOpacity
                                                        style={styles.callDirection}
                                                        onPress={() => this._getDetail(marker)}>
                                                        <View style={styles.callButton}>
                                                            <MaterialIcons name="pageview" size={28} color="#ff7fc6" />
                                                        </View>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={styles.callDirection}
                                                        onPress={() => this._getDirection(location)}>
                                                        <View style={styles.submitButton}>
                                                            <MaterialIcons name="directions" size={28} color="#515151" />
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </MapView.Callout>
                                    </MapView.Marker>
                                )
                            }
                        }))
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
        padding: 5,
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
    },
    callout: {
        flex: 1,
        flexDirection: 'column'
    },
    callDirection: {
        width: '100%',
        alignItems: 'center',
        padding: 10,
        marginTop: 10,
        flex: 1
    },
    callButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 5
    },
})

const mapStateToProps = (state) => {
    return {
        data: state
    }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({ getMck }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen)
