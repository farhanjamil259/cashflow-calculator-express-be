export default interface IChartsData {
  years: number[];
  cashflow: {
    employment_income: number[];
    self_employment_income: number[];
    rental_income: number[];
    dividend_income: number[];
    savings_and_investments_drawdowns: number[];
    pension_income: number[];
    residential_property_sales_proceeds: number[];
    other_income: number[];
    bank_accounts: number[];
    expenses: number[];
    shortfall: number[];
  };
  assets_and_liabilities: {
    aggregated_bank_accounts: number[];
    savings_and_investments: number[];
    pension_plans: number[];
    liabilities: number[];
  };
  income: {
    employment_income: number[];
    self_employment_income: number[];
    rental_income: number[];
    dividend_income: number[];
    savings_and_investments_drawdowns: number[];
    pension_income: number[];
    other_income: number[];
    bank_accounts: number[];
  };
  expenses: {
    housing: number[];
    consumables: number[];
    travel: number[];
    shopping: number[];
    entertainment: number[];
    holiday: number[];
    one_off: number[];
    children_education: number[];
    financial: number[];
    additional_tax_charge: number[];
  };
}
