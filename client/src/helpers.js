export function parseRoomId() {
  let hash = location.hash.slice(1);
  let path = location.pathname.slice(1);
  return (hash || path).toLowerCase();
}

export function delay(fn, ms=0) {
  return setTimeout(fn, ms);
}
