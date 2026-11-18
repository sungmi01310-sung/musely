/* ──────────────────────────────────────────────────────────────
   ⚠️ Mock 추천 엔진 — 실제 AI가 아닙니다.
   샘플 카탈로그를 규칙 기반으로 걸러 "개인화된 결과처럼 보이는" 화면을
   개발하기 위한 용도입니다. 단, 아래 원칙은 실제 서비스와 동일하게 지킵니다.
     1) 기피 성분은 하드 필터 — 어떤 경우에도 완화하지 않음
     2) 샘플 성분표로 확인된 사실만 추천 이유로 사용
     3) 해당 조합이 없으면 주의사항을 만들지 않음
   ────────────────────────────────────────────────────────────── */

import type { BeautyProfile } from "@/types/beauty-profile";
import type {
  CosmeticRecommendation,
  FragranceRecommendation,
  IngredientCaution,
  RecommendationResult,
  RecommendationTrack,
} from "@/types/recommendation";
import { labelOf } from "@/lib/profile/options";
import { ingredientKey, isPresetIngredient } from "@/lib/profile/ingredients";
import { SAMPLE_COSMETICS, SAMPLE_FRAGRANCES, type SampleIngredient } from "./catalog";

const join = (items: string[]) => items.join("·");

/** 성분표에 기피 성분이 하나라도 있으면 true */
function containsAvoided(ingredients: SampleIngredient[], avoid: string[]): boolean {
  return avoid.some((value) => {
    if (isPresetIngredient(value)) return ingredients.some((i) => i.avoidCode === value);
    // 직접 입력한 성분 — 이름 기준으로만 비교 (샘플 데이터 한계)
    const key = ingredientKey(value);
    return key.length > 0 && ingredients.some((i) => ingredientKey(i.name).includes(key));
  });
}

const STRONG_ACTIVES = new Set(["retinol", "aha_bha", "vitamin_c"]);
const RISKY_PAIRS: { pair: [string, string]; message: string }[] = [
  {
    pair: ["retinol", "aha_bha"],
    message:
      "두 성분을 같은 날 함께 쓰면 자극이 느껴질 수 있어요. 사용하는 날을 나누거나 번갈아 쓰는 방법을 고려해 보세요.",
  },
  {
    pair: ["retinol", "vitamin_c"],
    message: "피부에 따라 따끔거림을 느낄 수 있어요. 비타민 C는 아침, 레티놀은 저녁처럼 시간대를 나눠 보세요.",
  },
  {
    pair: ["aha_bha", "vitamin_c"],
    message: "한 번에 겹쳐 바르면 자극이 될 수 있어요. 처음에는 사용 시간대를 나눠 피부 반응을 살펴보세요.",
  },
];
const pairKey = (a: string, b: string) => [a, b].sort().join("+");
const riskyByKey = new Map(RISKY_PAIRS.map((r) => [pairKey(...r.pair), r]));
const CAUTION_SOURCE = "일반적인 스킨케어 가이드 (샘플)";

/* ── 화장품 ───────────────────────────────────────────────────── */

function pickCosmetics(profile: BeautyProfile) {
  const skinLabel = labelOf(profile.skinType);
  const avoidLabels = profile.avoidIngredients.map(labelOf);

  return SAMPLE_COSMETICS.filter((p) => !containsAvoided(p.ingredients, profile.avoidIngredients))
    .map((p) => {
      const skinFit = p.skinTypes.includes(profile.skinType);
      const matched = profile.concerns.filter((c) => p.concerns.includes(c));
      const hasStrongActive = p.ingredients.some((i) => i.activeCode && STRONG_ACTIVES.has(i.activeCode));
      let score = 62 + (skinFit ? 12 : 0) + Math.min(matched.length, 3) * 8;
      if (profile.skinType === "sensitive" && hasStrongActive) score -= 12;
      return { p, skinFit, matched, score: Math.min(score, 96) };
    })
    .filter((c) => c.skinFit || c.matched.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ p, skinFit, matched, score }): CosmeticRecommendation & { _source: typeof p } => {
      const key = p.keyIngredients.slice(0, 2).join("·");
      const reason = matched.length
        ? `${join(matched.map(labelOf))} 고민을 고려해 ${key} 중심으로 고른 제품이에요.`
        : `${skinLabel} 피부에 맞춰 ${key} 중심으로 고른 제품이에요.`;
      const details: string[] = [];
      if (avoidLabels.length) {
        details.push(`등록한 기피 성분(${join(avoidLabels)})이 샘플 성분표에서 확인되지 않아 후보에 포함했어요.`);
      }
      if (skinFit) details.push(`${skinLabel} 피부 타입을 고려한 후보예요.`);
      return {
        itemId: p.itemId,
        brand: p.brand,
        name: p.name,
        category: p.category,
        imageUrl: p.imageUrl,
        keyIngredients: p.keyIngredients,
        reason,
        reasonDetails: details,
        score,
        _source: p,
      };
    });
}

