import React from 'react';
import {StyleSheet, View, StatusBar, TouchableOpacity, Text} from 'react-native';
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
  randomBetween = (min, max) => Math.floor(Math.random() * (max - min) + min);
  generatePipes = () => {
    let topPipeHeight = this.randomBetween(100, Constants.MAX_HEIGHT / 2 - 100),
      bottomPipeHeight =
        Constants.MAX_HEIGHT - topPipeHeight - Constants.GAP_SIZE,
      sizes = [topPipeHeight, bottomPipeHeight];

    if (Math.random() < 0.5) sizes = sizes.reverse();
    return sizes;
  };
  setupWorld = () => {
    let engine = Matter.Engine.create({enableSleeping: false});
    let world = engine.world;
    world.gravity.y = 1.2;

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

    let [pipe1Height, pipe2Height] = this.generatePipes();

    let pipe1 = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH - Constants.PIPE_WIDTH / 2,
      pipe1Height / 2,
      Constants.PIPE_WIDTH,
      pipe1Height,
      {isStatic: true},
    );

    let pipe2 = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH - Constants.PIPE_WIDTH / 2,
      Constants.MAX_HEIGHT - pipe2Height / 2,
      Constants.PIPE_WIDTH,
      pipe2Height,
      {isStatic: true},
    );

    let [pipe3Height, pipe4Height] = this.generatePipes();

    let pipe3 = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH * 2 - Constants.PIPE_WIDTH / 2,
      pipe3Height / 2,
      Constants.PIPE_WIDTH,
      pipe3Height,
      {isStatic: true},
    );

    let pipe4 = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH * 2 - Constants.PIPE_WIDTH / 2,
      Constants.MAX_HEIGHT - pipe4Height / 2,
      Constants.PIPE_WIDTH,
      pipe4Height,
      {isStatic: true},
    );

    Matter.World.add(world, [bird, floor, ceiling, pipe1, pipe2, pipe3, pipe4]);

    Matter.Events.on(engine, 'collisionStart', event => {
      let pairs = event.pairs;
      this.gameEngine.current.dispatch({type: 'game-over'});
    });

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
      pipe1: {
        body: pipe1,
        size: [Constants.PIPE_WIDTH, pipe1Height],
        color: 'green',
        renderer: Wall,
      },
      pipe2: {
        body: pipe2,
        size: [Constants.PIPE_WIDTH, pipe2Height],
        color: 'green',
        renderer: Wall,
      },
      pipe3: {
        body: pipe3,
        size: [Constants.PIPE_WIDTH, pipe3Height],
        color: 'green',
        renderer: Wall,
      },
      pipe4: {
        body: pipe4,
        size: [Constants.PIPE_WIDTH, pipe4Height],
        color: 'green',
        renderer: Wall,
      },
    };
  };
  onEvent = e => {
    if (e.type === 'game-over')
      this.setState({
        running: false,
      });
  };
  reset = () => {
    this.gameEngine.current.swap(this.setupWorld());
    this.setState({running: true});
  };
  render() {
    const {running} = this.state;
    return (
      <View style={styles.container}>
        <GameEngine
          ref={this.gameEngine}
          style={styles.gameContainer}
          running={running}
          systems={[Physics]}
          onEvent={this.onEvent}
          entities={this.entities}>
          <StatusBar hidden />
          {!running && (
            <TouchableOpacity style={styles.fullscreenButton} onPress={this.reset}>
              <View style={styles.fullscreen}>
                <Text style={styles.gameOverText}>Game Over</Text>
              </View>
            </TouchableOpacity>
          )}
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
  gameOverText: {
    color: 'white',
    fontSize: 48
  },
  fullscreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fullscreenButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
  }
});
