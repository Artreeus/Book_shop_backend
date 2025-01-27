// src/server.ts
import mongoose from 'mongoose';
import app from './app';
import config from './config';

async function connectDatabase() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log('Database connection successful');

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Database connection failed', error);
    process.exit(1);
  }
}

connectDatabase();