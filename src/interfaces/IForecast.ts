export default interface IForecast {
  year: number;
  ages: {
    owner_ages: Array<{
      name: string;
      age: number;
    }>;
    children_ages: Array<{
      name: string;
      age: number;
    }>;
  };
  assets: {
    properties: Array<{
      name: string;
      amount: number;
    }>;
    bank_account: {
      name: string;
      amount: number;
    };
    savings_and_investments: {
      individual_savings_accounts: {
        details: Array<{
          name: string;
          amount: number;
        }>;
      };
      general_investment_accounts: {
        details: Array<{
          name: string;
          amount: number;
        }>;
      };
      total: number;
    };
    personal_pension_plans: {
      details: Array<{
        name: string;
        amount: number;
      }>;
      total: number;
    };
  };
  creditors: {
    mortgages: {
      details: Array<{
        name: string;
        amount: number;
      }>;
      total: number;
    };
    other_loans: {
      details: Array<{
        name: string;
        amount: number;
      }>;
      total: number;
    };
    credit_cards: {
      name: string;
      beginning_of_period: number;
      change_in_year: number;
      end_of_period: number;
    };
    credit_card_requirement_analysis: {
      balance_at_start_of_year: number;
      minimum_balance_acceptable: number;
      excess_cash_at_start_of_year: number;
      total_cash_inflow_outflow: number;
      cash_available: number;
    };
  };
  household_income: {
    employment_income: {
      details: Array<{
        name: string;
        gross_salary: number;
        members_pension_contribution: number;
        total_gross_salary_after_less: number;

        income_tax_charge: number;
        limit_on_personal_allowance: number;
        nic_class_1_charge: number;
        net_salary: number;
        effective_tax_rate: number;
      }>;
      total: number;
    };
    employer_pension_contribution: {
      details: Array<{
        name: string;
        amount: number;
      }>;
    };
    self_employment_income: {
      details: Array<{
        name: string;
        amount: number;
      }>;
      total: number;
    };
    rental_income: {
      details: Array<{
        name: string;
        amount: number;
      }>;
      total: number;
    };
    dividend_income: {
      details: Array<{
        name: string;
        amount: number;
      }>;
      total: number;
    };
    savings_and_investments_income: {
      individual_savings_accounts: {
        details: Array<{
          name: string;
          amount: number;
        }>;
      };
      general_investment_accounts: {
        details: Array<{
          name: string;
          amount: number;
        }>;
      };
      total: number;
    };
    pension_income: {
      state_pension_income: {
        details: Array<{
          name: string;
          amount: number;
        }>;
        total: number;
      };
      defined_benefit_pension_income: {
        details: Array<{
          name: string;
          lump_sum: number;
          annual: number;
          total: number;
        }>;
        total: number;
      };
      defined_contribution_pension_income: {
        details: Array<{
          name: string;
          option_taken: string;
          lump_sum_drawdown_option: number;
          regular_drawdown_option: number;
          annuity_option_initial_drawdown: number;
          annuity_option_annuity_income: number;
          total: number;
        }>;
        total: number;
      };
      total: number;
    };
    residential_property_sale_proceeds: {
      details: Array<{
        name: string;
        amount: number;
      }>;
      total: number;
    };
    other_income: {
      other_taxable_income: {
        details: Array<{
          name: string;
          amount: number;
        }>;
        total: number;
      };
      other_non_taxable_income: {
        details: Array<{
          name: string;
          amount: number;
        }>;
        total: number;
      };
      total: number;
    };
    total: number;
  };
  household_expenses: {
    housing: {
      details: Array<{
        name: string;
        amount: number;
      }>;
      total: number;
    };
    consumables: {
      details: Array<{
        name: string;
        amount: number;
      }>;
      total: number;
    };
    travel: {
      details: Array<{
        name: string;
        amount: number;
      }>;
      total: number;
    };
    shopping: {
      details: Array<{
        name: string;
        amount: number;
      }>;
      total: number;
    };
    entertainment: {
      details: Array<{
        name: string;
        amount: number;
      }>;
      total: number;
    };
    holiday: {
      details: Array<{
        name: string;
        amount: number;
      }>;
      total: number;
    };
    one_off_expenses: {
      details: Array<{
        name: string;
        amount: number;
      }>;
      total: number;
    };
    children_education_expenses: {
      details: Array<{
        name: string;
        primary_school_fees: number;
        secondary_school_fees: number;
        university_fees: number;
        total: number;
      }>;
      total: number;
    };
    financials: {
      other_loans: {
        details: Array<{
          name: string;
          amount: number;
        }>;
        total: number;
      };
      savings_and_investments: {
        individual_savings_accounts: {
          details: Array<{
            name: string;
            amount: number;
          }>;
        };
        general_investment_accounts: {
          details: Array<{
            name: string;
            amount: number;
          }>;
        };
        total: number;
      };
      pension_pot: {
        details: Array<{
          name: string;
          amount: number;
        }>;
        total: number;
      };
      interest_expenses: {
        details: {
          name: string;
          amount: number;
        };
        total: number;
      };
      insurance_policies: {
        life_insurance: {
          details: Array<{
            name: string;
            amount: number;
          }>;
        };
        critical_illness_cover: {
          details: Array<{
            name: string;
            amount: number;
          }>;
        };
        family_income_benefit: {
          details: Array<{
            name: string;
            amount: number;
          }>;
        };
        total: number;
      };
      total: number;
    };
    additional_tax_charge: {
      details: Array<{
        name: string;
        gross_salary: number;
        member_pension_contribution: number;
        total_gross_salary_after_less: number;

        self_employment_income: number;
        rental_income: number;
        taxable_pension_income: number;
        other_taxable_income: number;
        pension_plan: number;
        prior_year_excess_pension_contribution: number;

        total_taxable_income_excluding_dividends: number;
        dividend_income: number;
        total_taxable_income: number;

        income_tax_charge_on_non_dividend_income: number;
        income_tax_charge_on_dividend_income: number;
        limit_on_personal_allowance: number;
        nic_class_2_charge: number;
        nic_class_4_charge: number;
        tax_credit_received_through_pension: number;

        capital_gains_tax_residential_property: number;
        capital_gains_tax_other_assets: number;

        tax_deducted_at_source: number;
        additional_tax: number;

        pension_annual_allowance_tapering_analysis: {
          threshold_income: number;
          exceeds_tapering_threshold: boolean;
          adjusted_income: number;
          exceeds_tapering_threshold_2: boolean;
          pension_contribution_annual_allowance: number;
          total_gross_pension_contribution: number;
        };
        capital_gains: {
          total_gain_form_property_sale: number;
          total_gain_from_other_assets: number;
          annual_exemption_amount_property: number;
          annual_exemption_amount_other_assets: number;
          taxable_gains_from_property_sale: number;
          taxable_gains_from_other_assets: number;
        };
        total_gains_from_other_assets: {
          base_cost: number;
          accumulattive_gain: number;
          rate_recognised_as_base_cost: number;
          rate_recognised_as_gain: number;
          base_cost_drawdown: number;
          gain_drawdown: number;
        };
      }>;

      sdlt_charge: {
        details: Array<{
          name: string;
          amount: number;
        }>;
        total: number;
      };
      total_additional_tax_charge: number;
    };
    total_household_expenses: number;
  };
  annual_cash_inflow_outflow: number;

  auto_liquidation: {
    shortfall: number;
    aggregated_bank_Accounts: number;
    individual_savings_accounts: {
      details: Array<{
        name: string;
        amount: number;
      }>;
    };
    pension_plans: {
      details: Array<{
        name: string;
        amount: number;
      }>;
    };
    general_investment_accounts: {
      details: Array<{
        name: string;
        amount: number;
      }>;
    };
    credit_card_borrowing: number;
  };
}
