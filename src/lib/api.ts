import axios from 'axios';

export const chatApi = {
  /**
   * Real implementation of `/api/v1/chat/chat-with-ai`
   */
  async sendMessage(payload: {
    chatId: string | null;
    message: string;
    documentName: string | null;
    model?: string;
    file?: File | Blob;
  }) {
    if (payload.file) {
      const formData = new FormData();
      formData.append('message', payload.message || '');
      formData.append('documentId', payload.documentName || '');
      if (payload.chatId) formData.append('chatId', payload.chatId);
      if (payload.model) formData.append('model', payload.model);
      formData.append('file', payload.file, 'voice.webm');

      const response = await axios.post(`http://localhost:8080/api/v1/chat/chat-with-ai`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return {
        status: 'success',
        data: {
          role: 'ai',
          content: typeof response.data === 'string'
            ? response.data
            : response.data?.answer || response.data?.content || JSON.stringify(response.data),
          chatId: response.data?.chatId,
        },
      };
    }

    const body: any = {
      message: payload.message,
      documentId: payload.documentName || '',
    };

    if (payload.chatId)  body.chatId = payload.chatId;
    if (payload.model)   body.model  = payload.model;

    const response = await axios.post(`http://localhost:8080/api/v1/chat/chat-with-ai`, body);

    return {
      status: 'success',
      data: {
        role: 'ai',
        content: typeof response.data === 'string'
          ? response.data
          : response.data?.answer || response.data?.content || JSON.stringify(response.data),
        chatId: response.data?.chatId,
      },
    };
  },

  /**
   * Real implementation of `/api/v1/store/upload`
   */
  async uploadFile(payload: { file: File; chatId: string | null }) {
    const formData = new FormData();
    formData.append('file', payload.file);
    // Passing chatId to upload if backend requires it, or just file
    if (payload.chatId) {
      formData.append('chatId', payload.chatId);
    }

    const response = await axios.post(`http://localhost:8080/api/v1/store/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      status: 'success',
      data: {
        filename: response.data?.filename || payload.file.name,
        chatId: response.data?.chatId,
        chat_name: response.data?.chat_name
      },
    };
  },

  /**
   * Fetch all documents
   */
  async getDocuments() {
    const response = await axios.get(`http://localhost:8080/api/v1/store/documents`);
    return response.data;
  },

  /**
   * Delete a document
   */
  async deleteDocument(docid: string) {
    const response = await axios.delete(`http://localhost:8080/api/v1/store/documents/${docid}`);
    return response.data;
  },

  /**
   * Fetch all active sessions
   */
  async getSessions() {
    const response = await axios.get(`http://localhost:8080/api/v1/chat/sessions`);
    return response.data;
  },

  /**
   * Fetch specific chat history
   */
  async getChatHistory(chatId: string) {
    const response = await axios.get(`http://localhost:8080/api/v1/chat/history/${chatId}`);
    return response.data;
  },

  /**
   * Fetch FAQ analytics (most asked questions with counts)
   */
  async getFaqAnalytics() {
    const response = await axios.get(`http://localhost:8080/api/v1/analytics/faq/all`);
    return response.data as { total_unique: number; faqs: { query: string; count: number }[] };
  },

  /**
   * Check backend server health
   */
  async checkHealth() {
    try {
      const response = await axios.get(`http://localhost:8080/health`);
      return response.data;
    } catch {
      return { status: "error" };
    }
  },

  /**
   * Fetch chat monitoring logs (response times)
   */
  async getMonitoringChats() {
    const response = await axios.get(`http://localhost:8080/api/v1/monitoring/chats`);
    return response.data as {
      count: number;
      logs: {
        chatId: string;
        question: string;
        response_time_ms: number;
        timestamp: number;
      }[];
    };
  },
};
