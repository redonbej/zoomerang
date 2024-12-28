import { createClient } from 'redis';

const redis = createClient({
    // password: process.env.REDIS_PASSWORD,
});

redis.on('error', err => console.log('Redis Client Error', err));

await redis.connect();

export default redis;