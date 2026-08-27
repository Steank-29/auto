const express = require('express');
const router = express.Router();
const {
  createContact,
  getContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getContactStats,
} = require('../controllers/contactController');

// Public route
router.post('/', createContact);

// Admin routes (add authentication middleware in production)
router.get('/', getContacts);
router.get('/stats', getContactStats);
router.get('/:id', getContactById);
router.put('/:id/status', updateContactStatus);
router.delete('/:id', deleteContact);

module.exports = router;