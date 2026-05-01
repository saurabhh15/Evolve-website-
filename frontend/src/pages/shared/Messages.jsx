import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { messageAPI, connectionAPI } from '../../services/api';
import { initSocket, getSocket } from '../../services/socket';
import { Send, MessageCircle, ArrowLeft, X, Search } from 'lucide-react';

const Messages = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [convsLoading, setConvsLoading] = useState(true);
    const [msgsLoading, setMsgsLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const [showNewMessage, setShowNewMessage] = useState(false);
    const [newMessageSearch, setNewMessageSearch] = useState('');
    const [networkUsers, setNetworkUsers] = useState([]);
    const [networkLoading, setNetworkLoading] = useState(false);
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const messagesContainerRef = useRef(null);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchConversations = async () => {
        try {
            setConvsLoading(true);
            const response = await messageAPI.getConversations();
            setConversations(response.data);
        } catch (err) {
            console.error('Failed to fetch conversations:', err);
        } finally {
            setConvsLoading(false);
        }
    };

    const openConversation = async (conv) => {
        setSelectedConv(conv);
        setShowScrollBtn(false);
        setMsgsLoading(true);

        // Show last message immediately while loading
        if (conv.lastMessage) {
            setMessages([conv.lastMessage]);
        }

        try {
            const response = await messageAPI.getConversation(conv.user._id);
            setMessages(response.data);
           
            setTimeout(() => {
                const container = messagesContainerRef.current;
                if (!container) return;
                const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
                setShowScrollBtn(distanceFromBottom > 100);
                scrollToBottom('instant');
            }, 150);
            await messageAPI.markConversationAsRead(conv.user._id);
            setConversations(prev =>
                prev.map(c => c.user._id === conv.user._id ? { ...c, unreadCount: 0 } : c)
            );
        } catch (err) {
            console.error('Failed to fetch messages:', err);
        } finally {
            setMsgsLoading(false);
        }
    };


    const handleScroll = () => {
        const container = messagesContainerRef.current;
        if (!container) return;

        const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
        setShowScrollBtn(distanceFromBottom > 100);
    };

    const scrollToBottom = (behavior = 'smooth') => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    const handleSend = async () => {
        if (!messageInput.trim() || sending || !selectedConv) return;
        setSending(true);

        const socket = getSocket();

        try {
            // Emit via socket
            socket.emit('send_message', {
                recipientId: selectedConv.user._id,
                content: messageInput.trim()
            });

            setMessageInput('');

            // Stop typing
            socket.emit('stop_typing', { recipientId: selectedConv.user._id });

            // Update conversations last message optimistically
            setConversations(prev =>
                prev.map(c => c.user._id === selectedConv.user._id
                    ? { ...c, lastMessage: { content: messageInput.trim(), createdAt: new Date() } }
                    : c
                )
            );
        } catch (err) {
            console.error('Failed to send message:', err);
        } finally {
            setSending(false);
        }
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };


    useEffect(() => {
        if (messages.length === 0) return;
        setTimeout(() => scrollToBottom('instant'), 100);
    }, [messages.length, selectedConv]);

    const fetchNetwork = async () => {
        try {
            setNetworkLoading(true);
            const response = await connectionAPI.getNetwork();
            setNetworkUsers(response.data);
        } catch (err) {
            console.error('Failed to fetch network:', err);
        } finally {
            setNetworkLoading(false);
        }
    };

    useEffect(() => {
        // Dispatch event to clear unread messages in navbar
        window.dispatchEvent(new CustomEvent('clearUnreadMessages'));
    }, []);
    // ── Initialize Socket ──
    useEffect(() => {
        const token = localStorage.getItem('token');
        const socket = initSocket(token);

        // Receive new message
        socket.on('message_received', (message) => {
            // If conversation is open with this sender, add message
            setSelectedConv(prev => {
                if (prev?.user._id === message.sender._id) {
                    setMessages(msgs => [...msgs, message]);
                }
                return prev;
            });

            // Update conversations list
            setConversations(prev => {
                const exists = prev.find(c => c.user._id === message.sender._id);
                if (exists) {
                    return prev.map(c =>
                        c.user._id === message.sender._id
                            ? { ...c, lastMessage: message, unreadCount: (c.unreadCount || 0) + 1 }
                            : c
                    );
                }
                // New conversation
                return [{
                    user: message.sender,
                    lastMessage: message,
                    unreadCount: 1
                }, ...prev];
            });
        });

        // Message sent confirmation
        socket.on('message_sent', (message) => {
            setMessages(prev => {
                // Avoid duplicates
                const exists = prev.find(m => m._id === message._id);
                if (exists) return prev;
                return [...prev, message];
            });
        });

        // Typing indicators
        socket.on('user_typing', ({ userId }) => {
            setSelectedConv(prev => {
                if (prev?.user._id === userId) setIsTyping(true);
                return prev;
            });
        });

        socket.on('user_stop_typing', ({ userId }) => {
            setSelectedConv(prev => {
                if (prev?.user._id === userId) setIsTyping(false);
                return prev;
            });
        });

        return () => {
            socket.off('message_received');
            socket.off('message_sent');
            socket.off('user_typing');
            socket.off('user_stop_typing');
        };
    }, []);

    return (
        <div className="w-full px-4 md:px-8 pb-10">
            <div className="h-[calc(100vh-12rem)] bg-[#0a0a0a] border border-white/[0.04] rounded-[2rem] overflow-hidden flex">

                {/* ── Left: Communications Registry ── */}
                <div className={`w-full md:w-80 flex-shrink-0 border-r border-white/5 flex flex-col bg-[#080808] ${selectedConv ? 'hidden md:flex' : 'flex'}`}>

                    {/* Header: Registry Metadata */}
                    <div className="px-6 py-6 border-b border-white/5 flex items-center justify-between relative overflow-hidden">
                        {/* Subtle Background Technical Grid */}
                        <div className="absolute inset-0 bg-[radial-gradient(#e87315_1px,transparent_1px)] bg-[size:20px_20px] opacity-[0.03] pointer-events-none" />

                        <div className="relative z-10">
                            <h2 className="text-xl font-black text-white tracking-tighter uppercase italic">Inbox</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-2 h-2 bg-[#e87315] animate-pulse" />
                                <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-black">
                                    {conversations.length} Active Conversation{conversations.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => { setShowNewMessage(true); fetchNetwork(); }}
                            className="group relative flex items-center justify-center w-10 h-10 border border-white/10 hover:border-[#e87315] bg-transparent transition-all duration-500 overflow-hidden"
                        >
                            {/* ── Hover Glow Background ── */}
                            <div className="absolute inset-0 bg-[#e87315]/0 group-hover:bg-[#e87315]/5 transition-colors duration-500" />

                            {/* ── Animated Corner Brackets (Appear on Hover) ── */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#e87315] opacity-0 group-hover:opacity-100 -translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#e87315] opacity-0 group-hover:opacity-100 translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />

                            {/* ── The Icon ── */}
                            <Send
                                size={16}
                                strokeWidth={2.5}
                                className="relative z-10 text-white/40 group-hover:text-[#e87315] group-hover:-rotate-12 transition-all duration-500"
                            />

                            {/* ── Technical Scan Line ── */}
                            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#e87315] group-hover:w-full transition-all duration-700" />
                        </button>
                    </div>

                    {/* Conversations List: Signal Feed */}
                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        {convsLoading ? (
                            <div className="p-4 space-y-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-20 border border-white/5 bg-white/[0.01] relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-[shimmer_2s_infinite]" />
                                    </div>
                                ))}
                            </div>
                        ) : conversations.length > 0 ? conversations.map((conv) => (
                            <div
                                key={conv.user._id}
                                onClick={() => openConversation(conv)}
                                className={`relative flex items-center gap-4 px-5 py-5 cursor-pointer transition-all border-b border-white/[0.03] group ${selectedConv?.user._id === conv.user._id
                                    ? 'bg-[#e87315]/5'
                                    : 'hover:bg-white/[0.02]'
                                    }`}
                            >
                                {/* Active Selection Indicator Bar */}
                                <div className={`absolute left-0 top-0 w-[3px] h-full transition-all duration-500 ${selectedConv?.user._id === conv.user._id ? 'bg-[#e87315]' : 'bg-transparent group-hover:bg-white/10'
                                    }`} />

                                <div className="relative flex-shrink-0">
                                    <img
                                        src={conv.user?.profileImage}
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?background=111111&color=e87315&size=100&name=${conv.user?.name}&bold=true`;
                                        }}
                                        className={`w-12 h-12 object-cover transition-all duration-500 ${selectedConv?.user._id === conv.user._id ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'
                                            }`}
                                        alt={conv.user?.name}
                                    />
                                    {conv.unreadCount > 0 && (
                                        <div className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-[#e87315] flex items-center justify-center">
                                            <span className="text-[8px] font-black text-black">{conv.unreadCount}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className={`text-[11px] font-black uppercase tracking-widest truncate italic transition-colors ${conv.unreadCount > 0 || selectedConv?.user._id === conv.user._id ? 'text-white' : 'text-white/40'
                                            }`}>
                                            {conv.user?.name}
                                        </p>
                                        <span className="text-[8px] font-bold text-white/10 uppercase tracking-tighter tabular-nums">
                                            {formatDate(conv.lastMessage?.createdAt)}
                                        </span>
                                    </div>
                                    <p className={`text-[10px] truncate uppercase tracking-tight leading-none ${conv.unreadCount > 0 ? 'text-[#e87315] font-black' : 'text-white/20'
                                        }`}>
                                        {/* {conv.lastMessage?.sender?._id === user?._id ? <span className="opacity-40">[Send] </span> : <span className="opacity-40">[Recieved] </span>} */}
                                        {conv.lastMessage?.content}
                                    </p>
                                </div>
                            </div>
                        )) : (
                            /* Empty State: System Null */
                            <div className="flex flex-col items-center justify-center h-full py-20 text-center px-8 relative overflow-hidden">
                                <div className="relative mb-6">
                                    <div className="w-16 h-16 bg-white/[0.02] border border-white/10 flex items-center justify-center relative">
                                        <MessageCircle size={24} className="text-[#e87315] opacity-40" strokeWidth={1.5} />
                                        {/* Corner Brackets */}
                                        <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-[#e87315]" />
                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-[#e87315]" />
                                    </div>
                                </div>
                                <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic mb-2">No Message</p>
                                <p className="text-[9px] text-white/20 uppercase tracking-widest leading-loose">
                                    Start new chat.
                                </p>
                            </div>
                        )}
                    </div>
                </div>



                {/* ── Right: Conversation Terminal ── */}
                <div className={`flex-1 flex flex-col bg-[#0A0A0A] relative  ${selectedConv ? 'flex' : 'hidden md:flex'}`}>
                    {selectedConv ? (
                        <>
                            {/* ── Technical Header ── */}
                            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between relative">
                                <div className="flex items-center gap-5">
                                    <button
                                        onClick={() => setSelectedConv(null)}
                                        className="md:hidden p-2 border border-white/10 hover:bg-white/5 transition-colors"
                                    >
                                        <ArrowLeft size={16} className="text-[#e87315]" />
                                    </button>

                                    <div className="relative">
                                        <img
                                            src={selectedConv.user?.profileImage}
                                            onError={(e) => {
                                                e.target.src = `https://ui-avatars.com/api/?background=111111&color=e87315&size=100&name=${encodeURIComponent(selectedConv.user?.name || 'U')}&bold=true`;
                                            }}
                                            className="w-12 h-12 object-cover border border-white/10 grayscale group-hover:grayscale-0 transition-all"
                                            alt={selectedConv.user?.name}
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#0A0A0A]" />
                                    </div>

                                    <div className="space-y-0.5">
                                        <p className="text-sm font-black text-white uppercase tracking-widest italic leading-none">
                                            {selectedConv.user?.name}
                                        </p>
                                        <p className="text-[9px] text-[#e87315] font-black uppercase tracking-[0.3em] opacity-70">
                                            {selectedConv.user?.role}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* ── Message Stream ── */}
                            <div
                                ref={messagesContainerRef}
                                onScroll={handleScroll}
                                className="flex-1 overflow-y-auto px-8 py-8 space-y-8 scrollbar-hide"
                                style={{ overscrollBehavior: 'contain', backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.01) 1px, transparent 1px)', backgroundSize: '30px 30px' }}
                                onWheel={e => e.stopPropagation()}
                            >
                                {msgsLoading ? (
                                    <div className="space-y-6">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                                                <div className="h-12 w-64 bg-white/[0.02] border border-white/5 animate-pulse" />
                                            </div>
                                        ))}
                                    </div>
                                ) : messages.length > 0 ? messages.map((msg, index) => {
                                    const isOwn = msg.sender?._id === user?._id || msg.sender === user?._id;
                                    const showDate = index === 0 || formatDate(msg.createdAt) !== formatDate(messages[index - 1]?.createdAt);

                                    return (
                                        <React.Fragment key={msg._id}>
                                            {showDate && (
                                                <div className="flex items-center gap-4 py-4">
                                                    <div className="h-[1px] flex-1 bg-white/5" />
                                                    <span className="text-[9px] text-white/20 font-black uppercase tracking-[0.4em]">
                                                        Logged: {formatDate(msg.createdAt)}
                                                    </span>
                                                    <div className="h-[1px] flex-1 bg-white/5" />
                                                </div>
                                            )}

                                            <div className={`flex items-start gap-4 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                                                {!isOwn && (
                                                    <img
                                                        src={
                                                            selectedConv.user?.profileImage &&
                                                                !selectedConv.user.profileImage.includes('placeholder')
                                                                ? selectedConv.user.profileImage
                                                                : `https://ui-avatars.com/api/?background=111111&color=e87315&size=100&name=${encodeURIComponent(selectedConv.user?.name || 'U')}&bold=true`
                                                        }
                                                        onError={(e) => {
                                                            e.target.src = `https://ui-avatars.com/api/?background=111111&color=e87315&size=100&name=${encodeURIComponent(selectedConv.user?.name || 'U')}&bold=true`;
                                                        }}
                                                        className="w-12 h-12 rounded-xl object-cover border border-white/10 grayscale group-hover:grayscale-0 transition-all"
                                                        alt={selectedConv.user?.name}
                                                    />
                                                )}

                                                <div className={`flex flex-col gap-2 max-w-[75%] ${isOwn ? 'items-end' : 'items-start'}`}>
                                                    <div className={`px-5 py-4 text-xs font-medium leading-relaxed border transition-all duration-300 ${isOwn
                                                        ? 'bg-white text-black border-white shadow-[8px_8px_0px_rgba(232,115,21,0.2)] hover:shadow-none'
                                                        : 'bg-[#111] text-white border-white/10 italic'
                                                        }`}>
                                                        {msg.content}
                                                    </div>
                                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest tabular-nums">
                                                        {isOwn ? 'SENT' : 'RCVD'} {formatTime(msg.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                }) : (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.5em] italic">Waiting for New Messages</p>
                                    </div>
                                )}
                                {isTyping && (
                                    <div className="flex items-center gap-3 px-2">
                                        <img
                                            src={selectedConv.user?.profileImage}
                                            onError={(e) => {
                                                e.target.src = `https://ui-avatars.com/api/?background=111111&color=e87315&size=100&name=${encodeURIComponent(selectedConv.user?.name || 'U')}&bold=true`;
                                            }}
                                            className="w-8 h-8 object-cover border border-white/10"
                                            alt=""
                                        />
                                        <div className="flex items-center gap-1 px-4 py-3 bg-[#111] border border-white/10">
                                            <div className="w-1 h-1 bg-[#e87315] animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-1 h-1 bg-[#e87315] animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-1 h-1 bg-[#e87315] animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* ── Input Module ── */}
                            <div className="p-8 border-t border-white/5 bg-white/[0.01]">
                                <div className="flex items-stretch gap-0 border border-white/10 focus-within:border-[#e87315]/50 transition-all bg-black">
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={e => {
                                            setMessageInput(e.target.value);

                                            const socket = getSocket();
                                            if (!socket || !selectedConv) return;

                                            socket.emit('typing', { recipientId: selectedConv.user._id });

                                            clearTimeout(typingTimeoutRef.current);
                                            typingTimeoutRef.current = setTimeout(() => {
                                                socket.emit('stop_typing', { recipientId: selectedConv.user._id });
                                            }, 2000);
                                        }}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSend();
                                            }
                                        }}
                                        placeholder={`SEND MESSAGE TO ${selectedConv.user?.name.toUpperCase()}...`}
                                        className="flex-1 px-6 py-5 bg-transparent text-white text-[11px] font-bold uppercase tracking-widest focus:outline-none placeholder:text-white/10"
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={sending || !messageInput.trim()}
                                        className="relative px-10 bg-transparent group/send overflow-hidden transition-all duration-300 disabled:opacity-20 border-l border-white/10"
                                    >
                                        {/* ── Background Power-Up State ── */}
                                        <div className="absolute inset-0 bg-[#e87315] translate-y-full group-hover/send:translate-y-0 transition-transform duration-500 ease-out" />

                                        {/* ── Content ── */}
                                        <div className="relative z-10 flex items-center justify-center">
                                            {sending ? (
                                                /* Mechanical Loader */
                                                <div className="flex gap-1 items-center">
                                                    <div className="w-1 h-4 bg-black animate-[bounce_1s_infinite_0ms]" />
                                                    <div className="w-1 h-4 bg-black animate-[bounce_1s_infinite_200ms]" />
                                                    <div className="w-1 h-4 bg-black animate-[bounce_1s_infinite_400ms]" />
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <Send
                                                        size={18}
                                                        strokeWidth={1}
                                                        className="text-[#e87315] group-hover/send:text-black group-hover/send:-rotate-12 transition-all duration-500"
                                                    />
                                                    <span className="text-[10px] font-black tracking-[0.2em] text-white group-hover/send:text-black hidden md:block uppercase italic">
                                                        Send
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* ── Structural Corner Accents ── */}
                                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-hover/send:border-black/40 transition-colors" />
                                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 group-hover/send:border-black/40 transition-colors" />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* ── Null State: No Node Selected ── */
                        <div className="flex-1 flex flex-col items-center justify-center text-center px-12 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

                            <div className="relative mb-10 group">
                                <div className="w-24 h-24 bg-transparent border border-[#e87315]/20 flex items-center justify-center relative transition-all duration-700 group-hover:border-[#e87315]">
                                    <MessageCircle size={40} className="text-[#e87315] opacity-20 group-hover:opacity-100 transition-opacity" />
                                    {/* Architectural Brackets */}
                                    <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-[#e87315]" />
                                    <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-[#e87315]" />
                                </div>
                            </div>

                            <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter italic">Your Messages</h3>
                            <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] max-w-xs leading-loose">
                                Select a conversation from the left to start messaging, or connect with someone to begin a new chat.
                            </p>
                        </div>
                    )}
                    {showScrollBtn && (
                        <button
                            onClick={() => scrollToBottom('smooth')}
                            className="absolute bottom-33 right-10 z-10 flex items-center gap-2 px-4 py-2.5 bg-[#e87315] hover:bg-[#f97316] text-black text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path d="M12 5v14M5 12l7 7 7-7" />
                            </svg>
                            Latest
                        </button>
                    )}
                </div>
            </div>
            {showNewMessage && (
                <div
                    className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all duration-500"
                    onClick={() => setShowNewMessage(false)}
                >
                    <div
                        className="bg-[#080808] border border-white/10 w-full max-w-sm max-h-[70vh] flex flex-col relative"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* ── Technical Brackets ── */}
                        <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-[#e87315]" />
                        <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-[#e87315]" />

                        {/* Header: Action Identity */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/[0.01]">
                            <div>
                                <h3 className="text-[11px] font-black text-[#e87315] uppercase tracking-[0.4em] italic">New Chat</h3>
                                <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold mt-0.5">New Connection Stream</p>
                            </div>
                            <button
                                onClick={() => setShowNewMessage(false)}
                                className="p-2 border border-white/5 hover:border-white/20 hover:bg-white/5 text-white/40 hover:text-white transition-all"
                            >
                                <X size={14} strokeWidth={3} />
                            </button>
                        </div>

                        {/* Search: Query Input */}
                        <div className="px-6 py-4 bg-black/50 relative">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#e87315]/40" />
                            <input
                                type="text"
                                placeholder="SEARCH"
                                value={newMessageSearch}
                                onChange={e => setNewMessageSearch(e.target.value)}
                                className="w-full pl-4 pr-4 py-3 bg-transparent border-b border-white/10 focus:border-[#e87315] text-white text-[10px] font-black uppercase tracking-[0.2em] focus:outline-none transition-all placeholder:text-white/10"
                            />
                        </div>

                        {/* Connections List: Node Registry */}
                        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 scrollbar-hide">
                            {networkLoading ? (
                                <div className="space-y-3 px-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-14 border border-white/5 bg-white/[0.01] animate-pulse relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
                                        </div>
                                    ))}
                                </div>
                            ) : networkUsers
                                .filter(u => u.name?.toLowerCase().includes(newMessageSearch.toLowerCase()))
                                .length > 0 ? networkUsers
                                    .filter(u => u.name?.toLowerCase().includes(newMessageSearch.toLowerCase()))
                                    .map(netUser => (
                                        <div
                                            key={netUser._id}
                                            onClick={() => {
                                                setShowNewMessage(false);
                                                setNewMessageSearch('');
                                                const existingConv = conversations.find(c => c.user._id === netUser._id);
                                                if (existingConv) {
                                                    openConversation(existingConv);
                                                } else {
                                                    setSelectedConv({ user: netUser, lastMessage: null, unreadCount: 0 });
                                                    setMessages([]);
                                                }
                                            }}
                                            className="flex items-center gap-4 p-4 border border-transparent hover:border-white/10 hover:bg-white/[0.02] cursor-pointer transition-all group relative overflow-hidden"
                                        >
                                            {/* Hover Accent */}
                                            <div className="absolute left-0 top-0 w-1 h-0 group-hover:h-full bg-[#e87315] transition-all duration-300" />

                                            <img
                                                src={netUser.profileImage}
                                                onError={(e) => {
                                                    e.target.src = `https://ui-avatars.com/api/?background=111111&color=e87315&size=100&name=${netUser.name}&bold=true`;
                                                }}
                                                className="w-10 h-10 object-cover border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-500"
                                                alt={netUser.name}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[11px] font-black text-white/60 group-hover:text-white uppercase tracking-widest transition-colors truncate">
                                                    {netUser.name}
                                                </p>
                                                <p className="text-[8px] text-[#e87315]/40 group-hover:text-[#e87315] font-bold uppercase tracking-[0.2em] transition-colors truncate">
                                                    {netUser.role || 'Member'}
                                                </p>
                                            </div>
                                        </div>
                                    )) : (
                                /* Empty State: Null Result */
                                <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                                    <div className="w-10 h-10 border border-white/5 flex items-center justify-center mb-4 opacity-20">
                                        <Search size={16} className="text-white" />
                                    </div>
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">
                                        {newMessageSearch ? 'No node matches' : 'Registry empty'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Messages;