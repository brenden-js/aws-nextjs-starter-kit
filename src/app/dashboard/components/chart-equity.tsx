"use client"

import Decimal from 'decimal.js';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../../components/ui/chart";

interface EquityDataPoint {
  year: number;
  equity: string;
}

/**
 * Calculates the estimated equity over 30 years.
 *
 * @param loanAmount - The initial loan amount.
 * @param propertyValue - The initial property value.
 * @param appreciationRate - The annual appreciation rate (as a decimal).
 * @param loanType - The type of loan ('conventional' or 'fha').
 * @returns An array of equity data points.
 */
const calculateEquityOver30Years = (
  loanAmount: number,
  propertyValue: number,
  appreciationRate: number,
  loanType: "conventional" | "fha"
): EquityDataPoint[] => {
  const equityData: EquityDataPoint[] = [];
  let currentEquity = propertyValue - loanAmount;
  let currentPropertyValue = propertyValue;

  // Initial equity point
  equityData.push({ year: 0, equity: currentEquity.toFixed(2) });

  for (let year = 1; year <= 30; year++) {
    currentPropertyValue *= 1 + appreciationRate;

    // FHA loans require mortgage insurance premiums (MIP) that can affect equity calculations
    if (loanType === "fha") {
      currentEquity = calculateFHAEquity(
        loanAmount,
        currentPropertyValue,
        year
      );
    } else {
      currentEquity = currentPropertyValue - loanAmount;
    }

    equityData.push({ year, equity: currentEquity.toFixed(2) });
  }

  return equityData;
};

/**
 * Calculates the estimated equity for an FHA loan, considering MIP.
 * This is a simplified example; actual MIP calculations can be more complex.
 *
 * @param loanAmount - The initial loan amount.
 * @param propertyValue - The current property value.
 * @param year - The current year of the loan.
 * @returns The estimated equity for the given year.
 */
const calculateFHAEquity = (
  loanAmount: number,
  propertyValue: number,
  year: number
): number => {
  // Example MIP calculation (replace with actual logic if needed)
  const mipRate = 0.01; // Assume a 1% annual MIP for this example
  const mip = loanAmount * mipRate;

  // Adjust equity based on MIP, typically paid until a certain equity threshold is reached
  let equity = propertyValue - loanAmount;
  if (equity < propertyValue * 0.2) {
    // Example: MIP paid until 20% equity
    equity -= mip;
  }
  return equity;
};

interface EquityChartProps {
  listingPrice: number;
  loanType: "conventional" | "fha";
}

export default function EquityChart({
  listingPrice,
  loanType,
}: EquityChartProps) {
  // Example: Assuming a 20% down payment - you'll likely calculate this dynamically
  const downPaymentPercent = 0.2;
  const loanAmount = listingPrice * (1 - downPaymentPercent);
  const equityData = calculateEquityOver30Years(
    loanAmount,
    listingPrice,
    0.03, // Assuming a 3% appreciation rate
    loanType
  );

  const chartData = equityData.map(({ year, equity }) => ({
    year: year.toString(),
    equity: new Decimal(equity).toNumber(), // Convert equity string to number
  }));

  const chartConfig = {
    equity: {
      label: "Equity",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{`Estimated Equity for ${
          loanType === "conventional" ? "Conventional Loan" : "FHA Loan"
        }`}</CardTitle>
        <CardDescription>
          Estimated equity growth over 30 years assuming a 3% rate of
          appreciation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              bottom: 24, // Add bottom margin for year labels
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={4}
            />
            <YAxis
              dataKey="equity" // Use 'equity' as the Y-axis data key
              tickFormatter={(value) => `$${value.toLocaleString()}`} // Format Y-axis labels as currency
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
              formatter={(value: number) => `$${value.toLocaleString()}`} // Format tooltip value as currency
            />
            <Area
              dataKey="equity"
              type="monotone" // Use 'monotone' for a smoother curve
              fill="var(--color-equity)"
              fillOpacity={0.4}
              stroke="var(--color-equity)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}