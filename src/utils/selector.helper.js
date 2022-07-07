import _ from 'lodash';

const createLoadingSelector = actions => state =>  {
    return _(actions).some(action => _.get(state, `loading.${action}`));
}
const createErrorMessageSelector = actions => state =>  {
  return (
    _(actions)
      .map(action => _.get(state, `error.${action}`))
      .compact()
      .first() || ''
  );
    
}
export {createLoadingSelector,createErrorMessageSelector};