const asyncHandler = require("../node_modules/express-async-handler");
const Contact = require("../models/contactModel");
//@desc Get all contacts
//@route GET /api/contacts
//@access Public

const getContacts = asyncHandler(async (req, res) => {
  const query = req.body.query;
  if (query) {
    console.log("Search started");
    const searchValue = req.body.query;
    console.log(searchValue);
    const searchQuery = {
      $or: [
        { name: { $regex: searchValue, $options: 'i' } },
        { email: { $regex: searchValue, $options: 'i' } },
        { phone: { $regex: searchValue, $options: 'i' } },
      ],
    };
    console.log(searchQuery);

    const contact = await Contact.find(searchQuery).exec();
    console.log("Search results:", contact);

    res.status(200).json(contact);
  } else {
    const contacts = await Contact.find({ user_id: req.user.id }).exec();
    console.log("Get contacts:", contacts);

    res.status(200).json(contacts);
  }
});


//@desc create new contact
//@route POST /api/contacts
//@access public

const createContact = asyncHandler(async (req, res) => {
  console.log("the request body is:", req.body);
  const { name, email, phone } = req.body;
  const usedEmail = await Contact.findOne({ email });
  console.log(req.user.id);
  if (usedEmail) {
    res.status(400).json({ message: "Email already in use" });
  }
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("Please provide name, email and phone");
  }
  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id,
  });
  res.status(201).json(contact);
});

//@desc update contact
//@route PUT /api/contacts/:id
//@access private

const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404).message("Contact not found");
    throw new Error("Contact not found");
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403).json({ message: "Unauthorized access!" });
    throw new Error("Users don't have permission to update other users contacts");
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedContact);
});

//@desc Get all contacts
//@route DELETE /api/contacts
//@access private

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findOne({email: req.body.email});
  console.log(contact);
  if (!contact) {
    res.status(404).json({ message: "Contact not found" });
    throw new Error("Contact not found");
  }
  await Contact.deleteOne({ _id: contact._id });
  res.status(200).json({ message: "Contact deleted successfully" });

});

module.exports = {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
};


