import IInputs from "../interfaces/IInputs";
import IAssumptions from "../interfaces/IAssumptions";
import IForecast from "../interfaces/IForecast";

export function setInitialForecastYear(inputs: IInputs, assumptions: IAssumptions) {
  const i = inputs.current_year;

  //initial forecast object
  const yearObject: IForecast = {
    year: 0,
    ages: {
      owner_ages: [],
      children_ages: [],
    },
    assets: {
      properties: [],
      bank_account: {
        name: "",
        amount: 0,
      },
      savings_and_investments: {
        details: [],
        total: 0,
      },
      personal_pension_plans: {
        details: [],
        total: 0,
      },
    },
    creditors: {
      mortgages: {
        details: [],
        total: 0,
      },
      other_loans: {
        details: [],
        total: 0,
      },
      credit_cards: {
        name: "",
        beginning_of_period: 0,
        change_in_year: 0,
        end_of_period: 0,
      },
      credit_card_requirement_analysis: {
        balance_at_start_of_year: 0,
        minimum_balance_acceptable: 0,
        excess_cash_at_start_of_year: 0,
        total_cash_inflow_outflow: 0,
        cash_available: 0,
      },
    },
    household_income: {
      employment_income: {
        details: [],
        total: 0,
      },
      employer_pension_contribution: {
        details: [],
      },
      self_employment_income: {
        details: [],
        total: 0,
      },
      rental_income: {
        details: [],
        total: 0,
      },
      dividend_income: {
        details: [],
        total: 0,
      },
      savings_and_investments_income: {
        details: [],
        total: 0,
      },
      pension_income: {
        state_pension_income: {
          details: [],
          total: 0,
        },
        defined_benefit_pension_income: {
          details: [],
          total: 0,
        },
        defined_contribution_pension_income: {
          details: [],
          total: 0,
        },
        total: 0,
      },
      residential_property_sale_proceeds: {
        details: [],
        total: 0,
      },
      other_income: {
        other_taxable_income: {
          details: [],
          total: 0,
        },
        other_non_taxable_income: {
          details: [],
          total: 0,
        },
        total: 0,
      },
      total: 0,
    },
    household_expenses: {
      housing: {
        details: [],
        total: 0,
      },
      consumables: {
        details: [],
        total: 0,
      },
      travel: {
        details: [],
        total: 0,
      },
      shopping: {
        details: [],
        total: 0,
      },
      entertainment: {
        details: [],
        total: 0,
      },
      holiday: {
        details: [],
        total: 0,
      },
      one_off_expenses: {
        details: [],
        total: 0,
      },
      children_education_expenses: {
        details: [],
        total: 0,
      },
      financials: {
        other_loans: {
          details: [],
          total: 0,
        },
        savings_and_investments: {
          details: [],
          total: 0,
        },
        pension_pot: {
          details: [],
          total: 0,
        },
        interest_expenses: {
          details: {
            name: "",
            amount: 0,
          },
          total: 0,
        },
        insurance_policies: {
          details: [],
          total: 0,
        },
        total: 0,
      },
      additional_tax_charge: {
        details: [],
        sdlt_charge: {
          details: [],
          total: 0,
        },
        total_additional_tax_charge: 0,
      },
      total_household_expenses: 0,
    },
    annual_cash_inflow_outflow: 0,
  };

  yearObject.year = i;

  //set initial values------------------------------------------------------
  //set owners' ages
  inputs.household_owners.map((owner) => {
    const name = owner.name;
    const age = owner.current_age;
    yearObject.ages.owner_ages.push({ name, age });
  });

  //set children ages
  inputs.children.map((child) => {
    const name = child.name;
    let age = 0;
    if (age > 0) {
      age = inputs.current_year - child.birth_year;
    } else {
      age = 0;
    }
    yearObject.ages.children_ages.push({ name, age: age });
  });

  //set assets -> properties
  inputs.assets.properties.map((property, index) => {
    const name = property.name;
    let amount = 0;

    if (i >= property.start_year && i <= property.end_year) {
      amount =
        property.original_price / (1 + property.growth_rate) ** (inputs.current_year - property.start_year);
    }

    yearObject.assets.properties.push({ name, amount });
  });

  //set HOUSEHOLD INCOME---------------------------------------------------------
  //set houshold income -> employment income
  inputs.household_owners.map((owner, index) => {
    const { employment_income } = inputs.household_income;
    const name = "Salary - " + owner.name;
    const gross_salary =
      employment_income[index].gross_anual_amount *
      (1 + employment_income[index].inflation) ** (yearObject.year - yearObject.year);

    const members_pension_contribution =
      Math.abs(
        gross_salary * assumptions.employement_minimum_pension_contributions.minimum_contributions.member
      ) * -1;

    const total_gross_salary_after_less = gross_salary + members_pension_contribution;
    let income_tax_charge = 0;
    let limit_on_personal_allowance = 0;
    let nic_class_1_charge = 0;
    let net_salary = 0;
    let effective_tax_rate = 0;

    //calculate income tax charge
    if (total_gross_salary_after_less < assumptions.income_tax_rate_thresholds.basic_rate.threshold) {
      income_tax_charge = 0;
    } else {
      if (total_gross_salary_after_less < assumptions.income_tax_rate_thresholds.higher_rate.threshold) {
        income_tax_charge =
          (total_gross_salary_after_less - assumptions.income_tax_rate_thresholds.basic_rate.threshold) *
          assumptions.income_tax_rate_thresholds.basic_rate.rate;
      } else {
        if (
          total_gross_salary_after_less < assumptions.income_tax_rate_thresholds.additional_rate.threshold
        ) {
          income_tax_charge =
            (assumptions.income_tax_rate_thresholds.higher_rate.threshold -
              assumptions.income_tax_rate_thresholds.basic_rate.threshold) *
              assumptions.income_tax_rate_thresholds.basic_rate.rate +
            (total_gross_salary_after_less - assumptions.income_tax_rate_thresholds.higher_rate.threshold) *
              assumptions.income_tax_rate_thresholds.higher_rate.rate;
        } else {
          income_tax_charge =
            (assumptions.income_tax_rate_thresholds.higher_rate.threshold -
              assumptions.income_tax_rate_thresholds.basic_rate.threshold) *
              assumptions.income_tax_rate_thresholds.basic_rate.rate +
            (assumptions.income_tax_rate_thresholds.additional_rate.threshold -
              assumptions.income_tax_rate_thresholds.higher_rate.threshold) *
              assumptions.income_tax_rate_thresholds.higher_rate.rate +
            (total_gross_salary_after_less -
              assumptions.income_tax_rate_thresholds.additional_rate.threshold) *
              assumptions.income_tax_rate_thresholds.additional_rate.rate;
        }
      }
    }
    income_tax_charge = Math.abs(income_tax_charge) * -1;

    //calculate limit on personal allowance
    if (
      total_gross_salary_after_less > assumptions.income_limits.income_limit_for_personal_allowance.threshold
    ) {
      if (
        total_gross_salary_after_less -
          assumptions.income_limits.income_limit_for_personal_allowance.threshold >
        assumptions.income_tax_rate_thresholds.basic_rate.threshold /
          assumptions.income_limits.income_limit_for_personal_allowance.rate
      ) {
        limit_on_personal_allowance =
          (assumptions.income_tax_rate_thresholds.basic_rate.threshold /
            assumptions.income_limits.income_limit_for_personal_allowance.rate) *
          assumptions.income_tax_rate_thresholds.basic_rate.rate;
      } else {
        limit_on_personal_allowance =
          ((total_gross_salary_after_less -
            assumptions.income_limits.income_limit_for_personal_allowance.threshold) /
            assumptions.income_limits.income_limit_for_personal_allowance.rate) *
          assumptions.income_tax_rate_thresholds.basic_rate.rate;
      }
    }

    limit_on_personal_allowance = Math.abs(limit_on_personal_allowance) * -1;

    //set nic class 1 charge

    if (total_gross_salary_after_less < assumptions.employment_nic_thresholds.primary_threshold.threshold) {
      nic_class_1_charge = 0;
    } else if (
      total_gross_salary_after_less < assumptions.employment_nic_thresholds.upper_earnings_limit.threshold
    ) {
      nic_class_1_charge =
        -(total_gross_salary_after_less - assumptions.employment_nic_thresholds.primary_threshold.threshold) *
        assumptions.employment_nic_thresholds.primary_threshold.rate;
    } else {
      nic_class_1_charge =
        -(
          assumptions.employment_nic_thresholds.upper_earnings_limit.threshold -
          assumptions.employment_nic_thresholds.primary_threshold.threshold
        ) *
          assumptions.employment_nic_thresholds.primary_threshold.rate -
        (total_gross_salary_after_less -
          assumptions.employment_nic_thresholds.upper_earnings_limit.threshold) *
          assumptions.employment_nic_thresholds.upper_earnings_limit.rate;
    }

    //set net salary
    net_salary =
      total_gross_salary_after_less + income_tax_charge + limit_on_personal_allowance + nic_class_1_charge;

    //set effective tax rate
    effective_tax_rate =
      ((income_tax_charge + limit_on_personal_allowance + nic_class_1_charge) * -1) / gross_salary;

    yearObject.household_income.employment_income.details.push({
      name,
      gross_salary,
      members_pension_contribution,
      total_gross_salary_after_less,
      income_tax_charge,
      limit_on_personal_allowance,
      nic_class_1_charge,
      net_salary,
      effective_tax_rate,
    });
    //set employment income total
    yearObject.household_income.employment_income.total += net_salary;
  });

  //set household income -> employer pension contribution
  inputs.household_owners.map((o, index) => {
    const name = o.name;
    const amount =
      yearObject.household_income.employment_income.details[index].gross_salary *
      assumptions.employement_minimum_pension_contributions.minimum_contributions.employer;

    yearObject.household_income.employer_pension_contribution.details.push({ name, amount });
  });

  //set houshold income -> self employment income
  inputs.household_income.self_employment_income.map((income) => {
    const name = income.name;
    let amount = 0;
    if (i >= income.start_year && i <= income.end_year) {
      amount = income.gross_anual_amount * (1 + income.inflation) ** (i - yearObject.year);
    } else {
      amount = 0;
    }
    yearObject.household_income.self_employment_income.details.push({
      name,
      amount,
    });
    yearObject.household_income.self_employment_income.total += amount;
  });

  //set houshold income -> rental income
  inputs.household_income.rental_income.details.map((income) => {
    const name = income.name;
    let amount = 0;
    if (i >= income.start_year && i <= income.end_year) {
      amount = income.share_of_rental_income * (1 + income.inflation) ** (i - yearObject.year);
    } else {
      amount = 0;
    }
    yearObject.household_income.rental_income.details.push({
      name,
      amount,
    });
    yearObject.household_income.rental_income.total += amount;
  });

  //set houshold income -> dividend income
  inputs.household_income.dividend_income.map((income) => {
    const name = income.name;
    let amount = 0;
    if (i >= income.start_year && i <= income.end_year) {
      amount = income.anual_amount * (1 + income.inflation) ** (i - yearObject.year);
    } else {
      amount = 0;
    }
    yearObject.household_income.dividend_income.details.push({
      name,
      amount,
    });
    yearObject.household_income.dividend_income.total += amount;
  });
  //set houshold income -> savings and investments income
  inputs.household_income.savings_and_investments_drawdowns.individual_savings_accounts.map((drawdown) => {
    const name = "Individual Savings Account (ISA) - " + drawdown.owner_name;
    let amount = 0;
    drawdown.drawdowns.map((draw) => {
      if (i >= draw.start_year && i <= draw.end_year) {
        amount += draw.amount_to_drawn_down;
      }
    });
    yearObject.household_income.savings_and_investments_income.details.push({
      name,
      amount,
    });
    yearObject.household_income.savings_and_investments_income.total += amount;
  });

  //set houshold income -> general investment account income
  inputs.household_income.savings_and_investments_drawdowns.general_investment_accounts.map((drawdown) => {
    const name = "General Investment Account (GIA) - " + drawdown.owner_name;
    let amount = 0;
    drawdown.drawdowns.map((draw) => {
      if (i >= draw.start_year && i <= draw.end_year) {
        amount += draw.amount_to_drawn_down;
      }
    });
    yearObject.household_income.savings_and_investments_income.details.push({
      name,
      amount,
    });
    yearObject.household_income.savings_and_investments_income.total += amount;
  });

  //set houshold income -> pension income
  //
  inputs.household_income.pension_income.state_pension.map((income, index) => {
    const name = inputs.household_owners[index].name;
    const age = inputs.household_owners[index].current_age;
    let amount = 0;

    if (age > 0) {
      if (i >= income.start_year && i <= income.end_year) {
        amount = income.annual_amount * (1 + income.inflation) ** (i - yearObject.year);
      } else {
        amount = 0;
      }
    } else {
      amount = 0;
    }
    yearObject.household_income.pension_income.state_pension_income.details.push({
      name,
      amount,
    });
    yearObject.household_income.pension_income.state_pension_income.total += amount;
  });
  //
  inputs.household_income.pension_income.defined_benifit_pension_plans.map((income, index) => {
    const name = inputs.household_owners[index].name;

    const type = income.option_taken;

    let lump_sum = 0;
    let annual = 0;
    let total = 0;

    if (type === "Annual") {
      lump_sum = 0;
      if (i >= income.start_year && i <= income.end_year) {
        annual = income.estimated_annual_pension * (1 + income.annual_increase) ** (i - income.start_year);
      } else {
        annual = 0;
      }
    } else if (type === "Lump Sum") {
      annual = 0;
      if (i === income.start_year) {
        lump_sum = income.estimated_lump_sum;
      } else {
        lump_sum = 0;
      }
    } else {
      lump_sum = 0;
      annual = 0;
    }

    total = lump_sum + annual;

    yearObject.household_income.pension_income.defined_benefit_pension_income.details.push({
      name,
      lump_sum,
      annual,
      total,
    });
    yearObject.household_income.pension_income.defined_benefit_pension_income.total += total;
  });
  //
  inputs.household_income.pension_income.defined_contribution_pension_plans.map((income, index) => {
    const name = inputs.household_owners[index].name;
    let type = income.option_taken;
    let annuity_option_initial_drawdown = 0;
    const amount = 0;

    if (type === "Annuity") {
      if (i === income.start_year - 1) {
        annuity_option_initial_drawdown =
          yearObject.assets.personal_pension_plans.details[index].amount *
          income.annuity_option_initial_drawdown;
      } else {
        annuity_option_initial_drawdown = 0;
      }
    } else {
      annuity_option_initial_drawdown = 0;
    }
    yearObject.household_income.pension_income.defined_contribution_pension_income.details.push({
      name,
      option_taken: type,
      lump_sum_drawdown_option: 0,
      regular_drawdown_option: 0,
      annuity_option_initial_drawdown,
      annuity_option_annuity_income: 0,
      total: 0,
    });
    yearObject.household_income.pension_income.defined_contribution_pension_income.total += amount;
  });
  //
  yearObject.household_income.pension_income.total =
    yearObject.household_income.pension_income.state_pension_income.total +
    yearObject.household_income.pension_income.defined_benefit_pension_income.total +
    yearObject.household_income.pension_income.defined_contribution_pension_income.total;

  //set household income -> residential property sale proceeds
  inputs.household_owners.map((o, i) => {
    const name = o.name;
    let amount = 0;

    yearObject.household_income.residential_property_sale_proceeds.details.push({ name, amount });
    yearObject.household_income.residential_property_sale_proceeds.total += amount;
  });

  //set household income -> other income
  //other taxable income
  inputs.household_income.other_income.other_taxable_income.map((income, index) => {
    const name = inputs.household_owners[index].name;
    let amount = 0;

    if (i >= income.start_year && i <= income.end_year) {
      amount = income.gross_annual_amount * (1 + income.inflation) ** (i - yearObject.year);
    } else {
      amount = 0;
    }
    yearObject.household_income.other_income.other_taxable_income.details.push({
      name,
      amount,
    });
    yearObject.household_income.other_income.other_taxable_income.total += amount;
  });
  //other non taxable income
  inputs.household_income.other_income.other_non_taxable_income.map((income, index) => {
    const name = inputs.household_owners[index].name;
    let amount = 0;

    if (i >= income.start_year && i <= income.end_year) {
      amount = income.gross_annual_amount * (1 + income.inflation) ** (i - yearObject.year);
    } else {
      amount = 0;
    }
    yearObject.household_income.other_income.other_non_taxable_income.details.push({
      name,
      amount,
    });
    yearObject.household_income.other_income.other_non_taxable_income.total += amount;
  });
  yearObject.household_income.other_income.total =
    yearObject.household_income.other_income.other_non_taxable_income.total +
    yearObject.household_income.other_income.other_taxable_income.total;

  //set household income -> total household income
  yearObject.household_income.total =
    yearObject.household_income.employment_income.total +
    yearObject.household_income.self_employment_income.total +
    yearObject.household_income.rental_income.total +
    yearObject.household_income.dividend_income.total +
    yearObject.household_income.savings_and_investments_income.total +
    yearObject.household_income.pension_income.total +
    yearObject.household_income.other_income.total;

  //set HOUSEHOLD EXPENSES------------------------------------------------------------------------------
  //set household expenses -> housing
  inputs.liabilities.mortgages.map((mortgage) => {
    const name = mortgage.name;
    let amount = 0;
    if (i >= mortgage.start_year_for_model && i <= mortgage.end_year) {
      amount = -mortgage.annual_payment;
    } else {
      amount = 0;
    }
    yearObject.household_expenses.housing.details.push({ name, amount });
    yearObject.household_expenses.housing.total += amount;
  });
  inputs.household_expenses.housing.details.map((expense) => {
    const name = expense.name;
    let amount = 0;

    const maxRetirementYear = inputs.household_owners.reduce((prev, current) => {
      return prev.retirement_year > current.retirement_year ? prev : current;
    });
    if (i >= expense.start_year && i <= expense.end_year) {
      if (i > maxRetirementYear.retirement_year) {
        amount = -(
          expense.annual_expense *
          (1 + expense.inflation) ** (i - yearObject.year) *
          expense.rate_after_retirement
        );
      } else {
        amount = -(expense.annual_expense * (1 + expense.inflation) ** (i - yearObject.year));
      }
    } else {
      amount = 0;
    }

    yearObject.household_expenses.housing.details.push({ name, amount });
    yearObject.household_expenses.housing.total += amount;
  });

  //set household expenses -> consumables
  inputs.household_expenses.consumables.details.map((expense) => {
    const name = expense.name;
    let amount = 0;

    const maxRetirementYear = inputs.household_owners.reduce((prev, current) => {
      return prev.retirement_year > current.retirement_year ? prev : current;
    });

    if (i >= expense.start_year && i <= expense.end_year) {
      if (i > maxRetirementYear.retirement_year) {
        amount = -(
          expense.annual_expense *
          (1 + expense.inflation) ** (i - yearObject.year) *
          expense.rate_after_retirement
        );
      } else {
        amount = -(expense.annual_expense * (1 + expense.inflation) ** (i - yearObject.year));
      }
    } else {
      amount = 0;
    }

    yearObject.household_expenses.consumables.details.push({ name, amount });
    yearObject.household_expenses.consumables.total += amount;
  });

  //set household expenses -> travel
  inputs.household_expenses.travel.details.map((expense) => {
    const name = expense.name;
    let amount = 0;

    const maxRetirementYear = inputs.household_owners.reduce((prev, current) => {
      return prev.retirement_year > current.retirement_year ? prev : current;
    });

    if (i >= expense.start_year && i <= expense.end_year) {
      if (i > maxRetirementYear.retirement_year) {
        amount = -(
          expense.annual_expense *
          (1 + expense.inflation) ** (i - yearObject.year) *
          expense.rate_after_retirement
        );
      } else {
        amount = -(expense.annual_expense * (1 + expense.inflation) ** (i - yearObject.year));
      }
    } else {
      amount = 0;
    }

    yearObject.household_expenses.travel.details.push({ name, amount });
    yearObject.household_expenses.travel.total += amount;
  });

  //set household expenses -> shopping
  inputs.household_expenses.shopping.details.map((expense) => {
    const name = expense.name;
    let amount = 0;

    const maxRetirementYear = inputs.household_owners.reduce((prev, current) => {
      return prev.retirement_year > current.retirement_year ? prev : current;
    });

    if (i >= expense.start_year && i <= expense.end_year) {
      if (i > maxRetirementYear.retirement_year) {
        amount = -(
          expense.annual_expense *
          (1 + expense.inflation) ** (i - yearObject.year) *
          expense.rate_after_retirement
        );
      } else {
        amount = -(expense.annual_expense * (1 + expense.inflation) ** (i - yearObject.year));
      }
    } else {
      amount = 0;
    }

    yearObject.household_expenses.shopping.details.push({ name, amount });
    yearObject.household_expenses.shopping.total += amount;
  });

  //set household expenses -> entertainment
  inputs.household_expenses.entertainment.details.map((expense) => {
    const name = expense.name;
    let amount = 0;

    const maxRetirementYear = inputs.household_owners.reduce((prev, current) => {
      return prev.retirement_year > current.retirement_year ? prev : current;
    });

    if (i >= expense.start_year && i <= expense.end_year) {
      if (i > maxRetirementYear.retirement_year) {
        amount = -(
          expense.annual_expense *
          (1 + expense.inflation) ** (i - yearObject.year) *
          expense.rate_after_retirement
        );
      } else {
        amount = -(expense.annual_expense * (1 + expense.inflation) ** (i - yearObject.year));
      }
    } else {
      amount = 0;
    }

    yearObject.household_expenses.entertainment.details.push({ name, amount });
    yearObject.household_expenses.entertainment.total += amount;
  });

  //set household expenses -> holiday
  inputs.household_expenses.holiday.details.map((expense) => {
    const name = expense.name;
    let amount = 0;

    const maxRetirementYear = inputs.household_owners.reduce((prev, current) => {
      return prev.retirement_year > current.retirement_year ? prev : current;
    });

    if (i >= expense.start_year && i <= expense.end_year) {
      if (i > maxRetirementYear.retirement_year) {
        amount = -(
          expense.annual_expense *
          (1 + expense.inflation) ** (i - yearObject.year) *
          expense.rate_after_retirement
        );
      } else {
        amount = -(expense.annual_expense * (1 + expense.inflation) ** (i - yearObject.year));
      }
    } else {
      amount = 0;
    }

    yearObject.household_expenses.holiday.details.push({ name, amount });
    yearObject.household_expenses.holiday.total += amount;
  });

  //set household expenses -> one-off expenses
  //
  inputs.assets.properties.map((property) => {
    const name = "Deposit - " + property.name;
    let amount = 0;

    if (i === property.start_year) {
      amount = property.deposit;
    } else {
      amount = 0;
    }

    yearObject.household_expenses.one_off_expenses.details.push({ name, amount });
    yearObject.household_expenses.one_off_expenses.total += amount;
  });
  //
  inputs.household_expenses.one_off_expenses.map((expense) => {
    const name = expense.name;
    let amount = 0;

    if (i >= expense.start_year && i <= expense.end_year) {
      amount = -(
        expense.annual_payment_in_todays_terms *
        (1 + expense.inflation) ** (i - yearObject.year + 1)
      );
    } else {
      amount = 0;
    }

    yearObject.household_expenses.one_off_expenses.details.push({ name, amount });
    yearObject.household_expenses.one_off_expenses.total += amount;
  });

  //set household expenses -> children education expenses
  inputs.children.map((child) => {
    const name = child.name;
    let primary_school_fees = 0;
    let secondary_school_fees = 0;
    let university_fees = 0;

    //calculate primary school fees
    if (i >= child.primary_school_year && i <= child.secondary_school_year) {
      primary_school_fees = -(
        inputs.household_expenses.children_education_expenses.primary_school_fees.annual_fee_in_todays_terms *
        inputs.household_expenses.children_education_expenses.primary_school_fees.inflation **
          (i - yearObject.year)
      );
    } else {
      primary_school_fees = 0;
    }

    //calculate secondary school fees
    if (i >= child.secondary_school_year && i <= child.university_year) {
      secondary_school_fees = -(
        inputs.household_expenses.children_education_expenses.seconday_school_fees
          .annual_fee_in_todays_terms *
        inputs.household_expenses.children_education_expenses.seconday_school_fees.inflation **
          (i - yearObject.year)
      );
    } else {
      secondary_school_fees = 0;
    }
    //calculate university fees
    if (i >= child.university_year && i <= child.graduation_year) {
      university_fees = -(
        inputs.household_expenses.children_education_expenses.university_fees.annual_fee_in_todays_terms *
        inputs.household_expenses.children_education_expenses.university_fees.inflation **
          (i - yearObject.year)
      );
    } else {
      university_fees = 0;
    }

    const total = primary_school_fees + secondary_school_fees + university_fees;
    yearObject.household_expenses.children_education_expenses.details.push({
      name,
      primary_school_fees,
      secondary_school_fees,
      university_fees,
      total,
    });
  });

  //set household expenses -> financials
  //other loans
  inputs.liabilities.other_loans.map((loan) => {
    const name = loan.name;
    let amount = 0;

    if (i >= loan.start_year_for_model && i <= loan.end_year) {
      amount = -loan.annual_payment;
    } else {
      amount = 0;
    }
    yearObject.household_expenses.financials.other_loans.details.push({ name, amount });
    yearObject.household_expenses.financials.other_loans.total += amount;
  });
  // savings and investments -> individual savings account
  inputs.assets.savings_and_investments.individual_savings_account.map((sai) => {
    const name = sai.name;
    let amount = 0;

    let tempAmount1 =
      assumptions.isaa.annual_contribution_allowance.allowance *
      (1 + assumptions.isaa.annual_contribution_allowance.rate) ** (i - yearObject.year);

    let tempAmount2 = 0;

    if (i >= sai.contribution_start_year && i <= sai.contribution_end_year) {
      tempAmount2 = sai.annual_contribution;
    } else {
      tempAmount2 = 0;
    }

    amount = Math.min(tempAmount1, tempAmount2);
    amount *= -1;

    yearObject.household_expenses.financials.savings_and_investments.details.push({
      name,
      amount,
    });
    yearObject.household_expenses.financials.savings_and_investments.total += amount;
  });

  // savings and investments -> general investment account
  inputs.assets.savings_and_investments.general_investment_account.map((sai) => {
    const name = sai.name;
    let amount = 0;

    if (sai.annual_contribution === 0) {
      amount = 0;
    } else {
      if (i >= sai.contribution_start_year && i <= sai.contribution_end_year) {
        amount = sai.annual_contribution;
      }
    }

    amount *= -1;

    yearObject.household_expenses.financials.savings_and_investments.details.push({
      name,
      amount,
    });
    yearObject.household_expenses.financials.savings_and_investments.total += amount;
  });

  //pension pot
  inputs.assets.non_employment_defined_contribution_pension_plans.map((dcpp, index) => {
    const name = dcpp.name;
    let amount = 0;

    let tempAmount1 = 0;
    let tempAmount2 = 0;
    if (dcpp.annual_contribution === 0) {
      amount = 0;
    } else {
      if (i >= dcpp.contribution_start_year && i <= dcpp.contribution_end_year) {
        tempAmount1 = dcpp.annual_contribution;
      }
      tempAmount2 =
        (assumptions.pension_contribution_allowance.contribution_annual_allowance.allowance +
          yearObject.household_income.employment_income.details[index].members_pension_contribution -
          yearObject.household_income.employer_pension_contribution.details[index].amount) *
        (1 - assumptions.income_tax_rate_thresholds.basic_rate.rate);
    }

    amount = Math.min(tempAmount1, tempAmount2);

    amount *= -1;

    yearObject.household_expenses.financials.pension_pot.details.push({ name, amount });
    yearObject.household_expenses.financials.pension_pot.total += amount;
  });

  //interest expenses
  yearObject.household_expenses.financials.interest_expenses.details.name =
    inputs.liabilities.credit_card.name;

  yearObject.household_expenses.financials.interest_expenses.details.amount =
    yearObject.creditors.credit_cards.end_of_period * inputs.liabilities.credit_card.interest_rate;
  yearObject.household_expenses.financials.interest_expenses.total =
    yearObject.creditors.credit_cards.end_of_period * inputs.liabilities.credit_card.interest_rate;

  //set insurance policies
  inputs.household_expenses.insurance_policies.map((policy) => {
    const name = policy.name;
    let amount = 0;

    const maxRetirementYear = inputs.household_owners.reduce((prev, current) => {
      return prev.retirement_year > current.retirement_year ? prev : current;
    });

    if (i >= policy.start_year && i <= policy.end_year) {
      if (i > maxRetirementYear.retirement_year) {
        amount = -(
          policy.annual_expense *
          (1 + policy.inflation) ** (i - yearObject.year) *
          policy.rate_after_retirement
        );
      } else {
        amount = -(policy.annual_expense * (1 + policy.inflation) ** (i - yearObject.year));
      }
    } else {
      amount = 0;
    }

    yearObject.household_expenses.financials.insurance_policies.details.push({
      name,
      amount,
    });
    yearObject.household_expenses.financials.insurance_policies.total += amount;
  });

  //total financial expenses
  yearObject.household_expenses.financials.total =
    yearObject.household_expenses.financials.other_loans.total +
    yearObject.household_expenses.financials.savings_and_investments.total +
    yearObject.household_expenses.financials.pension_pot.total +
    yearObject.household_expenses.financials.interest_expenses.total +
    yearObject.household_expenses.financials.insurance_policies.total;

  //calc assets -> savings and investments
  inputs.assets.savings_and_investments.individual_savings_account.map((sai, index) => {
    const name = sai.name;
    const amount =
      sai.original_balance * (1 + sai.growth_rate) -
      yearObject.household_expenses.financials.savings_and_investments.details[index].amount -
      yearObject.household_income.savings_and_investments_income.details[index].amount;

    yearObject.assets.savings_and_investments.details.push({ name, amount });
    yearObject.assets.savings_and_investments.total += amount;
  });

  inputs.assets.savings_and_investments.general_investment_account.map((sai, index) => {
    const name = sai.name;
    const amount = Math.abs(
      sai.original_balance * (1 + sai.growth_rate) -
        yearObject.household_expenses.financials.savings_and_investments.details[
          index + inputs.household_owners.length
        ].amount -
        yearObject.household_income.savings_and_investments_income.details[
          index + inputs.household_owners.length
        ].amount
    );

    yearObject.assets.savings_and_investments.details.push({ name, amount });
    yearObject.assets.savings_and_investments.total += amount;
  });

  //set additional tax charge
  inputs.household_owners.map((owner, index) => {
    const name = owner.name;

    const gross_salary = yearObject.household_income.employment_income.details[index].gross_salary;

    const member_pension_contribution =
      yearObject.household_income.employment_income.details[index].members_pension_contribution;

    const total_gross_salary_after_less =
      yearObject.household_income.employment_income.details[index].total_gross_salary_after_less;

    const self_employment_income = yearObject.household_income.self_employment_income.details[index].amount;

    const rental_income = yearObject.household_income.rental_income.details[index].amount;

    const taxable_pension_income =
      yearObject.household_income.pension_income.defined_benefit_pension_income.details[index].lump_sum *
        0.75 +
      yearObject.household_income.pension_income.defined_benefit_pension_income.details[index].annual +
      yearObject.household_income.pension_income.defined_contribution_pension_income.details[index]
        .lump_sum_drawdown_option *
        0.75 +
      yearObject.household_income.pension_income.defined_contribution_pension_income.details[index]
        .regular_drawdown_option *
        0.75 +
      yearObject.household_income.pension_income.defined_contribution_pension_income.details[index]
        .annuity_option_initial_drawdown *
        0.75 +
      yearObject.household_income.pension_income.defined_contribution_pension_income.details[index]
        .annuity_option_annuity_income;

    const other_taxable_income =
      yearObject.household_income.other_income.other_taxable_income.details.length > 0
        ? yearObject.household_income.other_income.other_taxable_income.details[index].amount
        : 0;

    const pension_plan =
      yearObject.household_expenses.financials.pension_pot.details[index].amount /
      (1 - assumptions.income_tax_rate_thresholds.basic_rate.rate);

    const prior_year_excess_pension_contribution = 0;

    const total_taxable_income_excluding_dividends =
      total_gross_salary_after_less +
      self_employment_income +
      rental_income +
      taxable_pension_income +
      other_taxable_income +
      pension_plan;

    const dividend_income = yearObject.household_income.dividend_income.details[index].amount;

    const total_taxable_income = total_taxable_income_excluding_dividends + dividend_income;

    let income_tax_charge_on_non_dividend_income = 0;

    if (
      total_taxable_income_excluding_dividends < assumptions.income_tax_rate_thresholds.basic_rate.threshold
    ) {
      income_tax_charge_on_non_dividend_income = 0;
    } else if (
      total_taxable_income_excluding_dividends < assumptions.income_tax_rate_thresholds.higher_rate.threshold
    ) {
      income_tax_charge_on_non_dividend_income = -(
        (total_taxable_income_excluding_dividends -
          assumptions.income_tax_rate_thresholds.basic_rate.threshold) *
        assumptions.income_tax_rate_thresholds.basic_rate.rate
      );
    } else if (
      total_taxable_income_excluding_dividends <
      assumptions.income_tax_rate_thresholds.additional_rate.threshold
    ) {
      income_tax_charge_on_non_dividend_income = -(
        (assumptions.income_tax_rate_thresholds.higher_rate.threshold -
          assumptions.income_tax_rate_thresholds.basic_rate.threshold) *
          assumptions.income_tax_rate_thresholds.basic_rate.rate +
        (total_taxable_income_excluding_dividends -
          assumptions.income_tax_rate_thresholds.higher_rate.threshold) *
          assumptions.income_tax_rate_thresholds.higher_rate.rate
      );
    } else {
      income_tax_charge_on_non_dividend_income = -(
        (assumptions.income_tax_rate_thresholds.higher_rate.threshold -
          assumptions.income_tax_rate_thresholds.basic_rate.threshold) *
          assumptions.income_tax_rate_thresholds.basic_rate.rate +
        (assumptions.income_tax_rate_thresholds.additional_rate.threshold -
          assumptions.income_tax_rate_thresholds.higher_rate.threshold) *
          assumptions.income_tax_rate_thresholds.higher_rate.rate +
        (total_taxable_income_excluding_dividends -
          assumptions.income_tax_rate_thresholds.additional_rate.threshold) *
          assumptions.income_tax_rate_thresholds.additional_rate.rate
      );
    }

    let income_tax_charge_on_dividend_income = 0;

    if (dividend_income < assumptions.dividend_tax_rate_thresholds.basic_rate.threshold) {
      income_tax_charge_on_dividend_income = 0;
    } else if (total_taxable_income < assumptions.income_tax_rate_thresholds.basic_rate.threshold) {
      income_tax_charge_on_dividend_income = 0;
    } else if (total_taxable_income < assumptions.dividend_tax_rate_thresholds.higher_rate.threshold) {
      if (
        dividend_income <
        total_taxable_income - assumptions.income_tax_rate_thresholds.basic_rate.threshold
      ) {
        income_tax_charge_on_dividend_income =
          (dividend_income - assumptions.dividend_tax_rate_thresholds.basic_rate.threshold) *
          assumptions.dividend_tax_rate_thresholds.basic_rate.rate;
      } else {
        income_tax_charge_on_dividend_income =
          (total_taxable_income -
            assumptions.income_tax_rate_thresholds.basic_rate.threshold -
            assumptions.dividend_tax_rate_thresholds.basic_rate.threshold) *
          assumptions.dividend_tax_rate_thresholds.basic_rate.rate;
      }
    } else if (total_taxable_income < assumptions.dividend_tax_rate_thresholds.additional_rate.threshold) {
      if (
        dividend_income <
        total_taxable_income - assumptions.dividend_tax_rate_thresholds.higher_rate.threshold
      ) {
        income_tax_charge_on_dividend_income =
          (dividend_income - assumptions.dividend_tax_rate_thresholds.basic_rate.threshold) *
          assumptions.dividend_tax_rate_thresholds.higher_rate.rate;
      } else if (
        total_taxable_income - assumptions.dividend_tax_rate_thresholds.higher_rate.threshold <
        assumptions.dividend_tax_rate_thresholds.basic_rate.threshold
      ) {
        income_tax_charge_on_dividend_income =
          (dividend_income - assumptions.dividend_tax_rate_thresholds.basic_rate.threshold) *
          assumptions.dividend_tax_rate_thresholds.basic_rate.rate;
      } else {
        income_tax_charge_on_dividend_income =
          (dividend_income -
            (total_taxable_income - assumptions.dividend_tax_rate_thresholds.higher_rate.threshold)) *
            assumptions.dividend_tax_rate_thresholds.basic_rate.rate +
          (total_taxable_income -
            assumptions.dividend_tax_rate_thresholds.higher_rate.threshold -
            assumptions.dividend_tax_rate_thresholds.basic_rate.threshold) *
            assumptions.dividend_tax_rate_thresholds.higher_rate.rate;
      }
    } else if (
      dividend_income <
      total_taxable_income - assumptions.dividend_tax_rate_thresholds.additional_rate.threshold
    ) {
      income_tax_charge_on_dividend_income =
        (dividend_income - assumptions.dividend_tax_rate_thresholds.basic_rate.threshold) *
        assumptions.dividend_tax_rate_thresholds.additional_rate.rate;
    } else if (
      total_taxable_income - assumptions.dividend_tax_rate_thresholds.additional_rate.threshold <
      assumptions.dividend_tax_rate_thresholds.basic_rate.threshold
    ) {
      if (
        dividend_income <
        total_taxable_income - assumptions.dividend_tax_rate_thresholds.higher_rate.threshold
      ) {
        income_tax_charge_on_dividend_income =
          (dividend_income - assumptions.dividend_tax_rate_thresholds.basic_rate.threshold) *
          assumptions.dividend_tax_rate_thresholds.higher_rate.rate;
      } else {
        income_tax_charge_on_dividend_income =
          (total_taxable_income - assumptions.dividend_tax_rate_thresholds.higher_rate.threshold) *
            assumptions.dividend_tax_rate_thresholds.basic_rate.rate +
          (total_taxable_income -
            assumptions.dividend_tax_rate_thresholds.higher_rate.threshold -
            assumptions.dividend_tax_rate_thresholds.basic_rate.threshold) *
            assumptions.dividend_tax_rate_thresholds.higher_rate.rate;
      }
    } else if (
      dividend_income <
      total_taxable_income - assumptions.dividend_tax_rate_thresholds.higher_rate.threshold
    ) {
      income_tax_charge_on_dividend_income =
        (total_taxable_income -
          assumptions.dividend_tax_rate_thresholds.additional_rate.threshold -
          assumptions.dividend_tax_rate_thresholds.basic_rate.threshold) *
          assumptions.dividend_tax_rate_thresholds.additional_rate.rate +
        (dividend_income -
          (total_taxable_income - assumptions.dividend_tax_rate_thresholds.additional_rate.threshold)) *
          assumptions.dividend_tax_rate_thresholds.higher_rate.rate;
    } else {
      income_tax_charge_on_dividend_income = 0;
    }

    income_tax_charge_on_dividend_income *= -1;

    let limit_on_personal_allowance = 0;

    if (gross_salary > assumptions.income_limits.income_limit_for_personal_allowance.threshold) {
      if (
        total_taxable_income - assumptions.income_limits.income_limit_for_personal_allowance.threshold >
        assumptions.income_tax_rate_thresholds.basic_rate.threshold /
          assumptions.income_tax_rate_thresholds.basic_rate.rate
      ) {
        limit_on_personal_allowance =
          (assumptions.income_tax_rate_thresholds.basic_rate.threshold /
            assumptions.income_limits.income_limit_for_personal_allowance.rate) *
          assumptions.income_tax_rate_thresholds.basic_rate.rate;
      } else {
        limit_on_personal_allowance =
          ((total_taxable_income - assumptions.income_limits.income_limit_for_personal_allowance.threshold) /
            assumptions.income_limits.income_limit_for_personal_allowance.rate) *
          assumptions.income_tax_rate_thresholds.basic_rate.rate;
      }
    } else {
      limit_on_personal_allowance = 0;
    }

    limit_on_personal_allowance *= -1;

    let nic_class_2_charge = 0;

    if (
      yearObject.household_income.self_employment_income.details[index].amount >
      assumptions.self_employment_nic_class_2_threshold.small_profit_rate.threshold
    ) {
      nic_class_2_charge = assumptions.self_employment_nic_class_2_threshold.small_profit_rate.rate;
    } else {
      nic_class_2_charge = 0;
    }
    nic_class_2_charge *= -1;

    let nic_class_4_charge = 0;

    if (
      yearObject.household_income.self_employment_income.details[index].amount <
      assumptions.self_employment_nic_class_4_threshold.lower_profits_limit.threshold
    ) {
      nic_class_4_charge = 0;
    } else if (
      yearObject.household_income.self_employment_income.details[index].amount <
      assumptions.self_employment_nic_class_4_threshold.upper_earnings_limit.threshold
    ) {
      nic_class_4_charge =
        (yearObject.household_income.self_employment_income.details[index].amount -
          assumptions.self_employment_nic_class_4_threshold.lower_profits_limit.threshold) *
        assumptions.self_employment_nic_class_4_threshold.lower_profits_limit.rate;
    } else {
      nic_class_4_charge =
        (assumptions.self_employment_nic_class_4_threshold.upper_earnings_limit.threshold -
          assumptions.self_employment_nic_class_4_threshold.lower_profits_limit.threshold) *
          assumptions.self_employment_nic_class_4_threshold.lower_profits_limit.rate +
        (yearObject.household_income.self_employment_income.details[index].amount -
          assumptions.self_employment_nic_class_4_threshold.upper_earnings_limit.threshold) *
          assumptions.self_employment_nic_class_4_threshold.upper_earnings_limit.rate;
    }

    nic_class_4_charge *= -1;

    const tax_credit_received_through_pension =
      pension_plan * assumptions.income_tax_rate_thresholds.basic_rate.rate;

    //Pension Annual Allowance Tapering Analysis
    const pension_annual_allowance_tapering_analysis = {
      threshold_income: total_taxable_income,
      exceeds_tapering_threshold: false,
      adjusted_income:
        total_taxable_income +
        yearObject.household_income.employer_pension_contribution.details[index].amount,
      exceeds_tapering_threshold_2: false,
      pension_contribution_annual_allowance: 0,
      total_gross_pension_contribution:
        -member_pension_contribution -
        pension_plan +
        yearObject.household_income.employer_pension_contribution.details[index].amount,
    };
    if (
      pension_annual_allowance_tapering_analysis.threshold_income >
      assumptions.pension_contribution_allowance_tapering.threshold_income.threshold
    ) {
      pension_annual_allowance_tapering_analysis.exceeds_tapering_threshold = true;
    } else {
      pension_annual_allowance_tapering_analysis.exceeds_tapering_threshold = false;
    }
    if (
      pension_annual_allowance_tapering_analysis.adjusted_income >
      assumptions.pension_contribution_allowance_tapering.lifetime_allowance.threshold
    ) {
      pension_annual_allowance_tapering_analysis.exceeds_tapering_threshold_2 = true;
    } else {
      pension_annual_allowance_tapering_analysis.exceeds_tapering_threshold_2 = false;
    }
    if (!pension_annual_allowance_tapering_analysis.exceeds_tapering_threshold) {
      pension_annual_allowance_tapering_analysis.pension_contribution_annual_allowance =
        (assumptions.pension_contribution_allowance.contribution_annual_allowance.allowance *
          (1 + assumptions.pension_contribution_allowance.contribution_annual_allowance.rate)) ^
        0;
    } else {
      if (!pension_annual_allowance_tapering_analysis.exceeds_tapering_threshold_2) {
        pension_annual_allowance_tapering_analysis.pension_contribution_annual_allowance =
          assumptions.pension_contribution_allowance.contribution_annual_allowance.allowance;
      } else {
        pension_annual_allowance_tapering_analysis.pension_contribution_annual_allowance = Math.max(
          ((assumptions.pension_contribution_allowance.contribution_annual_allowance.allowance *
            (1 + assumptions.pension_contribution_allowance.contribution_annual_allowance.rate)) ^
            0) -
            (pension_annual_allowance_tapering_analysis.adjusted_income -
              assumptions.pension_contribution_allowance_tapering.threshold_income.threshold) *
              assumptions.pension_contribution_allowance_tapering.lifetime_allowance.rate,
          (assumptions.pension_contribution_allowance.contribution_annual_allowance_floor.allowance *
            (1 + assumptions.pension_contribution_allowance.contribution_annual_allowance_floor.rate)) ^
            0
        );
      }
    }

    //Total Gains from Other Assets
    const total_gains_from_other_assets = {
      base_cost:
        inputs.assets.savings_and_investments.general_investment_account[index].original_balance -
        yearObject.household_expenses.financials.savings_and_investments.details[
          index + inputs.household_owners.length
        ].amount,
      accumulattive_gain: 0,
      rate_recognised_as_base_cost: 0,
      rate_recognised_as_gain: 0,
      base_cost_drawdown: 0,
      gain_drawdown: 0,
    };

    total_gains_from_other_assets.accumulattive_gain =
      yearObject.assets.savings_and_investments.details[index + inputs.household_owners.length].amount -
      total_gains_from_other_assets.base_cost +
      yearObject.household_income.savings_and_investments_income.details[
        index + inputs.household_owners.length
      ].amount;

    //Capital Gains
    const capital_gains = {
      total_gain_form_property_sale: 0,
      total_gain_from_other_assets: total_gains_from_other_assets.gain_drawdown,
      annual_exemption_amount_property: 0,
      annual_exemption_amount_other_assets: 0,
      taxable_gains_from_property_sale: 0,
      taxable_gains_from_other_assets: 0,
    };

    let propertyTotal = 0;
    inputs.assets.properties.map((p, index2) => {
      if (i === p.end_year) {
        if (p.type_of_property !== "Main Home") {
          propertyTotal += 0 - p.original_price;
        }
      }
    });

    capital_gains.total_gain_form_property_sale = propertyTotal * 0.5;

    capital_gains.annual_exemption_amount_property = Math.max(
      -assumptions.income_limits_2.capital_gains_tax_annual_exempt_amount.threshold,
      -capital_gains.total_gain_form_property_sale
    );

    if (
      capital_gains.annual_exemption_amount_property >
      -assumptions.income_limits_2.capital_gains_tax_annual_exempt_amount.threshold
    ) {
      capital_gains.annual_exemption_amount_other_assets = Math.max(
        -(
          assumptions.income_limits_2.capital_gains_tax_annual_exempt_amount.threshold -
          -capital_gains.annual_exemption_amount_property
        ),
        -capital_gains.total_gain_from_other_assets
      );
    }

    capital_gains.taxable_gains_from_property_sale =
      capital_gains.total_gain_form_property_sale + capital_gains.annual_exemption_amount_property;
    capital_gains.taxable_gains_from_other_assets =
      capital_gains.total_gain_from_other_assets + capital_gains.annual_exemption_amount_other_assets;

    //to calc
    let capital_gains_tax_residential_property = 0;

    if (
      total_taxable_income + capital_gains.taxable_gains_from_property_sale <
      assumptions.residential_property_captical_gains_tax_rate_thresholds.basic_rate.threshold
    ) {
      capital_gains_tax_residential_property = 0;
    } else {
      if (
        total_taxable_income >
        assumptions.residential_property_captical_gains_tax_rate_thresholds.higher_and_additional_rate
          .threshold
      ) {
        capital_gains_tax_residential_property =
          capital_gains.taxable_gains_from_property_sale *
          assumptions.residential_property_captical_gains_tax_rate_thresholds.higher_and_additional_rate.rate;
      } else {
        if (
          total_taxable_income <
          assumptions.residential_property_captical_gains_tax_rate_thresholds.basic_rate.threshold
        ) {
          if (
            total_taxable_income + capital_gains.taxable_gains_from_property_sale <
            assumptions.residential_property_captical_gains_tax_rate_thresholds.higher_and_additional_rate
              .threshold
          ) {
            capital_gains_tax_residential_property =
              (total_taxable_income +
                capital_gains.taxable_gains_from_property_sale -
                assumptions.residential_property_captical_gains_tax_rate_thresholds.basic_rate.threshold) *
              assumptions.residential_property_captical_gains_tax_rate_thresholds.basic_rate.rate;
          } else {
            capital_gains_tax_residential_property =
              (assumptions.residential_property_captical_gains_tax_rate_thresholds.higher_and_additional_rate
                .threshold -
                assumptions.residential_property_captical_gains_tax_rate_thresholds.basic_rate.threshold) *
                assumptions.residential_property_captical_gains_tax_rate_thresholds.basic_rate.rate +
              (total_taxable_income +
                capital_gains.taxable_gains_from_property_sale -
                assumptions.residential_property_captical_gains_tax_rate_thresholds.higher_and_additional_rate
                  .threshold) *
                assumptions.residential_property_captical_gains_tax_rate_thresholds.higher_and_additional_rate
                  .rate;
          }
        }

        if (
          total_taxable_income + capital_gains.taxable_gains_from_property_sale <
          assumptions.residential_property_captical_gains_tax_rate_thresholds.higher_and_additional_rate
            .threshold
        ) {
          capital_gains_tax_residential_property =
            capital_gains.taxable_gains_from_property_sale *
            assumptions.residential_property_captical_gains_tax_rate_thresholds.basic_rate.rate;
        } else {
          capital_gains_tax_residential_property =
            (assumptions.residential_property_captical_gains_tax_rate_thresholds.higher_and_additional_rate
              .threshold -
              total_taxable_income) *
              assumptions.residential_property_captical_gains_tax_rate_thresholds.basic_rate.rate +
            (total_taxable_income +
              capital_gains.taxable_gains_from_property_sale -
              assumptions.residential_property_captical_gains_tax_rate_thresholds.higher_and_additional_rate
                .threshold) *
              assumptions.residential_property_captical_gains_tax_rate_thresholds.higher_and_additional_rate
                .rate;
        }
      }
    }

    //to calc
    let capital_gains_tax_other_assets = 0;

    if (capital_gains.taxable_gains_from_property_sale === 0) {
      if (
        total_taxable_income + capital_gains.taxable_gains_from_other_assets <
        assumptions.other_assets_capital_gains_tax_rate_thresholds.basic_rate.threshold
      ) {
        capital_gains_tax_other_assets = 0;
      } else {
        if (
          total_taxable_income >
          assumptions.other_assets_capital_gains_tax_rate_thresholds.higher_and_additional_rate.threshold
        ) {
          capital_gains_tax_other_assets =
            capital_gains.taxable_gains_from_other_assets *
            assumptions.other_assets_capital_gains_tax_rate_thresholds.higher_and_additional_rate.rate;
        } else {
          if (
            total_taxable_income <
            assumptions.other_assets_capital_gains_tax_rate_thresholds.basic_rate.threshold
          ) {
            if (
              total_taxable_income + capital_gains.taxable_gains_from_other_assets <
              assumptions.other_assets_capital_gains_tax_rate_thresholds.higher_and_additional_rate.threshold
            ) {
              capital_gains_tax_other_assets =
                (total_taxable_income +
                  capital_gains.taxable_gains_from_other_assets -
                  assumptions.other_assets_capital_gains_tax_rate_thresholds.basic_rate.threshold) *
                assumptions.other_assets_capital_gains_tax_rate_thresholds.basic_rate.rate;
            } else {
              capital_gains_tax_other_assets =
                (assumptions.other_assets_capital_gains_tax_rate_thresholds.higher_and_additional_rate
                  .threshold -
                  assumptions.other_assets_capital_gains_tax_rate_thresholds.basic_rate.threshold) *
                  assumptions.other_assets_capital_gains_tax_rate_thresholds.basic_rate.rate +
                (total_taxable_income +
                  capital_gains.taxable_gains_from_other_assets -
                  assumptions.other_assets_capital_gains_tax_rate_thresholds.higher_and_additional_rate
                    .threshold) *
                  assumptions.other_assets_capital_gains_tax_rate_thresholds.higher_and_additional_rate.rate;
            }
          } else {
            if (
              total_taxable_income + capital_gains.taxable_gains_from_other_assets <
              assumptions.other_assets_capital_gains_tax_rate_thresholds.higher_and_additional_rate.threshold
            ) {
              capital_gains_tax_other_assets =
                capital_gains.taxable_gains_from_other_assets *
                assumptions.other_assets_capital_gains_tax_rate_thresholds.basic_rate.rate;
            } else {
              capital_gains_tax_other_assets =
                (assumptions.other_assets_capital_gains_tax_rate_thresholds.higher_and_additional_rate
                  .threshold -
                  total_taxable_income) *
                  assumptions.other_assets_capital_gains_tax_rate_thresholds.basic_rate.rate +
                (total_taxable_income +
                  capital_gains.taxable_gains_from_other_assets -
                  assumptions.other_assets_capital_gains_tax_rate_thresholds.higher_and_additional_rate
                    .threshold) *
                  assumptions.other_assets_capital_gains_tax_rate_thresholds.higher_and_additional_rate.rate;
            }
          }
        }
      }
    } else {
      if (
        total_taxable_income +
          capital_gains.taxable_gains_from_property_sale +
          capital_gains.taxable_gains_from_other_assets <
        assumptions.other_assets_capital_gains_tax_rate_thresholds.basic_rate.threshold
      ) {
        capital_gains_tax_other_assets = 0;
      } else {
        if (
          total_taxable_income + capital_gains.taxable_gains_from_property_sale >
          assumptions.other_assets_capital_gains_tax_rate_thresholds.higher_and_additional_rate.threshold
        ) {
          capital_gains_tax_other_assets =
            capital_gains.taxable_gains_from_other_assets *
            assumptions.other_assets_capital_gains_tax_rate_thresholds.higher_and_additional_rate.rate;
        } else {
          if (
            total_taxable_income + capital_gains.taxable_gains_from_property_sale <
            assumptions.other_assets_capital_gains_tax_rate_thresholds.basic_rate.threshold
          ) {
            if (
              total_taxable_income +
                capital_gains.taxable_gains_from_property_sale +
                capital_gains.taxable_gains_from_other_assets <
              assumptions.other_assets_capital_gains_tax_rate_thresholds.higher_and_additional_rate.threshold
            ) {
              capital_gains_tax_other_assets =
                (total_taxable_income +
                  capital_gains.taxable_gains_from_property_sale +
                  capital_gains.taxable_gains_from_other_assets -
                  assumptions.other_assets_capital_gains_tax_rate_thresholds.basic_rate.threshold) *
                assumptions.other_assets_capital_gains_tax_rate_thresholds.basic_rate.rate;
            } else {
              capital_gains_tax_other_assets =
                (assumptions.other_assets_capital_gains_tax_rate_thresholds.higher_and_additional_rate
                  .threshold -
                  assumptions.other_assets_capital_gains_tax_rate_thresholds.basic_rate.threshold) *
                  assumptions.other_assets_capital_gains_tax_rate_thresholds.basic_rate.rate +
                (total_taxable_income +
                  capital_gains.taxable_gains_from_property_sale +
                  capital_gains.taxable_gains_from_other_assets -
                  assumptions.other_assets_capital_gains_tax_rate_thresholds.higher_and_additional_rate
                    .threshold) *
                  assumptions.other_assets_capital_gains_tax_rate_thresholds.higher_and_additional_rate.rate;
            }
          } else {
            if (
              total_taxable_income +
                capital_gains.taxable_gains_from_property_sale +
                capital_gains.taxable_gains_from_other_assets <
              assumptions.other_assets_capital_gains_tax_rate_thresholds.higher_and_additional_rate.threshold
            ) {
              capital_gains_tax_other_assets =
                capital_gains.taxable_gains_from_other_assets *
                assumptions.other_assets_capital_gains_tax_rate_thresholds.basic_rate.rate;
            } else {
              capital_gains_tax_other_assets =
                (assumptions.other_assets_capital_gains_tax_rate_thresholds.higher_and_additional_rate
                  .threshold -
                  total_taxable_income -
                  capital_gains.taxable_gains_from_property_sale) *
                  assumptions.other_assets_capital_gains_tax_rate_thresholds.basic_rate.rate +
                (total_taxable_income +
                  capital_gains.taxable_gains_from_property_sale +
                  capital_gains.taxable_gains_from_other_assets -
                  assumptions.other_assets_capital_gains_tax_rate_thresholds.higher_and_additional_rate
                    .threshold) *
                  assumptions.other_assets_capital_gains_tax_rate_thresholds.higher_and_additional_rate.rate;
            }
          }
        }
      }
    }

    let tax_deducted_at_source =
      yearObject.household_income.employment_income.details[index].income_tax_charge;

    if (tax_deducted_at_source < 0) {
      tax_deducted_at_source *= -1;
    }

    const additional_tax =
      income_tax_charge_on_dividend_income +
      income_tax_charge_on_non_dividend_income +
      limit_on_personal_allowance +
      nic_class_2_charge +
      nic_class_4_charge +
      tax_credit_received_through_pension +
      tax_deducted_at_source;

    yearObject.household_expenses.additional_tax_charge.details.push({
      name,
      gross_salary,
      member_pension_contribution,
      total_gross_salary_after_less,
      self_employment_income,
      rental_income,
      taxable_pension_income,
      other_taxable_income,
      pension_plan,
      prior_year_excess_pension_contribution,
      total_taxable_income_excluding_dividends,
      dividend_income,
      total_taxable_income,
      income_tax_charge_on_non_dividend_income,
      income_tax_charge_on_dividend_income,
      limit_on_personal_allowance,
      nic_class_2_charge,
      nic_class_4_charge,
      tax_credit_received_through_pension,
      capital_gains_tax_residential_property,
      capital_gains_tax_other_assets,
      tax_deducted_at_source,
      additional_tax,
      pension_annual_allowance_tapering_analysis,
      capital_gains,
      total_gains_from_other_assets,
    });
  });

  //set household expenses -> finantials -> sdlt charge
  inputs.assets.properties.map((property) => {
    const name = property.name;
    let amount = 0;
    if (i === property.start_year) {
      amount = property.sdlt;
    } else {
      amount = 0;
    }
    amount *= -1;
    yearObject.household_expenses.additional_tax_charge.sdlt_charge.details.push({ name, amount });
    yearObject.household_expenses.additional_tax_charge.sdlt_charge.total += amount;
  });

  //set total additional tax charge
  yearObject.household_expenses.additional_tax_charge.details.map((charge) => {
    const amount = charge.additional_tax;
    yearObject.household_expenses.additional_tax_charge.total_additional_tax_charge += amount;
  });

  yearObject.household_expenses.additional_tax_charge.total_additional_tax_charge +=
    yearObject.household_expenses.additional_tax_charge.sdlt_charge.total;

  //set total household expenses
  yearObject.household_expenses.total_household_expenses =
    yearObject.household_expenses.housing.total +
    yearObject.household_expenses.consumables.total +
    yearObject.household_expenses.travel.total +
    yearObject.household_expenses.shopping.total +
    yearObject.household_expenses.entertainment.total +
    yearObject.household_expenses.holiday.total +
    yearObject.household_expenses.one_off_expenses.total +
    yearObject.household_expenses.children_education_expenses.total +
    yearObject.household_expenses.financials.total +
    yearObject.household_expenses.additional_tax_charge.total_additional_tax_charge;

  //set annual cash inflow
  yearObject.annual_cash_inflow_outflow =
    yearObject.household_income.total + yearObject.household_expenses.total_household_expenses;

  //assets -> bank accounts
  yearObject.assets.bank_account.name = "Aggregated Bank Accounts";
  yearObject.assets.bank_account.amount =
    inputs.assets.bank_accounts.original_balance * (1 + inputs.assets.bank_accounts.growth_rate) -
    0 +
    yearObject.annual_cash_inflow_outflow;

  //assets -> personal pension plan
  inputs.household_owners.map((o, index) => {
    const name = `Pension Plan - ${o.name}`;
    let amount = 0;

    if (
      inputs.household_income.pension_income.defined_contribution_pension_plans[index].option_taken ===
      "Drawdown"
    ) {
      if (i > o.retirement_year) {
        amount =
          inputs.assets.non_employment_defined_contribution_pension_plans[index].original_balance *
            (1 + inputs.assets.non_employment_defined_contribution_pension_plans[index].growth_rate) -
          yearObject.household_income.pension_income.defined_contribution_pension_income.details[index]
            .regular_drawdown_option;
      } else {
        amount =
          inputs.assets.non_employment_defined_contribution_pension_plans[index].original_balance *
            (1 + inputs.assets.non_employment_defined_contribution_pension_plans[index].growth_rate) +
          yearObject.household_income.employer_pension_contribution.details[index].amount -
          yearObject.household_income.employment_income.details[index].members_pension_contribution -
          yearObject.household_expenses.financials.pension_pot.details[index].amount -
          yearObject.household_expenses.additional_tax_charge.details[index]
            .tax_credit_received_through_pension;
      }
    } else {
      if (i > o.retirement_year) {
        amount = 0;
      } else {
        amount =
          inputs.assets.non_employment_defined_contribution_pension_plans[index].original_balance *
            (1 + inputs.assets.non_employment_defined_contribution_pension_plans[index].growth_rate) +
          yearObject.household_income.employer_pension_contribution.details[index].amount -
          yearObject.household_income.employment_income.details[index].members_pension_contribution -
          yearObject.household_expenses.financials.pension_pot.details[index].amount -
          yearObject.household_expenses.additional_tax_charge.details[index]
            .tax_credit_received_through_pension;
      }
    }

    yearObject.assets.personal_pension_plans.details.push({ name, amount });
    yearObject.assets.personal_pension_plans.total += amount;
  });

  //set CREDITORS
  //set credit card requirement analysis
  yearObject.creditors.credit_card_requirement_analysis.balance_at_start_of_year =
    inputs.assets.bank_accounts.original_balance;

  yearObject.creditors.credit_card_requirement_analysis.minimum_balance_acceptable = -inputs.assets
    .bank_accounts.minimum_cash_balance_acceptable;

  yearObject.creditors.credit_card_requirement_analysis.excess_cash_at_start_of_year =
    yearObject.creditors.credit_card_requirement_analysis.balance_at_start_of_year +
    yearObject.creditors.credit_card_requirement_analysis.minimum_balance_acceptable;

  //set creditors -> mortgages
  inputs.liabilities.mortgages.map((mortgage, index) => {
    const name = mortgage.name;
    let amount = 0;
    const date = inputs.assets.properties[index].start_year - 1;

    const indexToSearch = (i - date) * mortgage.number_of_payments_per_year;

    if (i >= mortgage.start_year && i < mortgage.end_year) {
      amount = -inputs.mortgages[index].details[indexToSearch - 1].remaining_balance;
    } else {
      amount = 0;
    }
    if (amount >= 0) {
      amount = 0;
    }

    yearObject.creditors.mortgages.details.push({ name, amount });
    yearObject.creditors.mortgages.total += amount;
  });

  //set creditors -> other loans
  inputs.liabilities.other_loans.map((loan, index) => {
    const name = loan.name;
    let amount = 0;
    const date = inputs.liabilities.other_loans[index].start_year - 1;

    const indexToSearch = (i - date) * loan.number_of_payments_per_year;

    if (i >= loan.start_year && i < loan.end_year) {
      amount = -inputs.loans[index].details[indexToSearch - 1].remaining_balance;
    } else {
      amount = 0;
    }
    if (amount >= 0) {
      amount = 0;
    }

    yearObject.creditors.other_loans.details.push({ name, amount });
    yearObject.creditors.other_loans.total += amount;
  });

  //set credit card requirement analysis
  yearObject.creditors.credit_card_requirement_analysis.balance_at_start_of_year =
    inputs.assets.bank_accounts.original_balance;
  yearObject.creditors.credit_card_requirement_analysis.minimum_balance_acceptable = -inputs.assets
    .bank_accounts.minimum_cash_balance_acceptable;
  yearObject.creditors.credit_card_requirement_analysis.excess_cash_at_start_of_year =
    yearObject.creditors.credit_card_requirement_analysis.balance_at_start_of_year +
    yearObject.creditors.credit_card_requirement_analysis.minimum_balance_acceptable;

  yearObject.creditors.credit_card_requirement_analysis.total_cash_inflow_outflow =
    yearObject.annual_cash_inflow_outflow;
  yearObject.creditors.credit_card_requirement_analysis.cash_available =
    yearObject.creditors.credit_card_requirement_analysis.excess_cash_at_start_of_year +
    yearObject.creditors.credit_card_requirement_analysis.total_cash_inflow_outflow;

  //set creditors -> credit cards
  //e117
  //set Beginning of Period
  yearObject.creditors.credit_cards.name = inputs.liabilities.credit_card.name;
  yearObject.creditors.credit_cards.beginning_of_period =
    Math.abs(inputs.liabilities.credit_card.original_balance) * -1;

  //e118
  //set Change in Year
  yearObject.creditors.credit_cards.change_in_year = 0;

  //e119
  //Set End of Period
  yearObject.creditors.credit_cards.end_of_period =
    yearObject.creditors.credit_cards.beginning_of_period + yearObject.creditors.credit_cards.change_in_year;

  return yearObject;
}
