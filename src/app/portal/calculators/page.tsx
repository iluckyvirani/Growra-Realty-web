"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Calculator, HardHat, LandPlot, Landmark } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store";
import { cn } from "@/lib/utils";

/** All conversions anchored to square feet. */
const AREA_UNITS = [
  { id: "sqft", label: "Square Feet (sq ft)", toSqft: 1 },
  { id: "sqm", label: "Square Meter (sq m)", toSqft: 10.76391041671 },
  { id: "gaj", label: "Gaj / Sq Yard", toSqft: 9 },
  { id: "marla", label: "Marla", toSqft: 272.25 },
  { id: "kanal", label: "Kanal", toSqft: 5445 },
  { id: "acre", label: "Acre", toSqft: 43560 },
  { id: "hectare", label: "Hectare", toSqft: 107639.1041671 },
] as const;

type AreaUnitId = (typeof AREA_UNITS)[number]["id"];

function formatNum(n: number, digits = 2) {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-IN", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  });
}

function formatINR(n: number) {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

function ResultRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/60 py-2.5 last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <span className={cn("text-sm text-charcoal", strong && "text-base font-semibold text-gold-rich")}>
        {value}
      </span>
    </div>
  );
}

function AreaCalculator() {
  const [value, setValue] = useState("1000");
  const [fromUnit, setFromUnit] = useState<AreaUnitId>("sqft");

  const results = useMemo(() => {
    const raw = Number(value);
    if (!Number.isFinite(raw) || raw < 0) return null;
    const from = AREA_UNITS.find((u) => u.id === fromUnit)!;
    const sqft = raw * from.toSqft;
    return AREA_UNITS.map((u) => ({
      id: u.id,
      label: u.label,
      value: sqft / u.toSqft,
    }));
  }, [value, fromUnit]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-4">
        <Field label="Value">
          <Input
            type="number"
            min={0}
            step="any"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter area"
          />
        </Field>
        <Field label="Convert from">
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value as AreaUnitId)}
            className="flex h-10 w-full rounded-[8px] border border-border bg-surface px-3 text-sm"
          >
            {AREA_UNITS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </Field>
        <p className="rounded-md border border-border/70 bg-champagne/30 px-3 py-2 text-xs text-muted">
          1 Gaj = 9 sq ft · 1 Marla = 272.25 sq ft · 1 Kanal = 20 Marla · 1 Acre = 43,560 sq ft
        </p>
      </div>
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Converted area</CardTitle>
          <CardDescription>Same plot in all common units</CardDescription>
        </CardHeader>
        <CardContent>
          {results ? (
            results.map((r) => (
              <ResultRow
                key={r.id}
                label={r.label}
                value={formatNum(r.value, r.id === "sqft" || r.id === "gaj" ? 2 : 4)}
                strong={r.id === fromUnit}
              />
            ))
          ) : (
            <p className="py-6 text-center text-sm text-muted">Enter a valid area</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ConstructionCalculator() {
  const [plotSqft, setPlotSqft] = useState("1000");
  const [floors, setFloors] = useState("2");
  const [coverage, setCoverage] = useState("70");
  const [rate, setRate] = useState("2200");
  const [contingency, setContingency] = useState("10");

  const result = useMemo(() => {
    const plot = Number(plotSqft);
    const fl = Number(floors);
    const cov = Number(coverage);
    const costPerSqft = Number(rate);
    const cont = Number(contingency);
    if (![plot, fl, cov, costPerSqft, cont].every((n) => Number.isFinite(n) && n >= 0)) return null;
    if (plot <= 0 || fl <= 0 || costPerSqft <= 0) return null;

    const builtPerFloor = plot * (cov / 100);
    const totalBuiltUp = builtPerFloor * fl;
    const baseCost = totalBuiltUp * costPerSqft;
    const contingencyAmt = baseCost * (cont / 100);
    const total = baseCost + contingencyAmt;

    return { builtPerFloor, totalBuiltUp, baseCost, contingencyAmt, total };
  }, [plotSqft, floors, coverage, rate, contingency]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Plot area (sq ft)">
          <Input type="number" min={0} value={plotSqft} onChange={(e) => setPlotSqft(e.target.value)} />
        </Field>
        <Field label="Number of floors">
          <Input type="number" min={1} step={1} value={floors} onChange={(e) => setFloors(e.target.value)} />
        </Field>
        <Field label="Ground coverage (%)" hint="Share of plot used per floor">
          <Input type="number" min={0} max={100} value={coverage} onChange={(e) => setCoverage(e.target.value)} />
        </Field>
        <Field label="Construction rate (₹ / sq ft)">
          <Input type="number" min={0} value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label="Contingency (%)" hint="Extra buffer for extras / price rise">
          <Input
            type="number"
            min={0}
            max={50}
            value={contingency}
            onChange={(e) => setContingency(e.target.value)}
          />
        </Field>
      </div>
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Estimated cost</CardTitle>
          <CardDescription>Rough budget for discussion with clients</CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <>
              <ResultRow label="Built-up / floor" value={`${formatNum(result.builtPerFloor)} sq ft`} />
              <ResultRow label="Total built-up" value={`${formatNum(result.totalBuiltUp)} sq ft`} />
              <ResultRow label="Base construction" value={formatINR(result.baseCost)} />
              <ResultRow label="Contingency" value={formatINR(result.contingencyAmt)} />
              <ResultRow label="Total estimate" value={formatINR(result.total)} strong />
            </>
          ) : (
            <p className="py-6 text-center text-sm text-muted">Enter valid construction details</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EmiCalculator() {
  const [principal, setPrincipal] = useState("5000000");
  const [rate, setRate] = useState("8.5");
  const [years, setYears] = useState("20");

  const result = useMemo(() => {
    const P = Number(principal);
    const annual = Number(rate);
    const y = Number(years);
    if (![P, annual, y].every((n) => Number.isFinite(n) && n > 0)) return null;

    const n = y * 12;
    const r = annual / 12 / 100;
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    return { emi, totalPayment, totalInterest, months: n };
  }, [principal, rate, years]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-4">
        <Field label="Loan amount (₹)">
          <Input type="number" min={0} value={principal} onChange={(e) => setPrincipal(e.target.value)} />
        </Field>
        <Field label="Interest rate (% p.a.)">
          <Input type="number" min={0} step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label="Tenure (years)">
          <Input type="number" min={1} step={1} value={years} onChange={(e) => setYears(e.target.value)} />
        </Field>
      </div>
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">EMI breakdown</CardTitle>
          <CardDescription>Monthly EMI and total payable</CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <>
              <ResultRow label="Monthly EMI" value={formatINR(result.emi)} strong />
              <ResultRow label="Tenure" value={`${result.months} months`} />
              <ResultRow label="Principal" value={formatINR(Number(principal))} />
              <ResultRow label="Total interest" value={formatINR(result.totalInterest)} />
              <ResultRow label="Total payment" value={formatINR(result.totalPayment)} />
            </>
          ) : (
            <p className="py-6 text-center text-sm text-muted">Enter valid loan details</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function PortalCalculatorsPage() {
  const router = useRouter();
  const role = useAuthStore((s) => s.user?.role);

  useEffect(() => {
    if (role === "owner") router.replace("/portal");
  }, [role, router]);

  if (role !== "agent") return null;

  return (
    <div className="mx-auto max-w-8xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-charcoal">Calculators</h1>
        <p className="mt-1 text-sm text-muted">
          Area conversion (Gaj, Marla…), construction estimate, and home loan EMI — for client discussions.
        </p>
      </div>

      <Tabs defaultValue="area" className="w-full">
        <TabsList className="mb-4 flex h-auto w-full flex-wrap justify-start gap-1 rounded-lg bg-champagne/40 p-1">
          <TabsTrigger value="area" className="gap-1.5 rounded-md data-[state=active]:bg-white">
            <LandPlot className="h-3.5 w-3.5" />
            Area
          </TabsTrigger>
          <TabsTrigger value="construction" className="gap-1.5 rounded-md data-[state=active]:bg-white">
            <HardHat className="h-3.5 w-3.5" />
            Construction
          </TabsTrigger>
          <TabsTrigger value="emi" className="gap-1.5 rounded-md data-[state=active]:bg-white">
            <Landmark className="h-3.5 w-3.5" />
            EMI
          </TabsTrigger>
        </TabsList>

        <TabsContent value="area">
          <Card className="border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <LandPlot className="h-5 w-5 text-gold" />
                Area calculator
              </CardTitle>
              <CardDescription>
                Convert between sq ft, sq m, Gaj, Marla, Kanal, Acre and Hectare.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AreaCalculator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="construction">
          <Card className="border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <HardHat className="h-5 w-5 text-gold" />
                Construction calculator
              </CardTitle>
              <CardDescription>
                Estimate built-up area and construction budget from plot size and rate.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConstructionCalculator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emi">
          <Card className="border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calculator className="h-5 w-5 text-gold" />
                EMI calculator
              </CardTitle>
              <CardDescription>Calculate monthly EMI, interest and total repayment.</CardDescription>
            </CardHeader>
            <CardContent>
              <EmiCalculator />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
