import { Router } from 'express';
import { vendorController } from '../controllers/vendorController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';
import { validate } from '../middleware/validate';
import { createVendorSchema, updateVendorSchema, vendorIdParamSchema } from '../validators/vendorValidator';

const router = Router();

/**
 * @swagger
 * /vendors:
 *   get:
 *     summary: List all vendors
 *     tags: [Vendors]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of vendors
 */
router.get('/', authenticate, requireRole('ADMIN', 'PROCUREMENT_OFFICER'), vendorController.list);

/**
 * @swagger
 * /vendors/{id}:
 *   get:
 *     summary: Get vendor detail
 *     tags: [Vendors]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Vendor details
 */
router.get('/:id', authenticate, requireRole('ADMIN', 'PROCUREMENT_OFFICER'), validate(vendorIdParamSchema), vendorController.getById);

/**
 * @swagger
 * /vendors:
 *   post:
 *     summary: Create vendor
 *     tags: [Vendors]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, phone, gstNumber, category]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               gstNumber: { type: string }
 *               category: { type: string }
 *               status: { type: string, enum: [ACTIVE, INACTIVE, BLACKLISTED] }
 *     responses:
 *       201:
 *         description: Vendor created
 */
router.post('/', authenticate, requireRole('ADMIN'), validate(createVendorSchema), vendorController.create);

/**
 * @swagger
 * /vendors/{id}:
 *   put:
 *     summary: Update vendor
 *     tags: [Vendors]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Vendor updated
 */
router.put('/:id', authenticate, requireRole('ADMIN'), validate(updateVendorSchema), vendorController.update);

/**
 * @swagger
 * /vendors/{id}:
 *   delete:
 *     summary: Delete vendor
 *     tags: [Vendors]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Vendor deleted
 */
router.delete('/:id', authenticate, requireRole('ADMIN'), validate(vendorIdParamSchema), vendorController.delete);

export default router;
