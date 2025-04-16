import jwt from 'jsonwebtoken';
import config from '../config/env';
import ms from 'ms';  

export const signToken = (id: string): string => {
  if (typeof config.JWT_SECRET !== 'string') {
    throw new Error('JWT_SECRET must be a string.');
  }

  const expiresIn = config.JWT_EXPIRES_IN;


  if (expiresIn && typeof expiresIn !== 'string' && typeof expiresIn !== 'number') {
    throw new Error('JWT_EXPIRES_IN must be a string or number.');
  }

  const options: jwt.SignOptions = {};
  if (expiresIn) {
    if (typeof expiresIn === 'string') {

      const msExpiresIn = ms(expiresIn as ms.StringValue);  
      if (isNaN(msExpiresIn)) {
        throw new Error(`Invalid duration format for JWT_EXPIRES_IN: ${expiresIn}`);
      }
      options.expiresIn = msExpiresIn / 1000; 
    } else {
      options.expiresIn = expiresIn; 
    }
  }

  return jwt.sign({ id }, config.JWT_SECRET, options);
};

export const verifyToken = (token: string): { id: string } => {
  if (typeof config.JWT_SECRET !== 'string') {
    throw new Error('JWT_SECRET must be a string.');
  }
  return jwt.verify(token, config.JWT_SECRET) as { id: string };
};
