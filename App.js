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

import styles from './components/styles';
import Task from './components/task';

export default class App extends Component  {
  getTasks() {
    let testLocal = true; //Development before server
  }
  render() {
    return(
      <View
        contentInsetAdjustmentBehavior="automatic"
        style={styles.body}>
          <View style={styles.menu}>
            <Text style={styles.text}>
              This is menu
            </Text>
          </View>
          <View style={styles.main}>
            <ScrollView style={styles.scroll}>
              <Task title="Testtask1" text="Testq12456oinpouibupigubtgpinthåpojrebhåortibnhrtoeiuhbåtorhuibretåohubtråhiuetrbhåeitbrh9eårtuihbioruetbh+retiuhbtr9ephub" />
              <Task title="Testtask2" text="Test25675474" />
            </ScrollView>
          </View>
      </View>
    );
  }
};

