export const createQueryParams = (params = {}, prefix = '?') => {
  Object.keys(params).forEach((field) => {
    if (params[field] === undefined || params[field] === '') delete params[field];
  });
  return `${prefix}${new URLSearchParams(params).toString()}`;
};

export const getSearchFromHref = () => {
  if (typeof window === 'undefined') {
    return '';
  }
  const { href } = window.location;
  const indexSearch = href.indexOf('?');
  if (indexSearch === -1) {
    return '';
  }
  return href.substring(indexSearch);
};

export const getHrefNoQueryParams = () => {
  if (typeof window === 'undefined') {
    return '';
  }
  const { href } = window.location;
  const indexSearch = href.indexOf('?');
  if (indexSearch === -1) {
    return href;
  }
  return href.substring(0, indexSearch);
};

export const getQueryParams = (search) => {
  let searchQuery = search;
  if (!searchQuery) {
    searchQuery = getSearchFromHref();
  }
  const params = new URLSearchParams(searchQuery) || {};
  const paramObj = {};
  Array.from(params.keys()).forEach((value) => {
    paramObj[value] = params.get(value);
  });
  return paramObj;
};

export const updateQueryParams = (params = {}) => {
  const queryParams = createQueryParams({ ...params, _time: new Date().getTime() });
  const hrefNoQueryParams = getHrefNoQueryParams();
  return hrefNoQueryParams + queryParams;
};
