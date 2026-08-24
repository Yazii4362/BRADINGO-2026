import { t } from '../i18n/index.js';
import { BRAND } from './brand.js';
import { COURSE_NODES } from './nodes.js';

/**
 * Shared graduation stats for Ending UI and ExportCard.
 * @param {{ nodeStatus?: Record<string, string> } | null} [progress]
 */
export function getGraduationStats(progress = null) {
  const totalNodes = COURSE_NODES.length;
  const completedCount = progress?.nodeStatus
    ? COURSE_NODES.filter((node) => progress.nodeStatus[node.id] === 'completed').length
    : totalNodes;

  const stageValue = `${completedCount} / ${totalNodes}`;

  /** @type {ReadonlyArray<{ id: string, tone: 'xp' | 'time' | 'lessons', head: string, label: string, value: string }>} */
  const summaryRows = [
    {
      id: 'stages',
      tone: 'xp',
      head: t('ending.stat.xpHead'),
      label: t('ending.stat.stages'),
      value: stageValue,
    },
    {
      id: 'period',
      tone: 'time',
      head: t('ending.stat.timeHead'),
      label: t('ending.stat.uosLife'),
      value: t('ending.stat.timeValue'),
    },
    {
      id: 'memories',
      tone: 'lessons',
      head: t('ending.stat.lessonsHead'),
      label: t('ending.stat.memories'),
      value: t('ending.stat.memoriesValue'),
    },
  ];

  return {
    totalNodes,
    completedCount,
    title: 'BRADUATION COMPLETE!',
    stageLabel: t('ending.stageLabel'),
    lead: t('ending.lead'),
    tagline: t('ending.tagline'),
    subtitle: `${t('ending.lead')}\n${t('ending.tagline')}`,
    exportSubtitle: `${t('brand.courseTitle')} · ${BRAND.coursePeriod}`,
    wordmark: BRAND.wordmark,
    summaryTitle: t('ending.summaryTitle'),
    summaryRows,
    heroImage: './assets/images/ending/hero.webp',
    heroAlt: t('ending.heroAlt'),
  };
}
