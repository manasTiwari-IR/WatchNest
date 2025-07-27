import mongoose from "mongoose";

// Connect to the database
const connectDB = async () => {
  //console.log('Connecting to the database');
  //console.log(`${process.env.mongoURI}/${DB_NAME}`);
  try {
    await mongoose.connect(`${process.env.mongoURI}`, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds instead of 30
    });
    //console.log(connectionIns.connection.readyState);
    //console.log(connectionIns.connection.host);
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database");
    console.error(error);
    process.exit(1);
  }
};

export { connectDB };
