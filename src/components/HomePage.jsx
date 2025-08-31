import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Users, Award, Sparkles, Newspaper, CalendarDays, ArrowRight, Clock, MapPin, User as UserIcon, Calendar } from 'lucide-react';

const HomePage = ({ onLogin, latestNews = [], latestEvents = [] }) => {
  const welcomeMessages = [
    "Olá, futuro campeão! 🏆 Pronto para brilhar?",
    "Seja bem-vindo(a) ao portal da superação! ✨",
    "Aqui começa sua jornada rumo ao sucesso! 🚀",
    "Que bom ter você aqui! Vamos aprender e crescer juntos! 🌱"
  ];
  const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return 'Data indisponível';
    return new Date(timestamp.toDate()).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const formatEventDate = (dateString) => {
    if (!dateString) return 'Data indisponível';
    return new Date(dateString + 'T00:00:00').toLocaleDateString('pt-BR', { 
      day: 'numeric', 
      month: 'short' 
    });
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
        className="relative z-10 p-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div 
              className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center glass-effect shadow-xl border border-white/30"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img 
                src="https://storage.googleapis.com/hostinger-horizons-assets-prod/5106ab5f-59ac-4270-81fc-d7e48fdc8ddd/fabd3a46ec76ba6fff9fec1d4c650677.jpg"
                alt="Logo da Escola"
                className="w-10 h-10 object-contain rounded-full"
              />
            </motion.div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Escola Estadual do Campo</h1>
              <p className="text-white/80 text-sm sm:text-base">Vinícius de Moraes - 9º Ano</p>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="relative z-10 flex-grow flex items-center max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div 
                className="inline-flex items-center space-x-2 bg-white/20 text-white px-4 py-2.5 rounded-full text-sm font-medium shadow-lg glass-effect border border-white/30"
                initial={{ opacity:0, y:10 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay: 0.3 }}
              >
                <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                <span>{randomMessage}</span>
              </motion.div>
              <motion.h2 
                className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight"
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
                className="text-lg sm:text-xl text-white/90 leading-relaxed"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              >
                Acompanhe seu desempenho, veja rankings, conquiste medalhas e 
                mantenha-se motivado em sua jornada educacional! Juntos, vamos alcançar o sucesso!
              </motion.p>
            </div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            >
              <Button
                onClick={() => onLogin('student')}
                className="w-full sm:w-auto bg-white text-green-700 hover:bg-green-50 text-lg px-8 py-4 rounded-xl font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300 pulse-glow border-2 border-emerald-500"
              >
                <Users className="w-6 h-6 mr-3" />
                Entrar como Aluno
              </Button>
              
              <Button
                onClick={() => onLogin('admin')}
                variant="outline"
                className="w-full sm:w-auto bg-white/20 text-white hover:bg-white/30 border-white/50 hover:border-white text-lg px-8 py-4 rounded-xl font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300 glass-effect"
              >
                <Award className="w-6 h-6 mr-3" />
                Acesso da Secretaria
              </Button>
            </motion.div>
            <motion.p 
              className="text-sm text-white/70"
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
            <div className="relative glass-effect p-8 rounded-3xl shadow-2xl border-2 border-white/20">
              <motion.img 
                src="https://storage.googleapis.com/hostinger-horizons-assets-prod/5106ab5f-59ac-4270-81fc-d7e48fdc8ddd/d3e82f464b6bd1fa35d02a534ff070fd.png"
                alt="Mascote da escola apresentando"
                className="w-[380px] h-auto object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.3)] floating-animation"
                drag
                dragConstraints={{ left: -15, right: 15, top: -15, bottom: 15 }}
              />
              <motion.div
                className="absolute -top-5 -right-5 w-12 h-12 bg-yellow-300/50 rounded-full opacity-70"
                animate={{ scale: [1, 1.2, 1], rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute -bottom-5 -left-5 w-10 h-10 bg-blue-300/50 rounded-full opacity-70"
                animate={{ y: [-12, 12, -12], x: [-4, 4, -4] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              />
               <div className="absolute bottom-6 right-6 bg-white/30 backdrop-blur-sm p-3 rounded-lg shadow-lg text-white text-xs">
                  <Sparkles className="w-4 h-4 inline mr-1 text-yellow-300" />
                  Sempre aprendendo!
               </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Seção de Notícias e Eventos */}
      <motion.section 
        className="relative z-10 py-8 sm:py-12 px-4 sm:px-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Fique por Dentro!
            </h2>
            <p className="text-white/80 text-lg">
              Confira as últimas notícias e eventos da nossa escola
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Notícias */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
                  <Newspaper className="w-7 h-7 text-sky-300" />
                </div>
                <h3 className="text-2xl font-bold text-white">Últimas Notícias</h3>
              </div>
              
              {latestNews.length > 0 ? (
                <div className="space-y-4">
                  {latestNews.slice(0, 3).map((news, index) => (
                    <motion.div
                      key={news.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                      className="bg-white/10 backdrop-blur-md p-5 rounded-xl shadow-lg hover:bg-white/20 transition-all duration-300 border border-white/20 card-hover"
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      {news.image && (
                        <div className="w-full h-32 sm:h-40 mb-4 rounded-lg overflow-hidden">
                          <img
                            src={news.image}
                            alt={news.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                      )}
                      <h4 className="font-bold text-white text-lg mb-2 line-clamp-2">
                        {news.title}
                      </h4>
                      <p className="text-white/80 text-sm mb-3 line-clamp-3 leading-relaxed">
                        {news.summary}
                      </p>
                      <div className="flex items-center justify-between text-xs text-white/70">
                        <div className="flex items-center space-x-2">
                          <UserIcon className="w-3 h-3" />
                          <span>{news.authorName || 'Secretaria'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(news.createdAt)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="bg-white/10 backdrop-blur-md p-8 rounded-xl text-center border border-white/20"
                >
                  <Newspaper className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <p className="text-white/70 text-lg">Nenhuma notícia publicada ainda</p>
                  <p className="text-white/50 text-sm mt-2">Aguarde novas publicações da secretaria</p>
                </motion.div>
              )}
            </motion.div>

            {/* Eventos */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
                  <CalendarDays className="w-7 h-7 text-amber-300" />
                </div>
                <h3 className="text-2xl font-bold text-white">Próximos Eventos</h3>
              </div>
              
              {latestEvents.length > 0 ? (
                <div className="space-y-4">
                  {latestEvents.slice(0, 3).map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                      className="bg-white/10 backdrop-blur-md p-5 rounded-xl shadow-lg hover:bg-white/20 transition-all duration-300 border border-white/20 card-hover"
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <h4 className="font-bold text-white text-lg mb-3 line-clamp-2">
                        {event.title}
                      </h4>
                      
                      <div className="space-y-2 text-sm text-white/80">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-amber-300" />
                          <span>{formatEventDate(event.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-amber-300" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-amber-300" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>
                      
                      {event.description && (
                        <p className="text-white/70 text-sm mt-3 pt-3 border-t border-white/20 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="bg-white/10 backdrop-blur-md p-8 rounded-xl text-center border border-white/20"
                >
                  <CalendarDays className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <p className="text-white/70 text-lg">Nenhum evento agendado ainda</p>
                  <p className="text-white/50 text-sm mt-2">Novos eventos serão publicados em breve</p>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-center mt-12"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 shadow-xl">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Quer ver mais detalhes?
              </h3>
              <p className="text-white/80 text-lg mb-6">
                Faça login para acessar todas as funcionalidades do portal
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => onLogin('student')}
                  className="bg-white text-green-700 hover:bg-green-50 text-base px-6 py-3 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Login de Aluno
                </Button>
                <Button
                  onClick={() => onLogin('admin')}
                  variant="outline"
                  className="bg-white/20 text-white hover:bg-white/30 border-white/50 hover:border-white text-base px-6 py-3 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 glass-effect"
                >
                  <Award className="w-5 h-5 mr-2" />
                  Acesso da Secretaria
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.footer 
        className="relative z-10 border-t border-white/20 py-8"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white/80 text-sm">
            © {new Date().getFullYear()} Escola Estadual do Campo Vinícius de Moraes - 9º Ano. 
            Desenvolvido com ❤️ para motivar nossos estudantes.
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default HomePage;