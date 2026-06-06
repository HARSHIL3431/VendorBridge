import { Router } from 'express';
import { quotationController } from '../controllers/quotationController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';
import { validate } from '../middleware/validate';
import { createQuotationSchema, updateQuotationSchema, quotationIdParamSchema } from '../validators/quotationValidator';

const router = Router();

/**
 * @swagger
 * /quotations:
 *   get:
 *     summary: List quotations
 *     tags: [Quotations]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: rfqId
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: vendorId
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: List of quotations
 */
router.get('/', authenticate, quotationController.list);

/**
 * @swagger
 * /quotations/{id}:
 *   get:
 *     summary: Get quotation detail
 *     tags: [Quotations]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Quotation details
 */
router.get('/:id', authenticate, validate(quotationIdParamSchema), quotationController.getById);

/**
 * @swagger
 * /quotations:
 *   post:
 *     summary: Submit quotation (Vendor only)
 *     tags: [Quotations]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rfqId, vendorId, price, deliveryDays]
 *             properties:
 *               rfqId: { type: string, format: uuid }
 *               vendorId: { type: string, format: uuid }
 *               price: { type: number }
 *               deliveryDays: { type: integer }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Quotation submitted
 */
router.post('/', authenticate, requireRole('VENDOR'), validate(createQuotationSchema), quotationController.create);

/**
 * @swagger
 * /quotations/{id}:
 *   put:
 *     summary: Update quotation (Vendor only, RFQ must be OPEN)
 *     tags: [Quotations]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price: { type: number }
 *               deliveryDays: { type: integer }
 *               notes: { type: string }
 *     responses:
 *       200:
 *         description: Quotation updated
 */
router.put('/:id', authenticate, requireRole('VENDOR'), validate(updateQuotationSchema), quotationController.update);

export default router;
