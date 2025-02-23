import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }
      (req as any).userId = (decoded as any).userId;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
