import express from 'express';
import { deleteObject, fetchList, getObject, putObject, putObjectFolder } from '../controllers/s3.controller.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post("/fetchUrl",auth,putObject);
router.post("/fetchBulkUrl",auth,putObjectFolder);

router.post("/downloadFile",auth,getObject);

router.get("/fetchList",auth,fetchList);

router.post("/deleteObject",auth,deleteObject);

export const s3Router = router;