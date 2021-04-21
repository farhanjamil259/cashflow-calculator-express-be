import IInputs from "../interfaces/IInputs";
import IForecast from "../interfaces/IForecast";
import IAssumptions from "../interfaces/IAssumptions";
import { last } from "lodash";
import e from "express";

const setRemainingForecastYears = (
  inputs: IInputs,
  assumptions: IAssumptions,
  yearsArray: Array<IForecast>
) => {
  const endOfForecastYear = inputs.household_owners.reduce((prev, current) => {
    return prev.end_of_forecast_year > current.end_of_forecast_year ? prev : current;
  });
  for (let i = inputs.current_year + 1; i <= endOfForecastYear.end_of_forecast_year - 1; i++) {
    const remainingYearObject: IForecast = {
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
          individual_savings_accounts: {
            details: [],
          },
          general_investment_accounts: {
            details: [],
          },
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
          individual_savings_accounts: {
            details: [],
          },
          general_investment_accounts: {
            details: [],
          },
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
            individual_savings_accounts: {
              details: [],
            },
            general_investment_accounts: {
              details: [],
            },
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
            life_insurance: { details: [] },
            critical_illness_cover: { details: [] },
            family_income_benefit: { details: [] },
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
      auto_liquidation: {
        shortfall: 0,
        aggregated_bank_Accounts: 0,
        individual_savings_accounts: {
          details: [],
        },
        pension_plans: {
          details: [],
        },
        general_investment_accounts: {
          details: [],
        },
        credit_card_borrowing: 0,
      },
    };
    const lastYearObject = yearsArray[yearsArray.length - 1];
    const secondLastYearObject = yearsArray[yearsArray.length - 2];
    const thirdLastYearObject = yearsArray[yearsArray.length - 3];

    //set year
    remainingYearObject.year = i;

    //set AGES
    //set owners ages
    inputs.household_owners.map((owner, index) => {
      const name = owner.name;
      let age = 0;

      if (i < inputs.household_owners[index].end_of_forecast_year) {
        if (lastYearObject.ages.owner_ages[index].age === 0) {
          age = 0;
        } else {
          if (
            lastYearObject.ages.owner_ages[index].age + 1 <
              inputs.household_owners[index].end_of_forecast_age + 1 ||
            age === 0
          ) {
            age = lastYearObject.ages.owner_ages[index].age + 1;
          }
        }
      }

      remainingYearObject.ages.owner_ages.push({ name, age });
    });

    //set children ages
    inputs.children.map((child, index) => {
      const name = child.name;
      let age = lastYearObject.ages.children_ages[index].age + 1;

      if (i <= child.birth_year) {
        age = 0;
      }

      remainingYearObject.ages.children_ages.push({ name, age });
    });

    //set assets -> properties
    inputs.assets.properties.map((property) => {
      const name = property.name;
      let amount = 0;

      if (i >= property.start_year && i < property.end_year) {
        amount = property.todays_value * (1 + property.growth_rate) ** (i - inputs.current_year + 1);
      } else {
        amount = 0;
      }

      remainingYearObject.assets.properties.push({ name, amount });
    });

    //set creditors -> credit card -> beginning of periord
    remainingYearObject.creditors.credit_cards.beginning_of_period =
      lastYearObject.creditors.credit_cards.end_of_period;

    //set creditors -> credit card requirement analysis -> bank balance at start of year
    remainingYearObject.creditors.credit_card_requirement_analysis.balance_at_start_of_year =
      lastYearObject.assets.bank_account.amount;

    //set creditors -> credit card requirement analysis -> minimum balance acceptable
    remainingYearObject.creditors.credit_card_requirement_analysis.minimum_balance_acceptable = -inputs.assets
      .bank_accounts.minimum_cash_balance_acceptable;

    remainingYearObject.creditors.credit_card_requirement_analysis.excess_cash_at_start_of_year =
      remainingYearObject.creditors.credit_card_requirement_analysis.balance_at_start_of_year +
      remainingYearObject.creditors.credit_card_requirement_analysis.minimum_balance_acceptable;

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

      remainingYearObject.creditors.mortgages.details.push({ name, amount });
      remainingYearObject.creditors.mortgages.total += amount;
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

      remainingYearObject.creditors.other_loans.details.push({ name, amount });
      remainingYearObject.creditors.other_loans.total += amount;
    });

    //set income
    //set employment income -> employment income
    inputs.household_owners.map((owner, index) => {
      let { employment_income } = inputs.household_income;
      let name = "Salary - " + owner.name;
      let gross_salary =
        employment_income[index].gross_anual_amount *
        (1 + employment_income[index].inflation) ** (i - inputs.current_year);
      let members_pension_contribution =
        Math.abs(
          gross_salary * assumptions.employement_minimum_pension_contributions.minimum_contributions.member
        ) * -1;

      let total_gross_salary_after_less = gross_salary + members_pension_contribution;

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
        total_gross_salary_after_less >
        assumptions.income_limits.income_limit_for_personal_allowance.threshold
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
          -(
            total_gross_salary_after_less - assumptions.employment_nic_thresholds.primary_threshold.threshold
          ) * assumptions.employment_nic_thresholds.primary_threshold.rate;
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

      if (
        i >= inputs.household_income.employment_income[index].start_year &&
        i <= inputs.household_income.employment_income[index].end_year
      ) {
      } else {
        gross_salary = 0;
        members_pension_contribution = 0;
        total_gross_salary_after_less = 0;
        income_tax_charge = 0;
        limit_on_personal_allowance = 0;
        nic_class_1_charge = 0;
        net_salary = 0;
        effective_tax_rate = 0;
      }
      remainingYearObject.household_income.employment_income.details.push({
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
      remainingYearObject.household_income.employment_income.total += net_salary;
    });

    //set household income -> employer pension contribution
    inputs.household_owners.map((o, index) => {
      const name = o.name;
      const amount =
        remainingYearObject.household_income.employment_income.details[index].gross_salary *
        assumptions.employement_minimum_pension_contributions.minimum_contributions.employer;

      remainingYearObject.household_income.employer_pension_contribution.details.push({ name, amount });
    });

    //set houshold income -> self employment income
    inputs.household_income.self_employment_income.map((income) => {
      const name = income.name;
      let amount = 0;
      if (i >= income.start_year && i <= income.end_year) {
        amount = income.gross_anual_amount * (1 + income.inflation) ** (i - inputs.current_year);
      } else {
        amount = 0;
      }
      remainingYearObject.household_income.self_employment_income.details.push({
        name,
        amount,
      });
      remainingYearObject.household_income.self_employment_income.total += amount;
    });

    //set houshold income -> rental income
    inputs.household_income.rental_income.details.map((income) => {
      const name = income.name;
      let amount = 0;
      if (i >= income.start_year && i <= income.end_year) {
        amount = income.annual_amount * (1 + income.inflation) ** (i - inputs.current_year);
      } else {
        amount = 0;
      }
      remainingYearObject.household_income.rental_income.details.push({
        name,
        amount,
      });
      remainingYearObject.household_income.rental_income.total += amount;
    });

    //set houshold income -> dividend income
    inputs.household_income.dividend_income.map((income) => {
      const name = income.name;
      let amount = 0;
      if (i >= income.start_year && i <= income.end_year) {
        amount = income.anual_amount * (1 + income.inflation) ** (i - inputs.current_year);
      } else {
        amount = 0;
      }
      remainingYearObject.household_income.dividend_income.details.push({
        name,
        amount,
      });
      remainingYearObject.household_income.dividend_income.total += amount;
    });

    //set houshold income -> savings and investments income
    inputs.household_income.savings_and_investments_drawdowns.individual_savings_accounts.map(
      (drawdown, index) => {
        const name = "Individual Savings Account (ISA) - " + drawdown.owner_name;
        let amount = 0;
        drawdown.drawdowns.map((draw) => {
          if (i >= draw.start_year && i <= draw.end_year) {
            amount += draw.amount_to_drawn_down;
          }
        });

        let amount2 = Math.min(
          lastYearObject.assets.savings_and_investments.individual_savings_accounts.details[index].amount,
          amount
        );

        remainingYearObject.household_income.savings_and_investments_income.individual_savings_accounts.details.push(
          {
            name,
            amount: amount2,
          }
        );
        remainingYearObject.household_income.savings_and_investments_income.total += amount2;
      }
    );

    //set houshold income -> general investment account income
    inputs.household_income.savings_and_investments_drawdowns.general_investment_accounts.map(
      (drawdown, index) => {
        const name = "General Investment Account (GIA) - " + drawdown.owner_name;
        let amount = 0;
        drawdown.drawdowns.map((draw) => {
          if (i >= draw.start_year && i <= draw.end_year) {
            amount += draw.amount_to_drawn_down;
          }
        });

        let amount2 = Math.min(
          lastYearObject.assets.savings_and_investments.general_investment_accounts.details[index].amount,
          amount
        );

        remainingYearObject.household_income.savings_and_investments_income.general_investment_accounts.details.push(
          {
            name,
            amount: amount2,
          }
        );
        remainingYearObject.household_income.savings_and_investments_income.total += amount2;
      }
    );

    //state pension income
    inputs.household_income.pension_income.state_pension.map((income, index) => {
      const name = inputs.household_owners[index].name;
      let amount = 0;

      if (remainingYearObject.ages.owner_ages[index].age > 0) {
        if (i >= income.start_year && i <= income.end_year) {
          amount = income.annual_amount * (1 + income.inflation) ** (i - inputs.current_year);
        } else {
          amount = 0;
        }
      } else {
        amount = 0;
      }
      remainingYearObject.household_income.pension_income.state_pension_income.details.push({
        name,
        amount,
      });
      remainingYearObject.household_income.pension_income.state_pension_income.total += amount;
    });

    //defined benifit pension income
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

      remainingYearObject.household_income.pension_income.defined_benefit_pension_income.details.push({
        name,
        lump_sum,
        annual,
        total,
      });
      remainingYearObject.household_income.pension_income.defined_benefit_pension_income.total += total;
    });

    //set pension  income > defined contribution pension income
    //defined contribution pension income
    inputs.household_income.pension_income.defined_contribution_pension_plans.map((income, index) => {
      const name = inputs.household_owners[index].name;
      let type = income.option_taken;

      let lump_sum_drawdown_option = 0;
      let regular_drawdown_option = 0;
      let annuity_option_initial_drawdown = 0;
      let annuity_option_annuity_income = 0;

      //calculate lump_sum_drawdown_option
      if (type === "Lump Sum") {
        if (remainingYearObject.year === income.start_year) {
          lump_sum_drawdown_option = lastYearObject.assets.personal_pension_plans.details[index].amount;
        }
      }

      //calculate regular_drawdown_option
      if (type == "Drawdown") {
        let val1 = 0;
        if (remainingYearObject.year >= income.start_year && remainingYearObject.year <= income.end_year) {
          val1 = income.drawdown_option_annual_amount;
        } else {
          val1 = 0;
        }
        let val2 = lastYearObject.assets.personal_pension_plans.details[index].amount;
        regular_drawdown_option = Math.min(val1, val2);
      } else {
        regular_drawdown_option = 0;
      }

      if (type === "Annuity") {
        if (remainingYearObject.year === 0) {
          annuity_option_annuity_income = 0;
        } else {
          if (
            lastYearObject.household_income.pension_income.defined_contribution_pension_income.details[index]
              .annuity_option_initial_drawdown > 0
          ) {
            annuity_option_annuity_income =
              (lastYearObject.assets.personal_pension_plans.details[index].amount -
                lastYearObject.household_income.pension_income.defined_contribution_pension_income.details[
                  index
                ].annuity_option_initial_drawdown) *
              income.annuity_option_annual_annuity_rate;
          } else {
            annuity_option_annuity_income =
              lastYearObject.household_income.pension_income.defined_contribution_pension_income.details[
                index
              ].annuity_option_annuity_income;
          }
        }
      }

      const total =
        lump_sum_drawdown_option +
        regular_drawdown_option +
        annuity_option_initial_drawdown +
        annuity_option_annuity_income;

      remainingYearObject.household_income.pension_income.defined_contribution_pension_income.details.push({
        name,
        option_taken: type,
        lump_sum_drawdown_option,
        regular_drawdown_option,
        annuity_option_initial_drawdown,
        annuity_option_annuity_income,
        total,
      });

      remainingYearObject.household_income.pension_income.defined_contribution_pension_income.total += total;
    });

    //total pension income
    remainingYearObject.household_income.pension_income.total =
      remainingYearObject.household_income.pension_income.state_pension_income.total +
      remainingYearObject.household_income.pension_income.defined_benefit_pension_income.total +
      remainingYearObject.household_income.pension_income.defined_contribution_pension_income.total;

    //set household income -> residential property sale proceeds
    inputs.household_owners.map((o, index) => {
      const name = o.name;
      let amount = 0;

      let tempAmount1 = 0;
      inputs.assets.properties.map((p, index2) => {
        if (i === p.end_year) {
          tempAmount1 += lastYearObject.assets.properties[index2].amount;
        }
      });

      amount = tempAmount1 * 0.5;
      remainingYearObject.household_income.residential_property_sale_proceeds.details.push({ name, amount });
      remainingYearObject.household_income.residential_property_sale_proceeds.total += amount;
    });

    //set household income -> other income
    //other taxable income
    inputs.household_income.other_income.other_taxable_income.map((income, index) => {
      const name = inputs.household_owners[index].name;
      let amount = 0;

      if (i >= income.start_year && i <= income.end_year) {
        amount = income.gross_annual_amount * (1 + income.inflation) ** (i - inputs.current_year);
      } else {
        amount = 0;
      }
      remainingYearObject.household_income.other_income.other_taxable_income.details.push({
        name,
        amount,
      });
      remainingYearObject.household_income.other_income.other_taxable_income.total += amount;
    });
    //other non taxable income
    inputs.household_income.other_income.other_non_taxable_income.map((income, index) => {
      const name = inputs.household_owners[index].name;
      let amount = 0;

      if (i >= income.start_year && i <= income.end_year) {
        amount = income.gross_annual_amount * (1 + income.inflation) ** (i - inputs.current_year);
      } else {
        amount = 0;
      }
      remainingYearObject.household_income.other_income.other_non_taxable_income.details.push({
        name,
        amount,
      });
      remainingYearObject.household_income.other_income.other_non_taxable_income.total += amount;
    });
    remainingYearObject.household_income.other_income.total =
      remainingYearObject.household_income.other_income.other_non_taxable_income.total +
      remainingYearObject.household_income.other_income.other_taxable_income.total;

    //set household income -> total household income
    remainingYearObject.household_income.total =
      remainingYearObject.household_income.employment_income.total +
      remainingYearObject.household_income.self_employment_income.total +
      remainingYearObject.household_income.rental_income.total +
      remainingYearObject.household_income.dividend_income.total +
      remainingYearObject.household_income.savings_and_investments_income.total +
      remainingYearObject.household_income.pension_income.total +
      remainingYearObject.household_income.other_income.total;

    //set HOUSEHOLD EXPENSES------------------------------------------------------------------------------
    //set household expenses -> housing
    inputs.liabilities.mortgages.map((mortgage) => {
      const name = mortgage.name;
      let amount = 0;
      if (i >= mortgage.start_year_for_model && i < mortgage.end_year) {
        amount = -mortgage.annual_payment;
      } else {
        amount = 0;
      }
      remainingYearObject.household_expenses.housing.details.push({ name, amount });
      remainingYearObject.household_expenses.housing.total += amount;
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
            (1 + expense.inflation) ** (i - inputs.current_year) *
            expense.rate_after_retirement
          );
        } else {
          amount = -(expense.annual_expense * (1 + expense.inflation) ** (i - inputs.current_year));
        }
      } else {
        amount = 0;
      }

      remainingYearObject.household_expenses.housing.details.push({ name, amount });
      remainingYearObject.household_expenses.housing.total += amount;
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
            (1 + expense.inflation) ** (i - inputs.current_year) *
            expense.rate_after_retirement
          );
        } else {
          amount = -(expense.annual_expense * (1 + expense.inflation) ** (i - inputs.current_year));
        }
      } else {
        amount = 0;
      }

      remainingYearObject.household_expenses.consumables.details.push({ name, amount });
      remainingYearObject.household_expenses.consumables.total += amount;
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
            (1 + expense.inflation) ** (i - inputs.current_year) *
            expense.rate_after_retirement
          );
        } else {
          amount = -(expense.annual_expense * (1 + expense.inflation) ** (i - inputs.current_year));
        }
      } else {
        amount = 0;
      }

      remainingYearObject.household_expenses.travel.details.push({ name, amount });
      remainingYearObject.household_expenses.travel.total += amount;
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
            (1 + expense.inflation) ** (i - inputs.current_year) *
            expense.rate_after_retirement
          );
        } else {
          amount = -(expense.annual_expense * (1 + expense.inflation) ** (i - inputs.current_year));
        }
      } else {
        amount = 0;
      }

      remainingYearObject.household_expenses.shopping.details.push({ name, amount });
      remainingYearObject.household_expenses.shopping.total += amount;
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
            (1 + expense.inflation) ** (i - inputs.current_year) *
            expense.rate_after_retirement
          );
        } else {
          amount = -(expense.annual_expense * (1 + expense.inflation) ** (i - inputs.current_year));
        }
      } else {
        amount = 0;
      }

      remainingYearObject.household_expenses.entertainment.details.push({ name, amount });
      remainingYearObject.household_expenses.entertainment.total += amount;
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
            (1 + expense.inflation) ** (i - inputs.current_year) *
            expense.rate_after_retirement
          );
        } else {
          amount = -(expense.annual_expense * (1 + expense.inflation) ** (i - inputs.current_year));
        }
      } else {
        amount = 0;
      }

      remainingYearObject.household_expenses.holiday.details.push({ name, amount });
      remainingYearObject.household_expenses.holiday.total += amount;
    });

    //set household expenses -> one-off expenses
    //
    inputs.assets.properties.map((property) => {
      const name = "Deposit - " + property.name;
      let amount = 0;

      if (i === property.start_year) {
        amount = property.deposit * -1;
      } else {
        amount = 0;
      }

      remainingYearObject.household_expenses.one_off_expenses.details.push({ name, amount });
      remainingYearObject.household_expenses.one_off_expenses.total += amount;
    });
    //
    inputs.household_expenses.one_off_expenses.map((expense) => {
      const name = expense.name;
      let amount = 0;

      if (i >= expense.start_year && i <= expense.end_year) {
        amount = -(
          expense.annual_payment_in_todays_terms *
          (1 + expense.inflation) ** (i - inputs.current_year + 1)
        );
      } else {
        amount = 0;
      }

      remainingYearObject.household_expenses.one_off_expenses.details.push({ name, amount });
      remainingYearObject.household_expenses.one_off_expenses.total += amount;
    });

    //set household expenses -> children education expenses
    inputs.children.map((child) => {
      const name = child.name;
      let primary_school_fees = 0;
      let secondary_school_fees = 0;
      let university_fees = 0;

      //calculate primary school fees
      if (i >= child.primary_school_year && i < child.secondary_school_year) {
        primary_school_fees =
          Math.abs(
            inputs.household_expenses.children_education_expenses.primary_school_fees
              .annual_fee_in_todays_terms *
              (1 + inputs.household_expenses.children_education_expenses.primary_school_fees.inflation) **
                (i - inputs.current_year)
          ) * -1;
      }

      //calculate secondary school fees
      if (i >= child.secondary_school_year && i < child.university_year) {
        secondary_school_fees =
          Math.abs(
            inputs.household_expenses.children_education_expenses.seconday_school_fees
              .annual_fee_in_todays_terms *
              (1 + inputs.household_expenses.children_education_expenses.seconday_school_fees.inflation) **
                (i - inputs.current_year)
          ) * -1;
      }

      //calculate University fees
      if (i >= child.university_year && i < child.graduation_year) {
        secondary_school_fees =
          Math.abs(
            inputs.household_expenses.children_education_expenses.university_fees.annual_fee_in_todays_terms *
              (1 + inputs.household_expenses.children_education_expenses.university_fees.inflation) **
                (i - inputs.current_year)
          ) * -1;
      }

      const total = primary_school_fees + secondary_school_fees + university_fees;

      remainingYearObject.household_expenses.children_education_expenses.details.push({
        name,
        primary_school_fees,
        secondary_school_fees,
        university_fees,
        total,
      });
      remainingYearObject.household_expenses.children_education_expenses.total = total;
    });

    //set household expenses -> financials
    //other loans
    inputs.liabilities.other_loans.map((loan) => {
      const name = loan.name;
      let amount = 0;

      if (i >= loan.start_year_for_model && i < loan.end_year) {
        amount = -loan.annual_payment;
      } else {
        amount = 0;
      }
      remainingYearObject.household_expenses.financials.other_loans.details.push({ name, amount });
      remainingYearObject.household_expenses.financials.other_loans.total += amount;
    });

    // savings and investments
    inputs.assets.savings_and_investments.individual_savings_account.map((sai) => {
      const name = sai.name;
      let amount = 0;

      let tempAmount1 =
        assumptions.isaa.annual_contribution_allowance.allowance *
        (1 + assumptions.isaa.annual_contribution_allowance.rate) ** (i - inputs.current_year);

      let tempAmount2 = 0;

      if (i >= sai.contribution_start_year && i <= sai.contribution_end_year) {
        tempAmount2 = sai.annual_contribution;
      } else {
        tempAmount2 = 0;
      }

      amount = Math.min(tempAmount1, tempAmount2);
      amount *= -1;

      remainingYearObject.household_expenses.financials.savings_and_investments.individual_savings_accounts.details.push(
        {
          name,
          amount,
        }
      );
      remainingYearObject.household_expenses.financials.savings_and_investments.total += amount;
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

      remainingYearObject.household_expenses.financials.savings_and_investments.general_investment_accounts.details.push(
        {
          name,
          amount,
        }
      );
      remainingYearObject.household_expenses.financials.savings_and_investments.total += amount;
    });

    //set pension pot
    inputs.assets.non_employment_defined_contribution_pension_plans.map((asset, index) => {
      let name = asset.name;
      let amount = 0;

      if (
        lastYearObject.assets.personal_pension_plans.details[index].amount +
          asset.annual_contribution -
          assumptions.pension_contribution_allowance.lifetime_allowance.allowance >
        0
      ) {
        let val1 = 0;
        let val2 = 0;

        if (
          remainingYearObject.year >= asset.contribution_start_year &&
          remainingYearObject.year <= asset.contribution_end_year
        ) {
          val1 = asset.annual_contribution;
        }

        if (
          -remainingYearObject.household_income.employment_income.details[index]
            .members_pension_contribution +
            remainingYearObject.household_income.employer_pension_contribution.details[index].amount >
          lastYearObject.household_expenses.additional_tax_charge.details[index]
            .pension_annual_allowance_tapering_analysis.pension_contribution_annual_allowance
        ) {
          val2 = 0;
        } else {
          val2 =
            (lastYearObject.household_expenses.additional_tax_charge.details[index]
              .pension_annual_allowance_tapering_analysis.pension_contribution_annual_allowance +
              remainingYearObject.household_income.employment_income.details[index]
                .members_pension_contribution -
              remainingYearObject.household_income.employer_pension_contribution.details[index].amount) *
            (1 - assumptions.income_tax_rate_thresholds.basic_rate.rate);
        }

        let val3 = Math.min(val1, val2);

        let val4 = 0;

        if (
          lastYearObject.assets.personal_pension_plans.details[index].amount -
            assumptions.pension_contribution_allowance.lifetime_allowance.allowance >
          0
        ) {
          val4 = 0;
        } else {
          val4 =
            assumptions.pension_contribution_allowance.lifetime_allowance.allowance -
            lastYearObject.assets.personal_pension_plans.details[index].amount;
        }

        amount = Math.min(val3, val4);
      } else {
        let val1 = 0;
        let val2 = 0;

        if (
          remainingYearObject.year >= asset.contribution_start_year &&
          remainingYearObject.year <= asset.contribution_end_year
        ) {
          val1 = asset.annual_contribution;
        }

        if (
          -remainingYearObject.household_income.employment_income.details[index]
            .members_pension_contribution +
            remainingYearObject.household_income.employer_pension_contribution.details[index].amount >
          lastYearObject.household_expenses.additional_tax_charge.details[index]
            .pension_annual_allowance_tapering_analysis.pension_contribution_annual_allowance
        ) {
          val2 = 0;
        } else {
          val2 =
            (lastYearObject.household_expenses.additional_tax_charge.details[index]
              .pension_annual_allowance_tapering_analysis.pension_contribution_annual_allowance +
              remainingYearObject.household_income.employment_income.details[index]
                .members_pension_contribution -
              remainingYearObject.household_income.employer_pension_contribution.details[index].amount) *
            (1 - assumptions.income_tax_rate_thresholds.basic_rate.rate);
        }

        amount = Math.min(val1, val2);
      }

      if (i >= asset.contribution_start_year && i <= asset.contribution_end_year) {
      } else {
        amount = 0;
      }
      amount *= -1;

      remainingYearObject.household_expenses.financials.pension_pot.details.push({ name, amount });
      remainingYearObject.household_expenses.financials.pension_pot.total += amount;
    });

    //set interest expenses
    remainingYearObject.household_expenses.financials.interest_expenses.details.name =
      inputs.liabilities.credit_card.name;

    remainingYearObject.household_expenses.financials.interest_expenses.details.amount =
      lastYearObject.creditors.credit_cards.end_of_period * inputs.liabilities.credit_card.interest_rate;

    remainingYearObject.household_expenses.financials.interest_expenses.total =
      remainingYearObject.household_expenses.financials.interest_expenses.details.amount;

    //set financials -> insurance policies -> life insurance
    inputs.household_expenses.insurance_policies.life_insurance.map((policy) => {
      const name = policy.name;
      let amount = 0;

      const maxRetirementYear = inputs.household_owners.reduce((prev, current) => {
        return prev.retirement_year > current.retirement_year ? prev : current;
      });

      if (i >= policy.start_year && i <= policy.end_year) {
        if (i > maxRetirementYear.retirement_year) {
          amount = -(
            policy.annual_expense *
            (1 + policy.inflation) ** (i - inputs.current_year) *
            policy.rate_after_retirement
          );
        } else {
          amount = -(policy.annual_expense * (1 + policy.inflation) ** (i - inputs.current_year));
        }
      } else {
        amount = 0;
      }

      remainingYearObject.household_expenses.financials.insurance_policies.life_insurance.details.push({
        name,
        amount,
      });
      remainingYearObject.household_expenses.financials.insurance_policies.total += amount;
    });

    //set financials -> insurance policies -> critical illness cover
    inputs.household_expenses.insurance_policies.critical_illness_cover.map((policy) => {
      const name = policy.name;
      let amount = 0;

      const maxRetirementYear = inputs.household_owners.reduce((prev, current) => {
        return prev.retirement_year > current.retirement_year ? prev : current;
      });

      if (i >= policy.start_year && i <= policy.end_year) {
        if (i > maxRetirementYear.retirement_year) {
          amount = -(
            policy.annual_expense *
            (1 + policy.inflation) ** (i - inputs.current_year) *
            policy.rate_after_retirement
          );
        } else {
          amount = -(policy.annual_expense * (1 + policy.inflation) ** (i - inputs.current_year));
        }
      } else {
        amount = 0;
      }

      remainingYearObject.household_expenses.financials.insurance_policies.critical_illness_cover.details.push(
        {
          name,
          amount,
        }
      );
      remainingYearObject.household_expenses.financials.insurance_policies.total += amount;
    });

    //set financials -> insurance policies -> family income benifit
    inputs.household_expenses.insurance_policies.family_income_benefit.map((policy) => {
      const name = policy.name;

      let amount = 0;

      const maxRetirementYear = inputs.household_owners.reduce((prev, current) => {
        return prev.retirement_year > current.retirement_year ? prev : current;
      });

      if (i >= policy.start_year && i <= policy.end_year) {
        if (i > maxRetirementYear.retirement_year) {
          amount = -(
            policy.annual_expense *
            (1 + policy.inflation) ** (i - inputs.current_year) *
            policy.rate_after_retirement
          );
        } else {
          amount = -(policy.annual_expense * (1 + policy.inflation) ** (i - inputs.current_year));
        }
      } else {
        amount = 0;
      }

      remainingYearObject.household_expenses.financials.insurance_policies.family_income_benefit.details.push(
        {
          name,
          amount,
        }
      );
      remainingYearObject.household_expenses.financials.insurance_policies.total += amount;
    });

    //total financial expenses
    remainingYearObject.household_expenses.financials.total =
      remainingYearObject.household_expenses.financials.other_loans.total +
      remainingYearObject.household_expenses.financials.savings_and_investments.total +
      remainingYearObject.household_expenses.financials.pension_pot.total +
      remainingYearObject.household_expenses.financials.interest_expenses.total +
      remainingYearObject.household_expenses.financials.insurance_policies.total;

    //set additional tax charge
    inputs.household_owners.map((o, index) => {
      const name = o.name;
      const gross_salary = remainingYearObject.household_income.employment_income.details[index].gross_salary;

      const member_pension_contribution =
        remainingYearObject.household_income.employment_income.details[index].members_pension_contribution;

      const total_gross_salary_after_less =
        remainingYearObject.household_income.employment_income.details[index].total_gross_salary_after_less;

      const self_employment_income =
        remainingYearObject.household_income.self_employment_income.details[index].amount;

      const rental_income = remainingYearObject.household_income.rental_income.details[index].amount;

      const taxable_pension_income =
        lastYearObject.household_income.pension_income.defined_benefit_pension_income.details[index]
          .lump_sum *
          0.75 +
        lastYearObject.household_income.pension_income.defined_benefit_pension_income.details[index].annual +
        lastYearObject.household_income.pension_income.defined_contribution_pension_income.details[index]
          .lump_sum_drawdown_option *
          0.75 +
        lastYearObject.household_income.pension_income.defined_contribution_pension_income.details[index]
          .regular_drawdown_option *
          0.75 +
        lastYearObject.household_income.pension_income.defined_contribution_pension_income.details[index]
          .annuity_option_initial_drawdown *
          0.75 +
        lastYearObject.household_income.pension_income.defined_contribution_pension_income.details[index]
          .annuity_option_annuity_income -
        lastYearObject.auto_liquidation.pension_plans.details[index].amount * 0.75;

      const other_taxable_income =
        remainingYearObject.household_income.other_income.other_taxable_income.details.length > 0
          ? remainingYearObject.household_income.other_income.other_taxable_income.details[index].amount
          : 0;

      const pension_plan =
        remainingYearObject.household_expenses.financials.pension_pot.details[index].amount /
        (1 - assumptions.income_tax_rate_thresholds.basic_rate.rate);
      let prior_year_excess_pension_contribution = 0;
      let val1 = 0;
      let val2 = 0;
      let val3 = 0;

      if (i === inputs.current_year + 1) {
        val1 +=
          lastYearObject.household_expenses.additional_tax_charge.details[index]
            .pension_annual_allowance_tapering_analysis.total_gross_pension_contribution;

        val2 +=
          lastYearObject.household_expenses.additional_tax_charge.details[index]
            .pension_annual_allowance_tapering_analysis.pension_contribution_annual_allowance;

        val3 +=
          lastYearObject.household_expenses.additional_tax_charge.details[index]
            .prior_year_excess_pension_contribution;
      } else if (i === inputs.current_year + 2) {
        val1 +=
          lastYearObject.household_expenses.additional_tax_charge.details[index]
            .pension_annual_allowance_tapering_analysis.total_gross_pension_contribution +
          secondLastYearObject.household_expenses.additional_tax_charge.details[index]
            .pension_annual_allowance_tapering_analysis.total_gross_pension_contribution;

        val2 +=
          lastYearObject.household_expenses.additional_tax_charge.details[index]
            .pension_annual_allowance_tapering_analysis.pension_contribution_annual_allowance +
          secondLastYearObject.household_expenses.additional_tax_charge.details[index]
            .pension_annual_allowance_tapering_analysis.pension_contribution_annual_allowance;

        val3 +=
          lastYearObject.household_expenses.additional_tax_charge.details[index]
            .prior_year_excess_pension_contribution +
          secondLastYearObject.household_expenses.additional_tax_charge.details[index]
            .prior_year_excess_pension_contribution;
      } else if (i > inputs.current_year + 2) {
        val1 +=
          lastYearObject.household_expenses.additional_tax_charge.details[index]
            .pension_annual_allowance_tapering_analysis.total_gross_pension_contribution +
          secondLastYearObject.household_expenses.additional_tax_charge.details[index]
            .pension_annual_allowance_tapering_analysis.total_gross_pension_contribution +
          thirdLastYearObject.household_expenses.additional_tax_charge.details[index]
            .pension_annual_allowance_tapering_analysis.total_gross_pension_contribution;

        val2 +=
          lastYearObject.household_expenses.additional_tax_charge.details[index]
            .pension_annual_allowance_tapering_analysis.pension_contribution_annual_allowance +
          secondLastYearObject.household_expenses.additional_tax_charge.details[index]
            .pension_annual_allowance_tapering_analysis.pension_contribution_annual_allowance +
          thirdLastYearObject.household_expenses.additional_tax_charge.details[index]
            .pension_annual_allowance_tapering_analysis.pension_contribution_annual_allowance;

        val3 +=
          lastYearObject.household_expenses.additional_tax_charge.details[index]
            .prior_year_excess_pension_contribution +
          secondLastYearObject.household_expenses.additional_tax_charge.details[index]
            .prior_year_excess_pension_contribution;
      }

      prior_year_excess_pension_contribution = Math.max(0, val1 - val2 - val3);

      const total_taxable_income_excluding_dividends =
        total_gross_salary_after_less +
        self_employment_income +
        rental_income +
        taxable_pension_income +
        other_taxable_income +
        pension_plan;

      let income_tax_charge_on_non_dividend_income = 0;

      if (
        total_taxable_income_excluding_dividends < assumptions.income_tax_rate_thresholds.basic_rate.threshold
      ) {
        income_tax_charge_on_non_dividend_income = 0;
      } else if (
        total_taxable_income_excluding_dividends <
        assumptions.income_tax_rate_thresholds.higher_rate.threshold
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

      const dividend_income = remainingYearObject.household_income.dividend_income.details[index].amount;

      const total_taxable_income = total_taxable_income_excluding_dividends + dividend_income;

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

      if (total_taxable_income > assumptions.income_limits.income_limit_for_personal_allowance.threshold) {
        if (
          total_taxable_income - assumptions.income_limits.income_limit_for_personal_allowance.threshold >
          assumptions.income_tax_rate_thresholds.basic_rate.threshold /
            assumptions.income_limits.income_limit_for_personal_allowance.rate
        ) {
          limit_on_personal_allowance =
            (assumptions.income_tax_rate_thresholds.basic_rate.threshold /
              assumptions.income_limits.income_limit_for_personal_allowance.rate) *
            assumptions.income_tax_rate_thresholds.basic_rate.rate;
        } else {
          limit_on_personal_allowance =
            ((total_taxable_income -
              assumptions.income_limits.income_limit_for_personal_allowance.threshold) /
              assumptions.income_limits.income_limit_for_personal_allowance.rate) *
            assumptions.income_tax_rate_thresholds.basic_rate.rate;
        }
      }

      limit_on_personal_allowance = Math.abs(limit_on_personal_allowance) * -1;

      let nic_class_2_charge = 0;

      if (
        remainingYearObject.household_income.self_employment_income.details[index].amount >
        assumptions.self_employment_nic_class_2_threshold.small_profit_rate.threshold
      ) {
        nic_class_2_charge = assumptions.self_employment_nic_class_2_threshold.small_profit_rate.rate;
      } else {
        nic_class_2_charge = 0;
      }
      nic_class_2_charge *= -1;

      let nic_class_4_charge = 0;

      if (
        remainingYearObject.household_income.self_employment_income.details[index].amount <
        assumptions.self_employment_nic_class_4_threshold.lower_profits_limit.threshold
      ) {
        nic_class_4_charge = 0;
      } else if (
        remainingYearObject.household_income.self_employment_income.details[index].amount <
        assumptions.self_employment_nic_class_4_threshold.upper_earnings_limit.threshold
      ) {
        nic_class_4_charge =
          (remainingYearObject.household_income.self_employment_income.details[index].amount -
            assumptions.self_employment_nic_class_4_threshold.lower_profits_limit.threshold) *
          assumptions.self_employment_nic_class_4_threshold.lower_profits_limit.rate;
      } else {
        nic_class_4_charge =
          (assumptions.self_employment_nic_class_4_threshold.upper_earnings_limit.threshold -
            assumptions.self_employment_nic_class_4_threshold.lower_profits_limit.threshold) *
            assumptions.self_employment_nic_class_4_threshold.lower_profits_limit.rate +
          (remainingYearObject.household_income.self_employment_income.details[index].amount -
            assumptions.self_employment_nic_class_4_threshold.upper_earnings_limit.threshold) *
            assumptions.self_employment_nic_class_4_threshold.upper_earnings_limit.rate;
      }

      nic_class_4_charge *= -1;

      const tax_credit_received_through_pension =
        pension_plan * assumptions.income_tax_rate_thresholds.basic_rate.rate;

      const capital_gains = {
        total_gain_form_property_sale: 0,
        total_gain_from_other_assets: 0,
        annual_exemption_amount_property: 0,
        annual_exemption_amount_other_assets: 0,
        taxable_gains_from_property_sale: 0,
        taxable_gains_from_other_assets: 0,
      };

      let propertyTotal = 0;
      inputs.assets.properties.map((p, index2) => {
        if (i === p.end_year) {
          if (p.type_of_property !== "Main Home") {
            propertyTotal += lastYearObject.assets.properties[index2].amount - p.original_price;
          }
        }
      });

      capital_gains.total_gain_form_property_sale = propertyTotal * 0.5;

      capital_gains.annual_exemption_amount_property = Math.max(
        -assumptions.income_limits_2.capital_gains_tax_annual_exempt_amount.threshold,
        -capital_gains.total_gain_form_property_sale
      );

      capital_gains.taxable_gains_from_property_sale =
        capital_gains.total_gain_form_property_sale + capital_gains.annual_exemption_amount_property;

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
            assumptions.residential_property_captical_gains_tax_rate_thresholds.higher_and_additional_rate
              .rate;
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
                (assumptions.residential_property_captical_gains_tax_rate_thresholds
                  .higher_and_additional_rate.threshold -
                  assumptions.residential_property_captical_gains_tax_rate_thresholds.basic_rate.threshold) *
                  assumptions.residential_property_captical_gains_tax_rate_thresholds.basic_rate.rate +
                (total_taxable_income +
                  capital_gains.taxable_gains_from_property_sale -
                  assumptions.residential_property_captical_gains_tax_rate_thresholds
                    .higher_and_additional_rate.threshold) *
                  assumptions.residential_property_captical_gains_tax_rate_thresholds
                    .higher_and_additional_rate.rate;
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

      const total_gains_from_other_assets = {
        base_cost: 0,
        accumulattive_gain: 0,
        rate_recognised_as_base_cost: 0,
        rate_recognised_as_gain: 0,
        base_cost_drawdown: 0,
        gain_drawdown: 0,
      };

      if (i === inputs.current_year + 1) {
        total_gains_from_other_assets.gain_drawdown = Math.min(
          0 -
            lastYearObject.household_expenses.financials.savings_and_investments.general_investment_accounts
              .details[index].amount,
          lastYearObject.household_income.savings_and_investments_income.general_investment_accounts.details[
            index
          ].amount *
            lastYearObject.household_expenses.additional_tax_charge.details[index]
              .total_gains_from_other_assets.rate_recognised_as_gain -
            lastYearObject.auto_liquidation.general_investment_accounts.details[index].amount *
              lastYearObject.household_expenses.additional_tax_charge.details[index]
                .total_gains_from_other_assets.rate_recognised_as_gain
        );
      } else {
        total_gains_from_other_assets.gain_drawdown = Math.min(
          secondLastYearObject.household_expenses.additional_tax_charge.details[index]
            .total_gains_from_other_assets.accumulattive_gain -
            lastYearObject.household_expenses.financials.savings_and_investments.general_investment_accounts
              .details[index].amount,
          lastYearObject.household_income.savings_and_investments_income.general_investment_accounts.details[
            index
          ].amount *
            lastYearObject.household_expenses.additional_tax_charge.details[index]
              .total_gains_from_other_assets.rate_recognised_as_gain -
            lastYearObject.auto_liquidation.general_investment_accounts.details[index].amount *
              lastYearObject.household_expenses.additional_tax_charge.details[index]
                .total_gains_from_other_assets.rate_recognised_as_gain
        );
      }

      capital_gains.total_gain_from_other_assets = total_gains_from_other_assets.gain_drawdown;

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

      capital_gains.taxable_gains_from_other_assets =
        capital_gains.total_gain_from_other_assets + capital_gains.annual_exemption_amount_other_assets;

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
                assumptions.other_assets_capital_gains_tax_rate_thresholds.higher_and_additional_rate
                  .threshold
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
                    assumptions.other_assets_capital_gains_tax_rate_thresholds.higher_and_additional_rate
                      .rate;
              }
            } else {
              if (
                total_taxable_income + capital_gains.taxable_gains_from_other_assets <
                assumptions.other_assets_capital_gains_tax_rate_thresholds.higher_and_additional_rate
                  .threshold
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
                    assumptions.other_assets_capital_gains_tax_rate_thresholds.higher_and_additional_rate
                      .rate;
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
                assumptions.other_assets_capital_gains_tax_rate_thresholds.higher_and_additional_rate
                  .threshold
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
                    assumptions.other_assets_capital_gains_tax_rate_thresholds.higher_and_additional_rate
                      .rate;
              }
            } else {
              if (
                total_taxable_income +
                  capital_gains.taxable_gains_from_property_sale +
                  capital_gains.taxable_gains_from_other_assets <
                assumptions.other_assets_capital_gains_tax_rate_thresholds.higher_and_additional_rate
                  .threshold
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
                    assumptions.other_assets_capital_gains_tax_rate_thresholds.higher_and_additional_rate
                      .rate;
              }
            }
          }
        }
      }

      capital_gains_tax_other_assets *= -1;

      let tax_deducted_at_source =
        remainingYearObject.household_income.employment_income.details[index].income_tax_charge;

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
        capital_gains_tax_residential_property +
        capital_gains_tax_other_assets +
        tax_deducted_at_source;

      const pension_annual_allowance_tapering_analysis = {
        threshold_income: Math.abs(total_taxable_income),
        exceeds_tapering_threshold:
          total_taxable_income >
          assumptions.pension_contribution_allowance_tapering.threshold_income.threshold,
        adjusted_income:
          total_taxable_income +
          remainingYearObject.household_income.employer_pension_contribution.details[index].amount,
        exceeds_tapering_threshold_2:
          total_taxable_income +
            remainingYearObject.household_income.employer_pension_contribution.details[index].amount >
          assumptions.pension_contribution_allowance_tapering.lifetime_allowance.threshold,
        pension_contribution_annual_allowance: 0,
        total_gross_pension_contribution: 0,
      };

      if (!pension_annual_allowance_tapering_analysis.exceeds_tapering_threshold) {
        pension_annual_allowance_tapering_analysis.pension_contribution_annual_allowance =
          (assumptions.pension_contribution_allowance.contribution_annual_allowance.allowance *
            (1 + assumptions.pension_contribution_allowance.contribution_annual_allowance.rate)) **
          (i - inputs.current_year);
      } else {
        if (!pension_annual_allowance_tapering_analysis.exceeds_tapering_threshold_2) {
          pension_annual_allowance_tapering_analysis.pension_contribution_annual_allowance =
            assumptions.pension_contribution_allowance.contribution_annual_allowance.allowance;
        } else {
          pension_annual_allowance_tapering_analysis.pension_contribution_annual_allowance = Math.max(
            (assumptions.pension_contribution_allowance.contribution_annual_allowance.allowance *
              (1 + assumptions.pension_contribution_allowance.contribution_annual_allowance.rate)) **
              (i - inputs.current_year) -
              (pension_annual_allowance_tapering_analysis.adjusted_income -
                assumptions.pension_contribution_allowance_tapering.threshold_income.threshold) *
                assumptions.pension_contribution_allowance_tapering.lifetime_allowance.rate,
            (assumptions.pension_contribution_allowance.contribution_annual_allowance_floor.allowance *
              (1 + assumptions.pension_contribution_allowance.contribution_annual_allowance_floor.rate)) **
              (i - inputs.current_year)
          );
        }
      }
      pension_annual_allowance_tapering_analysis.total_gross_pension_contribution =
        -member_pension_contribution -
        pension_plan +
        remainingYearObject.household_income.employer_pension_contribution.details[index].amount;

      remainingYearObject.household_expenses.additional_tax_charge.details.push({
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
        capital_gains,
        pension_annual_allowance_tapering_analysis,
        total_gains_from_other_assets,
      });
    });

    inputs.assets.properties.map((property) => {
      const name = property.name;
      let amount = 0;
      if (i === property.start_year) {
        amount = property.sdlt;
      } else {
        amount = 0;
      }
      amount *= -1;
      remainingYearObject.household_expenses.additional_tax_charge.sdlt_charge.details.push({
        name,
        amount,
      });
      remainingYearObject.household_expenses.additional_tax_charge.sdlt_charge.total += amount;
    });

    //set total additional tax charge
    remainingYearObject.household_expenses.additional_tax_charge.details.map((charge) => {
      const amount = charge.additional_tax;
      remainingYearObject.household_expenses.additional_tax_charge.total_additional_tax_charge += amount;
    });

    remainingYearObject.household_expenses.additional_tax_charge.total_additional_tax_charge +=
      remainingYearObject.household_expenses.additional_tax_charge.sdlt_charge.total;

    //set total household expenses
    remainingYearObject.household_expenses.total_household_expenses =
      remainingYearObject.household_expenses.housing.total +
      remainingYearObject.household_expenses.consumables.total +
      remainingYearObject.household_expenses.travel.total +
      remainingYearObject.household_expenses.shopping.total +
      remainingYearObject.household_expenses.entertainment.total +
      remainingYearObject.household_expenses.holiday.total +
      remainingYearObject.household_expenses.one_off_expenses.total +
      remainingYearObject.household_expenses.children_education_expenses.total +
      remainingYearObject.household_expenses.financials.total +
      remainingYearObject.household_expenses.additional_tax_charge.total_additional_tax_charge;

    //set annual cash inflow
    remainingYearObject.annual_cash_inflow_outflow =
      remainingYearObject.household_income.total +
      remainingYearObject.household_expenses.total_household_expenses;

    remainingYearObject.creditors.credit_card_requirement_analysis.total_cash_inflow_outflow =
      remainingYearObject.annual_cash_inflow_outflow;

    remainingYearObject.creditors.credit_card_requirement_analysis.cash_available =
      remainingYearObject.creditors.credit_card_requirement_analysis.excess_cash_at_start_of_year +
      remainingYearObject.creditors.credit_card_requirement_analysis.total_cash_inflow_outflow;

    remainingYearObject.auto_liquidation.shortfall = -Math.min(
      0,
      remainingYearObject.annual_cash_inflow_outflow
    );

    if (remainingYearObject.creditors.credit_card_requirement_analysis.excess_cash_at_start_of_year < 0) {
      remainingYearObject.auto_liquidation.aggregated_bank_Accounts = 0;
    } else {
      remainingYearObject.auto_liquidation.aggregated_bank_Accounts = -Math.min(
        remainingYearObject.auto_liquidation.shortfall,
        remainingYearObject.creditors.credit_card_requirement_analysis.excess_cash_at_start_of_year
      );
    }

    if (inputs.household_owners.length === 1) {
      const name = inputs.assets.savings_and_investments.individual_savings_account[0].name;
      let amount = 0;
      if (
        remainingYearObject.auto_liquidation.shortfall +
          remainingYearObject.auto_liquidation.aggregated_bank_Accounts >
        0
      ) {
        amount = Math.min(
          lastYearObject.assets.savings_and_investments.individual_savings_accounts.details[0].amount *
            (1 + inputs.assets.savings_and_investments.individual_savings_account[0].growth_rate) -
            remainingYearObject.household_expenses.financials.savings_and_investments
              .individual_savings_accounts.details[0].amount -
            remainingYearObject.household_income.savings_and_investments_income.individual_savings_accounts
              .details[0].amount,
          remainingYearObject.auto_liquidation.shortfall +
            remainingYearObject.auto_liquidation.aggregated_bank_Accounts
        );
      }
      amount *= -1;

      remainingYearObject.auto_liquidation.individual_savings_accounts.details.push({ amount, name });
    } else {
      const name = inputs.assets.savings_and_investments.individual_savings_account[0].name;
      let amount1 = 0;

      const name2 = inputs.assets.savings_and_investments.individual_savings_account[1].name;
      let amount2 = 0;
      if (
        remainingYearObject.auto_liquidation.shortfall +
          remainingYearObject.auto_liquidation.aggregated_bank_Accounts >
        0
      ) {
        amount1 = Math.min(
          lastYearObject.assets.savings_and_investments.individual_savings_accounts.details[0].amount *
            (1 + inputs.assets.savings_and_investments.individual_savings_account[0].growth_rate) -
            remainingYearObject.household_expenses.financials.savings_and_investments
              .individual_savings_accounts.details[0].amount -
            remainingYearObject.household_income.savings_and_investments_income.individual_savings_accounts
              .details[0].amount,
          remainingYearObject.auto_liquidation.shortfall +
            remainingYearObject.auto_liquidation.aggregated_bank_Accounts
        );
      }
      amount1 *= -1;

      remainingYearObject.auto_liquidation.individual_savings_accounts.details.push({
        amount: amount1,
        name,
      });
      remainingYearObject.auto_liquidation.individual_savings_accounts.details.push({
        amount: amount2,
        name: name2,
      });
      if (
        remainingYearObject.auto_liquidation.shortfall +
          remainingYearObject.auto_liquidation.aggregated_bank_Accounts +
          remainingYearObject.auto_liquidation.individual_savings_accounts.details[0].amount >
        0
      ) {
        remainingYearObject.auto_liquidation.individual_savings_accounts.details[1].name =
          inputs.assets.savings_and_investments.individual_savings_account[1].name;
        remainingYearObject.auto_liquidation.individual_savings_accounts.details[1].amount = Math.min(
          lastYearObject.assets.savings_and_investments.individual_savings_accounts.details[1].amount *
            (1 + inputs.assets.savings_and_investments.individual_savings_account[1].growth_rate) -
            remainingYearObject.household_expenses.financials.savings_and_investments
              .individual_savings_accounts.details[1].amount -
            remainingYearObject.household_income.savings_and_investments_income.individual_savings_accounts
              .details[1].amount,
          remainingYearObject.auto_liquidation.shortfall +
            remainingYearObject.auto_liquidation.aggregated_bank_Accounts +
            remainingYearObject.auto_liquidation.individual_savings_accounts.details[0].amount +
            remainingYearObject.auto_liquidation.individual_savings_accounts.details[0].amount
        );
        remainingYearObject.auto_liquidation.individual_savings_accounts.details[1].amount *= -1;
      }
      amount2 *= -1;
    }

    if (inputs.household_owners.length === 1) {
      const name = "Pension Plan - " + inputs.household_owners[0].name;
      let amount = 0;
      if (i > inputs.household_owners[0].retirement_year) {
        if (
          remainingYearObject.auto_liquidation.shortfall +
            remainingYearObject.auto_liquidation.aggregated_bank_Accounts +
            remainingYearObject.auto_liquidation.individual_savings_accounts.details.reduce(
              (a, b) => a + b.amount,
              0
            ) >
          0
        ) {
          //val1
          let val1 = 0;
          if (
            inputs.household_income.pension_income.defined_contribution_pension_plans[0].option_taken ===
            "Drawdown"
          ) {
            if (i > inputs.household_owners[0].retirement_year) {
              val1 =
                lastYearObject.assets.personal_pension_plans.details[0].amount *
                  (1 + inputs.assets.non_employment_defined_contribution_pension_plans[0].growth_rate) -
                remainingYearObject.household_income.pension_income.defined_contribution_pension_income
                  .details[0].regular_drawdown_option;
            } else {
              val1 =
                lastYearObject.assets.personal_pension_plans.details[0].amount *
                  (1 + inputs.assets.non_employment_defined_contribution_pension_plans[0].growth_rate) +
                remainingYearObject.household_income.employer_pension_contribution.details[0].amount -
                remainingYearObject.household_income.employment_income.details[0]
                  .members_pension_contribution -
                remainingYearObject.household_expenses.financials.pension_pot.details[0].amount -
                remainingYearObject.household_expenses.additional_tax_charge.details[0]
                  .tax_credit_received_through_pension;
            }
          } else {
            if (i > inputs.household_owners[0].retirement_year) {
              val1 = 0;
            } else {
              val1 =
                lastYearObject.assets.personal_pension_plans.details[0].amount *
                  (1 + inputs.assets.non_employment_defined_contribution_pension_plans[0].growth_rate) +
                remainingYearObject.household_income.employer_pension_contribution.details[0].amount -
                remainingYearObject.household_income.employment_income.details[0]
                  .members_pension_contribution -
                remainingYearObject.household_expenses.financials.pension_pot.details[0].amount -
                remainingYearObject.household_expenses.additional_tax_charge.details[0]
                  .tax_credit_received_through_pension;
            }
          }

          //val2
          let val2 =
            remainingYearObject.auto_liquidation.shortfall +
            remainingYearObject.auto_liquidation.aggregated_bank_Accounts +
            remainingYearObject.auto_liquidation.individual_savings_accounts.details.reduce(
              (a, b) => a + b.amount,
              0
            );

          amount = Math.min(val1, val2);

          amount *= -1;

          remainingYearObject.auto_liquidation.pension_plans.details.push({ amount, name });
        }
      }
    } else {
      const name2 = "Pension Plan - " + inputs.household_owners[0].name;
      let amount2 = 0;

      if (i > inputs.household_owners[0].retirement_year) {
        if (
          remainingYearObject.auto_liquidation.shortfall +
            remainingYearObject.auto_liquidation.aggregated_bank_Accounts +
            remainingYearObject.auto_liquidation.individual_savings_accounts.details.reduce(
              (a, b) => a + b.amount,
              0
            ) >
          0
        ) {
          //val1
          let val1 = 0;
          if (
            inputs.household_income.pension_income.defined_contribution_pension_plans[0].option_taken ===
            "Drawdown"
          ) {
            if (i > inputs.household_owners[0].retirement_year) {
              val1 =
                lastYearObject.assets.personal_pension_plans.details[0].amount *
                  (1 + inputs.assets.non_employment_defined_contribution_pension_plans[0].growth_rate) -
                remainingYearObject.household_income.pension_income.defined_contribution_pension_income
                  .details[0].regular_drawdown_option;
            } else {
              val1 =
                lastYearObject.assets.personal_pension_plans.details[0].amount *
                  (1 + inputs.assets.non_employment_defined_contribution_pension_plans[0].growth_rate) +
                remainingYearObject.household_income.employer_pension_contribution.details[0].amount -
                remainingYearObject.household_income.employment_income.details[0]
                  .members_pension_contribution -
                remainingYearObject.household_expenses.financials.pension_pot.details[0].amount -
                remainingYearObject.household_expenses.additional_tax_charge.details[0]
                  .tax_credit_received_through_pension;
            }
          } else {
            if (i > inputs.household_owners[0].retirement_year) {
              val1 = 0;
            } else {
              val1 =
                lastYearObject.assets.personal_pension_plans.details[0].amount *
                  (1 + inputs.assets.non_employment_defined_contribution_pension_plans[0].growth_rate) +
                remainingYearObject.household_income.employer_pension_contribution.details[0].amount -
                remainingYearObject.household_income.employment_income.details[0]
                  .members_pension_contribution -
                remainingYearObject.household_expenses.financials.pension_pot.details[0].amount -
                remainingYearObject.household_expenses.additional_tax_charge.details[0]
                  .tax_credit_received_through_pension;
            }
          }

          //val2
          let val2 =
            remainingYearObject.auto_liquidation.shortfall +
            remainingYearObject.auto_liquidation.aggregated_bank_Accounts +
            remainingYearObject.auto_liquidation.individual_savings_accounts.details.reduce(
              (a, b) => a + b.amount,
              0
            );

          amount2 = Math.min(val1, val2);
        }
      }
      amount2 *= -1;

      remainingYearObject.auto_liquidation.pension_plans.details.push({ amount: amount2, name: name2 });

      const name3 = "Pension Plan - " + inputs.household_owners[1].name;
      let amount3 = 0;
      if (i > inputs.household_owners[1].retirement_year) {
        if (
          remainingYearObject.auto_liquidation.shortfall +
            remainingYearObject.auto_liquidation.aggregated_bank_Accounts +
            remainingYearObject.auto_liquidation.individual_savings_accounts.details.reduce(
              (a, b) => a + b.amount,
              0
            ) +
            remainingYearObject.auto_liquidation.pension_plans.details[0].amount >
          0
        ) {
          //val1
          let val1 = 0;
          if (
            inputs.household_income.pension_income.defined_contribution_pension_plans[1].option_taken ===
            "Drawdown"
          ) {
            if (i > inputs.household_owners[1].retirement_year) {
              val1 =
                lastYearObject.assets.personal_pension_plans.details[1].amount *
                  (1 + inputs.assets.non_employment_defined_contribution_pension_plans[1].growth_rate) -
                remainingYearObject.household_income.pension_income.defined_contribution_pension_income
                  .details[1].regular_drawdown_option;
            } else {
              val1 =
                lastYearObject.assets.personal_pension_plans.details[1].amount *
                  (1 + inputs.assets.non_employment_defined_contribution_pension_plans[1].growth_rate) +
                remainingYearObject.household_income.employer_pension_contribution.details[1].amount -
                remainingYearObject.household_income.employment_income.details[1]
                  .members_pension_contribution -
                remainingYearObject.household_expenses.financials.pension_pot.details[1].amount -
                remainingYearObject.household_expenses.additional_tax_charge.details[1]
                  .tax_credit_received_through_pension;
            }
          } else {
            if (i > inputs.household_owners[1].retirement_year) {
              val1 = 0;
            } else {
              val1 =
                lastYearObject.assets.personal_pension_plans.details[1].amount *
                  (1 + inputs.assets.non_employment_defined_contribution_pension_plans[1].growth_rate) +
                remainingYearObject.household_income.employer_pension_contribution.details[1].amount -
                remainingYearObject.household_income.employment_income.details[1]
                  .members_pension_contribution -
                remainingYearObject.household_expenses.financials.pension_pot.details[1].amount -
                remainingYearObject.household_expenses.additional_tax_charge.details[1]
                  .tax_credit_received_through_pension;
            }
          }

          //val2
          let val2 =
            remainingYearObject.auto_liquidation.shortfall +
            remainingYearObject.auto_liquidation.aggregated_bank_Accounts +
            remainingYearObject.auto_liquidation.individual_savings_accounts.details.reduce(
              (a, b) => a + b.amount,
              0
            ) +
            +remainingYearObject.auto_liquidation.pension_plans.details[0].amount;

          amount3 = Math.min(val1, val2);
        }
      }

      amount3 *= -1;
      remainingYearObject.auto_liquidation.pension_plans.details.push({ amount: amount3, name: name3 });
    }

    if (inputs.household_owners.length === 1) {
      const name = inputs.assets.savings_and_investments.general_investment_account[0].name;
      let amount = 0;
      if (
        remainingYearObject.auto_liquidation.shortfall +
          remainingYearObject.auto_liquidation.aggregated_bank_Accounts +
          remainingYearObject.auto_liquidation.individual_savings_accounts.details.reduce(
            (a, b) => a + b.amount,
            0
          ) +
          remainingYearObject.auto_liquidation.pension_plans.details.reduce((a, b) => a + b.amount, 0) >
        0
      ) {
        amount = Math.min(
          lastYearObject.assets.savings_and_investments.general_investment_accounts.details[0].amount *
            (1 + inputs.assets.savings_and_investments.general_investment_account[0].growth_rate) -
            remainingYearObject.household_expenses.financials.savings_and_investments
              .general_investment_accounts.details[0].amount -
            remainingYearObject.household_income.savings_and_investments_income.general_investment_accounts
              .details[0].amount,
          remainingYearObject.auto_liquidation.shortfall +
            remainingYearObject.auto_liquidation.aggregated_bank_Accounts +
            remainingYearObject.auto_liquidation.individual_savings_accounts.details.reduce(
              (a, b) => a + b.amount,
              0
            ) +
            remainingYearObject.auto_liquidation.pension_plans.details.reduce((a, b) => a + b.amount, 0)
        );
      }

      amount *= -1;
      remainingYearObject.auto_liquidation.general_investment_accounts.details.push({ amount, name });
    } else {
      const name = inputs.assets.savings_and_investments.general_investment_account[0].name;
      let amount1 = 0;

      const name2 = inputs.assets.savings_and_investments.general_investment_account[1].name;
      let amount2 = 0;
      if (
        remainingYearObject.auto_liquidation.shortfall +
          remainingYearObject.auto_liquidation.aggregated_bank_Accounts +
          remainingYearObject.auto_liquidation.individual_savings_accounts.details.reduce(
            (a, b) => a + b.amount,
            0
          ) +
          remainingYearObject.auto_liquidation.pension_plans.details.reduce((a, b) => a + b.amount, 0) >
        0
      ) {
        amount1 = Math.min(
          lastYearObject.assets.savings_and_investments.general_investment_accounts.details[0].amount *
            (1 + inputs.assets.savings_and_investments.general_investment_account[0].growth_rate) -
            remainingYearObject.household_expenses.financials.savings_and_investments
              .general_investment_accounts.details[0].amount -
            remainingYearObject.household_income.savings_and_investments_income.general_investment_accounts
              .details[0].amount,
          remainingYearObject.auto_liquidation.shortfall +
            remainingYearObject.auto_liquidation.aggregated_bank_Accounts
        );
      }
      amount1 *= -1;

      remainingYearObject.auto_liquidation.general_investment_accounts.details.push({
        amount: amount1,
        name,
      });
      remainingYearObject.auto_liquidation.general_investment_accounts.details.push({
        amount: amount2,
        name: name2,
      });
      if (
        remainingYearObject.auto_liquidation.shortfall +
          remainingYearObject.auto_liquidation.aggregated_bank_Accounts +
          remainingYearObject.auto_liquidation.general_investment_accounts.details[0].amount +
          remainingYearObject.auto_liquidation.individual_savings_accounts.details.reduce(
            (a, b) => a + b.amount,
            0
          ) +
          remainingYearObject.auto_liquidation.pension_plans.details.reduce((a, b) => a + b.amount, 0) >
        0
      ) {
        remainingYearObject.auto_liquidation.general_investment_accounts.details[1].name =
          inputs.assets.savings_and_investments.general_investment_account[1].name;
        remainingYearObject.auto_liquidation.general_investment_accounts.details[1].amount = Math.min(
          lastYearObject.assets.savings_and_investments.general_investment_accounts.details[1].amount *
            (1 + inputs.assets.savings_and_investments.general_investment_account[1].growth_rate) -
            remainingYearObject.household_expenses.financials.savings_and_investments
              .general_investment_accounts.details[1].amount -
            remainingYearObject.household_income.savings_and_investments_income.general_investment_accounts
              .details[1].amount,
          remainingYearObject.auto_liquidation.shortfall +
            remainingYearObject.auto_liquidation.aggregated_bank_Accounts +
            remainingYearObject.auto_liquidation.general_investment_accounts.details[0].amount +
            remainingYearObject.auto_liquidation.general_investment_accounts.details[0].amount +
            remainingYearObject.auto_liquidation.individual_savings_accounts.details.reduce(
              (a, b) => a + b.amount,
              0
            ) +
            remainingYearObject.auto_liquidation.pension_plans.details.reduce((a, b) => a + b.amount, 0)
        );
      }
      amount2 *= -1;
    }

    remainingYearObject.auto_liquidation.credit_card_borrowing =
      remainingYearObject.auto_liquidation.shortfall +
      remainingYearObject.auto_liquidation.aggregated_bank_Accounts +
      remainingYearObject.auto_liquidation.individual_savings_accounts.details.reduce(
        (a, b) => a + b.amount,
        0
      ) +
      +remainingYearObject.auto_liquidation.general_investment_accounts.details.reduce(
        (a, b) => a + b.amount,
        0
      ) +
      remainingYearObject.auto_liquidation.pension_plans.details.reduce((a, b) => a + b.amount, 0);

    remainingYearObject.creditors.credit_cards.change_in_year = 0;

    if (remainingYearObject.creditors.credit_card_requirement_analysis.cash_available < 0) {
      remainingYearObject.creditors.credit_cards.change_in_year =
        remainingYearObject.auto_liquidation.credit_card_borrowing;
    } else {
      remainingYearObject.creditors.credit_cards.change_in_year = Math.min(
        remainingYearObject.creditors.credit_card_requirement_analysis.cash_available,
        -remainingYearObject.creditors.credit_cards.beginning_of_period
      );
    }
    remainingYearObject.creditors.credit_cards.name = inputs.liabilities.credit_card.name;

    remainingYearObject.creditors.credit_cards.end_of_period =
      remainingYearObject.creditors.credit_cards.beginning_of_period +
      remainingYearObject.creditors.credit_cards.change_in_year;

    inputs.assets.savings_and_investments.individual_savings_account.map((sai, index) => {
      console.log(
        i + ": " + remainingYearObject.auto_liquidation.individual_savings_accounts.details[index].amount
      );

      const name = sai.name;
      const amount =
        lastYearObject.assets.savings_and_investments.individual_savings_accounts.details[index].amount *
          (1 + sai.growth_rate) -
        remainingYearObject.household_expenses.financials.savings_and_investments.individual_savings_accounts
          .details[index].amount -
        remainingYearObject.household_income.savings_and_investments_income.individual_savings_accounts
          .details[index].amount +
        remainingYearObject.auto_liquidation.individual_savings_accounts.details[index].amount;

      remainingYearObject.assets.savings_and_investments.individual_savings_accounts.details.push({
        name,
        amount,
      });

      remainingYearObject.assets.savings_and_investments.total += amount;
    });

    inputs.assets.savings_and_investments.general_investment_account.map((sai, index) => {
      const name = sai.name;
      const amount =
        lastYearObject.assets.savings_and_investments.general_investment_accounts.details[index].amount *
          (1 + sai.growth_rate) -
        remainingYearObject.household_expenses.financials.savings_and_investments.general_investment_accounts
          .details[index].amount -
        remainingYearObject.household_income.savings_and_investments_income.general_investment_accounts
          .details[index].amount +
        remainingYearObject.auto_liquidation.general_investment_accounts.details[index].amount;

      remainingYearObject.assets.savings_and_investments.general_investment_accounts.details.push({
        name,
        amount,
      });

      remainingYearObject.assets.savings_and_investments.total += amount;
    });

    remainingYearObject.assets.bank_account.name = "Aggregated Bank Accounts";
    remainingYearObject.assets.bank_account.amount =
      lastYearObject.assets.bank_account.amount * (1 + inputs.assets.bank_accounts.growth_rate) -
      remainingYearObject.creditors.credit_cards.change_in_year +
      remainingYearObject.annual_cash_inflow_outflow -
      (remainingYearObject.auto_liquidation.individual_savings_accounts.details.reduce(
        (a, b) => a + b.amount,
        0
      ) +
        remainingYearObject.auto_liquidation.pension_plans.details.reduce((a, b) => a + b.amount, 0) +
        remainingYearObject.auto_liquidation.general_investment_accounts.details.reduce(
          (a, b) => a + b.amount,
          0
        ));

    //set assets -> personal pension plans
    inputs.assets.non_employment_defined_contribution_pension_plans.map((dcpp, index) => {
      const name = dcpp.name;
      let amount = 0;

      if (
        inputs.household_income.pension_income.defined_contribution_pension_plans[index].option_taken ===
        "Drawdown"
      ) {
        if (i > inputs.household_owners[index].retirement_year) {
          amount =
            lastYearObject.assets.personal_pension_plans.details[index].amount * (1 + dcpp.growth_rate) -
            remainingYearObject.household_income.pension_income.defined_contribution_pension_income.details[
              index
            ].regular_drawdown_option;
        } else {
          amount =
            lastYearObject.assets.personal_pension_plans.details[index].amount * (1 + dcpp.growth_rate) +
            remainingYearObject.household_income.employer_pension_contribution.details[index].amount -
            remainingYearObject.household_income.employment_income.details[index]
              .members_pension_contribution -
            remainingYearObject.household_expenses.financials.pension_pot.details[index].amount -
            remainingYearObject.household_expenses.additional_tax_charge.details[index]
              .tax_credit_received_through_pension;
        }
      } else {
        if (i > inputs.household_owners[index].retirement_year) {
          amount = 0;
        } else {
          amount =
            lastYearObject.assets.personal_pension_plans.details[index].amount * (1 + dcpp.growth_rate) +
            remainingYearObject.household_income.employer_pension_contribution.details[index].amount -
            remainingYearObject.household_income.employment_income.details[index]
              .members_pension_contribution -
            remainingYearObject.household_expenses.financials.pension_pot.details[index].amount -
            remainingYearObject.household_expenses.additional_tax_charge.details[index]
              .tax_credit_received_through_pension;
        }
      }

      amount += remainingYearObject.auto_liquidation.pension_plans.details[index].amount;
      remainingYearObject.assets.personal_pension_plans.details.push({ name, amount });
      remainingYearObject.assets.personal_pension_plans.total += amount;
    });

    remainingYearObject.household_expenses.additional_tax_charge.details.map((atc, index) => {
      atc.total_gains_from_other_assets.rate_recognised_as_base_cost = 0;
      atc.total_gains_from_other_assets.rate_recognised_as_gain = 0;

      if (
        lastYearObject.household_expenses.additional_tax_charge.details[index].total_gains_from_other_assets
          .base_cost < 1
      ) {
        atc.total_gains_from_other_assets.rate_recognised_as_base_cost = 0;
      } else {
        atc.total_gains_from_other_assets.rate_recognised_as_base_cost =
          lastYearObject.household_expenses.additional_tax_charge.details[index].total_gains_from_other_assets
            .base_cost /
          (lastYearObject.household_expenses.additional_tax_charge.details[index]
            .total_gains_from_other_assets.base_cost +
            lastYearObject.household_expenses.additional_tax_charge.details[index]
              .total_gains_from_other_assets.accumulattive_gain);
      }

      if (
        lastYearObject.household_expenses.additional_tax_charge.details[index].total_gains_from_other_assets
          .accumulattive_gain === 0
      ) {
        atc.total_gains_from_other_assets.rate_recognised_as_gain = 0;
      } else {
        atc.total_gains_from_other_assets.rate_recognised_as_gain =
          lastYearObject.household_expenses.additional_tax_charge.details[index].total_gains_from_other_assets
            .accumulattive_gain /
          (lastYearObject.household_expenses.additional_tax_charge.details[index]
            .total_gains_from_other_assets.base_cost +
            lastYearObject.household_expenses.additional_tax_charge.details[index]
              .total_gains_from_other_assets.accumulattive_gain);

        if (
          lastYearObject.household_expenses.additional_tax_charge.details[index].total_gains_from_other_assets
            .accumulattive_gain < 1
        ) {
          atc.total_gains_from_other_assets.rate_recognised_as_gain = 1;
        }
      }
    });

    //set total gains from other assets -> base cost
    remainingYearObject.household_expenses.additional_tax_charge.details.map((atc, index) => {
      let tv1 =
        lastYearObject.household_expenses.additional_tax_charge.details[index].total_gains_from_other_assets
          .base_cost -
        remainingYearObject.household_expenses.financials.savings_and_investments.general_investment_accounts
          .details[index].amount;
      let tv2 =
        remainingYearObject.household_income.savings_and_investments_income.general_investment_accounts
          .details[index].amount *
          atc.total_gains_from_other_assets.rate_recognised_as_base_cost -
        remainingYearObject.auto_liquidation.general_investment_accounts.details[index].amount *
          atc.total_gains_from_other_assets.rate_recognised_as_base_cost;
      atc.total_gains_from_other_assets.base_cost_drawdown = Math.min(tv1, tv2);

      let tempval1 =
        yearsArray.reduce(
          (a, b) =>
            a +
            b.household_expenses.financials.savings_and_investments.general_investment_accounts.details[index]
              .amount,
          0
        ) +
        remainingYearObject.household_expenses.financials.savings_and_investments.general_investment_accounts
          .details[index].amount;

      let tempval2 =
        yearsArray.reduce(
          (a, b) =>
            a +
            b.household_expenses.additional_tax_charge.details[index].total_gains_from_other_assets
              .base_cost_drawdown,
          0
        ) + atc.total_gains_from_other_assets.base_cost_drawdown;
      let tempval3 =
        yearsArray.reduce(
          (a, b) => a + b.auto_liquidation.general_investment_accounts.details[index].amount,
          0
        ) + remainingYearObject.auto_liquidation.general_investment_accounts.details[index].amount;

      let val1 = 0;
      let val2 =
        inputs.assets.savings_and_investments.general_investment_account[index].original_balance -
        tempval1 -
        tempval2 +
        tempval3;

      atc.total_gains_from_other_assets.base_cost = Math.max(val1, val2);

      atc.total_gains_from_other_assets.accumulattive_gain = 0;
      if (atc.total_gains_from_other_assets.base_cost === 0) {
        atc.total_gains_from_other_assets.accumulattive_gain =
          remainingYearObject.assets.savings_and_investments.general_investment_accounts.details[
            index
          ].amount;
      } else {
        atc.total_gains_from_other_assets.accumulattive_gain =
          remainingYearObject.assets.savings_and_investments.general_investment_accounts.details[index]
            .amount - atc.total_gains_from_other_assets.base_cost;
      }
    });

    yearsArray.push(remainingYearObject);
  }
};

export default setRemainingForecastYears;
