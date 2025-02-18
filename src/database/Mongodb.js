import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI ?? '');

client.connect();

export default client;
