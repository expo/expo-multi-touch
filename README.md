# expo-multi-touch

Module for getting events whenever a individual touch changes

[![NPM](https://nodei.co/npm/expo-multi-touch.png)](https://nodei.co/npm/expo-multi-touch/)


To get started: `yarn add expo-multi-touch` in your Expo project and import it with
`import { MultiTouchView } from 'expo-multi-touch';`.

## Components

### `<MultiTouchView />`

Wrap your components with this component and use it to get notified whenever a touch begins, moves, ends, or cancels.

#### Props

| Property    |            Type             | Default  | Description                                     |
| ----------- | :-------------------------: | :------: | ----------------------------------------------- |
| onTouchBegan   																									|  function 	 | function   | called when a single touch begins 						|
| onTouchMoved   																									|  function 	 | function   | called when a single touch moves 						|
| onTouchEnded   																									|  function 	 | function   | called when a single touch ends 						|
| onTouchCancelled  																							 	|  function 	 | function   | called when a single touch cancels 						|
| onTouchesBegan   																									|  function 	 | function   | called when a touch begins (onPanResponderGrant) 		|
| onTouchesMoved   																							 		|  function 	 | function   | called when a touch moves (onPanResponderMove)  		|
| onTouchesEnded   																									|  function 	 | function   | called when a touch ends (onPanResponderRelease) 		|
| onTouchesCancelled                                                                                              	|  function 	 | function   | called when a touch cancels (onPanResponderTerminate) 	|
| [onStartShouldSetPanResponder](https://facebook.github.io/react-native/docs/panresponder.html#methods)           	|  () => Boolean | () => true | Ask to be the responder									|
| [onStartShouldSetPanResponderCapture](https://facebook.github.io/react-native/docs/panresponder.html#methods)   	|  () => Boolean | () => true | Ask to be the responder									|
| [onMoveShouldSetPanResponder](https://facebook.github.io/react-native/docs/panresponder.html#methods)   	        |  () => Boolean | () => true | Ask to be the responder									|
| [onMoveShouldSetPanResponderCapture](https://facebook.github.io/react-native/docs/panresponder.html#methods)     	|  () => Boolean | () => true | Ask to be the responder									|
| [onPanResponderTerminationRequest](https://facebook.github.io/react-native/docs/panresponder.html#methods)      	|  () => Boolean | () => true | Should the responder terminate the request 				|
| [onShouldBlockNativeResponder](https://facebook.github.io/react-native/docs/panresponder.html#methods)   	        |  () => Boolean | () => true | Android: Should the responder block native requests 	|


#### Structure

A function is passed an event with the following structure: 
```js
event = ({
  ...event.nativeEvent,
  preventDefault: () => {},
  stopPropagation: () => {},
  gestureState
}) => {

}
```
**instead of**
```js
event = (event, gestureState) => {}
```

## Example

**Snack**

```js
import React from 'react';
import { View } from 'react-native';
import { MultiTouchView } from 'expo-multi-touch';

class App extends React.Component {
  render() {
     const props = {
      onTouchBegan: ({ identifier }) => {
        console.log('onTouchBegan', identifier);
      },
      onTouchEnded: event => {
        const { identifier, deltaX, deltaY, isTap, isLongPress } = event;
        console.log('onTouchEnded', identifier, deltaX, deltaY, isTap, isLongPress);
      },
      onTouchesBegan: ({ gestureState }) => {
        console.log('onTouchesBegan', gestureState);
      },
      onTouchesMoved: () => {
      },
      onTouchesEnded: () => {
        console.log('onTouchesEnded');
      },
      onTouchesCancelled: () => {
        console.log('onTouchesCancelled');
      },
    };

    return (
      <MultiTouchView
        style={{ flex: 1 }}
        {...props}>
          <View />
      </MultiTouchView>
    )
  }
}
```