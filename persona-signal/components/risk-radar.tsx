"use client";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip, Legend,
} from "recharts";
import { RiskAxes } from "@/lib/types";

interface Props {
  axesA: RiskAxes;
  axesB: RiskAxes;
}

const AXIS_LABELS: Record<keyof RiskAxes, string> = {
  comprehension: "이해도",
  trust: "신뢰도",
  appeal: "매력도",
  resistance: "거부감▲",
  confusionRisk: "혼란▲",
};

const RISK_AXES: (keyof RiskAxes)[] = ["comprehension", "trust", "appeal", "resistance", "confusionRisk"];

export default function RiskRadar({ axesA, axesB }: Props) {
  const data = RISK_AXES.map((key) => ({
    axis: AXIS_LABELS[key],
    A: axesA[key],
    B: axesB[key],
  }));

  return (
    <div>
      <p className="text-xs text-slate-400 mb-1">
        5축 리스크 비교 <span className="text-slate-300">(▲ 높을수록 위험)</span>
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <RadarChart data={data} margin={{ top: 4, right: 24, bottom: 4, left: 24 }}>
          <PolarGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fontSize: 11, fill: "#64748b" }}
          />
          <Radar
            name="카피 A"
            dataKey="A"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.15}
            strokeWidth={2}
          />
          <Radar
            name="카피 B"
            dataKey="B"
            stroke="#7c3aed"
            fill="#7c3aed"
            fillOpacity={0.15}
            strokeWidth={2}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11 }}
          />
          <Tooltip
            formatter={(v, name) => [`${Number(v).toFixed(1)} / 5`, name]}
            contentStyle={{ fontSize: 11 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
