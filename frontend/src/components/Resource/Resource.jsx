import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useSearchParams, useLocation } from 'react-router-dom';
import * as Api from '../../store/api';
import * as resourcesDucks from '../../store/ducks/resources';

const Resource = ({
  autoFetch,
  resource,
  registerResource,
  children,
  resourceParams,
  preventParamsFromSearch,
  records,
  idFetch = true,
  ...props
}) => {
  const [search, setSearch] = useState('');

  let [searchParams] = useSearchParams();
  let location = useLocation();

  const buildSearchParams = (searchProps) => {
    let newParams = {};

    if (preventParamsFromSearch) {
      return { ...searchProps, ...resourceParams };
    }

    for (const [key, value] of searchParams.entries()) {
      newParams[key] = value;
    }

    return { ...newParams, ...searchProps, ...resourceParams };
  };

  const handleFetch = (searchProps = {}) => {
    const params = buildSearchParams(searchProps);

    if (props.id) {
      props.details(props.id, params);
    } else {
      props.fetchList(params);
    }
  };

  useEffect(() => {
    registerResource(resource);
  }, [resource]);

  useEffect(() => {
    if (autoFetch) {
      handleFetch();
    } else if (props.id && idFetch) {
      handleFetch();
    }
  }, [autoFetch]);

  useEffect(() => {
    if (
      location.search !== search &&
      !props.isLoading &&
      !props.id &&
      !preventParamsFromSearch
    ) {
      handleFetch();
    }

    setSearch(location.search);
  }, [location.search]);

  return children({ ...props, resource, records, handleFetch, autoFetch });
};

const mapStateToProps = (state, { resource, id }) => {
  const detailedRecord = id
    ? resourcesDucks.getDetailedRecord(state, resource, id)
    : undefined;

  return {
    isLoading: resourcesDucks.isLoading(state, resource),

    records: resourcesDucks.getRecords(state, resource),
    detailedRecords: resourcesDucks.getDetailedRecords(state, resource),
    detailedRecord,
    pagination: resourcesDucks.getPagination(state, resource),

    errors: resourcesDucks.getErrors(state, resource),

    isRemoving: resourcesDucks.isRemoving(state, resource),
    removingRecords: resourcesDucks.getRemovingRecords(state, resource),
    removedRecord: resourcesDucks.getRemovedRecord(state, resource),

    isSaving: resourcesDucks.isSaving(state, resource),
    savingRecords: resourcesDucks.getSavingRecords(state, resource),
    savedRecord: resourcesDucks.getSavingRecord(state, resource)
  };
};

const mapDispatchToProps =
  (state, { resource }) =>
  (dispatch) => {
    const actions = [
      'fetchList',
      'details',
      'create',
      'update',
      'remove',
      'setRecords',
      'updateDetails'
    ].reduce((previousValue, currentValue) => {
      // eslint-disable-next-line no-param-reassign
      previousValue[currentValue] = (...args) =>
        resourcesDucks[currentValue](
          {
            resource,
            api: Api[resource][currentValue]
          },
          ...args
        );

      return previousValue;
    }, {});

    return bindActionCreators(
      {
        registerResource: resourcesDucks.registerResource,
        ...actions
      },
      dispatch
    );
  };

export default connect(mapStateToProps, mapDispatchToProps)(Resource);
