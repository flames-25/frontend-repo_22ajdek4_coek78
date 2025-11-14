import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, ArrowDownRight, Activity as ActivityIcon, PauseCircle, PlayCircle, Clock, DollarSign } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Stat({ label, value, delta }) {
  const up = (delta ?? 0) >= 0
  return (
    <div className="p-4 rounded-xl bg-white shadow-sm border border-slate-100">
      <p className="text-slate-500 text-sm">{label}</p>
      <div className="mt-1 flex items-end gap-2">
        <p className="text-2xl font-semibold">{value}</p>
        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${up ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}>
          {up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {Math.abs(delta ?? 0)}%
        </span>
      </div>
    </div>
  )
}

function formatCurrency(n) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n || 0)
}

function secondsToHMS(sec = 0) {
  const s = Math.floor(sec % 60)
  const m = Math.floor((sec / 60) % 60)
  const h = Math.floor(sec / 3600)
  return `${h}h ${m}m ${s}s`
}

function LiveActivity() {
  const [items, setItems] = useState([])

  const load = async () => {
    try {
      const res = await fetch(`${API}/activity`)
      const data = await res.json()
      setItems(data)
    } catch (e) {}
  }

  useEffect(() => {
    load()
    const t = setInterval(load, 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ActivityIcon className="w-4 h-4 text-slate-500" />
          <p className="text-slate-700 font-medium">Live Activity</p>
        </div>
        <p className="text-xs text-slate-500">auto-updates</p>
      </div>
      <div className="space-y-3 max-h-72 overflow-auto pr-2">
        {items.map((a) => (
          <div key={a._id} className="flex items-start gap-3">
            <div className="w-2 h-2 mt-2 rounded-full bg-sky-500" />
            <div>
              <p className="text-sm text-slate-800">{a.message}</p>
              <p className="text-xs text-slate-500">{new Date((a.created_at || 0) * 1000).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-slate-500">No activity yet</p>}
      </div>
    </div>
  )
}

function ActiveSessions() {
  const [sessions, setSessions] = useState([])
  const refresh = async () => {
    try {
      const res = await fetch(`${API}/sessions/active`)
      const data = await res.json()
      setSessions(data)
    } catch (e) {}
  }

  useEffect(() => {
    refresh()
    const t = setInterval(refresh, 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-slate-500" />
        <p className="text-slate-700 font-medium">Active Sessions</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sessions.map((s) => (
          <div key={s._id} className="border border-slate-100 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-800">{s.customer_id.slice(0,6)}…</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${s.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{s.status}</span>
            </div>
            <p className="text-sm text-slate-600">Elapsed: {secondsToHMS(s.elapsed_active_seconds)}</p>
            <p className="text-sm text-slate-600">Total: {formatCurrency(s.total)}</p>
          </div>
        ))}
        {sessions.length === 0 && <p className="text-sm text-slate-500">No active sessions</p>}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null)

  const load = async () => {
    try {
      const res = await fetch(`${API}/metrics/summary`)
      const data = await res.json()
      setSummary(data)
    } catch (e) {}
  }

  useEffect(() => {
    load()
    const t = setInterval(load, 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Active Sessions" value={summary?.active_sessions ?? 0} delta={0} />
        <Stat label="Today's Revenue" value={formatCurrency(summary?.today_revenue ?? 0)} delta={summary?.today_vs_yesterday ?? 0} />
        <Stat label="Sales Volume" value={summary?.product_sales_volume ?? 0} delta={0} />
        <Stat label="Booked Duration" value={secondsToHMS(summary?.total_booked_duration_seconds ?? 0)} delta={0} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ActiveSessions />
        </div>
        <div className="lg:col-span-1">
          <LiveActivity />
        </div>
      </div>
    </div>
  )
}
