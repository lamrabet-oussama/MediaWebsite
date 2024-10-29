import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected");
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const collectionNames = collections.map((col) => col.name);

    console.log("Collections in the database:", collectionNames);
  } catch (error) {
    console.log("Error connection to DB:", error.cause);
    process.exit(1);
  }
};
export default connectDB;
