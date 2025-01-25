import { pmt } from 'financial';
import Decimal from 'decimal.js';

interface MonthlyPaymentParams {
    loanType: 'fha' | 'conventional';
    loanAmount: number;
    interestRate: number;
    loanTermYears: number;
}

interface MonthlyPaymentBreakdown {
    total: string;
    closingCosts: string;
    mip: string;
    tax: string;
    principalAndInterest: string;
}

// Function to calculate total monthly payment breakdown
export const calculateTotalMonthlyPayment = (
    loanType: 'fha' | 'conventional',
    listingPrice: number,
    interestRate: number
): MonthlyPaymentBreakdown => {
    const loanTermYears = 30;
    let decimalLoanAmount = new Decimal(listingPrice)
        .times(1 - (loanType === 'fha' ? 0.035 : 0.2));

    let upfrontMIP = new Decimal(0); // Initialize upfrontMIP
    let monthlyMIP = new Decimal(0);
    if (loanType === 'fha') {
        const upfrontMIPRate = new Decimal(0.0175);
        const annualMIPRate = new Decimal(0.0055);

        upfrontMIP = decimalLoanAmount.times(upfrontMIPRate);
        const annualMIP = decimalLoanAmount.times(annualMIPRate);
        monthlyMIP = annualMIP.dividedBy(12);

        decimalLoanAmount = decimalLoanAmount.plus(upfrontMIP);
    }

    const monthlyMortgagePayment = new Decimal(
        pmt(
            interestRate / 1200, // Rate per period
            loanTermYears * 12, // Number of periods
            decimalLoanAmount.toNumber()
        )
    ).times(-1);

    const annualPropertyTax = listingPrice * 0.01;
    const monthlyPropertyTax = new Decimal(annualPropertyTax).dividedBy(12);

    const closingCosts = new Decimal(decimalLoanAmount).times(0.02);
    const monthlyClosingCosts = closingCosts.dividedBy(loanTermYears * 12);

    const totalMonthlyPayment = monthlyMortgagePayment
        .plus(monthlyPropertyTax)
        .plus(monthlyClosingCosts)
        .plus(monthlyMIP);

    return {
        total: totalMonthlyPayment.toDecimalPlaces(2).toString(),
        closingCosts: monthlyClosingCosts.toDecimalPlaces(2).toString(),
        mip: monthlyMIP.toDecimalPlaces(2).toString(),
        tax: monthlyPropertyTax.toDecimalPlaces(2).toString(),
        principalAndInterest: monthlyMortgagePayment.toDecimalPlaces(2).toString(),
    };
};


export const calculateEquityOver30Years = (
    listingPrice: number,
    interestRate: number,
    expectedAppreciationRate: number,
    loanType: 'conventional' | 'fha'
): { year: number; equity: string }[] => {
    const loanTermYears = 30;
    let decimalLoanAmount = new Decimal(listingPrice)
        .times(1 - (loanType === 'fha' ? 0.035 : 0.2));

    let upfrontMIP = new Decimal(0); // Initialize upfrontMIP
    let monthlyMIP = new Decimal(0);
    if (loanType === 'fha') {
        const upfrontMIPRate = new Decimal(0.0175);
        const annualMIPRate = new Decimal(0.0055);

        upfrontMIP = decimalLoanAmount.times(upfrontMIPRate);
        const annualMIP = decimalLoanAmount.times(annualMIPRate);
        monthlyMIP = annualMIP.dividedBy(12);

        decimalLoanAmount = decimalLoanAmount.plus(upfrontMIP);
    }

    // Calculate fixed monthly payment
    const monthlyPayment = new Decimal(
        pmt(
            interestRate / 1200, // Rate per period
            loanTermYears * 12, // Number of periods
            decimalLoanAmount.toNumber()
        )
    );

    let remainingBalance = decimalLoanAmount;
    let currentHomeValue = new Decimal(listingPrice); // Start with listing price
    const equitySchedule: { year: number; equity: string }[] = [
        { year: 0, equity: currentHomeValue.minus(remainingBalance).toFixed(2) }, // Initial equity
    ];

    for (let year = 1; year <= 30; year++) {
        // Calculate appreciation for the year on the CURRENT home value
        currentHomeValue = currentHomeValue.times(
            new Decimal(1).plus(expectedAppreciationRate / 100)
        );

        // Calculate remaining loan balance after a year of payments
        for (let month = 1; month <= 12; month++) {
            const interestPayment = remainingBalance.times(interestRate / 1200);
            const principalPayment = monthlyPayment.minus(interestPayment);
            remainingBalance = remainingBalance.minus(principalPayment);
        }

        // Calculate equity for the current year
        const currentEquity = currentHomeValue.minus(remainingBalance);

        equitySchedule.push({
            year,
            equity: currentEquity.toFixed(2),
        });
    }

    return equitySchedule;
};