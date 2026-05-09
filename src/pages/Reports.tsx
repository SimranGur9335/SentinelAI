import { ShieldAlert, FileText, Download, Trash2, LayoutDashboard, Scan, Target, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function Reports() {
  const { user } = useAuth();
  const [scans, setScans] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'scans'), where('userId', '==', user.uid), orderBy('timestamp', 'desc'));
      getDocs(q).then((snap) => {
        setScans(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'scans', id));
    setScans(prev => prev.filter(s => s.id !== id));
    toast.success('Report deleted');
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
          <Link to="/scanner" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 transition-colors text-slate-400 hover:text-white">
            <Scan className="w-4 h-4" /> Security Scanner
          </Link>
          <Link to="/lab" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/5 transition-colors text-slate-400 hover:text-white">
            <Target className="w-4 h-4" /> Attack Lab
          </Link>
          <Link to="/reports" className="flex items-center gap-3 px-3 py-2 rounded-md bg-slate-800 text-cyan-400 border-l-2 border-cyan-400">
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
            <h2 className="text-lg font-semibold text-white">Security Report Archive</h2>
            <Badge className="bg-slate-800 text-slate-400 border-slate-700">{scans.length} Reports Found</Badge>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto w-full space-y-8 flex-1">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase">Historical_Telemetry</h1>
            <p className="text-slate-500 text-sm">Access and download your historical security audits and AI-driven remediations.</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {scans.map((scan) => (
              <Card key={scan.id} className="bg-slate-900 border-slate-800 group hover:border-cyan-500/30 transition-all rounded-2xl overflow-hidden shadow-lg hover:shadow-cyan-500/5">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-xl border flex items-center justify-center ${scan.riskScore > 70 ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'}`}>
                      <FileText className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">{scan.url}</h3>
                      <div className="flex items-center gap-3 mt-1">
                         <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">{new Date(scan.timestamp).toLocaleString()}</p>
                         <span className="w-1 h-1 rounded-full bg-slate-700" />
                         <p className={`text-[10px] font-bold uppercase tracking-widest ${scan.riskScore > 70 ? 'text-rose-500' : 'text-cyan-500'}`}>
                           Status: {scan.riskScore > 70 ? 'Critical Breach Risk' : 'Operating within Limits'}
                         </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                       <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">Threat Score</p>
                       <div className={`text-2xl font-black ${scan.riskScore > 70 ? 'text-rose-500' : 'text-white'}`}>
                         {scan.riskScore}<span className="text-xs text-slate-500">/100</span>
                       </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" className="h-10 w-10 text-slate-400 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all rounded-lg"><Download className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(scan.id)} className="h-10 w-10 text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all rounded-lg"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {scans.length === 0 && (
               <div className="text-center py-32 bg-slate-900 border border-dashed border-slate-800 rounded-3xl space-y-6">
                 <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center mx-auto border border-slate-800">
                    <FileText className="w-8 h-8 text-slate-800" />
                 </div>
                 <div className="space-y-1">
                   <p className="text-white font-bold uppercase tracking-widest text-sm">No Audit Telemetry Found</p>
                   <p className="text-slate-600 text-xs max-w-xs mx-auto">Initiate a system scan in the Security Scanner section to generate your first audit record.</p>
                 </div>
                 <Button onClick={() => window.location.href='/scanner'} className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black rounded-xl px-8 h-12 glow-cyan transition-all">
                    START_FIRST_SCAN
                 </Button>
               </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
