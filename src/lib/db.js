import mongoose, { connection } from "mongoose";
import dotenv from "dotenv";

let cachedConnection = null;

dotenv.config();

export const connect = async () => {
  if (cachedConnection) {
    console.log("Using cached MongoDB connection");
    return cachedConnection;
  }
  try {
    const cnx = await mongoose.connect(process.env.MONGODB_URI);
    cachedConnection = cnx.connection;
    console.log("Connected to MongoDB");
    return cachedConnection;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

export const disconnect = async () => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("MongoDB disconnection failed:", error);
  }
};

connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);
connection.once("open", () => {
  console.log("MongoDB connection open");
});

export default mongoose;
