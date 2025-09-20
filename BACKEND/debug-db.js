import dotenv from 'dotenv';
dotenv.config();

console.log('🔍 Database Configuration Debug\n');

console.log('Environment Variables:');
console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);
console.log(`DB_HOST: ${process.env.DB_HOST}`);
console.log(`DB_PORT: ${process.env.DB_PORT}`);
console.log(`DB_NAME: ${process.env.DB_NAME}`);
console.log(`DB_USER: ${process.env.DB_USER}`);
console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD}`);

console.log('\n🎯 Expected DATABASE_URL format:');
console.log('postgresql://username:password@host:port/database_name');

console.log('\n📋 Your PostgreSQL container should create:');
console.log('Database: telemed (based on POSTGRES_DB)');
console.log('User: postgres (based on POSTGRES_USER)');
console.log('Password: postgres (based on POSTGRES_PASSWORD)');

console.log('\n✅ Correct DATABASE_URL should be:');
console.log('postgresql://postgres:postgres@postgres:5432/telemed');

// Test parsing DATABASE_URL if it exists
if (process.env.DATABASE_URL) {
  try {
    const url = new URL(process.env.DATABASE_URL);
    console.log('\n🔍 Parsed DATABASE_URL:');
    console.log(`Protocol: ${url.protocol}`);
    console.log(`Username: ${url.username}`);
    console.log(`Password: ${url.password}`);
    console.log(`Host: ${url.hostname}`);
    console.log(`Port: ${url.port}`);
    console.log(`Database: ${url.pathname.substring(1)}`); // Remove leading slash
  } catch (error) {
    console.error('\n❌ Invalid DATABASE_URL format:', error.message);
  }
}