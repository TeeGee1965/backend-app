// Seed the database with sample users.
// Run with: npm run seed
//
// WARNING: this first DELETES all existing users.

import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { User } from './models/user.model.js';

config();

const users = [
  { name: 'Alice', email: 'alice@example.com', password: 'password123' },
  { name: 'Bob', email: 'bob@example.com', password: 'password123' },
  { name: 'Charlie', email: 'charlie@example.com', password: 'password123' },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  // Make the database indexes match the models before inserting:
  // creates missing ones and drops old ones the models no longer define
  // (e.g. the unique "username" index from an earlier version of the User model)
  await User.syncIndexes();

  // Clear existing data
  await User.deleteMany({});
  console.log('Cleared existing data');

  // Hash passwords the same way the register endpoint does
  const createdUsers = await User.insertMany(
    await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      })),
    ),
  );

  console.log(`Seeded ${createdUsers.length} users`);
};

try {
  await seed();
} catch (error) {
  console.error('Seeding failed:', error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
