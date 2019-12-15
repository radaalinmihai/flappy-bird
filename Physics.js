import Matter from "matter-js";

const Physics = (entities, { touches, time }) => {
    let engine = entities.physics.engine;
    let bird = entities.bird.body;

    console.log(touches);

    touches.filter(t => t.type === "press").forEach(t => {
        console.log(t.type);
        Matter.Body.applyForce( bird, bird.position, {x: 0.00, y: -1.00});
    });

    Matter.Engine.update(engine, time.delta);
    return entities;
};

export default Physics;