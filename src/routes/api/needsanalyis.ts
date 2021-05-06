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

interface ICashflow {
  cashflow: {
    employment_income: number[];
    self_employment_income: number[];
    rental_income: number[];
    dividend_income: number[];
    savings_and_investments_drawdowns: number[];
    pension_income: number[];
    residential_property_sales_proceeds: number[];
    other_income: number[];
    bank_accounts: number[];
    expenses: number[];
    shortfall: number[];
  };
}

router.get("/:id", async (req: Request, res: Response) => {
  try {
    //get Inputs by id
    const id = req.params.id;

    let tempvar = 0;
    const foundInputs: any = await Inputs.findById(id);
    const foundAssumptions: any = await Assumptions.findOne();

    if (!foundInputs) {
      res.status(404).json({ msg: "No inputs found" });
    }

    let isShortfall: boolean = true;

    const inputs: IInputs = foundInputs;

    inputs.household_income.other_income.other_non_taxable_income[0].gross_annual_amount = 0;
    inputs.household_income.other_income.other_non_taxable_income[0].inflation = 0;

    const assumptions: IAssumptions = foundAssumptions;

    while (isShortfall) {
      const yearsArray: Array<IForecast> = [];

      //calculate and push initial year into years array
      yearsArray.push(setInitialForecastYear(inputs, assumptions));

      //calculate and push remaining calculated years into years array
      setRemainingForecastYears(inputs, assumptions, yearsArray);

      const yearsSummaryArray = setForecastSummary(yearsArray, inputs);

      let chartsData: ICashflow = {
        cashflow: {
          employment_income: [],
          self_employment_income: [],
          rental_income: [],
          dividend_income: [],
          savings_and_investments_drawdowns: [],
          pension_income: [],
          residential_property_sales_proceeds: [],
          other_income: [],
          bank_accounts: [],
          expenses: [],
          shortfall: [],
        },
      };

      yearsSummaryArray.map((s) => {
        chartsData.cashflow.employment_income.push(Math.round(s.income_analysis.total_employment_income));
        chartsData.cashflow.self_employment_income.push(
          Math.round(s.income_analysis.total_self_employment_income)
        );
        chartsData.cashflow.rental_income.push(Math.round(s.income_analysis.total_rental_income));
        chartsData.cashflow.dividend_income.push(Math.round(s.income_analysis.total_dividend_income));
        chartsData.cashflow.savings_and_investments_drawdowns.push(
          Math.round(s.income_analysis.total_savings_and_investments_drawdowns)
        );
        chartsData.cashflow.pension_income.push(Math.round(s.income_analysis.total_pension_income));
        chartsData.cashflow.residential_property_sales_proceeds.push(
          Math.round(s.income_analysis.total_residential_sale_proceeds)
        );
        chartsData.cashflow.other_income.push(Math.round(s.income_analysis.total_other_income));
        chartsData.cashflow.bank_accounts.push(Math.round(s.income_analysis.aggregated_bank_accounts));
        chartsData.cashflow.expenses.push(Math.round(s.expense_analysis.total_expenses));

        chartsData.cashflow.shortfall.push(
          Math.round(
            Math.max(
              0,
              s.expense_analysis.total_expenses -
                (s.income_analysis.total_employment_income +
                  s.income_analysis.total_self_employment_income +
                  s.income_analysis.total_rental_income +
                  s.income_analysis.total_dividend_income +
                  s.income_analysis.total_savings_and_investments_drawdowns +
                  s.income_analysis.total_pension_income +
                  s.income_analysis.total_residential_sale_proceeds +
                  s.income_analysis.total_other_income +
                  s.income_analysis.aggregated_bank_accounts)
            )
          )
        );
      });

      let totalShortfall = 0;

      chartsData.cashflow.shortfall.map((sf) => {
        totalShortfall += sf;
      });

      if (totalShortfall <= 0) {
        isShortfall = false;
        break;
      }
      inputs.household_income.other_income.other_non_taxable_income[0].gross_annual_amount += 5000;
    }
    inputs.household_income.other_income.other_non_taxable_income[0].gross_annual_amount -= 10000;
    isShortfall = true;
    while (isShortfall) {
      const yearsArray: Array<IForecast> = [];

      //calculate and push initial year into years array
      yearsArray.push(setInitialForecastYear(inputs, assumptions));

      //calculate and push remaining calculated years into years array
      setRemainingForecastYears(inputs, assumptions, yearsArray);

      const yearsSummaryArray = setForecastSummary(yearsArray, inputs);

      let chartsData: ICashflow = {
        cashflow: {
          employment_income: [],
          self_employment_income: [],
          rental_income: [],
          dividend_income: [],
          savings_and_investments_drawdowns: [],
          pension_income: [],
          residential_property_sales_proceeds: [],
          other_income: [],
          bank_accounts: [],
          expenses: [],
          shortfall: [],
        },
      };

      yearsSummaryArray.map((s) => {
        chartsData.cashflow.employment_income.push(Math.round(s.income_analysis.total_employment_income));
        chartsData.cashflow.self_employment_income.push(
          Math.round(s.income_analysis.total_self_employment_income)
        );
        chartsData.cashflow.rental_income.push(Math.round(s.income_analysis.total_rental_income));
        chartsData.cashflow.dividend_income.push(Math.round(s.income_analysis.total_dividend_income));
        chartsData.cashflow.savings_and_investments_drawdowns.push(
          Math.round(s.income_analysis.total_savings_and_investments_drawdowns)
        );
        chartsData.cashflow.pension_income.push(Math.round(s.income_analysis.total_pension_income));
        chartsData.cashflow.residential_property_sales_proceeds.push(
          Math.round(s.income_analysis.total_residential_sale_proceeds)
        );
        chartsData.cashflow.other_income.push(Math.round(s.income_analysis.total_other_income));
        chartsData.cashflow.bank_accounts.push(Math.round(s.income_analysis.aggregated_bank_accounts));
        chartsData.cashflow.expenses.push(Math.round(s.expense_analysis.total_expenses));

        chartsData.cashflow.shortfall.push(
          Math.round(
            Math.max(
              0,
              s.expense_analysis.total_expenses -
                (s.income_analysis.total_employment_income +
                  s.income_analysis.total_self_employment_income +
                  s.income_analysis.total_rental_income +
                  s.income_analysis.total_dividend_income +
                  s.income_analysis.total_savings_and_investments_drawdowns +
                  s.income_analysis.total_pension_income +
                  s.income_analysis.total_residential_sale_proceeds +
                  s.income_analysis.total_other_income +
                  s.income_analysis.aggregated_bank_accounts)
            )
          )
        );
      });

      let totalShortfall = 0;

      chartsData.cashflow.shortfall.map((sf) => {
        totalShortfall += sf;
      });
      tempvar += 1;
      if (totalShortfall <= 0) {
        isShortfall = false;
        break;
      }
      inputs.household_income.other_income.other_non_taxable_income[0].gross_annual_amount += 1000;
      console.log(inputs.household_income.other_income.other_non_taxable_income[0].gross_annual_amount);
    }

    inputs.household_income.other_income.other_non_taxable_income[0].gross_annual_amount -= 5000;
    isShortfall = true;
    while (isShortfall) {
      const yearsArray: Array<IForecast> = [];

      //calculate and push initial year into years array
      yearsArray.push(setInitialForecastYear(inputs, assumptions));

      //calculate and push remaining calculated years into years array
      setRemainingForecastYears(inputs, assumptions, yearsArray);

      const yearsSummaryArray = setForecastSummary(yearsArray, inputs);

      let chartsData: ICashflow = {
        cashflow: {
          employment_income: [],
          self_employment_income: [],
          rental_income: [],
          dividend_income: [],
          savings_and_investments_drawdowns: [],
          pension_income: [],
          residential_property_sales_proceeds: [],
          other_income: [],
          bank_accounts: [],
          expenses: [],
          shortfall: [],
        },
      };

      yearsSummaryArray.map((s) => {
        chartsData.cashflow.employment_income.push(Math.round(s.income_analysis.total_employment_income));
        chartsData.cashflow.self_employment_income.push(
          Math.round(s.income_analysis.total_self_employment_income)
        );
        chartsData.cashflow.rental_income.push(Math.round(s.income_analysis.total_rental_income));
        chartsData.cashflow.dividend_income.push(Math.round(s.income_analysis.total_dividend_income));
        chartsData.cashflow.savings_and_investments_drawdowns.push(
          Math.round(s.income_analysis.total_savings_and_investments_drawdowns)
        );
        chartsData.cashflow.pension_income.push(Math.round(s.income_analysis.total_pension_income));
        chartsData.cashflow.residential_property_sales_proceeds.push(
          Math.round(s.income_analysis.total_residential_sale_proceeds)
        );
        chartsData.cashflow.other_income.push(Math.round(s.income_analysis.total_other_income));
        chartsData.cashflow.bank_accounts.push(Math.round(s.income_analysis.aggregated_bank_accounts));
        chartsData.cashflow.expenses.push(Math.round(s.expense_analysis.total_expenses));

        chartsData.cashflow.shortfall.push(
          Math.round(
            Math.max(
              0,
              s.expense_analysis.total_expenses -
                (s.income_analysis.total_employment_income +
                  s.income_analysis.total_self_employment_income +
                  s.income_analysis.total_rental_income +
                  s.income_analysis.total_dividend_income +
                  s.income_analysis.total_savings_and_investments_drawdowns +
                  s.income_analysis.total_pension_income +
                  s.income_analysis.total_residential_sale_proceeds +
                  s.income_analysis.total_other_income +
                  s.income_analysis.aggregated_bank_accounts)
            )
          )
        );
      });

      let totalShortfall = 0;

      chartsData.cashflow.shortfall.map((sf) => {
        totalShortfall += sf;
      });

      tempvar += 1;

      if (totalShortfall <= 0) {
        isShortfall = false;
        break;
      }
      inputs.household_income.other_income.other_non_taxable_income[0].gross_annual_amount += 200;
    }

    inputs.household_income.other_income.other_non_taxable_income[0].gross_annual_amount -= 200;
    isShortfall = true;
    while (isShortfall) {
      const yearsArray: Array<IForecast> = [];

      //calculate and push initial year into years array
      yearsArray.push(setInitialForecastYear(inputs, assumptions));

      //calculate and push remaining calculated years into years array
      setRemainingForecastYears(inputs, assumptions, yearsArray);

      const yearsSummaryArray = setForecastSummary(yearsArray, inputs);

      let chartsData: ICashflow = {
        cashflow: {
          employment_income: [],
          self_employment_income: [],
          rental_income: [],
          dividend_income: [],
          savings_and_investments_drawdowns: [],
          pension_income: [],
          residential_property_sales_proceeds: [],
          other_income: [],
          bank_accounts: [],
          expenses: [],
          shortfall: [],
        },
      };

      yearsSummaryArray.map((s) => {
        chartsData.cashflow.employment_income.push(Math.round(s.income_analysis.total_employment_income));
        chartsData.cashflow.self_employment_income.push(
          Math.round(s.income_analysis.total_self_employment_income)
        );
        chartsData.cashflow.rental_income.push(Math.round(s.income_analysis.total_rental_income));
        chartsData.cashflow.dividend_income.push(Math.round(s.income_analysis.total_dividend_income));
        chartsData.cashflow.savings_and_investments_drawdowns.push(
          Math.round(s.income_analysis.total_savings_and_investments_drawdowns)
        );
        chartsData.cashflow.pension_income.push(Math.round(s.income_analysis.total_pension_income));
        chartsData.cashflow.residential_property_sales_proceeds.push(
          Math.round(s.income_analysis.total_residential_sale_proceeds)
        );
        chartsData.cashflow.other_income.push(Math.round(s.income_analysis.total_other_income));
        chartsData.cashflow.bank_accounts.push(Math.round(s.income_analysis.aggregated_bank_accounts));
        chartsData.cashflow.expenses.push(Math.round(s.expense_analysis.total_expenses));

        chartsData.cashflow.shortfall.push(
          Math.round(
            Math.max(
              0,
              s.expense_analysis.total_expenses -
                (s.income_analysis.total_employment_income +
                  s.income_analysis.total_self_employment_income +
                  s.income_analysis.total_rental_income +
                  s.income_analysis.total_dividend_income +
                  s.income_analysis.total_savings_and_investments_drawdowns +
                  s.income_analysis.total_pension_income +
                  s.income_analysis.total_residential_sale_proceeds +
                  s.income_analysis.total_other_income +
                  s.income_analysis.aggregated_bank_accounts)
            )
          )
        );
      });

      let totalShortfall = 0;

      chartsData.cashflow.shortfall.map((sf) => {
        totalShortfall += sf;
      });

      tempvar += 1;
      if (totalShortfall <= 0) {
        isShortfall = false;
        break;
      }
      inputs.household_income.other_income.other_non_taxable_income[0].gross_annual_amount += 10;
    }

    console.log(tempvar);

    res.status(200).json({
      amountNeeded: inputs.household_income.other_income.other_non_taxable_income[0].gross_annual_amount,
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
