"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const WEEKLY_VIEWS = [
  { day: "Mon", views: 42, inquiries: 4 },
  { day: "Tue", views: 58, inquiries: 7 },
  { day: "Wed", views: 51, inquiries: 5 },
  { day: "Thu", views: 76, inquiries: 9 },
  { day: "Fri", views: 88, inquiries: 11 },
  { day: "Sat", views: 64, inquiries: 6 },
  { day: "Sun", views: 47, inquiries: 3 },
];

export function ViewsChart() {
  return (
    <Card className="border-border/80 bg-gradient-to-br from-card to-champagne/20 shadow-lg shadow-charcoal/5">
      <CardHeader>
        <CardTitle>Views this week</CardTitle>
        <CardDescription>Listing traffic and inquiry volume across the last 7 days.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={WEEKLY_VIEWS} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C89B3C" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#C89B3C" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,155,60,0.15)" />
              <XAxis dataKey="day" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 16,
                  border: "1px solid #E8E2D8",
                  boxShadow: "0 8px 24px rgba(27,27,27,0.08)",
                }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#B8860B"
                strokeWidth={2.5}
                fill="url(#viewsFill)"
                name="Views"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={WEEKLY_VIEWS} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,155,60,0.12)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 16,
                  border: "1px solid #E8E2D8",
                  boxShadow: "0 8px 24px rgba(27,27,27,0.08)",
                }}
              />
              <Bar dataKey="inquiries" fill="#C89B3C" radius={[8, 8, 4, 4]} name="Inquiries" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
