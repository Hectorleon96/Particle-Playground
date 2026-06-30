const INIT_BUTTON = document.getElementById("play-button");
const ADD_CIRCLE_BUTTON = document.getElementById("add-circle-button");
const CIRCLES_LIST_CONTAINER = document.getElementById(
  "circles-list-container",
);
const CIRCLES_CONTAINER = document.getElementById("circles-container");

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
      vx: 1,
    },
  };

  constructor(clientRects) {
    this.started = false;
    this.circles = [new Circle({ circle: this.#defaultCircleData })];
    this.hasSelectedCircles = false;
    this.clientRects = clientRects;
    this.requestAnimationId;
  }

  play() {
    this.started = true;
    const boxSizes = (INIT_BUTTON.textContent = "Pause");

    this.circles.forEach((circle) => {
      circle.toggleActive();
    });

    requestAnimationFrame(this.animate.bind(this));
  }

  animate() {
    if (!this.started) return;

    const container = CIRCLES_CONTAINER;

    const { width } = container.getBoundingClientRect();

    const circleSize = 50;
    const xMin = 0;
    const xMax = width - circleSize;

    const circlesToPlay = this.solveCirclesToUpdate();

    circlesToPlay.forEach((circle) => {
      const x = circle.position.x;

      if (circle.position.vx > 0 && x >= xMax) {
        circle.position.vx = -1;
        circle.position.x = xMax;
      } else if (circle.position.vx < 0 && x <= xMin) {
        circle.position.vx = 1;
        circle.position.x = xMin;
      } else {
        circle.position.x += circle.position.vx;
      }

      const node = circle.getNodeInDom();
      node.style.translate = `${circle.position.x}px ${circle.position.y}px`;
    });

    this.requestAnimationId = requestAnimationFrame(this.animate.bind(this));
  }

  pause() {
    this.started = false;

    const circlesToPause = this.solveCirclesToUpdate();
    circlesToPause.forEach((circle) => {
      circle.toggleActive();
    });

    INIT_BUTTON.textContent = "Play";
    cancelAnimationFrame(this.requestAnimationId);
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
        vx: 1,
      },
      2: {
        x: width - this.#circleSize,
        y: 0,
        vx: -1,
      },
      3: {
        x: 0,
        y: height - this.#circleSize,
        vx: 1,
      },
      4: {
        x: width - this.#circleSize,
        y: height - this.#circleSize,
        vx: -1,
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
