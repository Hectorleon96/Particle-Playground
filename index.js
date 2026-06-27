const INIT_BUTTON = document.getElementById("play-button");
const ADD_CIRCLE_BUTTON = document.getElementById("add-circle-button");
const CIRCLES_LIST_CONTAINER = document.getElementById(
  "circles-list-container",
);
const CIRCLES_CONTAINER = document.getElementById("circles-container");
const RESTART_CIRCLES_BUTTON = document.getElementById("reset-circles-button");

class Playground {
  #circlesLimit = 4;
  #defaultColors = ["#3E5C76", "#2A9D8F", "#E76F51", "#8338EC"];
  #defaultCircleData = {
    id: 1,
    direction: "right",
    speed: 3,
    selected: false,
    active: false,
  };

  constructor() {
    this.started = false;
    this.circles = [new Circle({ circle: this.#defaultCircleData })];
  }

  play() {
    this.started = true;
    INIT_BUTTON.textContent = "Pause";
  }

  pause() {
    this.started = false;
    INIT_BUTTON.textContent = "Play";
  }

  addCircle() {
    const lastCircle = this.circles[this.circles.length - 1];
    const id = lastCircle.id + 1;
    const data = { ...this.#defaultCircleData, id };
    const circle = new Circle({
      circle: data,
    });

    this.circles.push(circle);
    this.paintCircle(circle);

    if (this.circles.length === this.#circlesLimit) {
      ADD_CIRCLE_BUTTON.disabled = true;
    }

    RESTART_CIRCLES_BUTTON.disabled = false;
  }

  #createCircleNode(circleInstance) {
    const node = document.createElement("div");
    node.dataset.id = circleInstance.id;
    node.dataset.selected = circleInstance.selected;
    node.dataset.active = circleInstance.active;
    node.dataset.circle = true;
    node.style.backgroundColor = this.#defaultColors[circleInstance.id - 1];
    node.style.zIndex = circleInstance.id;

    return node;
  }

  paintCircle(circleInstance) {
    const node = this.#createCircleNode(circleInstance);
    CIRCLES_CONTAINER.appendChild(node);
    node.addEventListener("click", () => circleInstance.toggleSelected(node));
  }

  resetCirclesList() {
    CIRCLES_CONTAINER.replaceChildren();
    this.circles = [new Circle({ circle: this.#defaultCircleData })];
    this.paintCircle(this.circles[0]);

    const defaultNode = document.querySelector("div[data-id='1']");
    if (defaultNode) {
      defaultNode.dataset.selected = false;
    }

    RESTART_CIRCLES_BUTTON.disabled = true;
  }
}

class Circle {
  constructor({ circle }) {
    this.id = circle.id;
    this.direction = circle.direction;
    this.speed = circle.speed;
    this.selected = circle.selected;
    this.active = circle.active;
  }

  toggleInit() {
    this.active = !this.active;
  }

  toggleSelected(circleNode) {
    const selected = !this.selected;
    this.selected = selected;
    circleNode.dataset.selected = selected;
  }
}

const playground = new Playground([]);

if (playground.circles.length > 0) {
  playground.paintCircle(playground.circles[0]);
}

INIT_BUTTON.addEventListener("click", () => {
  if (playground.started) {
    playground.pause();
  } else {
    playground.play();
  }
});

ADD_CIRCLE_BUTTON.addEventListener("click", () => playground.addCircle());

RESTART_CIRCLES_BUTTON.addEventListener("click", () =>
  playground.resetCirclesList(),
);
