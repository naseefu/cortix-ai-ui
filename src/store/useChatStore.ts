import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface Message {
  role: 'user' | 'ai';
  content: string;
}

export interface ChatSession {
  chatId: string;
  messages: Message[];
  selectedDocument: string | null;
  title: string;
  createdAt: number;
}

interface ChatState {
  chats: ChatSession[];
  activeChatId: string | null;
  documents: string[];

  // Actions
  createNewChat: () => void;
  setActiveChat: (chatId: string) => void;
  addMessage: (chatId: string, message: Message) => void;
  setDocumentForChat: (chatId: string, documentName: string | null) => void;
  addDocument: (documentName: string) => void;
  deleteChat: (chatId: string) => void;
  updateChatTitle: (chatId: string, title: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  activeChatId: null,
  documents: [],

  createNewChat: () => {
    const newChat: ChatSession = {
      chatId: uuidv4(),
      messages: [],
      selectedDocument: null,
      title: 'New Chat',
      createdAt: Date.now(),
    };

    set((state) => ({
      chats: [newChat, ...state.chats],
      activeChatId: newChat.chatId,
    }));
  },

  setActiveChat: (chatId) => set({ activeChatId: chatId }),

  addMessage: (chatId, message) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.chatId === chatId
          ? {
              ...chat,
              messages: [...chat.messages, message],
              // Auto-generate title from first user message if it's currently "New Chat"
              title:
                chat.messages.length === 0 && message.role === 'user'
                  ? message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
                  : chat.title,
            }
          : chat
      ),
    })),

  setDocumentForChat: (chatId, documentName) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.chatId === chatId ? { ...chat, selectedDocument: documentName } : chat
      ),
    })),

  addDocument: (documentName) =>
    set((state) => {
      // Avoid duplicate documents
      if (state.documents.includes(documentName)) return state;
      return { documents: [...state.documents, documentName] };
    }),

  deleteChat: (chatId) =>
    set((state) => {
      const remainingChats = state.chats.filter((c) => c.chatId !== chatId);
      let nextActiveId = state.activeChatId;
      if (state.activeChatId === chatId) {
        nextActiveId = remainingChats.length > 0 ? remainingChats[0].chatId : null;
      }
      return {
        chats: remainingChats,
        activeChatId: nextActiveId,
      };
    }),

  updateChatTitle: (chatId, title) =>
    set((state) => ({
      chats: state.chats.map((c) => (c.chatId === chatId ? { ...c, title } : c)),
    })),
}));
