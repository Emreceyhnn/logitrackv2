import dotenv from 'dotenv';
dotenv.config();
console.log('DATABASE_URL:', process.env.DATABASE_URL);
if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("'")) {
  console.log('Detected single quotes at the start of DATABASE_URL');
}
