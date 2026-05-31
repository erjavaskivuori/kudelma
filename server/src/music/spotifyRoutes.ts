import { Router } from 'express';
import { connectSpotify, spotifyCallback } from './spotifyController.js';
import { requireAuth } from '../utils/middleware.js';

const router = Router();

router.get('/spotify/connect', requireAuth, connectSpotify);
router.get('/spotify/callback', spotifyCallback);

export default router;
