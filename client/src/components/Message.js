import "./Message.css";
import { h } from "hyperapp";

function Message({ type="default", title }, children) {
  return (
    <div class={`message message-type-${type}`} >
      <div class="message-title">{title}</div>
      <div class="message-body">{children}</div>
    </div>
  );
}

export default Message
