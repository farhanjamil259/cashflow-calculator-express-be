//Basic Math functions
export const add = (num1: number, num2: number) => {
  return num1 + num2;
};
export const sub = (num1: number, num2: number) => {
  return num1 - num2;
};

//Property Formulae
export const calcMortgage = (
  loanAmount: number,
  interestRate: number,
  numberOfYears: number,
  numberOfPaymentsPerYear: number
) => {
  const scheduled_payment_amount =
    (loanAmount * (interestRate / numberOfPaymentsPerYear)) /
    (1 - (1 + interestRate / numberOfPaymentsPerYear) ** -(numberOfYears * numberOfPaymentsPerYear));
  const total_no_payments = numberOfYears * numberOfPaymentsPerYear;
  const total_payment_amount = scheduled_payment_amount * total_no_payments;
  const total_interest_paid = total_payment_amount - loanAmount;
  const annual_payments = scheduled_payment_amount * numberOfPaymentsPerYear;

  return {
    scheduled_payment_amount,
    total_no_payments,
    total_payment_amount,
    total_interest_paid,
    annual_payments,
  };
};

export function calcPresentValue(property: any, currentYear: number) {
  const pv = property.original_price / (1 + property.growth_rate) ** (property.start_year - currentYear);
  return pv;
}
export function calcFutureValue(property: any, currentYear: number) {
  const fv = property.original_price / (1 + property.growth_rate) ** (currentYear - property.start_year);
  return fv;
}

export const calcTodaysValue = (property: any, currentYear: number) => {
  const { start_year } = property;

  if (start_year < currentYear) {
    return calcFutureValue(property, currentYear);
  } else if (start_year > currentYear) {
    return calcPresentValue(property, currentYear);
  } else {
    return property.original_price;
  }
};

export const max = (array: any[]) => {
  const max = array.reduce((prev, current) => {
    return prev.end_of_forecast_year > current.end_of_forecast_year ? prev : current;
  });
  return max;
};

export const calcDeposit = (originalPrice: number, mortgageRate: number, isMortgage: boolean) => {
  if (isMortgage) {
    return originalPrice * (1 - mortgageRate);
  } else {
    return originalPrice;
  }
};

export const calcSDLT = (assumptions: any, originalPrice: number) => {
  const sdltThresholds = assumptions.sdlt_thresholds;

  const c5 = sdltThresholds.c5;
  const c6 = sdltThresholds.c6;
  const c7 = sdltThresholds.c7;
  const c8 = sdltThresholds.c8;
  const c9 = sdltThresholds.c9;

  const c5t = c5.threshold;
  const c6t = c6.threshold;
  const c7t = c7.threshold;
  const c8t = c8.threshold;
  const c9t = c9.threshold;

  const d5 = c5.taxrate;
  const d6 = c6.taxrate;
  const d7 = c7.taxrate;
  const d8 = c8.taxrate;
  const d9 = c9.taxrate;

  if (originalPrice < c6t) {
    return originalPrice * d5;
  } else if (originalPrice < c7t) {
    return (c6t - c5t) * d5 + (originalPrice - c6t) * d6;
  } else if (originalPrice < c8t) {
    return (c6t - c5t) * d5 + (c7t - c6t) * d6 + (originalPrice - c7t) * d7;
  } else if (originalPrice < c9t) {
    return (c6t - c5t) * d5 + (c7t - c6t) * d6 + (c8t - c7t) * d7 + (originalPrice - c8t) * d8;
  } else {
    return (
      (c6t - c5t) * d5 + (c7t - c6t) * d6 + (c8t - c7t) * d7 + (c9t - c8t) * d8 + (originalPrice - c9t) * d9
    );
  }
};
