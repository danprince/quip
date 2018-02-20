import "./Title.css";
import { h } from "hyperapp";

function Title(props, children) {
  return (
    <div class="title">{children}</div>
  );
}

export default Title
