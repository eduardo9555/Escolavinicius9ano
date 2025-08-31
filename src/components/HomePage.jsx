import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users, Award, BookOpen, Calendar, FileText, ArrowRight, Star, Sparkles, Trophy, Heart, ChevronRight } from 'lucide-react';

const HomePage = ({ onLogin, latestNews = [], latestEvents = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const heroSlides = [
    {
      title: "Bem-vindos ao Portal do 9º Ano",
      subtitle: "Escola Estadual do Campo Vinícius de Moraes",
      description: "Acompanhe seu desempenho acadêmico, veja o ranking da turma e fique por dentro de todas as novidades da escola!",
      image: "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpo=1",
      gradient: "from-emerald-600 via-green-600 to-teal-700"
    },
    {
      title: "Acompanhe Seu Progresso",
      subtitle: "Rankings e Estatísticas em Tempo Real",
      description: "Veja suas notas, compare seu desempenho com os colegas e acompanhe sua evolução ao longo do ano letivo.",
      image: "https://images.pexels.com/photos/5427674/pexels-photo-5427674.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpo=1",
      gradient: "from-blue-600 via-indigo-600 to-purple-700"
    },
    {
      title: "Conecte-se com a Escola",
      subtitle: "Notícias, Eventos e Comunicados",
      description: "Fique sempre informado sobre eventos, comunicados importantes e todas as novidades da nossa escola.",
      image: "https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpo=1",
      gradient: "from-orange-500 via-red-500 to-pink-600"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Sistema de Ranking",
      description: "Acompanhe sua posição no ranking geral da turma baseado em todas as avaliações.",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Notas e Avaliações",
      description: "Visualize suas notas da Prova Paraná, SAEB, provas internas e muito mais.",
      color: "from-blue-400 to-indigo-500"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Agenda Escolar",
      description: "Fique por dentro de todos os eventos, atividades e datas importantes.",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Comunicados",
      description: "Receba todas as notícias e comunicados importantes da escola em tempo real.",
      color: "from-green-400 to-emerald-500"
    }
  ];

  const stats = [
    { number: "25+", label: "Alunos Ativos", icon: <Users className="w-6 h-6" /> },
    { number: "100%", label: "Dedicação", icon: <Heart className="w-6 h-6" /> },
    { number: "24/7", label: "Acesso Online", icon: <Star className="w-6 h-6" /> },
    { number: "2025", label: "Ano Letivo", icon: <Trophy className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-emerald-50">
      {/* Hero Section com Carousel */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${heroSlides[currentSlide].gradient} opacity-90 z-10`}></div>
            <img
              src={heroSlides[currentSlide].image}
              alt="Background"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <motion.img
              src="https://i.postimg.cc/gJKWXPR1/image.png"
              alt="Logo da Escola"
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto mb-6 drop-shadow-2xl"
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 tracking-tight">
                  {heroSlides[currentSlide].title}
                </h1>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6 text-white/90">
                  {heroSlides[currentSlide].subtitle}
                </h2>
                <p className="text-lg sm:text-xl md:text-2xl mb-8 text-white/80 max-w-4xl mx-auto leading-relaxed">
                  {heroSlides[currentSlide].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
          >
            <Button
              onClick={() => onLogin('student')}
              className="bg-white text-emerald-700 hover:bg-emerald-50 text-lg px-8 py-4 rounded-xl font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300 pulse-glow w-full sm:w-auto"
            >
              <Users className="w-6 h-6 mr-3" />
              Área do Aluno
            </Button>
            <Button
              onClick={() => onLogin('admin')}
              variant="outline"
              className="bg-white/20 border-white/50 text-white hover:bg-white/30 text-lg px-8 py-4 rounded-xl font-semibold shadow-2xl backdrop-blur-sm transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
            >
              <GraduationCap className="w-6 h-6 mr-3" />
              Área da Secretaria
            </Button>
          </motion.div>

          {/* Indicadores do Carousel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex justify-center space-x-2 mt-12"
          >
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-white/20 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">
              Recursos do Portal
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubra todas as funcionalidades que preparamos especialmente para você
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Nossa Escola em Números
            </h2>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
              Dados que mostram nosso compromisso com a educação de qualidade
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-4 shadow-xl">
                  <div className="text-white mb-4 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-emerald-100 font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-6 h-6 bg-white/10 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -40, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </section>

      {/* Latest News & Events */}
      {(latestNews.length > 0 || latestEvents.length > 0) && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">
                Últimas Novidades
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Fique por dentro das últimas notícias e eventos da nossa escola
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Latest News */}
              {latestNews.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                    <FileText className="w-8 h-8 mr-3 text-blue-600" />
                    Notícias Recentes
                  </h3>
                  <div className="space-y-6">
                    {latestNews.slice(0, 3).map((news, index) => (
                      <motion.div
                        key={news.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer"
                      >
                        {news.image && (
                          <img
                            src={news.image}
                            alt={news.title}
                            className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                        <h4 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                          {news.title}
                        </h4>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                          {news.summary}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {news.createdAt ? new Date(news.createdAt.toDate()).toLocaleDateString('pt-BR') : 'Recente'}
                          </span>
                          <ChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Latest Events */}
              {latestEvents.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                    <Calendar className="w-8 h-8 mr-3 text-purple-600" />
                    Próximos Eventos
                  </h3>
                  <div className="space-y-6">
                    {latestEvents.slice(0, 3).map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer"
                      >
                        <h4 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                          {event.title}
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1 mb-3">
                          <p>📅 {event.date ? new Date(event.date + 'T00:00:00').toLocaleDateString('pt-BR') : 'Data a definir'}</p>
                          <p>🕒 {event.time || 'Horário a definir'}</p>
                          <p>📍 {event.location || 'Local a definir'}</p>
                        </div>
                        {event.description && (
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                            {event.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Evento</span>
                          <ChevronRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="mb-8"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-16 h-16 mx-auto text-yellow-300" />
            </motion.div>
            
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Pronto para Começar?
            </h2>
            <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
              Faça login agora e tenha acesso completo ao seu painel personalizado com todas as suas informações acadêmicas!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => onLogin('student')}
                className="bg-white text-emerald-700 hover:bg-emerald-50 text-lg px-8 py-4 rounded-xl font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Users className="w-6 h-6 mr-3" />
                Entrar como Aluno
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
              <Button
                onClick={() => onLogin('admin')}
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-emerald-700 text-lg px-8 py-4 rounded-xl font-semibold shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <GraduationCap className="w-6 h-6 mr-3" />
                Acesso da Secretaria
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <img
                src="https://i.postimg.cc/gJKWXPR1/image.png"
                alt="Logo da Escola"
                className="w-12 h-12"
              />
              <div className="text-left">
                <h3 className="text-lg font-bold">Escola Estadual do Campo</h3>
                <p className="text-gray-400 text-sm">Vinícius de Moraes</p>
              </div>
            </div>
            
            <p className="text-gray-400 mb-4">
              Portal educacional do 9º ano - Desenvolvido com ❤️ para nossos alunos
            </p>
            
            <div className="border-t border-gray-700 pt-6">
              <p className="text-gray-500 text-sm">
                © 2025 Escola Estadual do Campo Vinícius de Moraes. Todos os direitos reservados.
              </p>
            </div>
          </motion.div>
        </div>
      </footer>

      <style jsx>{`
        .pulse-glow {
          animation: pulse-glow 2s infinite;
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
          50% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.6); }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default HomePage;