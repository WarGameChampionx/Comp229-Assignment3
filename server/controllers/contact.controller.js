import Contact from "../models/contact.model.js";

export const getContacts = async (req, res) => {
    try
    {
        const contacts = await Contact.find();
        res.json(contacts);
    }
    catch (error)
    {
        res.status(500).json({ message: error.message });
    }
};

export const getContactById = async (req, res) => {
    try
    {
        const contact = await Contact.findById(req.params.id);
        if (!contact)
        {
            return res.status(404).json({ message: "Contact not found" });
        }

        res.json(contact);
    }
    catch (error)
    {
        res.status(500).json({ message: error.message });
    }
};

export const createContact = async (req, res) => {
    try
    {
        const {
            firstName,
            lastName,
            contactNumber,
            email,
            message
        } = req.body;

        const contact = new Contact({
            firstName,
            lastName,
            contactNumber,
            email,
            message
        });

        const savedContact = await contact.save();

        res.status(201).json(savedContact);
    }
    catch (error)
    {
        res.status(400).json({ message: error.message });
    }
};

export const updateContact = async (req, res) => {
    try
    {
        const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!contact)
        {
            return res.status(404).json({ message: "Contact not found" });
        }

        res.json(contact);
    }
    catch (error)
    {
        res.status(400).json({ message: error.message });
    }
};

export const deleteContact = async (req, res) => {
    try
    {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact)
        {
            return res.status(404).json({ message: "Contact not found" });
        }

        res.json({ message: "Contact deleted" });
    }
    catch (error)
    {
        res.status(500).json({ message: error.message });
    }
};

export const deleteAllContacts = async (req, res) => {
    try
    {
        await Contact.deleteMany({});

        res.json({message: "All contacts deleted"});
    }
    catch (error)
    {
        res.status(500).json({ message: error.message });
    }
};