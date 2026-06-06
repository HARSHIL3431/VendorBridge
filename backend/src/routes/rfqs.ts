import { Router } from 'express';
import { rfqController } from '../controllers/rfqController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';
import { validate } from '../middleware/validate';
import { createRfqSchema, updateRfqSchema, rfqIdParamSchema } from '../validators/rfqValidator';

const router = Router();

/**
 * @swagger
 * /rfqs:
 *   get:
 *     summary: List all RFQs
 *     tags: [RFQs]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of RFQs
 */
router.get('/', authenticate, rfqController.list);

/**
 * @swagger
 * /rfqs/{id}:
 *   get:
 *     summary: Get RFQ with quotations
 *     tags: [RFQs]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: RFQ details with quotations
 */
router.get('/:id', authenticate, validate(rfqIdParamSchema), rfqController.getById);

/**
 * @swagger
 * /rfqs:
 *   post:
 *     summary: Create RFQ
 *     tags: [RFQs]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, quantity, deadline]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               quantity: { type: integer }
 *               deadline: { type: string }
 *     responses:
 *       201:
 *         description: RFQ created
 */
router.post('/', authenticate, requireRole('PROCUREMENT_OFFICER'), validate(createRfqSchema), rfqController.create);

/**
 * @swagger
 * /rfqs/{id}:
 *   put:
 *     summary: Update RFQ
 *     tags: [RFQs]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: RFQ updated
 */
router.put('/:id', authenticate, requireRole('PROCUREMENT_OFFICER'), validate(updateRfqSchema), rfqController.update);

/**
 * @swagger
 * /rfqs/{id}:
 *   delete:
 *     summary: Delete RFQ
 *     tags: [RFQs]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: RFQ deleted
 */
router.delete('/:id', authenticate, requireRole('PROCUREMENT_OFFICER'), validate(rfqIdParamSchema), rfqController.delete);

export default router;
