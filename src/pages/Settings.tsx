import { ShieldAlert, Settings as SettingsIcon, User, Key, Bell, Shield, LayoutDashboard, Scan, Target, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 flex flex-col bg-slate-900/50 z-50 shrink-0">
        <div className="p-6 flex items-center gap-3 underline-none">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <ShieldAlert className="text-slate-950 w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white cursor-pointer" onClick={() => window.location.href='/dashboard'}>Sentinel<span className="text-cyan-400">AI</span></span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          <div className="px-2 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Navigation</div>
          <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 transition-colors text-slate-400 hover:text-white">
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
          <Link to="/settings" className="flex items-center gap-3 px-3 py-2 rounded-md bg-slate-800 text-cyan-400 border-l-2 border-cyan-400">
            <SettingsIcon className="w-4 h-4" /> Settings
          </Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto flex flex-col min-w-0 cyber-grid">
        <header className="h-16 border-b border-slate-800 bg-slate-900/30 backdrop-blur-md flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold text-white">System Configuration</h2>
        </header>

        <div className="p-8 max-w-4xl mx-auto w-full space-y-8 flex-1 pb-12">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase">Global_Config</h1>
            <p className="text-slate-500 text-sm">Manage your security profile and integration credentials.</p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <Card className="bg-slate-900 border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <CardHeader className="bg-slate-800/30 border-b border-slate-800 px-8 py-4 flex flex-row items-center gap-3">
                <User className="w-4 h-4 text-cyan-400" />
                <CardTitle className="text-xs font-black tracking-widest text-slate-400 uppercase">Agent Profile</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center gap-8">
                   <div className="w-24 h-24 rounded-2xl border-2 border-cyan-500/20 p-1 bg-slate-950 glow-cyan relative overflow-hidden group">
                     <img src={user?.photoURL || ''} alt="" className="w-full h-full rounded-xl grayscale group-hover:grayscale-0 transition-all duration-500 scale-110 group-hover:scale-100" />
                   </div>
                   <div className="space-y-2">
                     <h3 className="text-2xl font-bold text-white">{user?.displayName}</h3>
                     <p className="text-sm text-slate-400 font-mono italic">{user?.email}</p>
                     <div className="flex items-center gap-2 pt-1">
                        <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-[10px] uppercase font-black px-3">Verified_Agent</Badge>
                        <Badge className="bg-slate-800 text-slate-500 border-slate-700 text-[10px] uppercase font-black px-3">L4_Access</Badge>
                     </div>
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-800">
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold uppercase text-slate-500 tracking-[0.2em] px-2">Alias Indicator</label>
                     <Input defaultValue={user?.displayName || ''} className="bg-slate-950 border-slate-800 h-14 rounded-xl px-6 focus:ring-cyan-500 focus:border-cyan-500" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-bold uppercase text-slate-500 tracking-[0.2em] px-2">Secure GUID</label>
                     <Input disabled value={user?.uid || ''} className="bg-slate-950 border-slate-800 h-14 rounded-xl px-6 font-mono text-xs text-slate-600" />
                   </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <CardHeader className="bg-slate-800/30 border-b border-slate-800 px-8 py-4 flex flex-row items-center gap-3">
                <Key className="w-4 h-4 text-cyan-400" />
                <CardTitle className="text-xs font-black tracking-widest text-slate-400 uppercase">Neural Credentials</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6 text-center">
                <div className="p-6 border border-slate-800 bg-slate-950/50 rounded-2xl flex items-center justify-between group hover:border-cyan-500/20 transition-all">
                   <div className="flex items-center gap-4 text-left">
                     <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 group-hover:text-cyan-400 transition-colors">
                        <Shield className="w-6 h-6" />
                     </div>
                     <div>
                       <p className="text-sm font-bold text-white uppercase tracking-tight">Sentinel_API_Key</p>
                       <p className="text-[10px] text-slate-500 font-mono tracking-widest">sk_live_********************************</p>
                     </div>
                   </div>
                   <Button variant="outline" className="h-10 border-slate-800 hover:bg-cyan-600 hover:text-slate-950 transition-all px-6 rounded-xl font-bold text-xs uppercase tracking-widest">Regenerate</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <CardHeader className="bg-slate-800/30 border-b border-slate-800 px-8 py-4 flex flex-row items-center gap-3">
                <Bell className="w-4 h-4 text-cyan-400" />
                <CardTitle className="text-xs font-black tracking-widest text-slate-400 uppercase">Alert Sensitivity</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-4">
                   {[
                     { label: 'Critical Threat Log Push', state: true },
                     { label: 'Cloud Misconfiguration Neural Alert', state: true },
                     { label: 'Weekly Intelligence Security Digest', state: false }
                   ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between py-4 border-b border-slate-800/50 last:border-0 group">
                       <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{item.label}</span>
                       <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all duration-300 ${item.state ? 'bg-cyan-600' : 'bg-slate-800'}`}>
                         <div className={`w-4 h-4 bg-white rounded-full shadow-lg transition-transform duration-300 ${item.state ? 'translate-x-6' : 'translate-x-0'}`} />
                       </div>
                     </div>
                   ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between items-center px-4">
               <p className="text-[10px] font-mono text-slate-700 tracking-[0.2em] uppercase">System version: 4.2.0-Alpha</p>
               <Button variant="ghost" className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 text-xs font-black uppercase tracking-widest">Terminte_Session</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
