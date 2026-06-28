"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  TrendingUp, 
  Users, 
  PhoneCall, 
  Clock, 
  ShieldAlert, 
  Database, 
  Cpu, 
  Zap, 
  Sun, 
  Moon, 
  RefreshCw, 
  Play, 
  CheckCircle, 
  Server, 
  Lock, 
  FileText, 
  ChevronRight, 
  Calendar, 
  DollarSign, 
  AlertTriangle,
  LayoutDashboard,
  Bot,
  UserCheck,
  Map,
  Search,
  Send,
  Phone,
  HelpCircle,
  ExternalLink,
  BookOpen,
  Volume2,
  Mic,
  MessageSquare,
  LogOut,
  Plus,
  Mail,
  UserPlus,
  Upload,
  FileSpreadsheet,
  HelpCircle as QuestionIcon,
  Globe,
  XCircle,
  Trash2,
  Bell
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Custom SVG Premium Logo for Llaman2 Manager (with letters LM and subtle llama ears)
function LMLogo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={`${className} drop-shadow-sm`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="60%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      {/* Background Rounded Square */}
      <rect x="5" y="5" width="110" height="110" rx="28" fill="url(#logoGrad)" />
      
      {/* Llama Ears Line Art (subtle top shape) */}
      <path d="M 32,35 L 42,16 L 50,34" fill="none" stroke="white" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
      <path d="M 88,35 L 78,16 L 70,34" fill="none" stroke="white" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
      
      {/* Intertwined Geometric L & M */}
      <text x="50%" y="67%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="48" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="-2.5">
        LM
      </text>
      
      {/* Active dot */}
      <circle cx="60" cy="94" r="5" fill="#10b981" />
    </svg>
  );
}

const translations = {
  en: {
    dashboard: "Dashboard",
    scheduler: "Shift Optimizer",
    workforce_admin: "Workforce Mgmt",
    crm: "Outbound CRM",
    coach: "AI Sales Coach",
    advanced: "Operations Deep-Dive",
    goodMorning: "Good Morning",
    signOut: "Sign Out",
    activeDashboard: "Active Call Center dashboard syncing live leads via Amazon Connect.",
    searchPlaceholder: "Search in full network...",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    callsToday: "Calls Made Today",
    avgDuration: "Avg Call Duration",
    closedLeads: "Closed Leads Today",
    targetProgress: "Month target progress",
    actionCenter: "Action Center Metrics",
    actionNeeded: "Action Needed",
    attentionRequired: "Attention Required",
    criticalPriority: "Critical Priority",
    monthlyQuota: "Monthly Quota",
    completed: "Completed",
    sales: "sales",
    crmPerformance: "CRM Performance",
    monthProgressDescription: "Progress of Outbound sales goals against monthly quota.",
    twilioDialer: "Amazon Connect Dialer",
    twilioStatusLabel: "Connect Device Status",
    simulated: "Simulated",
    liveTwilio: "Amazon Connect (Live)",
    unregistered: "Offline",
    ready: "Ready",
    registering: "Connecting...",
    error: "Error",
    outboundCall: "Outbound Cloud Telephony",
    hangUp: "Hang Up",
    dialing: "Dialing...",
    connected: "Connected",
    connectConsole: "Open Amazon Connect Instances",
    connectConsoleDesc: "Manage your contact center instances in the AWS Console.",
  },
  es: {
    dashboard: "Panel de Control",
    scheduler: "Optimizador de Turnos",
    workforce_admin: "Gestión de Personal",
    crm: "CRM de Salidas",
    coach: "Entrenador de Ventas IA",
    advanced: "Análisis de Operaciones",
    goodMorning: "Buenos Días",
    signOut: "Cerrar Sesión",
    activeDashboard: "Panel activo del centro de llamadas sincronizando clientes potenciales vía Amazon Connect.",
    searchPlaceholder: "Buscar en toda la red...",
    lightMode: "Modo Claro",
    darkMode: "Modo Oscuro",
    callsToday: "Llamadas Realizadas Hoy",
    avgDuration: "Duración Promedio de Llamada",
    closedLeads: "Contactos Cerrados Hoy",
    targetProgress: "Progreso de la meta mensual",
    actionCenter: "Métricas del Centro de Acción",
    actionNeeded: "Acción Requerida",
    attentionRequired: "Atención Necesaria",
    criticalPriority: "Prioridad Crítica",
    monthlyQuota: "Cuota Mensual",
    completed: "Completado",
    sales: "ventas",
    crmPerformance: "Rendimiento del CRM",
    monthProgressDescription: "Progreso de las metas de ventas salientes frente a la cuota mensual.",
    twilioDialer: "Marcador Amazon Connect",
    twilioStatusLabel: "Estado del Dispositivo Connect",
    simulated: "Simulado",
    liveTwilio: "Amazon Connect (En Vivo)",
    unregistered: "Desconectado",
    ready: "Listo",
    registering: "Conectando...",
    error: "Error",
    outboundCall: "Telefonía en la Nube de Salida",
    hangUp: "Colgar",
    dialing: "Marcando...",
    connected: "Conectado",
    connectConsole: "Abrir Instancias de Amazon Connect",
    connectConsoleDesc: "Gestione las instancias de su centro de contacto en la Consola de AWS.",
  }
};

