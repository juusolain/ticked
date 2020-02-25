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

import styles from './components/Styles';
import Task from './components/Task';
import AuthService from './components/AuthService';

export default class App extends Component  {
  constructor(props){
    super(props)
    this.Auth = new AuthService('http://localhost:5000');//Debug
    this.Auth.register('testuser', '1234');
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

