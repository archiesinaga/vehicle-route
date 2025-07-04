import mongoose, { Mongoose } from 'mongoose';

// Extend NodeJS global type to cache the connection across Hot Reloads in Next.js
declare global {
  // eslint-disable-next-line no-var, @typescript-eslint/consistent-type-definitions
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  } | undefined;
}

mongoose.set('strictQuery', false); // atau true; sama-sama akan membungkam warning

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const cached = global.mongoose ?? (global.mongoose = { conn: null, promise: null });

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;