/* ── 성분 조합 주의사항 ────────────────────────────────────────── */

function buildCautions(profile: BeautyProfile, picked: ReturnType<typeof pickCosmetics>): IngredientCaution[] {
  const cautions: IngredientCaution[] = [];
  const seen = new Set<string>();
  const current = profile.currentActives;

  // 1) 지금 함께 쓰고 있는 성분끼리
  for (let i = 0; i < current.length; i++) {
    for (let j = i + 1; j < current.length; j++) {
      const risky = riskyByKey.get(pairKey(current[i], current[j]));
      if (!risky || seen.has(pairKey(current[i], current[j]))) continue;
      seen.add(pairKey(current[i], current[j]));
      cautions.push({
        id: `current-${pairKey(current[i], current[j])}`,
        pair: [current[i], current[j]],
        pairLabels: [labelOf(current[i]), labelOf(current[j])],
        title: "지금 함께 쓰고 있는 성분",
        message: risky.message,
        source: CAUTION_SOURCE,
      });
    }
  }

  // 2) 사용 중인 성분 × 추천 제품 성분
  for (const { name, _source } of picked) {
    for (const ing of _source.ingredients) {
      if (!ing.activeCode) continue;
      for (const mine of current) {
        const key = pairKey(mine, ing.activeCode);
        const risky = riskyByKey.get(key);
        if (!risky || seen.has(`${key}:${name}`)) continue;
        seen.add(`${key}:${name}`);
        cautions.push({
          id: `product-${_source.itemId}-${key}`,
          pair: [mine, ing.activeCode],
          pairLabels: [labelOf(mine), ing.name],
          title: `사용 중인 성분 × ${name}`,
          message: risky.message,
          source: CAUTION_SOURCE,
        });
      }
    }
  }

  // 3) 민감성 피부 × 활성 성분이 든 추천 제품
  if (profile.skinType === "sensitive") {
    for (const { name, _source } of picked) {
      const strong = _source.ingredients.find((i) => i.activeCode && STRONG_ACTIVES.has(i.activeCode));
      if (!strong) continue;
      cautions.push({
        id: `sensitive-${_source.itemId}`,
        pairLabels: ["민감성 피부", strong.name],
        title: name,
        message: `샘플 성분표 기준 ${strong.name} 성분이 들어 있어요. 민감한 피부라면 적은 양으로 시작해 반응을 살펴보세요.`,
        source: CAUTION_SOURCE,
      });
    }
  }

  // 4) 패치 테스트 — 다른 주의사항이 있거나 민감성 피부일 때만 (불필요한 경고 방지)
  if (picked.length > 0 && (cautions.length > 0 || profile.skinType === "sensitive")) {
    cautions.push({
      id: "patch-test",
      title: "새 제품은 패치 테스트부터",
      message: "처음 쓰는 제품은 귀 뒤나 팔 안쪽에 먼저 발라 하루 이틀 반응을 확인한 뒤 사용하는 것을 권해요.",
      source: CAUTION_SOURCE,
    });
  }
  return cautions;
}

/* ── 향수 ─────────────────────────────────────────────────────── */

