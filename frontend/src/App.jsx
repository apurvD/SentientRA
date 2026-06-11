import React, { useState } from 'react';
import axios from 'axios';
import { Play, Code, AlertTriangle, Activity, Loader2 } from 'lucide-react';

function App() {
  // --- State Variables ---
  const [targetUrl, setTargetUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [activeViolation, setActiveViolation] = useState(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- API Handlers ---
  const handleAudit = async (e) => {
    e.preventDefault();
    if (!targetUrl) return;

    setIsLoading(true);
    setError(null);
    setAuditResult(null);
    setActiveViolation(null);

    try {
      // Phase 1 & 2: Scrape and Reason
      const response = await axios.post('http://localhost:5000/api/audit', { targetUrl });
      setAuditResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to connect to SentientRA backend.');
    } finally {
      setIsLoading(false);
    }
  };

  const playSimulationAudio = async (text) => {
    if (!text) return;
    setIsAudioLoading(true);

    try {
      // Phase 3: Fetch the raw audio stream as a Blob
      const response = await axios.post('http://localhost:5000/api/speak', 
        { text },
        { responseType: 'blob' } // Crucial for handling binary audio files in the browser
      );

      // Create a temporary URL for the blob and play it natively
      const audioUrl = URL.createObjectURL(response.data);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (err) {
      console.error('Failed to stream audio:', err);
      alert('Audio simulation failed to load.');
    } finally {
      setIsAudioLoading(false);
    }
  };

  // --- UI Layout ---
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      
      {/* HEADER: Control Center */}
      <header className="p-4 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="text-blue-400" size={28} />
          <h1 className="text-2xl font-bold tracking-wide">Sentient<span className="text-blue-400">RA</span></h1>
        </div>
        
        <form onSubmit={handleAudit} className="flex w-1/2 max-w-2xl">
          <input
            type="url"
            className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-l-md focus:outline-none focus:border-blue-500 text-white"
            placeholder="https://example.com"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-500 px-6 font-semibold rounded-r-md transition-colors flex items-center justify-center min-w-[120px]"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Audit URL'}
          </button>
        </form>
      </header>

      {/* ERROR HANDLING */}
      {error && (
        <div className="bg-red-900/50 text-red-200 p-3 text-center border-b border-red-800">
          <AlertTriangle className="inline mr-2" size={18} /> {error}
        </div>
      )}

      {/* MAIN WORKSPACE: Split Screen */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANEL: Developer Code Workspace */}
        <div className="w-1/2 border-r border-gray-700 overflow-y-auto bg-gray-900 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-300 flex items-center gap-2">
            <Code size={20} /> Structural Violations
          </h2>
          
          {!auditResult && !isLoading && (
            <p className="text-gray-500 italic mt-10 text-center">Enter a URL to begin the cognitive audit.</p>
          )}

          {auditResult && auditResult.violations.map((violation, index) => (
            <div 
              key={index} 
              onClick={() => setActiveViolation(violation)}
              className={`p-4 mb-4 rounded-lg cursor-pointer transition-all border ${
                activeViolation === violation 
                  ? 'bg-blue-900/30 border-blue-500' 
                  : 'bg-gray-800 border-gray-700 hover:bg-gray-750'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-1 text-xs font-bold rounded ${
                  violation.impact === 'Critical' ? 'bg-red-900 text-red-300' :
                  violation.impact === 'Moderate' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-green-900 text-green-300'
                }`}>
                  {violation.impact}
                </span>
              </div>
              <code className="block bg-gray-950 p-2 rounded text-sm text-red-400 overflow-x-auto mb-3">
                {violation.element}
              </code>
              <p className="text-gray-300 text-sm">{violation.explanation}</p>
            </div>
          ))}
        </div>

        {/* RIGHT PANEL: Acoustic Empathy Sandbox */}
        <div className="w-1/2 bg-gray-950 p-6 flex flex-col relative overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 text-gray-300">Empathy Sandbox</h2>
          
          {activeViolation ? (
            <div className="flex flex-col h-full">
              
              {/* Playback Controls */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl mb-6">
                <h3 className="text-sm text-gray-400 uppercase tracking-wider font-bold mb-3">Acoustic Simulation</h3>
                <div className="flex items-start gap-4">
                  <button 
                    onClick={() => playSimulationAudio(activeViolation.screenReaderSimulation)}
                    disabled={isAudioLoading}
                    className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full flex-shrink-0 transition-transform active:scale-95"
                  >
                    {isAudioLoading ? <Loader2 className="animate-spin" size={24} /> : <Play size={24} fill="currentColor" />}
                  </button>
                  <p className="text-gray-200 text-lg italic bg-gray-900 p-4 rounded-lg flex-1 border border-gray-700">
                    "{activeViolation.screenReaderSimulation}"
                  </p>
                </div>
              </div>

              {/* Remediation Code */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl mb-6">
                 <h3 className="text-sm text-green-400 uppercase tracking-wider font-bold mb-3 flex items-center gap-2">
                   Resolved Implementation
                 </h3>
                 <code className="block bg-gray-950 p-4 rounded-lg text-sm text-green-300 overflow-x-auto whitespace-pre-wrap border border-gray-800">
                   {activeViolation.remediation}
                 </code>
              </div>

              {/* Visual Context (Phase 1 Screenshot) */}
              {auditResult.screenshot && (
                <div className="mt-auto opacity-50 hover:opacity-100 transition-opacity">
                   <h3 className="text-xs text-gray-500 uppercase mb-2">Visual Viewport</h3>
                   <img 
                     src={auditResult.screenshot} 
                     alt="Scraped layout" 
                     className="w-full rounded border border-gray-700 filter grayscale" 
                   />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-600">
              <Play size={48} className="mb-4 opacity-20" />
              <p>Select a violation from the workspace to enter the sandbox.</p>
            </div>
          )}
        </div>
        
      </main>
    </div>
  );
}

export default App;