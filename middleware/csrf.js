import bcrypt from 'bcrypt';
import { config } from '../config.js';

const CSRF_TOKEN_KEY = 'breads-csrf-token';

export const csrfCheck = (req, res, next) => {
  if (
    req.method === 'GET' ||
    req.method === 'OPTION' ||
    req.method === 'HEAD'
  ) {
    return next();
  }

  const csrfHeader = req.get(CSRF_TOKEN_KEY);

  if (!csrfHeader) {
    console.warn(
      `Missing required "${CSRF_TOKEN_KEY}" header.`,
      req.headers.origin
    );
    return res.status(403).json({ message: 'Failed CSRF check' });
  }

  validateCsrfToken(csrfHeader)
    .then((valid) => {
      if (!valid) {
        console.warn(
          `Value provided in "${CSRF_TOKEN_KEY} header is not valid."`,
          req.headers.origin,
          csrfHeader
        );
        return res.status(403).json({ message: 'Failed CSRF check' });
      }
      next();
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ message: 'Something went wrong' });
    });
};

async function validateCsrfToken(csrfHeader) {
  return bcrypt.compare(config.csrf.plainToken, csrfHeader);
}
