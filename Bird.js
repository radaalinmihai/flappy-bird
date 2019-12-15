import React from 'react';
import {View} from 'react-native';

export default class Bird extends React.Component {
  render() {
    const width = this.props.size[0],
      height = this.props.size[1],
      x = this.props.body.position.x - width / 2,
      y = this.props.body.position.y - height / 2;

    return (
      <View
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width,
          height,
          backgroundColor: this.props.color,
        }}
      />
    );
  }
}
