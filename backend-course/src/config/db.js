import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log(`connected to DB... ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log('Could not connect to MongDB', error);
    process.exit(1);
  }
};

export default connectDB;
