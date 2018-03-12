import React from 'react';
import { PanResponder, View } from 'react-native';
import { PropTypes } from 'prop-types';
import MultiTouch from '../MultiTouch';

class MultiTouchView extends React.PureComponent {
  static propTypes = {
    onTouchBegan: PropTypes.func,
    onTouchMoved: PropTypes.func,
    onTouchEnded: PropTypes.func,
    onTouchCancelled: PropTypes.func,

    onTouchesBegan: PropTypes.func,
    onTouchesMoved: PropTypes.func,
    onTouchesEnded: PropTypes.func,
    onTouchesCancelled: PropTypes.func,

    onStartShouldSetPanResponder: PropTypes.func,
    onStartShouldSetPanResponderCapture: PropTypes.func,
    onMoveShouldSetPanResponder: PropTypes.func,
    onMoveShouldSetPanResponderCapture: PropTypes.func,
    onPanResponderTerminationRequest: PropTypes.func,
    onShouldBlockNativeResponder: PropTypes.func,
  };
  static defaultProps = {
    onTouchBegan: () => {},
    onTouchMoved: () => {},
    onTouchEnded: () => {},
    onTouchCancelled: () => {},

    onTouchesBegan: () => {},
    onTouchesMoved: () => {},
    onTouchesEnded: () => {},
    onTouchesCancelled: () => {},

    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderTerminationRequest: () => true,
    onShouldBlockNativeResponder: () => true,
  };

  multiTouch = null;

  onPanResponderGrant = ({ nativeEvent }, gestureState) => {
    const { onTouchesBegan } = this.props;
    const event = this._transformEvent({ ...nativeEvent, gestureState });
    this.multiTouch.onTouchesBegan(event);
    onTouchesBegan && onTouchesBegan(event);
  };

  onPanResponderMove = ({ nativeEvent }, gestureState) => {
    const { onTouchesMoved } = this.props;
    const event = this._transformEvent({ ...nativeEvent, gestureState });
    this.multiTouch.onTouchesMoved(event);
    onTouchesMoved && onTouchesMoved(event);
  };

  onPanResponderRelease = ({ nativeEvent }, gestureState) => {
    const { onTouchesEnded } = this.props;
    const event = this._transformEvent({ ...nativeEvent, gestureState });
    this.multiTouch.onTouchesEnded(event);
    onTouchesEnded && onTouchesEnded(event);
  };

  onPanResponderTerminate = ({ nativeEvent }, gestureState) => {
    const event = this._transformEvent({ ...nativeEvent, gestureState });

    this.multiTouch.onTouchesCancelled(event);
    const { onTouchesCancelled, onTouchesEnded } = this.props;
    if (onTouchesCancelled) {
      onTouchesCancelled(event);
    } else if (onTouchesEnded) {
      onTouchesEnded(event);
    }
  };

  _transformEvent = event => {
    const def = () => {};
    event.preventDefault = event.preventDefault || def;
    event.stopPropagation = event.stopPropagation || def;
    return event;
  };

  componentWrapFunc = (event, gestureState, eventKey) => {
    const func = this.props[eventKey];
    if (func) {
      return func(event, gestureState);
    }
    return false;
  };

  componentWillMount() {
    const { componentWrapFunc } = this;
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (event, gestureState) =>
        componentWrapFunc(event, gestureState, 'onMoveShouldSetPanResponder'),
      onStartShouldSetPanResponder: (event, gestureState) =>
        componentWrapFunc(event, gestureState, 'onStartShouldSetPanResponder'),
      onStartShouldSetPanResponderCapture: (event, gestureState) =>
        componentWrapFunc(event, gestureState, 'onStartShouldSetPanResponderCapture'),
      onPanResponderTerminationRequest: (event, gestureState) =>
        componentWrapFunc(event, gestureState, 'onPanResponderTerminationRequest'),
      onShouldBlockNativeResponder: (event, gestureState) =>
        componentWrapFunc(event, gestureState, 'onShouldBlockNativeResponder'),
      onMoveShouldSetPanResponderCapture: (event, gestureState) =>
        componentWrapFunc(event, gestureState, 'onMoveShouldSetPanResponderCapture'),

      onPanResponderGrant: this.onPanResponderGrant,
      onPanResponderMove: this.onPanResponderMove,
      onPanResponderRelease: this.onPanResponderRelease,
      onPanResponderTerminate: this.onPanResponderTerminate,
    });

    const { onTouchBegan, onTouchMoved, onTouchEnded, onTouchCancelled } = this.props;
    this.multiTouch = new MultiTouch({
      onTouchBegan,
      onTouchMoved,
      onTouchEnded,
      onTouchCancelled,
    });
  }

  persistedProps = ['onTouchBegan', 'onTouchMoved', 'onTouchEnded', 'onTouchCancelled'];
  componentWillReceiveProps(nextProps) {
    for (let key of this.persistedProps) {
      if (this.props[key] !== nextProps[key]) {
        this.multiTouch.events[key] = nextProps[key] || (() => {});
      }
    }
  }

  get panHandlers() {
    return this._panResponder.panHandlers;
  }

  render() {
    return <View {...this.props} {...this.panHandlers} />;
  }
}

export default MultiTouchView;
