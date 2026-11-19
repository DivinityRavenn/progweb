import { connect, disconnect } from 'mongoose';
import { faker } from '@faker-js/faker';
import Contact from '../models/contactModel.js';

process.loadEnvFile();

export async function populateDB(count = 20) {
    try {
        const existingCount = await Contact.countDocuments();
        if (existingCount > 0) {
            console.log(`Database already populated (${existingCount} contacts)`);
            return;
        }

        const fakeContacts = Array.from({ length: count }, () => ({
            name: faker.person.fullName(),
            age: faker.number.int({ min: 18, max: 80 }),
            email: faker.internet.email(),
        }));

        await Contact.insertMany(fakeContacts);
        console.log(`${count} fake contacts inserted`);
    } catch (err) {
        console.error('Error populating DB:', err);
    }
}

async function connectDB() {
    try {
        console.log("Opening connection");
        const conn = await connect(process.env.MONGO_URI + '/' + process.env.DB_NAME, {
            //useNewUrlParser: true,
            //useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);

    } catch (err) {
        disconnect();
        console.error(err);
        process.exit(1);
    }
}

export default connectDB;