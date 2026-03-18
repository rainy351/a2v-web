import React, { useState, useCallback, useEffect } from 'react';
import {
  Shield, ArrowRight, Copy, Check, Upload, FileText,
  AlertCircle, Zap, Lock, ExternalLink
} from 'lucide-react';
import pako from 'pako';
import { motion, AnimatePresence } from 'motion/react';

function convertAmneziaToVless(vpnString: string, clientName: string = 'Amnezia_Import'): string {
  const base64 = vpnString.replace(/^vpn:\/\//, '').trim();
  const standardBase64 = base64.replace(/-/g, '+').replace(/_/g, '/');
  const paddedBase64 = standardBase64 + '='.repeat((4 - (standardBase64.length % 4)) % 4);
  const binaryString = atob(paddedBase64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  const compressedData = bytes.slice(4);
  const decompressed = pako.inflate(compressedData, { to: 'string' });
  const amneziaConfig = JSON.parse(decompressed);
  const xrayContainer = amneziaConfig.containers.find((c: any) => c.xray);
  const lastConfig = JSON.parse(xrayContainer.xray.last_config);
  const outbound = lastConfig.outbounds[0];
  const vnext = outbound.settings.vnext[0];
  const user = vnext.users[0];
  const streamSettings = outbound.streamSettings;
  const realitySettings = streamSettings.realitySettings;
  const params = new URLSearchParams({
    security: streamSettings.security || 'reality',
    sni: realitySettings.serverName || '',
    fp: realitySettings.fingerprint || 'chrome',
    pbk: realitySettings.publicKey || '',
    sid: realitySettings.shortId || '',
    spx: realitySettings.spiderX || '/',
    type: streamSettings.network || 'tcp',
    flow: user.flow || '',
    encryption: user.encryption || 'none'
  });
  return `vless://${user.id}@${vnext.address}:${vnext.port}?${params.toString()}#${encodeURIComponent(clientName)}`;
}

export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleConvert = useCallback(() => {
    if (!input.trim()) return;
    setError('');
    try {
      const vless = convertAmneziaToVless(input);
      setResult(vless);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
      setResult('');
    }
  }, [input]);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-emerald-500/30">
      <div className="atmosphere" />

      {/* Header */}
      <header className="max-w-4xl mx-auto pt-20 pb-12 px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-6"
        >
          <Zap size={12} /> Secure Local Conversion
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent"
        >
          Amnezia to VLESS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-stone-400 text-lg max-w-xl mx-auto leading-relaxed"
        >
          A professional-grade utility to transform your VPN keys.
          Zero data leaves your device.
        </motion.p>
      </header>

      <main className="max-w-4xl mx-auto pb-24 px-6 grid gap-8">
        {/* Input Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-[32px] p-8 md:p-10"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500 flex items-center gap-2">
              <Upload size={14} /> Input Configuration
            </h2>
            <label className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 cursor-pointer flex items-center gap-2 transition-all group">
              <FileText size={14} className="group-hover:scale-110 transition-transform" />
              <span>Import .vpn</span>
              <input type="file" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => setInput(ev.target?.result as string);
                  reader.readAsText(file);
                }
              }} accept=".vpn,.txt" />
            </label>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => setInput(ev.target?.result as string);
                reader.readAsText(file);
              }
            }}
            className="relative"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste vpn://... key or drag an amnezia .vpn file here"
              className={`w-full h-56 p-8 rounded-2xl glass-input transition-all resize-none focus:outline-none font-mono text-sm leading-relaxed text-stone-300 placeholder:text-stone-700
                ${isDragging ? 'border-emerald-500/50 bg-emerald-500/5' : ''}
              `}
            />
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleConvert}
              disabled={!input.trim()}
              className="group relative px-12 py-4 bg-white text-black rounded-2xl font-bold text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 disabled:opacity-20 transition-all overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Process Configuration <ArrowRight size={18} />
              </span>
            </button>
          </div>
        </motion.section>

        {/* Error/Result - AnimatePresence kept for UX */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl flex items-start gap-4 text-red-400">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm uppercase tracking-wider mb-1">Processing Failed</p>
                  <p className="text-sm opacity-80 leading-relaxed">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
          {result && (
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-[32px] p-8 md:p-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500 flex items-center gap-2">
                  <Shield size={14} /> Output VLESS URL
                </h2>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all
                    ${copied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-stone-400 hover:bg-white/10 hover:text-white'}
                  `}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="p-8 rounded-2xl bg-black/40 border border-white/5 text-stone-300 font-mono text-sm break-all leading-relaxed relative overflow-hidden">
                <div className="relative z-10">{result}</div>
                <div className="absolute top-0 right-0 p-4 opacity-20"><Lock size={16} /></div>
              </div>
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Protocol', value: 'VLESS + Reality', icon: Zap },
                  { label: 'Security', value: 'Encrypted', icon: Shield },
                  { label: 'Privacy', value: 'Local Only', icon: Lock }
                ].map((item, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-white/2 border border-white/5">
                    <item.icon size={16} className="text-stone-600 mb-4" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-stone-200">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-4xl mx-auto py-12 px-6 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8 text-stone-600 text-[10px] font-bold uppercase tracking-[0.2em]">
            <span className="flex items-center gap-2"><Lock size={12} /> Privacy First</span>
            <span className="flex items-center gap-2"><Zap size={12} /> Instant</span>
          </div>
          <div className="flex items-center gap-8">
            <a
              href="https://github.com/rainy351"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-bold uppercase tracking-widest text-stone-600 hover:text-emerald-400 flex items-center gap-2 transition-colors"
            >
              Developer <ExternalLink size={12} />
            </a>
            <a
              href="https://github.com/o-kos/a2v"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-bold uppercase tracking-widest text-stone-600 hover:text-emerald-400 flex items-center gap-2 transition-colors"
            >
              Based on <ExternalLink size={12} />
            </a>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-700">© 2026 A2V</p>
          </div>
        </div>
      </footer>
    </div>
  );
}