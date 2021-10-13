const Promise = require('bluebird');
const { Client, Pool } = require('pg');

const pool = new Pool({
  host: 'ec2-54-146-195-234.compute-1.amazonaws.com',
  user: 'postgres',
  database: 'loom_related',
  port: 5432,
  max: 1500
});
pool.queryAsync = Promise.promisify(pool.query);

const getIds = (id) => {
  return pool.queryAsync(`SELECT * FROM products WHERE productid = ${id} LIMIT 1`);
};

const upsert = ( {productid, relatedids} ) => {
  return pool.queryAsync(`SELECT * FROM products WHERE productid = ${productid} LIMIT 1`)
    .then(({ rows }) => {
      if (rows.length > 0) {
        console.log(`id ${productid} found!\n`, rows);
        let newReleatedIds = convertArrayToSQLSyntax(rows[0].relatedids.concat(relatedids.filter((id) => rows[0].relatedids.indexOf(id) === -1)));
        return pool.queryAsync(`UPDATE products SET relatedids = ${newReleatedIds} WHERE productid = ${productid}`)
      } else {
        console.log(`no entry found for id ${productid}\n`, rows);
        return pool.queryAsync(`INSERT INTO products VALUES (${productid}, ${convertArrayToSQLSyntax(relatedids)})`)
      }
    })
};

const convertArrayToSQLSyntax = (arr) => {
  let result = '\'{';
  for (let i = 0; i < arr.length; i++) {
    result += arr[i];
    result += i + 1 === arr.length ? '}\'' : ', ';
  }
  return result;
};

module.exports= {
  getIds,
  upsert,
  pool, convertArrayToSQLSyntax
};
