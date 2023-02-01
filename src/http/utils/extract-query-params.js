/**
 * Convert string query parameters to object
 * @param {string} query Query parameters in the format: `?example=value&example2=value`
 * @returns {Object}
 */
export function extractQueryParams(query) {
  return query.substring(1).split('&').reduce((queryParams, param) => {
    const [key, value] = param.split('=');

    queryParams[key] = value;

    return queryParams;
  }, {});
}
