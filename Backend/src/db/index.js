import { DB_NAME } from "../constants.js";
import mongoose from 'mongoose';

// Connect to the database
const connectDB = async () => {
    //console.log('Connecting to the database');
    //console.log(`${process.env.mongoURI}/${DB_NAME}`);
    try {
        await mongoose.connect(`${process.env.mongoURI}/${DB_NAME}`);
        //console.log(connectionIns.connection.readyState);
        //console.log(connectionIns.connection.host);
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database');
        console.error(error);
        process.exit(1);
    }
}

export { connectDB };