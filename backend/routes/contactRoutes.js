const express = require('express');
const router = express.Router();
const { getContacts, createContact, updateContact, deleteContact } = require('../controllers/contactController');
const validateToken = require('../middleware/validateTokenHandler');

router.use(validateToken)

router.route("/")
  .get(getContacts)
  .post(createContact)
  .put(updateContact)
  .delete(deleteContact);

module.exports = router;