const Booking = require('../models/Booking');
const Event = require('../models/Event');

// @desc    Get dashboard overview stats
// @route   GET /api/analytics/overview
// @access  Private/Organizer
exports.getOverview = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments({ organizerId: req.user._id });
    
    const userEvents = await Event.find({ organizerId: req.user._id }).select('_id');
    const eventIds = userEvents.map(e => e._id);
    
    const bookingStats = await Booking.aggregate([
      { $match: { eventId: { $in: eventIds } } },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalRevenue: {
            $sum: { $cond: [{ $eq: ["$paymentStatus", "success"] }, "$totalAmount", 0] }
          },
          totalCheckIns: {
            $sum: { $cond: [{ $eq: ["$checkedIn", true] }, 1, 0] }
          }
        }
      }
    ]);

    const stats = bookingStats.length > 0 ? bookingStats[0] : { totalBookings: 0, totalRevenue: 0, totalCheckIns: 0 };
    const checkInRate = stats.totalBookings > 0 
      ? ((stats.totalCheckIns / stats.totalBookings) * 100).toFixed(1) 
      : 0;

    res.json({
      totalEvents,
      totalBookings: stats.totalBookings,
      totalRevenue: stats.totalRevenue,
      totalCheckIns: stats.totalCheckIns,
      checkInRate: parseFloat(checkInRate)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get sales trend (last 30 days)
// @route   GET /api/analytics/sales-trend
// @access  Private/Organizer
exports.getSalesTrend = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const userEvents = await Event.find({ organizerId: req.user._id }).select('_id');
    const eventIds = userEvents.map(e => e._id);

    const trend = await Booking.aggregate([
      {
        $match: {
          eventId: { $in: eventIds },
          createdAt: { $gte: thirtyDaysAgo },
          paymentStatus: "success"
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(trend);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get category breakdown
// @route   GET /api/analytics/category-breakdown
// @access  Private/Organizer
exports.getCategoryBreakdown = async (req, res) => {
  try {
    const userEvents = await Event.find({ organizerId: req.user._id }).select('_id');
    const eventIds = userEvents.map(e => e._id);

    const breakdown = await Booking.aggregate([
      { $match: { eventId: { $in: eventIds }, paymentStatus: "success" } },
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "eventData"
        }
      },
      { $unwind: "$eventData" },
      {
        $group: {
          _id: "$eventData.category",
          revenue: { $sum: "$totalAmount" },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    res.json(breakdown);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get top events by tickets sold
// @route   GET /api/analytics/top-events
// @access  Private/Organizer
exports.getTopEvents = async (req, res) => {
  try {
    const userEvents = await Event.find({ organizerId: req.user._id }).select('_id');
    const eventIds = userEvents.map(e => e._id);

    const topEvents = await Booking.aggregate([
      { $match: { eventId: { $in: eventIds }, paymentStatus: "success" } },
      {
        $group: {
          _id: "$eventId",
          ticketsSold: { $sum: "$numberOfTickets" },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { ticketsSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "eventData"
        }
      },
      { $unwind: "$eventData" },
      {
        $project: {
          _id: 1,
          title: "$eventData.title",
          category: "$eventData.category",
          date: "$eventData.date",
          ticketsSold: 1,
          revenue: 1
        }
      }
    ]);

    res.json(topEvents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get specific event analytics
// @route   GET /api/analytics/event/:eventId
// @access  Private/Organizer
exports.getEventAnalytics = async (req, res) => {
  try {
    const { eventId } = req.params;
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ error: "Invalid event ID" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Since eventId is passed as string, we need to convert it to ObjectId for aggregation match
    const objectId = new mongoose.Types.ObjectId(eventId);

    const stats = await Booking.aggregate([
      { $match: { eventId: objectId } },
      {
        $group: {
          _id: null,
          ticketsSold: { $sum: { $cond: [{ $eq: ["$paymentStatus", "success"] }, "$numberOfTickets", 0] } },
          revenue: { $sum: { $cond: [{ $eq: ["$paymentStatus", "success"] }, "$totalAmount", 0] } },
          checkIns: { $sum: { $cond: [{ $eq: ["$checkedIn", true] }, 1, 0] } },
          totalBookings: { $sum: 1 }
        }
      }
    ]);

    const result = stats.length > 0 ? stats[0] : { ticketsSold: 0, revenue: 0, checkIns: 0, totalBookings: 0 };
    const checkInRate = result.totalBookings > 0 
      ? ((result.checkIns / result.totalBookings) * 100).toFixed(1) 
      : 0;

    res.json({
      event: {
        title: event.title,
        totalSeats: event.totalSeats,
        availableSeats: event.availableSeats,
      },
      ticketsSold: result.ticketsSold,
      revenue: result.revenue,
      checkIns: result.checkIns,
      checkInRate: parseFloat(checkInRate)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
