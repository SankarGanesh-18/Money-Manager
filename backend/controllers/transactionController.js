const Transaction = require('../models/Transaction');

exports.getTransactions = async (req, res) => {

  try {

    const filter = {
      user: req.user._id
    };

    if (req.query.type) {
      filter.type = req.query.type;
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.q) {
      filter.description = {
        $regex: req.query.q,
        $options: 'i'
      };
    }

    const transactions = await Transaction
      .find(filter)
      .sort({ date: -1 });

    res.json(transactions);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

exports.createTransaction = async (req, res) => {

  try {

    const transaction = await Transaction.create({

      user: req.user._id,

      type: req.body.type,

      amount: req.body.amount,

      category: req.body.category,

      description: req.body.description,

      date: req.body.date

    });

    res.status(201).json(transaction);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

exports.updateTransaction = async (req, res) => {

  try {

    const transaction = await Transaction.findOne({

      _id: req.params.id,

      user: req.user._id

    });

    if (!transaction) {

      return res.status(404).json({

        message: 'Transaction Not Found'

      });

    }

    transaction.type = req.body.type;
    transaction.amount = req.body.amount;
    transaction.category = req.body.category;
    transaction.description = req.body.description;
    transaction.date = req.body.date;

    await transaction.save();

    res.json(transaction);

  } catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

};

exports.deleteTransaction = async (req, res) => {

  try {

    const transaction = await Transaction.findOne({

      _id: req.params.id,

      user: req.user._id

    });

    if (!transaction) {

      return res.status(404).json({

        message: 'Transaction Not Found'

      });

    }

    await transaction.deleteOne();

    res.json({

      message: 'Transaction Deleted'

    });

  } catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

};