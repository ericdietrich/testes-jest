module.exports.queryString = obj =>
  Object.entries(obj)
    .map(([key, value]) => {
      if (typeof value === 'object' && !Array.isArray(value)) {
        throw new Error('Please check your params');
      }
      return `${key}=${value}`;
    })
    .join('&');

module.exports.parse = string =>
  Object.fromEntries(
    string.split('&').map(item => {
      let [key, value] = item.split('=');

      if (value.indexOf(',') > -1) {
        value = value.split(',');
      }

      return [key, value];
    }),
  );
