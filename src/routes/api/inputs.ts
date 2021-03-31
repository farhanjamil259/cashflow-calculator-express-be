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
      newInputs.save((err: any) => {
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

//@route PATCH api/inputs/:id
//@desc updates inputs by input id
//@access public
router.patch("/:id", async (req: Request, res: Response) => {
  //get id from params
  const id = req.params.id;

  //check if id is valid
  if (validateId(id)) {
    return res.json({ msg: "Invalid ID" });
  }
  const inputs: IInputs = req.body;
  res.header("Access-Control-Allow-Origin", "*");

  inputs.mortgages = [];
  inputs.loans = [];
  //set mortgages
  inputs.liabilities.mortgages.map((mortgage) => {
    //generate mortgage
    const m = GenerateMortgage(
      mortgage.original_balance,
      mortgage.interest_rate,
      mortgage.mortgage_period,
      mortgage.number_of_payments_per_year,
      mortgage.start_year
    );
    const newMortgageObject = {
      user_input_field: {
        loan_amount: mortgage.original_balance,
        interest_rate: mortgage.interest_rate,
        number_of_years: mortgage.mortgage_period,
        number_of_payments_per_year: mortgage.number_of_payments_per_year,
        start_date: DateTime.local(mortgage.start_year, 1, 1).toLocaleString(DateTime.DATE_FULL),
      },
      fixed_calculations: {
        scheduled_payment_amount: m.scheduled_payment_amount,
        total_number_of_payments: m.total_no_payments,
        total_payment_amount: m.total_payment_amount,
        total_interest_paid: m.total_interest_paid,
        date_of_last_payment: m.date_of_last_payment.toLocaleString(DateTime.DATE_FULL),
        annual_payments: m.annual_payments,
      },
      details: m.array,
    };

    inputs.mortgages.push(newMortgageObject);
  });

  //set loans
  inputs.liabilities.other_loans.map((loan) => {
    //generate loan
    const m = GenerateLoan(
      loan.original_balance,
      loan.interest_rate,
      loan.loan_period,
      loan.number_of_payments_per_year,
      loan.start_year
    );
    const newLoanObject = {
      user_input_field: {
        loan_amount: loan.original_balance,
        interest_rate: loan.interest_rate,
        number_of_years: loan.loan_period,
        number_of_payments_per_year: loan.number_of_payments_per_year,
        start_date: DateTime.local(loan.start_year, 1, 1).toLocaleString(DateTime.DATE_FULL),
      },
      fixed_calculations: {
        scheduled_payment_amount: m.scheduled_payment_amount,
        total_number_of_payments: m.total_no_payments,
        total_payment_amount: m.total_payment_amount,
        total_interest_paid: m.total_interest_paid,
        date_of_last_payment: m.date_of_last_payment.toLocaleString(DateTime.DATE_FULL),
        annual_payments: m.annual_payments,
      },
      details: m.array,
    };

    if (loan.original_balance !== 0) {
      inputs.loans.push(newLoanObject);
    }
  });

  try {
    const newInputs = await Inputs.findByIdAndUpdate(id, { $set: inputs }, { new: true });

    !newInputs ? res.json({ msg: "Nothing to update" }) : res.send(newInputs);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
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
