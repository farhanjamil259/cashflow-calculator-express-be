import { Request, Response, Router } from "express";
import IUser from "../../interfaces/IUser";
import User from "../../models/User";
const router = Router();

//login user route
router.post("/login", async (req: Request, res: Response) => {
  const userInfo = req.body;
  const { email, password } = userInfo;

  try {
    const foundUser: any = await User.findOne({ email });

    const user: IUser = foundUser;

    if (!foundUser) {
      return res.status(203).send({ msg: "Invalid Credentials" });
    }

    if (user.email === email && user.password === password) {
      return res.status(200).send(user);
    } else {
      return res.status(203).send({ msg: "Invalid Credentials" });
    }
  } catch (err) {}
});

//register user route
router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const foundUser = await User.findOne({ email });

  if (foundUser) {
    return res.status(203).send({ msg: "Email already in use" });
  }

  const newUser = new User({
    name,
    email,
    password,
  });

  try {
    await newUser.save();
  } catch (err) {
    console.log(err);
  }
  res.status(201).send(newUser);
});

module.exports = router;
