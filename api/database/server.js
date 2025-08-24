// config/db.js
import mongoose from 'mongoose';

let cached = global._mongoose;
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = process.env.DATABASE_URL;            // e.g. mongodb+srv://user:pass@cluster.xyz/mydb
    if (!uri) throw new Error('DATABASE_URL is missing');

    const dbName = process.env.DB_NAME || undefined; // optional
    cached.promise = mongoose
      .connect(uri, { dbName })
      .then((m) => {
        console.log('✅ MongoDB connected');
        return m;
      })
      .catch((err) => {
        console.error('❌ Mongo connect error:', err.message);
        throw err; // NEVER process.exit() on Vercel
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
