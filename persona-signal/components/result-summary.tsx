import { SimulationSummary } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  summary: SimulationSummary;
  variantA: string;
  variantB: string;
}

export default function ResultSummary({ summary, variantA, variantB }: Props) {
  const { winner, avgScoreA, avgScoreB } = summary;

  return (
    <div className="grid grid-cols-3 gap-3">
      <ScoreCard
        label="카피 A 평균 구매의향"
        score={avgScoreA}
        copy={variantA}
        color="blue"
        isWinner={winner === "A"}
      />
      <ScoreCard
        label="카피 B 평균 구매의향"
        score={avgScoreB}
        copy={variantB}
        color="violet"
        isWinner={winner === "B"}
      />
      <WinnerCard winner={winner} scoreA={avgScoreA} scoreB={avgScoreB} />
    </div>
  );
}

function ScoreCard({
  label, score, copy, color, isWinner,
}: {
  label: string; score: number; copy: string;
  color: "blue" | "violet"; isWinner: boolean;
}) {
  const colorMap = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", ring: "ring-blue-200" },
    violet: { bg: "bg-violet-50", text: "text-violet-600", ring: "ring-violet-200" },
  };
  const c = colorMap[color];

  return (
    <Card className={`relative ${isWinner ? `ring-2 ${c.ring}` : ""}`}>
      <CardContent className="pt-4 pb-4">
        {isWinner && (
          <Badge className="absolute -top-2 left-3 text-xs bg-emerald-500 hover:bg-emerald-500">
            승자
          </Badge>
        )}
        <p className="text-xs text-slate-400 mb-1">{label}</p>
        <p className={`text-3xl font-bold ${c.text}`}>{score.toFixed(1)}<span className="text-base font-normal text-slate-400">/5</span></p>
        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{copy}</p>
      </CardContent>
    </Card>
  );
}

function WinnerCard({ winner, scoreA, scoreB }: { winner: string; scoreA: number; scoreB: number }) {
  const diff = Math.abs(scoreA - scoreB).toFixed(1);
  const isA = winner === "A";
  const isTie = winner === "Tie";

  return (
    <Card className={`${isTie ? "bg-slate-50" : "bg-emerald-50 ring-2 ring-emerald-200"}`}>
      <CardContent className="pt-4 pb-4 flex flex-col justify-between h-full">
        <p className="text-xs text-slate-400">최종 승자</p>
        <div>
          <p className={`text-3xl font-bold ${isTie ? "text-slate-500" : "text-emerald-600"}`}>
            {isTie ? "동률" : `카피 ${winner}`}
          </p>
          {!isTie && (
            <p className="text-xs text-emerald-600 mt-1">
              {isA ? "A" : "B"}가 {diff}점 더 높음
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
