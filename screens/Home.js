import React, { Component } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { ListMck, SearchMck } from '../components/home'

class HomeScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'EMCEKA',
      headerLeft: (
        <TouchableOpacity
          style={{ paddingLeft: 10 }}
          onPress={navigation.getParam('mainMenu')}>
          <MaterialCommunityIcons name="menu" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity
          style={{ paddingRight: 10 }}
          onPress={navigation.getParam('viewMapMck')}>
          <MaterialCommunityIcons name="map-marker-radius" size={24} color="white" />
        </TouchableOpacity>
      )
    }
  }

  constructor() {
    super()
    this.state = {
      mcks: [
        {
          id: 1,
          name: 'Rest area KM57, Jakarta',
          description: 'Rest area yang ada di km57 jalan toll ke arah Bekasi',
          address: 'Rest area km57, Jakarta',
          facilities: {
            room: {
              flush: {
                sum: 3
              },
              squat: {
                sum: 2
              },
              bath: {
                sum: 1,
                hasShower: true
              }
            },
            hasTissue: true,
            hasSoap: false,
            hasTrash: true,
            hasMirror: true
          },
          location: {
            latitude: 5.23311,
            longitude: 105.242423
          },
          images: ['http://www.rainbowinseoul.com/wp-content/uploads/2018/04/marvelous-bathroom-toilet-keep-on-the-full-list-of-american-standard-toilets-find-right-style-ideas.jpg', 'https://media.socastsrm.com/wordpress/wp-content/blogs.dir/886/files/2018/03/TOILET.jpg', 'http://vortex-team.com/wp-content/uploads/2015/12/American-Standard-Champion-4.jpg', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Toilet_photo.jpg/1200px-Toilet_photo.jpg'],
          rating: 4.5,
          reviews: [{
            id: 1,
            user_review: {
              name: 'Eko Teguh Widodo',
              description: 'A country traveler',
              user_id: 'id.ekoteguhw',
              email: 'id.ekoteguhw@gmail.com',
              password_hash: 'ajkfakjfhsakfhkfhsfjsa',
              avatar: 'http://via.placeholder.com/150x150'
            },
            content: 'Service is good',
            star: 4,
            created_at: '',
            updated_at: ''
          },
          {
            id: 2,
            user_review: {
              name: 'Budi Santoso',
              description: 'A country traveler',
              user_id: 'budisan',
              email: 'budisan@gmail.com',
              password_hash: 'ajkfakjfhsakfhkfhsfjsa',
              avatar: 'http://via.placeholder.com/150x150'
            },
            content: 'Service is best',
            star: 5,
            created_at: '',
            updated_at: ''
          }],
          user_created: {
            name: 'Eko Teguh Widodo',
            description: 'A country traveler',
            user_id: 'id.ekoteguhw',
            email: 'id.ekoteguhw@gmail.com',
            password_hash: 'ajkfakjfhsakfhkfhsfjsa',
            avatar: 'https://avatars1.githubusercontent.com/u/835315?s=400&u=8653973963841edf6c6ef7afcc1944be62224a99&v=4'
          },
          created_at: '',
          updated_at: ''
        },
        {
          id: 2,
          name: 'Mck 2',
          description: 'Description 2',
          address: 'Address 2',
          facilities: {
            room: {
              flush: {
                sum: 1
              },
              squat: {
                sum: 2
              },
              bath: {
                sum: 0,
                hasShower: false
              }
            },
            hasTissue: false,
            hasSoap: false,
            hasTrash: false,
            hasMirror: true
          },
          location: {
            latitude: 5.23311,
            longitude: 105.242423
          },
          images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Toilet_photo.jpg/1200px-Toilet_photo.jpg', 'http://www.rainbowinseoul.com/wp-content/uploads/2018/04/marvelous-bathroom-toilet-keep-on-the-full-list-of-american-standard-toilets-find-right-style-ideas.jpg', 'https://media.socastsrm.com/wordpress/wp-content/blogs.dir/886/files/2018/03/TOILET.jpg', 'http://vortex-team.com/wp-content/uploads/2015/12/American-Standard-Champion-4.jpg'],
          rating: 1.5,
          reviews: [{
            id: 2,
            user_review: {
              name: 'Eko Teguh Widodo',
              description: 'A country traveler',
              user_id: 'id.ekoteguhw',
              email: 'id.ekoteguhw@gmail.com',
              password_hash: 'ajkfakjfhsakfhkfhsfjsa',
              avatar: 'http://via.placeholder.com/150x150'
            },
            content: 'Service is bad',
            star: 2,
            created_at: '',
            updated_at: ''
          }],
          user_created: {
            name: 'Eko Teguh Widodo',
            description: 'A country traveler',
            user_id: 'id.ekoteguhw',
            email: 'id.ekoteguhw@gmail.com',
            password_hash: 'ajkfakjfhsakfhkfhsfjsa',
            avatar: 'http://via.placeholder.com/150x150'
          },
          created_at: '',
          updated_at: ''
        }
      ]
    }

    this._viewMapMck = this._viewMapMck.bind(this)
    this._mainMenu = this._mainMenu.bind(this)
  }

  componentDidMount() {
    this.props.navigation.setParams({ viewMapMck: this._viewMapMck, mainMenu: this._mainMenu })
  }

  _viewMapMck() {
    this.props.navigation.navigate('Map')
  }

  _mainMenu() {

  }

  render() {
    return (
      <View style={styles.homeContainer}>
        <SearchMck />
        <View style={styles.listContainer}>
          <ListMck mcks={this.state.mcks} nav={this.props.navigation} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  homeContainer: {

  },
  listContainer: {
    padding: 10
  }
})

export default HomeScreen
