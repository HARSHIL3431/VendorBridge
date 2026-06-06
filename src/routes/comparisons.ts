import { Router } from 'express';
import { comparisonController } from '../controllers/comparisonController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

/**
 * @swagger
 * /comparisons/{rfqId}:
 *   get:
 *     summary: Compare all quotations for an RFQ
 *     tags: [Comparisons]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: rfqId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Quotation comparison with lowestPrice flag
 */
router.get('/:rfqId', authenticate, requireRole('PROCUREMENT_OFFICER', 'ADMIN'), comparisonController.compare);

export default router;
