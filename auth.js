import express from 'express';
//import { loginUser, registerUser } from '../controllers/authController.js';
import { loginUser, registerUser } from '../controllers/controllerAuth.js';


const router = express.Router();

router.post('/sign-in', loginUser);
router.post('/sign-up', registerUser);



//-------------------------------------


// ---------------------------
// RUTA DE PRUEBA
// ---------------------------
router.get('/test', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Auth route is working!',
        endpoints: {
            login: 'POST /api/auth/sign-in',
            register: 'POST /api/auth/sign-up',
            profile: 'GET /api/auth/profile'
        }
    });
});
export default router;
