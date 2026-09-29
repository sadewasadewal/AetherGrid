import { Router } from 'express';
import {
  getHealth,
  getServices,
  getMetrics,
  getDeployments,
  getLogs,
  getSystem,
  getVersion
} from '../controllers/api.controller.js';

const router = Router();

router.get('/health', getHealth);
router.get('/services', getServices);
router.get('/metrics', getMetrics);
router.get('/deployments', getDeployments);
router.get('/logs', getLogs);
router.get('/system', getSystem);
router.get('/version', getVersion);

export default router;
