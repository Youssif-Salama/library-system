import CatchErrorService, { AppError } from "../../services/error.services.js";
import borrowingsModel from "../models/borrowings.model.js";
import mongoose from "mongoose";

export const totalBooksCountPerMember = CatchErrorService(async (req, res) => {
  const { memberId } = req.params;

  // Validate memberId format
  if (!mongoose.Types.ObjectId.isValid(memberId)) {
    throw new AppError("Invalid member ID format", 400);
  }

  const bookCount = await borrowingsModel.aggregate([
    {
      $match: {
        member: new mongoose.Types.ObjectId(memberId)
      }
    },
    {
      $group: {
        _id: '$member',
        uniqueBooks: { $addToSet: '$book' },
        totalBorrowings: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        memberId: '$_id',
        uniqueBooksCount: { $size: '$uniqueBooks' },
        totalBorrowings: 1
      }
    }
  ]);

  if (!bookCount.length) {
    throw new AppError("No borrowings found for this member", 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      memberId,
      uniqueBooksCount: bookCount[0].uniqueBooksCount,
      totalBorrowings: bookCount[0].totalBorrowings
    }
  });
});

export const avgBooksPerMembershipType = CatchErrorService(async (req, res) => {
  const stats = await borrowingsModel.aggregate([
    {
      $lookup: {
        from: 'members',
        localField: 'member',
        foreignField: '_id',
        as: 'memberDetails'
      }
    },

    {
      $unwind: '$memberDetails'
    },

    {
      $group: {
        _id: '$memberDetails.membershipType',
        totalBooks: { $sum: 1 },
        memberCount: { $addToSet: '$member' }
      }
    },

    {
      $project: {
        membershipType: '$_id',
        _id: 0,
        totalBooks: 1,
        uniqueMembers: { $size: '$memberCount' },
        averageBooksPerMember: {
          $round: [{ $divide: ['$totalBooks', { $size: '$memberCount' }] }, 2]
        }
      }
    },

    {
      $sort: { averageBooksPerMember: -1 }
    }
  ]);

  if (!stats.length) {
    throw new AppError('No borrowing statistics found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: stats
  });
});

export const getMembersWithMinBorrowings = CatchErrorService(async (req, res) => {
  const { noOfBooks } = req.query;

  if (!noOfBooks || isNaN(noOfBooks)) {
    throw new AppError('Please provide a valid number for noOfBooks query parameter', 400);
  }

  const frequentBorrowers = await borrowingsModel.aggregate([
    {
      $group: {
        _id: '$member',
        borrowedBooks: { $addToSet: '$book' },
        totalBorrowings: { $sum: 1 }
      }
    },

    {
      $match: {
        totalBorrowings: { $gte: Number(noOfBooks) }
      }
    },

    {
      $lookup: {
        from: 'members',
        localField: '_id',
        foreignField: '_id',
        as: 'memberInfo'
      }
    },

    {
      $unwind: '$memberInfo'
    },

    {
      $project: {
        _id: 0,
        memberId: '$_id',
        name: '$memberInfo.name',
        membershipType: '$memberInfo.membershipType',
        totalBorrowings: 1,
        uniqueBooksCount: { $size: '$borrowedBooks' }
      }
    },

    {
      $sort: { totalBorrowings: -1 }
    }
  ]);

  if (!frequentBorrowers.length) {
    throw new AppError(`No members found who borrowed ${noOfBooks} or more books`, 404);
  }

  res.status(200).json({
    status: 'success',
    results: frequentBorrowers.length,
    data: frequentBorrowers
  });
});

export const getMembershipTypeStats = CatchErrorService(async (req, res) => {
  const stats = await borrowingsModel.aggregate([
    {
      $lookup: {
        from: 'members',
        localField: 'member',
        foreignField: '_id',
        as: 'memberInfo'
      }
    },
    {
      $unwind: '$memberInfo'
    },

    {
      $group: {
        _id: '$memberInfo.membershipType',
        memberCount: { $addToSet: '$member' },
        totalBorrowings: { $sum: 1 }
      }
    },

    {
      $project: {
        _id: 0,
        membershipType: '$_id',
        numberOfMembers: { $size: '$memberCount' },
        totalBorrowings: 1,
        averageBorrowingsPerMember: {
          $round: [{ $divide: ['$totalBorrowings', { $size: '$memberCount' }] }, 2]
        }
      }
    },

    {
      $sort: { numberOfMembers: -1 }
    }
  ]);

  if (!stats.length) {
    throw new AppError('No membership statistics found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: stats
  });
});