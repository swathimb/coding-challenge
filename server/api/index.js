import express from 'express'
import starWarRoutes from './starWars.js'
const router = express.Router();

router.use('/starWars', starWarRoutes);
router.get('/*', render404);

export default router

function render404(req, res) {
  res.status(404).json({ error: 'not found' });
}