import "./Container.css"
import { h } from "hyperapp";

function Container(props, children) {
  return (
    <div class="container">
      {children}
    </div>
  );
}

export default Container
