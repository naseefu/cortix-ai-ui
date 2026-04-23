import { create } from 'zustand';
import { chatApi } from '@/lib/api';

export interface Message {
  role: 'user' | 'ai';
  content: string;
}

export interface SessionItem {
  chatId: string;
  chat_name: string;
}

interface ChatState {
  sessions: SessionItem[];
  activeChatId: string | null;
  activeMessages: Message[];
  activeDocument: string | null;
  documents: string[];
  isTyping: boolean;
  selectedModel: string | null;

  // Actions
  createNewChat: () => void;
  loadSessions: () => Promise<void>;
  loadChatHistory: (chatId: string) => Promise<void>;
  addMessage: (message: Message) => void;
  setDocumentForChat: (documentName: string | null) => void;
  addDocument: (documentName: string) => void;
  setDocuments: (documents: string[]) => void;
  setActiveChatId: (chatId: string) => void;
  setIsTyping: (isTyping: boolean) => void;
  setSelectedModel: (model: string | null) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  sessions: [],
  activeChatId: null,
  activeMessages: [],
  activeDocument: null,
  documents: [],
  isTyping: false,
  selectedModel: null,

  createNewChat: () => {
    set({
      activeChatId: null,
      activeMessages: [],
      activeDocument: null,
    });
  },

  loadSessions: async () => {
    try {
      const res = await chatApi.getSessions();
      if (res?.sessions) {
        set({ sessions: res.sessions });
      }
    } catch (error) {
      console.error("Failed to load sessions", error);
    }
  },

  loadChatHistory: async (chatId) => {
    try {
      const res = await chatApi.getChatHistory(chatId);
      set({
        activeChatId: chatId,
        activeMessages: res.history || [],
      });
    } catch (error) {
      console.error("Failed to load chat history", error);
    }
  },

  setActiveChatId: (chatId) => {
    set({ activeChatId: chatId });
  },

  addMessage: (message) =>
    set((state) => ({
      activeMessages: [...state.activeMessages, message],
    })),

  setDocumentForChat: (documentName) =>
    set({ activeDocument: documentName }),

  setDocuments: (docs) => set({ documents: docs }),

  setIsTyping: (status) => set({ isTyping: status }),

  setSelectedModel: (model) => set({ selectedModel: model }),

  addDocument: (documentName) =>
    set((state) => {
      if (state.documents.includes(documentName)) return state;
      return { documents: [...state.documents, documentName] };
    }),
}));

