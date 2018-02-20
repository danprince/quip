import "./CodeViewer.css";
import { h } from "hyperapp";

function CodeViewer({ value }) {
  return (
    <div class="code-viewer">
      <a href={`/${value}`} target="_blank">
        <div class="code-viewer-code">{value}</div>
      </a>
    </div>
  );
}

export default CodeViewer
