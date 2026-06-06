import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth';
import vendorRoutes from './routes/vendors';
import rfqRoutes from './routes/rfqs';
import quotationRoutes from './routes/quotations';
import comparisonRoutes from './routes/comparisons';
import approvalRoutes from './routes/approvals';
import purchaseOrderRoutes from './routes/purchaseOrders';
import invoiceRoutes from './routes/invoices';
import dashboardRoutes from './routes/dashboard';

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// ─── Middleware ──────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));
app.use(express.json());

// ─── Swagger Docs ───────────────────────────────────────
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'VendorBridge API Docs',
}));

// ─── API Routes ─────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/rfqs', rfqRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/comparisons', comparisonRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ─── Health Check ───────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'VendorBridge API is running' });
});

// ─── Error Handler ──────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 VendorBridge API running on http://localhost:${PORT}`);
  console.log(`📚 Swagger docs at http://localhost:${PORT}/api/docs`);
});

export default app;
