"use client";
import { useState } from "react";
import { DecisionMode, PersonaComparisonResult } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  result: PersonaComparisonResult;
  index: number;
  decisionMode?: DecisionMode;
}

export default function PersonaCard({ result, index, decisionMode = "compare" }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { persona, reactionA, reactionB, preferredVariant, preferenceReason } = result;
  const isReview = decisionMode === "review";

  const winnerColor =
    isReview
      ? "bg-blue-100 text-blue-700 border-blue-200"
      : preferredVariant === "A"
      ? "bg-blue-100 text-blue-700 border-blue-200"
      : preferredVariant === "B"
      ? "bg-violet-100 text-violet-700 border-violet-200"
      : "bg-slate-100 text-slate-600";

  return (
    <Card className="border-slate-100 hover:border-slate-200 transition-colors">
      <CardContent className="pt-4 pb-4">
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-slate-400">P{index + 1}</span>
              <span className="text-sm font-semibold text-slate-700">
                {persona.age}세 {persona.sex}
              </span>
              <Badge variant="outline" className="text-xs px-1.5 py-0">
                {persona.occupation}
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              {persona.province}{persona.district ? ` · ${persona.district.split("-")[1]}` : ""}
              {persona.education_level ? ` · ${persona.education_level}` : ""}
            </p>
          </div>
          <Badge className={`text-xs shrink-0 ${winnerColor}`}>
            {isReview ? "단일 검토" : preferredVariant === "Tie" ? "동률" : `카피 ${preferredVariant} 선호`}
          </Badge>
        </div>

        {/* 선호 이유 */}
        <p className="text-xs text-slate-600 leading-relaxed mb-3 pl-0.5 border-l-2 border-slate-200 pl-2">
          {preferenceReason}
        </p>

        {/* A/B 반응 요약 */}
        <div className={`grid gap-2 mb-3 ${isReview ? "grid-cols-1" : "grid-cols-2"}`}>
          <ReactionBlock label="카피 A" color="blue" reaction={reactionA} />
          {!isReview && <ReactionBlock label="카피 B" color="violet" reaction={reactionB} />}
        </div>

        {/* 상세 토글 */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          {expanded ? "▲ 접기" : "▼ 상세 반응 보기"}
        </button>

        {expanded && (
          <div className={`mt-3 grid gap-3 ${isReview ? "grid-cols-1" : "grid-cols-2"}`}>
            <DetailBlock label="카피 A" color="blue" reaction={reactionA} />
            {!isReview && <DetailBlock label="카피 B" color="violet" reaction={reactionB} />}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ReactionBlock({
  label, color, reaction,
}: {
  label: string;
  color: "blue" | "violet";
  reaction: { purchaseIntent: number; oneSentenceReaction: string };
}) {
  const c = color === "blue" ? "bg-blue-50 text-blue-600" : "bg-violet-50 text-violet-600";
  return (
    <div className={`rounded-lg px-3 py-2 ${c}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-bold">{label}</span>
        <span className="text-[11px] font-bold">{reaction.purchaseIntent}/5</span>
      </div>
      <p className="text-[11px] leading-relaxed opacity-80 line-clamp-2">
        {reaction.oneSentenceReaction}
      </p>
    </div>
  );
}

function DetailBlock({
  label, color, reaction,
}: {
  label: string;
  color: "blue" | "violet";
  reaction: { likedPoints: string[]; concerns: string[]; memorablePhrase: string };
}) {
  const textColor = color === "blue" ? "text-blue-600" : "text-violet-600";
  return (
    <div className="space-y-2">
      <p className={`text-xs font-bold ${textColor}`}>{label} 상세</p>
      {reaction.likedPoints.length > 0 && (
        <div>
          <p className="text-[10px] text-slate-400 mb-0.5">호감 포인트</p>
          {reaction.likedPoints.map((p, i) => (
            <p key={i} className="text-[11px] text-slate-600">· {p}</p>
          ))}
        </div>
      )}
      {reaction.concerns.length > 0 && (
        <div>
          <p className="text-[10px] text-slate-400 mb-0.5">우려 포인트</p>
          {reaction.concerns.map((c, i) => (
            <p key={i} className="text-[11px] text-slate-600">· {c}</p>
          ))}
        </div>
      )}
      {reaction.memorablePhrase && (
        <div>
          <p className="text-[10px] text-slate-400 mb-0.5">기억에 남는 표현</p>
          <p className="text-[11px] text-slate-600 italic">&quot;{reaction.memorablePhrase}&quot;</p>
        </div>
      )}
    </div>
  );
}
