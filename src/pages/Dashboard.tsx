import { motion } from 'motion/react';
import { LayoutDashboard, Scan, ShieldAlert, FileText, Lock, Settings, Bell, ExternalLink, Activity, Target, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const data = [
  { name: 'Mon', threats: 12 },
  { name: 'Tue', threats: 45 },
  { name: 'Wed', threats: 28 },
  { name: 'Thu', threats: 89 },
  { name: 'Fri', threats: 55 },
  { name: 'Sat', threats: 12 },
  { name: 'Sun', threats: 32 },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [recentScans, setRecentScans] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, 'scans'),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc'),
        limit(5)
      );
      getDocs(q).then((snapshot) => {
        setRecentScans(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
    }
  }, [user]);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 flex flex-col bg-slate-900/50 z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <ShieldAlert className="text-slate-950 w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Sentinel<span className="text-cyan-400">AI</span></span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          <div className="px-2 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Navigation</div>
          <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md bg-slate-800 text-cyan-400 border-l-2 border-cyan-400">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link to="/scanner" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 transition-colors text-slate-400 hover:text-white">
            <Scan className="w-4 h-4" /> Security Scanner
          </Link>
          <Link to="/lab" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 transition-colors text-slate-400 hover:text-white">
            <Target className="w-4 h-4" /> Attack Lab
          </Link>
          <Link to="/reports" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 transition-colors text-slate-400 hover:text-white">
            <FileText className="w-4 h-4" /> Reports
          </Link>
          <Link to="/settings" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 transition-colors text-slate-400 hover:text-white">
            <Settings className="w-4 h-4" /> Settings
          </Link>
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System Integrity</span>
              <span className="text-xs text-green-400 font-mono">98%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-1">
              <div className="bg-cyan-500 h-1 rounded-full" style={{ width: '98%' }}></div>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full mt-4 px-4 py-2 text-[10px] font-bold tracking-[0.2em] text-slate-500 hover:text-white transition-colors uppercase"
          >
            Terminal Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto cyber-grid flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 bg-slate-900/30 backdrop-blur-md flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-white">Security Operations Center</h2>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] uppercase font-bold border border-cyan-500/20">Live Monitoring</span>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-full">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] font-bold tracking-widest text-cyan-400">SECURE_OPERATIONS</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-semibold text-white">{user?.displayName?.split(' ')[0] || 'Agent'}</div>
                  <div className="text-[10px] text-slate-500">Sentinel ID: {user?.uid.slice(0, 4)}</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 overflow-hidden">
                  <img src={user?.photoURL || ''} alt="" className="w-full h-full object-cover grayscale" />
                </div>
             </div>
          </div>
        </header>

        <div className="p-8 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'THREAT_SCORE', value: '18', sub: '-12% vs last week', icon: ShieldAlert, color: 'text-green-400' },
              { label: 'TOTAL_ASSETS', value: '14,2k', sub: '+12% growth', icon: Activity, color: 'text-cyan-400' },
              { label: 'CRITICAL_VULNS', value: '08', sub: '-2 from peak', icon: Target, color: 'text-rose-500' },
              { label: 'RISK_INDEX', value: '84/100', sub: 'Optimized status', icon: ShieldCheck, color: 'text-blue-400' }
            ].map((stat, i) => (
              <Card key={i} className="bg-slate-900 border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">{stat.label}</span>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold text-white">{stat.value}</span>
                  <span className={`text-[10px] mb-1 ${stat.color}`}>{stat.sub}</span>
                </div>
              </Card>
            ))}
          </div>

          {/* Charts & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-slate-900 border-slate-800 rounded-2xl overflow-hidden p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-white">Asset Security Matrix</h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-slate-800 text-[11px] text-slate-400 rounded-md border border-slate-700">WEEKLY</button>
                  <button className="px-3 py-1 bg-cyan-500/10 text-[11px] text-cyan-400 rounded-md border border-cyan-500/30">REALTIME</button>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                      itemStyle={{ color: '#06b6d4' }}
                    />
                    <Area type="monotone" dataKey="threats" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorThreats)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="bg-slate-900 border-slate-800 rounded-2xl flex flex-col p-6">
              <div className="flex flex-row items-center justify-between mb-6">
                <h3 className="font-semibold text-white">Recent Telemetry</h3>
                <Link to="/scanner"><ExternalLink className="w-4 h-4 text-slate-500 hover:text-white transition-colors" /></Link>
              </div>
              <div className="space-y-5 overflow-y-auto max-h-[300px] pr-2">
                {recentScans.length > 0 ? recentScans.map((scan, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className={`p-2 rounded-lg transition-colors ${scan.riskScore > 70 ? 'bg-rose-500/10 text-rose-500' : 'bg-green-500/10 text-green-500'}`}>
                      <Scan className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-200 truncate group-hover:text-cyan-400 transition-colors">{scan.url.replace('https://', '')}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{new Date(scan.timestamp).toLocaleTimeString()}</p>
                    </div>
                    <div className={`text-xs font-bold font-mono ${scan.riskScore > 70 ? 'text-rose-500' : 'text-green-500'}`}>
                      {scan.riskScore}
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-10 text-slate-600 text-xs font-mono uppercase tracking-widest">
                    No data logged
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
