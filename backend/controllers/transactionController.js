const Transaction = require('../models/Transaction');

exports.getTransactions = async (req, res, next) => {
  try {
    const { type, category, q, startDate, endDate } = req.query;

    const filter = {
      user: req.user._id
    };

    if (type) filter.type = type;
    if (category) filter.category = category;

    if (q) {
      filter.description = {
        $regex: q,
        $options: 'i'
      };
    }

    if (startDate || endDate) {
      filter.date = {};

      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }

      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    const transactions = await Transaction.find(filter)
      .sort({ date: -1 });

    res.json({
      success: true,
      data: transactions
    });

  } catch (err) {
    next(err);
  }
};

exports.createTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.create({
      ...req.body,
      user: req.user._id
    });

    res.status(201).json({
      success: true,
      data: transaction
    });

  } catch (err) {
    next(err);
  }
};

exports.updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Not found'
      });
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    Object.assign(transaction, req.body);

    await transaction.save();

    res.json({
      success: true,
      data: transaction
    });

  } catch (err) {
    next(err);
  }
};

exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Not found'
      });
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    await transaction.deleteOne();

    res.json({
      success: true,
      message: 'Deleted'
    });

  } catch (err) {
    next(err);
  }
};

exports.getSummary = async (req, res, next) => {
  try {
    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const pipeline = [
      {
        $match: {
          user: req.user._id,
          date: {
            $gte: startOfMonth
          }
        }
      },
      {
        $group: {
          _id: {
            type: '$type',
            category: '$category'
          },
          total: {
            $sum: '$amount'
          },
          count: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          total: -1
        }
      }
    ];

    const data = await Transaction.aggregate(pipeline);

    let totalIncome = 0;
    let totalExpense = 0;

    const byCategory = [];

    data.forEach(d => {
      if (d._id.type === 'income') {
        totalIncome += d.total;
      } else {
        totalExpense += d.total;

        byCategory.push({
          category: d._id.category,
          total: d.total
        });
      }
    });

    res.json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        byCategory
      }
    });

  } catch (err) {
    next(err);
  }
};