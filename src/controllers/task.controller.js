import { Task } from "../models/task.model.js"

// Create a new task
export const createTask = async (req, res) => {
    try {
        const { title, category, description, priority, dueDate } = req.body
        const userId = req.user?._id   // assume user id comes from auth middleware

        const task = await Task.create({
            user: userId,
            title,
            category,
            description,
            priority,
            dueDate,
        })

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            task,
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// Get all tasks (for logged-in user)
export const getTasks = async (req, res) => {
    try {
        const userId = req.user?._id
        const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 })
        res.status(200).json({ success: true, tasks })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// Get single task
export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" })
        }
        res.status(200).json({ success: true, task })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// Update a task
export const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" })
        }

        res.status(200).json({ success: true, message: "Task updated", task })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

// Delete a task
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" })
        }

        res.status(200).json({ success: true, message: "Task deleted" })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }

}

export const completeTask = async (req, res) => {
  try {
    console.log("req.params:", req.params)  // debug
    const taskId = req.params.id
    // const userId = req.user._id

    const task = await Task.findOne({ _id: taskId })
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" })
    }

    task.isCompleted = !task.isCompleted
    await task.save()

    res.status(200).json({
      success: true,
      message: `Task marked as ${task.isCompleted ? "completed" : "incomplete"}`,
      task
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

