import { Request, Response, Router } from "express";
const router = Router();

//import models
import Assumptions from "../../models/Assumptions";

//import interfaces
import IAssumptions from "../../interfaces/IAssumptions";

//@route GET api/assumptions
//@desc gets assumptions
//@access public
router.get("/", async (req: Request, res: Response) => {
  try {
    const foundAssumptions = await Assumptions.findOne();
    foundAssumptions
      ? res.status(200).json(foundAssumptions)
      : res.status(400).json({ msg: "No Assumptions Added" });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
});

//@route POST api/assumptions
//@desc create/update assumptions
//@access public

router.post("/", async (req: Request, res: Response) => {
  //deconstructing request body
  const {
    sdlt_thresholds,
    isaa,
    pension_contribution_allowance,
    pension_contribution_allowance_tapering,
    income_tax_rate_thresholds,
    income_limits,
    employement_minimum_pension_contributions,
    employment_nic_thresholds,
    self_employment_nic_class_2_threshold,
    self_employment_nic_class_4_threshold,
    dividend_tax_rate_thresholds,
    residential_property_captical_gains_tax_rate_thresholds,
    other_assets_capital_gains_tax_rate_thresholds,
    income_limits_2,
    market_data,
    inputs_assumptions,
  } = req.body;

  //build assumptions object for assumptions model from deconstructed request body
  const assumptions: IAssumptions = {
    sdlt_thresholds: {
      c5: {
        threshold: sdlt_thresholds.c5.threshold,
        taxrate: sdlt_thresholds.c5.taxrate,
      },
      c6: {
        threshold: sdlt_thresholds.c6.threshold,
        taxrate: sdlt_thresholds.c6.taxrate,
      },
      c7: {
        threshold: sdlt_thresholds.c7.threshold,
        taxrate: sdlt_thresholds.c7.taxrate,
      },
      c8: {
        threshold: sdlt_thresholds.c8.threshold,
        taxrate: sdlt_thresholds.c8.taxrate,
      },
      c9: {
        threshold: sdlt_thresholds.c9.threshold,
        taxrate: sdlt_thresholds.c9.taxrate,
      },
    },
    isaa: {
      annual_contribution_allowance: {
        allowance: isaa.annual_contribution_allowance.allowance,
        rate: isaa.annual_contribution_allowance.rate,
      },
    },
    pension_contribution_allowance: {
      contribution_annual_allowance: {
        allowance: pension_contribution_allowance.contribution_annual_allowance.allowance,
        rate: pension_contribution_allowance.contribution_annual_allowance.rate,
      },
      lifetime_allowance: {
        allowance: pension_contribution_allowance.lifetime_allowance.allowance,
        rate: pension_contribution_allowance.lifetime_allowance.rate,
      },
      contribution_annual_allowance_floor: {
        allowance: pension_contribution_allowance.lifetime_allowance.allowance,
        rate: pension_contribution_allowance.lifetime_allowance.rate,
      },
    },
    pension_contribution_allowance_tapering: {
      threshold_income: {
        threshold: pension_contribution_allowance_tapering.threshold_income.threshold,
        rate: pension_contribution_allowance_tapering.threshold_income.rate,
      },
      lifetime_allowance: {
        threshold: pension_contribution_allowance_tapering.lifetime_allowance.threshold,
        rate: pension_contribution_allowance_tapering.lifetime_allowance.rate,
      },
    },
    income_tax_rate_thresholds: {
      personal_allowance: {
        threshold: income_tax_rate_thresholds.personal_allowance.threshold,
        rate: income_tax_rate_thresholds.personal_allowance.rate,
      },
      basic_rate: {
        threshold: income_tax_rate_thresholds.basic_rate.threshold,
        rate: income_tax_rate_thresholds.basic_rate.rate,
      },
      higher_rate: {
        threshold: income_tax_rate_thresholds.higher_rate.threshold,
        rate: income_tax_rate_thresholds.higher_rate.rate,
      },
      additional_rate: {
        threshold: income_tax_rate_thresholds.additional_rate.threshold,
        rate: income_tax_rate_thresholds.additional_rate.rate,
      },
    },
    income_limits: {
      income_limit_for_personal_allowance: {
        threshold: income_limits.income_limit_for_personal_allowance.threshold,
        rate: income_limits.income_limit_for_personal_allowance.rate,
      },
    },
    employement_minimum_pension_contributions: {
      minimum_contributions: {
        member: employement_minimum_pension_contributions.minimum_contributions.member,
        employer: employement_minimum_pension_contributions.minimum_contributions.employer,
      },
    },
    employment_nic_thresholds: {
      lower_earnings: {
        threshold: employment_nic_thresholds.lower_earnings.threshold,
        rate: employment_nic_thresholds.lower_earnings.rate,
      },
      primary_threshold: {
        threshold: employment_nic_thresholds.primary_threshold.threshold,
        rate: employment_nic_thresholds.primary_threshold.rate,
      },
      upper_earnings_limit: {
        threshold: employment_nic_thresholds.upper_earnings_limit.threshold,
        rate: employment_nic_thresholds.upper_earnings_limit.rate,
      },
    },
    self_employment_nic_class_2_threshold: {
      small_profit_rate: {
        threshold: self_employment_nic_class_2_threshold.small_profit_rate.threshold,
        rate: self_employment_nic_class_2_threshold.small_profit_rate.rate,
      },
    },
    self_employment_nic_class_4_threshold: {
      lower_profits_limit: {
        threshold: self_employment_nic_class_4_threshold.lower_profits_limit.threshold,
        rate: self_employment_nic_class_4_threshold.lower_profits_limit.rate,
      },
      upper_earnings_limit: {
        threshold: self_employment_nic_class_4_threshold.upper_earnings_limit.threshold,
        rate: self_employment_nic_class_4_threshold.upper_earnings_limit.rate,
      },
    },
    dividend_tax_rate_thresholds: {
      personal_allowance: {
        threshold: dividend_tax_rate_thresholds.personal_allowance.threshold,
        rate: dividend_tax_rate_thresholds.personal_allowance.rate,
      },
      basic_rate: {
        threshold: dividend_tax_rate_thresholds.basic_rate.threshold,
        rate: dividend_tax_rate_thresholds.basic_rate.rate,
      },
      higher_rate: {
        threshold: dividend_tax_rate_thresholds.higher_rate.threshold,
        rate: dividend_tax_rate_thresholds.higher_rate.rate,
      },
      additional_rate: {
        threshold: dividend_tax_rate_thresholds.additional_rate.threshold,
        rate: dividend_tax_rate_thresholds.additional_rate.rate,
      },
    },

    residential_property_captical_gains_tax_rate_thresholds: {
      basic_rate: {
        threshold: residential_property_captical_gains_tax_rate_thresholds.basic_rate.threshold,
        rate: residential_property_captical_gains_tax_rate_thresholds.basic_rate.rate,
      },
      higher_and_additional_rate: {
        threshold:
          residential_property_captical_gains_tax_rate_thresholds.higher_and_additional_rate.threshold,
        rate: residential_property_captical_gains_tax_rate_thresholds.higher_and_additional_rate.rate,
      },
    },
    other_assets_capital_gains_tax_rate_thresholds: {
      basic_rate: {
        threshold: other_assets_capital_gains_tax_rate_thresholds.basic_rate.threshold,
        rate: other_assets_capital_gains_tax_rate_thresholds.basic_rate.rate,
      },
      higher_and_additional_rate: {
        threshold: other_assets_capital_gains_tax_rate_thresholds.higher_and_additional_rate.threshold,
        rate: other_assets_capital_gains_tax_rate_thresholds.higher_and_additional_rate.rate,
      },
    },
    income_limits_2: {
      capital_gains_tax_annual_exempt_amount: {
        threshold: income_limits_2.capital_gains_tax_annual_exempt_amount.threshold,
      },
    },

    market_data: {
      property_price_inflation: {
        notes: market_data.property_price_inflation.notes,
        rate: market_data.property_price_inflation.rate,
      },
      cash_and_money_market_yield: {
        notes: market_data.cash_and_money_market_yield.notes,
        rate: market_data.cash_and_money_market_yield.rate,
      },
      savings_and_investment_growth_rate: {
        notes: market_data.savings_and_investment_growth_rate.notes,
        rate: market_data.savings_and_investment_growth_rate.rate,
      },
      earning_growth_rate: {
        notes: market_data.earning_growth_rate.notes,
        rate: market_data.earning_growth_rate.rate,
      },
      retain_price_index: {
        notes: market_data.retain_price_index.notes,
        rate: market_data.retain_price_index.rate,
      },
      consumer_price_index: {
        notes: market_data.consumer_price_index.notes,
        rate: market_data.consumer_price_index.rate,
      },
      annuity: {
        notes: market_data.annuity.notes,
        rate: market_data.annuity.rate,
      },
      private_school_fee_inflation: {
        notes: market_data.private_school_fee_inflation.notes,
        rate: market_data.private_school_fee_inflation.rate,
      },
    },
    inputs_assumptions: {
      end_of_forecast_age: inputs_assumptions.end_of_forecast_age,
      primary_school_age: inputs_assumptions.primary_school_age,
      secondary_school_age: inputs_assumptions.secondary_school_age,
      university_age: inputs_assumptions.university_age,
      graduation_age: inputs_assumptions.graduation_age,
      bank_account_growth_rate: inputs_assumptions.bank_account_growth_rate,
      credit_card_interest_rate: inputs_assumptions.credit_card_interest_rate,
      state_pension_annual_amount: inputs_assumptions.state_pension_annual_amount,
      state_pension_age: inputs_assumptions.state_pension_age,
    },
  };

  try {
    //find the first assumption in database
    let foundAssumptions = await Assumptions.findOne();

    //if an assumption is found update it, if not then create a new assumptions
    if (foundAssumptions) {
      foundAssumptions = await Assumptions.findByIdAndUpdate(
        foundAssumptions._id,
        { $set: assumptions },
        { new: true }
      );
      res.send(foundAssumptions);
    } else {
      const newAssumptions = new Assumptions(assumptions);
      await newAssumptions.save();
      res.send(newAssumptions);
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
