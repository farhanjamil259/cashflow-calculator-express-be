interface IForecastSummary {
  year: number;
  retirement_ages: Array<number>;
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
  assets_and_liabilities_analysis: {
    aggregated_bank_accounts: number;
    total_savings_and_investments: number;
    total_pension_plans: number;
    total_mortgages: number;
    total_other_loans: number;
    credit_card: number;
    net_asset_possition: number;
  };
  cash_flow_analysis: {
    total_household_income: number;
    total_household_expenses: number;
    annual_cash_inflow_outflow: number;
  };
  income_analysis: {
    total_employment_income: number;
    total_self_employment_income: number;
    total_rental_income: number;
    total_dividend_income: number;
    total_savings_and_investments_drawdowns: number;
    total_pension_income: number;
    total_residential_sale_proceeds: number;
    total_other_income: number;
    total_income: number;
  };
  expense_analysis: {
    total_housing_expenses: number;
    total_consumables_expenses: number;
    total_travel_expenses: number;
    total_shopping_expenses: number;
    total_entertainment_expenses: number;
    total_holiday_expenses: number;
    total_one_off_expenses: number;
    total_children_education_expenses: number;
    total_financial_expenses: number;
    total_additional_tax_charge: number;
    total_expenses: number;
  };
  income_tax_analysis: {
    details: Array<{
      name: string;
      income_tax_charge: number;
      national_insurance: number;
      total_tax_income: number;
      total_taxable_income: number;
      effective_tax_rate: number;
    }>;
    overall_effective_tax_rate: number;
  };

  tax_and_expenses_as_a_percentage_of_income: {
    tax_and_expenses_as_a_percentage_of_income: number;
  };
  property_analysis: {
    property_details: Array<{
      name: string;
      amount: number;
    }>;
    mortgage_details: Array<{
      name: string;
      amount: number;
    }>;
    ltv_details: Array<{
      name: string;
      amount: number;
    }>;
    net_position: number;
  };
}

export default IForecastSummary;
