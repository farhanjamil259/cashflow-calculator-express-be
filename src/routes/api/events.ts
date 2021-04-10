import { Request, Response, Router } from "express";

import Event from "../../models/event";

const router = Router();

//@route GET api/events/id
//@desc gets events based on plan id
//@access public
router.get("/:id", async (req: Request, res: Response) => {
  const planid = req.params.id;

  try {
    const foundEvents = await Event.find({ planid: planid });
    res.status(200).json(foundEvents);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

//@route POST api/events/id
//@desc creates events based on plan id
//@access public
router.post("/:id", async (req: Request, res: Response) => {
  const planid = req.params.id;

  const { name, owner, year, category } = req.body;

  const newEvent = new Event({
    planid,
    name,
    owner,
    year,
    category,
  });

  try {
    const response = await newEvent.save();
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

module.exports = router;
