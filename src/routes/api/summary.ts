import { Request, Response, Router } from "express";
const router = Router();

//import models
import Assumptions from "../../models/Assumptions";
import Inputs from "../../models/Inputs";

//import interfaces
import IForecast from "../../interfaces/IForecast";
import IInputs from "../../interfaces/IInputs";
import IAssumptions from "../../interfaces/IAssumptions";
import IChartsData from "../../interfaces/IChartsData";

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

    let chartsData: IChartsData = {
      type: "Nominal",
      years: [],
      retirement_ages: [],
      ages: {
        owners: [],
        children: [],
      },
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
      assets_and_liabilities: {
        aggregated_bank_accounts: [],
        savings_and_investments: [],
        pension_plans: [],
        properties: [],
        liabilities: [],
      },
      income: {
        employment_income: [],
        self_employment_income: [],
        rental_income: [],
        dividend_income: [],
        savings_and_investments_drawdowns: [],
        pension_income: [],
        other_income: [],
        bank_accounts: [],
        total_income: [],
      },
      expenses: {
        housing: [],
        consumables: [],
        travel: [],
        shopping: [],
        entertainment: [],
        holiday: [],
        one_off: [],
        children_education: [],
        financial: [],
        additional_tax_charge: [],
      },
    };

    inputs.household_owners.map((o) => {
      chartsData.retirement_ages.push(o.retirement_age);
      chartsData.ages.owners.push([]);
    });

    inputs.children.map((o) => {
      chartsData.ages.children.push([]);
    });

    yearsSummaryArray.map((s) => {
      chartsData.years.push(s.year);

      inputs.household_owners.map((o, i) => {
        chartsData.ages.owners[i].push(s.ages.owner_ages[i].age);
      });

      inputs.children.map((o, i) => {
        chartsData.ages.children[i].push(s.ages.children_ages[i].age);
      });

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

      chartsData.assets_and_liabilities.aggregated_bank_accounts.push(
        Math.round(s.assets_and_liabilities_analysis.aggregated_bank_accounts)
      );
      chartsData.assets_and_liabilities.savings_and_investments.push(
        Math.round(s.assets_and_liabilities_analysis.total_savings_and_investments)
      );
      chartsData.assets_and_liabilities.pension_plans.push(
        Math.round(s.assets_and_liabilities_analysis.total_pension_plans)
      );

      chartsData.assets_and_liabilities.properties.push(
        s.property_analysis.property_details.reduce((a, b) => a + b.amount, 0)
      );

      chartsData.assets_and_liabilities.liabilities.push(
        Math.round(
          -s.assets_and_liabilities_analysis.total_mortgages -
            s.assets_and_liabilities_analysis.total_other_loans -
            s.assets_and_liabilities_analysis.credit_card
        )
      );

      chartsData.income.employment_income.push(Math.round(s.income_analysis.total_employment_income));
      chartsData.income.self_employment_income.push(
        Math.round(s.income_analysis.total_self_employment_income)
      );
      chartsData.income.rental_income.push(Math.round(s.income_analysis.total_rental_income));
      chartsData.income.dividend_income.push(Math.round(s.income_analysis.total_dividend_income));
      chartsData.income.savings_and_investments_drawdowns.push(
        Math.round(s.income_analysis.total_savings_and_investments_drawdowns)
      );
      chartsData.income.pension_income.push(Math.round(s.income_analysis.total_pension_income));
      chartsData.income.other_income.push(Math.round(s.income_analysis.total_other_income));
      chartsData.income.bank_accounts.push(Math.round(s.income_analysis.aggregated_bank_accounts));
      chartsData.income.total_income.push(
        s.income_analysis.total_employment_income +
          s.income_analysis.total_self_employment_income +
          s.income_analysis.total_rental_income +
          s.income_analysis.total_dividend_income +
          s.income_analysis.total_savings_and_investments_drawdowns +
          s.income_analysis.total_pension_income +
          s.income_analysis.total_other_income +
          s.income_analysis.aggregated_bank_accounts
      );

      chartsData.expenses.housing.push(Math.round(s.expense_analysis.total_housing_expenses));
      chartsData.expenses.consumables.push(Math.round(s.expense_analysis.total_consumables_expenses));
      chartsData.expenses.travel.push(Math.round(s.expense_analysis.total_travel_expenses));
      chartsData.expenses.shopping.push(Math.round(s.expense_analysis.total_shopping_expenses));
      chartsData.expenses.entertainment.push(Math.round(s.expense_analysis.total_entertainment_expenses));
      chartsData.expenses.holiday.push(Math.round(s.expense_analysis.total_holiday_expenses));
      chartsData.expenses.one_off.push(Math.round(s.expense_analysis.total_one_off_expenses));
      chartsData.expenses.children_education.push(
        Math.round(s.expense_analysis.total_children_education_expenses)
      );
      chartsData.expenses.financial.push(Math.round(s.expense_analysis.total_financial_expenses));
      chartsData.expenses.additional_tax_charge.push(
        Math.round(s.expense_analysis.total_additional_tax_charge)
      );
    });

    res.send(chartsData);

    // res.send(yearsSummaryArray);

    // res.send(yearsArray);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
