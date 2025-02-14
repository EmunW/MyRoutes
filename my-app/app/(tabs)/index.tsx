import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Dropdown from '../../components/Dropdown';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Dropdown />
    </View>
  );
}

