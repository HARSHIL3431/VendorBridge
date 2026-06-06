import { Router } from 'express';
import { purchaseOrderController } from '../controllers/purchaseOrderController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';
import { validate } from '../middleware/validate';
import { createPurchaseOrderSchema, purchaseOrderIdParamSchema } from '../validators/purchaseOrderValidator';

const router = Router();

/**
 * @swagger
 * /purchase-orders:
 *   get:
 *     summary: List all purchase orders
 *     tags: [Purchase Orders]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of purchase orders
 */
router.get('/', authenticate, purchaseOrderController.list);

/**
 * @swagger
 * /purchase-orders/{id}:
 *   get:
 *     summary: Get PO detail
 *     tags: [Purchase Orders]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: PO details
 */
router.get('/:id', authenticate, validate(purchaseOrderIdParamSchema), purchaseOrderController.getById);

/**
 * @swagger
 * /purchase-orders:
 *   post:
 *     summary: Generate Purchase Order
 *     tags: [Purchase Orders]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quotationId]
 *             properties:
 *               quotationId: { type: string, format: uuid }
 *     responses:
 *       201:
 *         description: PO generated
 */
router.post('/', authenticate, requireRole('PROCUREMENT_OFFICER'), validate(createPurchaseOrderSchema), purchaseOrderController.create);

export default router;
