import { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Target, Terminal as TerminalIcon, Info, Play, RefreshCw, AlertTriangle, Bug } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function AttackLab() {
  const [sqlInput, setSqlInput] = useState('');
  const [xssInput, setXssInput] = useState('');
  const [labResult, setLabResult] = useState<string | null>(null);

  const simulateSqlInjection = () => {
    if (sqlInput.includes("' OR '1'='1")) {
      setLabResult('SUCCESS: Database Dumped! All user records exposed.');
      toast.error('VULNERABILITY_EXPLOITED');
    } else {
      setLabResult('FAILURE: Query execution failed. No data leaked.');
      toast.info('SAFE_INPUT');
    }
  };

  const simulateXss = () => {
    if (xssInput.includes('<script>')) {
      setLabResult('CRITICAL: Malicious script executed. Cookie "session_id" stolen.');
      toast.error('SESSION_COMPROMISED');
    } else {
      setLabResult('SAFE: Data sanitized. No script execution.');
      toast.success('DATA_NORMALIZED');
    }
  };

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
          <Link to="/lab" className="flex items-center gap-3 px-3 py-2 rounded-md bg-slate-800 text-cyan-400 border-l-2 border-cyan-400">
            <Target className="w-4 h-4" /> Attack Lab
          </Link>
          <Link to="/reports" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 transition-colors text-slate-400 hover:text-white">
            <FileText className="w-4 h-4" /> Reports
          </Link>
          <Link to="/settings" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 transition-colors text-slate-400 hover:text-white">
            <Settings className="w-4 h-4" /> Settings
          </Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto flex flex-col min-w-0 cyber-grid">
        <header className="h-16 border-b border-slate-800 bg-slate-900/30 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-white uppercase tracking-tight">Attack Simulation Lab</h2>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] uppercase font-bold border border-amber-500/20">Controlled Environment</span>
          </div>
        </header>

        <div className="p-8 space-y-8 max-w-6xl mx-auto w-full flex-1">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase">Exploit_Workshop</h1>
            <p className="text-slate-500 text-sm">Educational simulations of common web vulnerabilities. Understand the exploit to build better defenses.</p>
          </div>

          <Tabs defaultValue="sql" className="w-full">
            <TabsList className="bg-slate-900 border border-slate-800 w-full justify-start p-1 h-auto mb-8 rounded-2xl overflow-hidden">
              <TabsTrigger value="sql" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-slate-950 px-8 py-3 rounded-xl transition-all font-bold tracking-widest text-[10px] uppercase">SQL_INJECTION</TabsTrigger>
              <TabsTrigger value="xss" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-slate-950 px-8 py-3 rounded-xl transition-all font-bold tracking-widest text-[10px] uppercase">CROSS_SITE_SCRIPTING</TabsTrigger>
              <TabsTrigger value="csrf" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-slate-950 px-8 py-3 rounded-xl transition-all font-bold tracking-widest text-[10px] uppercase">CSRF_ATTACK</TabsTrigger>
            </TabsList>

            <TabsContent value="sql" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-slate-900 border-slate-800 rounded-3xl p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                       <Bug className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-tight">Vulnerability Brief</h3>
                      <div className="text-[10px] text-slate-500 font-mono">SQL_INJECTION (SQLi)</div>
                    </div>
                  </div>
                  <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                    <p>SQL Injection allows an attacker to interfere with the queries that an application makes to its database.</p>
                    <div className="p-4 bg-black/50 border border-slate-800 rounded-2xl font-mono text-xs text-cyan-400">
                      SELECT * FROM users WHERE id = '{'{id}'}';
                    </div>
                    <p className="p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-xl text-cyan-400/80 text-xs">
                      Try entering <code className="text-cyan-300 font-bold px-1.5 py-0.5 bg-cyan-300/10 rounded ml-1">' OR '1'='1</code> to bypass authentication.
                    </p>
                  </div>
                </Card>

                <Card className="bg-slate-900 border-slate-800 rounded-3xl p-8 flex flex-col gap-6 shadow-xl">
                  <div className="space-y-4 flex-1">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] px-2">Simulation Payload</label>
                       <Input 
                        value={sqlInput}
                        onChange={(e) => setSqlInput(e.target.value)}
                        placeholder="' OR '1'='1" 
                        className="bg-slate-950 border-slate-800 h-14 rounded-2xl font-mono text-cyan-400 text-lg px-6 focus:ring-cyan-500"
                      />
                    </div>
                    <Button onClick={simulateSqlInjection} className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black h-14 rounded-2xl transition-all glow-cyan uppercase tracking-widest text-xs">
                      EXECUTE_PAYLOAD <Play className="ml-2 w-4 h-4" />
                    </Button>
                  </div>

                  <div className="p-6 rounded-2xl border border-slate-800 bg-black/40 font-mono text-xs min-h-[120px] flex flex-col relative overflow-hidden">
                    <div className="text-slate-600 flex items-center gap-2 mb-3 z-10">
                      <TerminalIcon className="w-3 h-3" /> ATTEMPT_LOG
                    </div>
                    {labResult && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`z-10 p-2 rounded ${labResult.includes('SUCCESS') ? 'text-rose-400 bg-rose-500/10' : 'text-cyan-400 bg-cyan-500/10'}`}>
                        {labResult}
                      </motion.div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-slate-800/50" />
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="xss" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-slate-900 border-slate-800 rounded-3xl p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                       <Bug className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-tight">Vulnerability Brief</h3>
                      <div className="text-[10px] text-slate-500 font-mono">CROSS_SITE_SCRIPTING (XSS)</div>
                    </div>
                  </div>
                  <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                    <p>XSS allows an attacker to inject malicious scripts into trusted websites Viewed by other users.</p>
                    <p>This can lead to cookie theft, capture of form data, or malicious redirects.</p>
                    <p className="p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-xl text-cyan-400/80 text-xs text-wrap break-all">
                      Try entering <code className="text-cyan-300 font-bold px-1.5 py-0.5 bg-cyan-300/10 rounded ml-1">{"<script>alert('XSS')</script>"}</code> as the payload.
                    </p>
                  </div>
                </Card>

                <Card className="bg-slate-900 border-slate-800 rounded-3xl p-8 flex flex-col gap-6 shadow-xl">
                  <div className="space-y-4 flex-1">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] px-2">Inject Script Payload</label>
                       <Input 
                        value={xssInput}
                        onChange={(e) => setXssInput(e.target.value)}
                        placeholder="<script>alert(1)</script>" 
                        className="bg-slate-950 border-slate-800 h-14 rounded-2xl font-mono text-cyan-400 text-lg px-6 focus:ring-cyan-500"
                      />
                    </div>
                    <Button onClick={simulateXss} className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black h-14 rounded-2xl transition-all glow-cyan uppercase tracking-widest text-xs">
                      INJECT_SCRIPT <Play className="ml-2 w-4 h-4" />
                    </Button>
                  </div>

                  <div className="p-6 rounded-2xl border border-slate-800 bg-black/40 font-mono text-xs min-h-[120px] flex flex-col relative overflow-hidden">
                    <div className="text-slate-600 flex items-center gap-2 mb-3 z-10">
                      <TerminalIcon className="w-3 h-3" /> EXPLOIT_STATUS
                    </div>
                    {labResult && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`z-10 p-2 rounded ${labResult.includes('CRITICAL') ? 'text-rose-400 bg-rose-500/10' : 'text-green-400 bg-green-500/10'}`}>
                        {labResult}
                      </motion.div>
                    )}
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <Card className="bg-slate-900 border-slate-800 rounded-3xl p-8 mt-12 bg-gradient-to-r from-slate-900 to-slate-900/50">
             <div className="flex gap-8 items-center max-w-4xl mx-auto">
               <div className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center border border-cyan-500/20 glow-cyan shrink-0">
                 <ShieldAlert className="w-10 h-10 text-cyan-500" />
               </div>
               <div className="space-y-2">
                 <h4 className="text-xl font-bold text-white uppercase tracking-tight">Security Architect's Recommendation</h4>
                 <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">Always use prepared statements to prevent SQLi and utilize Content Security Policy (CSP) headers to mitigate XSS impact. Modern frameworks like React automatically sanitize most inputs, but server-side defense remains critical.</p>
               </div>
             </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
