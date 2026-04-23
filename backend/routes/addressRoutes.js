import express from 'express';
import {saveAddress,getAddresses} from '../controllers/addressController.js';


const router = express.Router();

router.post('/api/address/add',saveAddress);
router.get('/api/address/:userId',getAddresses);

export default router;