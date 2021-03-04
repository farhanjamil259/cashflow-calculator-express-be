import { Request, Response, Router } from "express";
const router = Router();

//import models
import Assumptions from "../../models/Assumptions";
import Inputs from "../../models/Inputs";

//import interfaces
import IForecast from "../../interfaces/IForecast";
import IInputs from "../../interfaces/IInputs";
import IAssumptions from "../../interfaces/IAssumptions";

//import helpers
import { setInitialForecastYear } from "../../helpers/setForecast";
import setRemainingForecastYears from "../../helpers/setRemainingForecastYears";
import setForecastSummary from "../../helpers/setForecastSummary";

router.get("/:id", async (req: Request, res: Response) => {
  try {
    //get Inputs by id
    const id = req.params.id;

    const foundInputs: any = await Inputs.findById(id);
    const foundAssumptions: any = await Assumptions.findOne();

    if (!foundInputs) {
      res.status(404).json({ msg: "No inputs found" });
    }

    const inputs: IInputs = foundInputs;
    const assumptions: IAssumptions = foundAssumptions;

    const yearsArray: Array<IForecast> = [];

    //calculate and push initial year into years array
    yearsArray.push(setInitialForecastYear(inputs, assumptions));

    //calculate and push remaining calculated years into years array
    setRemainingForecastYears(inputs, assumptions, yearsArray);

    const yearsSummaryArray = setForecastSummary(yearsArray, inputs);
    res.send(yearsSummaryArray);
    // res.send(yearsArray);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
