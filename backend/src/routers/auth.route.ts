import express from 'express';
import { CheckVerification, cliLogin, login, register, validateCli } from '../controllers/auth.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = express.Router();


router.post('/register',register);
router.post('/login',login);

router.get('/cli/getCliToken',cliLogin);
router.post('/cli/authenticate',auth,validateCli);
router.post('/cli/verification',CheckVerification);



export const authRouter = router;