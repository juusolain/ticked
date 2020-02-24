/**
 * Ticked
 * https://github.com/jusola/ticked
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import Colors from './components/colors';

export default class App extends Component  {
  render() {
    return(
      <View
        contentInsetAdjustmentBehavior="automatic"
        style={styles.body}>
          <View style={styles.menu}>
            <Text>
              This is menu
            </Text>
          </View>
          <View style={styles.main}>
            <Text>
              This is main
            </Text>
          </View>
        
      </View>
    );
  }
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#00FFFF',
    flex: 1,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  menu: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFF00',
    //backgroundColor: Colors.lightblue,
  },
  main: {
    flex: 5,
    flexDirection: 'column',
    backgroundColor: '#FF00FF',
    //backgroundColor: Colors.white,
  },
});
