const { queryString, parse } = require('./queryString');

describe('Object to query string', () => {
  it('should create a valid query string when a object is provided', () => {
    const obj = {
      name: 'Eric',
      profession: 'developer',
    };

    expect(queryString(obj)).toBe('name=Eric&profession=developer');
  });

  it('should create a valid query string even when array is passed as value', () => {
    const obj = {
      name: 'Eric',
      abilities: ['JS', 'TDD'],
    };

    expect(queryString(obj)).toBe('name=Eric&abilities=JS,TDD');
  });

  it('should throw an error when an object is passed as value', () => {
    const obj = {
      name: 'Eric',
      abilities: {
        first: 'JS',
        second: 'TDD',
      },
    };

    expect(() => {
      queryString(obj);
    }).toThrowError();
  });
});

describe('Query string to object', () => {
  it('should convert a query string to object', () => {
    const qs = 'name=Eric&profession=developer';

    expect(parse(qs)).toEqual({
      name: 'Eric',
      profession: 'developer',
    });
  });

  it('should convert a query string of a single key-value pair to object', () => {
    const qs = 'name=Eric';

    expect(parse(qs)).toEqual({
      name: 'Eric',
    });
  });
});
