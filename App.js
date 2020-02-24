/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

export default class TickedApp extends Component  {
  render() {
    return(
      <SafeAreaView>
        <StatusBar barStyle="dark-content" />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <View>
  
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "azure",
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  menu: {
    flex: 1,
    backgroundColor: "azure",
  },
  list: {
    flex: 5,
    backgroundColor
  }

  footer: {
    color: "black",
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});
