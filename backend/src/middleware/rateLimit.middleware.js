import { rateLimit } from 'express-rate-limit';

const tooManyRequests = (message) => ({
  success: false,
  message,
});

// Slows down password guessing and sign-up spam from one IP
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: tooManyRequests(
    'Too many attempts. Please wait a few minutes and try again.',
  ),
});

// Stops one account from using up the shared AI quota. Must run after
// identifyUser, since it counts per user rather than per IP.
export const messageLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 6,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  keyGenerator: (req) => req.user._id.toString(),
  message: tooManyRequests(
    "You're sending messages too quickly. Please wait a moment and try again.",
  ),
});
