import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/Sidebar";

import Dashboard from "@/pages/Dashboard";
import AgenticRAG from "@/pages/AgenticRAG";
import LaTeXEditor from "@/pages/LaTeXEditor";
import XAIDashboard from "@/pages/XAIDashboard";
import MoodJournal from "@/pages/MoodJournal";
import Notifications from "@/pages/Notifications";
import Account from "@/pages/Account";
import Help from "@/pages/Help";
import Settings from "@/pages/Settings";

import Graph from "@/pages/Graph";
import QA from "@/pages/QA";
import Journal from "@/pages/Journal";
import XAI from "@/pages/XAI";
import Upload from "@/pages/Upload";
import Search from "@/pages/Search";
import Chat from "@/pages/Chat";
import Agents from "@/pages/Agents";
import Projects from "@/pages/Projects";
import Timeline from "@/pages/Timeline";
import Assistant from "@/pages/Assistant";
import GeneratePaper from "@/pages/GeneratePaper";
import GraphViz from "@/pages/GraphViz";
import KnowledgeMap from "@/pages/KnowledgeMap";
import MoodGraph from "@/pages/MoodGraph";
import SmartDashboard from "@/pages/SmartDashboard";
import Insights from "@/pages/Insights";
import Collaborate from "@/pages/Collaborate";
import AutoResearch from "@/pages/AutoResearch";
import ResearchBrain from "@/pages/ResearchBrain";
import ResearchOS from "@/pages/ResearchOS";
import AetherCore from "@/pages/AetherCore";
import Sandbox from "@/pages/Sandbox";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/agentic-rag" component={AgenticRAG} />
      <Route path="/latex-editor" component={LaTeXEditor} />
      <Route path="/editor" component={LaTeXEditor} />
      <Route path="/xai-dashboard" component={XAIDashboard} />
      <Route path="/mood-journal" component={MoodJournal} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/account" component={Account} />
      <Route path="/help" component={Help} />
      <Route path="/settings" component={Settings} />
      <Route path="/knowledge-graph" component={Graph} />
      <Route path="/graph" component={Graph} />
      <Route path="/qa" component={QA} />
      <Route path="/journal" component={Journal} />
      <Route path="/xai" component={XAI} />
      <Route path="/upload" component={Upload} />
      <Route path="/search" component={Search} />
      <Route path="/rag-chat" component={Chat} />
      <Route path="/chat" component={Chat} />
      <Route path="/agents" component={Agents} />
      <Route path="/projects" component={Projects} />
      <Route path="/timeline" component={Timeline} />
      <Route path="/assistant" component={Assistant} />
      <Route path="/generate-paper" component={GeneratePaper} />
      <Route path="/graph-viz" component={GraphViz} />
      <Route path="/knowledge-map" component={KnowledgeMap} />
      <Route path="/mood-graph" component={MoodGraph} />
      <Route path="/smart-dashboard" component={SmartDashboard} />
      <Route path="/insights" component={Insights} />
      <Route path="/collaborate" component={Collaborate} />
      <Route path="/auto-research" component={AutoResearch} />
      <Route path="/research-brain" component={ResearchBrain} />
      <Route path="/research-os" component={ResearchOS} />
      <Route path="/aether-core" component={AetherCore} />
      <Route path="/sandbox" component={Sandbox} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <div className="flex h-screen text-white overflow-hidden relative" style={{ background: '#060610' }}>
          {/* Ambient background blobs */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
            <div
              className="ambient-blob"
              style={{ width: 700, height: 700, top: '-20%', left: '-15%', background: 'radial-gradient(circle, rgba(52,211,153,0.28) 0%, rgba(13,148,136,0.12) 40%, transparent 70%)', filter: 'blur(60px)' }}
            />
            <div
              className="ambient-blob"
              style={{ width: 600, height: 600, top: '35%', right: '-12%', background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, rgba(99,102,241,0.1) 40%, transparent 70%)', filter: 'blur(60px)', animationDelay: '-7s' }}
            />
            <div
              className="ambient-blob"
              style={{ width: 500, height: 500, bottom: '-15%', left: '25%', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(37,99,235,0.08) 40%, transparent 70%)', filter: 'blur(60px)', animationDelay: '-14s' }}
            />
            <div
              className="ambient-blob"
              style={{ width: 350, height: 350, top: '15%', left: '40%', background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)', filter: 'blur(60px)', animationDelay: '-3s' }}
            />
            <div
              className="ambient-blob"
              style={{ width: 250, height: 250, top: '60%', left: '55%', background: 'radial-gradient(circle, rgba(251,191,36,0.1) 0%, transparent 70%)', filter: 'blur(50px)', animationDelay: '-10s' }}
            />
          </div>

          {/* Content layer */}
          <div className="relative flex w-full h-full" style={{ zIndex: 1 }}>
            <Sidebar />
            <main className="flex-1 overflow-auto">
              <Router />
            </main>
          </div>
        </div>
        <Toaster />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
