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
      <p className="mb-2 text-sm font-semibold text-slate-500">
        {axesB ? "공통 5축 비교" : "공통 5축 분석"} <span className="font-normal text-slate-400">(높을수록 긍정적)</span>
      </p>
      <ResponsiveContainer width="100%" height={360}>
        <RadarChart data={data} margin={{ top: 16, right: 52, bottom: 16, left: 52 }}>
          <PolarGrid strokeDasharray="3 3" stroke="#cbd5e1" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fontSize: 13, fontWeight: 700, fill: "#334155" }}
          />
          <Radar
            name={axesB ? getVariantLabel(inputType, "A") : getVariantLabel(inputType, "A", "review")}
            dataKey="A"
            stroke="#0891b2"
            fill="#0891b2"
            fillOpacity={0.18}
            strokeWidth={3}
          />
          {axesB && (
            <Radar
              name={getVariantLabel(inputType, "B")}
              dataKey="B"
              stroke="#7c3aed"
              fill="#7c3aed"
              fillOpacity={0.18}
              strokeWidth={3}
              strokeDasharray="7 4"
            />
          )}
          {axesB && (
            <Legend
              iconType="circle"
              iconSize={10}
              wrapperStyle={{ fontSize: 13, fontWeight: 700, paddingTop: 8 }}
            />
          )}
          <Tooltip
            formatter={(v, name) => [`${Number(v).toFixed(1)} / 5`, name]}
            contentStyle={{ fontSize: 12, borderRadius: 10 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
