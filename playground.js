import { ADD_CIRCLE_BUTTON, CIRCLES_CONTAINER, INIT_BUTTON } from "./dom.js";
import { Circle } from "./circle.js";

const CIRCLES_LIST_CONTAINER = document.getElementById(
  "circles-list-container",
);

export class Playground {
  #circlesLimit = 4;
  #defaultColors = ["#3E5C76", "#2A9D8F", "#E76F51", "#8338EC"];
  #defaultCircleData = {
    id: 1,
    selected: false,
    position: {
      x: 0,
      y: 0,
      vx: 3,
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
        circle.position.vx = -3;
        circle.position.x = xMax;
      } else if (circle.position.vx < 0 && x <= xMin) {
        circle.position.vx = 3;
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
    node.style.backgroundColor = this.#defaultColors[circleInstance.id - 1];
    return node;
  }

  paintListItem(circleInstance) {
    const node = this.#createCircleListItem(circleInstance);
    CIRCLES_LIST_CONTAINER.appendChild(node);
    node.addEventListener("click", () => {
      circleInstance.toggleSelected();
      const selectedCircles = this.getSelectedCircles();
      this.hasSelectedCircles = selectedCircles.total > 0;
    });
  }

  paintCircle(circleInstance) {
    const node = this.#createPlaygroundCircleNode(circleInstance);
    CIRCLES_CONTAINER.appendChild(node);
    circleInstance.calculateInitialPosition(this.clientRects);

    node.addEventListener("click", () => {
      circleInstance.toggleSelected();
      const selectedCircles = this.getSelectedCircles();
      this.hasSelectedCircles = selectedCircles.total > 0;
    });
  }

  getSelectedCircles() {
    const selectedCircles = this.circles.filter((circle) => circle.selected);
    return {
      total: selectedCircles.length,
      circles: selectedCircles,
    };
  }

  solveCirclesToUpdate() {
    const circles = this.hasSelectedCircles
      ? this.getSelectedCircles().circles
      : this.circles;

    return circles;
  }
}
