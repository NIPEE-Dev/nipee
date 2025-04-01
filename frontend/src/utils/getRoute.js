export default function getRoute(route, params = {}) {
  return route.replace(/:([^/]+)/g, (a, b) =>
    params.hasOwnProperty(b) ? params[b] : a
  );
}
