import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Aqui você pode adicionar seu próprio estilo

const App: React.FC = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: string, content: string }[]>([]);
  const [loading, setLoading] = useState(false); // Controla se a resposta da IA está sendo carregada

  // Função para abrir/fechar o chat
  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  // Função para enviar a mensagem para o backend
  const sendMessage = async () => {
    if (!message.trim() || loading) return; // Impede o envio se estiver em loading ou a mensagem estiver vazia

    // Adiciona a mensagem do usuário ao histórico
    setChatHistory([...chatHistory, { sender: 'user', content: message }]);
    setMessage('');
    setLoading(true); // Inicia o estado de loading

    try {
      const response = await axios.post('http://localhost:3000/message', {
        message: message
      });

      // Adiciona a resposta da IA ao histórico
      setChatHistory((prevHistory) => [...prevHistory, { sender: 'assistant', content: response.data.response }]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setChatHistory((prevHistory) => [...prevHistory, { sender: 'assistant', content: 'Erro ao receber resposta.' }]);
    } finally {
      setLoading(false); // Libera o envio de uma nova mensagem quando a resposta chega
    }
  };

  return (
    <div className="app">
      {!chatOpen ? (
        <button className="open-chat-button" onClick={toggleChat}>
          Abrir Chat
        </button>
      ) : (
        <div className="chat-container">
          <div className="chat-header">
            <button className="close-chat-button" onClick={toggleChat}>X</button>
            <h2>Assistente Virtual</h2>
          </div>
          <div className="chat-history">
            {chatHistory.map((chat, index) => (
              <div key={index} className={chat.sender === 'user' ? 'user-message' : 'assistant-message'}>
                <p>{chat.content}</p>
              </div>
            ))}
            {loading && <p>Assistente está digitando...</p>}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading} // Desabilita o input enquanto a resposta não chega
            />
            <button onClick={sendMessage} disabled={loading || !message.trim()}>
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
