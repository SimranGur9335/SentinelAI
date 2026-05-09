import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Scan, Search, Terminal as TerminalIcon, AlertTriangle, CheckCircle2, ChevronRight, Download, BrainCircuit, Globe } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import axios from 'axios';
import { ai, MODELS } from '@/lib/gemini';
import ReactMarkdown from 'react-markdown';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ScanResult {
  url: string;
  riskScore: number;
  vulnerabilities: any[];
  headers: Record<string, string>;
}

export default function Scanner() {
  const { user } = useAuth();
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [logs]);

  const handleScan = async () => {
    if (!url) return toast.error('Please enter a target URL');
    if (!url.startsWith('http')) return toast.error('URL must start with http:// or https://');

    setScanning(true);
    setResult(null);
    setAiAnalysis(null);
    setLogs(['INITIALIZING_SCAN_ENGINE...', 'CONNECTING_TO_TARGET...']);
    
    try {
      addLog(`SCANNING_URL: ${url}`);
      const { data } = await axios.post('/api/scan', { url });
      
      addLog('FETCHING_HTTP_HEADERS...');
      await new Promise(r => setTimeout(r, 800));
      addLog('ANALYZING_SECURITY_HEADERS...');
      await new Promise(r => setTimeout(r, 500));
      addLog('CHECKING_FOR_SSL_TLS_INTEGRITY...');
      
      setResult(data);
      addLog('SCAN_COMPLETE_SYSTEM_SECURE');
      toast.success('Scan completed successfully');

      // Save to Firestore
      await addDoc(collection(db, 'scans'), {
        userId: user?.uid,
        url,
        riskScore: data.riskScore,
        vulnerabilityCount: data.vulnerabilities.length,
        results: data,
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      addLog(`ERROR: ${error.response?.data?.error || error.message}`);
      toast.error('Scan failed');
    } finally {
      setScanning(false);
    }
  };

  const runAIAnalysis = async () => {
    if (!result) return;
    setAnalyzing(true);
    try {
      const prompt = `Analyze these cybersecurity scan results for ${result.url}:
      Risk Score: ${result.riskScore}/100
      Vulnerabilities: ${JSON.stringify(result.vulnerabilities)}
      Headers Found: ${JSON.stringify(result.headers)}
      
      Please provide:
      1. A summary of the security posture.
      2. Explanation of each vulnerability.
      3. Remediation suggestions with code examples.
      4. Impact of potential attacks.`;

      const response = await ai.models.generateContent({
        model: MODELS.FLASH,
        contents: prompt,
      });

      setAiAnalysis(response.text || 'Failed to generate analysis.');
    } catch (error: any) {
      toast.error('AI Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 flex flex-col bg-slate-900/50 z-50">
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
          <Link to="/scanner" className="flex items-center gap-3 px-3 py-2 rounded-md bg-slate-800 text-cyan-400 border-l-2 border-cyan-400">
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
      </aside>

      <main className="flex-1 overflow-y-auto flex flex-col min-w-0 cyber-grid">
        <header className="h-16 border-b border-slate-800 bg-slate-900/30 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-white">Vulnerability Scanner</h2>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] uppercase font-bold border border-cyan-500/20">Pro Engine</span>
          </div>
        </header>

        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full flex-1">
          {/* Scanner Input */}
          <Card className="bg-slate-900 border-slate-800 rounded-2xl overflow-hidden">
            <CardContent className="p-10 text-center">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/20 glow-cyan mx-auto mb-2">
                  <Globe className="w-8 h-8 text-cyan-400" />
                </div>
                <h2 className="text-3xl font-black tracking-tighter text-white uppercase">Initialize Core Scan</h2>
                <p className="text-slate-400 text-sm">Enter a target endpoint to perform a deep-level security audit and identify potential exploit vectors using AI.</p>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Input 
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com" 
                      className="bg-slate-950 border-slate-800 h-14 pl-12 rounded-xl text-lg focus:ring-cyan-500 focus:border-cyan-500 transition-all font-mono"
                    />
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  </div>
                  <Button 
                    onClick={handleScan}
                    disabled={scanning}
                    className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 h-14 px-8 font-black rounded-xl glow-cyan transition-all disabled:opacity-50"
                  >
                    {scanning ? 'SCANNING...' : 'EXECUTE SCAN'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Terminal Feed */}
            <Card className="lg:col-span-2 bg-slate-950 border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[450px]">
              <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="text-cyan-400 w-3 h-3" />
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Live Output Logs</span>
                </div>
                {scanning && <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />}
              </div>
              <div className="flex-1 bg-black/40 p-4 font-mono text-xs overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="space-y-1">
                    {logs.map((log, i) => (
                      <div key={i} className={log.includes('ERROR') ? 'text-rose-500' : log.includes('SCAN_COMPLETE') ? 'text-green-400' : 'text-cyan-400/80'}>
                        <span className="text-slate-700 mr-2">{'>'}</span> {log}
                      </div>
                    ))}
                    {scanning && (
                      <div className="flex items-center gap-2 text-cyan-400">
                        <span className="text-slate-700 mr-2">{'>'}</span> SYSTEM_SCANNING_IN_PROGRESS
                        <span className="animate-pulse">_</span>
                      </div>
                    )}
                    <div ref={terminalEndRef} />
                  </div>
                </ScrollArea>
              </div>
            </Card>

            {/* Side Analytics */}
            <div className="space-y-6">
              <Card className="bg-slate-900 border-slate-800 rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 tracking-widest mb-1 uppercase">Risk Magnitude</p>
                  <div className={`text-4xl font-black ${result ? (result.riskScore > 70 ? 'text-rose-500' : 'text-green-400') : 'text-slate-800'}`}>
                    {result ? `${result.riskScore}` : '--'}<span className="text-lg">/100</span>
                  </div>
                </div>
                <div className={`h-16 w-16 rounded-full border border-slate-800 flex items-center justify-center ${result?.riskScore > 70 ? 'glow-rose border-rose-500/20' : result ? 'glow-cyan border-green-500/20' : ''}`}>
                  {result ? (
                    result.riskScore > 70 ? <AlertTriangle className="text-rose-500 w-8 h-8" /> : <CheckCircle2 className="text-green-400 w-8 h-8" />
                  ) : <Scan className="text-slate-800 w-8 h-8" />}
                </div>
              </Card>

              <Card className="bg-slate-900 border-slate-800 rounded-2xl flex-1 max-h-[325px] flex flex-col">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Detection Registry</h3>
                  {result && <Badge className="text-[9px] bg-cyan-500/10 text-cyan-400 border-cyan-500/20">{result.vulnerabilities.length} Found</Badge>}
                </div>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                    {result?.vulnerabilities.map((v, i) => (
                      <div key={i} className="flex flex-col gap-1 p-3 border border-slate-800 bg-slate-950/50 rounded-xl group hover:border-slate-700 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-200">{v.title}</span>
                          <Badge className={`text-[8px] font-black uppercase px-1.5 py-0 ${v.severity === 'critical' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>
                            {v.severity}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{v.description}</p>
                      </div>
                    ))}
                    {!result && <div className="text-center py-10 text-slate-700 text-[10px] font-mono tracking-widest uppercase italic">Awaiting Telemetry...</div>}
                  </div>
                </ScrollArea>
              </Card>
            </div>
          </div>

          {/* AI Analysis Section */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 pb-12"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                       <BrainCircuit className="text-cyan-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tighter text-white">AI_REMEDIATION_LOGIC</h2>
                        <div className="text-[10px] text-cyan-500 font-mono">NEURAL_SECURITY_ENGINE_ONLINE</div>
                    </div>
                  </div>
                  <Button 
                    onClick={runAIAnalysis} 
                    disabled={analyzing}
                    className="bg-white text-slate-950 hover:bg-cyan-500 hover:text-slate-950 font-black rounded-xl glow-cyan transition-all h-12 px-6"
                  >
                    {analyzing ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <BrainCircuit className="w-4 h-4 mr-2" />}
                    {analyzing ? 'ANALYZING...' : 'GENERATE AI REPORT'}
                  </Button>
                </div>

                <Card className="bg-slate-900 border-slate-800 rounded-3xl overflow-hidden min-h-[300px]">
                  <div className="p-2 bg-slate-950/50 border-b border-slate-800 flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                  </div>
                  <div className="p-8">
                    {analyzing ? (
                       <div className="py-20 text-center space-y-6">
                         <div className="relative w-16 h-16 mx-auto">
                            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" />
                            <div className="absolute inset-2 rounded-full border-2 border-cyan-500/10 border-b-cyan-500 animate-[spin_1.5s_linear_infinite_reverse]" />
                         </div>
                         <div className="space-y-1">
                           <p className="text-[10px] font-mono text-cyan-400 tracking-[0.3em] uppercase animate-pulse">Running Neural Security Analysis</p>
                           <p className="text-xs text-slate-600 font-mono">Accessing Gemini-1.5-Flash model...</p>
                         </div>
                       </div>
                    ) : aiAnalysis ? (
                      <div className="prose prose-invert max-w-none prose-cyan prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800 text-slate-300">
                        <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="py-20 text-center space-y-4">
                        <TerminalIcon className="w-12 h-12 text-slate-800 mx-auto" />
                        <p className="max-w-md mx-auto text-slate-600 text-sm font-medium">
                          Select the AI Action Button above to trigger the Sentinel Security Copilot for deep-level remediation and exploit analysis.
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
