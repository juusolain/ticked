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
import Auth from './components/Auth';

export default class App extends Component  {
  constructor(){
    if(await Auth.login('testuser', '1234')){
      console.log("Auth succeed")
    }else{
      console.log("Auth failed");
    }
  }
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

