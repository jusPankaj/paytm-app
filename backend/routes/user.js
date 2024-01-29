const express = require("express");
const { User } = require("../db");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const router = express.Router();
const { authMiddleware } = require("../middleware");

// zod validation for signup body
const signupBody = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string().min(8),
});

// signup route
router.post("/signup", async (req, res) => {
  const { success } = signupBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }

  const existingUser = await User.findOne({
    username: req.body.username,
  });

  if (existingUser) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }

  const user = await User.create({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
  });

  const userId = user._id;

  const token = jwt.sign(
    {
      userId: userId,
    },
    JWT_SECRET);

  res.json({
    message: "User created successfully",
    token: token
  });
});

//zod validation for sign in
const signinBody = zod.object({
  username: zod.string().email,
  password: zod.string(),
});

//sign in route
router.post("/signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Error while logging in",
    });
  }

  const existingUser = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (existingUser) {
    const token = jwt.sign({
      userId: existingUser._id,
    }. JWT_SECRET);

    res.status(200).json({
      token: token
    });
    return;
  }
  res.status(411).json({
    message: "Error while logging in",
  });
});

//zod validation for update body
const updateBody = zod.object({
  username: zod.string().optional(),
  firstName: zod.string().optional(),
  password: zod.string().optional(),
});

router.put("/", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: "Error while updating infromation",
    });
  }

  await User.updateOne(req.body, {
    id: req.userId,
  });

  res.status(200).json({
    message: "updated Successfully",
  });

  router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
      $or: [
        {
          firstName: {
            $regex: filter,
          },
        },
        {
          lastNem: {
            $regex: filter,
          },
        },
      ],
    });

    res.json({
      User: User.map((user) => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });
  });
});

module.exports = router;
