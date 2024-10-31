import 'dotenv/config';

export const config = {
  jwt: {
    secretKey: required('JWT_SECRET_KEY'),
    expiresInSec: parseInt(required('JWT_EXPIRES_SEC', 60 * 60 * 24 * 2)),
  },
  bcrypt: {
    saltRounds: parseInt(required('BCRYPT_SALT_ROUNDS', 10)),
  },
  db: {
    host: required('DB_HOST'),
    user: required('DB_USER'),
    database: required('DB_DATABASE'),
    password: required('DB_PASSWORD'),
  },
  port: parseInt(required('PORT', 8080)),
  cors: {
    allowedOrigin: required('CORS_ALLOWED_ORIGIN'),
  },
};

function required(key, defaultVal = undefined) {
  const value = process.env[key] || defaultVal;
  if (value == null) {
    throw new Error(`Key ${key} is undefined`);
  }
  return value;
}
