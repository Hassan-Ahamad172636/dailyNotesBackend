import dayjs from "dayjs";
import { Schedule } from "../models/schedule.model.js";

export const createSchedule = async (req, res) => {
  try {
    const schedule = new Schedule({
      ...req.body,
      user: req.user._id,
    });
    await schedule.save();
    res.status(201).json(schedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getSchedules = async (req, res) => {
  try {
    const { view = "month", date } = req.query;
    const baseDate = dayjs(date || dayjs());

    let start, end;

    if (view === "day") {
      start = baseDate.startOf("day");
      end = baseDate.endOf("day");
    } else if (view === "week") {
      start = baseDate.startOf("week");
      end = baseDate.endOf("week");
    } else {
      start = baseDate.startOf("month");
      end = baseDate.endOf("month");
    }

    const schedules = await Schedule.find({
      user: req.user._id,
      date: {
        $gte: start.format("YYYY-MM-DD"),
        $lte: end.format("YYYY-MM-DD"),
      },
    });

    res.json({ start: start.toString(), end: end.toString(), schedules });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) return res.status(404).json({ error: "Not found" });
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!schedule) return res.status(404).json({ error: "Not found" });
    res.json(schedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
