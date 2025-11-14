import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <div className="relative w-full h-[320px] sm:h-[420px] lg:h-[520px] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Spline scene="https://prod.spline.design/WCoEDSwacOpKBjaC/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent" />
      <div className="absolute inset-0 flex items-end p-6 sm:p-10">
        <div className="text-white max-w-2xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight">Single‑pane Command Center for Time‑based Businesses</h1>
          <p className="mt-3 text-slate-200/80 text-sm sm:text-base">Run sessions, sell products, take payments, and watch metrics move in real time — all in one place.</p>
        </div>
      </div>
    </div>
  )
}
