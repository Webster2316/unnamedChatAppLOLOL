const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const userModel = require('../models/userModel');


//##############################################################
// Chatroom Model
// ##############################################################

module.exports.getRecentMessages = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // 7 days ago

  return prisma.chatroomMessage.findMany({
    where: { createdAt: { gte: sevenDaysAgo } }, // only messages in last 7 days
    orderBy: { createdAt: "asc" }, // oldest first
    include: { user: { select: { username: true, profilePicUrl: true,
      messagesSentCount: true  } } } // include basic user info
  });
};

module.exports.createMessage = (userId, content) => {
  return prisma.chatroomMessage.create({
    data: { userId, content },
    include: { user: { select: { username: true, profilePicUrl: true,
      messagesSentCount: true  } } }
  });
};
// ============================
// GET MESSAGES (GET /api/chatroom)
// ============================
module.exports.getMessages = async (req, res) => {
  try {
    const messages = await chatroomModel.getRecentMessages();
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch chatroom messages' });
  }
};

// ============================
// POST MESSAGE (POST /api/chatroom)
// ============================
module.exports.postMessage = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const { content } = req.body;
    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    // check if user has enough transmissions
    if (req.user.transmissions < 1) {
      return res.status(403).json({ error: "Not enough transmissions to send message" });
    }

    // create message
    const message = await chatroomModel.createMessage(req.user.id, content);

    // deduct 1 transmission (or 5? you said -5, we’ll do 5)
    await userModel.updateUserById(req.user.id, {
      transmissions: req.user.transmissions - 5
    });

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to post message' });
  }
};
