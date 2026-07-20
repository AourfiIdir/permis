import User from "../models/User.js"

export async function getUsers(req, res) {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const users = await User.find().skip(skip).limit(limit)
    const total = await User.countDocuments()

    res.status(200).json({ success: true, data: users, page, limit, total })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

export async function getUserById(req, res) {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ success: false, message: "User not found" })
    res.status(200).json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}
