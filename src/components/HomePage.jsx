import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Users, Award, Sparkles, Newspaper, CalendarDays, ArrowRight } from 'lucide-react';

const HomePage = ({ onLogin, latestNews = [], latestEvents = [] }) => {
  const welcomeMessages = [
    "Olá, futuro campeão! 🏆 Pronto para brilhar?",
    "Seja bem-vindo(a) ao portal da superação! ✨",
    "Aqui começa sua jornada rumo ao sucesso! 🚀",
    "Que bom ter você aqui! Vamos aprender e crescer juntos! 🌱"
  ];
  const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Data indisponível';
    
    // Handle Firestore timestamp
    if (timestamp && typeof timestamp.toDate === 'function') {
      return new Date(timestamp.toDate()).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    }
    
    // Handle regular date string or Date object
    try {
      return new Date(timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    } catch (error) {
      return 'Data indisponível';
    }
  };

  const formatEventDate = (dateString) => {
    if (!dateString) return 'Data indisponível';
    try {
      return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
    } catch (error) {
      return 'Data indisponível';
    }
  };

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(7)].map((_, i) => (
          <motion.div 
            key={i}
            className={`absolute rounded-full blur-3xl ${i % 2 === 0 ? 'bg-emerald-300/10' : 'bg-white/10'}`}
            style={{
              width: Math.random() * 300 + 150,
              height: Math.random() * 300 + 150,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
            animate={{ 
              scale: [1, 1.05 + Math.random() * 0.2, 1], 
              rotate: [0, Math.random() * 30 - 15, 0],
              x: Math.random() * 60 - 30,
              y: Math.random() * 60 - 30,
            }}
            transition={{ duration: 20 + Math.random() * 15, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <motion.header 
        className="relative z-10 p-4 sm:p-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <motion.div 
              className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center glass-effect shadow-xl border border-white/30"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img 
                src="https://i.postimg.cc/gJKWXPR1/image.png"
                alt="Logo da Escola"
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-full"
              />
            </motion.div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Escola Estadual do Campo</h1>
              <p className="text-white/80 text-xs sm:text-sm md:text-base">Vinícius de Moraes - 9º Ano</p>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="relative z-10 flex-grow flex items-center max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center w-full">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="space-y-4 sm:space-y-6">
              <motion.div 
                className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-white/20 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium shadow-lg glass-effect border border-white/30"
                initial={{ opacity:0, y:10 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay: 0.3 }}
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 animate-pulse" />
                <span>{randomMessage}</span>
              </motion.div>
              <motion.h2 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight tracking-tight"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                Bem-vindos ao
                <span className="block bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 bg-clip-text text-transparent mt-1 sm:mt-2">
                  Portal do 9º Ano!
                </span>
              </motion.h2>
              
              <motion.p 
                className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              >
                Acompanhe seu desempenho, veja rankings, conquiste medalhas e 
                mantenha-se motivado em sua jornada educacional! Juntos, vamos alcançar o sucesso!
              </motion.p>
            </div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            >
              <Button
                onClick={() => onLogin('student')}
                className="w-full sm:w-auto bg-white text-green-700 hover:bg-green-50 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300 pulse-glow border-2 border-emerald-500"
              >
                <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                Entrar como Aluno
              </Button>
              
              <Button
                onClick={() => onLogin('admin')}
                variant="outline"
                className="w-full sm:w-auto bg-white/20 text-white hover:bg-white/30 border-white/50 hover:border-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300 glass-effect"
              >
                <Award className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                Acesso da Secretaria
              </Button>
            </motion.div>
            <motion.p 
              className="text-xs sm:text-sm text-white/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Alunos: usem seu <strong>email da escola</strong> para fazer login.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 100 }}
            className="hidden lg:block"
          >
            <div className="relative glass-effect p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-white/20">
              <motion.img 
                src="https://i.postimg.cc/RFS1mcTK/image.png"
                alt="Mascote da escola apresentando"
                className="w-[300px] sm:w-[380px] h-auto object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.3)] floating-animation"
                drag
                dragConstraints={{ left: -15, right: 15, top: -15, bottom: 15 }}
              />
              <motion.div
                className="absolute -top-5 -right-5 w-10 h-10 sm:w-12 sm:h-12 bg-yellow-300/50 rounded-full opacity-70"
                animate={{ scale: [1, 1.2, 1], rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute -bottom-5 -left-5 w-8 h-8 sm:w-10 sm:h-10 bg-blue-300/50 rounded-full opacity-70"
                animate={{ y: [-12, 12, -12], x: [-4, 4, -4] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              />
               <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 bg-white/30 backdrop-blur-sm p-2 sm:p-3 rounded-lg shadow-lg text-white text-xs">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 text-yellow-300" />
                  Sempre aprendendo!
               </div>
            </div>
          </motion.div>
        </div>
      </main>

      <motion.section 
        className="relative z-10 py-8 sm:py-12 px-3 sm:px-4 md:px-6 bg-white/10 backdrop-blur-md border-t border-white/20"
        initial={{ opacity:0, y:50 }}
        animate={{ opacity:1, y:0 }}
        transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4">
              Fique por Dentro!
            </h2>
            <p className="text-white/80 text-sm sm:text-base md:text-lg">
              Confira as últimas novidades e eventos da nossa escola
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {latestNews && latestNews.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20 shadow-xl"
            >
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                <div className="p-2 sm:p-2.5 bg-sky-500/20 rounded-lg">
                  <Newspaper className="w-5 h-5 sm:w-6 sm:h-6 text-sky-300"/>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Últimas Notícias</h3>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {latestNews.slice(0, 3).map((news, index) => {
                  console.log('Rendering news item:', news);
                  return (
                  <motion.div 
                    key={news.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                    className="bg-white/10 p-3 sm:p-4 rounded-xl shadow-md hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-white/30 group cursor-pointer"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 sm:w-3 sm:h-3 bg-sky-400 rounded-full mt-2 group-hover:bg-sky-300 transition-colors"></div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white text-sm sm:text-base leading-tight mb-1 group-hover:text-sky-200 transition-colors">
                          {news.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-white/80 mb-2 leading-relaxed line-clamp-2">
                          {news.summary || news.content || 'Sem descrição disponível'}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-[10px] sm:text-xs text-white/60 font-medium">
                            {formatDate(news.createdAt)}
                          </div>
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20 shadow-xl"
            >
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                <div className="p-2 sm:p-2.5 bg-sky-500/20 rounded-lg">
                  <Newspaper className="w-5 h-5 sm:w-6 sm:h-6 text-sky-300"/>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Últimas Notícias</h3>
              </div>
              <div className="text-center py-8">
                <Newspaper className="w-12 h-12 text-white/40 mx-auto mb-3" />
                <p className="text-white/70 text-sm">Nenhuma notícia publicada ainda</p>
                <p className="text-white/50 text-xs mt-1">Aguarde novas publicações da secretaria</p>
              </div>
            </motion.div>
          )}
          
          {latestEvents && latestEvents.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20 shadow-xl"
            >
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                <div className="p-2 sm:p-2.5 bg-amber-500/20 rounded-lg">
                  <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300"/>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Próximos Eventos</h3>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {latestEvents.slice(0, 3).map((event, index) => {
                  console.log('Rendering event item:', event);
                  return (
                  <motion.div 
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                    className="bg-white/10 p-3 sm:p-4 rounded-xl shadow-md hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-white/30 group cursor-pointer"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 sm:w-3 sm:h-3 bg-amber-400 rounded-full mt-2 group-hover:bg-amber-300 transition-colors"></div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white text-sm sm:text-base leading-tight mb-1 group-hover:text-amber-200 transition-colors">
                          {event.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-white/80 mb-2 leading-relaxed line-clamp-1">
                          📍 {event.location || 'Local não informado'}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-[10px] sm:text-xs text-white/60 font-medium">
                            {formatEventDate(event.date)} às {event.time || 'Horário não informado'}
                          </div>
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20 shadow-xl"
            >
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                <div className="p-2 sm:p-2.5 bg-amber-500/20 rounded-lg">
                  <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300"/>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Próximos Eventos</h3>
              </div>
              <div className="text-center py-8">
                <CalendarDays className="w-12 h-12 text-white/40 mx-auto mb-3" />
                <p className="text-white/70 text-sm">Nenhum evento agendado ainda</p>
                <p className="text-white/50 text-xs mt-1">Aguarde novos eventos da secretaria</p>
              </div>
            </motion.div>
          )}
          </div>
          
          {((latestNews && latestNews.length > 3) || (latestEvents && latestEvents.length > 3)) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="text-center mt-8 sm:mt-12"
            >
              <p className="text-white/70 text-sm sm:text-base mb-4">
                Faça login para ver todas as notícias e eventos
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button
                  onClick={() => onLogin('student')}
                  variant="outline"
                  className="bg-white/20 text-white hover:bg-white/30 border-white/50 hover:border-white text-sm px-6 py-2 rounded-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Entrar como Aluno
                </Button>
                <Button
                  onClick={() => onLogin('admin')}
                  variant="outline"
                  className="bg-white/20 text-white hover:bg-white/30 border-white/50 hover:border-white text-sm px-6 py-2 rounded-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <Award className="w-4 h-4 mr-2" />
                  Acesso da Secretaria
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;