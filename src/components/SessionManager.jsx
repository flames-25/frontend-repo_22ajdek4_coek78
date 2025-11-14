import { useEffect, useMemo, useState } from 'react'
import { Play, Pause, Plus, CheckCircle2 } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <h3 className="text-slate-800 font-semibold mb-3">{title}</h3>
      {children}
    </div>
  )
}

export default function SessionManager() {
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [status, setStatus] = useState('idle')
  const [quantity, setQuantity] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState('')

  const loadBase = async () => {
    const [c, p] = await Promise.all([
      fetch(`${API}/customers`).then((r) => r.json()),
      fetch(`${API}/products`).then((r) => r.json()),
    ])
    setCustomers(c)
    setProducts(p)
  }

  useEffect(() => {
    loadBase()
  }, [])

  const startSession = async () => {
    if (!selectedCustomer) return
    const res = await fetch(`${API}/sessions/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_id: selectedCustomer })
    })
    const data = await res.json()
    setSessionId(data._id)
    setStatus('active')
  }

  const pause = async () => {
    if (!sessionId) return
    await fetch(`${API}/sessions/${sessionId}/pause`, { method: 'POST' })
    setStatus('paused')
  }

  const resume = async () => {
    if (!sessionId) return
    await fetch(`${API}/sessions/${sessionId}/resume`, { method: 'POST' })
    setStatus('active')
  }

  const addItem = async () => {
    if (!sessionId || !selectedProduct) return
    await fetch(`${API}/sessions/${sessionId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: selectedProduct, quantity: Number(quantity) })
    })
  }

  const checkout = async () => {
    if (!sessionId) return
    const res = await fetch(`${API}/sessions/${sessionId}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: 'cash' })
    })
    const data = await res.json()
    alert(`Paid ${data?.receipt?.total?.toFixed(2)}`)
    setSessionId('')
    setStatus('idle')
  }

  return (
    <div className="space-y-6">
      <Section title="Check-in">
        <div className="grid sm:grid-cols-3 gap-3">
          <select className="border rounded-lg p-2" value={selectedCustomer} onChange={(e)=> setSelectedCustomer(e.target.value)}>
            <option value="">Select customer</option>
            {customers.map(c => (
              <option key={c._id} value={c._id}>{c.first_name} {c.last_name}</option>
            ))}
          </select>
          <button onClick={startSession} className="bg-sky-600 hover:bg-sky-700 text-white rounded-lg px-4 py-2">Start Session</button>
          <div className="flex items-center gap-2 text-slate-600">
            <span className={`text-xs px-2 py-1 rounded-full ${status==='active' ? 'bg-emerald-50 text-emerald-700' : status==='paused' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>{status}</span>
            {status==='active' ? (
              <button onClick={pause} className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg"><Pause className="w-4 h-4"/> Pause</button>
            ) : status==='paused' ? (
              <button onClick={resume} className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg"><Play className="w-4 h-4"/> Resume</button>
            ) : null}
          </div>
        </div>
      </Section>

      <Section title="Add Products / Services">
        <div className="grid sm:grid-cols-4 gap-3">
          <select className="border rounded-lg p-2" value={selectedProduct} onChange={(e)=> setSelectedProduct(e.target.value)}>
            <option value="">Select product/service</option>
            {products.map(p => (
              <option key={p._id} value={p._id}>{p.name} — ${p.price}</option>
            ))}
          </select>
          <input type="number" className="border rounded-lg p-2" value={quantity} onChange={(e)=> setQuantity(e.target.value)} min={1} />
          <button onClick={addItem} className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white rounded-lg px-4 py-2"><Plus className="w-4 h-4"/> Add Item</button>
          <button onClick={checkout} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2 ml-auto"><CheckCircle2 className="w-4 h-4"/> Checkout</button>
        </div>
      </Section>
    </div>
  )
}
