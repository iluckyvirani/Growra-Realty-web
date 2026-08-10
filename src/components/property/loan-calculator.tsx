"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { calculateEMI, formatPrice, cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LoanCalculatorProps {
  price: number;
  className?: string;
}

export function LoanCalculator({ price, className }: LoanCalculatorProps) {
  const [downPercent, setDownPercent] = useState(20);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const principal = price * (1 - downPercent / 100);
  const emi = calculateEMI(principal, rate, years);
  const totalPayable = emi * years * 12;
  const interest = totalPayable - principal;

  const chartData = useMemo(() => {
    const monthlyRate = rate / 12 / 100;
    let balance = principal;
    const points: { year: number; balance: number }[] = [{ year: 0, balance: Math.round(principal) }];
    for (let m = 1; m <= years * 12; m++) {
      const interestPart = balance * monthlyRate;
      const principalPart = emi - interestPart;
      balance = Math.max(0, balance - principalPart);
      if (m % 12 === 0) {
        points.push({ year: m / 12, balance: Math.round(balance) });
      }
    }
    return points;
  }, [principal, rate, years, emi]);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="border-b border-border bg-champagne/30">
        <CardTitle className="text-lg">EMI Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="rounded-2xl gold-gradient p-5 text-white shadow-md shadow-gold/20">
          <p className="text-sm text-white/80">Estimated monthly EMI</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight">{formatPrice(emi)}</p>
          <p className="mt-2 text-xs text-white/70">
            Loan amount {formatPrice(principal)} · {years} years @ {rate}%
          </p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <Label>Down payment</Label>
              <span className="font-medium text-gold-rich">
                {downPercent}% · {formatPrice(price * (downPercent / 100))}
              </span>
            </div>
            <Slider
              min={10}
              max={50}
              step={5}
              value={[downPercent]}
              onValueChange={([v]) => setDownPercent(v)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <Label>Interest rate</Label>
              <span className="font-medium">{rate.toFixed(1)}% p.a.</span>
            </div>
            <Slider
              min={6}
              max={14}
              step={0.1}
              value={[rate]}
              onValueChange={([v]) => setRate(v)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <Label>Tenure</Label>
              <span className="font-medium">{years} years</span>
            </div>
            <Slider
              min={5}
              max={30}
              step={1}
              value={[years]}
              onValueChange={([v]) => setYears(v)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl border border-border bg-cream/50 p-3 dark:bg-ink/40">
            <p className="text-muted">Total interest</p>
            <p className="mt-1 font-semibold">{formatPrice(interest)}</p>
          </div>
          <div className="rounded-2xl border border-border bg-cream/50 p-3 dark:bg-ink/40">
            <p className="text-muted">Total payable</p>
            <p className="mt-1 font-semibold">{formatPrice(totalPayable)}</p>
          </div>
        </div>

        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C89B3C" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#C89B3C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="year"
                tick={{ fontSize: 11, fill: "#6B7280" }}
                axisLine={false}
                tickLine={false}
                unit="y"
              />
              <YAxis hide />
              <Tooltip
                formatter={(value) => formatPrice(Number(value))}
                labelFormatter={(y) => `Year ${y}`}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #E8E2D8",
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#B8860B"
                strokeWidth={2}
                fill="url(#balanceFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
