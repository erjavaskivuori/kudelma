import { Router } from 'express';
import { connectSpotify, spotifyCallback, getRecommendations } from './spotifyController.js';
import { requireAuth } from '../utils/middleware.js';

const router = Router();

router.get('/spotify/connect', requireAuth, connectSpotify);
router.post('/spotify/recommendations', requireAuth, getRecommendations);
router.get('/spotify/callback', spotifyCallback);

export default router;
