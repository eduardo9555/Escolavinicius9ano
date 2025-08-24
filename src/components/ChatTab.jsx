import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, ArrowLeft, Plus, Trash2, User } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { TEACHERS, identifySubject } from '@/lib/teachers';

const ChatTab = ({ user }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showTeacherSelection, setShowTeacherSelection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation.id);
    }
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async () => {
    try {
      const conversationsRef = collection(db, 'chat_conversations');
      const q = query(
        conversationsRef, 
        where('student_uid', '==', user.uid),
        orderBy('updated_at', 'desc')
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const conversationsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setConversations(conversationsList);
      });
      
      return unsubscribe;
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as conversas.",
        variant: "destructive"
      });
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const messagesRef = collection(db, 'chat_messages');
      const q = query(
        messagesRef,
        where('conversation_id', '==', conversationId),
        orderBy('created_at', 'asc')
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messagesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(messagesList);
      });
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as mensagens.",
        variant: "destructive"
      });
    }
  };

  const createNewConversation = async (teacherName) => {
    try {
      const teacher = TEACHERS[teacherName];
      const conversationData = {
          student_uid: user.uid,
          student_name: user.name,
          student_email: user.email,
          teacher_name: teacher.name,
          teacher_subject: teacher.subject,
          title: `Conversa com ${teacher.name}`,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'chat_conversations'), conversationData);
      const data = { id: docRef.id, ...conversationData };

      // Adicionar mensagem de boas-vindas do professor
      await addDoc(collection(db, 'chat_messages'), {
          conversation_id: data.id,
          sender_type: 'teacher',
          message: teacher.greeting,
          created_at: serverTimestamp()
        });

      setConversations(prev => [data, ...prev]);
      setActiveConversation(data);
      setShowTeacherSelection(false);
      setSelectedTeacher(null);
      
      toast({
        title: "Conversa iniciada!",
        description: `Você agora está conversando com ${teacher.name}.`
      });
    } catch (error) {
      console.error('Erro ao criar conversa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar a conversa.",
        variant: "destructive"
      });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation || isLoading) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setIsLoading(true);

    try {
      // Adicionar mensagem do aluno
      await addDoc(collection(db, 'chat_messages'), {
          conversation_id: activeConversation.id,
          sender_type: 'student',
          message: messageText,
          created_at: serverTimestamp()
        });

      // Gerar resposta da IA
      const teacherResponse = await generateTeacherResponse(
        messageText, 
        activeConversation.teacher_name
      );

      // Adicionar resposta do professor
      await addDoc(collection(db, 'chat_messages'), {
          conversation_id: activeConversation.id,
          sender_type: 'teacher',
          message: teacherResponse,
          created_at: serverTimestamp()
        });

      // Atualizar conversa
      const conversationRef = doc(db, 'chat_conversations', activeConversation.id);
      await updateDoc(conversationRef, { 
        updated_at: serverTimestamp() 
      });

      // Recarregar mensagens
      loadMessages(activeConversation.id);
      loadConversations();

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateTeacherResponse = async (question, teacherName) => {
    try {
      const teacher = TEACHERS[teacherName];
      
      // Verificar se a pergunta é sobre outra matéria
      const suggestedTeacher = identifySubject(question);
      if (suggestedTeacher && suggestedTeacher !== teacherName) {
        return `Olha, acho melhor verificarmos isso com o professor/a ${suggestedTeacher}.`;
      }

      // Simular resposta da IA (aqui você integraria com OpenAI)
      // Por enquanto, vamos usar respostas simuladas
      const responses = {
        'Alessandro': [
          'Que pergunta interessante sobre arte! Vamos explorar isso juntos...',
          'Na arte, sempre há espaço para criatividade e expressão pessoal...',
          'Lembro-me de um artista que trabalhou com essa técnica...'
        ],
        'Jessica': [
          'Excelente pergunta científica! Vamos investigar isso...',
          'Na ciência, sempre começamos com uma hipótese...',
          'Isso me lembra de um experimento que fizemos...'
        ],
        'Lizena': [
          'Muito bem observado! Em português, essa regra funciona assim...',
          'Vamos analisar essa estrutura gramatical juntos...',
          'Na literatura brasileira, encontramos exemplos similares...'
        ],
        'João da Mata': [
          'Ótima pergunta sobre educação física! Vamos nos movimentar...',
          'No esporte, a técnica é fundamental...',
          'Lembro de um atleta que dominava essa habilidade...'
        ],
        'Geraldo William': [
          'Interessante questão geográfica! Vamos explorar esse lugar...',
          'No mapa, podemos observar que...',
          'Essa região tem características muito particulares...'
        ],
        'Renato': [
          'Que pergunta histórica fascinante! Vamos viajar no tempo...',
          'Naquela época, as coisas funcionavam de forma diferente...',
          'Esse evento histórico teve consequências importantes...'
        ],
        'Alessandra': [
          'Excelente pergunta sobre redação! Vamos estruturar suas ideias...',
          'Na escrita, a organização das ideias é fundamental...',
          'Vamos trabalhar a argumentação neste texto...'
        ],
        'Marilene': [
          'Ótima pergunta matemática! Vamos resolver passo a passo...',
          'Na matemática, sempre seguimos uma lógica...',
          'Vamos usar um exemplo prático para entender melhor...'
        ]
      };

      const teacherResponses = responses[teacherName] || ['Interessante pergunta! Vamos pensar sobre isso...'];
      const randomResponse = teacherResponses[Math.floor(Math.random() * teacherResponses.length)];
      
      return `${randomResponse} Sobre sua pergunta: "${question}" - Esta é uma questão importante em ${teacher.subject}. Continue estudando e fazendo perguntas!`;
      
    } catch (error) {
      console.error('Erro ao gerar resposta:', error);
      return 'Desculpe, tive um problema técnico. Pode repetir a pergunta?';
    }
  };

  const deleteConversation = async (conversationId) => {
    try {
      // Note: In a real implementation, you'd want to delete messages first
      // For now, we'll just remove from local state
      // await deleteDoc(doc(db, 'chat_conversations', conversationId));

      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      if (activeConversation?.id === conversationId) {
        setActiveConversation(null);
        setMessages([]);
      }

      toast({
        title: "Conversa excluída",
        description: "A conversa foi removida com sucesso."
      });
    } catch (error) {
      console.error('Erro ao excluir conversa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a conversa.",
        variant: "destructive"
      });
    }
  };

  // Set up real-time listeners
  useEffect(() => {
    if (user) {
      const unsubscribeConversations = loadConversations();
      return () => {
        if (typeof unsubscribeConversations === 'function') {
          unsubscribeConversations();
        }
      };
    }
  }, [user]);

  if (showTeacherSelection) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowTeacherSelection(false)}
              className="text-emerald-600 hover:bg-emerald-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Escolha um Professor</h2>
              <p className="text-gray-600">Selecione com qual professor você gostaria de conversar</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(TEACHERS).map((teacher, index) => (
            <motion.div
              key={teacher.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-emerald-300"
              onClick={() => createNewConversation(teacher.name)}
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={teacher.avatar}
                  alt={teacher.name}
                  className="w-16 h-16 rounded-full border-4 border-emerald-200"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{teacher.name}</h3>
                  <p className="text-emerald-600 font-medium">{teacher.subject}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{teacher.personality}</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (!activeConversation) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-8 h-8 text-emerald-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Perguntas aos Professores</h2>
              <p className="text-gray-600">Tire suas dúvidas com nossos professores especializados</p>
            </div>
          </div>
          <Button
            onClick={() => setShowTeacherSelection(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nova Conversa
          </Button>
        </motion.div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Suas Conversas</h3>
          {conversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma conversa ainda</p>
              <p className="text-gray-400 text-sm">Clique em "Nova Conversa" para começar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {conversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() => setActiveConversation(conversation)}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={TEACHERS[conversation.teacher_name]?.avatar}
                      alt={conversation.teacher_name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{conversation.title}</p>
                      <p className="text-sm text-gray-600">{conversation.teacher_subject}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conversation.id);
                    }}
                    className="text-red-500 hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const teacher = TEACHERS[activeConversation.teacher_name];

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Header da conversa */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-4 border-b border-gray-200 flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveConversation(null)}
            className="text-emerald-600 hover:bg-emerald-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <img
            src={teacher?.avatar}
            alt={teacher?.name}
            className="w-10 h-10 rounded-full border-2 border-emerald-200"
          />
          <div>
            <h3 className="font-bold text-gray-800">{teacher?.name}</h3>
            <p className="text-sm text-emerald-600">{teacher?.subject}</p>
          </div>
        </div>
      </motion.div>

      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${message.sender_type === 'student' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender_type === 'student'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}>
                {message.sender_type === 'teacher' && (
                  <div className="flex items-center space-x-2 mb-1">
                    <img
                      src={teacher?.avatar}
                      alt={teacher?.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-xs font-medium text-emerald-600">{teacher?.name}</span>
                  </div>
                )}
                <p className="text-sm">{message.message}</p>
                <p className={`text-xs mt-1 ${
                  message.sender_type === 'student' ? 'text-emerald-100' : 'text-gray-500'
                }`}>
                  {new Date(message.created_at).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input de mensagem */}
      <div className="bg-white p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={`Faça sua pergunta para ${teacher?.name}...`}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatTab;