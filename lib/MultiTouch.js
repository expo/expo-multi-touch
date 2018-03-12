const diffArray = function(arr, a) {
  return arr.filter(function(i) {
    return a.indexOf(i) < 0;
  });
};

class MultiTouch {
  _lastTouches = {};

  get lastTouches() {
    return Object.values(this._lastTouches);
  }

  set lastTouches(value) {
    let touchDict = {};

    for (let touch of value) {
      touchDict[touch.identifier] = touch;
    }
    this._lastTouches = touchDict;
  }

  initialTouches = {};
  maxTapTime = 500;
  maxTapDistance = 2;
  events = null;

  constructor({ onTouchBegan, onTouchMoved, onTouchEnded, onTouchCancelled }) {
    const def = () => {};
    this.events = {
      onTouchBegan: onTouchBegan || def,
      onTouchMoved: onTouchMoved || def,
      onTouchEnded: onTouchEnded || def,
      onTouchCancelled: onTouchCancelled || def,
    };
  }

  onTouchesBegan = ({ touches }) => {
    touches.forEach(this._onTouchBegan);
    this.lastTouches = touches;
  };

  onTouchesMoved = ({ touches }) => {
    const touchDict = this.getDictForTouches(touches);
    const lastTouchCount = this.lastTouches.length;

    if (touches.length > lastTouchCount) {
      this._compareEventsAndProcess(touchDict, this._lastTouches, this._onTouchBegan);
    } else if (touches.length < lastTouchCount) {
      this._compareEventsAndProcess(this._lastTouches, touchDict, this._onTouchEnded);
    } else {
      touches.forEach(this._onTouchMoved);
    }

    this._lastTouches = touchDict;
  };

  onTouchesEnded = event => this._parseTerminalTouchEvent(event, 'onTouchEnded');
  onTouchesCancelled = event => this._parseTerminalTouchEvent(event, 'onTouchCancelled');

  _onTouchBegan = event => {
    const { identifier } = event;
    this.events.onTouchBegan && this.events.onTouchBegan(event);
    this.initialTouches[identifier] = event;
  };

  getDictForTouches(touches) {
    let dict = {};
    for (const touch of touches) {
      dict[touch.identifier] = touch;
    }
    return dict;
  }

  getHistoricEvent = id => this.initialTouches[id] || this._lastTouches[id];

  getDeltaProps = event => {
    const { identifier, locationX, locationY, timestamp } = event;

    const initialTouch = this.getHistoricEvent(identifier);
    if (!initialTouch) {
      return {};
    }
    const deltaX = locationX - initialTouch.locationX;
    const deltaY = locationY - initialTouch.locationY;
    const deltaTime = timestamp - initialTouch.timestamp;

    let isTap = false;
    let isLongPress = false;

    if (Math.sqrt(deltaX, deltaY) < this.maxTapDistance) {
      if (deltaTime < this.maxTapTime) {
        isTap = true;
      } else {
        isLongPress = true;
      }
    }

    return {
      initialTouch,
      deltaX,
      deltaY,
      deltaTime,
      isTap,
      isLongPress,
    };
  };

  _onTouchMoved = event => {
    const deltaProps = this.getDeltaProps(event);
    this.events.onTouchMoved && this.events.onTouchMoved({ ...deltaProps, ...event });
  };

  _onTouchEnded = (event, eventName = 'onTouchEnded') => {
    const deltaProps = this.getDeltaProps(event);
    this.events[eventName] && this.events[eventName]({ ...deltaProps, ...event });
    const { identifier } = event;
    delete this.initialTouches[identifier];
    delete this._lastTouches[identifier];
  };

  _parseTerminalTouchEvent = (event, eventName) => {
    const { touches } = event;

    if (touches.length < this.lastTouches.length) {
      const touchDict = this.getDictForTouches(touches);
      this._compareEventsAndProcess(this._lastTouches, touchDict, next =>
        this._onTouchEnded(next, eventName)
      );
    }
    this._lastTouches = {};
  };

  _compareEventsAndProcess = (more, less, callback) => {
    const diff = diffArray(Object.keys(more), Object.keys(less));
    for (const id of diff) {
      const next = more[id];
      callback(next);
    }
  };
}
export default MultiTouch;
