import Namaz from '../models/namaz.model.js';
import asyncHandler from '../utils/asyncHandler.js';

// Save namaz for today (create or update)
export const saveNamaz = asyncHandler(async (req, res) => {
  const { prayerName, value } = req.body;
  const userId = req.user._id;

  if (!prayerName || value === undefined) {
    return res.status(400).json({ message: "Prayer name and value are required" });
  }

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  // Find today's record for the user
  let record = await Namaz.findOne({ user: userId, date: today });

  if (!record) {
    record = await Namaz.create({
      user: userId,
      date: today,
      fajr: false,
      zuhr: false,
      asar: false,
      maghrib: false,
      isha: false,
      [prayerName]: value,
    });
  } else {
    record[prayerName] = value;
    await record.save();
  }

  res.json({
    message: `${prayerName} updated successfully for today`,
    data: record
  });
});

// Get today's namaz
export const getTodayNamaz = asyncHandler(async (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const userId = req.user._id;

  const namaz = await Namaz.findOne({ user: userId, date: today });

  res.json({
    message: namaz ? "Today's namaz fetched" : "No namaz data for today yet",
    data: namaz || null
  });
});

// Get full namaz history
export const getNamazHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const history = await Namaz.find({ user: userId })
    .sort({ date: -1 });

  res.json({
    message: "Namaz history fetched successfully",
    data: history
  });
});
