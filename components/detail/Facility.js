import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Separator from './Separator'

const Facility = (props) => {

  const {
    room,
    hasMirror,
    hasSoap,
    hasTissue,
    hasTrash
  } = props.facilities

  return (
    <View style={styles.facilityContainer}>
      <Text
        style={styles.facilityTitle}>
        FACILITIES
      </Text>
      <Separator color="#787878" />
      <View style={styles.facilityItemContainer}>
        <Text
          style={styles.itemTitle}>
          Rooms
        </Text>
        <Text
          style={styles.itemValue}>
          Flush ({room.flush.sum}), Squat ({room.squat.sum}), Bath ({room.bath.sum})
        </Text>
      </View>
      <View style={styles.facilityItemContainer}>
        <Text
          style={styles.itemTitle}>
          Mirror
        </Text>
        <Text
          style={styles.itemValue}>
          {hasMirror ? 'Yes' : 'No'}
        </Text>
      </View>
      <View style={styles.facilityItemContainer}>
        <Text
          style={styles.itemTitle}>
          Soap
        </Text>
        <Text
          style={styles.itemValue}>
          {hasSoap ? 'Yes' : 'No'}
        </Text>
      </View>
      <View style={styles.facilityItemContainer}>
        <Text
          style={styles.itemTitle}>
          Tissue
        </Text>
        <Text
          style={styles.itemValue}>
          {hasTissue ? 'Yes' : 'No'}
        </Text>
      </View>
      <View style={styles.facilityItemContainer}>
        <Text
          style={styles.itemTitle}>
          Trash
        </Text>
        <Text
          style={styles.itemValue}>
          {hasTrash ? 'Yes' : 'No'}
        </Text>
      </View>
      <View style={styles.facilityItemContainer}>
        <Text
          style={styles.itemTitle}>
          Bath Shower
        </Text>
        <Text
          style={styles.itemValue}>
          {room.bath.hasShower ? 'Yes' : 'No'}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  facilityContainer: {
    padding: 10
  },
  facilityTitle: {
    fontWeight: 'bold',
    marginBottom: 5
  },
  facilityItemContainer: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10
  },
  itemTitle: {
    flex: 1
  },
  itemValue: {
    flex: 2
  }
})

export default Facility
