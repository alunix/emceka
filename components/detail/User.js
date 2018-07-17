import React from 'react'
import { View, Image, Text, StyleSheet } from 'react-native'

const User = (props) => {
  const userCreated = props.user
  return (
    <View style={styles.userContainer}>
      <Image
        source={{ uri: userCreated.avatar }}
        style={styles.avatar} />
      <View style={styles.user}>
        <Text
          style={styles.userName}>
          {userCreated.name}
        </Text>
        <Text
          style={styles.userDescription}>
          {userCreated.description}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  userContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center'
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24
  },
  user: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10
  },
  userName: {
    fontWeight: 'bold'
  },
  userDescription: {
    fontSize: 12,
    fontStyle: 'italic'
  }
})

export default User
