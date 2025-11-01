/**
 * Simulation engine for MVP 2.2.
 *
 * Given a set of baseline metrics and a technology's benefit
 * coefficients, compute the energy and water savings, financial
 * savings, ROI and payback period.  Tariffs are supplied by the
 * caller.  Confidence is increased by 10% for each provided baseline
 * dimension.  The returned object can be persisted in the database.
 */
export interface Baseline {
  baselineEnergyKwh?: number;
  baselineWaterM3?: number;
  baselineWasteTpy?: number;
  annualBudgetUsd?: number;
}

export interface TechnologyCoefficients {
  capexMin?: number | null;
  capexMax?: number | null;
  benefitEnergyPct?: number | null;
  benefitWaterPct?: number | null;
  benefitWastePct?: number | null;
  benefitCo2Tpy?: number | null;
}

export interface Tariffs {
  kwh: number;
  m3: number;
}

export function runSimulation(
  baseline: Baseline,
  tech: TechnologyCoefficients,
  tariffs: Tariffs,
  deltaOpex = 0,
) {
  const energySavingKwh =
    (baseline.baselineEnergyKwh ?? 0) * (tech.benefitEnergyPct ?? 0);
  const waterSavingM3 =
    (baseline.baselineWaterM3 ?? 0) * (tech.benefitWaterPct ?? 0);
  const wasteSavingTpy =
    (baseline.baselineWasteTpy ?? 0) * (tech.benefitWastePct ?? 0);

  const annualSavingsUsd =
    energySavingKwh * tariffs.kwh +
    waterSavingM3 * tariffs.m3 -
    deltaOpex;

  const avgCapex = ((tech.capexMin ?? 0) + (tech.capexMax ?? 0)) / 2;
  const roiPct = avgCapex > 0 ? (annualSavingsUsd / avgCapex) * 100 : 0;
  const paybackYears = annualSavingsUsd > 0 ? avgCapex / annualSavingsUsd : null;
  const co2ReductionTpy = tech.benefitCo2Tpy ?? 0;

  let confidencePct = 60;
  if (baseline.baselineEnergyKwh) confidencePct += 10;
  if (baseline.baselineWaterM3) confidencePct += 10;
  if (baseline.baselineWasteTpy) confidencePct += 10;
  if (baseline.annualBudgetUsd) confidencePct += 0;
  confidencePct = Math.min(confidencePct, 95);

  return {
    energySavingKwh,
    waterSavingM3,
    wasteSavingTpy,
    annualSavingsUsd,
    roiPct,
    paybackYears,
    co2ReductionTpy,
    confidencePct,
  };
}
