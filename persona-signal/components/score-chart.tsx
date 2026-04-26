"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { DecisionMode, PersonaComparisonResult } from "@/lib/types";

interface Props {
  results: PersonaComparisonResult[];
  avgScoreA: number;
  avgScoreB: number;
  decisionMode?: DecisionMode;
}

export default function ScoreChart({ results, avgScoreA, avgScoreB, decisionMode = "compare" }: Props) {
  const isReview = decisionMode === "review";
  const data = isReview
    ? [{ name: "검토안", score: avgScoreA, fill: "#3b82f6" }]
    : [
        { name: "카피 A", score: avgScoreA, fill: "#3b82f6" },
        { name: "카피 B", score: avgScoreB, fill: "#7c3aed" },
      ];

  const perPersona = results.map((r, i) => ({
    name: `P${i + 1}`,
    A: r.reactionA.purchaseIntent,
    B: isReview ? undefined : r.reactionB.purchaseIntent,
    label: `${r.persona.age}세 ${r.persona.sex}`,
  }));

  return (
    <div className="space-y-4">
      {/* 평균 비교 바 */}
      <div>
        <p className="text-xs text-slate-400 mb-2">
          {isReview ? "평균 사용 의향" : "평균 구매의향 비교"}
        </p>
        <ResponsiveContainer width="100%" height={80}>
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24 }}>
            <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={52} />
            <Tooltip
              formatter={(v) => [`${Number(v).toFixed(1)} / 5`, "구매의향"]}
              contentStyle={{ fontSize: 12 }}
            />
            <Bar dataKey="score" radius={[0, 4, 4, 0]}>
              {data.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 페르소나별 점수 */}
      <div>
        <p className="text-xs text-slate-400 mb-2">
          {isReview ? "페르소나별 사용 의향" : "페르소나별 구매의향"}
        </p>
        <ResponsiveContainer width="100%" height={Math.max(120, results.length * 30)}>
          <BarChart data={perPersona} layout="vertical" margin={{ left: 56, right: 24 }}>
            <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 10 }} />
            <YAxis type="category" dataKey="label" tick={{ fontSize: 10 }} width={52} />
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <Tooltip contentStyle={{ fontSize: 11 }} />
            <Bar dataKey="A" name={isReview ? "검토안" : "카피 A"} fill="#3b82f6" radius={[2, 2, 2, 2]} />
            {!isReview && (
              <Bar dataKey="B" name="카피 B" fill="#7c3aed" radius={[2, 2, 2, 2]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
