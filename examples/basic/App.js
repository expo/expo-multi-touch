import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { MultiTouchView } from 'expo-multi-touch';

export default class App extends Component {
  render() {
    const props = {
      onTouchBegan: event => {
        const { identifier } = event;
        // event
        console.log('onTouchBegan', identifier);
      },
      onTouchMoved: () => {
        // console.log('onTouchMoved');
      },
      onTouchEnded: event => {
        const { identifier, deltaX, deltaY, isTap } = event;
        console.log('onTouchEnded', identifier, deltaX, isTap);
      },
      onTouchCancelled: event => {
        const { identifier, deltaX, deltaY, isTap } = event;
        console.log('onTouchCancelled', identifier, deltaX, isTap);
      },
      onTouchesBegan: () => {
        console.log('onTouchesBegan');
      },
      onTouchesMoved: () => {
        // console.log('onTouchesMoved');
      },
      onTouchesEnded: () => {
        console.log('onTouchesEnded');
      },
      onTouchesCancelled: () => {
        console.log('onTouchesCancelled');
      },
    };
    return (
      <View style={{ flex: 1, backgroundColor: 'orange' }}>
        <MultiTouchView style={{ flex: 1 }} {...props}>
          <View style={styles.container}>
            <Text style={styles.paragraph}>
              Change code in the editor and watch it change on your phone! Save
              to get a shareable url.
            </Text>
          </View>
        </MultiTouchView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
