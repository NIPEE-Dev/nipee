export default (routeBase, prefix = null) => ({
  list: `${prefix ? `${prefix}/` : ''}${routeBase}`,
  index: `${prefix ? `${prefix}/` : ''}${routeBase}/*`,
  view: `${prefix ? `${prefix}/` : ''}${routeBase}/view/:id`,
  edit: `${prefix ? `${prefix}/` : ''}${routeBase}/edit/:id`,
  add: `${prefix ? `${prefix}/` : ''}${routeBase}/add`,
});
