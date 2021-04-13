import { Request, Response, Router } from "express";
import _ from "lodash";
const router = Router();

//import helpers
import { setInputValues } from "../../helpers/setInputs";
import { validateId } from "../../helpers/generalHelpers";

//import models
import Assumptions from "../../models/Assumptions";
import Inputs from "../../models/Inputs";

//import interfaces
import IInputs from "../../interfaces/IInputs";
import { DateTime } from "luxon";

import GenerateMortgage from "../../helpers/mortgageLoanGenerator";
import GenerateLoan from "../../helpers/mortgageLoanGenerator";

//@route GET api/inputs/all/:id
//@desc gets all inputs by client id
//@access public
router.get("/all/:id", async (req: Request, res: Response) => {
  const client_id = req.params.id;
  try {
    //find and return inputs found by id
    const inputs = await Inputs.find({ client_id: client_id });
    inputs ? res.json(inputs) : res.json({ msg: "No inputs found" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

//@route GET api/inputs/:id
//@desc gets inputs by user set name
//@access public
router.get("/:id", async (req: Request, res: Response) => {
  //get id from params
  const id = req.params.id;

  //check if id is valid
  if (validateId(id)) {
    return res.json({ msg: "Invalid ID" });
  }

  try {
    //find and return inputs found by id
    const inputs = await Inputs.findOne({ _id: id });
    inputs ? res.json(inputs) : res.json({ msg: "No inputs found" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

//@route POST api/inputs
//@desc creates inputs
//@access public
router.post("/:id", async (req: Request, res: Response) => {
  const client_id = req.params.id;
  try {
    //get assumptions from db
    const assumptions: any = await Assumptions.findOne();
    //get inputs from request
    const inputs: IInputs = req.body;

    //duplicate set name check
    const foundInputs: any = await Inputs.findOne({ input_set_name: inputs.input_set_name });
    if (foundInputs) {
      res.status(203).json({ msg: "Input set name already exists" });
    } else {
      //Calculate input values
      const updatedInputs: IInputs = setInputValues(inputs, assumptions, client_id);

      //save new inputs into db
      const newInputs = new Inputs(updatedInputs);
      console.log(newInputs);

      await newInputs.save((err: any) => {
        if (!err) {
          res.send(newInputs);
        } else {
          res.send(err);
        }
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

//@route PUT api/inputs/:id
//@desc updates inputs by input id
//@access public
router.put("/:id", async (req, res) => {
  const updatedInputs = await Inputs.findOneAndReplace({ _id: req.body._id }, req.body);
  res.status(200).send({
    msg: "Successfully added a new goal",
    id: updatedInputs._id,
  });
});

//@route PATCH api/inputs/:id
//@desc updates inputs by input id
//@access public

router.patch("/:id", async (req: Request, res: Response) => {
  const client_id = req.params.id;
  try {
    //get assumptions from db
    const assumptions: any = await Assumptions.findOne();
    //get inputs from request
    const inputs: IInputs = req.body;

    //Calculate input values
    const updatedInputs: IInputs = setInputValues(inputs, assumptions, client_id);

    const response = await Inputs.findOneAndReplace({ _id: req.body._id }, updatedInputs);
    res.status(200).json(response);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

//@route DELETE api/inputs/:id
//@desc deletes inputs by input id
//@access public
router.delete("/:id", async (req: Request, res: Response) => {
  //get id from params
  const id = req.params.id;

  //check if id is valid
  if (validateId(id)) {
    return res.json({ msg: "Invalid ID" });
  }

  try {
    //check if inputs dont exist
    const foundInputs = await Inputs.findById(id);
    if (!foundInputs) {
      return res.status(404).json({ msg: "No Inputs found" });
    }

    //delete inputs
    await Inputs.findByIdAndDelete(id);

    res.status(200).json({ msg: "Deleted Inputs" });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
