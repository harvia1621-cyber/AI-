import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Trash2, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  Info,
  ChevronDown
} from 'lucide-react';

type Tone = 'natural' | 'academic' | 'creative' | 'casual';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [tone, setTone] = useState<Tone>('natural');
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const humanize = async () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await fetch('/api/humanize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, tone }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to humanize text');
      }

      const data = await response.json();
      setOutputText(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setError(null);
  };

  const wordCount = (text: string) => text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-screen bg-bg-main flex flex-col font-sans">
      {/* Header */}
      <header className="bg-bg-main border-b border-border-subtle h-[72px] px-10 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gradient-to-br from-accent to-indigo-400 rounded-[6px] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight" id="logo-text">Humanize AI Pro</h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <span className="text-sm font-medium text-text-secondary cursor-default">Humanizer</span>
          <span className="text-sm font-medium text-text-secondary cursor-default">Check AI</span>
          <span className="text-sm font-medium text-text-secondary cursor-default">Pricing</span>
          <span className="text-sm font-medium text-text-secondary cursor-default">Guide</span>
        </nav>

        <div className="flex items-center gap-4">
          <span className="hidden md:block text-[13px] text-text-secondary">1,250 words left</span>
          <div className="w-8 h-8 rounded-full bg-[#1C1C24] border border-border-subtle" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1024px] mx-auto w-full px-10 py-10 flex flex-col gap-6">
        <div className="max-w-[600px] mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[32px] font-semibold text-white mb-2 leading-tight"
            id="hero-title"
          >
            Bypass AI Detection
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[15px] text-text-secondary leading-relaxed"
            id="hero-desc"
          >
            Transform your AI-generated content into natural, human-like writing that passes all major AI detectors with 99.9% accuracy.
          </motion.p>
        </div>

        {/* Editor Implementation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 min-h-[400px]">
          {/* Input Area */}
          <div className="panel" id="input-card">
            <div className="panel-header">
              <span>Input Text</span>
              <div className="flex items-center gap-3">
                <span id="input-word-count">Word Count: {wordCount(inputText)}</span>
                <button 
                  onClick={handleClear}
                  className="text-text-secondary hover:text-white transition-colors"
                  title="Clear input"
                  id="clear-btn"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="textarea-container">
              <textarea
                id="input-textarea"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste AI text, remove the API key..."
                className="custom-scrollbar"
                spellCheck="false"
              />
            </div>
          </div>

          {/* Output Area */}
          <div className="panel h-full" id="output-card">
            <div className="panel-header border-b border-border-subtle">
              <span className="text-[#A78BFA] flex items-center gap-2">
                Humanized Output
                {outputText && (
                  <div className="bg-[rgba(124,58,237,0.1)] text-accent px-2 py-0.5 rounded-[4px] text-[10px] font-bold">
                    100% HUMAN SCORE
                  </div>
                )}
              </span>
              <div className="flex items-center gap-3">
                <span id="output-word-count">Word Count: {wordCount(outputText)}</span>
                <button 
                  id="copy-btn"
                  onClick={handleCopy}
                  disabled={!outputText}
                  className={`transition-all ${isCopied ? 'text-green-500' : 'text-text-secondary hover:text-white'}`}
                  title="Copy to clipboard"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            
            <div className="textarea-container">
              <AnimatePresence mode="wait">
                {isProcessing ? (
                  <motion.div 
                    key="processing"
                    id="processing-loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center"
                  >
                    <div className="w-10 h-10 border-2 border-accent/20 border-t-accent rounded-full animate-spin mb-4" />
                    <h3 className="text-sm font-bold text-white mb-1">Humanizing...</h3>
                    <p className="text-xs text-text-secondary">Randomizing sentence flow and sentence structure.</p>
                  </motion.div>
                ) : outputText ? (
                  <motion.textarea
                    key="output"
                    id="output-textarea"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    value={outputText}
                    readOnly
                    className="custom-scrollbar !text-[#A78BFA]"
                    spellCheck="false"
                  />
                ) : (
                  <motion.div 
                    key="placeholder"
                    id="output-placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-[#52526b] pointer-events-none p-12 text-center"
                  >
                    <Zap className="w-8 h-8 mb-3 opacity-20" />
                    <p className="text-sm">Your humanized result will appear here.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {error && (
              <div id="error-message" className="absolute bottom-4 left-4 right-4 bg-red-900/10 border border-red-500/20 p-3 rounded-xl flex items-start gap-3">
                <Info className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-400 truncate">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Controls Bar Implementation */}
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-3 px-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mr-2">Mode:</span>
            <div className="flex gap-2">
              {(['natural', 'academic', 'creative', 'casual'] as Tone[]).map((t) => (
                <button
                  key={t}
                  id={`tone-option-${t}`}
                  onClick={() => setTone(t)}
                  className={`mode-btn ${tone === t ? 'mode-btn-active' : ''}`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button
            id="humanize-btn"
            onClick={humanize}
            disabled={isProcessing || !inputText.trim()}
            className="btn-primary group"
          >
            {isProcessing ? 'Processing...' : 'Humanize Text'}
            {!isProcessing && <ArrowRight className="w-4 h-4 inline-block ml-2" />}
          </button>
        </div>

        {/* Design Stats Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-[13px] text-text-secondary px-2 mt-4">
           <div>Support for GPT-4, Claude 3, and Gemini detection bypass</div>
           <div>English (US) &bull; No API Key Required</div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-bg-main border-t border-border-subtle py-8 px-10" id="footer">
        <div className="max-w-[1024px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-accent/20 rounded-md flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-accent" />
            </div>
            <span className="text-sm font-bold text-white">Humanize AI Pro</span>
          </div>
          
          <div className="flex gap-8 text-[11px] text-text-secondary uppercase tracking-widest font-semibold">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>

          <p className="text-[11px] text-text-secondary">&copy; 2026 Humanize AI Pro</p>
        </div>
      </footer>

      {/* Embedded Design Styles for Panels */}
      <style>{`
        .panel {
          background: #14141A;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .panel-header {
          padding: 12px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #9494A3;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .textarea-container {
          flex: 1;
          padding: 20px;
          position: relative;
        }
        .textarea-container textarea {
          width: 100%;
          height: 100%;
          background: transparent;
          border: none;
          color: #FFFFFF;
          font-family: inherit;
          font-size: 16px;
          line-height: 1.6;
          resize: none;
          outline: none;
        }
      `}</style>
    </div>
  );
}


