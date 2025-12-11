import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://iyonicorp:iyonicorp@iyonicweb.ypgpsxv.mongodb.net/?retryWrites=true&w=majority&appName=iyonicweb';

async function updateAdminRole() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = process.env.ADMIN_EMAIL;
    const result = await User.updateOne(
      { email: adminEmail },
      { role: 'admin' }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Admin role updated successfully!');
    } else {
      console.log('⚠️ No user updated. Check if admin email exists.');
    }

  } catch (error) {
    console.error('Error updating admin role:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

updateAdminRole();
