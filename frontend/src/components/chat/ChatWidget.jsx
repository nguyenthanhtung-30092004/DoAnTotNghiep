import React, { useState, useEffect, useRef } from "react";
import { X, Send, Bot, Minimize2, MessageCircle } from "lucide-react";
import { useSelector } from "react-redux";
import socket from "../../socket/socket";
import chatService from "../../services/chat.service";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    let sessionId = localStorage.getItem("chatSessionId");
    if (!sessionId && !user) {
      sessionId = "guest_" + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("chatSessionId", sessionId);
    }

    const initChat = async () => {
      try {
        const res = await chatService.getMyChat(sessionId);
        if (res && res.conversation) {
          setConversationId(res.conversation._id);
          setMessages(res.messages || []);
        }
      } catch (error) {
        console.error("Failed to load chat", error);
      }
    };

    if (isOpen && !conversationId) {
      initChat();
    }
  }, [isOpen, user, conversationId]);

  useEffect(() => {
    if (!conversationId) return;

    if (!socket.connected) {
      socket.connect();
    }

    const sessionId = localStorage.getItem("chatSessionId");
    const userId = user ? user._id || user.id : null;

    socket.emit("join-chat", {
      userId,
      sessionId,
      role: "user",
      conversationId,
    });

    const handleReceiveMessage = (msg) => {
      setMessages((prev) => {
        if (prev.find((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
      if (msg.sender === "ai" || msg.sender === "admin") {
        setIsTyping(false);
      }
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [conversationId, user]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !conversationId) return;

    const text = inputValue.trim();
    setInputValue("");
    setIsTyping(true);

    const sessionId = localStorage.getItem("chatSessionId");
    const userId = user ? user._id || user.id : null;

    socket.emit("send-message", {
      conversationId,
      text,
      sender: "user",
      userId,
      sessionId,
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 hover:scale-105 transition-all z-50"
      >
        <MessageCircle size={28} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-[350px] h-[500px] bg-background border border-border rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-4 fade-in">
      <div className="h-16 bg-primary text-primary-foreground flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-none mb-1">
              RunVault Hỗ Trợ
            </h3>
            <p className="text-[11px] text-primary-foreground/80 leading-none">
              AI Assistant
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <Minimize2 size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
        <div className="flex flex-col items-center justify-center pt-4 pb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
            <Bot size={32} className="text-primary" />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Xin chào! Tôi có thể giúp gì cho bạn hôm nay?
          </p>
        </div>

        {messages.map((msg, idx) => {
          const isMe = msg.sender === "user";
          return (
            <div
              key={msg._id || idx}
              className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}
            >
              {!isMe && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <Bot size={16} className="text-primary" />
                </div>
              )}
              <div
                className={`max-w-[75%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${isMe ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-card border border-border rounded-tl-sm text-foreground"}`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Bot size={16} className="text-primary" />
            </div>
            <div className="bg-card border border-border p-3 rounded-2xl rounded-tl-sm flex items-center gap-1 w-16">
              <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></span>
              <span
                className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></span>
              <span
                className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="p-3 bg-background border-t border-border flex items-center gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className="flex-1 h-10 px-4 rounded-full bg-muted border-transparent focus:outline-none focus:ring-1 focus:ring-primary text-sm"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary transition-colors shrink-0"
        >
          <Send size={18} className="ml-1" />
        </button>
      </form>
    </div>
  );
}
