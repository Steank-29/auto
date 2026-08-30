const Contact = require('../models/Contact');

// @desc    Create new contact message
// @route   POST /api/contact
// @access  Public
const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Get IP and user agent
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Check for duplicate submissions (prevent spam)
    const existingContact = await Contact.findOne({
      email,
      message,
      createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) }, // Last 5 minutes
    });

    if (existingContact) {
      return res.status(429).json({
        success: false,
        message: 'Hai già inviato un messaggio simile recentemente. Per favore attendi qualche minuto.',
      });
    }

    const contact = new Contact({
      name,
      email,
      subject,
      message,
      ipAddress,
      userAgent,
    });

    await contact.save();

    // Here you can add email notification logic
    // await sendEmailNotification(contact);

    res.status(201).json({
      success: true,
      message: 'Il tuo messaggio è stato inviato con successo! Ti risponderemo al più presto.',
      data: contact,
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Errore di validazione',
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Si è verificato un errore. Per favore riprova più tardi.',
    });
  }
};

// @desc    Get all contact messages (Admin)
// @route   GET /api/contact
// @access  Private (Admin only)
const getContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status || '';

    const filter = {};
    if (status) filter.status = status;

    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero dei messaggi',
    });
  }
};

// @desc    Get single contact message (Admin)
// @route   GET /api/contact/:id
// @access  Private (Admin only)
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Messaggio non trovato',
      });
    }

    // Mark as read if it was pending
    if (contact.status === 'pending') {
      contact.status = 'read';
      await contact.save();
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero del messaggio',
    });
  }
};

// @desc    Update contact status (Admin)
// @route   PUT /api/contact/:id/status
// @access  Private (Admin only)
const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'read', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Stato non valido',
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Messaggio non trovato',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Stato aggiornato con successo',
      data: contact,
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nell\'aggiornamento dello stato',
    });
  }
};

// @desc    Delete contact message (Admin)
// @route   DELETE /api/contact/:id
// @access  Private (Admin only)
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Messaggio non trovato',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Messaggio eliminato con successo',
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nell\'eliminazione del messaggio',
    });
  }
};

// @desc    Get contact statistics (Admin)
// @route   GET /api/contact/stats
// @access  Private (Admin only)
const getContactStats = async (req, res) => {
  try {
    const total = await Contact.countDocuments();
    const pending = await Contact.countDocuments({ status: 'pending' });
    const read = await Contact.countDocuments({ status: 'read' });
    const replied = await Contact.countDocuments({ status: 'replied' });
    const archived = await Contact.countDocuments({ status: 'archived' });

    // Get last 7 days stats
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyStats = await Contact.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        read,
        replied,
        archived,
        weeklyStats,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero delle statistiche',
    });
  }
};

module.exports = {
  createContact,
  getContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getContactStats,
};