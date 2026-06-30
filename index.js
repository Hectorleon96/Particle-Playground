import { ADD_CIRCLE_BUTTON, CIRCLES_CONTAINER, INIT_BUTTON } from "./dom.js";
import { Playground } from "./playground.js";

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
