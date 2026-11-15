export function classifyAxe(rule,type) {
  const tags=Array.isArray(rule.tags)?rule.tags:[];
  const standard=tags.some(t=>/^wcag\d+(?:a|aa|aaa)$/.test(t))?'wcag':tags.includes('best-practice')?'best-practice':'other';
  return {kind:type==='incomplete'?'review':standard==='wcag'?'accessibility':'advisory',standard,tags,axeResult:type};
}
