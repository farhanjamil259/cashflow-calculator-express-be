//import helper functions
import Inputs from "../models/Inputs";
import { add, sub, calcMortgage, calcTodaysValue, max, calcDeposit, calcSDLT } from "./inputsFormulae";
import GenerateMortgage from "../helpers/mortgageLoanGenerator";
import GenerateLoan from "../helpers/mortgageLoanGenerator";

//import interfaces
import IAssumptions from "../interfaces/IAssumptions";
import IInputs from "../interfaces/IInputs";
import { DateTime } from "luxon";

export const setInputValues = (inputs: IInputs, assumptions: IAssumptions, clientid: string) => {
  const newInputs: IInputs = {
    client_id: clientid,
    input_set_name: inputs.input_set_name,
    current_year: inputs.current_year,
    household_owners: inputs.household_owners,
    children: inputs.children,
    assets: inputs.assets,
    liabilities: inputs.liabilities,
    household_income: inputs.household_income,
    household_expenses: inputs.household_expenses,
    mortgages: [],
    loans: [],
  };

  //set owners values
  newInputs.household_owners.map((owner) => {
    owner.current_age = newInputs.current_year - owner.birth_year;
    owner.retirement_year = owner.birth_year + owner.retirement_age;
    owner.end_of_forecast_age = assumptions.inputs_assumptions.end_of_forecast_age;
    owner.end_of_forecast_year = owner.birth_year + owner.end_of_forecast_age + 1;
  });

  //set values for children
  //need to make ages dynamic, maybe add them in assumptions at a later date
  newInputs.children.map((child) => {
    child.primary_school_age = assumptions.inputs_assumptions.primary_school_age;
    child.primary_school_year = child.birth_year + child.primary_school_age;
    child.secondary_school_age = assumptions.inputs_assumptions.secondary_school_age;
    child.secondary_school_year = child.birth_year + child.secondary_school_age;
    child.university_age = assumptions.inputs_assumptions.university_age;
    child.university_year = child.birth_year + child.university_age;
    child.graduation_age = assumptions.inputs_assumptions.graduation_age;
    child.graduation_year = child.birth_year + child.graduation_age;
  });

  //set values for assets -> property
  newInputs.assets.properties.map((property) => {
    property.growth_rate = assumptions.market_data.property_price_inflation.rate;
    property.todays_value = calcTodaysValue(property, newInputs.current_year);
    property.deposit = calcDeposit(property.original_price, property.mortgage_rate, property.on_mortgage);
    property.sdlt = calcSDLT(assumptions, property.original_price);
  });

  //set values for assets -> Bank Accounts
  newInputs.assets.bank_accounts.growth_rate = assumptions.inputs_assumptions.bank_account_growth_rate;
  newInputs.assets.bank_accounts.start_year = newInputs.current_year;
  newInputs.assets.bank_accounts.end_year = max(newInputs.household_owners).end_of_forecast_year;

  //set values for assets -> savings and investments -> individual savings accounts
  newInputs.assets.savings_and_investments.individual_savings_account.map((sai, index) => {
    sai.name = `Individual Savings Account (ISA) - ${newInputs.household_owners[index].name}`;
    sai.growth_rate = assumptions.market_data.savings_and_investment_growth_rate.rate;
    sai.contribution_start_year = newInputs.current_year;
    sai.contribution_end_year = newInputs.household_owners[index].retirement_year;
  });

  //set values for assets -> savings and investments -> general investment accounts
  newInputs.assets.savings_and_investments.general_investment_account.map((sai, index) => {
    sai.name = `General Investment Account (GIA) - ${newInputs.household_owners[index].name}`;
    sai.growth_rate = assumptions.market_data.savings_and_investment_growth_rate.rate;
    sai.contribution_start_year = newInputs.current_year;
    sai.contribution_end_year = newInputs.household_owners[index].retirement_year;
  });

  //set values for assets -> defined contribution pension plans
  newInputs.assets.non_employment_defined_contribution_pension_plans.map((dcpp, index) => {
    dcpp.name = `Pension Plan - ${newInputs.household_owners[index].name}`;
    dcpp.growth_rate = assumptions.market_data.cash_and_money_market_yield.rate;
    dcpp.contribution_start_year = newInputs.current_year;
    dcpp.contribution_end_year = newInputs.household_owners[index].retirement_year;
  });

  //set values for mortgages
  newInputs.liabilities.mortgages.map((mortgage, index) => {
    mortgage.name = `Mortgage - ${newInputs.assets.properties[index].name}`;
    mortgage.original_balance =
      newInputs.assets.properties[index].original_price * newInputs.assets.properties[index].mortgage_rate;
    mortgage.start_year = newInputs.assets.properties[index].start_year;
    mortgage.start_year_for_model =
      mortgage.start_year < newInputs.current_year ? newInputs.current_year : mortgage.start_year;
    mortgage.end_year = mortgage.start_year + mortgage.mortgage_period;
    mortgage.annual_payment = calcMortgage(
      mortgage.original_balance,
      mortgage.interest_rate,
      mortgage.mortgage_period,
      mortgage.number_of_payments_per_year
    ).annual_payments;
  });

  //set values for other loans
  newInputs.liabilities.other_loans.map((loan) => {
    loan.start_year_for_model =
      loan.start_year < newInputs.current_year ? newInputs.current_year : loan.start_year;
    loan.end_year = loan.start_year + loan.loan_period;
    loan.annual_payment = calcMortgage(
      loan.original_balance,
      loan.interest_rate,
      loan.loan_period,
      loan.number_of_payments_per_year
    ).annual_payments;
  });

  newInputs.liabilities.credit_card.name = inputs.liabilities.credit_card.name;
  newInputs.liabilities.credit_card.original_balance = inputs.liabilities.credit_card.original_balance;

  //set values for employment income
  newInputs.household_income.employment_income.map((income, index) => {
    income.name = `Salary - ${newInputs.household_owners[index].name}`;
    income.inflation = assumptions.market_data.earning_growth_rate.rate;
    income.start_year = newInputs.current_year;
    income.end_year = newInputs.household_owners[index].retirement_year;
    income.member_contribution =
      assumptions.employement_minimum_pension_contributions.minimum_contributions.member;
    income.employer_contribution =
      assumptions.employement_minimum_pension_contributions.minimum_contributions.employer;
  });

  //set values for self-employment income
  newInputs.household_income.self_employment_income.map((income, index) => {
    income.name = `Self-Employment - ${newInputs.household_owners[index].name}`;
    income.inflation = assumptions.market_data.consumer_price_index.rate;
    income.start_year = newInputs.current_year;
    income.end_year = newInputs.household_owners[index].retirement_year;
  });

  //set values for rental income
  newInputs.household_income.rental_income.details.map((income, index) => {
    income.name = `Rental Income - ${newInputs.household_owners[index].name}`;
    income.annual_amount =
      newInputs.household_income.rental_income.joint_annual_rental_income * income.share_of_rental_income;
    income.inflation = assumptions.market_data.retain_price_index.rate;
    income.end_year = max(newInputs.household_owners).end_of_forecast_year;
  });

  //set values for dividend income
  newInputs.household_income.dividend_income.map((income, index) => {
    income.name = `Dividends - ${newInputs.household_owners[index].name}`;
    income.inflation = assumptions.market_data.consumer_price_index.rate;
  });

  //set values for ISA Drawdowns -> individual savings account
  newInputs.household_income.savings_and_investments_drawdowns.individual_savings_accounts.map(
    (drawdown, index) => {
      drawdown.owner_name = `Individual Savings Account (ISA) - ${newInputs.household_owners[index].name}`;
    }
  );

  //set values for ISA Drawdowns -> general investment account
  newInputs.household_income.savings_and_investments_drawdowns.general_investment_accounts.map(
    (drawdown, index) => {
      drawdown.owner_name = `General Invement Account (GIA) - ${newInputs.household_owners[index].name}`;
    }
  );

  //set pension income ->  pension income
  newInputs.household_income.pension_income.state_pension = [];
  newInputs.household_owners.map((owner) => {
    newInputs.household_income.pension_income.state_pension.push({
      name: owner.name,
      annual_amount: assumptions.inputs_assumptions.state_pension_annual_amount,
      inflation: assumptions.market_data.consumer_price_index.rate,
      state_pension_age: assumptions.inputs_assumptions.state_pension_age,
      start_year: owner.birth_year + assumptions.inputs_assumptions.state_pension_age + 1,
      end_year: owner.end_of_forecast_year,
    });
  });

  //set pension income ->  defined benefit pension plans
  newInputs.household_income.pension_income.defined_benifit_pension_plans.map((income, index) => {
    income.name = newInputs.household_owners[index].name;
    income.start_year = newInputs.household_owners[index].retirement_year + 1;
    income.end_year = newInputs.household_owners[index].end_of_forecast_year;
  });

  //set pension income -> defined contribution pension plans
  newInputs.household_income.pension_income.defined_contribution_pension_plans.map((income, index) => {
    income.name = newInputs.household_owners[index].name;
    income.annuity_option_initial_drawdown = 0.25;
    income.annuity_option_annual_annuity_rate = assumptions.market_data.annuity.rate;
    income.start_year = newInputs.household_owners[index].retirement_year + 1;
    income.end_year = newInputs.household_owners[index].end_of_forecast_year;
  });

  if (newInputs.household_income.other_income === null) {
    newInputs.household_income.other_income = {
      other_non_taxable_income: [],
      other_taxable_income: [],
    };
  } else {
    newInputs.household_income.other_income = inputs.household_income.other_income;
  }
  if (newInputs.household_income.other_income.other_non_taxable_income === null) {
    newInputs.household_income.other_income.other_non_taxable_income = [];
  } else {
    newInputs.household_income.other_income.other_non_taxable_income =
      inputs.household_income.other_income.other_non_taxable_income;
  }
  if (newInputs.household_income.other_income.other_taxable_income === null) {
    newInputs.household_income.other_income.other_taxable_income = [];
  } else {
    newInputs.household_income.other_income.other_taxable_income =
      inputs.household_income.other_income.other_taxable_income;
  }

  //set other income
  //other taxable income
  newInputs.household_income.other_income.other_taxable_income.map((income, index) => {
    income.name = newInputs.household_owners[index].name;
  });

  //other non-taxable income
  newInputs.household_income.other_income.other_non_taxable_income.map((income, index) => {
    income.name = newInputs.household_owners[index].name;
  });

  //set blanket inflation rate
  newInputs.household_expenses.blanket_inflation_rate = assumptions.market_data.consumer_price_index.rate;

  //set housing
  newInputs.household_expenses.housing.details.map((expense) => {
    const inflation = 0;
    const start_year = 0;
    const end_year = 0;

    if (expense.type === "property") {
      expense.inflation = assumptions.market_data.retain_price_index.rate;
    } else if (expense.type === "tax" || expense.type === "utility") {
      expense.inflation = assumptions.market_data.retain_price_index.rate;
      expense.start_year = newInputs.current_year;
      expense.end_year = max(newInputs.household_owners).end_of_forecast_year;
    } else if (expense.type === "digital") {
      expense.inflation = assumptions.market_data.consumer_price_index.rate;
      expense.start_year = newInputs.current_year;
      expense.end_year = max(newInputs.household_owners).end_of_forecast_year;
    } else {
      expense.inflation = 0;
      expense.start_year = newInputs.current_year;
      expense.end_year = max(newInputs.household_owners).end_of_forecast_year;
    }
    newInputs.household_expenses.housing.total += expense.annual_expense;
  });

  //set Consumables
  newInputs.household_expenses.consumables.details.map((expense) => {
    expense.inflation = newInputs.household_expenses.blanket_inflation_rate;
    expense.start_year = newInputs.current_year;
    expense.end_year = max(newInputs.household_owners).end_of_forecast_year;
    newInputs.household_expenses.consumables.total += expense.annual_expense;
  });

  //set Travel
  newInputs.household_expenses.travel.details.map((expense) => {
    expense.inflation = newInputs.household_expenses.blanket_inflation_rate;
    expense.start_year = newInputs.current_year;
    expense.end_year = max(newInputs.household_owners).end_of_forecast_year;
    newInputs.household_expenses.travel.total += expense.annual_expense;
  });

  //set Shopping
  newInputs.household_expenses.shopping.details.map((expense) => {
    expense.inflation = newInputs.household_expenses.blanket_inflation_rate;
    expense.start_year = newInputs.current_year;
    expense.end_year = max(newInputs.household_owners).end_of_forecast_year;
    newInputs.household_expenses.shopping.total += expense.annual_expense;
  });

  //set Entertainment
  newInputs.household_expenses.entertainment.details.map((expense) => {
    expense.inflation = newInputs.household_expenses.blanket_inflation_rate;
    expense.start_year = newInputs.current_year;
    expense.end_year = max(newInputs.household_owners).end_of_forecast_year;
    newInputs.household_expenses.entertainment.total += expense.annual_expense;
  });

  //set Holiday
  newInputs.household_expenses.holiday.details.map((expense) => {
    expense.inflation = newInputs.household_expenses.blanket_inflation_rate;
    expense.start_year = newInputs.current_year;
    expense.end_year = max(newInputs.household_owners).end_of_forecast_year;
    newInputs.household_expenses.holiday.total += expense.annual_expense;
  });

  // TODO
  // Alternate between owners

  //set Insurance Policies
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  Needs to be fixed (jank) --updated still jank cant take more that 2 owners

  newInputs.household_expenses.insurance_policies.life_insurance.map((p, i) => {
    p.name = "Life Insurance - " + newInputs.household_owners[i].name;
    p.inflation = newInputs.household_expenses.blanket_inflation_rate;
    p.start_year = newInputs.current_year;
    p.end_year = max(newInputs.household_owners).end_of_forecast_year;
  });

  newInputs.household_expenses.insurance_policies.critical_illness_cover.map((p, i) => {
    p.name = "Life Insurance - " + newInputs.household_owners[i].name;
    p.inflation = newInputs.household_expenses.blanket_inflation_rate;
    p.start_year = newInputs.current_year;
    p.end_year = max(newInputs.household_owners).end_of_forecast_year;
  });

  newInputs.household_expenses.insurance_policies.family_income_benefit.map((p, i) => {
    p.name = "Life Insurance - " + newInputs.household_owners[i].name;
    p.inflation = newInputs.household_expenses.blanket_inflation_rate;
    p.start_year = newInputs.current_year;
    p.end_year = max(newInputs.household_owners).end_of_forecast_year;
  });

  //set children expenses
  newInputs.household_expenses.children_education_expenses.primary_school_fees.inflation =
    assumptions.market_data.private_school_fee_inflation.rate;
  newInputs.household_expenses.children_education_expenses.seconday_school_fees.inflation =
    assumptions.market_data.private_school_fee_inflation.rate;
  newInputs.household_expenses.children_education_expenses.university_fees.inflation =
    assumptions.market_data.consumer_price_index.rate;

  //set mortgages
  newInputs.liabilities.mortgages.map((mortgage) => {
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

    newInputs.mortgages.push(newMortgageObject);
  });

  //set loans
  newInputs.liabilities.other_loans.map((loan) => {
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
      newInputs.loans.push(newLoanObject);
    }
  });

  return newInputs;
};
