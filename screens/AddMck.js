import React, { Component } from 'react'
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  SegmentedControlIOS,
  Image,
  Alert,
  StatusBar
} from 'react-native'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import Swiper from 'react-native-swiper'
import Expo, { ImagePicker } from 'expo'
import Api from '../utils/Api'
import { YOUR_API_FOR_UPLOAD, YOUR_UPLOAD_PRESET } from 'react-native-dotenv'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setMcks } from '../store/actions'

class AddMckScreen extends Component {

  static navigationOptions = {
    title: 'Add Mck'
  }

  constructor(props) {
    super(props)
    this.state = {
      selectedIndex: {
        hasMirror: 0,
        hasSoap: 0,
        hasTissue: 0,
        hasTrash: 0,
        hasShower: 0
      },
      images: null,
      name: '',
      description: '',
      address: '',
      room: {
        flush: 0,
        squat: 0,
        bath: 0
      },
      location: {
        latitude: 0,
        longitude: 0
      }
    }
  }

  _refreshForm() {
    const selectedIndex = Object.assign({}, this.state.selectedIndex, {
      hasMirror: 0,
      hasSoap: 0,
      hasTissue: 0,
      hasTrash: 0,
      hasShower: 0
    })

    const room = Object.assign({}, this.state.room, {
      flush: 0,
      squat: 0,
      bath: 0
    })

    const location = Object.assign({}, this.state.location, {
      latitude: 0,
      longitude: 0
    })

    this.setState({
      selectedIndex,
      images: null,
      name: '',
      description: '',
      address: '',
      room,
      location
    })
  }

  _submitMck() {
    const user = this.props.data.user
    const {
      name,
      description,
      address,
      images,
    } = this.state

    if (!name || !description || !address || !images) {
      Alert.alert('Error', 'Please fill the form before submit data')
    } else {
      const newMck = {
        name: this.state.name,
        description: this.state.description,
        slug: this.state.name.split(' ').join('-') + '-' + Date.now(),
        address: this.state.address,
        facilities: {
          room: {
            flush: {
              sum: this.state.room.flush
            },
            squat: {
              sum: this.state.room.squat
            },
            bath: {
              sum: this.state.room.bath,
              hasShower: this.state.selectedIndex.hasShower == 1 ? true : false
            },
            hasMirror: this.state.selectedIndex.hasMirror == 1 ? true : false,
            hasSoap: this.state.selectedIndex.hasSoap == 1 ? true : false,
            hasTissue: this.state.selectedIndex.hasTissue == 1 ? true : false,
            hasTrash: this.state.selectedIndex.hasTrash == 1 ? true : false
          }
        },
        images: this.state.images,
        location: {
          latitude: this.state.location.latitude,
          longitude: this.state.location.longitude
        },
        reviews: [],
        userCreated: {
          userId: user.uid,
          name: user.displayName,
          avatar: user.photoURL
        }
      }

      Api.post(`mcks/create`, newMck)
        .then(res => {
          let mcks = this.props.data.mcks
          mcks.push(newMck)
          this.props.setMcks(mcks)
          Alert.alert('Success', 'Your request has been submit.')
          //this.props.navigation.goBack(null)
          this._refreshForm()
        })
        .catch(err => {
          Alert.alert('Fail', 'Your request failed.')
        })
    }
  }

  async _getCurrentLocation() {
    const { Location, Permissions } = Expo
    const { status } = await Permissions.askAsync(Permissions.LOCATION)

    if (status === 'granted') {
      Location.getCurrentPositionAsync({ enableHighAccuracy: true })
        .then(res => {
          this.setState({
            location: {
              latitude: res.coords.latitude,
              longitude: res.coords.longitude
            }
          })
          Alert.alert('Success', 'Location has been set')
        })
        .catch(err => console.log(err))
    } else {
      throw new Error('Location permission not granted')
    }
  }

