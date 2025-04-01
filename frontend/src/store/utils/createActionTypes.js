export default function createActionTypes (namespace, actions) {
  const actionTypes = {}

  actions.forEach(action => {
    actionTypes[action] = `${namespace}/${action}`
  })

  return actionTypes
}
