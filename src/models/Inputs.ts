import { DateTime } from "luxon";
import { Schema, model } from "mongoose";
import IInputs from "../interfaces/IInputs";

const inputsSchema = new Schema(
  {
    client_id: {
      type: String,
      required: true,
    },
    input_set_name: {
      type: String,
      required: true,
      unique: true,
    },
    current_year: {
      type: Number,
      required: true,
    },
    household_owners: [
      {
        name: {
          type: String,
          required: true,
        },
        birth_year: {
          type: Number,
          required: true,
        },
        current_age: {
          type: Number,
          required: true,
        },
        retirement_age: {
          type: Number,
          required: true,
        },
        retirement_year: {
          type: Number,
          required: true,
        },
        end_of_forecast_age: {
          type: Number,
          required: true,
        },
        end_of_forecast_year: {
          type: Number,
          required: true,
        },
      },
    ],
    children: [
      {
        name: {
          type: String,
          required: true,
        },
        birth_year: {
          type: Number,
          required: true,
        },
        primary_school_age: {
          type: Number,
          required: true,
        },
        primary_school_year: {
          type: Number,
          required: true,
        },
        secondary_school_age: {
          type: Number,
          required: true,
        },
        secondary_school_year: {
          type: Number,
          required: true,
        },
        university_age: {
          type: Number,
          required: true,
        },
        university_year: {
          type: Number,
          required: true,
        },
        graduation_age: {
          type: Number,
          required: true,
        },
        graduation_year: {
          type: Number,
          required: true,
        },
      },
    ],
    assets: {
      properties: [
        {
          name: {
            type: String,
            required: true,
          },
          original_price: {
            type: Number,
            required: true,
          },
          todays_value: {
            type: Number,
            required: true,
          },
          growth_rate: {
            type: Number,
            required: true,
          },
          start_year: {
            type: Number,
            required: true,
          },
          sell_in_future: {
            type: Boolean,
            required: true,
          },
          end_year: {
            type: Number,
            required: true,
          },
          type_of_property: {
            type: String,
            required: true,
          },
          on_mortgage: {
            type: Boolean,
            default: false,
            required: true,
          },
          mortgage_rate: {
            type: Number,
            required: true,
          },
          deposit: {
            type: Number,
            required: true,
          },
          sdlt: {
            type: Number,
            required: true,
          },
        },
      ],
      bank_accounts: {
        original_balance: {
          type: Number,
          required: true,
        },
        growth_rate: {
          type: Number,
          required: true,
        },
        start_year: {
          type: Number,
          required: true,
        },
        end_year: {
          type: Number,
          required: true,
        },
        minimum_cash_balance_acceptable: {
          type: Number,
          required: true,
        },
      },
      savings_and_investments: {
        individual_savings_account: [
          {
            name: {
              type: String,
              required: true,
            },
            original_balance: {
              type: Number,
              required: true,
            },
            growth_rate: {
              type: Number,
              required: true,
            },
            annual_contribution: {
              type: Number,
              required: true,
            },
            contribution_start_year: {
              type: Number,
              required: true,
            },
            contribution_end_year: {
              type: Number,
              required: true,
            },
          },
        ],
        general_investment_account: [
          {
            name: {
              type: String,
              required: true,
            },
            original_balance: {
              type: Number,
              required: true,
            },
            growth_rate: {
              type: Number,
              required: true,
            },
            annual_contribution: {
              type: Number,
              required: true,
            },
            contribution_start_year: {
              type: Number,
              required: true,
            },
            contribution_end_year: {
              type: Number,
              required: true,
            },
          },
        ],
      },
      non_employment_defined_contribution_pension_plans: [
        {
          name: {
            type: String,
            required: true,
          },
          original_balance: {
            type: Number,
            required: true,
          },
          growth_rate: {
            type: Number,
            required: true,
          },
          annual_contribution: {
            type: Number,
            required: true,
          },
          contribution_start_year: {
            type: Number,
            required: true,
          },
          contribution_end_year: {
            type: Number,
            required: true,
          },
        },
      ],
    },
    liabilities: {
      mortgages: [
        {
          name: {
            type: String,
            required: true,
          },
          original_balance: {
            type: Number,
            required: true,
          },
          interest_rate: {
            type: Number,
            required: true,
          },
          start_year: {
            type: Number,
            required: true,
          },
          start_year_for_model: {
            type: Number,
            required: true,
          },
          mortgage_period: {
            type: Number,
            required: true,
          },
          end_year: {
            type: Number,
            required: true,
          },
          number_of_payments_per_year: {
            type: Number,
            required: true,
          },
          annual_payment: {
            type: Number,
            required: true,
          },
        },
      ],
      other_loans: [
        {
          name: {
            type: String,
            required: true,
          },
          original_balance: {
            type: Number,
            required: true,
          },
          interest_rate: {
            type: Number,
            required: true,
          },
          start_year: {
            type: Number,
            required: true,
          },
          start_year_for_model: {
            type: Number,
            required: true,
          },
          loan_period: {
            type: Number,
            required: true,
          },
          end_year: {
            type: Number,
            required: true,
          },
          number_of_payments_per_year: {
            type: Number,
            required: true,
          },
          annual_payment: {
            type: Number,
            required: true,
          },
        },
      ],
      credit_card: {
        name: {
          type: String,
          required: true,
        },
        original_balance: {
          type: Number,
          required: true,
        },
        interest_rate: {
          type: Number,
          required: true,
        },
      },
    },
    household_income: {
      employment_income: [
        {
          name: {
            type: String,
            required: true,
          },
          gross_anual_amount: {
            type: Number,
            required: true,
          },
          inflation: {
            type: Number,
            required: true,
          },
          start_year: {
            type: Number,
            required: true,
          },
          end_year: {
            type: Number,
            required: true,
          },
          member_contribution: {
            type: Number,
            required: true,
          },
          employer_contribution: {
            type: Number,
            required: true,
          },
        },
      ],
      self_employment_income: [
        {
          name: {
            type: String,
            required: true,
          },
          gross_anual_amount: {
            type: Number,
            required: true,
          },
          inflation: {
            type: Number,
            required: true,
          },
          start_year: {
            type: Number,
            required: true,
          },
          end_year: {
            type: Number,
            required: true,
          },
        },
      ],
      rental_income: {
        joint_annual_rental_income: {
          type: Number,
          required: true,
        },
        details: [
          {
            name: {
              type: String,
              required: true,
            },
            share_of_rental_income: {
              type: Number,
              required: true,
            },
            annual_amount: {
              type: Number,
              required: true,
            },
            inflation: {
              type: Number,
              required: true,
            },
            start_year: {
              type: Number,
              required: true,
            },
            end_year: {
              type: Number,
              required: true,
            },
          },
        ],
      },
      dividend_income: [
        {
          name: {
            type: String,
            required: true,
          },
          anual_amount: {
            type: Number,
            required: true,
          },
          inflation: {
            type: Number,
            required: true,
          },
          start_year: {
            type: Number,
            required: true,
          },
          end_year: {
            type: Number,
            required: true,
          },
        },
      ],
      savings_and_investments_drawdowns: {
        individual_savings_accounts: [
          {
            owner_name: {
              type: String,
              required: true,
            },
            drawdowns: [
              {
                name: {
                  type: String,
                  required: true,
                },
                amount_to_drawn_down: {
                  type: Number,
                  required: true,
                },
                start_year: {
                  type: Number,
                  required: true,
                },
                end_year: {
                  type: Number,
                  required: true,
                },
              },
            ],
          },
        ],
        general_investment_accounts: [
          {
            owner_name: {
              type: String,
              required: true,
            },
            drawdowns: [
              {
                name: {
                  type: String,
                  required: true,
                },
                amount_to_drawn_down: {
                  type: Number,
                  required: true,
                },
                start_year: {
                  type: Number,
                  required: true,
                },
                end_year: {
                  type: Number,
                  required: true,
                },
              },
            ],
          },
        ],
      },
      pension_income: {
        state_pension: [
          {
            name: {
              type: String,
              required: true,
            },
            annual_amount: {
              type: Number,
              required: true,
            },
            inflation: {
              type: Number,
              required: true,
            },
            state_pension_age: {
              type: Number,
              required: true,
            },
            start_year: {
              type: Number,
              required: true,
            },
            end_year: {
              type: Number,
              required: true,
            },
          },
        ],
        defined_benifit_pension_plans: [
          {
            name: {
              type: String,
              required: true,
            },
            option_taken: {
              type: String,
              required: true,
            },
            estimated_lump_sum: {
              type: Number,
              required: true,
            },
            estimated_annual_pension: {
              type: Number,
              required: true,
            },
            annual_increase: {
              type: Number,
              required: true,
            },
            start_year: {
              type: Number,
              required: true,
            },
            end_year: {
              type: Number,
              required: true,
            },
          },
        ],
        defined_contribution_pension_plans: [
          {
            name: {
              type: String,
              required: true,
            },
            option_taken: {
              type: String,
              required: true,
            },
            annuity_option_initial_drawdown: {
              type: Number,
              required: true,
            },
            annuity_option_annual_annuity_rate: {
              type: Number,
              required: true,
            },
            drawdown_option_annual_amount: {
              type: Number,
              required: true,
            },
            start_year: {
              type: Number,
              required: true,
            },
            end_year: {
              type: Number,
              required: true,
            },
          },
        ],
      },
      other_income: {
        other_taxable_income: [
          {
            name: {
              type: String,
              required: true,
            },
            gross_annual_amount: {
              type: Number,
              required: true,
            },
            inflation: {
              type: Number,
              required: true,
            },
            start_year: {
              type: Number,
              required: true,
            },
            end_year: {
              type: Number,
              required: true,
            },
          },
        ],
        other_non_taxable_income: [
          {
            name: {
              type: String,
              required: true,
            },
            gross_annual_amount: {
              type: Number,
              required: true,
            },
            inflation: {
              type: Number,
              required: true,
            },
            start_year: {
              type: Number,
              required: true,
            },
            end_year: {
              type: Number,
              required: true,
            },
          },
        ],
      },
    },
    household_expenses: {
      blanket_inflation_rate: {
        type: Number,
        required: true,
      },
      housing: {
        details: [
          {
            name: {
              type: String,
              required: true,
            },
            annual_expense: {
              type: Number,
              required: true,
            },
            inflation: {
              type: Number,
              required: true,
            },
            start_year: {
              type: Number,
              required: true,
            },
            end_year: {
              type: Number,
              required: true,
            },
            rate_after_retirement: {
              type: Number,
              required: true,
            },
            type: {
              type: String,
              required: true,
            },
          },
        ],
        total: {
          type: Number,
          required: true,
        },
      },
      consumables: {
        details: [
          {
            name: {
              type: String,
              required: true,
            },
            annual_expense: {
              type: Number,
              required: true,
            },
            inflation: {
              type: Number,
              required: true,
            },
            start_year: {
              type: Number,
              required: true,
            },
            end_year: {
              type: Number,
              required: true,
            },
            rate_after_retirement: {
              type: Number,
              required: true,
            },
          },
        ],
        total: {
          type: Number,
          required: true,
        },
      },
      travel: {
        details: [
          {
            name: {
              type: String,
              required: true,
            },
            annual_expense: {
              type: Number,
              required: true,
            },
            inflation: {
              type: Number,
              required: true,
            },
            start_year: {
              type: Number,
              required: true,
            },
            end_year: {
              type: Number,
              required: true,
            },
            rate_after_retirement: {
              type: Number,
              required: true,
            },
          },
        ],
        total: {
          type: Number,
          required: true,
        },
      },
      shopping: {
        details: [
          {
            name: {
              type: String,
              required: true,
            },
            annual_expense: {
              type: Number,
              required: true,
            },
            inflation: {
              type: Number,
              required: true,
            },
            start_year: {
              type: Number,
              required: true,
            },
            end_year: {
              type: Number,
              required: true,
            },
            rate_after_retirement: {
              type: Number,
              required: true,
            },
          },
        ],
        total: {
          type: Number,
          required: true,
        },
      },
      entertainment: {
        details: [
          {
            name: {
              type: String,
              required: true,
            },
            annual_expense: {
              type: Number,
              required: true,
            },
            inflation: {
              type: Number,
              required: true,
            },
            start_year: {
              type: Number,
              required: true,
            },
            end_year: {
              type: Number,
              required: true,
            },
            rate_after_retirement: {
              type: Number,
              required: true,
            },
          },
        ],
        total: {
          type: Number,
          required: true,
        },
      },
      holiday: {
        details: [
          {
            name: {
              type: String,
              required: true,
            },
            annual_expense: {
              type: Number,
              required: true,
            },
            inflation: {
              type: Number,
              required: true,
            },
            start_year: {
              type: Number,
              required: true,
            },
            end_year: {
              type: Number,
              required: true,
            },
            rate_after_retirement: {
              type: Number,
              required: true,
            },
          },
        ],
        total: {
          type: Number,
          required: true,
        },
      },
      insurance_policies: {
        life_insurance: [
          {
            name: {
              type: String,
              required: true,
            },
            annual_expense: {
              type: Number,
              required: true,
            },
            inflation: {
              type: Number,
              required: true,
            },
            start_year: {
              type: Number,
              required: true,
            },
            end_year: {
              type: Number,
              required: true,
            },
            rate_after_retirement: {
              type: Number,
              required: true,
            },
          },
        ],
        critical_illness_cover: [
          {
            name: {
              type: String,
              required: true,
            },
            annual_expense: {
              type: Number,
              required: true,
            },
            inflation: {
              type: Number,
              required: true,
            },
            start_year: {
              type: Number,
              required: true,
            },
            end_year: {
              type: Number,
              required: true,
            },
            rate_after_retirement: {
              type: Number,
              required: true,
            },
          },
        ],
        family_income_benefit: [
          {
            name: {
              type: String,
              required: true,
            },
            annual_expense: {
              type: Number,
              required: true,
            },
            inflation: {
              type: Number,
              required: true,
            },
            start_year: {
              type: Number,
              required: true,
            },
            end_year: {
              type: Number,
              required: true,
            },
            rate_after_retirement: {
              type: Number,
              required: true,
            },
          },
        ],
      },
      one_off_expenses: [
        {
          name: {
            type: String,
            required: true,
          },
          annual_payment_in_todays_terms: {
            type: Number,
            required: true,
          },
          inflation: {
            type: Number,
            required: true,
          },
          start_year: {
            type: Number,
            required: true,
          },
          end_year: {
            type: Number,
            required: true,
          },
        },
      ],
      children_education_expenses: {
        primary_school_fees: {
          annual_fee_in_todays_terms: {
            type: Number,
            required: true,
          },
          inflation: {
            type: Number,
            required: true,
          },
        },
        seconday_school_fees: {
          annual_fee_in_todays_terms: {
            type: Number,
            required: true,
          },
          inflation: {
            type: Number,
            required: true,
          },
        },
        university_fees: {
          annual_fee_in_todays_terms: {
            type: Number,
            required: true,
          },
          inflation: {
            type: Number,
            required: true,
          },
        },
      },
    },
    mortgages: [
      {
        user_input_field: {
          loan_amount: {
            type: Number,
            required: true,
          },
          interest_rate: {
            type: Number,
            required: true,
          },
          number_of_years: {
            type: Number,
            required: true,
          },
          number_of_payments_per_year: {
            type: Number,
            required: true,
          },
          start_date: {
            type: String,
            required: true,
          },
        },
        fixed_calculations: {
          scheduled_payment_amount: {
            type: Number,
            required: true,
          },
          total_number_of_payments: {
            type: Number,
            required: true,
          },
          total_payment_amount: {
            type: Number,
            required: true,
          },
          total_interest_paid: {
            type: Number,
            required: true,
          },
          date_of_last_payment: {
            type: String,
            required: true,
          },
          annual_payments: {
            type: Number,
            required: true,
          },
        },
        details: [
          {
            payment_no: {
              type: Number,
              required: true,
            },
            start_balance: {
              type: Number,
              required: true,
            },
            payment_amount: {
              type: Number,
              required: true,
            },
            capital_paid: {
              type: Number,
              required: true,
            },
            interest_paid: {
              type: Number,
              required: true,
            },
            remaining_balance: {
              type: Number,
              required: true,
            },
          },
        ],
      },
    ],
    loans: [
      {
        user_input_field: {
          loan_amount: {
            type: Number,
            required: true,
          },
          interest_rate: {
            type: Number,
            required: true,
          },
          number_of_years: {
            type: Number,
            required: true,
          },
          number_of_payments_per_year: {
            type: Number,
            required: true,
          },
          start_date: {
            type: String,
            required: true,
          },
        },
        fixed_calculations: {
          scheduled_payment_amount: {
            type: Number,
            required: true,
          },
          total_number_of_payments: {
            type: Number,
            required: true,
          },
          total_payment_amount: {
            type: Number,
            required: true,
          },
          total_interest_paid: {
            type: Number,
            required: true,
          },
          date_of_last_payment: {
            type: String,
            required: true,
          },
          annual_payments: {
            type: Number,
            required: true,
          },
        },
        details: [
          {
            payment_no: {
              type: Number,
              required: true,
            },
            start_balance: {
              type: Number,
              required: true,
            },
            payment_amount: {
              type: Number,
              required: true,
            },
            capital_paid: {
              type: Number,
              required: true,
            },
            interest_paid: {
              type: Number,
              required: true,
            },
            remaining_balance: {
              type: Number,
              required: true,
            },
          },
        ],
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {}
);

const Inputs = model("input", inputsSchema);

export default Inputs;
