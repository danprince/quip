import "./App.css";
import { h } from "hyperapp";

function App({}, children) {
  return (
    <div class="app">
      {children}
    </div>
  );
}

export default App;
