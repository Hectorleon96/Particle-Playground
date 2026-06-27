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
    this.hasSelectedCircles = false;
  }

  play() {
    this.started = true;

    const circlesToPlay = this.solveCirclesToUpdate();
    circlesToPlay.forEach((circle) => {
      circle.toggleActive();
    });

    INIT_BUTTON.textContent = "Pause";
  }

  pause() {
    this.started = false;

    const circlesToPause = this.solveCirclesToUpdate();
    circlesToPause.forEach((circle) => {
      circle.toggleActive();
    });

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
    node.addEventListener("click", () => {
      circleInstance.toggleSelected();
      const activeCircles = this.getSelectedCircles();
      this.hasSelectedCircles = activeCircles.total > 0;
    });
  }

  resetCirclesList() {
    CIRCLES_CONTAINER.replaceChildren();
    this.circles = [new Circle({ circle: this.#defaultCircleData })];
    this.paintCircle(this.circles[0]);

    const defaultNode = this.circles[0].getNodeInDom();
    if (defaultNode) {
      defaultNode.dataset.selected = false;
    }

    this.hasSelectedCircles = false;
    ADD_CIRCLE_BUTTON.disabled = false;
    RESTART_CIRCLES_BUTTON.disabled = true;
  }

  getSelectedCircles() {
    const activeCircles = this.circles.filter((circle) => circle.selected);
    return {
      total: activeCircles.length,
      circles: activeCircles,
    };
  }

  solveCirclesToUpdate() {
    const circles = this.hasSelectedCircles
      ? this.getSelectedCircles().circles
      : this.circles;

    return circles;
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

  toggleActive() {
    const newValue = !this.active;
    this.active = newValue;
    const domNode = this.getNodeInDom();
    domNode.dataset.active = newValue;
  }

  toggleSelected() {
    const domNode = this.getNodeInDom();
    const selected = !this.selected;
    this.selected = selected;
    domNode.dataset.selected = selected;
  }

  getNodeInDom() {
    return document.querySelector(`div[data-id='${this.id}']`);
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
