import { DateTime } from "luxon";

const generator = (
  loanAmount: number,
  interestRate: number,
  numberOfYears: number,
  numberOfPaymentsPerYear: number,
  startYear: number
) => {
  const startDate = DateTime.local(startYear, 1, 1);

  //fixed calculations
  const scheduled_payment_amount =
    (loanAmount * (interestRate / numberOfPaymentsPerYear)) /
    (1 - (1 + interestRate / numberOfPaymentsPerYear) ** -(numberOfYears * numberOfPaymentsPerYear));
  const total_no_payments = numberOfYears * numberOfPaymentsPerYear;
  const total_payment_amount = scheduled_payment_amount * total_no_payments;
  const total_interest_paid = total_payment_amount - loanAmount;
  const date_of_last_payment = startDate.plus({ year: numberOfYears });
  const annual_payments = scheduled_payment_amount * numberOfPaymentsPerYear;

  //innitialize array
  const array: Array<{
    payment_no: number;
    date: string;
    start_balance: number;
    payment_amount: number;
    capital_paid: number;
    interest_paid: number;
    remaining_balance: number;
  }> = [];
  for (let i = 0; i <= total_no_payments; i++) {
    const newDate = startDate.plus({ month: i + 1 });
    const item = {
      payment_no: i + 1,
      date: newDate.toLocaleString(DateTime.DATE_FULL),
      start_balance: 0,
      payment_amount: scheduled_payment_amount,
      capital_paid: 0,
      interest_paid: 0,
      remaining_balance: 0,
    };

    array.push(item);
  }
  //set initial values of array at index 0
  array[0].start_balance = loanAmount;
  array[0].capital_paid = 0;
  array[0].remaining_balance =
    array[0].start_balance * (1 + interestRate / numberOfPaymentsPerYear) - array[0].payment_amount;

  //set remaining values of array after index 0
  array.map((item, index) => {
    const rate = interestRate / numberOfPaymentsPerYear;
    const per = index;
    const nper = total_no_payments;
    const pv = loanAmount;
    const pmt = calcPMT(rate, nper, pv, 0, 0);
    const ipmt = calcIPMT(pv, pmt, rate, per);
    const ppmt = (pmt - ipmt) * -1;

    if (index !== 0) {
      item.start_balance = array[index - 1].remaining_balance;
      item.remaining_balance = item.start_balance * (1 + rate) - item.payment_amount;
    }

    item.capital_paid = ppmt;
    item.interest_paid = -calcIPMT(pv, pmt, rate, per);
  });

  return {
    array,
    scheduled_payment_amount,
    total_no_payments,
    total_payment_amount,
    total_interest_paid,
    date_of_last_payment,
    annual_payments,
  };
};

function calcPMT(rate: number, nper: number, pv: number, fv: number, type: number): number {
  if (!fv) fv = 0;
  if (!type) type = 0;

  if (rate == 0) return -(pv + fv) / nper;

  var pvif = Math.pow(1 + rate, nper);
  var pmt = (rate / (pvif - 1)) * -(pv * pvif + fv);

  if (type == 1) {
    pmt /= 1 + rate;
  }

  return pmt;
}

function calcIPMT(pv: number, pmt: number, rate: number, per: number): number {
  //   per = per - 1;
  var tmp = Math.pow(1 + rate, per);
  return 0 - (pv * tmp * rate + pmt * (tmp - 1));
}

// const arr = generator(800000, 0.035, 30, 12, 2021);

export default generator;
