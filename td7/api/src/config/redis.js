import { createClient } from 'redis';

const redisClient = createClient({url:'redis://redis:6379'
});

redisClient.on('error', (err) => console.error('Erreur Redis :', err));
redisClient.on('connect', () => console.log('Cache Redis connecté'));

redisClient.connect();

export default redisClient;