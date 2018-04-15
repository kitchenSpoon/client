import { compose, withState, withProps, withPropsOnChange } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withData, withProgress, progressValues } from 'spunky';

import AddressBar from './AddressBar';
import nameServiceActions from '../../../actions/nameServiceActions';

const { LOADED } = progressValues;

const mapNameServiceDataToProps = (data) => ({
  nameServiceQuery: data && data.query,
  target: data && data.target
});

export default compose(
  withRouter,
  withData(nameServiceActions, mapNameServiceDataToProps),
  withProgress(nameServiceActions),
  withProps((props) => ({
    doQuery: (query) => props.history.push(`/browser/${encodeURIComponent(query)}`)
  })),
  withState('query', 'setQuery', ({ nameServiceQuery }) => nameServiceQuery || 'nos.neo'),
  withPropsOnChange(
    (props, nextProps) => props.progress !== LOADED && nextProps.progress === LOADED,
    (props) => ({ query: props.nameServiceQuery })
  )
)(AddressBar);
