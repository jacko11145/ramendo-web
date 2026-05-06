const TYPE_COLORS: Record<string, string> = {
  豚骨: 'bg-amber-900/40 text-amber-300 border border-amber-800/50',
  醬油: 'bg-yellow-900/40 text-yellow-300 border border-yellow-800/50',
  鹽味: 'bg-cyan-900/40 text-cyan-300 border border-cyan-800/50',
  味噌: 'bg-orange-900/40 text-orange-300 border border-orange-800/50',
  沾麵: 'bg-indigo-900/40 text-indigo-300 border border-indigo-800/50',
  乾麵: 'bg-green-900/40 text-green-300 border border-green-800/50',
  雞白湯: 'bg-yellow-800/40 text-yellow-200 border border-yellow-700/50',
  魚介: 'bg-blue-900/40 text-blue-300 border border-blue-800/50',
  辣味: 'bg-red-900/40 text-red-300 border border-red-800/50',
  清湯: 'bg-slate-700/40 text-slate-300 border border-slate-600/50',
  擔擔麵: 'bg-red-800/40 text-red-200 border border-red-700/50',
  冷麵: 'bg-sky-900/40 text-sky-300 border border-sky-800/50',
}

const DEFAULT_COLOR = 'bg-site-gray/60 text-cream-dark border border-site-gray'

export function getTypeClass(type: string): string {
  return TYPE_COLORS[type] ?? DEFAULT_COLOR
}
