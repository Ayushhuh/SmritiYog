"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { CognitiveProgressPoint } from "@/lib/dashboard/types";
import { useI18n } from "@/lib/i18n/store";

export function CognitiveProgressChart({
  data,
  summary,
}: {
  data: CognitiveProgressPoint[];
  summary: string;
}) {
  const { t } = useI18n();

  const localizedData = data.map((point) => ({
    ...point,
    day: point.day.startsWith("content.") ? t(point.day) : point.day,
  }));

  return (
    <div className="flex w-full flex-col">
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={localizedData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="#EAD9C6" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: "#766A5F", fontSize: 13 }}
              axisLine={{ stroke: "#EAD9C6" }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#766A5F", fontSize: 13 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ stroke: "#E6A23C", strokeWidth: 1 }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #EAD9C6",
                backgroundColor: "#FFFFFF",
                color: "#2B2118",
                fontSize: 14,
              }}
              formatter={(value) => [`${value}%`, t("chart.score")]}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#C65D3A"
              strokeWidth={2.5}
              fill="#C65D3A"
              fillOpacity={0.08}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-4 text-[13px] leading-relaxed text-muted">{t(summary)}</p>
    </div>
  );
}