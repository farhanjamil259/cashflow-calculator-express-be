export default interface assumptions {
  sdlt_thresholds: {
    c5: {
      threshold: number;
      taxrate: number;
    };
    c6: {
      threshold: number;
      taxrate: number;
    };
    c7: {
      threshold: number;
      taxrate: number;
    };
    c8: {
      threshold: number;
      taxrate: number;
    };
    c9: {
      threshold: number;
      taxrate: number;
    };
  };
  isaa: {
    annual_contribution_allowance: {
      allowance: number;
      rate: number;
    };
  };
  pension_contribution_allowance: {
    contribution_annual_allowance: {
      allowance: number;
      rate: number;
    };
    lifetime_allowance: {
      allowance: number;
      rate: number;
    };
    contribution_annual_allowance_floor: {
      allowance: number;
      rate: number;
    };
  };
  pension_contribution_allowance_tapering: {
    threshold_income: {
      threshold: number;
      rate: number;
    };
    lifetime_allowance: {
      threshold: number;
      rate: number;
    };
  };
  income_tax_rate_thresholds: {
    personal_allowance: {
      threshold: number;
      rate: number;
    };
    basic_rate: {
      threshold: number;
      rate: number;
    };
    higher_rate: {
      threshold: number;
      rate: number;
    };
    additional_rate: {
      threshold: number;
      rate: number;
    };
  };
  income_limits: {
    income_limit_for_personal_allowance: {
      threshold: number;
      rate: number;
    };
  };
  employement_minimum_pension_contributions: {
    minimum_contributions: {
      member: number;
      employer: number;
    };
  };
  employment_nic_thresholds: {
    lower_earnings: {
      threshold: number;
      rate: number;
    };
    primary_threshold: {
      threshold: number;
      rate: number;
    };
    upper_earnings_limit: {
      threshold: number;
      rate: number;
    };
  };
  self_employment_nic_class_2_threshold: {
    small_profit_rate: {
      threshold: number;
      rate: number;
    };
  };
  self_employment_nic_class_4_threshold: {
    lower_profits_limit: {
      threshold: number;
      rate: number;
    };
    upper_earnings_limit: {
      threshold: number;
      rate: number;
    };
  };
  dividend_tax_rate_thresholds: {
    personal_allowance: {
      threshold: number;
      rate: number;
    };
    basic_rate: {
      threshold: number;
      rate: number;
    };
    higher_rate: {
      threshold: number;
      rate: number;
    };
    additional_rate: {
      threshold: number;
      rate: number;
    };
  };
  residential_property_captical_gains_tax_rate_thresholds: {
    basic_rate: {
      threshold: number;
      rate: number;
    };
    higher_and_additional_rate: {
      threshold: number;
      rate: number;
    };
  };
  other_assets_capital_gains_tax_rate_thresholds: {
    basic_rate: {
      threshold: number;
      rate: number;
    };
    higher_and_additional_rate: {
      threshold: number;
      rate: number;
    };
  };
  income_limits_2: {
    capital_gains_tax_annual_exempt_amount: {
      threshold: number;
    };
  };
  market_data: {
    property_price_inflation: {
      notes: string;
      rate: number;
    };
    cash_and_money_market_yield: {
      notes: string;
      rate: number;
    };
    savings_and_investment_growth_rate: {
      notes: string;
      rate: number;
    };
    earning_growth_rate: {
      notes: string;
      rate: number;
    };
    retain_price_index: {
      notes: string;
      rate: number;
    };
    consumer_price_index: {
      notes: string;
      rate: number;
    };
    annuity: {
      notes: string;
      rate: number;
    };
    private_school_fee_inflation: {
      notes: string;
      rate: number;
    };
  };
  inputs_assumptions: {
    end_of_forecast_age: number;
    primary_school_age: number;
    secondary_school_age: number;
    university_age: number;
    graduation_age: number;
    bank_account_growth_rate: number;
    credit_card_interest_rate: number;
    state_pension_annual_amount: number;
    state_pension_age: number;
  };
}
