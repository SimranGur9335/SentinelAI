import { motion } from 'motion/react';
import { Shield, Lock, Zap, Cpu, BarChart3, Globe, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Landing() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();

  const handleStart = async () => {
    if (user) {
      navigate('/dashboard');
    } else {
      await signIn();
      navigate('/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 cyber-grid">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/30 backdrop-blur-md border-b border-slate-800 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <Shield className="w-5 h-5 text-slate-950" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">Sentinel<span className="text-cyan-400">AI</span></span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
          <a href="#lab" className="hover:text-cyan-400 transition-colors">Security Lab</a>
          <a href="#pricing" className="hover:text-cyan-400 transition-colors">Enterprise</a>
        </div>
        <Button 
          onClick={handleStart}
          variant="outline" 
          className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-all glow-cyan"
        >
          {user ? 'Go to Dashboard' : 'Secure Login'}
        </Button>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-xs font-semibold uppercase tracking-widest"
          >
            <Zap className="w-4 h-4" />
            AI-Powered Threat Detection V2.0
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-none"
          >
            SECURE YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-400">DIGITAL ASSETS</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl text-lg text-slate-400"
          >
            SentinelAI uses advanced neural networks to scan, detect, and remediate vulnerabilities across your web applications and cloud infrastructure in real-time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex gap-4"
          >
            <Button onClick={handleStart} size="lg" className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 px-8 h-12 text-md font-bold rounded-xl group glow-cyan transition-all">
              START SCANNING <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="border-slate-800 hover:bg-white/5 px-8 h-12 text-md font-bold rounded-xl transition-all">
              VIEW DEMO
            </Button>
          </motion.div>
        </div>

        {/* Features Preview */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-40">
          {[
            { icon: Globe, title: 'Web Scanner', desc: 'Deep-level scanning for XSS, SQLi, and CORS vulnerabilities.' },
            { icon: Cpu, title: 'AI Remediation', desc: 'Get smart suggestions and secure code snippets to fix issues.' },
            { icon: Lock, title: 'Cloud Armor', desc: 'Secure your AWS, GCP, and Azure buckets and IAM policies.' }
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-8 group hover:border-cyan-500/50 transition-all cursor-default"
            >
              <f.icon className="w-12 h-12 text-cyan-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2 text-white">{f.title}</h3>
              <p className="text-slate-500 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Stats Section */}
      <section className="bg-cyan-600/5 py-24 border-y border-slate-800">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: 'THREATS NEUTRALIZED', value: '2.4M+' },
            { label: 'VULNERABILITIES SCANNED', value: '450K+' },
            { label: 'ENTERPRISE USERS', value: '12K+' },
            { label: 'UPTIME SLA', value: '99.9%' }
          ].map((s, i) => (
            <div key={i} className="space-y-2">
              <div className="text-4xl font-black text-cyan-500">{s.value}</div>
              <div className="text-[10px] text-slate-500 tracking-[0.2em] font-bold">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-slate-600 text-xs tracking-widest uppercase mb-10">
        &copy; 2026 SENTINEL_AI SECURITY SYSTEMS // ALL RIGHTS RESERVED
      </footer>
    </div>
  );
}
