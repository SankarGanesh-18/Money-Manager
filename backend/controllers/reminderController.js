const Reminder =
require('../models/Reminder');



// ===========================
// Get All Reminders
// ===========================

exports.getReminders =
async (req, res) => {

  try {

    const reminders =
    await Reminder.find({

      user: req.user._id

    }).sort({

      dueDate: 1

    });

    res.json(reminders);

  }

  catch (error) {

    console.error(error);

    res.status(500).json({

      message: error.message

    });

  }

};



// ===========================
// Add Reminder
// ===========================

exports.createReminder =
async (req, res) => {

  try {

    const reminder =
    await Reminder.create({

      ...req.body,

      user: req.user._id

    });

    res.status(201).json(reminder);

  }

  catch (error) {

    console.error(error);

    res.status(500).json({

      message: error.message

    });

  }

};



// ===========================
// Update Reminder
// ===========================

exports.updateReminder =
async (req, res) => {

  try {

    const reminder =
    await Reminder.findOneAndUpdate(

      {

        _id: req.params.id,

        user: req.user._id

      },

      req.body,

      {

        new: true

      }

    );

    if (!reminder) {

      return res.status(404).json({

        message: 'Reminder not found'

      });

    }

    res.json(reminder);

  }

  catch (error) {

    console.error(error);

    res.status(500).json({

      message: error.message

    });

  }

};



// ===========================
// Delete Reminder
// ===========================

exports.deleteReminder =
async (req, res) => {

  try {

    const reminder =
    await Reminder.findOneAndDelete({

      _id: req.params.id,

      user: req.user._id

    });

    if (!reminder) {

      return res.status(404).json({

        message: 'Reminder not found'

      });

    }

    res.json({

      message: 'Reminder Deleted'

    });

  }

  catch (error) {

    console.error(error);

    res.status(500).json({

      message: error.message

    });

  }

};