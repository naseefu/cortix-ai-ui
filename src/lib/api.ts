import axios from 'axios';

export const chatApi = {
  /**
   * Real implementation of `/api/v1/chat/chat-with-ai`
   */
  async sendMessage(payload: { chatId: string; message: string; documentName: string | null }) {
    // Treat null documentName as an empty string to match backend expectations
    const body = {
      chatId: payload.chatId,
      message: payload.message,
      documentName: payload.documentName || '',
    };

    const response = await axios.post(`http://localhost:8080/api/v1/chat/chat-with-ai`, body);

    return {
      status: 'success',
      data: {
        role: 'ai',
        // Depending on backend response format, this might need adjusting. 
        // Assuming the backend returns the raw answer string or a JSON object with 'answer'
        content: typeof response.data === 'string' ? response.data : response.data?.answer || response.data?.content || JSON.stringify(response.data),
      },
    };
  },

  /**
   * Real implementation of `/api/v1/store/upload`
   */
  async uploadFile(payload: { file: File; chatId: string }) {
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
        // Fallback to the local file name in case backend doesn't return the uploaded filename
        fileName: response.data?.fileName || payload.file.name,
      },
    };
  },
};
