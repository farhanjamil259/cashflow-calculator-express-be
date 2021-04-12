import IForecast from "../interfaces/IForecast";
import IForecastSummary from "../interfaces/IForecastSummary";
import IInputs from "../interfaces/IInputs";

const setForecastSummary = (yearsArray: Array<IForecast>, inputs: IInputs) => {
  const yearsSummaryArray: Array<IForecastSummary> = [];

  yearsArray.map((ya, i) => {
    const lastYearObject = yearsArray[i - 1];

    const yearsSummaryObject: IForecastSummary = {
      retirement_ages: [],
      year: 0,
      ages: {
        owner_ages: [],
        children_ages: [],
      },
      assets_and_liabilities_analysis: {
        aggregated_bank_accounts: 0,
        total_savings_and_investments: 0,
        total_pension_plans: 0,
        total_mortgages: 0,
        total_other_loans: 0,
        credit_card: 0,
        net_asset_possition: 0,
      },
      cash_flow_analysis: {
        total_household_income: 0,
        total_household_expenses: 0,
        annual_cash_inflow_outflow: 0,
      },
      income_analysis: {
        total_employment_income: 0,
        total_self_employment_income: 0,
        total_rental_income: 0,
        total_dividend_income: 0,
        total_savings_and_investments_drawdowns: 0,
        total_pension_income: 0,
        total_residential_sale_proceeds: 0,
        total_other_income: 0,
        aggregated_bank_accounts: 0,
        total_income: 0,
      },
      expense_analysis: {
        total_housing_expenses: 0,
        total_consumables_expenses: 0,
        total_travel_expenses: 0,
        total_shopping_expenses: 0,
        total_entertainment_expenses: 0,
        total_holiday_expenses: 0,
        total_one_off_expenses: 0,
        total_children_education_expenses: 0,
        total_financial_expenses: 0,
        total_additional_tax_charge: 0,
        total_expenses: 0,
      },
      income_tax_analysis: {
        details: [],
        overall_effective_tax_rate: 0,
      },

      tax_and_expenses_as_a_percentage_of_income: {
        tax_and_expenses_as_a_percentage_of_income: 0,
      },
      property_analysis: {
        property_details: [],
        mortgage_details: [],
        ltv_details: [],
        net_position: 0,
      },
    };

    //set retirement ages
    inputs.household_owners.map((o) => {
      yearsSummaryObject.retirement_ages.push(o.retirement_year);
    });

    //set general information
    yearsSummaryObject.year = ya.year;
    yearsSummaryObject.ages = ya.ages;

    //set assets and liabilites
    //--
    yearsSummaryObject.assets_and_liabilities_analysis.aggregated_bank_accounts =
      ya.assets.bank_account.amount;
    yearsSummaryObject.assets_and_liabilities_analysis.total_savings_and_investments =
      ya.assets.savings_and_investments.total;
    //--

    yearsSummaryObject.assets_and_liabilities_analysis.total_pension_plans =
      ya.assets.personal_pension_plans.total;
    yearsSummaryObject.assets_and_liabilities_analysis.total_mortgages = ya.creditors.mortgages.total;
    yearsSummaryObject.assets_and_liabilities_analysis.total_other_loans = ya.creditors.other_loans.total;
    //--
    yearsSummaryObject.assets_and_liabilities_analysis.credit_card = ya.creditors.credit_cards.end_of_period;

    yearsSummaryObject.assets_and_liabilities_analysis.net_asset_possition =
      yearsSummaryObject.assets_and_liabilities_analysis.aggregated_bank_accounts +
      yearsSummaryObject.assets_and_liabilities_analysis.total_savings_and_investments +
      yearsSummaryObject.assets_and_liabilities_analysis.total_pension_plans +
      yearsSummaryObject.assets_and_liabilities_analysis.total_mortgages +
      yearsSummaryObject.assets_and_liabilities_analysis.total_other_loans +
      yearsSummaryObject.assets_and_liabilities_analysis.credit_card;

    //set cash flow analysis
    yearsSummaryObject.cash_flow_analysis.total_household_income =
      ya.household_income.total - ya.auto_liquidation.aggregated_bank_Accounts;
    yearsSummaryObject.cash_flow_analysis.total_household_expenses =
      ya.household_expenses.total_household_expenses;

    yearsSummaryObject.cash_flow_analysis.annual_cash_inflow_outflow =
      yearsSummaryObject.cash_flow_analysis.total_household_income +
      yearsSummaryObject.cash_flow_analysis.total_household_expenses;

    //set income analysis
    yearsSummaryObject.income_analysis.total_employment_income = ya.household_income.employment_income.total;
    yearsSummaryObject.income_analysis.total_self_employment_income =
      ya.household_income.self_employment_income.total;
    yearsSummaryObject.income_analysis.total_rental_income = ya.household_income.rental_income.total;
    yearsSummaryObject.income_analysis.total_dividend_income = ya.household_income.dividend_income.total;
    yearsSummaryObject.income_analysis.total_savings_and_investments_drawdowns =
      ya.household_income.savings_and_investments_income.total -
      ya.auto_liquidation.individual_savings_accounts.details.reduce((a, b) => a + b.amount, 0) -
      ya.auto_liquidation.general_investment_accounts.details.reduce((a, b) => a + b.amount, 0);
    yearsSummaryObject.income_analysis.total_pension_income =
      ya.household_income.pension_income.total -
      ya.auto_liquidation.pension_plans.details.reduce((a, b) => a + b.amount, 0);
    yearsSummaryObject.income_analysis.total_residential_sale_proceeds =
      ya.household_income.residential_property_sale_proceeds.total;
    yearsSummaryObject.income_analysis.total_other_income = ya.household_income.other_income.total;
    yearsSummaryObject.income_analysis.aggregated_bank_accounts = -ya.auto_liquidation
      .aggregated_bank_Accounts;

    yearsSummaryObject.income_analysis.total_income =
      yearsSummaryObject.income_analysis.total_employment_income +
      yearsSummaryObject.income_analysis.total_self_employment_income +
      yearsSummaryObject.income_analysis.total_rental_income +
      yearsSummaryObject.income_analysis.total_dividend_income +
      yearsSummaryObject.income_analysis.total_savings_and_investments_drawdowns +
      yearsSummaryObject.income_analysis.total_pension_income +
      yearsSummaryObject.income_analysis.total_other_income +
      yearsSummaryObject.income_analysis.aggregated_bank_accounts;

    //set expense analysis
    yearsSummaryObject.expense_analysis.total_housing_expenses = -ya.household_expenses.housing.total;
    yearsSummaryObject.expense_analysis.total_consumables_expenses = -ya.household_expenses.consumables.total;
    yearsSummaryObject.expense_analysis.total_travel_expenses = -ya.household_expenses.travel.total;
    yearsSummaryObject.expense_analysis.total_shopping_expenses = -ya.household_expenses.shopping.total;
    yearsSummaryObject.expense_analysis.total_entertainment_expenses = -ya.household_expenses.entertainment
      .total;
    yearsSummaryObject.expense_analysis.total_holiday_expenses = -ya.household_expenses.holiday.total;
    yearsSummaryObject.expense_analysis.total_one_off_expenses = -ya.household_expenses.one_off_expenses
      .total;
    yearsSummaryObject.expense_analysis.total_children_education_expenses = -ya.household_expenses
      .children_education_expenses.total;
    yearsSummaryObject.expense_analysis.total_financial_expenses = -ya.household_expenses.financials.total;
    yearsSummaryObject.expense_analysis.total_additional_tax_charge = -ya.household_expenses
      .additional_tax_charge.total_additional_tax_charge;

    yearsSummaryObject.expense_analysis.total_expenses =
      yearsSummaryObject.expense_analysis.total_housing_expenses +
      yearsSummaryObject.expense_analysis.total_consumables_expenses +
      yearsSummaryObject.expense_analysis.total_travel_expenses +
      yearsSummaryObject.expense_analysis.total_shopping_expenses +
      yearsSummaryObject.expense_analysis.total_entertainment_expenses +
      yearsSummaryObject.expense_analysis.total_holiday_expenses +
      yearsSummaryObject.expense_analysis.total_one_off_expenses +
      yearsSummaryObject.expense_analysis.total_children_education_expenses +
      yearsSummaryObject.expense_analysis.total_financial_expenses +
      yearsSummaryObject.expense_analysis.total_additional_tax_charge;

    //set income tax analysis
    let totalTax = 0;
    let totalTaxableIncome = 0;
    ya.household_expenses.additional_tax_charge.details.map((atc, i) => {
      const name = atc.name;
      const income_tax_charge =
        -atc.income_tax_charge_on_non_dividend_income - atc.income_tax_charge_on_dividend_income;
      const national_insurance =
        -ya.household_income.employment_income.details[i].nic_class_1_charge -
        atc.nic_class_2_charge -
        atc.nic_class_4_charge;
      const total_tax_income = income_tax_charge + national_insurance;
      const total_taxable_income =
        ya.household_expenses.additional_tax_charge.details[i].total_taxable_income_excluding_dividends -
        ya.household_expenses.additional_tax_charge.details[i].pension_plan -
        ya.household_expenses.additional_tax_charge.details[i].prior_year_excess_pension_contribution;
      const effective_tax_rate = total_tax_income / total_taxable_income;

      yearsSummaryObject.income_tax_analysis.details.push({
        name,
        income_tax_charge,
        national_insurance,
        total_tax_income,
        total_taxable_income,
        effective_tax_rate,
      });
      totalTax += total_tax_income;
      totalTaxableIncome += total_taxable_income;
    });
    yearsSummaryObject.income_tax_analysis.overall_effective_tax_rate = (totalTax / totalTaxableIncome) * 100;

    //set tax and expenses as a percentage of income
    yearsSummaryObject.tax_and_expenses_as_a_percentage_of_income.tax_and_expenses_as_a_percentage_of_income =
      ((yearsSummaryObject.cash_flow_analysis.total_household_expenses * -1) /
        yearsSummaryObject.cash_flow_analysis.total_household_income) *
      100;

    let totalNetPosition = 0;
    ya.assets.properties.map((p, i) => {
      const name = p.name;
      const amount = p.amount;
      yearsSummaryObject.property_analysis.property_details.push({ name, amount });
      totalNetPosition += amount;
    });
    ya.creditors.mortgages.details.map((m, i) => {
      const name = m.name;
      const amount = m.amount;

      yearsSummaryObject.property_analysis.mortgage_details.push({ name, amount });
      totalNetPosition += amount;
    });
    yearsSummaryObject.property_analysis.net_position = totalNetPosition;

    yearsSummaryObject.property_analysis.property_details.map((p, i) => {
      const name = "LTV - " + p.name;
      let amount = ((yearsSummaryObject.property_analysis.mortgage_details[i].amount * -1) / p.amount) * 100;

      if (!amount) {
        amount = 0;
      }

      yearsSummaryObject.property_analysis.ltv_details.push({ name, amount });
    });

    yearsSummaryArray.push(yearsSummaryObject);
  });

  return yearsSummaryArray;
};

export default setForecastSummary;
