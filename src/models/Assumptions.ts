import { Schema, model } from "mongoose";

const assumptionsSchema = new Schema({
  sdlt_thresholds: {
    c5: {
      threshold: { type: Number, required: true },
      taxrate: { type: Number, required: true },
    },
    c6: {
      threshold: { type: Number, required: true },
      taxrate: { type: Number, required: true },
    },
    c7: {
      threshold: { type: Number, required: true },
      taxrate: { type: Number, required: true },
    },
    c8: {
      threshold: { type: Number, required: true },
      taxrate: { type: Number, required: true },
    },
    c9: {
      threshold: { type: Number, required: true },
      taxrate: { type: Number, required: true },
    },
  },
  isaa: {
    annual_contribution_allowance: {
      allowance: { type: Number, required: true },
      rate: { type: Number, required: true },
    },
  },
  pension_contribution_allowance: {
    contribution_annual_allowance: {
      allowance: { type: Number, required: true },
      rate: { type: Number, required: true },
    },
    lifetime_allowance: {
      allowance: { type: Number, required: true },
      rate: { type: Number, required: true },
    },
    contribution_annual_allowance_floor: {
      allowance: { type: Number, required: true },
      rate: { type: Number, required: true },
    },
  },
  pension_contribution_allowance_tapering: {
    threshold_income: {
      threshold: {
        type: Number,
        required: true,
      },
      rate: {
        type: Number,
        required: true,
      },
    },
    lifetime_allowance: {
      threshold: {
        type: Number,
        required: true,
      },
      rate: {
        type: Number,
        required: true,
      },
    },
  },
  income_tax_rate_thresholds: {
    personal_allowance: {
      threshold: { type: Number, required: true },
      rate: { type: Number, required: true },
    },
    basic_rate: {
      threshold: { type: Number, required: true },
      rate: { type: Number, required: true },
    },
    higher_rate: {
      threshold: { type: Number, required: true },
      rate: { type: Number, required: true },
    },
    additional_rate: {
      threshold: { type: Number, required: true },
      rate: { type: Number, required: true },
    },
  },
  income_limits: {
    income_limit_for_personal_allowance: {
      threshold: { type: Number, required: true },
      rate: { type: Number, required: true },
    },
  },
  employement_minimum_pension_contributions: {
    minimum_contributions: {
      member: {
        type: Number,
        required: true,
      },
      employer: {
        type: Number,
        required: true,
      },
    },
  },
  employment_nic_thresholds: {
    lower_earnings: {
      threshold: { type: Number, required: true },
      rate: { type: Number, required: true },
    },
    primary_threshold: {
      threshold: { type: Number, required: true },
      rate: { type: Number, required: true },
    },
    upper_earnings_limit: {
      threshold: { type: Number, required: true },
      rate: { type: Number, required: true },
    },
  },
  self_employment_nic_class_2_threshold: {
    small_profit_rate: {
      threshold: { type: Number, required: true },
      rate: { type: Number, required: true },
    },
  },
  self_employment_nic_class_4_threshold: {
    lower_profits_limit: {
      threshold: { type: Number, required: true },
      rate: { type: Number, required: true },
    },
    upper_earnings_limit: {
      threshold: { type: Number, required: true },
      rate: { type: Number, required: true },
    },
  },
  dividend_tax_rate_thresholds: {
    personal_allowance: {
      threshold: { type: Number, required: true },
      rate: { type: Number, required: true },
    },
    basic_rate: {
      threshold: { type: Number, required: true },
      rate: { type: Number, required: true },
    },
    higher_rate: {
      threshold: { type: Number, required: true },
      rate: { type: Number, required: true },
    },
    additional_rate: {
      threshold: { type: Number, required: true },
      rate: { type: Number, required: true },
    },
  },

  residential_property_captical_gains_tax_rate_thresholds: {
    basic_rate: {
      threshold: {
        type: Number,
        required: true,
      },
      rate: {
        type: Number,
        required: true,
      },
    },
    higher_and_additional_rate: {
      threshold: {
        type: Number,
        required: true,
      },
      rate: {
        type: Number,
        required: true,
      },
    },
  },
  other_assets_capital_gains_tax_rate_thresholds: {
    basic_rate: {
      threshold: {
        type: Number,
        required: true,
      },
      rate: {
        type: Number,
        required: true,
      },
    },
    higher_and_additional_rate: {
      threshold: {
        type: Number,
        required: true,
      },
      rate: {
        type: Number,
        required: true,
      },
    },
  },
  income_limits_2: {
    capital_gains_tax_annual_exempt_amount: {
      threshold: {
        type: Number,
        required: true,
      },
    },
  },

  market_data: {
    property_price_inflation: {
      notes: { type: String },
      rate: { type: Number, required: true },
    },
    cash_and_money_market_yield: {
      notes: { type: String },
      rate: { type: Number, required: true },
    },
    savings_and_investment_growth_rate: {
      notes: { type: String },
      rate: { type: Number, required: true },
    },
    earning_growth_rate: {
      notes: { type: String },
      rate: { type: Number, required: true },
    },
    retain_price_index: {
      notes: { type: String },
      rate: { type: Number, required: true },
    },
    consumer_price_index: {
      notes: { type: String },
      rate: { type: Number, required: true },
    },
    annuity: {
      notes: { type: String },
      rate: { type: Number, required: true },
    },
    private_school_fee_inflation: {
      notes: { type: String },
      rate: { type: Number, required: true },
    },
  },
  inputs_assumptions: {
    end_of_forecast_age: { type: Number, required: true },
    primary_school_age: { type: Number, required: true },
    secondary_school_age: { type: Number, required: true },
    university_age: { type: Number, required: true },
    graduation_age: { type: Number, required: true },
    bank_account_growth_rate: { type: Number, required: true },
    credit_card_interest_rate: { type: Number, required: true },
    state_pension_annual_amount: { type: Number, required: true },
    state_pension_age: { type: Number, required: true },
  },
});

const Assumptions = model("assumption", assumptionsSchema);

export default Assumptions;
