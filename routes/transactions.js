const express = require('express');
const router = express.Router();
const transController = require('../controllers/transactions');


router.post("/create", transController.createNewTransaction);
router.get("/:userId/get", transController.getTransactionsByUserId);
router.get("/get", transController.getTransactions);
router.put("/:transId/update", transController.updateTransaction);
// router.get("/:userId/get", transController.getTransactionsByUserId);




module.exports = router;
