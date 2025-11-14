import Hero from './components/Hero'
import Dashboard from './components/Dashboard'
import SessionManager from './components/SessionManager'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <Hero />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Dashboard />
          </div>
          <div className="lg:col-span-1">
            <SessionManager />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
