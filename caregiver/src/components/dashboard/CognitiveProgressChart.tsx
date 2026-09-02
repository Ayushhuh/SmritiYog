"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { CognitiveProgressPoint } from "@/types/dashboard";

interface CognitiveProgressChartProps {
  data: CognitiveProgressPoint[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface rounded-[8px] px-3 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.1)] border border-text-muted/10">
      <p className="text-[12px] text-text-muted">{label}</p>
      <p className="text-[14px] font-semibold text-text-primary">
        {payload[0].value}%
      </p>
    </div>
  );
}

export default function CognitiveProgressChart({
  data,
}: CognitiveProgressChartProps) {
  // Accessible summary
  const firstScore = data.length > 0 ? data[0].score : 0;
  const lastScore = data.length > 0 ? data[data.length - 1].score : 0;
  const trend = lastScore >= firstScore ? "increased" : "decreased";
  const summary = `Cognitive performance ${trend} from ${firstScore}% ${data[0]?.day ?? ""} to ${lastScore}% ${data[data.length - 1]?.day ?? ""}.`;

  return (
    <div className="bg-surface rounded-[var(--radius-md)] p-5 lg:p-6">
      <div className="mb-4">
        <h3 className="text-[17px] font-semibold text-text-primary">
          Cognitive Progress
        </h3>
        <p className="text-[13px] text-text-muted mt-0.5">Last 7 days</p>
      </div>

      {/* Accessible summary for screen readers */}
      <p className="sr-only">{summary}</p>

      {/* Visual summary for all users */}
      <p className="text-[13px] text-text-secondary mb-4" aria-hidden="true">
        {summary}
      </p>

      <div className="h-[200px] lg:h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(118,106,95,0.1)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: "#766A5F" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: "#766A5F" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#C65D3A"
              strokeWidth={2.5}
              dot={{ fill: "#C65D3A", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: "#C65D3A", strokeWidth: 2, stroke: "#fff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
