import axiosClient from './axiosClient';

const chatService = {
  getMyChat: (sessionId) => {
    const config = sessionId ? { headers: { 'x-session-id': sessionId } } : {};
    return axiosClient.get('/chats/my-chat', config);
  },
  getAdminConversations: () => {
    return axiosClient.get('/chats/admin/conversations');
  },
  getConversationMessages: (id) => {
    return axiosClient.get(`/chats/admin/${id}`);
  }
};

export default chatService;
