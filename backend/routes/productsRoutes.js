import express from 'express';
import{
createProduct,
getProducts,
getProductById, 
updateProduct,
deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

//Route to create a new product
router.post('/add',createProduct);

//Route to get all products
router.get('/',getProducts);

//Route to get products by Id
router.get('/:id', getProductById);

//Route to update a product byId
router.put('/update/:id',updateProduct);

//Route to delete a product by Id
router.delete('/delete/:id',deleteProduct);

export default router;