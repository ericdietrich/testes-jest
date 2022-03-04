const { queryString } = require('./queryString');

describe('Object to query string', () => {
  it('should create a valid query string when a object is provided', () => {
    const obj = {
      name: 'Eric',
      profession: 'developer',
    };

    expect(queryString(obj)).toBe('name=Eric&profession=developer');
  });
});
