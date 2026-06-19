'use client'

import { useState, useEffect, useCallback } from 'react'

// ─── Tab Config ───────────────────────────────────────────────────────────────
type TabId = 
  | 'battingAverage' | 'doubles' | 'triples' | 'homeRuns' | 'runsBattedIn' 
  | 'walks' | 'stolenBases' | 'onBasePlusSlugging' | 'onBasePercentage' | 'sluggingPercentage'
  | 'earnedRunAverage' | 'walksAndHitsPerInningPitched' | 'strikeouts' | 'strikeoutsPer9Inn' | 'shutouts' | 'saves'

type TabConfig = {
  id: TabId
  label: string
  emoji: string
  desc: string
  chipLabel: string
  isDecimal?: boolean
  type: 'batting' | 'pitching'
}

const TABS: TabConfig[] = [
  // Batting
  { id: 'battingAverage', label: 'AVG', emoji: '📈', desc: 'Top 10 by Batting Average', chipLabel: 'AVG', isDecimal: true, type: 'batting' },
  { id: 'homeRuns', label: 'Home Runs', emoji: '💥', desc: 'Top 10 HR Hitters', chipLabel: 'HR', type: 'batting' },
  { id: 'runsBattedIn', label: 'RBI', emoji: '🏆', desc: 'Top 10 RBI Leaders', chipLabel: 'RBI', type: 'batting' },
  { id: 'doubles', label: 'Doubles', emoji: '🎯', desc: 'Top 10 Doubles Hitters', chipLabel: '2B', type: 'batting' },
  { id: 'triples', label: 'Triples', emoji: '⚡', desc: 'Top 10 Triples Hitters', chipLabel: '3B', type: 'batting' },
  { id: 'walks', label: 'Walks', emoji: '🚶', desc: 'Top 10 in Walks', chipLabel: 'BB', type: 'batting' },
  { id: 'stolenBases', label: 'Stolen Bases', emoji: '🏃', desc: 'Top 10 Stolen Bases', chipLabel: 'SB', type: 'batting' },
  { id: 'onBasePlusSlugging', label: 'OPS', emoji: '📊', desc: 'Top 10 by OPS', chipLabel: 'OPS', isDecimal: true, type: 'batting' },
  { id: 'onBasePercentage', label: 'OBP', emoji: '🛡️', desc: 'Top 10 by OBP', chipLabel: 'OBP', isDecimal: true, type: 'batting' },
  { id: 'sluggingPercentage', label: 'SLG', emoji: '🔨', desc: 'Top 10 by SLG', chipLabel: 'SLG', isDecimal: true, type: 'batting' },
  // Pitching
  { id: 'earnedRunAverage', label: 'ERA', emoji: '🎯', desc: 'Top 10 by ERA', chipLabel: 'ERA', isDecimal: true, type: 'pitching' },
  { id: 'walksAndHitsPerInningPitched', label: 'WHIP', emoji: '📏', desc: 'Top 10 by WHIP', chipLabel: 'WHIP', isDecimal: true, type: 'pitching' },
  { id: 'strikeouts', label: 'Strikeouts', emoji: '🔥', desc: 'Top 10 Strikeout Pitchers', chipLabel: 'K', type: 'pitching' },
  { id: 'strikeoutsPer9Inn', label: 'K/9', emoji: '💨', desc: 'Top 10 by K/9', chipLabel: 'K/9', isDecimal: true, type: 'pitching' },
  { id: 'shutouts', label: 'Shutouts', emoji: '🛑', desc: 'Top 10 Shutout Leaders', chipLabel: 'SHO', type: 'pitching' },
  { id: 'saves', label: 'Saves', emoji: '🔒', desc: 'Top 10 Save Leaders', chipLabel: 'SV', type: 'pitching' },
]

export interface MLBLeader {
  rank: number
  value: string
  team: { id: number; name: string }
  person: { id: number; fullName: string; firstName: string; lastName: string }
}

// ─── Rank Badge ───────────────────────────────────────────────────────────────
function RankBadge({ rank }: { rank: number }) {
  const base = 'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0'
  if (rank === 1) return <div className={`${base} rank-1 text-white shadow-lg`}>1</div>
  if (rank === 2) return <div className={`${base} rank-2 text-white`}>2</div>
  if (rank === 3) return <div className={`${base} rank-3 text-white`}>3</div>
  return <div className={`${base} rank-other`}>{rank}</div>
}

// ─── Skeleton Row ─────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5 border-b border-white/5">
      <div className="skeleton w-8 h-8 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-40" />
        <div className="skeleton h-3 w-28" />
      </div>
      <div className="skeleton h-10 w-14 rounded-lg" />
    </div>
  )
}

