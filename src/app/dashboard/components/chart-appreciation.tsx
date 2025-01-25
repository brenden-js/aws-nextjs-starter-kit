"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../../../components/ui/chart"

// Function to calculate estimated appreciation
const calculateAppreciation = (
  listingPrice: number,
  appreciationRate: number
): { year: number; price: number }[] => {
  const data = [];
  let price = listingPrice;
  for (let year = 0; year <= 30; year++) {
    data.push({ year, price: Math.round(price) });
    price *= 1 + appreciationRate / 100;
  }
  return data;
};

export const description = "Estimated House Appreciation Over 30 Years";

const listingPrice = 800000;
const chartData3Percent = calculateAppreciation(listingPrice, 3);
const chartData5Percent = calculateAppreciation(listingPrice, 5);

const chartConfig = {
  "3-percent": {
    label: "3% Growth",
    color: "hsl(var(--chart-1))",
    icon: TrendingUp,
  },
  "5-percent": {
    label: "5% Growth",
    color: "hsl(var(--chart-2))",
    icon: TrendingUp,
  },
} satisfies ChartConfig;

export function AppreciationChart() {
  // Create a custom tooltip formatter function
  const customTooltipFormatter = (value: number, name: string) => {
    return (
      <div>
        <div>{name}</div>
        <div>${value.toLocaleString()}</div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estimated House Appreciation</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="aspect-auto h-[250px] w-full" config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData3Percent}
            margin={{
              left: 12,
              right: 12,
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
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
              // Use the custom tooltip formatter
              formatter={customTooltipFormatter}
            />
            <Area
              dataKey="price"
              name="5% Growth" // Add name for tooltip
              type="natural"
              fill="var(--color-5-percent)"
              fillOpacity={0.4}
              stroke="var(--color-5-percent)"
              stackId="a"
              data={chartData5Percent}
            />
            <Area
              dataKey="price"
              name="3% Growth" // Add name for tooltip
              type="natural"
              fill="var(--color-3-percent)"
              fillOpacity={0.4}
              stroke="var(--color-3-percent)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Estimated appreciation based on 3% and 5% annual growth.
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}