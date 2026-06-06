import { Router } from 'express';
import { invoiceController } from '../controllers/invoiceController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';
import { validate } from '../middleware/validate';
import { createInvoiceSchema, invoiceIdParamSchema, sendEmailSchema } from '../validators/invoiceValidator';

const router = Router();

/**
 * @swagger
 * /invoices:
 *   get:
 *     summary: List all invoices
 *     tags: [Invoices]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of invoices
 */
router.get('/', authenticate, invoiceController.list);

/**
 * @swagger
 * /invoices/{id}:
 *   get:
 *     summary: Get invoice detail
 *     tags: [Invoices]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Invoice details
 */
router.get('/:id', authenticate, validate(invoiceIdParamSchema), invoiceController.getById);

/**
 * @swagger
 * /invoices:
 *   post:
 *     summary: Generate invoice from PO
 *     tags: [Invoices]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [purchaseOrderId]
 *             properties:
 *               purchaseOrderId: { type: string, format: uuid }
 *     responses:
 *       201:
 *         description: Invoice generated
 */
router.post('/', authenticate, requireRole('PROCUREMENT_OFFICER'), validate(createInvoiceSchema), invoiceController.create);

/**
 * @swagger
 * /invoices/{id}/pdf:
 *   get:
 *     summary: Download invoice as PDF
 *     tags: [Invoices]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: PDF file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/:id/pdf', authenticate, invoiceController.downloadPdf);

/**
 * @swagger
 * /invoices/{id}/send-email:
 *   post:
 *     summary: Send invoice via email
 *     tags: [Invoices]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email }
 *     responses:
 *       200:
 *         description: Invoice sent
 */
router.post('/:id/send-email', authenticate, requireRole('PROCUREMENT_OFFICER', 'ADMIN'), validate(sendEmailSchema), invoiceController.sendEmail);

export default router;
