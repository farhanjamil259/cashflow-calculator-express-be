// L117
// remainingYearObject.creditors.beginning_of_period = lastYearObject.creditors.end_of_period;

import Inputs from "./models/Inputs";

//L125 = annual_cash_inflow_outflow
// total_cash_inflow_outflow=total_household_income.total+total_household_expenses.total;

// L90
// asserts.bank_account.amount =
// lastYearObject.assets.bank_account.amount * (1 + inputs.bank_accounts.growth_rate) -
// creditors.credit_card.change_in_year +
// creditors.credit_card_requirement_analysis.total_cash_inflow_outflow;

// L334
// remainingYearObject.household_expenses.financials.interest_expenses.credit_cards = lastYearObject.creditors.credit_cards.end_of_period * inputs.credit_card.interest_rate;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// L98

// e196 = regular drawdown option --------- formula
// e339 = pension pot. pension plan ----------- formula
// e375 = tax credit received through pension --------formula

const e1 = 2018; // e1 curent_year
const c104 = "Drawdown"; //inputs > c104 = option taken
const f6 = 2050; // inputs > f6 =retirement year
const d98 = 40000; // d98 = previous pension[index]
const d35 = 0.0193; // inputs > d35 = orignal balence
const e196 = 0; // e196 = regular drawdown option
const e339 = -4000; // e339 = pension pot. pension plan
const e375 = -800; // e375 = tax credit received through pension

// e196 = regular drawdown option --------- formula
const ig104 = 2051; // inputs > defined contribution pension plans > start year
const ih104 = 2051; // inputs > defined contribution pension plans > end year
const if104 = 0; // inputs >  Drawdown Option Annual Amount

//
let e196 = 0; //e196 = regular drowdown option
if (c104 == "Drawdown") {
  let val1 = 0;
  if (e1 >= ig104 && e1 <= ih104) {
    val1 = if104;
  } else {
    val1 = 0;
  }
  let val2 = d98;
  e196 = Math.min(val1, val2);
} else {
  e196 = 0;
}
// =IF(Inputs!$C$104="Drawdown", MIN(IF( AND(E1>=Inputs!$G$104, E1<=Inputs!$H$104), Inputs!$F$104, 0), D98), 0)

// e339 = pension pot. pension plan ----------- formula
let ie35 = 4000; //inputs > assets.defined_contribution_pension_plans.annual_contribution
let ac16 = 1000000; //assumptions > pension_contribution_allowance.lifetime_allowance.allowance
let ad;

e339 = 0;
if (e35 === 0) {
  e339 = 0;
} else {
  if (d98 + ie35 - ac16 > 0) {
    let val3 = 0;
    let val4 = (ac15 / (1 + ad20)) * (1 + ad15) ** (e1 - d1);

    if (e1 >= if35 && e1 <= ig36) {
      val3 = ie35;
    } else {
      val3 = 0;
    }

    let val1 = Math.min(val3, val4);
    let val2 = 0;
    if (d98 - ac16 > 0) {
      val2 = 0;
    } else {
      val2 = ac16 - d98;
    }

    e339 = Math.min(val1, val2);
  } else {
    let val1 = 0;
    let val2 = 0;

    if (e1 >= if35 && e1 <= ig35) {
      val1 = ie35;
    } else {
      val1 = 0;
    }
    val2 = (ac15 / (1 + ad20)) * (1 + ad15) ** (e1 - d1);
    e339 = Math.min(val1, val2);
  }
}

// =IF(Inputs!$E35=0, 0, -IFERROR(
//     IF( ((D98+Inputs!$E35)-Asm!$C$16)>0, MIN( MIN(IF( AND( E$1>=Inputs!$F35, E$1<=Inputs!$G35), Inputs!$E35, 0), (Asm!$C$15/(1+Asm!$D$20))*(1+Asm!$D$15)^(E$1-$D$1)),
//     IF( (D98-Asm!$C$16)>0, 0, Asm!$C$16-D98)
//     ), MIN(IF( AND( E$1>=Inputs!$F35, E$1<=Inputs!$G35), Inputs!$E35, 0), (Asm!$C$15/(1+Asm!$D$20))*(1+Asm!$D$15)^(E$1-$D$1))), 0))

// e375 = tax credit received through pension --------formula
// e375 = e339 * asm > Threshold
// =E365*Asm!$D$20

// L98 pension plan
let e98 = 0; //e98 = personal pension plan
if (c104 == "Drawdown") {
  if (e1 > f6) {
    if (e1 > 0) {
      e98 = d98 * (1 + d35) - e196;
    } else {
      if (e1 > 0) {
        e98 = d98 * (1 + d35) - e339 - e375;
      } else {
        e98 = 0;
      }
    }
  } else {
    if (e1 > f6) {
      e98 = 0;
    } else {
      if (e1 > 0) {
        e98 = d98 * (1 + d35) - e339 - e375;
      } else {
        e98 = 0;
      }
    }
  }
}
// // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// // without else
// if (c104 == "Drawdown") {
//     if (e1 > f6) {
//       if (e1 > 0) {
//         let result = d98 * (1 + d35) - e196;
//         document.write(result);
//       } else {
//         if (e1 > 0) {
//           let result = d98 * (1 + d35) - e339 - e375;
//           document.write(result);
//         }
//       }
//     } else {
//       if (e1 > f6) {
//       } else {
//         if (e1 > 0) {
//           let result = d98 * (1 + d35) - e339 - e375;
//           document.write(result+"test");
//         }
//       }
//     }
//   }
// =IF(Inputs!$C$104="Drawdown",
// IF(E1>Inputs!$F$6,IF(E$1>0,D98*(1+Inputs!$D35)-E196,IF(E$1>0,D98*(1+Inputs!$D35)-E339-E375,0))),
// IF(E1>Inputs!$F$6,0,IF(E$1>0,D98*(1+Inputs!$D35)-E339-E375,0)))