function pickFragrances(profile: BeautyProfile): FragranceRecommendation[] {
  const prefs = profile.preferredScentFamilies;
  const occasion = profile.occasion;
  const avoidsAlcohol = profile.avoidIngredients.includes("alcohol");

  return SAMPLE_FRAGRANCES.filter((f) => !containsAvoided(f.ingredients, profile.avoidIngredients))
    .map((f) => {
      const famMatch = prefs.filter((p) => f.families.includes(p));
      const primary = prefs.includes(f.family);
      const occMatch = !!occasion && f.occasions.includes(occasion);
      const score = Math.min(60 + (primary ? 20 : famMatch.length ? 10 : 0) + (occMatch ? 10 : 0), 95);
      return { f, famMatch, occMatch, score };
    })
    .filter((c) => (prefs.length ? c.famMatch.length > 0 : c.occMatch))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ f, famMatch, occMatch, score }) => {
      const fam = join(famMatch.map(labelOf));
      const occ = occasion ? labelOf(occasion) : "";
      let reason =
        fam && occMatch
          ? `선호한 ${fam} 계열이면서 ${occ}에 어울리는 무드의 향이에요.`
          : fam
            ? `선호한 ${fam} 계열의 향이에요.`
            : `${occ}에 어울리는 무드로 고른 향이에요.`;
      if (avoidsAlcohol) reason += " 알코올을 피하는 조건에 맞춰 무알코올 제형으로 골랐어요(샘플 기준).";
      return {
        itemId: f.itemId,
        brand: f.brand,
        name: f.name,
        family: f.family,
        concentration: f.concentration,
        imageUrl: f.imageUrl,
        notes: f.notes,
        reason,
        score,
      };
    });
}

/* ── 결과 조립 ────────────────────────────────────────────────── */

export function trackFromProfile(profile: BeautyProfile): RecommendationTrack {
  return profile.preferredScentFamilies.length === 0 && profile.occasion === null ? "cosmetic" : "both";
}

export function buildMockResult(input: {
  id: string;
  jobId: string;
  profile: BeautyProfile;
  track: RecommendationTrack;
  /** "empty" 시나리오 — 조건을 완화하지 않고 후보 0건을 그대로 반환 */
  forceEmpty?: boolean;
}): RecommendationResult {
  const { id, jobId, profile, track, forceEmpty } = input;
  const wantsCosmetic = track !== "fragrance";
  const wantsFragrance = track !== "cosmetic";

  const picked = forceEmpty || !wantsCosmetic ? [] : pickCosmetics(profile);
  const fragrances = forceEmpty || !wantsFragrance ? [] : pickFragrances(profile);
  const cosmetics: CosmeticRecommendation[] = picked.map((c) => {
    const { _source, ...rest } = c;
    void _source;
    return rest;
  });
  const cautions = buildCautions(profile, picked);

  const skin = labelOf(profile.skinType);
  const concerns = join(profile.concerns.slice(0, 3).map(labelOf));
  const avoid = join(profile.avoidIngredients.map(labelOf));
  const empty = cosmetics.length === 0 && fragrances.length === 0;

  let summary: string;
  if (empty) {
    summary = avoid
      ? `${skin} 피부 조건과 기피 성분(${avoid})을 모두 지키는 제품을 찾지 못했어요.`
      : `${skin} 피부 조건을 모두 충족하는 제품을 찾지 못했어요.`;
  } else {
    const parts: string[] = [];
    if (cosmetics.length) {
      let s1 = concerns ? `${skin} 피부와 ${concerns} 고민을 고려해` : `${skin} 피부를 기준으로`;
      s1 += avoid ? ` ${avoid} 성분이 확인된 제품은 제외하고 골랐어요.` : " 무난하게 쓸 수 있는 제품을 골랐어요.";
      parts.push(s1);
    }
    if (fragrances.length) {
      const scent = profile.preferredScentFamilies.length
        ? `${join(profile.preferredScentFamilies.map(labelOf))} 계열`
        : `${labelOf(profile.occasion ?? "")} 무드`;
      // 향수만 추천한 경우에도 기피 성분 조건은 그대로 안내
      const avoidNote = !cosmetics.length && avoid ? ` ${avoid} 성분이 확인된 향수는 제외했어요.` : "";
      parts.push(`${cosmetics.length ? "향수는" : "향수를"} ${scent} 취향에 맞춰 찾았어요.${avoidNote}`);
    }
    summary = parts.join(" ");
  }

  return {
    id,
    jobId,
    track,
    createdAt: new Date().toISOString(),
    summary,
    profile,
    cosmetics,
    fragrances,
    cautions: empty ? [] : cautions,
    relaxationLevel: 0,
    blockedBy: empty ? profile.avoidIngredients : undefined,
    meta: { source: "mock", sample: true },
  };
}
