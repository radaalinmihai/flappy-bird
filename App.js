import React from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import Matter from 'matter-js';
import {GameEngine} from 'react-native-game-engine';
import Bird from './Bird';
import Constants from './constants';
import Physics from './Physics';
import Wall from './Wall';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      running: true,
    };

    this.gameEngine = React.createRef();
    this.entities = this.setupWorld();
  }
  setupWorld = () => {
    let engine = Matter.Engine.create({enableSleeping: false});
    let world = engine.world;

    let bird = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH / 4,
      Constants.MAX_HEIGHT / 2,
      50,
      50,
    );

    let floor = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH / 2,
      Constants.MAX_HEIGHT - 100,
      Constants.MAX_WIDTH,
      50,
      {isStatic: true},
    );

    let ceiling = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH / 2,
      25,
      Constants.MAX_WIDTH,
      50,
      {isStatic: true},
    );

    Matter.World.add(world, [bird, floor, ceiling]);

    return {
      physics: {engine: engine, world: world},
      bird: {body: bird, size: [50, 50], color: 'red', renderer: Bird},
      floor: {
        body: floor,
        size: [Constants.MAX_WIDTH, 50],
        color: 'green',
        renderer: Wall,
      },
      ceiling: {
        body: ceiling,
        size: [Constants.MAX_WIDTH, 50],
        color: 'green',
        renderer: Wall,
      },
    };
  };
  render() {
    const {running} = this.state;
    return (
      <View>
        <GameEngine
          ref={this.gameEngine}
          style={styles.gameContainer}
          running={running}
          systems={[Physics]}
          entities={this.entities}>
          <StatusBar hidden />
        </GameEngine>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gameContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
