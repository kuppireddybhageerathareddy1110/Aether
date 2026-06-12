import { useState } from 'react';
import { FlaskConical, Play, RefreshCw, Copy, CheckCircle, Code } from 'lucide-react';

interface TestCase { id: number; scenario: string; steps: string[]; }

function generateTestCases(query: string): TestCase[] {
  return [
    { id: 1, scenario: `Verify "${query}" loads correctly`, steps: [`Navigate to the feature`, `Enter query: "${query}"`, 'Verify response contains relevant content', 'Check confidence score > 0.8'] },
    { id: 2, scenario: `Test edge case for "${query}"`, steps: ['Submit empty query', 'Verify error message appears', 'Submit very long query', 'Verify truncation behavior'] },
    { id: 3, scenario: `Test "${query}" with multiple contexts`, steps: ['Load multiple documents', `Search for "${query}"`, 'Verify cross-document synthesis', 'Check citation accuracy'] },
  ];
}

function generateSelenium(query: string) {
  return `from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome()
wait = WebDriverWait(driver, 10)

def test_${query.toLowerCase().replace(/\s+/g, '_')}():
    driver.get("https://app.aether.ai/agentic-rag")
    
    # Wait for page load
    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "textarea")))
    
    # Enter query
    query_input = driver.find_element(By.CSS_SELECTOR, "textarea")
    query_input.clear()
    query_input.send_keys("${query}")
    
    # Run pipeline  
    run_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Run')]")
    run_btn.click()
    
    # Wait for results
    result = wait.until(EC.presence_of_element_located(
        (By.CSS_SELECTOR, "[class*='answer']")))
    
    assert result.is_displayed(), "Answer not shown"
    assert len(result.text) > 50, "Answer too short"
    print(f"✓ Test passed for: ${query}")

test_${query.toLowerCase().replace(/\s+/g, '_')}()
driver.quit()`;
}

export default function QAGenerator() {
  const [query, setQuery] = useState('');
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [selenium, setSelenium] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'cases' | 'selenium'>('cases');

  const generate = async () => {
    if (!query.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 800));
    setTestCases(generateTestCases(query));
    setSelenium(generateSelenium(query));
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(selenium).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-screen flex flex-col bg-transparent">
      <div className="border-b border-white/[0.07] bg-zinc-900/50 px-6 py-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2"><FlaskConical className="w-5 h-5 text-amber-400" />QA Generator</h1>
        <p className="text-xs text-zinc-500 mt-0.5">AI-generated test cases and Selenium scripts for platform features</p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="glass rounded-2xl p-5">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Generate Tests For</div>
            <div className="flex gap-3">
              <input value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && generate()}
                className="flex-1 bg-transparent border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50"
                placeholder="e.g. 'RAG query flow', 'knowledge graph generation', 'mood journal save'" />
              <button onClick={generate} disabled={loading || !query.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white rounded-xl text-sm font-medium transition-colors">
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                {loading ? 'Generating...' : 'Generate QA'}
              </button>
            </div>
          </div>

          {testCases.length > 0 && (
            <div>
              <div className="flex gap-2 mb-3">
                <button onClick={() => setActiveTab('cases')} className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === 'cases' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}>Test Cases ({testCases.length})</button>
                <button onClick={() => setActiveTab('selenium')} className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === 'selenium' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}><Code className="w-3 h-3 inline mr-1" />Selenium Script</button>
              </div>

              {activeTab === 'cases' && (
                <div className="space-y-3">
                  {testCases.map(tc => (
                    <div key={tc.id} className="glass rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center">TC{tc.id}</span>
                        <span className="text-sm font-semibold text-white">{tc.scenario}</span>
                      </div>
                      <ol className="space-y-1.5">
                        {tc.steps.map((step, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-400">
                            <span className="w-4 h-4 rounded bg-white/[0.06] text-zinc-500 text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                      <div className="mt-3 flex items-center gap-2 text-[10px] text-emerald-400"><CheckCircle className="w-3 h-3" />Ready to execute</div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'selenium' && (
                <div className="glass rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xs text-zinc-400">Python · Selenium WebDriver</div>
                    <button onClick={copy} className="flex items-center gap-1.5 px-3 py-1.5 glass-btn rounded-lg text-xs text-zinc-300 transition-colors">
                      {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="text-xs text-zinc-300 leading-relaxed overflow-x-auto font-mono whitespace-pre">{selenium}</pre>
                </div>
              )}
            </div>
          )}

          {testCases.length === 0 && (
            <div className="text-center py-16 text-zinc-600">
              <FlaskConical className="w-12 h-12 mx-auto mb-3 text-zinc-700" />
              <div className="text-sm">Enter a feature or scenario to generate test cases</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
