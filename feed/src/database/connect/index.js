const cassandra = require('cassandra-driver');
let DB = {}

async function connectToCassandra() {
  const contactPoints = ["localhost"];
  const client = new cassandra.Client({ contactPoints, localDataCenter: 'datacenter1', keyspace: 'user_feed' });

  try {
    await client.connect();
    console.log('Connected to Cassandra');
    DB["connection"] = client;
    return client;
  } catch (err) {
    console.error('Error connecting to Cassandra:', err);
    throw err; 
  } 
}

module.exports = { connectToCassandra, DB };
