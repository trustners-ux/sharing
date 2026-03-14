import { investmentLandscapeModule } from './investment-landscape';
import { sipMasteryModule } from './sip-mastery';
import { whatIsMutualFundModule } from './what-is-mutual-fund';
import { schemeTypesModule } from './scheme-types';
import { fundStructureModule } from './fund-structure';
import { legalRegulatoryModule } from './legal-regulatory';
import { navExpensesPricingModule } from './nav-expenses-pricing';
import { taxationModule } from './taxation';
import { distributionRoleModule } from './distribution-role';
import { investorServicesModule } from './investor-services';
import { riskReturnPerformanceModule } from './risk-return-performance';
import { schemeSelectionPlanningModule } from './scheme-selection-planning';
import { LearningModule, Section } from '@/types/learning';

/**
 * All 12 NISM VA-aligned learning modules.
 * Ordered: Foundation (beginner) → Intermediate → Advanced
 */
export const ALL_MODULES: LearningModule[] = [
  // ─── Foundation (Beginner) ───
  investmentLandscapeModule,
  whatIsMutualFundModule,
  sipMasteryModule,
  // ─── Intermediate ───
  schemeTypesModule,
  fundStructureModule,
  legalRegulatoryModule,
  navExpensesPricingModule,
  taxationModule,
  distributionRoleModule,
  investorServicesModule,
  // ─── Advanced ───
  riskReturnPerformanceModule,
  schemeSelectionPlanningModule,
];

export function getAllModules(): LearningModule[] {
  return ALL_MODULES;
}

export function getModuleBySlug(slug: string): LearningModule | undefined {
  return ALL_MODULES.find((m) => m.slug === slug);
}

export function getSectionBySlug(moduleSlug: string, sectionSlug: string): Section | undefined {
  const mod = getModuleBySlug(moduleSlug);
  if (!mod) return undefined;
  return mod.sections.find((s) => s.slug === sectionSlug);
}

export function getTotalStats() {
  let totalSections = 0;
  let totalMCQs = 0;
  let totalFAQs = 0;

  ALL_MODULES.forEach((module) => {
    totalSections += module.sections.length;
    module.sections.forEach((section) => {
      totalMCQs += section.content.mcqs.length;
      totalFAQs += section.content.faq.length;
    });
  });

  return {
    modules: ALL_MODULES.length,
    sections: totalSections,
    mcqs: totalMCQs,
    faqs: totalFAQs,
  };
}

export function getAllSections(): (Section & { moduleName: string; moduleSlug: string })[] {
  const sections: (Section & { moduleName: string; moduleSlug: string })[] = [];
  ALL_MODULES.forEach((module) => {
    module.sections.forEach((section) => {
      sections.push({
        ...section,
        moduleName: module.title,
        moduleSlug: module.slug,
      });
    });
  });
  return sections;
}

/**
 * Resolve a section slug to its full path by searching all modules.
 * Used for relatedTopics which may reference sections in other modules.
 * Returns { moduleSlug, sectionSlug, title } or null if not found.
 */
const _topicPathCache = new Map<string, { moduleSlug: string; sectionSlug: string; title: string } | null>();

export function resolveTopicPath(
  sectionSlug: string,
  currentModuleSlug?: string
): { moduleSlug: string; sectionSlug: string; title: string } | null {
  const cacheKey = `${currentModuleSlug || ''}:${sectionSlug}`;
  if (_topicPathCache.has(cacheKey)) return _topicPathCache.get(cacheKey)!;

  // First check current module (prefer same-module match)
  if (currentModuleSlug) {
    const currentModule = getModuleBySlug(currentModuleSlug);
    if (currentModule) {
      const section = currentModule.sections.find((s) => s.slug === sectionSlug);
      if (section) {
        const result = { moduleSlug: currentModuleSlug, sectionSlug: section.slug, title: section.title };
        _topicPathCache.set(cacheKey, result);
        return result;
      }
    }
  }

  // Then search all modules
  for (const mod of ALL_MODULES) {
    const section = mod.sections.find((s) => s.slug === sectionSlug);
    if (section) {
      const result = { moduleSlug: mod.slug, sectionSlug: section.slug, title: section.title };
      _topicPathCache.set(cacheKey, result);
      return result;
    }
  }

  _topicPathCache.set(cacheKey, null);
  return null;
}