  async _takePhoto() {
    const { Permissions } = Expo
    const { status } = await Permissions.askAsync(Permissions.CAMERA)

    if (status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [3, 3],
        base64: true
      })

      if (!result.cancelled) {
        let base64Img = `data:image/jpg;base64,${result.base64}`
        let uploadImageApi = YOUR_API_FOR_UPLOAD

        let data = {
          file: base64Img,
          upload_preset: YOUR_UPLOAD_PRESET
        }

        Api.post(uploadImageApi, data)
          .then(res => {
            const imageUploaded = res.data
            const image = {
              uri: imageUploaded.secure_url
            }

            let { images } = this.state
            let imgs = []
            if (images) {
              imgs = images
              imgs.push(image)
            } else {
              imgs.push(image)
            }

            this.setState({
              images: imgs
            })
          })
          .catch(err => console.log(err))
      }
    } else {
      throw new Error('Camera permission not granted')
    }
  }

  render() {
    const { images } = this.state
    return (
      <ScrollView style={styles.mainContainer}>
        <StatusBar barStyle="light-content" hidden={false} />
        <View style={styles.imageContainer}>
          {
            images && <Swiper height={250}>
              {
                images.map((image, index) => <Image key={index} source={{ uri: image.uri }} style={styles.showImage} />)
              }
            </Swiper>
          }
        </View>
        <View style={styles.addMckContainer}>
          <Text style={styles.inputTitle}>Photo and Location</Text>
          <View style={styles.boxFacility}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
              <TouchableOpacity
                style={styles.buttonTakePhoto}
                onPress={() => this._takePhoto()}>
                <MaterialIcons name="add-a-photo" size={32} color="#7f81ff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonTakePhoto}
                onPress={() => this._getCurrentLocation()}>
                <MaterialCommunityIcons name="map-marker-radius" size={32} color="#7f81ff" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.inputTitle}>Name</Text>
          <TextInput
            placeholder="Fill the name"
            autoCapitalize="none"
            onChangeText={(text) => this.setState({ name: text })}
            value={this.state.name}
            style={styles.inputText} />
          <Text style={styles.inputTitle}>Description</Text>
          <TextInput
            placeholder="Fill the description"
            autoCapitalize="none"
            onChangeText={(text) => this.setState({ description: text })}
            value={this.state.description}
            style={styles.inputText} />
          <Text style={styles.inputTitle}>Address</Text>
          <TextInput
            placeholder="Fill the address"
            autoCapitalize="none"
            onChangeText={(text) => this.setState({ address: text })}
            value={this.state.address}
            style={styles.inputText} />

          <Text style={styles.inputTitle}>Facilities</Text>
          <View style={styles.boxFacility}>
            <Text style={styles.inputTitleNotBold}>Rooms</Text>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
              <Text style={styles.inputTitleNotBold}>Flush</Text>
              <TextInput
                placeholder="Fill the sum of flush room"
                keyboardType="numeric"
                onChangeText={(text) => {
                  const room = Object.assign({}, this.state.room, { flush: text })
                  this.setState({ room })
                }}
                value={String(this.state.room.flush)}
                style={styles.inputTextFacility} />
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
              <Text style={styles.inputTitleNotBold}>Squat</Text>
              <TextInput
                placeholder="Fill the sum of squat room"
                keyboardType="numeric"
                onChangeText={(text) => {
                  const room = Object.assign({}, this.state.room, { squat: text })
                  this.setState({ room })
                }}
                value={String(this.state.room.squat)}
                style={styles.inputTextFacility} />
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
              <Text style={styles.inputTitleNotBold}>Bath</Text>
              <TextInput
                placeholder="Fill the sum of bath room"
                keyboardType="numeric"
                onChangeText={(text) => {
                  const room = Object.assign({}, this.state.room, { bath: text })
                  this.setState({ room })
                }}
                value={String(this.state.room.bath)}
                style={styles.inputTextFacility} />
            </View>
          </View>

          <View style={styles.boxFacility}>
            <Text style={styles.inputTitleNotBold}>Others</Text>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
              <Text style={styles.inputTitleNotBold}>Has Mirror</Text>
              <SegmentedControlIOS
                values={['No', 'Yes']}
                tintColor={'#7f81ff'}
                selectedIndex={this.state.selectedIndex.hasMirror}
                height={30}
                style={{ flex: 1, marginVertical: 10 }}
                onChange={(e) => {
                  const selectedIndex = Object.assign({}, this.state.selectedIndex, { hasMirror: e.nativeEvent.selectedSegmentIndex })
                  this.setState({ selectedIndex })
                }}
              />
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
              <Text style={styles.inputTitleNotBold}>Has Soap</Text>
              <SegmentedControlIOS
                values={['No', 'Yes']}
                tintColor={'#7f81ff'}
                selectedIndex={this.state.selectedIndex.hasSoap}
                height={30}
                style={{ flex: 1, marginVertical: 10 }}
                onChange={(e) => {
                  const selectedIndex = Object.assign({}, this.state.selectedIndex, { hasSoap: e.nativeEvent.selectedSegmentIndex })
                  this.setState({ selectedIndex })
                }}
              />
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
              <Text style={styles.inputTitleNotBold}>Has Tissue</Text>
              <SegmentedControlIOS
                values={['No', 'Yes']}
                tintColor={'#7f81ff'}
                selectedIndex={this.state.selectedIndex.hasTissue}
                height={30}
                style={{ flex: 1, marginVertical: 10 }}
                onChange={(e) => {
                  const selectedIndex = Object.assign({}, this.state.selectedIndex, { hasTissue: e.nativeEvent.selectedSegmentIndex })
                  this.setState({ selectedIndex })
                }}
              />
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
              <Text style={styles.inputTitleNotBold}>Has Trash</Text>
              <SegmentedControlIOS
                values={['No', 'Yes']}
                tintColor={'#7f81ff'}
                selectedIndex={this.state.selectedIndex.hasTrash}
                height={30}
                style={{ flex: 1, marginVertical: 10 }}
                onChange={(e) => {
                  const selectedIndex = Object.assign({}, this.state.selectedIndex, { hasTrash: e.nativeEvent.selectedSegmentIndex })
                  this.setState({ selectedIndex })
                }}
              />
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
              <Text style={styles.inputTitleNotBold}>Has Shower</Text>
              <SegmentedControlIOS
                values={['No', 'Yes']}
                tintColor={'#7f81ff'}
                selectedIndex={this.state.selectedIndex.hasShower}
                height={30}
                style={{ flex: 1, marginVertical: 10 }}
                onChange={(e) => {
                  const selectedIndex = Object.assign({}, this.state.selectedIndex, { hasShower: e.nativeEvent.selectedSegmentIndex })
                  this.setState({ selectedIndex })
                }}
              />
            </View>
          </View>
        </View>
        <View style={{ marginBottom: 20 }}>
          <TouchableHighlight
            style={styles.buttonSubmit}
            onPress={() => this._submitMck()}>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MaterialIcons name="save" size={28} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Submit</Text>
            </View>
          </TouchableHighlight>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    padding: 5,
    flex: 1,
    flexDirection: 'column'
  },
  imageContainer: {
    height: 250,
    backgroundColor: '#ddd',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addMckContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  inputTitle: {
    marginBottom: 5,
    fontWeight: 'bold'
  },
  inputText: {
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  inputTextFacility: {
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 4
  },
  inputTitleNotBold: {
    marginBottom: 5,
    marginRight: 10,
    flex: 1
  },
  buttonSubmit: {
    backgroundColor: '#ff7fc6',
    padding: 10
  },
  boxFacility: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10
  },
  buttonTakePhoto: {
    alignItems: 'center',
    flex: 1,
  },
  showImage: {
    width: '100%',
    height: 200,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

const mapStateToProps = (state) => {
  return {
    data: state
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({ setMcks }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(AddMckScreen)
