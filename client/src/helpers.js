export function parseRoomId() {
  let hash = location.hash.slice(1);
  let path = location.pathname.slice(1);
  return (hash || path).toLowerCase();
}

export function timer() {

}