export default function Home() {
  // Login Authentication States
  const [userRole, setUserRole] = useState<"guest" | "workforce" | "agent">("guest");
  const [activeUserName, setActiveUserName] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Navigation tab (filtered by role)
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState<"en" | "es">("en");

  const toggleTheme = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    if (typeof window !== "undefined") {
      localStorage.setItem("llaman2_theme", nextMode ? "dark" : "light");
    }
  };
  
  // Everyday Dashboard Metrics (live values from Aurora via /api/metrics — no fake seeds)
  const [callsToday, setCallsToday] = useState(0);
  const [avgDuration, setAvgDuration] = useState("0s");
  const [closedLeads, setClosedLeads] = useState(0);
  const [targetProgress, setTargetProgress] = useState(0); // % of monthly target
  const [totalClosedWon, setTotalClosedWon] = useState(0); // real month-to-date closed sales
  const [pipeline, setPipeline] = useState<Record<string, number>>({});

  // Amazon Connect Dial Simulator state
  const [connectStatus, setConnectStatus] = useState<"available" | "busy" | "calling" | "connected">("available");
  const [connectNumber, setConnectNumber] = useState("");
  const [connectName, setConnectName] = useState("");
  const [callDuration, setCallDuration] = useState(0);
  const callTimer = useRef<NodeJS.Timeout | null>(null);

  // Amazon Connect / cloud telephony state.
  // Credentials live server-side only; the client just selects a mode and receives a short-lived token.
  const [ccpMode, setCcpMode] = useState<"simulated" | "twilio">("simulated");
  const [twilioStatus, setTwilioStatus] = useState<"unregistered" | "ready" | "connecting" | "connected" | "error" | "registering">("unregistered");

  const deviceRef = useRef<any>(null);
  const activeCallRef = useRef<any>(null);
  const twilioScriptLoadedRef = useRef(false);

  // Form Inputs for Planning & Forecasting
  const [weeklyUsersTarget, setWeeklyUsersTarget] = useState(12000);
  const [agentsMorning, setAgentsMorning] = useState(12);
  const [agentsAfternoon, setAgentsAfternoon] = useState(15);
  const [agentsNight, setAgentsNight] = useState(8);
  const [agentsWeekend, setAgentsWeekend] = useState(6);
  const [agentsTotalMonth, setAgentsTotalMonth] = useState(25);
  const [pursueTarget, setPursueTarget] = useState(150); // Closed Won Target
  const [leadsPurchased, setLeadsPurchased] = useState(1800);

  // AI Scheduling & Forecasting outputs (state updated after Bedrock run)
  const [isForecastGenerated, setIsForecastGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [bedrockLogs, setBedrockLogs] = useState<string[]>([]);
  const [generatedSchedules, setGeneratedSchedules] = useState<any[]>([]);
  const [monthlyForecast, setMonthlyForecast] = useState<any[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string>("");

  // Setup Goal Wizard States
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardOfferType, setWizardOfferType] = useState<"course" | "product" | "service">("course");
  const [wizardAgentsCount, setWizardAgentsCount] = useState(18);
  const [wizardWeeklyTraffic, setWizardWeeklyTraffic] = useState(10000);
  const [wizardSalesTarget, setWizardSalesTarget] = useState(120);
  const [wizardLeadsCount, setWizardLeadsCount] = useState(1500);

  // CRM Databases (loaded from Aurora PostgreSQL via API)
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // User Management (loaded from API for supervisors)
  const [usersList, setUsersList] = useState<any[]>([]);

  // CRM Modals
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  // Form Fields
  const [newCustName, setNewCustName] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");
  const [newCustEmail, setNewCustEmail] = useState("");
  const [newCustStatus, setNewCustStatus] = useState("new");
  const [newCustAgent, setNewCustAgent] = useState("Unassigned");
  const [newCustInterest, setNewCustInterest] = useState("Medium");
  const [newCustNotes, setNewCustNotes] = useState("");

  const [callNotesText, setCallNotesText] = useState("");
  const [isEnhancingNote, setIsEnhancingNote] = useState(false);
  const [isEnhancingCustNote, setIsEnhancingCustNote] = useState(false);

  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  // Workforce Admin Modal Fields
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState(""); // Password Field
  const [newUserRole, setNewUserRole] = useState("agent");

  // Lead Importer Field
  const [importLeadsText, setImportLeadsText] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFileName, setImportFileName] = useState("");
  const csvInputRef = useRef<HTMLInputElement>(null);

  // Workforce removal notifications are DERIVED from persisted customer state
  // (any closed_won / closed_lost lead is a removal candidate), so they work
  // across users and sessions. "Keep" dismisses locally without deleting.
  const [dismissedNotifIds, setDismissedNotifIds] = useState<string[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // AI Coach Chat
  const [chatMessages, setChatMessages] = useState<any[]>([
    { sender: "ai", text: "Hello! I am your Amazon Bedrock-powered sales coach. Ask me to draft scripts, suggest objection handling, or outline a plan to boost sales leads conversions." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Theme Toggle Effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  // Restore UI preferences (theme/language) and any existing server session on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedLang = localStorage.getItem("llaman2_lang");
    if (storedLang === "en" || storedLang === "es") {
      setLang(storedLang);
    }
    const storedTheme = localStorage.getItem("llaman2_theme");
    if (storedTheme === "dark") {
      setDarkMode(true);
    } else if (storedTheme === "light") {
      setDarkMode(false);
    }
    const storedCcpMode = localStorage.getItem("llaman2_ccp_mode");
    if (storedCcpMode === "twilio" || storedCcpMode === "simulated") {
      setCcpMode(storedCcpMode as "simulated" | "twilio");
    }

    // Restore an existing session (httpOnly cookie) so a refresh keeps the user logged in.
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            applySession(data.user);
          }
        }
      } catch (e) {
        console.error("Session check failed:", e);
      } finally {
        setIsAuthChecking(false);
      }
    })();
  }, []);

  // Persist the selected calling mode (UI preference only — no secrets stored client-side).
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("llaman2_ccp_mode", ccpMode);
    }
  }, [ccpMode]);

  // Month target progress = real closed sales / user-defined target. Starts at 0%.
  useEffect(() => {
    if (!pursueTarget || pursueTarget <= 0) {
      setTargetProgress(0);
      return;
    }
    const newProgress = Math.min(100, Math.round((totalClosedWon / pursueTarget) * 100));
    setTargetProgress(newProgress);
  }, [totalClosedWon, pursueTarget]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("llaman2_lang", lang);
    }
  }, [lang]);

  const t = translations[lang];

  // Connect Call Timer
  useEffect(() => {
    if (connectStatus === "connected") {
      callTimer.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimer.current) clearInterval(callTimer.current);
      setCallDuration(0);
    }
    return () => {
      if (callTimer.current) clearInterval(callTimer.current);
    };
  }, [connectStatus]);

  // Set default tabs based on Role logins
  useEffect(() => {
    if (userRole === "workforce") {
      setActiveTab("dashboard");
    } else if (userRole === "agent") {
      setActiveTab("crm");
    }
  }, [userRole]);

  // Load Twilio Voice SDK and initialize Device
  useEffect(() => {
    if (ccpMode !== "twilio") {
      // Clean up and destroy Twilio Device when switching back to simulated mode
      if (deviceRef.current) {
        try {
          deviceRef.current.destroy();
          deviceRef.current = null;
          setTwilioStatus("unregistered");
        } catch (e) {
          console.error("Failed to destroy Twilio Device:", e);
        }
      }
      return;
    }

    const initTwilio = async () => {
      setTwilioStatus("registering");

      try {
        const res = await fetch("/api/twilio-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            identity: activeUserName || "agent"
          })
        });

        const data = await res.json();
        if (!res.ok || data.error) {
          console.error("Token Generation API Error:", data.error || res.statusText);
          setTwilioStatus("error");
          return;
        }

        setupDevice(data.token);
      } catch (err) {
        console.error("Failed to fetch Twilio token:", err);
        setTwilioStatus("error");
      }
    };

    const setupDevice = async (token: string) => {
      try {
        // Dynamically import the Twilio Voice SDK inside the browser context
        const { Device } = await import("@twilio/voice-sdk");

        // Destroy existing device if any
        if (deviceRef.current) {
          try {
            deviceRef.current.destroy();
          } catch (_) {}
        }

        const device = new Device(token, {
          codecPreferences: ["opus", "pcmu"] as any,
          fakeLocalDTMF: true,
          enableIceRestart: true,
          enableImprovedSignalingErrorPrecision: true
        } as any);

        deviceRef.current = device;

        device.on("registered", () => {
          console.log("Twilio Device Registered");
          setTwilioStatus("ready");
        });

        device.on("error", (err: any) => {
          console.error("Twilio Device Error:", err);
          setTwilioStatus("error");
        });

        device.on("connect", (call: any) => {
          console.log("Twilio Call Connected");
          activeCallRef.current = call;
          setConnectStatus("connected");

          call.on("disconnect", () => {
            console.log("Twilio Call Disconnected");
            activeCallRef.current = null;
            setConnectStatus("available");
            setConnectNumber("");
            setConnectName("");

            // Automatically open notes modal
            setCallNotesText("");
            setIsNotesModalOpen(true);
          });
        });

        // Register the device
        device.register();
      } catch (err) {
        console.error("Error setting up Twilio Device:", err);
        setTwilioStatus("error");
      }
    };

    initTwilio();
  }, [ccpMode, activeUserName]);

  // Apply an authenticated session to local UI state and trigger data loading.
  const applySession = (user: { name: string; role: string }) => {
    setActiveUserName(user.name);
    if (user.role === "supervisor") {
      setUserRole("workforce");
      setActiveTab("dashboard");
    } else {
      setUserRole("agent");
      setActiveTab("crm");
    }
    loadAppData(user.role);
  };

  // Quietly refresh customers + metrics so the workforce manager sees removal
  // requests raised by agents in other sessions without a manual reload.
  useEffect(() => {
    if (userRole !== "workforce") return;
    const refresh = async () => {
      try {
        const res = await fetch("/api/customers");
        if (res.ok) {
          const data = await res.json();
          setCustomers(data.customers || []);
        }
        await loadMetrics();
      } catch {
        /* ignore transient polling errors */
      }
    };
    const timer = setInterval(refresh, 30000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);

  // Fetch live dashboard metrics from Aurora (no fabricated numbers).
  const loadMetrics = async () => {
    try {
      const res = await fetch("/api/metrics");
      if (!res.ok) return;
      const m = await res.json();
      setCallsToday(Number(m.callsToday) || 0);
      setClosedLeads(Number(m.closedLeadsToday) || 0);
      setAvgDuration(`${Number(m.avgDurationSeconds) || 0}s`);
      setTotalClosedWon(Number(m.totalClosedWon) || 0);
      setPipeline(m.pipeline || {});
    } catch (e) {
      console.error("Failed to load metrics:", e);
    }
  };

  // Load customers (everyone) and users (supervisors only) from Aurora-backed APIs.
  const loadAppData = async (role: string) => {
    setIsDataLoading(true);
    try {
      const reqs: Promise<Response>[] = [fetch("/api/customers")];
      if (role === "supervisor") reqs.push(fetch("/api/users"));
      const [custRes, usersRes] = await Promise.all(reqs);

      if (custRes.ok) {
        const data = await custRes.json();
        setCustomers(data.customers || []);
      }
      if (usersRes && usersRes.ok) {
        const data = await usersRes.json();
        setUsersList(data.users || []);
      }
      await loadMetrics();
    } catch (e) {
      console.error("Failed to load app data:", e);
    } finally {
      setIsDataLoading(false);
    }
  };

  // HANDLE USER AUTHENTICATION (server-validated, bcrypt-hashed passwords)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsLoggingIn(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: usernameInput, password: passwordInput }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || (lang === "es" ? "Credenciales inválidas." : "Invalid credentials."));
        return;
      }
      applySession(data.user);
    } catch (err) {
      console.error("Login failed:", err);
      setAuthError(lang === "es" ? "Error de conexión. Intente de nuevo." : "Connection error. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout failed:", e);
    }
    setUserRole("guest");
    setUsernameInput("");
    setPasswordInput("");
    setAuthError("");
    setActiveUserName("");
    setCustomers([]);
    setUsersList([]);
  };

  // DIAL CRM LEAD
  const handleDialCustomer = async (customer: any) => {
    setConnectNumber(customer.phone);
    setConnectName(customer.name);
    setSelectedCustomer(customer);

    if (ccpMode === "twilio") {
      if (twilioStatus !== "ready" || !deviceRef.current) {
        alert(lang === "es"
          ? "El cliente de Amazon Connect no está listo. Verifique la configuración del centro de contacto."
          : "The Amazon Connect client is not ready. Please verify the contact center configuration.");
        return;
      }
      setConnectStatus("calling");
      try {
        // Caller ID is injected server-side; the client only sends the destination number.
        const params = {
          To: customer.phone,
        };
        const call = await deviceRef.current.connect({ params });
        activeCallRef.current = call;
      } catch (err: any) {
        console.error("Twilio connect error:", err);
        alert("Outbound call failed (Fallo al iniciar llamada): " + (err.message || err));
        setConnectStatus("available");
      }
    } else {
      // Simulated Mode
      setConnectStatus("calling");
      // Auto transition from calling to connected in 2s
      setTimeout(() => {
        setConnectStatus("connected");
      }, 2000);
    }
  };

  const handleEndCall = () => {
    if (ccpMode === "twilio") {
      try {
        if (activeCallRef.current && typeof activeCallRef.current.disconnect === "function") {
          activeCallRef.current.disconnect();
        } else if (deviceRef.current) {
          deviceRef.current.disconnectAll();
        }
      } catch (err) {
        console.error("Twilio disconnect error:", err);
      }
      activeCallRef.current = null;
    }

    setConnectStatus("available");
    setConnectNumber("");
    setConnectName("");
    
    // Open Notes modal automatically after finishing call so agent can record observations
    if (selectedCustomer) {
      setCallNotesText("");
      setIsNotesModalOpen(true);
    }
  };

  // Shared helper: enhance free-text notes with Amazon Bedrock (via AI Gateway).
  const enhanceNoteWithBedrock = async (text: string, kind: "call" | "profile") => {
    setBedrockLogs(prev => [
      `Bedrock Runtime: invoking model to enhance ${kind} notes...`,
      ...prev,
    ]);
    const res = await fetch("/api/ai/enhance-note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, kind, lang }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Bedrock request failed");
    }
    const data = await res.json();
    setBedrockLogs(prev => ["Bedrock: model completed execution.", ...prev]);
    return data.enhanced as string;
  };

  // AI NOTE ENHANCEMENT (Amazon Bedrock)
  const handleAIEnhanceNote = async () => {
    if (!callNotesText.trim()) return;
    setIsEnhancingNote(true);
    try {
      const enhanced = await enhanceNoteWithBedrock(callNotesText, "call");
      setCallNotesText(enhanced);
    } catch (err) {
      console.error("Note enhancement failed:", err);
      setBedrockLogs(prev => ["Bedrock: request failed.", ...prev]);
    } finally {
      setIsEnhancingNote(false);
    }
  };

  const handleAIEnhanceCustNote = async () => {
    if (!newCustNotes.trim()) return;
    setIsEnhancingCustNote(true);
    try {
      const enhanced = await enhanceNoteWithBedrock(newCustNotes, "profile");
      setNewCustNotes(enhanced);
    } catch (err) {
      console.error("Profile note enhancement failed:", err);
      setBedrockLogs(prev => ["Bedrock: request failed.", ...prev]);
    } finally {
      setIsEnhancingCustNote(false);
    }
  };

  // ADD NEW CUSTOMER TO CRM (persisted to Aurora)
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone) return;

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCustName,
          phone: newCustPhone,
          email: newCustEmail || "N/A",
          status: newCustStatus,
          assignedAgent: newCustAgent,
          interest: newCustInterest,
          notes: newCustNotes || "No notes added yet.",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to create customer.");
        return;
      }
      const { customer } = await res.json();
      setCustomers(prev => [customer, ...prev]);
      setIsCustomerModalOpen(false);

      setNewCustName("");
      setNewCustPhone("");
      setNewCustEmail("");
      setNewCustNotes("");
      setNewCustStatus("new");
      setNewCustAgent("Unassigned");
      setNewCustInterest("Medium");
    } catch (err) {
      console.error("Create customer failed:", err);
      alert("Connection error while creating customer.");
    }
  };

  // ADD CALL NOTE FOR A CUSTOMER (persisted to Aurora)
  const handleAddCallNote = async () => {
    if (!selectedCustomer || !callNotesText.trim()) return;
    const newNotes = `${callNotesText} (${new Date().toLocaleDateString()}) | ` + (selectedCustomer.notes || "");
    try {
      const res = await fetch(`/api/customers/${selectedCustomer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: newNotes }),
      });
      if (!res.ok) {
        alert("Failed to save call notes.");
        return;
      }
      const { customer } = await res.json();
      setCustomers(prev => prev.map(c => (c.id === customer.id ? customer : c)));
      setIsNotesModalOpen(false);
      setCallNotesText("");
    } catch (err) {
      console.error("Add call note failed:", err);
      alert("Connection error while saving notes.");
    }
  };

  // SEND EMAIL (logs the activity to the customer record in Aurora)
  const handleSendEmail = async () => {
    if (!selectedCustomer || !emailSubject || !emailBody) return;
    const newNotes = `Sent Email: "${emailSubject}" | ` + (selectedCustomer.notes || "");
    try {
      const res = await fetch(`/api/customers/${selectedCustomer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: newNotes }),
      });
      if (res.ok) {
        const { customer } = await res.json();
        setCustomers(prev => prev.map(c => (c.id === customer.id ? customer : c)));
      }
    } catch (err) {
      console.error("Email logging failed:", err);
    }
    setIsEmailModalOpen(false);
    setEmailSubject("");
    setEmailBody("");
    alert(`Email activity logged for ${selectedCustomer.email}.`);
  };

  // REGISTER A SALE OUTCOME (closed won / lost) and notify the workforce manager
  const handleCloseSale = async (customer: any, outcome: "closed_won" | "closed_lost") => {
    const label = outcome === "closed_won" ? "WON" : "LOST";
    try {
      const res = await fetch(`/api/customers/${customer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: outcome,
          prependNote: `Sale marked ${label} by ${activeUserName || "agent"}`,
        }),
      });
      if (!res.ok) {
        alert("Failed to register the sale outcome.");
        return;
      }
      const { customer: updated } = await res.json();
      setCustomers(prev => prev.map(c => (c.id === updated.id ? updated : c)));
      // The closed status is persisted; the workforce manager's bell derives the
      // removal request from it (cross-session). Un-dismiss in case it was hidden.
      setDismissedNotifIds(prev => prev.filter(id => id !== updated.id));
      await loadMetrics();
    } catch (err) {
      console.error("Close sale failed:", err);
      alert("Connection error while registering the sale.");
    }
  };

  // REMOVE A CUSTOMER (workforce manager action triggered from a notification)
  const handleRemoveCustomer = async (customerId: string) => {
    try {
      const res = await fetch(`/api/customers/${customerId}`, { method: "DELETE" });
      if (!res.ok) {
        alert("Failed to remove the customer.");
        return;
      }
      setCustomers(prev => prev.filter(c => c.id !== customerId));
      await loadMetrics();
    } catch (err) {
      console.error("Remove customer failed:", err);
      alert("Connection error while removing the customer.");
    }
  };

  const dismissNotification = (customerId: string) => {
    setDismissedNotifIds(prev => (prev.includes(customerId) ? prev : [...prev, customerId]));
  };

  // Removal candidates derived from persisted state (closed leads not yet dismissed).
  const removalNotifications = customers.filter(
    c => (c.status === "closed_won" || c.status === "closed_lost") && !dismissedNotifIds.includes(c.id),
  );

  // CREATE NEW USER (Workforce Admin panel — password hashed server-side)
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail || !newUserPassword) return;

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword,
          role: newUserRole,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to create user.");
        return;
      }
      setUsersList(prev => [...prev, data.user]);
      setNewUserName("");
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserRole("agent");
      alert(`User ${data.user.name} created successfully. They can now log in.`);
    } catch (err) {
      console.error("Create user failed:", err);
      alert("Connection error while creating user.");
    }
  };

  // Read an uploaded .csv/.txt file into the importer textarea.
  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = String(ev.target?.result || "");
      // Append to any text already in the box so manual + file entries combine.
      setImportLeadsText((prev) => (prev.trim() ? prev.trimEnd() + "\n" + text : text));
    };
    reader.onerror = () => alert("Could not read that file. Please upload a plain .csv or .txt file.");
    reader.readAsText(file);
    // Reset the input so re-uploading the same file fires the change event again.
    e.target.value = "";
  };

  // IMPORT LEADS (CSV / Textarea parser — persisted to Aurora)
  const handleImportLeads = async () => {
    if (!importLeadsText.trim()) return;

    const lines = importLeadsText.split(/\r?\n/);
    const parsedCustomers: any[] = [];

    lines.forEach((line, idx) => {
      if (!line.trim()) return;
      const parts = line.split(",");
      const name = (parts[0] || "").trim();
      const phone = (parts[1] || "").trim();
      // Skip an optional header row like "Name, Phone, Email".
      if (idx === 0 && /name/i.test(name) && /phone|tel/i.test(phone)) return;
      if (parts.length >= 2 && name && phone) {
        const email = parts[2] ? parts[2].trim() : `${name.toLowerCase().replace(/\s+/g, "")}@lead.com`;
        parsedCustomers.push({
          name,
          phone,
          email,
          status: "new",
          assignedAgent: "Unassigned",
          interest: parts[3] ? parts[3].trim() : "Medium",
          notes: "Imported via CSV workforce tool.",
        });
      }
    });

    if (parsedCustomers.length === 0) {
      alert("Invalid format. Please use: Name, Phone, Email (one per line).");
      return;
    }

    try {
      const res = await fetch("/api/customers/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customers: parsedCustomers }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to import leads.");
        return;
      }
      const { customers: inserted } = await res.json();
      setCustomers(prev => [...(inserted || []), ...prev]);
      setImportLeadsText("");
      setImportFileName("");
      setIsImportModalOpen(false);
      await loadMetrics();
      alert(`Successfully imported ${inserted?.length || 0} customer leads to CRM.`);
    } catch (err) {
      console.error("Import leads failed:", err);
      alert("Connection error while importing leads.");
    }
  };

  // RUN AMAZON BEDROCK AI PLANNING MODEL (real inference via AI Gateway)
  const runBedrockPlanner = async () => {
    setIsGenerating(true);
    setBedrockLogs([]);
    setIsForecastGenerated(false);

    const logs: string[] = [];
    const addLog = (msg: string) => {
      logs.push(msg);
      setBedrockLogs([...logs]);
    };

    addLog("Initializing Amazon Bedrock Runtime client...");
    addLog(`Parameters: { WeeklyUsers: ${weeklyUsersTarget}, Agents: [M:${agentsMorning}, A:${agentsAfternoon}, N:${agentsNight}, W:${agentsWeekend}], Target: ${pursueTarget}, Leads: ${leadsPurchased} }`);

    try {
      const agentNames = usersList
        .filter((u) => u.role === "agent")
        .map((u) => u.name);

      addLog("Invoking Bedrock model for shift optimization & forecasting...");
      const res = await fetch("/api/ai/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weeklyUsersTarget,
          agentsMorning,
          agentsAfternoon,
          agentsNight,
          agentsWeekend,
          agentsTotalMonth,
          pursueTarget,
          leadsPurchased,
          agentNames,
          lang,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Bedrock planner request failed");
      }

      const data = await res.json();
      addLog("Bedrock response received. Applying optimization results...");

      setGeneratedSchedules(data.schedule || []);
      setMonthlyForecast(data.forecast || []);
      setAiSuggestions(data.strategy || "");

      setIsGenerating(false);
      setIsForecastGenerated(true);
      addLog("Planning matrix successfully updated.");
    } catch (err) {
      console.error("Bedrock planner failed:", err);
      addLog("Bedrock planner request failed. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleWizardSubmit = () => {
    setAgentsTotalMonth(wizardAgentsCount);
    setWeeklyUsersTarget(wizardWeeklyTraffic);
    setPursueTarget(wizardSalesTarget);
    setLeadsPurchased(wizardLeadsCount);

    if (wizardOfferType === "course") {
      setAgentsMorning(Math.floor(wizardAgentsCount * 0.3));
      setAgentsAfternoon(Math.floor(wizardAgentsCount * 0.4));
      setAgentsNight(Math.ceil(wizardAgentsCount * 0.3));
      setAgentsWeekend(Math.floor(wizardAgentsCount * 0.5));
    } else if (wizardOfferType === "product") {
      setAgentsMorning(Math.floor(wizardAgentsCount * 0.4));
      setAgentsAfternoon(Math.floor(wizardAgentsCount * 0.4));
      setAgentsNight(Math.ceil(wizardAgentsCount * 0.2));
      setAgentsWeekend(Math.floor(wizardAgentsCount * 0.3));
    } else if (wizardOfferType === "service") {
      setAgentsMorning(Math.floor(wizardAgentsCount * 0.5));
      setAgentsAfternoon(Math.floor(wizardAgentsCount * 0.5));
      setAgentsNight(0);
      setAgentsWeekend(0);
    }

    setIsWizardOpen(false);
    setWizardStep(1);

    setTimeout(() => {
      runBedrockPlanner();
    }, 500);
  };

  const resetOperationalParameters = () => {
    setWeeklyUsersTarget(12000);
    setAgentsMorning(12);
    setAgentsAfternoon(15);
    setAgentsNight(8);
    setAgentsWeekend(6);
    setAgentsTotalMonth(25);
    setPursueTarget(150);
    setLeadsPurchased(1800);
    setIsForecastGenerated(false);
    setBedrockLogs([]);
    setGeneratedSchedules([]);
    setMonthlyForecast([]);
    setAiSuggestions("");
  };

  // CRM Search filter
  const filteredCustomers = customers.filter(c => {
    const query = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(query) || 
           c.phone.includes(query) || 
           c.assignedAgent.toLowerCase().includes(query) ||
           c.status.toLowerCase().includes(query);
  });

  // SEND CHAT MESSAGE TO AI SALES COACH (Amazon Bedrock via AI Gateway)
  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg = { sender: "user", text: chatInput };
    const history = [...chatMessages, userMsg];
    setChatMessages(history);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
          pursueTarget,
          lang,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Chat request failed");
      }

      const data = await res.json();
      setChatMessages(prev => [...prev, { sender: "ai", text: data.text }]);
    } catch (err) {
      console.error("AI chat failed:", err);
      setChatMessages(prev => [
        ...prev,
        {
          sender: "ai",
          text: lang === "es"
            ? "Lo siento, el asistente no está disponible en este momento. Intente de nuevo."
            : "Sorry, the assistant is unavailable right now. Please try again.",
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const COLORS = ["#3b82f6", "#10b981", "#fbbf24", "#ef4444", "#a78bfa"];

  // ==========================================
  // RENDER LOADING STATE WHILE RESTORING SESSION
  // ==========================================
  if (isAuthChecking) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center bg-[#f0f4f8] text-zinc-900 dark:bg-[#0b0f19] dark:text-zinc-100 min-h-screen gap-4">
        <LMLogo className="w-12 h-12 animate-pulse" />
        <span className="text-xs text-zinc-500 font-medium">Loading workspace...</span>
      </div>
    );
  }

  // ==========================================
  // RENDER INTERFACE GUEST / LOGIN CARD
  // ==========================================
  if (userRole === "guest") {
    return (
      <div className="flex-1 flex flex-col justify-center items-center bg-[#f0f4f8] text-zinc-900 dark:bg-[#0b0f19] dark:text-zinc-100 min-h-screen p-6">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-xl flex flex-col gap-6">
          <div className="text-center flex flex-col items-center gap-2">
            
            {/* LM Logo Container */}
            <div className="flex items-center gap-2.5 mb-2">
              <LMLogo className="w-12 h-12 shadow-md" />
              <div className="text-left">
                <h2 className="font-extrabold text-lg tracking-tight text-zinc-900 dark:text-white leading-none">
                  Llaman2 Manager
                </h2>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-bold tracking-wider">CONNECT CORE INTEGRATOR</span>
              </div>
            </div>
            
            <p className="text-xs text-zinc-500">Sign in to access your customized role interface</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {authError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-zinc-500 block mb-1">Username / Email</label>
              <input 
                type="text" 
                placeholder="e.g. workforce@connect-bpo.com" 
                value={usernameInput} 
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-500 block mb-1">Password</label>
              <input 
                type="password" 
                placeholder="••••" 
                value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-650 text-white font-semibold rounded-xl py-2.5 text-xs shadow cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 text-center">
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Demo Credentials</h4>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="bg-zinc-50 dark:bg-zinc-950 p-2 rounded-xl border border-zinc-200 dark:border-zinc-900">
                <span className="text-zinc-400">Supervisor:</span><br/>workforce@connect-bpo.com<br/>
                <span className="text-zinc-400">Pass:</span> 1234
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-950 p-2 rounded-xl border border-zinc-200 dark:border-zinc-900">
                <span className="text-zinc-400">Agent:</span><br/>agent@connect-bpo.com<br/>
                <span className="text-zinc-400">Pass:</span> 1234
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER MAIN APPLICATION (AUTHENTICATED)
  // ==========================================
  return (
    <div className="flex-1 flex bg-[#f0f4f8] text-zinc-900 dark:bg-[#0b0f19] dark:text-zinc-100 min-h-screen">
      
      {/* 1. LEFT SIDEBAR NAVIGATION (ShopCo inspired) */}
      <aside className="w-64 bg-white dark:bg-[#111827] border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between p-4 flex-shrink-0 z-30 transition-colors">
        <div className="flex flex-col gap-8">
          
          {/* LM LOGO */}
          <div className="flex items-center gap-2.5 p-2 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/10 dark:border-blue-500/20 rounded-xl">
            <LMLogo className="w-9 h-9" />
            <div>
              <h2 className="font-extrabold text-sm tracking-tight text-zinc-900 dark:text-white leading-none">
                Llaman2 Manager
              </h2>
              <span className="text-[9px] text-zinc-400 font-medium">BPO Connect Suite</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {userRole === "workforce" && (
              <>
                <button 
                  onClick={() => setActiveTab("dashboard")}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    activeTab === "dashboard" 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" 
                      : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                >
                  <LayoutDashboard className="w-4.5 h-4.5" />
                  {t.dashboard}
                </button>
                <button 
                  onClick={() => setActiveTab("scheduler")}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    activeTab === "scheduler" 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" 
                      : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                >
                  <Calendar className="w-4.5 h-4.5" />
                  {t.scheduler}
                </button>
                <button 
                  onClick={() => setActiveTab("workforce_admin")}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    activeTab === "workforce_admin" 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" 
                      : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                >
                  <Users className="w-4.5 h-4.5" />
                  {t.workforce_admin}
                </button>
                <button 
                  onClick={() => setActiveTab("advanced")}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    activeTab === "advanced" 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" 
                      : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                >
                  <TrendingUp className="w-4.5 h-4.5" />
                  {t.advanced}
                </button>
              </>
            )}

            {userRole === "agent" && (
              <>
                <button 
                  onClick={() => setActiveTab("crm")}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    activeTab === "crm" 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" 
                      : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                >
                  <UserCheck className="w-4.5 h-4.5" />
                  {t.crm}
                </button>
                <button 
                  onClick={() => setActiveTab("coach")}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    activeTab === "coach" 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/10" 
                      : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                >
                  <MessageSquare className="w-4.5 h-4.5" />
                  {t.coach}
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="flex flex-col gap-2">
          {/* Light/Dark Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all cursor-pointer"
          >
            {darkMode ? (
              <>
                <Sun className="w-4.5 h-4.5 text-amber-400" />
                <span>{t.lightMode}</span>
              </>
            ) : (
              <>
                <Moon className="w-4.5 h-4.5 text-indigo-500" />
                <span>{t.darkMode}</span>
              </>
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all cursor-pointer"
          >
            <Globe className="w-4.5 h-4.5 text-sky-500" />
            <span>{lang === "en" ? "Español" : "English"}</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>{t.signOut}</span>
          </button>
        </div>
      </aside>

      {/* 2. RIGHT CONTENT SPLIT (Scrollable) */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Sky-Blue Gradient Header Banner (ShopCo style) */}
        <div className="bg-gradient-to-r from-sky-400 via-blue-600 to-indigo-700 dark:from-slate-900 dark:to-zinc-950 p-8 md:p-10 flex flex-col items-center justify-center text-center gap-5 border-b border-zinc-200 dark:border-zinc-800 text-white transition-all select-none relative overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-from)_0%,_transparent_50%)] opacity-40 pointer-events-none" />
          <div className="z-10">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight drop-shadow-sm">
              {t.goodMorning}, {activeUserName}!
            </h2>
            <p className="text-xs text-blue-100/90 dark:text-zinc-400 mt-1.5 font-medium max-w-lg">
              {t.activeDashboard}
            </p>
          </div>

          {/* Centered Search Pill inside header (ShopCo style) */}
          <div className="relative w-full max-w-xl z-10 transition-transform duration-200 focus-within:scale-[1.01]">
            <Search className="w-5 h-5 absolute left-4.5 top-3.5 text-zinc-400" />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-zinc-800 text-xs rounded-full pl-12 pr-6 py-3.5 border-0 focus:ring-4 focus:ring-sky-400/40 shadow-md outline-none transition-all placeholder:text-zinc-400 font-semibold"
            />
          </div>

          {/* Workforce manager: removal notifications bell */}
          {userRole === "workforce" && (
            <div className="relative z-20">
              <button
                onClick={() => setIsNotifOpen(o => !o)}
                className="relative bg-white/15 hover:bg-white/25 rounded-full p-3 transition-colors cursor-pointer"
                title="Removal notifications"
                aria-label="Removal notifications"
              >
                <Bell className="w-5 h-5 text-white" />
                {removalNotifications.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {removalNotifications.length}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-left">
                  <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/40">
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50">Customer Removal Requests</h4>
                    <span className="text-[10px] text-zinc-500">{removalNotifications.length} pending</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {removalNotifications.length === 0 ? (
                      <p className="p-4 text-xs text-zinc-500 text-center">No removal requests. Closed sales will appear here.</p>
                    ) : (
                      removalNotifications.map(n => (
                        <div key={n.id} className="p-3 border-b border-zinc-100 dark:border-zinc-900 flex flex-col gap-2">
                          <div>
                            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-50">{n.name}</p>
                            <p className="text-[10px] text-zinc-500 mt-0.5">
                              Sale {n.status === "closed_won" ? "closed (Won)" : "marked Lost"}. Remove from active CRM?
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRemoveCustomer(n.id)}
                              className="flex-1 flex items-center justify-center gap-1 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-semibold rounded-lg py-1.5 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" /> Remove
                            </button>
                            <button
                              onClick={() => dismissNotification(n.id)}
                              className="flex-1 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-[11px] font-semibold rounded-lg py-1.5 cursor-pointer text-zinc-700 dark:text-zinc-300"
                            >
                              Keep
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Primary Page Grid */}
        <div className="max-w-7xl w-full p-6 flex flex-col gap-6 flex-1">
          
          {/* ========================================================
              TAB: WORKFORCE DASHBOARD (WORKFORCE ONLY) 
              ======================================================== */}
          {activeTab === "dashboard" && userRole === "workforce" && (
            <div className="flex flex-col gap-6">
              
              {/* KPIs Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#111827] border border-zinc-200 dark:border-zinc-850 rounded-2xl p-5 shadow-sm">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">{t.callsToday}</p>
                  <h3 className="text-3xl font-extrabold mt-1 font-mono tracking-tight text-zinc-900 dark:text-zinc-50">{callsToday}</h3>
                  <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
                    <PhoneCall className="w-3 h-3" /> Outbound dials logged today
                  </p>
                </div>
                
                <div className="bg-white dark:bg-[#111827] border border-zinc-200 dark:border-zinc-850 rounded-2xl p-5 shadow-sm">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">{t.avgDuration}</p>
                  <h3 className="text-3xl font-extrabold mt-1 font-mono tracking-tight text-zinc-900 dark:text-zinc-50">{avgDuration}</h3>
                  <p className="text-xs text-zinc-500 mt-2">Average handle time today</p>
                </div>

                <div className="bg-white dark:bg-[#111827] border border-zinc-200 dark:border-zinc-850 rounded-2xl p-5 shadow-sm">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">{t.closedLeads}</p>
                  <h3 className="text-3xl font-extrabold mt-1 font-mono tracking-tight text-zinc-900 dark:text-zinc-50">{closedLeads}</h3>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center mt-2 gap-1">
                    ✓ Conversion rate: {callsToday > 0 ? ((closedLeads / callsToday) * 100).toFixed(1) : "0.0"}%
                  </p>
                </div>
              </div>

              {/* Progress to target */}
              <div className="bg-white dark:bg-[#111827] border border-zinc-200 dark:border-zinc-850 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-50">{t.targetProgress}</h4>
                    <p className="text-xs text-zinc-500">Target sales conversion quota</p>
                  </div>
                  <span className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400">{targetProgress}%</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-850 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 dark:bg-blue-500 h-full transition-all duration-500" style={{ width: `${targetProgress}%` }} />
                </div>
                <div className="flex justify-between mt-3 text-xs text-zinc-500">
                  <span>Completed: {totalClosedWon} / {pursueTarget} sales</span>
                  <span>Target: {pursueTarget} sales</span>
                </div>
              </div>

              {/* Action Center with Circular Gauges (ShopCo inspired) */}
              <div className="bg-white dark:bg-[#111827] border border-zinc-200 dark:border-zinc-850 rounded-2xl p-6 shadow-sm">
                <h4 className="font-bold text-sm mb-6 text-zinc-900 dark:text-white">{t.actionCenter}</h4>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  
                  {/* Gauge 1 (Blue) */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-18 h-18 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="36" cy="36" r="30" stroke="#e2e8f0" strokeWidth="6" fill="transparent" className="dark:stroke-zinc-800" />
                        <circle cx="36" cy="36" r="30" stroke="#3b82f6" strokeWidth="6" fill="transparent" strokeDasharray="188.5" strokeDashoffset="47.1" strokeLinecap="round" />
                      </svg>
                      <span className="absolute text-base font-extrabold font-mono text-zinc-900 dark:text-zinc-50">23</span>
                    </div>
                    <span className="text-xs font-bold text-zinc-500">{t.actionNeeded}</span>
                  </div>

                  {/* Gauge 2 (Yellow) */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-18 h-18 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="36" cy="36" r="30" stroke="#e2e8f0" strokeWidth="6" fill="transparent" className="dark:stroke-zinc-800" />
                        <circle cx="36" cy="36" r="30" stroke="#f59e0b" strokeWidth="6" fill="transparent" strokeDasharray="188.5" strokeDashoffset="85.5" strokeLinecap="round" />
                      </svg>
                      <span className="absolute text-base font-extrabold font-mono text-zinc-900 dark:text-zinc-50">14</span>
                    </div>
                    <span className="text-xs font-bold text-zinc-500">{t.attentionRequired}</span>
                  </div>

                  {/* Gauge 3 (Red) */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-18 h-18 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="36" cy="36" r="30" stroke="#e2e8f0" strokeWidth="6" fill="transparent" className="dark:stroke-zinc-800" />
                        <circle cx="36" cy="36" r="30" stroke="#ef4444" strokeWidth="6" fill="transparent" strokeDasharray="188.5" strokeDashoffset="132.0" strokeLinecap="round" />
                      </svg>
                      <span className="absolute text-base font-extrabold font-mono text-zinc-900 dark:text-zinc-50">8</span>
                    </div>
                    <span className="text-xs font-bold text-zinc-500">{t.criticalPriority}</span>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB: AI SHIFT SCHEDULER (WORKFORCE ONLY) 
              ======================================================== */}
          {activeTab === "scheduler" && userRole === "workforce" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Col: Inputs Form */}
              <div className="lg:col-span-1 bg-white dark:bg-[#111827] border border-zinc-200 dark:border-zinc-850 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center mb-1">
                  <div>
                    <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-50">Operational parameters</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Provide weekly resources to feed Bedrock.</p>
                  </div>
                  <button
                    onClick={() => { setIsWizardOpen(true); setWizardStep(1); }}
                    className="text-[11px] bg-blue-600 hover:bg-blue-700 text-white font-semibold px-2.5 py-1.5 rounded-lg shadow-sm cursor-pointer transition-colors"
                  >
                    ✨ Goal Assistant
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1">
                      Weekly Call Center Traffic Target (Customers)
                    </label>
                    <input 
                      type="number" 
                      value={weeklyUsersTarget} 
                      onChange={(e) => setWeeklyUsersTarget(parseInt(e.target.value) || 0)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1">
                      Available Outbound Agents Per Shift
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="text-[10px] text-zinc-455 block mb-0.5">Morning</span>
                        <input 
                          type="number" 
                          value={agentsMorning} 
                          onChange={(e) => setAgentsMorning(parseInt(e.target.value) || 0)}
                          className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1.5 text-xs text-center outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-455 block mb-0.5">Afternoon</span>
                        <input 
                          type="number" 
                          value={agentsAfternoon} 
                          onChange={(e) => setAgentsAfternoon(parseInt(e.target.value) || 0)}
                          className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1.5 text-xs text-center outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-455 block mb-0.5">Night</span>
                        <input 
                          type="number" 
                          value={agentsNight} 
                          onChange={(e) => setAgentsNight(parseInt(e.target.value) || 0)}
                          className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1.5 text-xs text-center outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1">
                        Weekend Agents
                      </label>
                      <input 
                        type="number" 
                        value={agentsWeekend} 
                        onChange={(e) => setAgentsWeekend(parseInt(e.target.value) || 0)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1">
                        Total Monthly Roster
                      </label>
                      <input 
                        type="number" 
                        value={agentsTotalMonth} 
                        onChange={(e) => setAgentsTotalMonth(parseInt(e.target.value) || 0)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1">
                        Sales Pursuit Target
                      </label>
                      <input 
                        type="number" 
                        value={pursueTarget} 
                        onChange={(e) => setPursueTarget(parseInt(e.target.value) || 0)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1">
                        Sales Leads Purchased
                      </label>
                      <input 
                        type="number" 
                        value={leadsPurchased} 
                        onChange={(e) => setLeadsPurchased(parseInt(e.target.value) || 0)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={runBedrockPlanner}
                      disabled={isGenerating}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-2.5 text-xs shadow cursor-pointer disabled:opacity-50 transition-all"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Calculating...
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" /> Run Bedrock
                      </>
                    )}
                  </button>
                  
                  {(isForecastGenerated || bedrockLogs.length > 0) && (
                    <button
                      onClick={resetOperationalParameters}
                      disabled={isGenerating}
                      className="px-3 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-semibold rounded-xl py-2.5 text-xs cursor-pointer transition-colors"
                      title="Clear Analysis Parameters"
                    >
                      Clear Setup
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Col: AI outputs & Bedrock Logs */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* Terminal Logs */}
              {isGenerating || bedrockLogs.length > 0 ? (
                <div className="bg-[#09090b] border border-zinc-800 rounded-2xl p-5 shadow-sm">
                  <h4 className="font-mono text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-blue-500" /> AWS Bedrock Query Execution Logs
                  </h4>
                  <div className="bg-zinc-950 font-mono text-[10px] p-4 rounded-xl text-zinc-300 h-40 overflow-y-auto flex flex-col gap-1 shadow-inner border border-zinc-900">
                    {bedrockLogs.map((log, index) => (
                      <div key={index} className="flex gap-2">
                        <span className="text-zinc-600 flex-shrink-0">[{new Date().toLocaleTimeString()}]</span>
                        <span className={log.includes("✓") || log.includes("🎉") ? "text-emerald-400" : log.includes("Parameters:") ? "text-blue-400" : "text-zinc-300"}>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-[#111827] border border-zinc-200 dark:border-zinc-850 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center py-20">
                  <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-900/10 text-blue-500 mb-4">
                    <Bot className="w-12 h-12" />
                  </div>
                  <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100">No shift plan generated yet</h4>
                  <p className="text-xs text-zinc-500 max-w-sm mt-1 leading-relaxed">
                    Set your agent availability and goals, then click "Run Bedrock" or use the "Goal Assistant" wizard above to configure a customized operational forecast.
                  </p>
                </div>
              )}

              {/* Forecast Results */}
              {isForecastGenerated && (
                <div className="bg-white dark:bg-[#111827] border border-zinc-200 dark:border-zinc-850 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
                  <div className="bg-blue-500/5 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-900/30 p-4 rounded-lg text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-line font-medium">
                    {aiSuggestions}
                  </div>

                  {/* Monthly Forecast Graphs */}
                  <div>
                    <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">AI Outbound Activity & Sales Forecast</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 h-56">
                        <h5 className="text-xs font-semibold mb-2">Calls Required to Hit Target</h5>
                        <ResponsiveContainer width="100%" height="90%">
                          <BarChart data={monthlyForecast} margin={{ left: -25 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis dataKey="week" stroke="#71717a" fontSize={10} />
                            <YAxis stroke="#71717a" fontSize={10} />
                            <Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", color: "#fff" }} />
                            <Bar dataKey="calls" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Required Calls" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 h-56">
                        <h5 className="text-xs font-semibold mb-2">Projected Monthly Sales Curves</h5>
                        <ResponsiveContainer width="100%" height="90%">
                          <LineChart data={monthlyForecast} margin={{ left: -25 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis dataKey="week" stroke="#71717a" fontSize={10} />
                            <YAxis stroke="#71717a" fontSize={10} />
                            <Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", color: "#fff" }} />
                            <Line type="monotone" dataKey="projectedSales" stroke="#10b981" strokeWidth={2} name="Sales Conversion" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Shifts Matrix */}
                  <div>
                    <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">AI Scheduled Agent Shifts</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-semibold uppercase">
                            <th className="py-2.5 px-2">Day</th>
                            <th className="py-2.5 px-2">Morning Shift</th>
                            <th className="py-2.5 px-2">Afternoon Shift</th>
                            <th className="py-2.5 px-2">Night Shift</th>
                            <th className="py-2.5 px-2 text-center">Weekend Pool</th>
                          </tr>
                        </thead>
                        <tbody>
                          {generatedSchedules.map((sched, idx) => (
                            <tr key={idx} className="border-b border-zinc-100 dark:border-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900/20">
                              <td className="py-2.5 px-2 font-bold">{sched.day}</td>
                              <td className="py-2.5 px-2 text-zinc-600 dark:text-zinc-400">{sched.morning}</td>
                              <td className="py-2.5 px-2 text-zinc-600 dark:text-zinc-400">{sched.afternoon}</td>
                              <td className="py-2.5 px-2 text-zinc-600 dark:text-zinc-400">{sched.night}</td>
                              <td className="py-2.5 px-2 text-center font-semibold text-blue-500">{sched.weekend}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: WORKFORCE AREA (WORKFORCE ONLY) 
            ======================================================== */}
        {activeTab === "workforce_admin" && userRole === "workforce" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Roster & User Creator */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              
              <div className="bg-white dark:bg-[#111827] border border-zinc-200 dark:border-zinc-850 rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5">
                    <UserPlus className="w-5 h-5 text-blue-500" /> Create Agent Accounts
                  </h3>
                </div>
                <form onSubmit={handleCreateUser} className="flex flex-col gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Yuki Tanaka"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl p-2 text-xs outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="yuki@connect-bpo.com"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl p-2 text-xs outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">Access Password</label>
                    <input 
                      type="password" 
                      placeholder="e.g. yuki1234"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl p-2 text-xs outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">Role Type</label>
                    <select 
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl p-2 text-xs outline-none"
                    >
                      <option value="agent">Sales Agent</option>
                      <option value="supervisor">Workforce Manager</option>
                    </select>
                  </div>
                  <button 
                    type="submit"
                    className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-2 text-xs shadow cursor-pointer transition-colors"
                  >
                    Add User to Aurora DB
                  </button>
                </form>
              </div>

              {/* Import Leads */}
              <div className="bg-white dark:bg-[#111827] border border-zinc-200 dark:border-zinc-850 rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5 mb-2">
                  <Upload className="w-5 h-5 text-emerald-500" /> Import Leads
                </h3>
                <p className="text-xs text-zinc-500 leading-normal mb-4">
                  Import purchased sales leads directly into the shared CRM database. AI will distribute them automatically.
                </p>
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-semibold rounded-xl py-2 text-xs cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> Open Leads Importer
                </button>
              </div>

            </div>

            {/* Right Col: Active Users list */}
            <div className="lg:col-span-2 bg-white dark:bg-[#111827] border border-zinc-200 dark:border-zinc-850 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-base mb-1">Roster User Accounts</h3>
              <p className="text-xs text-zinc-500 mb-4">Managing supervisors and outbound agents registered on Amazon Connect.</p>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-semibold uppercase">
                      <th className="py-2.5 px-2">User ID</th>
                      <th className="py-2.5 px-2">Name</th>
                      <th className="py-2.5 px-2">Email</th>
                      <th className="py-2.5 px-2 text-center">System Role</th>
                      <th className="py-2.5 px-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map(user => (
                      <tr key={user.id} className="border-b border-zinc-100 dark:border-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900/20">
                        <td className="py-3 px-2 font-mono text-[10px] text-zinc-400">{user.id}</td>
                        <td className="py-3 px-2 font-semibold">{user.name}</td>
                        <td className="py-3 px-2 text-zinc-500">{user.email}</td>
                        <td className="py-3 px-2 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded font-mono uppercase text-[9px] font-bold ${
                            user.role === "supervisor" 
                              ? "bg-purple-500/10 text-purple-500 border border-purple-500/20"
                              : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center text-emerald-500 font-semibold">{user.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            TAB: OUTBOUND CRM VIEW (AGENTS & WORKFORCE) 
            ======================================================== */}
        {activeTab === "crm" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Sales CRM Table */}
            <div className="lg:col-span-2 bg-white dark:bg-[#111827] border border-zinc-200 dark:border-zinc-850 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <div>
                  <h3 className="font-bold text-lg text-zinc-950 dark:text-zinc-50">Outbound Sales CRM</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Click call to launch Connect dialer. Update status, add notes, or email leads.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-60">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
                    <input 
                      type="text" 
                      placeholder="Search lead..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs outline-none"
                    />
                  </div>
                  <button
                    onClick={() => setIsCustomerModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-3 py-2 text-xs font-semibold shadow cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Customer
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-semibold uppercase">
                      <th className="py-2.5 px-2">Customer Name</th>
                      <th className="py-2.5 px-2">Phone</th>
                      <th className="py-2.5 px-2 text-center">Assigned Agent</th>
                      <th className="py-2.5 px-2 text-center">Interest</th>
                      <th className="py-2.5 px-2 text-center">Lead Status</th>
                      <th className="py-2.5 px-2 text-right">Outbound Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map(customer => (
                      <tr 
                        key={customer.id} 
                        className="border-b border-zinc-100 dark:border-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors"
                      >
                        <td className="py-3 px-2">
                          <div>
                            <p className="font-semibold text-zinc-950 dark:text-zinc-50">{customer.name}</p>
                            <span className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">{customer.notes}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 font-mono text-zinc-500">{customer.phone}</td>
                        <td className="py-3 px-2 text-center">
                          <span className="bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-850">
                            {customer.assignedAgent}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                            customer.interest === "High" ? "bg-red-500/10 text-red-500" :
                            customer.interest === "Medium" ? "bg-amber-500/10 text-amber-500" :
                            customer.interest === "Low" ? "bg-zinc-500/10 text-zinc-500" : "bg-emerald-500/10 text-emerald-500"
                          }`}>
                            {customer.interest}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-semibold ${
                            customer.status === "new" ? "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400" :
                            customer.status === "contacted" ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400" :
                            customer.status === "qualified" ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400" :
                            customer.status === "closed_won" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400" :
                            "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400"
                          }`}>
                            {customer.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => { setSelectedCustomer(customer); setCallNotesText(""); setIsNotesModalOpen(true); }}
                              className="p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                              title="Add Call Notes"
                            >
                              <FileText className="w-3.5 h-3.5 text-zinc-500" />
                            </button>
                            <button
                              onClick={() => { setSelectedCustomer(customer); setEmailSubject(""); setEmailBody(""); setIsEmailModalOpen(true); }}
                              className="p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
                              title="Send Email"
                            >
                              <Mail className="w-3.5 h-3.5 text-zinc-500" />
                            </button>
                            <button 
                              onClick={() => handleDialCustomer(customer)}
                              disabled={connectStatus === "calling" || connectStatus === "connected"}
                              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-1.5 disabled:opacity-50 cursor-pointer transition-colors"
                              title="Call"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </button>
                            {customer.status !== "closed_won" && customer.status !== "closed_lost" && (
                              <>
                                <button
                                  onClick={() => handleCloseSale(customer, "closed_won")}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl p-1.5 cursor-pointer transition-colors"
                                  title="Register Sale (Closed Won)"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleCloseSale(customer, "closed_lost")}
                                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl p-1.5 cursor-pointer transition-colors"
                                  title="Mark Lost"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Col: CCP Dialer */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              
              <div className="bg-white dark:bg-[#111827] border border-zinc-200 dark:border-zinc-850 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-[#1f2937] text-white p-4 flex justify-between items-center border-b border-zinc-700">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${ccpMode === "twilio" && twilioStatus === "ready" ? "bg-emerald-500 animate-ping" : "bg-blue-500 animate-ping"}`} />
                    <span className="text-xs font-semibold tracking-wider font-mono">
                      {ccpMode === "twilio" ? t.twilioDialer.toUpperCase() : "SIMULATED DIALER"}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2.5">
                    {/* Dialer Mode Selector */}
                    <select
                      value={ccpMode}
                      onChange={(e) => setCcpMode(e.target.value as "simulated" | "twilio")}
                      className="bg-zinc-800 text-[10px] text-zinc-300 font-semibold px-2 py-0.5 rounded border border-zinc-700 outline-none cursor-pointer hover:border-zinc-600 transition-colors"
                    >
                      <option value="simulated">{t.simulated}</option>
                      <option value="twilio">{t.liveTwilio}</option>
                    </select>

                    <a 
                      href="https://console.aws.amazon.com/connect/v2/app/instances" 
                      target="_blank" 
                      rel="noreferrer" 
                      title={t.connectConsole}
                      className="text-zinc-400 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Amazon Connect quick-access panel (Live mode) */}
                {ccpMode === "twilio" && (
                  <a
                    href="https://console.aws.amazon.com/connect/v2/app/instances"
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-3 p-4 bg-zinc-950 border-b border-zinc-850 hover:bg-zinc-900 transition-colors"
                  >
                    <img
                      src="/amazon-connect-console.png"
                      alt="Amazon Connect"
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-zinc-800"
                    />
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        {t.connectConsole}
                        <ExternalLink className="w-3 h-3 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                      <span className="text-[10px] text-zinc-400 leading-snug">
                        {t.connectConsoleDesc}
                      </span>
                    </div>
                  </a>
                )}

                {/* Dialer Widget Body */}
                <div className="p-6 bg-zinc-900 text-white flex flex-col items-center justify-center gap-6 min-h-[325px]">
                  
                  {connectStatus === "available" && (
                    <div className="text-center flex flex-col items-center gap-4">
                      <div className="p-4 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400">
                        <Phone className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">Line Status: Available</h4>
                        <p className="text-xs text-zinc-500 mt-1">Select a CRM customer to begin dialing</p>
                      </div>
                      
                      {ccpMode === "twilio" ? (
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[10px] text-zinc-500 uppercase font-semibold">{t.twilioStatusLabel}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                            twilioStatus === "ready" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                            twilioStatus === "registering" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                            twilioStatus === "error" ? "bg-rose-500/20 text-rose-400 border-rose-500/30" :
                            "bg-zinc-800 text-zinc-400 border-zinc-700"
                          }`}>
                            {twilioStatus === "ready" ? t.ready :
                             twilioStatus === "registering" ? t.registering :
                             twilioStatus === "error" ? t.error : t.unregistered}
                          </span>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded border border-blue-500/30">SIM Ready</span>
                          <span className="bg-zinc-800 text-zinc-400 text-[10px] px-2 py-0.5 rounded border border-zinc-700">Offline Mode</span>
                        </div>
                      )}
                    </div>
                  )}

                  {connectStatus === "calling" && (
                    <div className="text-center flex flex-col items-center gap-4 w-full">
                      <div className="p-4 rounded-full bg-blue-600 text-white animate-bounce">
                        <Phone className="w-8 h-8 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-blue-400">{t.dialing}</h4>
                        <p className="text-lg font-semibold font-mono mt-1">{connectNumber}</p>
                        <p className="text-xs text-zinc-400 font-medium mt-1">{connectName}</p>
                      </div>
                      <button 
                        onClick={handleEndCall}
                        className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-6 py-2 text-xs font-semibold shadow cursor-pointer transition-colors"
                      >
                        {t.hangUp}
                      </button>
                    </div>
                  )}

                  {connectStatus === "connected" && (
                    <div className="text-center flex flex-col items-center gap-4 w-full">
                      <div className="p-4 rounded-full bg-emerald-600 text-white animate-pulse">
                        <Volume2 className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-emerald-400">{t.connected}</h4>
                        <p className="text-lg font-semibold font-mono mt-1">{connectNumber}</p>
                        <p className="text-xs text-zinc-400 font-medium mt-1">{connectName}</p>
                        <span className="inline-block mt-3 text-xs bg-zinc-800 px-3 py-1 rounded font-mono text-zinc-300">
                          Duration: {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, "0")}
                        </span>
                      </div>
                      <div className="flex gap-2 w-full max-w-[200px]">
                        <button 
                          onClick={() => {
                            setClosedLeads(prev => prev + 1);
                            setCustomers(prev => prev.map(c => {
                              if (c.id === selectedCustomer?.id) {
                                return { ...c, status: "closed_won" };
                              }
                              return c;
                            }));
                            alert("Lead closed won! Updated database.");
                            handleEndCall();
                          }}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2 text-xs font-semibold cursor-pointer shadow transition-colors"
                        >
                          Won
                        </button>
                        <button 
                          onClick={handleEndCall}
                          className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl py-2 text-xs font-semibold cursor-pointer shadow transition-colors"
                        >
                          {t.hangUp}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 text-xs">
                  <h5 className="font-bold mb-1.5 flex items-center gap-1 text-zinc-700 dark:text-zinc-300">
                    <Server className="w-3.5 h-3.5" /> {t.outboundCall}
                  </h5>
                  <p className="text-zinc-500 leading-normal">
                    {ccpMode === "twilio" 
                      ? "Outbound calls route securely through Amazon Connect cloud telephony in real-time."
                      : "Simulated calls run inside the local browser application state for demonstration and offline workflows."}
                  </p>
                </div>
              </div>

              {/* Premium Month Progress Card */}
              <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 text-white rounded-2xl p-6 shadow-lg shadow-indigo-500/10 border border-indigo-500/20 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden flex flex-col gap-5">
                {/* Decorative glow overlays */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-sky-400/20 rounded-full blur-xl -ml-6 -mb-6 pointer-events-none" />

                <div className="flex justify-between items-start z-10">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-sky-200">{t.crmPerformance}</span>
                    <h4 className="font-extrabold text-base text-white tracking-wide mt-0.5">{t.targetProgress}</h4>
                  </div>
                  <TrendingUp className="w-5 h-5 text-sky-300 animate-pulse" />
                </div>

                <div className="flex items-center gap-6 z-10">
                  {/* Gauge */}
                  <div className="relative flex-shrink-0 w-20 h-20 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="40" cy="40" r="34" stroke="rgba(255,255,255,0.12)" strokeWidth="6" fill="transparent" />
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        stroke="url(#crmProgressGrad)"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray="213.6"
                        strokeDashoffset={213.6 - (213.6 * targetProgress) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                      <defs>
                        <linearGradient id="crmProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#38bdf8" />
                          <stop offset="100%" stopColor="#818cf8" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="absolute text-lg font-extrabold font-mono text-white">{targetProgress}%</span>
                  </div>

                  {/* Quota details */}
                  <div className="flex flex-col gap-2.5">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-indigo-200 font-semibold">{t.completed}</span>
                      <span className="text-lg font-extrabold tracking-tight">
                        {totalClosedWon} <span className="text-xs font-normal text-indigo-200">/ {pursueTarget} {t.sales}</span>
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-indigo-200 font-semibold">{t.monthlyQuota}</span>
                      <span className="text-xs font-bold">{pursueTarget} {t.sales}</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar and small label */}
                <div className="flex flex-col gap-1.5 z-10 mt-1">
                  <div className="w-full bg-white/15 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-sky-400 to-indigo-300 h-full rounded-full transition-all duration-1000" style={{ width: `${targetProgress}%` }} />
                  </div>
                  <p className="text-[10px] text-indigo-100 leading-normal font-medium">{t.monthProgressDescription}</p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================
            TAB: AI SALES COACH (AGENTS ONLY) 
            ======================================================== */}
        {activeTab === "coach" && userRole === "agent" && (
          <div className="bg-white dark:bg-[#111827] border border-zinc-200 dark:border-zinc-850 rounded-2xl p-6 shadow-sm flex flex-col h-[500px]">
            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 mb-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Bot className="w-5 h-5 text-blue-500 animate-pulse" /> AI Sales Coach & Objections Coach
                </h3>
                <p className="text-xs text-zinc-500">Brainstorm with Bedrock algorithms to improve call plans, scripts, and close-won ratios.</p>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 px-2 py-0.5 rounded font-mono uppercase">Bedrock Active</span>
            </div>

            <div className="flex-1 overflow-y-auto mb-4 p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl flex flex-col gap-3.5 border border-zinc-200 dark:border-zinc-900/50">
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === "user" 
                        ? "bg-blue-600 text-white rounded-br-none shadow-sm" 
                        : "bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded-bl-none shadow-sm whitespace-pre-line"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
                    <span className="text-xs text-zinc-400">Amazon Bedrock thinking...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <button 
                onClick={() => { setChatInput("Generate outbound sales script for warm leads"); }}
                className="text-[10px] bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-600 dark:text-zinc-400 transition-colors cursor-pointer"
              >
                📝 Script Template
              </button>
              <button 
                onClick={() => { setChatInput("List top objections for outsourcing customer care and how to overcome them"); }}
                className="text-[10px] bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-600 dark:text-zinc-400 transition-colors cursor-pointer"
              >
                🛡️ Objection Handling
              </button>
              <button 
                onClick={() => { setChatInput("How can we increase our closing rate to hit our pursuit target?"); }}
                className="text-[10px] bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-600 dark:text-zinc-400 transition-colors cursor-pointer"
              >
                📈 Hit Quota Strategy
              </button>
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Ask coach script advice, pitch strategies, target plans..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                className="flex-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4.5 py-2 text-xs outline-none"
              />
              <button 
                onClick={handleSendChatMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-2.5 cursor-pointer transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: OPS DEEP-DIVE (WORKFORCE ONLY) 
            ======================================================== */}
        {activeTab === "advanced" && userRole === "workforce" && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="bg-white dark:bg-[#111827] border border-zinc-200 dark:border-zinc-850 rounded-2xl p-5 shadow-sm">
                <h4 className="text-sm font-bold mb-4">Lead Pipeline by Status (Live)</h4>
                <div className="h-64">
                  {Object.keys(pipeline).length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-zinc-500">
                      No lead activity yet. Import leads and start calling to populate this chart.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={Object.entries(pipeline).map(([status, count]) => ({
                          date: status.replace("_", " "),
                          calls: count,
                        }))}
                        margin={{ left: -25 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis dataKey="date" stroke="#71717a" fontSize={11} />
                        <YAxis stroke="#71717a" fontSize={11} allowDecimals={false} />
                        <Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", color: "#fff" }} />
                        <Area type="monotone" dataKey="calls" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} name="Leads" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-[#111827] border border-zinc-200 dark:border-zinc-850 rounded-2xl p-5 shadow-sm">
                <h4 className="text-sm font-bold mb-4">Outbound Lead Conversion Outcomes (Live)</h4>
                <div className="h-64 flex items-center justify-center">
                  {Object.keys(pipeline).length === 0 ? (
                    <div className="text-xs text-zinc-500">No conversion data yet.</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "New", value: pipeline["new"] || 0 },
                            { name: "Contacted", value: pipeline["contacted"] || 0 },
                            { name: "Qualified", value: pipeline["qualified"] || 0 },
                            { name: "Closed Won", value: pipeline["closed_won"] || 0 },
                            { name: "Closed Lost", value: pipeline["closed_lost"] || 0 },
                          ].filter((d) => d.value > 0)}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {[0,1,2,3,4].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", color: "#fff" }} />
                        <Legend verticalAlign="bottom" height={36} iconSize={8} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#111827] border border-zinc-200 dark:border-zinc-850 rounded-2xl p-6 shadow-sm">
              <h4 className="font-bold text-sm mb-1">Agent Roster</h4>
              <p className="text-[11px] text-zinc-500 mb-4">Live agents from your team. Per-agent call metrics populate as outbound activity is logged.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-semibold uppercase">
                      <th className="py-2.5 px-2">Agent Name</th>
                      <th className="py-2.5 px-2">Email</th>
                      <th className="py-2.5 px-2 text-right">Avg Handle Time (AHT)</th>
                      <th className="py-2.5 px-2 text-right">Outbound Dials Made</th>
                      <th className="py-2.5 px-2 text-right">Conversions (Sales)</th>
                      <th className="py-2.5 px-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.filter((u) => u.role === "agent").length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-zinc-500">No agents yet. Add agents in Workforce Mgmt.</td>
                      </tr>
                    ) : (
                      usersList.filter((u) => u.role === "agent").map((agent) => (
                        <tr key={agent.id} className="border-b border-zinc-100 dark:border-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-900/20">
                          <td className="py-3 px-2 font-semibold">{agent.name}</td>
                          <td className="py-3 px-2 font-mono text-zinc-500">{agent.email}</td>
                          <td className="py-3 px-2 text-right font-mono text-zinc-400">—</td>
                          <td className="py-3 px-2 text-right font-mono text-zinc-400">—</td>
                          <td className="py-3 px-2 text-right font-mono text-zinc-400">—</td>
                          <td className="py-3 px-2 text-center">
                            <span className="bg-emerald-500/10 text-emerald-500 text-[11px] px-2 py-0.5 rounded font-mono font-bold">
                              {agent.status || "Active"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================
          MODAL: ADD NEW CUSTOMER TO CRM
          ======================================================== */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/30">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50">Create CRM Customer</h3>
              <button onClick={() => setIsCustomerModalOpen(false)} className="text-zinc-400 hover:text-zinc-655 dark:hover:text-zinc-200 text-xs">✕</button>
            </div>
            
            <form onSubmit={handleAddCustomer} className="p-5 flex flex-col gap-3.5">
              <div>
                <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">Company/Customer Name</label>
                <input 
                  type="text" 
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 text-xs outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 text-xs outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={newCustEmail}
                    onChange={(e) => setNewCustEmail(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">Lead Status</label>
                  <select 
                    value={newCustStatus} 
                    onChange={(e) => setNewCustStatus(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 text-xs outline-none"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">Assigned Agent</label>
                  <select 
                    value={newCustAgent} 
                    onChange={(e) => setNewCustAgent(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 text-xs outline-none"
                  >
                    <option value="Unassigned">Unassigned</option>
                    {usersList
                      .filter(u => u.role === "agent")
                      .map(u => (
                        <option key={u.id} value={u.name}>{u.name}</option>
                      ))
                    }
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">Interest Level</label>
                  <select 
                    value={newCustInterest} 
                    onChange={(e) => setNewCustInterest(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 text-xs outline-none"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Notes / Description</label>
                  <button
                    type="button"
                    onClick={handleAIEnhanceCustNote}
                    disabled={isEnhancingCustNote || !newCustNotes.trim()}
                    className="text-[9px] bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 font-semibold px-2 py-0.5 rounded-lg disabled:opacity-50 cursor-pointer transition-colors flex items-center gap-1"
                  >
                    {isEnhancingCustNote ? (
                      <>
                        <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Rewriting...
                      </>
                    ) : (
                      <>
                        ✨ AI Enhance
                      </>
                    )}
                  </button>
                </div>
                <textarea 
                  value={newCustNotes}
                  onChange={(e) => setNewCustNotes(e.target.value)}
                  placeholder="Type lead notes or shorthand and click 'AI Enhance'..."
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 text-xs outline-none h-16 resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end mt-2">
                <button 
                  type="button" 
                  onClick={() => setIsCustomerModalOpen(false)}
                  className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl cursor-pointer shadow"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD CALL NOTES & AI ENHANCEMENT
          ======================================================== */}
      {isNotesModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/30">
              <div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50">Log Call notes</h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">Recording details for: {selectedCustomer.name}</p>
              </div>
              <button onClick={() => setIsNotesModalOpen(false)} className="text-zinc-400 hover:text-zinc-655 dark:hover:text-zinc-200 text-xs">✕</button>
            </div>
            
            <div className="p-5 flex flex-col gap-3.5">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Observations / Next Steps</label>
                  <button
                    onClick={handleAIEnhanceNote}
                    disabled={isEnhancingNote || !callNotesText.trim()}
                    className="text-[10px] bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 font-semibold px-2 py-1 rounded-lg disabled:opacity-50 cursor-pointer transition-colors flex items-center gap-1"
                  >
                    {isEnhancingNote ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" /> Rewriting...
                      </>
                    ) : (
                      <>
                        ✨ AI Enhance Note
                      </>
                    )}
                  </button>
                </div>
                <textarea 
                  value={callNotesText}
                  onChange={(e) => setCallNotesText(e.target.value)}
                  placeholder="Type notes or type shorthand and click 'AI Enhance Note' (e.g. 'callback later' or 'agreed proposal')..."
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs outline-none h-28 resize-none"
                  required
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button 
                  onClick={() => setIsNotesModalOpen(false)}
                  className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Skip
                </button>
                <button 
                  onClick={handleAddCallNote}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl cursor-pointer shadow animate-pulse"
                >
                  Save Call Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: SEND EMAIL COMPOSER
          ======================================================== */}
      {isEmailModalOpen && selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/30">
              <div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-blue-500" /> Send Email to Customer
                </h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">To: {selectedCustomer.name} ({selectedCustomer.email})</p>
              </div>
              <button onClick={() => setIsEmailModalOpen(false)} className="text-zinc-400 hover:text-zinc-655 dark:hover:text-zinc-200 text-xs">✕</button>
            </div>
            
            <div className="p-5 flex flex-col gap-3.5">
              <div>
                <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">Email Subject</label>
                <input 
                  type="text" 
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="e.g. Outsourced Call Center Services Proposal"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 text-xs outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">Email Body Message</label>
                <textarea 
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder={`Hi ${selectedCustomer.name},\n\nGreat speaking with you on the phone. As discussed, please find attached our outsourcing SLA details...\n\nBest,\nSales Team`}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs outline-none h-32 resize-none"
                  required
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button 
                  onClick={() => setIsEmailModalOpen(false)}
                  className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendEmail}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl cursor-pointer shadow flex items-center gap-1"
                >
                  <Send className="w-3 h-3" /> Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: LEAD IMPORTER (CSV / TEXT PASTE)
          ======================================================== */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/30">
              <div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50">Bulk Lead Importer</h3>
                <p className="text-[10px] text-zinc-500 mt-0.5 font-mono">Format: Name, Phone, Email (One per line)</p>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} className="text-zinc-400 hover:text-zinc-655 dark:hover:text-zinc-200 text-xs">✕</button>
            </div>
            
            <div className="p-5 flex flex-col gap-3.5">
              <div>
                <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">Upload CSV File</label>
                <input
                  ref={csvInputRef}
                  type="file"
                  accept=".csv,.txt,text/csv"
                  onChange={handleCsvFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => csvInputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center gap-1.5 border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl py-5 px-3 text-zinc-500 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <Upload className="w-5 h-5" />
                  <span className="text-xs font-semibold">
                    {importFileName ? `Loaded: ${importFileName}` : "Click to upload a .csv file"}
                  </span>
                  <span className="text-[10px] text-zinc-400">Columns: Name, Phone, Email, Interest (header optional)</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                <span className="text-[10px] text-zinc-400 uppercase">or paste manually</span>
                <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">Paste CSV Leads</label>
                <textarea 
                  value={importLeadsText}
                  onChange={(e) => setImportLeadsText(e.target.value)}
                  placeholder={`John Doe, +1 (555) 111-2222, john@example.com\nJane Smith, +1 (555) 333-4444, jane@example.com`}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 text-xs outline-none h-32 resize-none font-mono"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button 
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleImportLeads}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl cursor-pointer shadow flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" /> Parse & Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SETUP GOAL WIZARD MODAL */}
      {isWizardOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col transition-all">
            
            {/* Header */}
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/30">
              <div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5">
                  ✨ Goal Assistant Onboarding
                </h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">Quickly configure operational goals for Bedrock</p>
              </div>
              <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">
                Step {wizardStep} of 4
              </span>
            </div>

            {/* Body */}
            <div className="p-5 flex-1 max-h-[360px] overflow-y-auto">
              
              {/* STEP 1: OFFER TYPE */}
              {wizardStep === 1 && (
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">What are you trying to sell?</h4>
                  <div className="grid grid-cols-1 gap-2.5">
                    
                    <button
                      onClick={() => setWizardOfferType("course")}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        wizardOfferType === "course"
                          ? "border-blue-500 bg-blue-500/5 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/35"
                      }`}
                    >
                      <span className="text-2xl">🎓</span>
                      <div>
                        <h5 className="text-xs font-bold">Course / Education</h5>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal">
                          Consultative sales cycles. Calls are longer (AHT ~450s). High focus on evening and weekend shifts.
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => setWizardOfferType("product")}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        wizardOfferType === "product"
                          ? "border-blue-500 bg-blue-500/5 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/35"
                      }`}
                    >
                      <span className="text-2xl">📦</span>
                      <div>
                        <h5 className="text-xs font-bold">Product / Commodity</h5>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal">
                          Transactional sales cycles. Fast calls (AHT ~180s) with high volume call frequencies during standard shifts.
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => setWizardOfferType("service")}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        wizardOfferType === "service"
                          ? "border-blue-500 bg-blue-500/5 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/35"
                      }`}
                    >
                      <span className="text-2xl">💼</span>
                      <div>
                        <h5 className="text-xs font-bold">Services / Business SLA</h5>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal">
                          B2B lead generation. Focused entirely on standard office hours (no night/weekend agent assignments).
                        </p>
                      </div>
                    </button>

                  </div>
                </div>
              )}

              {/* STEP 2: AGENTS ROSTER */}
              {wizardStep === 2 && (
                <div className="flex flex-col gap-4">
                  <div className="text-center py-4">
                    <span className="text-4xl">👥</span>
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mt-2.5">Outbound Agents Roster</h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5">How many total agents are available for shift rotation?</p>
                  </div>
                  
                  <div>
                    <input 
                      type="number"
                      value={wizardAgentsCount}
                      onChange={(e) => setWizardAgentsCount(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-center text-lg font-mono font-bold outline-none"
                    />
                    <span className="text-[10px] text-zinc-500 text-center block mt-1.5 leading-normal">
                      Note: AI will automatically allocate these agents across Morning, Afternoon, Night, and Weekend pools based on your offer type.
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 3: SALES TARGETS */}
              {wizardStep === 3 && (
                <div className="flex flex-col gap-3.5">
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Targets & Volume</h4>
                  
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-[10px] font-semibold text-zinc-400 block mb-1 uppercase tracking-wider">Weekly customer traffic volume</label>
                      <input 
                        type="number"
                        value={wizardWeeklyTraffic}
                        onChange={(e) => setWizardWeeklyTraffic(parseInt(e.target.value) || 0)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-zinc-400 block mb-1 uppercase tracking-wider">Pursue Sales Target (Closed leads)</label>
                      <input 
                        type="number"
                        value={wizardSalesTarget}
                        onChange={(e) => setWizardSalesTarget(parseInt(e.target.value) || 0)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-zinc-400 block mb-1 uppercase tracking-wider">Leads Purchased</label>
                      <input 
                        type="number"
                        value={wizardLeadsCount}
                        onChange={(e) => setWizardLeadsCount(parseInt(e.target.value) || 0)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: BEDROCK ORCHESTRATION SUMMARY */}
              {wizardStep === 4 && (
                <div className="flex flex-col gap-3">
                  <div className="bg-zinc-50 dark:bg-zinc-900/40 p-4 border border-zinc-200 dark:border-zinc-800/80 rounded-xl flex items-start gap-3">
                    <div className="p-2 rounded bg-blue-600/10 text-blue-500 mt-0.5">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Bedrock Parameter Mapping</h5>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal">
                        Ready to trigger the Bedrock Claude 3.5 scheduler with these parameters:
                      </p>
                    </div>
                  </div>

                  <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs flex flex-col gap-2 font-mono">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Offer Type:</span>
                      <span className="font-bold text-blue-500 uppercase">{wizardOfferType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Total Agents:</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">{wizardAgentsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Sales Quota Goal:</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">{wizardSalesTarget} closed</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Lead Purchases:</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">{wizardLeadsCount} records</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Footer buttons */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 flex justify-between gap-2">
              <button
                onClick={() => {
                  if (wizardStep > 1) {
                    setWizardStep(prev => prev - 1);
                  } else {
                    setIsWizardOpen(false);
                  }
                }}
                className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs font-semibold rounded-xl cursor-pointer"
              >
                {wizardStep === 1 ? "Cancel" : "Back"}
              </button>

              <button
                onClick={() => {
                  if (wizardStep < 4) {
                    setWizardStep(prev => prev + 1);
                  } else {
                    handleWizardSubmit();
                  }
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl cursor-pointer flex items-center gap-1.5 shadow"
              >
                {wizardStep === 4 ? (
                  <>
                    <Zap className="w-3.5 h-3.5" /> Optimize Schedule
                  </>
                ) : (
                  "Next"
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  </div>
  );
}
