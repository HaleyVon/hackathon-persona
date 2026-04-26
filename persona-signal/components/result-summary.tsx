import { SimulationSummary } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  summary: SimulationSummary;
  variantA: string;
  variantB: string;
}

export default function ResultSummary({ summary, variantA, variantB }: Props) {
  if (summary.decisionMode === "review") {
    return <ReviewSummary summary={summary} variantA={variantA} />;
  }

  const { riskAxesA, riskAxesB, winner } = summary;

  // Card 1: 더 명확한 안 (comprehension 기준)
  const clearer =
    riskAxesA && riskAxesB
      ? riskAxesA.comprehension >= riskAxesB.comprehension ? "A" : "B"
      : winner;
  const clearerScore =
    clearer === "A" ? riskAxesA?.comprehension : riskAxesB?.comprehension;

  // Card 2: 신뢰 리스크 (trust가 낮은 쪽)
  const lowTrustVariant =
    riskAxesA && riskAxesB
      ? riskAxesA.trust <= riskAxesB.trust ? "A" : "B"
      : null;
  const lowTrustScore =
    lowTrustVariant === "A" ? riskAxesA?.trust : riskAxesB?.trust;

  // Card 3: 혼란 리스크 (confusionRisk가 높은 쪽)
  const highConfusionVariant =
    riskAxesA && riskAxesB
      ? riskAxesA.confusionRisk >= riskAxesB.confusionRisk ? "A" : "B"
      : null;
  const highConfusionScore =
    highConfusionVariant === "A" ? riskAxesA?.confusionRisk : riskAxesB?.confusionRisk;

  const hasRiskData = riskAxesA && riskAxesB;

  if (!hasRiskData) {
    return <LegacySummary summary={summary} variantA={variantA} variantB={variantB} />;
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {/* 더 명확한 안 */}
      <Card className="border-blue-100 bg-blue-50/50">
        <CardContent className="pt-4 pb-4">
          <p className="text-xs text-slate-400 mb-1">더 명확한 안</p>
          <p className="text-3xl font-bold text-blue-600">
            카피 {clearer}
            <span className="text-sm font-normal text-slate-400 ml-1">이해도 {clearerScore?.toFixed(1)}/5</span>
          </p>
          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
            {clearer === "A" ? variantA : variantB}
          </p>
        </CardContent>
      </Card>

      {/* 신뢰 리스크 */}
      <Card className={`${lowTrustScore && lowTrustScore < 3 ? "border-amber-200 bg-amber-50/50" : "border-slate-100"}`}>
        <CardContent className="pt-4 pb-4">
          <p className="text-xs text-slate-400 mb-1">신뢰 리스크</p>
          {lowTrustVariant ? (
            <>
              <p className={`text-3xl font-bold ${lowTrustScore && lowTrustScore < 3 ? "text-amber-600" : "text-slate-600"}`}>
                카피 {lowTrustVariant}
                <span className="text-sm font-normal text-slate-400 ml-1">trust {lowTrustScore?.toFixed(1)}/5</span>
              </p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {lowTrustScore && lowTrustScore < 3 ? "신뢰도가 낮습니다 — 근거/수치 보강 필요" : "신뢰도 양호"}
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-400">데이터 없음</p>
          )}
        </CardContent>
      </Card>

      {/* 혼란 리스크 */}
      <Card className={`${highConfusionScore && highConfusionScore > 3 ? "border-red-200 bg-red-50/50" : "border-slate-100"}`}>
        <CardContent className="pt-4 pb-4">
          <p className="text-xs text-slate-400 mb-1">혼란 리스크</p>
          {highConfusionVariant ? (
            <>
              <p className={`text-3xl font-bold ${highConfusionScore && highConfusionScore > 3 ? "text-red-600" : "text-slate-600"}`}>
                카피 {highConfusionVariant}
                <span className="text-sm font-normal text-slate-400 ml-1">혼란 {highConfusionScore?.toFixed(1)}/5</span>
              </p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {highConfusionScore && highConfusionScore > 3 ? "오해 가능성 높음 — 문구 구체화 필요" : "혼란 리스크 낮음"}
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-400">데이터 없음</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ReviewSummary({
  summary, variantA,
}: {
  summary: SimulationSummary;
  variantA: string;
}) {
  const trust = summary.riskAxesA?.trust;
  const confusion = summary.riskAxesA?.confusionRisk;

  return (
    <div className="grid grid-cols-3 gap-3">
      <Card className="border-blue-100 bg-blue-50/50">
        <CardContent className="pt-4 pb-4">
          <p className="text-xs text-slate-400 mb-1">전체 반응</p>
          <p className="text-3xl font-bold text-blue-600">
            {summary.avgScoreA.toFixed(1)}
            <span className="text-sm font-normal text-slate-400 ml-1">사용 의향 / 5</span>
          </p>
          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
            {variantA}
          </p>
        </CardContent>
      </Card>

      <Card className={`${trust !== undefined && trust < 3 ? "border-amber-200 bg-amber-50/50" : "border-slate-100"}`}>
        <CardContent className="pt-4 pb-4">
          <p className="text-xs text-slate-400 mb-1">신뢰 리스크</p>
          {trust !== undefined ? (
            <>
              <p className={`text-3xl font-bold ${trust < 3 ? "text-amber-600" : "text-slate-600"}`}>
                {trust.toFixed(1)}
                <span className="text-sm font-normal text-slate-400 ml-1">trust / 5</span>
              </p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {trust < 3 ? "신뢰 보강 요소가 필요합니다." : "신뢰도는 비교적 양호합니다."}
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-400">데이터 없음</p>
          )}
        </CardContent>
      </Card>

      <Card className={`${confusion !== undefined && confusion > 3 ? "border-red-200 bg-red-50/50" : "border-slate-100"}`}>
        <CardContent className="pt-4 pb-4">
          <p className="text-xs text-slate-400 mb-1">혼란 리스크</p>
          {confusion !== undefined ? (
            <>
              <p className={`text-3xl font-bold ${confusion > 3 ? "text-red-600" : "text-slate-600"}`}>
                {confusion.toFixed(1)}
                <span className="text-sm font-normal text-slate-400 ml-1">혼란 / 5</span>
              </p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {confusion > 3 ? "메시지가 추상적이거나 오해될 수 있습니다." : "메시지 이해도는 비교적 안정적입니다."}
              </p>
            </>
          ) : (
            <p className="text-sm text-slate-400">데이터 없음</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function LegacySummary({
  summary, variantA, variantB,
}: {
  summary: SimulationSummary; variantA: string; variantB: string;
}) {
  const { winner, avgScoreA, avgScoreB } = summary;
  const diff = Math.abs(avgScoreA - avgScoreB).toFixed(1);
  const isTie = winner === "Tie";

  return (
    <div className="grid grid-cols-3 gap-3">
      <Card className="border-blue-100">
        <CardContent className="pt-4 pb-4">
          <p className="text-xs text-slate-400 mb-1">카피 A 매력도</p>
          <p className="text-3xl font-bold text-blue-600">{avgScoreA.toFixed(1)}<span className="text-base font-normal text-slate-400">/5</span></p>
          <p className="text-xs text-slate-500 mt-2 line-clamp-2">{variantA}</p>
        </CardContent>
      </Card>
      <Card className="border-violet-100">
        <CardContent className="pt-4 pb-4">
          <p className="text-xs text-slate-400 mb-1">카피 B 매력도</p>
          <p className="text-3xl font-bold text-violet-600">{avgScoreB.toFixed(1)}<span className="text-base font-normal text-slate-400">/5</span></p>
          <p className="text-xs text-slate-500 mt-2 line-clamp-2">{variantB}</p>
        </CardContent>
      </Card>
      <Card className={isTie ? "bg-slate-50" : "bg-blue-50"}>
        <CardContent className="pt-4 pb-4">
          <p className="text-xs text-slate-400 mb-1">더 명확한 안</p>
          <p className={`text-3xl font-bold ${isTie ? "text-slate-500" : "text-blue-600"}`}>
            {isTie ? "동률" : `카피 ${winner}`}
          </p>
          {!isTie && <p className="text-xs text-slate-500 mt-1">{winner === "A" ? "A" : "B"}가 {diff}점 더 높음</p>}
        </CardContent>
      </Card>
    </div>
  );
}
