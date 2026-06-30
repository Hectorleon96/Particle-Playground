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
    selected: false,
    active: false,
    position: {
      x: 0,
      y: 0,
    },
  };

  constructor(clientRects) {
    this.started = false;
    this.circles = [new Circle({ circle: this.#defaultCircleData })];
    this.hasSelectedCircles = false;
    this.clientRects = clientRects;
  }

  play() {
    this.started = true;

    const circlesToPlay = this.solveCirclesToUpdate();
    circlesToPlay.forEach((circle) => {
      circle.toggleActive();
    });

    const boxSizes = (INIT_BUTTON.textContent = "Pause");
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
    this.paintListItem(circle);
    this.paintCircle(circle);

    if (this.circles.length === this.#circlesLimit) {
      ADD_CIRCLE_BUTTON.disabled = true;
    }

    RESTART_CIRCLES_BUTTON.disabled = false;
  }

  #createPlaygroundCircleNode(circleInstance) {
    const node = document.createElement("div");
    node.dataset.id = circleInstance.id;
    node.dataset.selected = circleInstance.selected;
    node.dataset.active = circleInstance.active;
    node.dataset.circle = true;
    node.style.backgroundColor = this.#defaultColors[circleInstance.id - 1];
    node.style.zIndex = circleInstance.id;
    return node;
  }

  #createCircleListItem(circleInstance) {
    const node = document.createElement("button");
    node.dataset.listitem = true;
    node.dataset.forcircle = circleInstance.id;
    node.dataset.selected = false;
    node.dataset.active = false;
    node.style.backgroundColor = this.#defaultColors[circleInstance.id - 1];
    return node;
  }

  paintListItem(circleInstance) {
    const node = this.#createCircleListItem(circleInstance);
    CIRCLES_LIST_CONTAINER.appendChild(node);
    node.addEventListener("click", () => {
      circleInstance.toggleSelected();
      const activeCircles = this.getSelectedCircles();
      this.hasSelectedCircles = activeCircles.total > 0;
    });
  }

  paintCircle(circleInstance) {
    const node = this.#createPlaygroundCircleNode(circleInstance);
    CIRCLES_CONTAINER.appendChild(node);
    circleInstance.calculateInitialPosition(this.clientRects);

    node.addEventListener("click", () => {
      circleInstance.toggleSelected();
      const activeCircles = this.getSelectedCircles();
      this.hasSelectedCircles = activeCircles.total > 0;
    });
  }

  resetCirclesList() {
    CIRCLES_LIST_CONTAINER.replaceChildren();
    CIRCLES_CONTAINER.replaceChildren();
    this.circles = [new Circle({ circle: this.#defaultCircleData })];
    this.paintCircle(this.circles[0]);
    this.paintListItem(this.circles[0]);

    const defaultNode = this.circles[0].getNodeInDom();
    if (defaultNode) {
      defaultNode.dataset.selected = false;
      defaultNode.dataset.active = false;
    }

    const defaultListItemNode = this.circles[0].getListItemInDom();
    if (defaultListItemNode) {
      defaultListItemNode.dataset.selected = false;
      defaultListItemNode.dataset.active = false;
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
  #circleSize = 50;

  constructor({ circle }) {
    this.id = circle.id;
    this.selected = circle.selected;
    this.active = circle.active;
    this.position = circle.position;
  }

  toggleActive() {
    const newValue = !this.active;
    this.active = newValue;
    const domNode = this.getNodeInDom();
    domNode.dataset.active = newValue;
    const listItemNode = this.getListItemInDom();
    listItemNode.dataset.active = newValue;
  }

  toggleSelected() {
    const domNode = this.getNodeInDom();
    const newValue = !this.selected;
    this.selected = newValue;
    domNode.dataset.selected = newValue;
    const listItemNode = this.getListItemInDom();
    listItemNode.dataset.selected = newValue;
  }

  getNodeInDom() {
    return document.querySelector(`div[data-id='${this.id}']`);
  }

  getListItemInDom() {
    return document.querySelector(`button[data-forcircle='${this.id}']`);
  }

  calculateInitialPosition(clientRects) {
    const { width, height } = clientRects;

    const CIRCLE_SIZE = 50;

    const options = {
      1: {
        x: 0,
        y: 0,
      },
      2: {
        x: width - this.#circleSize,
        y: 0,
      },
      3: {
        x: 0,
        y: height - this.#circleSize,
      },
      4: {
        x: width - this.#circleSize,
        y: height - this.#circleSize,
      },
    };

    const positions = options[this.id];
    this.position = positions;
    const node = this.getNodeInDom();

    if (node) {
      node.style.translate = `${positions.x}px ${positions.y}px`;
    }
  }
}

const playground = new Playground(CIRCLES_CONTAINER.getBoundingClientRect());

if (playground.circles.length > 0) {
  playground.paintListItem(playground.circles[0]);
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
