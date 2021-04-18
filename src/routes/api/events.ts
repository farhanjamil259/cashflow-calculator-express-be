import { Request, Response, Router } from "express";
import { validateId } from "../../helpers/generalHelpers";

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

//@route POST api/events/id
//@desc deleted event based on event id
//@access public
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).send("Successfully Deleted");
  } catch (err) {
    console.log(err);
  }
});

//@route patch api/events/id
//@desc updates event based on event id
//@access public
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    await Event.findOneAndReplace({ _id: req.params.id }, req.body);
    await Event.findById(req.params.id);

    res.status(200).send("Successfully Updated");
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

// router.patch();

module.exports = router;
