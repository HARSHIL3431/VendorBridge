import { Router } from 'express';
import { approvalController } from '../controllers/approvalController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';
import { validate } from '../middleware/validate';
import { createApprovalSchema, approvalIdParamSchema } from '../validators/approvalValidator';

const router = Router();

/**
 * @swagger
 * /approvals:
 *   get:
 *     summary: List all approvals
 *     tags: [Approvals]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of approvals
 */
router.get('/', authenticate, requireRole('MANAGER', 'ADMIN'), approvalController.list);

/**
 * @swagger
 * /approvals/{id}:
 *   get:
 *     summary: Get approval detail
 *     tags: [Approvals]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Approval details
 */
router.get('/:id', authenticate, requireRole('MANAGER', 'ADMIN'), validate(approvalIdParamSchema), approvalController.getById);

/**
 * @swagger
 * /approvals:
 *   post:
 *     summary: Approve or reject quotation (Manager only)
 *     tags: [Approvals]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quotationId, status]
 *             properties:
 *               quotationId: { type: string, format: uuid }
 *               status: { type: string, enum: [APPROVED, REJECTED] }
 *               remarks: { type: string }
 *     responses:
 *       201:
 *         description: Quotation approved/rejected
 */
router.post('/', authenticate, requireRole('MANAGER'), validate(createApprovalSchema), approvalController.create);

export default router;
