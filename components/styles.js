import React from 'react';
import { StyleSheet } from "react-native";

const Colors = {
  white: '#F3F3F3',
  light: '#DDDDDD',
  lightblue: '#ABCDEF',
  dark: '#20262C',
  black: '#0C0E10',
}

export default StyleSheet.create({
  body: {
    backgroundColor: '#00FFFF',
    color: Colors.black,
    flex: 1,
    flexDirection: 'row',
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  text: {
    color: Colors.dark,
    fontSize: 12,
  },
  title: {
    color: Colors.black,
    fontSize: 18,
  },
  menu: {
    flex: 1,
    backgroundColor: Colors.lightblue,
  },
  main: {
    flex: 3,
    backgroundColor: Colors.white,
  },
  task: {
    height: 72,
    margin: 5,
    padding: 5,
    borderWidth: 3,
    borderRadius: 3,
    backgroundColor: Colors.light,
    flexDirection: 'row',
  },
  taskDescription: {
    flex: 3,
    marginVertical: 0,
    marginRight: 20,
    backgroundColor: '#FF0000', //debug
  },
  taskActions: {
    flex: 1,
    marginVertical: 0,
    marginLeft: 20,
    backgroundColor: '#00FF00', //debug
  },
  scroll:{
    flex: 1,
  }
});

