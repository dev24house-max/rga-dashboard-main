import { useState, useRef, useEffect } from 'react';
import {
    Send,
    FileText,
    Sparkles,
    Plus,
    Mic,
    PenTool,
    TrendingUp,
    Lightbulb,
    User,
    MessageSquare,
    Trash2,
    PanelLeftClose,
    PanelLeft,
    StopCircle,
    Pencil,
    X,
    PanelRight,
    Zap,
    ChevronRight,
    Calculator,
} from 'lucide-react';
import chatbotImage from '../../chat/chatbot.webp';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { AiDetailSummary, AiDetailSummaryData } from './ai-detail-summary';
import { MarketingTools } from './marketing-tools';
import {
    chatService,
    ChatSession,
    ChatMessage,
} from '../services/chat-service';
import { useAuthStore } from '@/stores/auth-store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from '@/i18n/use-translation';

// Add Speech Recognition Type Definition
declare global {
    interface Window {
        webkitSpeechRecognition: any;
        SpeechRecognition: any;
    }
}

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
};

type Session = {
    id: string;
    title: string;
    date: Date;
    messages: Message[];
};

const normalizeText = (text: string): string =>
    text.replace(/\s+/g, ' ').trim();

const dedupeMessages = (messages: Message[]): Message[] => {
    const seen = new Set<string>();
    return messages.filter((message) => {
        const key = `${message.role}:${normalizeText(message.content)}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
};

const getNewId = (): string =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

const ROLE_OPTIONS = [
    { id: 'general', labelKey: 'assistant.roles.general' },
    { id: 'ads', labelKey: 'assistant.roles.ads' },
    { id: 'seo', labelKey: 'assistant.roles.seo' },
] as const;

type RoleId = (typeof ROLE_OPTIONS)[number]['id'];

export function AiAssistant() {
    const { t } = useTranslation('aiInsights');
    const [query, setQuery] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [isListening, setIsListening] = useState(false); // Voice Input State
    const [isStreaming, setIsStreaming] = useState(false); // Fix: Prevent useEffect from overwriting streaming text
    const [activeRole, setActiveRole] = useState<RoleId>('general');
    const [messagesByRole, setMessagesByRole] = useState<
        Record<RoleId, Message[]>
    >({
        general: [],
        ads: [],
        seo: [],
    });

    const messages = messagesByRole[activeRole] || [];
    const updateMessages = (updater: (prev: Message[]) => Message[]) => {
        setMessagesByRole((prev) => ({
            ...prev,
            [activeRole]: dedupeMessages(updater(prev[activeRole] || [])),
        }));
    };
    const setMessagesForRole = (next: Message[]) => {
        setMessagesByRole((prev) => ({
            ...prev,
            [activeRole]: dedupeMessages(next),
        }));
    };

    // Controlled locally to avoid flash, but synced with React Query
    const [activeSessionIdByRole, setActiveSessionIdByRole] = useState<
        Record<RoleId, string | null>
    >({
        general: null,
        ads: null,
        seo: null,
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'chat' | 'summary' | 'tools'>(
        'chat'
    );
    const [summaryData, setSummaryData] = useState<AiDetailSummaryData | null>(
        null
    );
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);
    const [summaryLoadingError, setSummaryLoadingError] = useState<
        string | null
    >(null);

    const SUMMARY_STORAGE_KEY = 'ai-summary-data';
    const SUMMARY_DATE_KEY = 'ai-summary-date';
    const getTodayKey = () => new Date().toDateString();

    const loadSavedSummary = (): AiDetailSummaryData | null => {
        try {
            const saved = localStorage.getItem(SUMMARY_STORAGE_KEY);
            if (!saved) return null;
            return JSON.parse(saved) as AiDetailSummaryData;
        } catch (error) {
            console.error('Failed to load saved AI summary:', error);
            return null;
        }
    };

    const saveSummary = (data: AiDetailSummaryData) => {
        try {
            localStorage.setItem(SUMMARY_STORAGE_KEY, JSON.stringify(data));
            localStorage.setItem(SUMMARY_DATE_KEY, getTodayKey());
        } catch (error) {
            console.error('Failed to save AI summary:', error);
        }
    };

    const shouldFetchDailySummary = () => {
        const savedDate = localStorage.getItem(SUMMARY_DATE_KEY);
        return savedDate !== getTodayKey();
    };

    const fetchDailySummary = async () => {
        if (!webhookUrl) return;
        if (!shouldFetchDailySummary()) return;

        setSummaryLoadingError(null);
        setIsSummaryLoading(true);

        try {
            const route = envWebhookSummary ? 'summary' : 'general';
            const response = await fetch(`${backendBase}/ai/webhook/${route}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message:
                        'Create a daily strategic summary for the dashboard. Include summary cards, a key insight with recommendation, and section details for campaigns and performance. Return valid JSON compatible with the AiDetailSummaryData interface.',
                    role: activeRole,
                    timestamp: new Date().toISOString(),
                    userId: user?.id,
                    tenantId: user?.tenantId,
                }),
            });

            const contentType = response.headers.get('content-type') || '';
            let parsedSummary: AiDetailSummaryData | null = null;
            if (contentType.includes('application/json')) {
                const data = await response.json();
                parsedSummary =
                    tryParseSummaryData(data.data) || tryParseSummaryData(data);
            } else {
                const text = await response.text();
                parsedSummary = tryParseSummaryData(text);
            }

            if (parsedSummary) {
                setSummaryData(parsedSummary);
                saveSummary(parsedSummary);
            } else {
                setSummaryLoadingError(
                    t('assistant.summaryErrors.parseFailed')
                );
            }
        } catch (error: any) {
            console.error('Failed to fetch daily summary:', error);
            setSummaryLoadingError(
                error?.message || t('assistant.summaryErrors.loadFailed')
            );
        } finally {
            setIsSummaryLoading(false);
        }
    };

    // Refs
    const scrollRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null); // Ref to store recognition instance
    const isProcessingRef = useRef(false); // Sync guard against duplicate sends
    const lastSentQueryRef = useRef({ query: '', time: 0 });
    const streamIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
        null
    );

    // Rename State
    const [editingSessionId, setEditingSessionId] = useState<string | null>(
        null
    );
    const [editingTitle, setEditingTitle] = useState('');

    const { user, isAuthenticated } = useAuthStore();
    const queryClient = useQueryClient();
    const defaultWebhook =
        'https://yourrga1.app.n8n.cloud/webhook/chat-general';
    const envWebhookGeneral =
        (typeof import.meta !== 'undefined'
            ? import.meta.env.VITE_CHATBOT_WEBHOOK_URL_GENERAL
            : '') || '';
    const envWebhookSummary =
        (typeof import.meta !== 'undefined'
            ? import.meta.env.VITE_CHATBOT_WEBHOOK_URL_SUMMARY
            : '') || '';
    const envWebhookAds =
        (typeof import.meta !== 'undefined'
            ? import.meta.env.VITE_CHATBOT_WEBHOOK_URL_ADS
            : '') || defaultWebhook;
    const envWebhookSeo =
        (typeof import.meta !== 'undefined'
            ? import.meta.env.VITE_CHATBOT_WEBHOOK_URL_SEO
            : '') || defaultWebhook;
    const webhookUrl =
        activeRole === 'ads'
            ? envWebhookAds
            : activeRole === 'seo'
              ? envWebhookSeo
              : envWebhookGeneral || envWebhookSummary;
    const backendBase =
        (typeof import.meta !== 'undefined'
            ? import.meta.env.VITE_API_URL
            : '') || '/api/v1';
    const activeSessionId = activeSessionIdByRole[activeRole];

    const tryParseSummaryData = (value: any): AiDetailSummaryData | null => {
        if (!value) return null;
        let parsed = value;

        if (Array.isArray(parsed)) {
            if (parsed.length === 0) return null;
            parsed = parsed[0];
        }

        if (typeof parsed === 'string') {
            try {
                parsed = JSON.parse(parsed);
            } catch {
                return null;
            }
        }

        if (parsed && typeof parsed === 'object') {
            if (parsed.summaryCards && parsed.insight && parsed.sections) {
                return parsed as AiDetailSummaryData;
            }
            if (parsed.data) {
                return tryParseSummaryData(parsed.data);
            }
            if (parsed.output) {
                return tryParseSummaryData(parsed.output);
            }
            if (parsed.reply) {
                return tryParseSummaryData(parsed.reply);
            }
        }

        return null;
    };

    useEffect(() => {
        const saved = loadSavedSummary();
        if (saved) {
            setSummaryData(saved);
        }

        if (viewMode === 'summary') {
            fetchDailySummary();
        }
    }, [viewMode, webhookUrl, t]);

    // 1. React Query: Fetch Sessions
    const { data: apiSessions = [] } = useQuery({
        queryKey: ['chat-sessions', user?.id],
        queryFn: () => chatService.getSessions(user?.id!),
        enabled: !!isAuthenticated && !!user?.id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const sessions: Session[] = apiSessions.map((s: any) => ({
        id: s.id,
        title: s.title,
        date: new Date(s.updatedAt),
        messages: [],
    }));

    // 2. React Query: Fetch Messages for Active Session
    const { data: sessionData, isLoading: isLoadingMessages } = useQuery({
        queryKey: ['chat-session', activeSessionId],
        queryFn: () => chatService.getSession(activeSessionId!),
        enabled: !!activeSessionId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Sync Messages from Query State -> Local State (only when not streaming/thinking to avoid conflicts)
    useEffect(() => {
        if (
            sessionData &&
            sessionData.messages &&
            !isThinking &&
            !isStreaming
        ) {
            const mappedMessages: Message[] = sessionData.messages.map(
                (m: any) => ({
                    id: m.id,
                    role: m.role as 'user' | 'assistant',
                    content: m.content,
                    timestamp: new Date(m.createdAt),
                })
            );
            setMessagesForRole(mappedMessages);
        }
    }, [sessionData, activeSessionId, isThinking, isStreaming]);

    // 3. Mutations
    const createSessionMutation = useMutation({
        mutationFn: (title: string) => chatService.createSession(title),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
        },
    });

    const sendMessageMutation = useMutation({
        mutationFn: ({
            sessionId,
            role,
            content,
        }: {
            sessionId: string;
            role: 'user' | 'assistant';
            content: string;
        }) => chatService.sendMessage(sessionId, role, content),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['chat-session', activeSessionId],
            });
            // Also invalidate sessions if title could change (usually handled by backend, but safe to refresh list)
            queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
        },
    });

    const deleteSessionMutation = useMutation({
        mutationFn: (id: string) => chatService.deleteSession(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
            toast.success(t('assistant.toasts.chatDeleted'));
        },
        onError: () => toast.error(t('assistant.toasts.deleteFailed')),
    });

    const updateSessionMutation = useMutation({
        mutationFn: ({ id, title }: { id: string; title: string }) =>
            chatService.updateSession(id, title),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
            toast.success(t('assistant.toasts.chatRenamed'));
        },
        onError: () => toast.error(t('assistant.toasts.renameFailed')),
    });

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages, isThinking, isLoadingMessages]);

    // Cleanup interval
    useEffect(() => {
        return () => {
            if (streamIntervalRef.current) {
                clearInterval(streamIntervalRef.current);
                streamIntervalRef.current = null;
            }
        };
    }, []);

    const handleSearch = async (q: string = query) => {
        if (!q.trim()) return;

        // 1. 🔒 Sync guard: block duplicate calls instantly
        if (isProcessingRef.current) return;

        // 1b. Avoid rapid duplicate queries from the same input
        const normalizedQuery = q.trim();
        const now = Date.now();
        if (
            normalizedQuery === lastSentQueryRef.current.query &&
            now - lastSentQueryRef.current.time < 2000
        ) {
            return;
        }
        lastSentQueryRef.current = { query: normalizedQuery, time: now };

        isProcessingRef.current = true;
        setIsThinking(true); // Disable UI immediately

        // Clear any lingering stream interval
        if (streamIntervalRef.current) {
            clearInterval(streamIntervalRef.current);
            streamIntervalRef.current = null;
        }

        // Save the query text before clearing (for recovery on error)
        const savedQuery = q;
        const tempUserMsgId = Date.now().toString();

        try {
            // 2. Ensure Session Exists (if API available)
            let currentSessionId = activeSessionId;
            if (!currentSessionId) {
                try {
                    const newSession = await createSessionMutation.mutateAsync(
                        savedQuery.slice(0, 50)
                    );
                    currentSessionId = newSession.id;
                    setActiveSessionIdByRole((prev) => ({
                        ...prev,
                        [activeRole]: currentSessionId,
                    }));
                } catch {
                    currentSessionId = null;
                }
            }

            // 3. Optimistic User Message
            const userMsg: Message = {
                id: tempUserMsgId,
                role: 'user',
                content: savedQuery,
                timestamp: new Date(),
            };

            updateMessages((prev) => [...prev, userMsg]);
            setQuery(''); // Clear input AFTER adding message

            // 4. Save user message so the chat history keeps the typed text.
            //    This is not the AI webhook request.
            if (currentSessionId) {
                await sendMessageMutation.mutateAsync({
                    sessionId: currentSessionId,
                    role: 'user',
                    content: savedQuery,
                });
            }

            // 5. Determine Response Logic (Webhook only - no fallback)
            let responseText = '';
            if (webhookUrl) {
                const route =
                    activeRole === 'ads'
                        ? 'ads'
                        : activeRole === 'seo'
                          ? 'seo'
                          : 'general';

                console.log(
                    `[AI Assistant] Sending to webhook route: ${route} (activeRole=${activeRole})`
                );

                const response = await fetch(
                    `${backendBase}/ai/webhook/${route}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: currentSessionId,
                            tenant_id: user?.tenantId || '',
                            question: savedQuery,
                        }),
                    }
                );

                const contentType = response.headers.get('content-type') || '';

                // Check if response has a body
                const bodyText = await response.text();
                if (!bodyText || bodyText.trim() === '') {
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    // Don't set fallback - only Gemini response
                    responseText = '';
                } else if (contentType.includes('application/json')) {
                    try {
                        const data = JSON.parse(bodyText);
                        if (!response.ok) {
                            throw new Error(
                                data?.error ||
                                    data?.message ||
                                    `HTTP ${response.status}`
                            );
                        }
                        responseText =
                            data.reply ||
                            data.response ||
                            data.message ||
                            data.output ||
                            '';
                    } catch (parseErr) {
                        if (!response.ok) {
                            throw new Error(`HTTP ${response.status}`);
                        }
                        responseText = bodyText;
                    }
                } else {
                    if (!response.ok) {
                        throw new Error(bodyText || `HTTP ${response.status}`);
                    }
                    responseText = bodyText;
                }
            }

            // 6. Only show message if we have actual Gemini response
            const trimmedResponse = responseText?.trim() || '';
            const isHtmlResponse =
                /^<\/?(?:html|!doctype)/i.test(trimmedResponse) ||
                /<html/i.test(trimmedResponse);
            const isNoResponseText =
                !trimmedResponse ||
                /^no response\.?$/i.test(trimmedResponse) ||
                isHtmlResponse;

            if (isNoResponseText) {
                setQuery(savedQuery);
                setIsThinking(false);
                isProcessingRef.current = false;
                toast.error(t('assistant.toasts.invalidResponse'));
                return;
            }

            // 6b. Deduplicate same assistant answer (prevent multi-response duplication)
            const normalizedResponse = normalizeText(responseText);
            const existingAssistant = (messagesByRole[activeRole] || []).find(
                (m) =>
                    m.role === 'assistant' &&
                    normalizeText(m.content) === normalizedResponse
            );
            if (existingAssistant) {
                console.debug(
                    '[AiAssistant] duplicate assistant response suppressed',
                    { activeRole, normalizedResponse }
                );
                setIsThinking(false);
                isProcessingRef.current = false;
                return;
            }

            // Simulate AI Thinking (reduced delay 400ms)
            await new Promise((resolve) => setTimeout(resolve, 400));

            setIsStreaming(true); // Lock useEffect
            setIsThinking(false);

            // 7. Optimistic AI Message & Streaming Effect
            const aiMsgId = getNewId();
            const aiMsg: Message = {
                id: aiMsgId,
                role: 'assistant',
                content: '',
                timestamp: new Date(),
            };
            updateMessages((prev) => [...prev, aiMsg]);

            // Streaming Visuals
            let charIndex = 0;
            const chunkSize = 3; // characters per tick
            streamIntervalRef.current = setInterval(() => {
                charIndex += chunkSize;
                const currentContent = responseText.slice(
                    0,
                    Math.min(charIndex, responseText.length)
                );
                updateMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === aiMsgId
                            ? { ...msg, content: currentContent }
                            : msg
                    )
                );

                if (charIndex >= responseText.length) {
                    if (streamIntervalRef.current) {
                        clearInterval(streamIntervalRef.current);
                        streamIntervalRef.current = null;
                    }

                    // 8. Save AI message THEN unlock
                    if (currentSessionId) {
                        sendMessageMutation
                            .mutateAsync({
                                sessionId: currentSessionId,
                                role: 'assistant',
                                content: responseText,
                            })
                            .then(async () => {
                                // Critical: Wait for refetch to complete so we don't flash stale data
                                await queryClient.invalidateQueries({
                                    queryKey: [
                                        'chat-session',
                                        currentSessionId,
                                    ],
                                });

                                // Small buffer to ensure React renders the new data
                                setTimeout(() => {
                                    setIsStreaming(false);
                                    isProcessingRef.current = false;
                                }, 100);
                            })
                            .catch((err) => {
                                console.error(
                                    'Failed to save AI message:',
                                    err
                                );
                                setIsStreaming(false);
                                isProcessingRef.current = false;
                            });
                    } else {
                        setIsStreaming(false);
                        isProcessingRef.current = false;
                    }
                }
            }, 30);
        } catch (err: any) {
            console.error('Chat error:', err);
            setIsThinking(false);
            isProcessingRef.current = false;
            // Restore query so user can retry
            setQuery(savedQuery);
            // Remove the optimistic user message that failed
            updateMessages((prev) =>
                prev.filter((m) => m.id !== tempUserMsgId)
            );

            // Show more specific error
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                t('assistant.toasts.connectionFailed');
            toast.error(
                t('assistant.toasts.aiError', { message: errorMessage })
            );
        }
    };

    // Voice Input Handler
    const handleVoiceInput = () => {
        if (isListening) {
            // Stop listening
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            setIsListening(false);
            return;
        }

        // Start listening
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert(t('assistant.speech.unsupported'));
            return;
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = false; // Stop automatically after one sentence
        recognition.interimResults = false;
        recognition.lang = 'th-TH'; // Default to Thai, can be dynamic

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setQuery((prev) => (prev ? prev + ' ' + transcript : transcript));
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const handleNewChat = () => {
        setActiveSessionIdByRole((prev) => ({
            ...prev,
            [activeRole]: null,
        }));
        setMessagesForRole([]);
        setQuery('');
        setIsThinking(false);
        if (!isSidebarOpen) setIsSidebarOpen(true);
    };

    const restoreSession = (session: Session) => {
        setActiveSessionIdByRole((prev) => ({
            ...prev,
            [activeRole]: session.id,
        }));
        // Messages synced via React Query useEffect
    };

    const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await deleteSessionMutation.mutateAsync(id);
            if (activeSessionId === id) {
                setActiveSessionIdByRole((prev) => ({
                    ...prev,
                    [activeRole]: null,
                }));
                setMessagesForRole([]);
            }
        } catch (err) {
            // Error handled in mutation
        }
    };

    const handleStartRename = (session: Session, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingSessionId(session.id);
        setEditingTitle(session.title);
    };

    const handleConfirmRename = async () => {
        if (!editingSessionId || !editingTitle.trim()) {
            setEditingSessionId(null);
            return;
        }
        try {
            await updateSessionMutation.mutateAsync({
                id: editingSessionId,
                title: editingTitle.trim(),
            });
        } catch (err) {
            // Error handled in mutation
        }
        setEditingSessionId(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            if (e.nativeEvent.isComposing) return;
            e.preventDefault();
            handleSearch();
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto pt-4 flex h-[calc(100vh-60px)] min-h-[500px] relative font-sans gap-0 md:gap-6 overflow-hidden md:overflow-visible">
            {/* Mobile Overlay Backdrop (Left) */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 dark:bg-black/60 z-[60] md:hidden backdrop-blur-sm"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Left Sidebar (GPT Style) - Collapsible */}
            <div
                className={cn(
                    'flex flex-col gap-2 shrink-0 transition-all duration-300 bg-white md:bg-transparent dark:bg-zinc-800 md:dark:bg-zinc-800 border-r md:border-r-0 border-slate-100 dark:border-zinc-700',
                    // Mobile: Fixed drawer
                    'fixed inset-y-0 left-0 z-[70] h-full shadow-2xl md:shadow-none',
                    // Desktop: Relative sidebar
                    'md:relative md:z-auto md:h-full md:inset-auto',
                    isSidebarOpen
                        ? 'translate-x-0 w-[280px] md:w-64 opacity-100'
                        : '-translate-x-full w-[280px] md:translate-x-0 md:w-0 md:opacity-0 md:overflow-hidden'
                )}
            >
                <div className="flex items-center justify-between mb-2 px-1">
                    <button
                        onClick={handleNewChat}
                        className="flex-1 flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-zinc-100 rounded-lg text-sm font-medium transition-colors border border-slate-200 dark:border-zinc-600 shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        {t('assistant.sidebar.newChat')}
                    </button>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                    >
                        <PanelLeftClose className="w-5 h-5" />
                    </button>
                </div>

                {/* History List */}
                <div className="flex-1 overflow-y-auto px-1 space-y-2 custom-scrollbar">
                    <div className="px-2 pb-2 text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                        {t('assistant.sidebar.recentChats')}
                    </div>
                    {isLoadingMessages && activeSessionId ? (
                        <div className="flex justify-center p-4">
                            <Sparkles className="w-5 h-5 text-orange-400 animate-spin" />
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="text-center py-6 text-slate-400 dark:text-zinc-500 text-sm">
                            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            {t('assistant.sidebar.noHistoryYet')}
                        </div>
                    ) : (
                        <AnimatePresence initial={false}>
                            {sessions.map((session) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    key={session.id}
                                    className="group relative"
                                >
                                    <button
                                        onClick={() => restoreSession(session)}
                                        className={cn(
                                            'w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all group text-left border relative',
                                            activeSessionId === session.id
                                                ? 'bg-white dark:bg-zinc-700 text-orange-600 dark:text-orange-400 font-medium shadow-sm border-orange-100 dark:border-zinc-600'
                                                : 'text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700/50 border-transparent hover:border-slate-100 dark:hover:border-zinc-600'
                                        )}
                                    >
                                        <MessageSquare
                                            className={cn(
                                                'w-4 h-4 shrink-0 transition-colors',
                                                activeSessionId === session.id
                                                    ? 'text-orange-400 dark:text-orange-400'
                                                    : 'text-slate-500 dark:text-zinc-500 group-hover:text-slate-500 dark:group-hover:text-zinc-400'
                                            )}
                                        />
                                        {editingSessionId === session.id ? (
                                            <input
                                                autoFocus
                                                value={editingTitle}
                                                onChange={(e) =>
                                                    setEditingTitle(
                                                        e.target.value
                                                    )
                                                }
                                                onBlur={handleConfirmRename}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter')
                                                        handleConfirmRename();
                                                    if (e.key === 'Escape')
                                                        setEditingSessionId(
                                                            null
                                                        );
                                                }}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                className="flex-1 bg-white border border-slate-200 dark:border-zinc-600 rounded px-1 py-0.5 text-sm text-slate-900 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-orange-400 min-w-0"
                                            />
                                        ) : (
                                            <span className="truncate flex-1 pr-12">
                                                {session.title}
                                            </span>
                                        )}
                                    </button>

                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all">
                                        <button
                                            onClick={(e) =>
                                                handleStartRename(session, e)
                                            }
                                            className="p-1 text-zinc-500 hover:text-blue-400 hover:bg-zinc-700 rounded"
                                            title={t(
                                                'assistant.sidebar.renameChat'
                                            )}
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={(e) =>
                                                handleDeleteSession(
                                                    session.id,
                                                    e
                                                )
                                            }
                                            className="p-1 text-zinc-500 hover:text-red-400 hover:bg-zinc-700 rounded"
                                            title={t(
                                                'assistant.sidebar.deleteChat'
                                            )}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col bg-white dark:bg-zinc-800 rounded-2xl border border-slate-200 dark:border-zinc-700 shadow-xl overflow-hidden relative">
                {viewMode === 'summary' ? (
                    isSummaryLoading ? (
                        <div className="flex-1 flex items-center justify-center p-8">
                            <div className="text-center space-y-4">
                                <div className="mx-auto h-16 w-16 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
                                <div>
                                    <h2 className="text-xl font-semibold text-zinc-100">
                                        {t('assistant.summaryLoading.title')}
                                    </h2>
                                    <p className="text-sm text-zinc-500 mt-2">
                                        {t(
                                            'assistant.summaryLoading.description'
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <AiDetailSummary
                            onBack={() => setViewMode('chat')}
                            data={
                                summaryData ?? {
                                    summaryCards: [],
                                    insight: {
                                        title: t(
                                            'assistant.summaryFallback.title'
                                        ),
                                        message: t(
                                            'assistant.summaryFallback.message'
                                        ),
                                        recommendation: t(
                                            'assistant.summaryFallback.recommendation'
                                        ),
                                    },
                                    sections: [],
                                }
                            }
                        />
                    )
                ) : viewMode === 'tools' ? (
                    <MarketingTools onBack={() => setViewMode('chat')} />
                ) : (
                    // Chat Interface
                    <>
                        {/* Chat Header */}
                        <div className="border-b border-slate-100 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-6 sticky top-0 z-10 shrink-0">
                            <div className="h-14 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {/* Mobile/Desktop Toggle */}
                                    {!isSidebarOpen && (
                                        <button
                                            onClick={() =>
                                                setIsSidebarOpen(true)
                                            }
                                            className="p-2 mr-2 bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-600 border border-slate-200 dark:border-zinc-600 rounded-lg shadow-sm transition-colors block"
                                            title={t(
                                                'assistant.sidebar.viewChatHistory'
                                            )}
                                        >
                                            <PanelLeft className="w-5 h-5 text-slate-600 dark:text-zinc-300" />
                                        </button>
                                    )}
                                    <div className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-700 shadow-sm border border-slate-200 dark:border-zinc-600 p-1.5 overflow-hidden shrink-0">
                                        <img
                                            src={chatbotImage}
                                            alt={t('assistant.imageAlt')}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <span className="font-semibold text-slate-800 dark:text-zinc-100">
                                        {t('assistant.header.title')}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-[10px] font-bold tracking-wide uppercase border border-orange-200 dark:border-orange-500/30">
                                        {t('assistant.header.beta')}
                                    </span>
                                </div>
                            </div>
                            <div className="pb-3">
                                <div className="flex flex-wrap items-center gap-2">
                                    {ROLE_OPTIONS.map((role) => (
                                        <button
                                            key={role.id}
                                            type="button"
                                            onClick={() =>
                                                setActiveRole(role.id)
                                            }
                                            className={cn(
                                                'px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors',
                                                activeRole === role.id
                                                    ? 'bg-orange-500 text-white border-orange-500'
                                                    : 'bg-white dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 border-slate-200 dark:border-zinc-600 hover:bg-slate-50 dark:hover:bg-zinc-600'
                                            )}
                                            aria-pressed={
                                                activeRole === role.id
                                            }
                                        >
                                            {t(role.labelKey)}
                                        </button>
                                    ))}
                                </div>
                                {!webhookUrl && (
                                    <div className="mt-2 text-[11px] text-slate-400 dark:text-zinc-500">
                                        {t('assistant.header.webhookMissing')}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 pr-2 pb-20 pt-4 custom-scrollbar scroll-smooth"
                        >
                            <div className="flex flex-col space-y-6 max-w-3xl mx-auto w-full">
                                {/* Empty State / Welcome Screen */}
                                <AnimatePresence>
                                    {messages.length === 0 &&
                                        query.trim() === '' && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{
                                                    opacity: 0,
                                                    scale: 0.95,
                                                    y: -10,
                                                }}
                                                transition={{
                                                    duration: 0.3,
                                                    ease: 'easeOut',
                                                }}
                                                className="flex flex-col items-center justify-center py-4 space-y-6 mt-2"
                                            >
                                                <div className="space-y-4 text-center">
                                                    <motion.div className="flex items-center justify-center gap-2 mb-4">
                                                        <div className="p-3 bg-slate-100 dark:bg-zinc-700 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-600">
                                                            <Sparkles className="w-8 h-8 text-orange-500 animate-pulse" />
                                                        </div>
                                                    </motion.div>
                                                    <motion.h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-zinc-100 tracking-tight">
                                                        {t(
                                                            'assistant.emptyState.title'
                                                        )}
                                                    </motion.h1>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mt-8">
                                                    {/* AI Detail Summary Button (Primary) */}
                                                    <motion.button
                                                        whileHover={{
                                                            scale: 1.02,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.98,
                                                        }}
                                                        onClick={() =>
                                                            setViewMode(
                                                                'summary'
                                                            )
                                                        }
                                                        className="relative overflow-hidden px-6 py-6 rounded-2xl text-left border-0 shadow-lg group h-full"
                                                    >
                                                        <motion.div
                                                            className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                                                            animate={{
                                                                backgroundPosition:
                                                                    [
                                                                        '0% 50%',
                                                                        '100% 50%',
                                                                        '0% 50%',
                                                                    ],
                                                            }}
                                                            transition={{
                                                                duration: 5,
                                                                repeat: Infinity,
                                                                ease: 'easeInOut',
                                                            }}
                                                            style={{
                                                                backgroundSize:
                                                                    '200% 200%',
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                                                        <div className="relative flex flex-col justify-between h-full z-10 gap-4">
                                                            <div className="p-3 bg-white/10 w-fit rounded-xl group-hover:bg-white/20 transition-colors backdrop-blur-sm">
                                                                <FileText className="w-6 h-6 text-white" />
                                                            </div>
                                                            <div>
                                                                <span className="text-lg font-bold text-white block mb-1">
                                                                    {t(
                                                                        'assistant.emptyState.detailSummaryTitle'
                                                                    )}
                                                                </span>
                                                                <span className="text-indigo-100/90 text-sm font-medium">
                                                                    {t(
                                                                        'assistant.emptyState.detailSummaryDescription'
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </motion.button>

                                                    {/* Campaign Tools Button (Secondary) */}
                                                    <motion.button
                                                        whileHover={{
                                                            scale: 1.02,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.98,
                                                        }}
                                                        onClick={() =>
                                                            setViewMode('tools')
                                                        }
                                                        className="relative px-6 py-6 rounded-2xl text-left border border-slate-200 dark:border-zinc-600 shadow-sm bg-white dark:bg-zinc-700 hover:border-slate-300 dark:hover:border-zinc-500 hover:shadow-md transition-all group h-full"
                                                    >
                                                        <div className="relative flex flex-col justify-between h-full gap-4">
                                                            <div className="p-3 bg-orange-50 dark:bg-orange-500/20 w-fit rounded-xl mb-2 group-hover:bg-orange-100 dark:group-hover:bg-orange-500/30 transition-colors">
                                                                <Calculator className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-lg font-bold text-slate-800 dark:text-zinc-100">
                                                                        {t(
                                                                            'assistant.emptyState.marketingCalculatorsTitle'
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <span className="text-slate-500 dark:text-zinc-400 text-sm font-medium">
                                                                    {t(
                                                                        'assistant.emptyState.marketingCalculatorsDescription'
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        )}
                                </AnimatePresence>

                                {/* Message List */}
                                <AnimatePresence initial={false}>
                                    {messages.map((msg, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{
                                                opacity: 0,
                                                y: 20,
                                                scale: 0.95,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                scale: 1,
                                            }}
                                            transition={{
                                                duration: 0.4,
                                                ease: 'easeOut',
                                            }}
                                            className={cn(
                                                'flex w-full items-start gap-4',
                                                msg.role === 'user'
                                                    ? 'justify-end'
                                                    : 'justify-start'
                                            )}
                                        >
                                            {msg.role === 'assistant' && (
                                                <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-zinc-700 border border-slate-200 dark:border-zinc-600 flex items-center justify-center shrink-0 mt-1 shadow-sm p-1.5 overflow-hidden">
                                                    <img
                                                        src={chatbotImage}
                                                        alt={t(
                                                            'assistant.imageAlt'
                                                        )}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                            )}

                                            <div
                                                className={cn(
                                                    'max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm',
                                                    msg.role === 'user'
                                                        ? 'bg-orange-500 text-white rounded-tr-md'
                                                        : 'bg-white dark:bg-zinc-700 border border-slate-200 dark:border-zinc-600 text-slate-700 dark:text-zinc-100 rounded-tl-md'
                                                )}
                                            >
                                                <div className="whitespace-pre-wrap font-normal">
                                                    {msg.content}
                                                </div>
                                            </div>

                                            {msg.role === 'user' && (
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-600 border border-slate-200 dark:border-zinc-500 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                                                    <User className="w-4 h-4 text-slate-500 dark:text-zinc-300" />
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {/* Thinking Indicator */}
                                <AnimatePresence>
                                    {isThinking && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="flex w-full items-start gap-4"
                                        >
                                            <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-zinc-700 border border-slate-200 dark:border-zinc-600 flex items-center justify-center shrink-0 mt-1 shadow-sm p-1.5 overflow-hidden">
                                                <img
                                                    src={chatbotImage}
                                                    alt={t(
                                                        'assistant.imageAlt'
                                                    )}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <div className="bg-white dark:bg-zinc-700 border border-slate-200 dark:border-zinc-600 rounded-2xl rounded-tl-md px-5 py-4 shadow-sm">
                                                <div className="flex gap-1.5">
                                                    <motion.div
                                                        animate={{
                                                            y: [0, -5, 0],
                                                        }}
                                                        transition={{
                                                            duration: 0.6,
                                                            repeat: Infinity,
                                                            delay: 0,
                                                        }}
                                                        className="w-1.5 h-1.5 bg-slate-400 dark:bg-zinc-400 rounded-full"
                                                    />
                                                    <motion.div
                                                        animate={{
                                                            y: [0, -5, 0],
                                                        }}
                                                        transition={{
                                                            duration: 0.6,
                                                            repeat: Infinity,
                                                            delay: 0.2,
                                                        }}
                                                        className="w-1.5 h-1.5 bg-slate-400 dark:bg-zinc-400 rounded-full"
                                                    />
                                                    <motion.div
                                                        animate={{
                                                            y: [0, -5, 0],
                                                        }}
                                                        transition={{
                                                            duration: 0.6,
                                                            repeat: Infinity,
                                                            delay: 0.4,
                                                        }}
                                                        className="w-1.5 h-1.5 bg-slate-400 dark:bg-zinc-400 rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Input Fixed at Bottom */}
                        <div className="p-4 bg-white dark:bg-zinc-800 border-t border-slate-100 dark:border-zinc-700 sticky bottom-0 z-10 transition-all">
                            <div className="relative group max-w-3xl mx-auto">
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-200/20 to-amber-200/20 dark:from-orange-500/10 dark:to-amber-500/10 rounded-[1.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative bg-white dark:bg-zinc-700 rounded-[1.5rem] shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 dark:border-zinc-600 p-1.5 flex items-center gap-2 pr-2">
                                    <div className="pl-1">
                                        <button
                                            type="button"
                                            onClick={handleNewChat}
                                            className="p-2 bg-slate-100 dark:bg-zinc-600 rounded-full text-slate-500 dark:text-zinc-400 hover:bg-orange-500 hover:text-white transition-colors duration-300 cursor-pointer hover:shadow-sm"
                                            title={t(
                                                'assistant.sidebar.newChat'
                                            )}
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <textarea
                                        ref={(el) => {
                                            if (el) {
                                                el.style.height = 'auto';
                                                el.style.height =
                                                    el.scrollHeight + 'px';
                                            }
                                        }}
                                        value={query}
                                        onChange={(e) => {
                                            setQuery(e.target.value);
                                            e.target.style.height = 'auto';
                                            e.target.style.height =
                                                e.target.scrollHeight + 'px';
                                        }}
                                        onKeyDown={handleKeyDown}
                                        placeholder={
                                            isListening
                                                ? t(
                                                      'assistant.input.listeningPlaceholder'
                                                  )
                                                : t(
                                                      'assistant.input.askPlaceholder'
                                                  )
                                        }
                                        className="flex-1 bg-transparent border-none outline-none text-base px-2 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 min-h-[44px] max-h-[200px] resize-none py-3 custom-scrollbar overflow-y-auto"
                                        disabled={isThinking}
                                        rows={1}
                                    />

                                    {/* Mic / Send Button */}
                                    {query.trim() ? (
                                        <button
                                            onClick={() => handleSearch()}
                                            disabled={isThinking}
                                            className="p-2 rounded-full transition-all duration-200 bg-orange-500 text-white hover:bg-orange-600 shadow-md transform hover:scale-105"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleVoiceInput}
                                            className={cn(
                                                'p-2 rounded-full transition-all duration-200',
                                                isListening
                                                    ? 'bg-red-100 dark:bg-red-500/20 text-red-500 dark:text-red-400 animate-pulse hover:bg-red-200 dark:hover:bg-red-500/30'
                                                    : 'bg-slate-100 dark:bg-zinc-600 text-slate-500 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-500 hover:text-slate-600 dark:hover:text-zinc-200'
                                            )}
                                            title={
                                                isListening
                                                    ? t(
                                                          'assistant.input.stopListening'
                                                      )
                                                    : t(
                                                          'assistant.input.startVoiceInput'
                                                      )
                                            }
                                        >
                                            {isListening ? (
                                                <StopCircle className="w-5 h-5" />
                                            ) : (
                                                <Mic className="w-5 h-5" />
                                            )}
                                        </button>
                                    )}
                                </div>
                                <div className="text-center mt-2 text-[10px] text-slate-400 dark:text-zinc-500/80 font-medium tracking-wide">
                                    {t('assistant.input.disclaimer')}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
