const { pool, getIds, upsert, convertArrayToSQLSyntax } = require('./../apiServer/databaseHelpers/postgresHelper.js');

describe('Postgres Helper', () => {

  test('connects to correct database', () => {
    expect(pool.options.database).toBe('loom_related');
    expect(pool.ended).toBe(false);
  });

  test('returns an array', () => {
    return getIds(1)
      .then((result) => {
        expect(Array.isArray(result.rows[0].relatedids)).toBe(true);
      });
  });

  test('returns corresponding product IDs', () => {
    return getIds(1)
      .then((result) => {
        expect(JSON.stringify(result.rows[0].relatedids)).toBe('[2,3,8,7]');
      });
  });

  test('converts arrays into postgres syntax', () => {
    expect(convertArrayToSQLSyntax([1,2,3,4])).toBe('\'{1, 2, 3, 4}\'');
  });

});