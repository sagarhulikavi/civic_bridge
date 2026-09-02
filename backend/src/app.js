import express from 'express';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes.js';
import problemRoutes from './routes/problem.routes.js';
import categoryRoutes from './routes/category.routes.js';
import organizationRoutes from './routes/organization.routes.js';
import aiRoutes from './routes/ai.routes.js';
import matchRoutes from './routes/match.routes.js';
import collaborationRoutes from './routes/collaboration.routes.js';
import workflowRoutes from './routes/workflow.routes.js';
import adminRoutes from './routes/admin.routes.js';
import supportRoutes from './routes/support.routes.js';
import locationRoutes from './routes/location.routes.js';
import { errorHandler } from './middleware/error.js';
import { successResponse, errorResponse } from './utils/response.js';

const app = express();

// 1. Core Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// 2. Rate Limiter for API Security
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests from this IP, please try again after 15 minutes.'
    }
  }
});
app.use('/api', limiter);

// 3. Static Media File Uploads
const uploadDir = path.resolve(process.env.UPLOAD_DIR || './uploads');
app.use('/uploads', express.static(uploadDir));

// 4. Health Check Endpoint
app.get('/health', (req, res) => {
  return successResponse(res, {
    status: 'healthy',
    service: 'sahyog-backend',
    version: '1.0.0',
    maintenance_mode: process.env.MAINTENANCE_MODE === 'true'
  }, 'Service is healthy.');
});

// 5. Mount API Routes
const apiV1Router = express.Router();

apiV1Router.use('/auth', authRoutes);
apiV1Router.use('/problems', problemRoutes);
apiV1Router.use('/categories', categoryRoutes);
apiV1Router.use('/organizations', organizationRoutes);
apiV1Router.use('/ai', aiRoutes);
apiV1Router.use('/matches', matchRoutes);
apiV1Router.use('/collaborations', collaborationRoutes);
apiV1Router.use('/workflow', workflowRoutes);
apiV1Router.use('/admin', adminRoutes);
apiV1Router.use('/support', supportRoutes);
apiV1Router.use('/location', locationRoutes);

// Support both /api and /api/v1
app.use('/api/v1', apiV1Router);
app.use('/api', apiV1Router);

// 6. 404 Route Handler
app.use('*', (req, res) => {
  return errorResponse(res, `Route ${req.originalUrl} not found.`, 404, 'NOT_FOUND');
});

// 7. Global Error Handler
app.use(errorHandler);

export default app;