// ─── Row Component ────────────────────────────────────────────────────────────
function LeaderRow({ player, tab }: { player: MLBLeader; tab: TabConfig }) {
  const isTop3 = player.rank <= 3
  
  // Format decimal if needed (e.g. .312 instead of 0.312)
  let displayValue = player.value
  if (tab.isDecimal) {
    const num = parseFloat(player.value)
    if (!isNaN(num)) {
      if (tab.id === 'earnedRunAverage' || tab.id === 'strikeoutsPer9Inn' || tab.id === 'walksAndHitsPerInningPitched') {
        displayValue = num.toFixed(2)
      } else {
        displayValue = num.toFixed(3).replace(/^0/, '')
      }
    }
  }

  return (
    <div
      className={`flex items-center gap-3 sm:gap-4 px-4 py-3.5 border-b border-white/5
        row-animate transition-colors hover:bg-white/[0.03] cursor-default
        ${isTop3 && player.rank === 1 ? 'top-stat-glow' : ''}`}
      style={{ animationDelay: `${(player.rank - 1) * 40}ms` }}
    >
      <RankBadge rank={player.rank} />

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-slate-100 truncate text-sm sm:text-base leading-tight flex items-center gap-2">
          <span>{player.person.fullName}</span>
          <img src={`https://www.mlbstatic.com/team-logos/${player.team.id}.svg`} alt={player.team.name} className="w-5 h-5 object-contain" />
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          {player.team.name}
        </p>
      </div>

      <div className={`px-3 py-1.5 rounded-lg min-w-[58px] text-center flex-shrink-0
        ${isTop3
          ? 'bg-gradient-to-br from-red-900/50 to-red-950/50 border border-red-800/40'
          : 'bg-white/5 border border-white/10'}`}>
        <p className="text-[10px] text-slate-500 uppercase tracking-wide leading-none mb-0.5">{tab.chipLabel}</p>
        <p className={`font-bold stat-highlight leading-none
          ${tab.isDecimal ? 'text-sm' : 'text-lg'}
          ${isTop3 ? 'text-white' : 'text-slate-200'}`}>
          {displayValue}
        </p>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
type DataMap = Partial<Record<TabId, MLBLeader[]>>

export default function Home() {
  const [viewMode, setViewMode] = useState<'batting' | 'pitching'>('batting')
  const [activeTab, setActiveTab] = useState<TabId>('battingAverage')
  const [data, setData] = useState<DataMap>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const battingCategories = TABS.filter(t => t.type === 'batting').map(t => t.id).join(',')
      const pitchingCategories = TABS.filter(t => t.type === 'pitching').map(t => t.id).join(',')
      
      const [battingRes, pitchingRes] = await Promise.all([
        fetch(`https://statsapi.mlb.com/api/v1/stats/leaders?leaderCategories=${battingCategories}&statGroup=hitting&limit=10`, { cache: 'no-store' }),
        fetch(`https://statsapi.mlb.com/api/v1/stats/leaders?leaderCategories=${pitchingCategories}&statGroup=pitching&limit=10`, { cache: 'no-store' })
      ])

      if (!battingRes.ok || !pitchingRes.ok) throw new Error('Failed to fetch from MLB Stats API')
      
      const battingJson = await battingRes.json()
      const pitchingJson = await pitchingRes.json()

      const newData: DataMap = {}
      
      if (battingJson.leagueLeaders) {
        for (const leaderGroup of battingJson.leagueLeaders) {
          const category = leaderGroup.leaderCategory as TabId
          newData[category] = leaderGroup.leaders || []
        }
      }
      
      if (pitchingJson.leagueLeaders) {
        for (const leaderGroup of pitchingJson.leagueLeaders) {
          const category = leaderGroup.leaderCategory as TabId
          newData[category] = leaderGroup.leaders || []
        }
      }

      setData(newData)
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    if (viewMode === 'batting') setActiveTab('battingAverage')
    else setActiveTab('earnedRunAverage')
  }, [viewMode])

  const visibleTabs = TABS.filter(t => t.type === viewMode)
  const currentTab = TABS.find(t => t.id === activeTab)!
  const currentData = data[activeTab] ?? []

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>

      <header className="border-b border-white/[0.06] sticky top-0 z-10"
        style={{ background: 'rgba(8,12,20,0.97)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-4xl mx-auto px-4 pt-4 pb-0">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚾</span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black gradient-text leading-tight">
                  Quintin's Latest MLB Stat Leaders
                </h1>
                <p className="text-[11px] text-slate-500 uppercase tracking-widest">Live Official Data</p>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
              <button
                onClick={() => setViewMode('batting')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  viewMode === 'batting' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
              >
                Batting
              </button>
              <button
                onClick={() => setViewMode('pitching')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  viewMode === 'pitching' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
              >
                Pitching
              </button>
            </div>
          </div>

          <div className="flex gap-1.5 mt-4 overflow-x-auto pb-0 scrollbar-none -mx-4 px-4">
            {visibleTabs.map(tab => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn flex-shrink-0 ${activeTab === tab.id ? 'active' : ''}`}
              >
                <span className="mr-1">{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="h-px mt-0 bg-white/[0.06]" />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">

        <div className="mb-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-100">{currentTab.desc}</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Official MLB API Leaders
          </p>
        </div>

        {error && (
          <div className="stat-card p-6 text-center mb-4">
            <p className="text-red-400 font-medium">Failed to load data</p>
            <p className="text-slate-500 text-sm mt-1">{error}</p>
            <button onClick={fetchData}
              className="mt-3 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm font-medium transition-colors">
              Retry
            </button>
          </div>
        )}

        {!error && (
          <div className="stat-card overflow-hidden">
            <div className="flex items-center gap-3 sm:gap-4 px-4 py-2.5 border-b border-white/10 bg-white/[0.02]">
              <div className="w-8 flex-shrink-0" />
              <div className="flex-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Player</div>
              <div className="w-14 text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-center flex-shrink-0">
                {currentTab.chipLabel}
              </div>
            </div>

            {loading
              ? [...Array(10)].map((_, i) => <SkeletonRow key={i} />)
              : currentData.length === 0
                ? (
                  <div className="px-4 py-12 text-center">
                    <p className="text-4xl mb-3">⚾</p>
                    <p className="text-slate-400 font-medium">No data available</p>
                  </div>
                )
                : currentData.map((p, i) => (
                    <LeaderRow
                      key={p.person.id}
                      player={p}
                      tab={currentTab}
                    />
                  ))
            }
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-white/[0.05] text-center space-y-1">
          <p className="text-xs text-slate-600">
            Data sourced directly from the official MLB Stats API
          </p>
          <p className="text-xs font-semibold" style={{ color: '#c41e3a' }}>
            ⚾ Created by Quintin G.!
          </p>
        </div>
      </div>
    </main>
  )
}
