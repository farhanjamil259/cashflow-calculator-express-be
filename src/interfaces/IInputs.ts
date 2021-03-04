interface input {
  client_id: string;
  input_set_name: string;
  current_year: number;
  household_owners: Array<{
    name: string;
    birth_year: number;
    current_age: number;
    retirement_age: number;
    retirement_year: number;
    end_of_forecast_age: number;
    end_of_forecast_year: number;
  }>;
  children: Array<{
    name: string;
    birth_year: number;
    primary_school_age: number;
    primary_school_year: number;
    secondary_school_age: number;
    secondary_school_year: number;
    university_age: number;
    university_year: number;
    graduation_age: number;
    graduation_year: number;
  }>;
  assets: {
    properties: Array<{
      name: string;
      original_price: number;
      todays_value: number;
      growth_rate: number;
      start_year: number;
      sell_in_future: boolean;
      end_year: number;
      type_of_property: "Main Home" | "Other Residential";
      on_mortgage: boolean;
      mortgage_rate: number;
      deposit: number;
      sdlt: number;
    }>;
    bank_accounts: {
      original_balance: number;
      growth_rate: number;
      start_year: number;
      end_year: number;
      minimum_cash_balance_acceptable: number;
    };
    savings_and_investments: {
      individual_savings_account: Array<{
        name: string;
        original_balance: number;
        growth_rate: number;
        annual_contribution: number;
        contribution_start_year: number;
        contribution_end_year: number;
      }>;
      general_investment_account: Array<{
        name: string;
        original_balance: number;
        growth_rate: number;
        annual_contribution: number;
        contribution_start_year: number;
        contribution_end_year: number;
      }>;
    };
    non_employment_defined_contribution_pension_plans: Array<{
      name: string;
      original_balance: number;
      growth_rate: number;
      annual_contribution: number;
      contribution_start_year: number;
      contribution_end_year: number;
    }>;
  };
  liabilities: {
    mortgages: Array<{
      name: string;
      original_balance: number;
      interest_rate: number;
      start_year: number;
      start_year_for_model: number;
      mortgage_period: number;
      end_year: number;
      number_of_payments_per_year: number;
      annual_payment: number;
    }>;
    other_loans: Array<{
      name: string;
      original_balance: number;
      interest_rate: number;
      start_year: number;
      start_year_for_model: number;
      loan_period: number;
      end_year: number;
      number_of_payments_per_year: number;
      annual_payment: number;
    }>;
    credit_card: {
      name: string;
      original_balance: number;
      interest_rate: number;
    };
  };
  household_income: {
    employment_income: Array<{
      name: string;
      gross_anual_amount: number;
      inflation: number;
      start_year: number;
      end_year: number;
      member_contribution: number;
      employer_contribution: number;
    }>;
    self_employment_income: Array<{
      name: string;
      gross_anual_amount: number;
      inflation: number;
      start_year: number;
      end_year: number;
    }>;
    rental_income: {
      joint_annual_rental_income: number;
      details: Array<{
        name: string;
        share_of_rental_income: number;
        annual_amount: number;
        inflation: number;
        start_year: number;
        end_year: number;
      }>;
    };
    dividend_income: Array<{
      name: string;
      anual_amount: number;
      inflation: number;
      start_year: number;
      end_year: number;
    }>;
    savings_and_investments_drawdowns: {
      individual_savings_accounts: Array<{
        owner_name: string;
        drawdowns: Array<{
          name: string;
          amount_to_drawn_down: number;
          start_year: number;
          end_year: number;
        }>;
      }>;
      general_investment_accounts: Array<{
        owner_name: string;
        drawdowns: Array<{
          name: string;
          amount_to_drawn_down: number;
          start_year: number;
          end_year: number;
        }>;
      }>;
    };
    pension_income: {
      state_pension: Array<{
        name: string;
        annual_amount: number;
        inflation: number;
        state_pension_age: number;
        start_year: number;
        end_year: number;
      }>;
      defined_benifit_pension_plans: Array<{
        name: string;
        option_taken: string;
        estimated_lump_sum: number;
        estimated_annual_pension: number;
        annual_increase: number;
        start_year: number;
        end_year: number;
      }>;
      defined_contribution_pension_plans: Array<{
        name: string;
        option_taken: string;
        annuity_option_initial_drawdown: number;
        annuity_option_annual_annuity_rate: number;
        drawdown_option_annual_amount: number;
        start_year: number;
        end_year: number;
      }>;
    };
    other_income: {
      other_taxable_income: Array<{
        name: string;
        gross_annual_amount: number;
        inflation: number;
        start_year: number;
        end_year: number;
      }>;
      other_non_taxable_income: Array<{
        name: string;
        gross_annual_amount: number;
        inflation: number;
        start_year: number;
        end_year: number;
      }>;
    };
  };
  household_expenses: {
    blanket_inflation_rate: number;
    housing: {
      details: Array<{
        name: string;
        annual_expense: number;
        inflation: number;
        start_year: number;
        end_year: number;
        rate_after_retirement: number;
        type: string;
      }>;
      total: number;
    };
    consumables: {
      details: Array<{
        name: string;
        annual_expense: number;
        inflation: number;
        start_year: number;
        end_year: number;
        rate_after_retirement: number;
      }>;
      total: number;
    };
    travel: {
      details: Array<{
        name: string;
        annual_expense: number;
        inflation: number;
        start_year: number;
        end_year: number;
        rate_after_retirement: number;
      }>;
      total: number;
    };
    shopping: {
      details: Array<{
        name: string;
        annual_expense: number;
        inflation: number;
        start_year: number;
        end_year: number;
        rate_after_retirement: number;
      }>;
      total: number;
    };
    entertainment: {
      details: Array<{
        name: string;
        annual_expense: number;
        inflation: number;
        start_year: number;
        end_year: number;
        rate_after_retirement: 1;
      }>;
      total: number;
    };
    holiday: {
      details: Array<{
        name: string;
        annual_expense: number;
        inflation: number;
        start_year: number;
        end_year: number;
        rate_after_retirement: 1;
      }>;
      total: number;
    };
    insurance_policies: Array<{
      name: string;
      annual_expense: number;
      inflation: number;
      start_year: number;
      end_year: number;
      rate_after_retirement: number;
    }>;
    one_off_expenses: Array<{
      name: string;
      annual_payment_in_todays_terms: number;
      inflation: number;
      start_year: number;
      end_year: number;
    }>;
    children_education_expenses: {
      primary_school_fees: {
        annual_fee_in_todays_terms: number;
        inflation: number;
      };
      seconday_school_fees: {
        annual_fee_in_todays_terms: number;
        inflation: number;
      };
      university_fees: {
        annual_fee_in_todays_terms: number;
        inflation: number;
      };
    };
  };
  mortgages: Array<{
    user_input_field: {
      loan_amount: number;
      interest_rate: number;
      number_of_years: number;
      number_of_payments_per_year: number;
      start_date: string;
    };
    fixed_calculations: {
      scheduled_payment_amount: number;
      total_number_of_payments: number;
      total_payment_amount: number;
      total_interest_paid: number;
      date_of_last_payment: string;
      annual_payments: number;
    };
    details: Array<{
      payment_no: number;
      start_balance: number;
      payment_amount: number;
      capital_paid: number;
      interest_paid: number;
      remaining_balance: number;
    }>;
  }>;
  loans: Array<{
    user_input_field: {
      loan_amount: number;
      interest_rate: number;
      number_of_years: number;
      number_of_payments_per_year: number;
      start_date: string;
    };
    fixed_calculations: {
      scheduled_payment_amount: number;
      total_number_of_payments: number;
      total_payment_amount: number;
      total_interest_paid: number;
      date_of_last_payment: string;
      annual_payments: number;
    };
    details: Array<{
      payment_no: number;
      start_balance: number;
      payment_amount: number;
      capital_paid: number;
      interest_paid: number;
      remaining_balance: number;
    }>;
  }>;
}

export default input;
