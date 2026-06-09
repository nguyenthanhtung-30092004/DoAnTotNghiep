import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, User as UserIcon, MessageCircle } from "lucide-react";
import { useSelector } from "react-redux";
import socket from "../../socket/socket";
import chatService from "../../services/chat.service";

const formatTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AdminChats() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const messagesEndRef = useRef(null);
  const conversationsRef = useRef([]);

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await chatService.getAdminConversations();
        if (Array.isArray(res)) {
          setConversations(res);
        } else if (res && res.metadata) {
          setConversations(res.metadata);
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách chat", err);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!activeConversation) return;
    const fetchMessages = async () => {
      try {
        const res = await chatService.getConversationMessages(
          activeConversation._id
        );
        if (Array.isArray(res)) {
          setMessages(res);
        } else if (res && res.metadata) {
          setMessages(res.metadata);
        }
      } catch (err) {
        console.error("Lỗi lấy tin nhắn", err);
      }
    };
    fetchMessages();
  }, [activeConversation]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join-chat", { role: "admin" });

    const handleReceiveMessage = (msg) => {
      const exists = conversationsRef.current.find(c => c._id === msg.conversationId);
      
      if (!exists) {
        // Nếu là đoạn chat mới hoàn toàn, load lại toàn bộ danh sách
        chatService.getAdminConversations().then((res) => {
          if (Array.isArray(res)) setConversations(res);
          else if (res && res.metadata) setConversations(res.metadata);
        });
      } else {
        // Cập nhật lastMessage cho đoạn chat hiện tại
        setConversations((prev) => {
          const newConvos = prev.map((c) => {
            if (c._id === msg.conversationId) {
              return {
                ...c,
                lastMessage: msg.text,
                lastMessageAt: new Date().toISOString(),
              };
            }
            return c;
          });
          return newConvos.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
        });
      }

      if (activeConversation && activeConversation._id === msg.conversationId) {
        setMessages((prev) => {
          if (prev.find((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [activeConversation]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeConversation) return;

    const text = inputValue.trim();
    setInputValue("");

    const userId =
      typeof activeConversation.userId === "object"
        ? activeConversation.userId?._id
        : activeConversation.userId;

    socket.emit("send-message", {
      conversationId: activeConversation._id,
      text,
      sender: "admin",
      userId,
      sessionId: activeConversation.sessionId,
    });
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-background overflow-hidden border border-border rounded-xl">
      {/* Sidebar - Conversations list */}
      <div className="w-1/3 border-r border-border bg-muted/20 flex flex-col">
        <div className="p-4 border-b border-border bg-background">
          <h2 className="font-bold text-lg">Danh sách hội thoại</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              Chưa có tin nhắn nào
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv._id}
                onClick={() => setActiveConversation(conv)}
                className={`p-4 border-b border-border cursor-pointer transition-colors ${activeConversation?._id === conv._id ? "bg-primary/10 border-l-4 border-l-primary" : "hover:bg-muted/50 border-l-4 border-l-transparent"}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-sm truncate pr-2">
                    {conv.userId ? conv.userId.fullName : "Khách vãng lai"}
                  </span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTime(conv.lastMessageAt)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {conv.lastMessage || "Chưa có tin nhắn"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main - Chat window */}
      <div className="flex-1 flex flex-col bg-background">
        {activeConversation ? (
          <>
            <div className="h-16 border-b border-border flex items-center px-6 shrink-0 bg-background">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                <UserIcon size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold">
                  {activeConversation.userId
                    ? activeConversation.userId.fullName
                    : "Khách vãng lai"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {activeConversation.userId
                    ? activeConversation.userId.email
                    : `ID: ${activeConversation.sessionId?.substring(0, 8)}`}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              {messages.map((msg, idx) => {
                const isUser = msg.sender === "user";
                const isAi = msg.sender === "ai";
                return (
                  <div
                    key={msg._id || idx}
                    className={`flex flex-col ${isUser ? "items-start" : "items-end"}`}
                  >
                    <div className="flex items-end gap-2 max-w-[70%]">
                      {isUser && (
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mb-1">
                          <UserIcon size={14} className="text-slate-600" />
                        </div>
                      )}

                      <div
                        className={`p-3 rounded-2xl text-sm whitespace-pre-wrap max-w-full ${
                          isUser
                            ? "bg-white border border-slate-200 rounded-bl-sm text-slate-800"
                            : isAi
                              ? "bg-emerald-50 border border-emerald-200 rounded-br-sm text-emerald-900"
                              : "bg-primary text-primary-foreground rounded-br-sm"
                        }`}
                      >
                        {msg.text}
                      </div>

                      {!isUser && isAi && (
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mb-1">
                          <Bot size={14} className="text-emerald-700" />
                        </div>
                      )}
                      {!isUser && !isAi && (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mb-1">
                          <span className="text-[10px] font-bold text-primary">
                            AD
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1 mx-10">
                      {formatTime(msg.createdAt)} {isAi && "• AI"}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSend}
              className="p-4 border-t border-border bg-background flex gap-3"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập tin nhắn trả lời thay cho AI..."
                className="flex-1 h-12 px-4 rounded-xl border border-input focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="h-12 px-6 bg-primary text-primary-foreground rounded-xl flex items-center gap-2 font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                <span>Gửi</span>
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <MessageCircle size={48} className="mb-4 text-slate-300" />
            <p>Chọn một cuộc hội thoại để bắt đầu chat</p>
          </div>
        )}
      </div>
    </div>
  );
}
