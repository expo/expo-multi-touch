import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { MultiTouchView } from 'expo-multi-touch';

const colors = ['red', 'blue', 'yellow', 'green', 'orange', 'cyan', 'plum', 'gray', 'purple'];
export default class App extends Component {
  state = {
    touches: {},
  };

  touchProps = {
    onTouchBegan: event => {
      const { identifier } = event;
      this.setState(previous => ({
        touches: {
          ...previous.touches,
          [identifier]: event,
        },
      }));
    },
    onTouchMoved: event => {
      const { identifier } = event;
      this.setState(previous => ({
        touches: {
          ...previous.touches,
          [identifier]: event,
        },
      }));
    },
    onTouchEnded: event => {
      const { identifier, deltaX, deltaY, isTap } = event;
      this.setState(previous => ({
        touches: {
          ...previous.touches,
          [identifier]: null,
        },
      }));
    },
    onTouchCancelled: event => {
      const { identifier, deltaX, deltaY, isTap } = event;
      this.setState(previous => ({
        touches: {
          ...previous.touches,
          [identifier]: null,
        },
      }));
    },
    onTouchesBegan: () => {
      console.log('onTouchesBegan');
    },
    onTouchesMoved: () => {},
    onTouchesEnded: () => {
      console.log('onTouchesEnded');
    },
    onTouchesCancelled: () => {
      console.log('onTouchesCancelled');
    },
  };

  render() {
    const { touches } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: 'orange' }}>
        <MultiTouchView style={{ flex: 1 }} {...this.touchProps}>
          <View style={styles.container}>
            <Text style={styles.paragraph}>Touch around...</Text>

            {Object.values(touches).map((item, index) => {
              if (!item) {
                return null;
              }
              console.log(index, item.locationX);

              return (
                <View
                  key={index}
                  style={[
                    styles.touch,
                    {
                      transform: [
                        { translateX: -TOUCH_SIZE / 2 },
                        { translateY: -TOUCH_SIZE / 2 },
                        { scale: 1 + (item.force || 0) * 2 },
                      ],
                      backgroundColor: colors[index % colors.length],
                      top: item.pageY,
                      left: item.pageX,
                    },
                  ]}
                />
              );
            })}
          </View>
        </MultiTouchView>
      </View>
    );
  }
}

const TOUCH_SIZE = 56;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  touch: {
    position: 'absolute',
    aspectRatio: 1,
    width: TOUCH_SIZE,
    borderRadius: TOUCH_SIZE / 2,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
