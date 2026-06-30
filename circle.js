export class Circle {
  #circleSize = 50;

  constructor({ circle }) {
    this.id = circle.id;
    this.selected = circle.selected;
    this.position = circle.position;
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
        vx: 3,
      },
      2: {
        x: width - this.#circleSize,
        y: 0,
        vx: 3,
      },
      3: {
        x: 0,
        y: height - this.#circleSize,
        vx: 3,
      },
      4: {
        x: width - this.#circleSize,
        y: height - this.#circleSize,
        vx: -3,
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
