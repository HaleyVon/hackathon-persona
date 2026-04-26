"use client";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip, Legend,
} from "recharts";
import { InputType, RiskAxes } from "@/lib/types";
import { DISPLAY_AXIS_LABELS, getVariantLabel, toDisplayRiskAxes } from "@/lib/display";

interface Props {
  axesA: RiskAxes;
  axesB?: RiskAxes;
  inputType?: InputType;
}

const RISK_AXES = ["comprehension", "trust", "appeal", "acceptance", "clarity"] as const;

export default function RiskRadar({ axesA, axesB, inputType = "copy" }: Props) {
  const displayA = toDisplayRiskAxes(axesA);
  const displayB = axesB ? toDisplayRiskAxes(axesB) : undefined;
  const data = RISK_AXES.map((key) => ({
    axis: DISPLAY_AXIS_LABELS[key],
    A: displayA[key],
    B: displayB?.[key],
  }));

  return (
    <div>
      <p className="text-xs text-slate-400 mb-1">
        {axesB ? "공통 5축 비교" : "공통 5축 분석"} <span className="text-slate-300">(높을수록 긍정적)</span>
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <RadarChart data={data} margin={{ top: 4, right: 24, bottom: 4, left: 24 }}>
          <PolarGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fontSize: 11, fill: "#64748b" }}
          />
          <Radar
            name={axesB ? getVariantLabel(inputType, "A") : getVariantLabel(inputType, "A", "review")}
            dataKey="A"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.15}
            strokeWidth={2}
          />
          {axesB && (
            <Radar
              name={getVariantLabel(inputType, "B")}
              dataKey="B"
              stroke="#7c3aed"
              fill="#7c3aed"
              fillOpacity={0.15}
              strokeWidth={2}
            />
          )}
          {axesB && (
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 11 }}
            />
          )}
          <Tooltip
            formatter={(v, name) => [`${Number(v).toFixed(1)} / 5`, name]}
            contentStyle={{ fontSize: 11 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
