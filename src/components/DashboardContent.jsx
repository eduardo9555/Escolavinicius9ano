import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, Users, Calendar, TrendingUp, BarChart3, PieChart, ThumbsUp, AlertTriangle, MessageSquare, Sparkles, ArrowRight, BookOpen, ExternalLink, Star } from 'lucide-react';
import AdminDashboard from '@/components/AdminDashboard';

const MotivationalMessage = ({ score, name }) => {
  let message = "";
  let icon = null;
  let bgColor = "";
  let textColor = "";
  let borderColor = "";
  let iconColor = "";

  if (score >= 90) {
    message = `UAU, ${name}! Seu desempenho é INCRÍVEL! Você é uma estrela! ✨ Continue assim!`;
    icon = <Sparkles className="w-8 h-8 sm:w-10 sm:h-10" />;
    bgColor = "bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500";
    textColor = "text-white";
    borderColor = "border-yellow-300";
    iconColor = "text-white";
  } else if (score >= 70) {
    message = `Parabéns, ${name}! Você está mandando MUITO BEM! Continue focado e o sucesso é garantido! 🚀`;
    icon = <ThumbsUp className="w-8 h-8 sm:w-10 sm:h-10" />;
    bgColor = "bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500";
    textColor = "text-white";
    borderColor = "border-green-300";
    iconColor = "text-white";
  } else if (score >= 50) {
    message = `Continue firme, ${name}! O aprendizado é uma jornada. Acredite em você, estamos juntos nessa! 👍`;
    icon = <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10" />;
    bgColor = "bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500";
    textColor = "text-white";
    borderColor = "border-sky-300";
    iconColor = "text-white";
  } else {
    message = `Força, ${name}! Às vezes precisamos de um empurrãozinho. Conte conosco para decolar! ✈️ Cada passo conta!`;
    icon = <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10" />;
    bgColor = "bg-gradient-to-r from-rose-400 via-red-500 to-pink-500";
    textColor = "text-white";
    borderColor = "border-rose-300";
    iconColor = "text-white";
  }

  return (
    <motion.div 
      className={`p-4 sm:p-5 rounded-xl border-l-[6px] sm:border-l-[10px] shadow-2xl flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 ${bgColor} ${textColor} ${borderColor}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "circOut" }}
      whileHover={{ scale: 1.02, boxShadow: "0px 12px 35px rgba(0,0,0,0.25)"}}
    >
      <motion.div
        className={`p-2 rounded-full bg-white/20 ${iconColor} flex-shrink-0`}
        animate={{ rotate: [0, -5, 5, -5, 5, 0], scale: [1, 1.1, 1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        {icon}
      </motion.div>
      <p className="text-sm sm:text-base md:text-lg font-semibold leading-tight text-center sm:text-left">{message}</p>
    </motion.div>
  );
};

const MascotPrize = ({ userName, userRanking, totalStudents }) => {
  const mascotMessages = [
    `Continue assim, ${userName}, e este prêmio misterioso pode ser seu! ✨`,
    `Falta pouco, ${userName}! Mantenha o foco e conquiste este super prêmio! 🎁`,
    `Imagine só, ${userName}, que surpresa incrível te espera nesta caixa! 🚀`,
    `Este prêmio misterioso é um incentivo para você brilhar ainda mais, ${userName}! 🌟`
  ];
  const [currentMessage, setCurrentMessage] = useState(mascotMessages[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentMessage(mascotMessages[Math.floor(Math.random() * mascotMessages.length)]);
    }, 6000);
    return () => clearInterval(intervalId);
  }, [userName]);

  // Determinar posição real do ranking
  const getRankingDisplay = () => {
    if (!userRanking || userRanking === 0) {
      return "Sem posição";
    }
    return `#${userRanking}`;
  };

  const getRankingMessage = () => {
    if (!userRanking || userRanking === 0) {
      return "Continue estudando para entrar no ranking!";
    }
    
    if (userRanking === 1) {
      return "🏆 Você está em 1º lugar! Parabéns!";
    } else if (userRanking <= 3) {
      return `🥉 Você está no pódio! Posição ${userRanking}`;
    } else if (userRanking <= Math.ceil(totalStudents * 0.3)) {
      return "📈 Você está entre os melhores da turma!";
    } else {
      return "💪 Continue se esforçando para subir no ranking!";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.8, type: "spring", stiffness: 100, damping: 12 }}
      className="bg-white/95 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-emerald-200 card-hover flex flex-col items-center justify-between h-full"
    >
      <div className="text-center w-full">
        <h3 className="text-lg sm:text-2xl font-bold text-emerald-700 mb-1.5">Prêmio Final do Ano!</h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-4">
          O melhor aluno do 9º ano ganhará um <strong className="text-emerald-600">prêmio misterioso!</strong>
        </p>
        <motion.img 
          src="https://i.postimg.cc/QMQgRjRB/Chat-GPT-Image-13-de-jun-de-2025-10-24-51.png"
          alt="Caixa surpresa - Prêmio misterioso"
          className="w-full max-w-[200px] sm:max-w-[260px] md:max-w-[280px] mx-auto mb-4 drop-shadow-[0_20px_30px_rgba(0,160,120,0.35)]"
          whileHover={{ scale: 1.05, rotate: 1.5 }}
          transition={{ type: "spring", stiffness: 250, damping: 10 }}
        />
      </div>
      <div className="flex items-center space-x-2 sm:space-x-3 bg-emerald-50 p-2.5 sm:p-3.5 rounded-xl shadow-inner w-full mt-2 border border-emerald-100">
        <motion.img
          src="https://i.postimg.cc/RFS1mcTK/image.png"
          alt="Mascote"
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain flex-shrink-0"
          animate={{ y: [0, -6, 0], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <AnimatePresence mode="wait">
          <motion.p 
            key={currentMessage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="text-emerald-700 text-xs sm:text-sm font-medium leading-tight"
          >
            {currentMessage}
          </motion.p>
        </AnimatePresence>
      </div>
      <motion.div 
        className="mt-3 sm:mt-4 bg-gradient-to-tr from-emerald-600 to-green-500 text-white rounded-lg p-2.5 sm:p-3 w-full text-center shadow-xl"
        whileHover={{ scale: 1.02 }}
      >
        <p className="font-semibold text-xs sm:text-sm">
          Sua Posição Atual: <span className="text-sm sm:text-lg font-bold tracking-wide">{getRankingDisplay()}</span>
        </p>
        <p className="text-[10px] sm:text-xs text-emerald-100">{getRankingMessage()}</p>
      </motion.div>
    </motion.div>
  );
};

const FeedbackSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
      className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 sm:p-6 rounded-xl shadow-xl text-white card-hover"
    >
      <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
        <motion.div
          className="p-1.5 sm:p-2 bg-white/20 rounded-full"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />
        </motion.div>
        <h3 className="text-lg sm:text-xl font-bold">Participe do Desenvolvimento da Nossa Escola</h3>
      </div>
      <p className="text-blue-100 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
        Avalie sua experiência conosco e deixe aqui sua sugestão de melhoria. Sua opinião é muito importante para nós!
      </p>
      <Button
        asChild
        className="w-full bg-white/20 border-white/30 hover:bg-white/30 text-white backdrop-blur-sm shadow-md hover:shadow-lg transition-all text-xs sm:text-sm"
      >
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLScy3mC1btAkuAtO4UNjGKpi5sQN6pK8S6cUoOVw18lVd5nEVg/viewform?usp=dialog"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center"
        >
          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Avaliar e Sugerir Melhorias
        </a>
      </Button>
    </motion.div>
  );
};

const DashboardContent = ({ user, setActiveTab, allStudents, allNews, allEvents }) => {
  const [studentData, setStudentData] = useState(user);
  const [welcomeMessage, setWelcomeMessage] = useState('');

  useEffect(() => {
    // Encontrar dados atualizados do estudante no allStudents
    if (user.type === 'student' && allStudents && allStudents.length > 0) {
      console.log('DashboardContent - Looking for student:', user);
      console.log('DashboardContent - Available students:', allStudents);
      
      const updatedStudent = allStudents.find(s => {
        console.log('Comparing student:', s, 'with user:', user);
        return (
        s.id === user.uid || 
        s.uid === user.uid ||
        s.email?.toLowerCase() === user.email?.toLowerCase()
        );
      });
      
      console.log('DashboardContent - Found student:', updatedStudent);
      
      if (updatedStudent) {
        setStudentData(updatedStudent);
      } else {
        console.log('DashboardContent - Student not found, using original user data');
        setStudentData(user);
      }
    } else {
      setStudentData(user);
    }

    const welcomeMessages = [
      `Olá, ${user.name}! Pronto para mais um dia de conquistas? ✨`,
      `Bem-vindo(a) de volta, ${user.name}! Que seu dia seja produtivo e cheio de aprendizado! 🚀`,
      `E aí, ${user.name}! Feliz em te ver por aqui. Vamos juntos alcançar seus objetivos! 💪`,
      `Que bom te ver, ${user.name}! Continue se esforçando, você está no caminho certo! 🌟`
    ];
    setWelcomeMessage(welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]);
  }, [user, allStudents]);

  if (user.type === 'admin') {
    return <AdminDashboard user={user} setActiveTab={setActiveTab} allStudents={allStudents} allNews={allNews} allEvents={allEvents} />;
  }
  
  const averageScore = studentData?.stats ? Math.round(
    ( (studentData.stats.provaParana || 0) + 
      (studentData.stats.saeb || 0) + 
      (studentData.stats.provasInternas || 0) + 
      (studentData.stats.provasExternas || 0) +
      (studentData.stats.plataformasDigitais || 0)
    ) / 5
  ) : 0;

  const performanceItems = [
    { label: 'Rec.Ap.Matemática', value: studentData?.stats?.provasExternas || 0, color: 'bg-gradient-to-r from-purple-500 to-indigo-600', icon: <BookOpen /> },
    { label: 'Rec.Ap.Português', value: studentData?.stats?.provasInternas || 0, color: 'bg-gradient-to-r from-sky-500 to-blue-600', icon: <Award /> },
    { label: 'Prova Paraná', value: studentData?.stats?.provaParana || 0, color: 'bg-gradient-to-r from-teal-500 to-cyan-600', icon: <Medal /> },
    { label: 'Prova Acerta Brasil', value: studentData?.stats?.saeb || 0, color: 'bg-gradient-to-r from-emerald-500 to-green-600', icon: <Trophy /> },
    { label: 'Plataformas Digitais', value: studentData?.stats?.plataformasDigitais || 0, color: 'bg-gradient-to-r from-amber-500 to-orange-600', icon: <PieChart /> }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl p-4 sm:p-5 md:p-6 border-2 border-emerald-200"
      >
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-800 mb-1.5 tracking-tight">Painel do Aluno</h1>
        <p className="text-emerald-600 text-sm sm:text-base md:text-lg">{welcomeMessage}</p>
      </motion.div>

      <div className="mb-4 sm:mb-6 md:mb-8">
        <MotivationalMessage score={averageScore} name={user.name} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
        <div className="lg:col-span-4 space-y-3 sm:space-y-5">
          {performanceItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.15, duration: 0.6, ease: "circOut" }}
              className="bg-white/90 backdrop-blur-md rounded-xl p-3 sm:p-4 shadow-xl border border-gray-200 card-hover"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <span className={`p-1 sm:p-1.5 rounded-full ${item.color} text-white shadow-sm`}>{React.cloneElement(item.icon, {className: "w-3 h-3 sm:w-4 sm:h-4"})}</span>
                  <span className="text-gray-700 font-semibold text-xs sm:text-sm">{item.label}:</span>
                </div>
                <span className="text-lg sm:text-xl font-bold text-gray-800">{item.value}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 sm:h-3 overflow-hidden shadow-inner relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ delay: 0.5 + index * 0.15, duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
                  className={`h-full ${item.color} rounded-full progress-bar-animated`}
                />
                 <div className="progress-bar-shine"></div>
              </div>
            </motion.div>
          ))}
           <motion.div
            initial={{ opacity: 0, y:20 }}
            animate={{ opacity: 1, y:0 }}
            transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
            className="bg-gradient-to-tr from-emerald-500 to-green-600 rounded-xl p-3 sm:p-4 text-white shadow-lg text-center card-hover"
          >
            <div className="flex items-center justify-center space-x-2 sm:space-x-3">
              <motion.img
                src="https://i.postimg.cc/RFS1mcTK/image.png"
                alt="Mascote da escola" 
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain drop-shadow-lg"
                animate={{ rotate: [0, 3, -3, 0], scale: [1, 1.03, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatType: "mirror" }}
              />
              <div>
                <h3 className="text-base sm:text-lg font-bold">Você é TOP!</h3>
                <p className="text-emerald-100 text-xs font-medium">Continue assim!</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7, ease: "circOut" }}
          className="lg:col-span-4 bg-white/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-2xl border-2 border-emerald-200 card-hover flex flex-col items-center justify-center"
        >
          <div className="text-center mb-4 sm:mb-5">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">Frequência Escolar</h3>
            <div className="text-xs sm:text-sm text-gray-600">Dias Presente: {studentData?.stats?.frequencia || 0}%</div>
          </div>
          
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 mx-auto">
            <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90 drop-shadow-lg">
              <circle cx="100" cy="100" r="80" fill="none" stroke="#e9ecef" strokeWidth="26" />
              <motion.circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="url(#freqGradientDashboardContent)"
                strokeWidth="26"
                strokeLinecap="round"
                strokeDasharray={`${(studentData?.stats?.frequencia || 0) * 5.0265} ${502.65}`} 
                initial={{ strokeDashoffset: 502.65 }}
                animate={{ strokeDashoffset: 502.65 - ((studentData?.stats?.frequencia || 0) * 5.0265) }}
                transition={{ duration: 1.8, delay: 0.6, ease: [0.25, 1, 0.5, 1] }}
              />
              <defs>
                <linearGradient id="freqGradientDashboardContent" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span 
                className="text-3xl sm:text-4xl font-bold text-emerald-700"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                {studentData?.stats?.frequencia || 0}%
              </motion.span>
              <span className="text-gray-600 font-medium text-xs sm:text-sm mt-0.5">Frequência</span>
            </div>
          </div>
           <Button 
            variant="outline" 
            className="mt-4 sm:mt-5 border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all group shadow-md hover:shadow-lg text-xs sm:text-sm"
            onClick={() => setActiveTab('ranking')}
          >
            Ver Ranking Completo <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2 group-hover:translate-x-1.5 transition-transform" />
          </Button>
        </motion.div>

        <div className="lg:col-span-4">
          <MascotPrize 
            userName={user.name} 
            userRanking={studentData?.stats?.ranking} 
            totalStudents={allStudents?.length || 0}
          />
        </div>
      </div>

      <FeedbackSection />

      <style jsx>{`
        .progress-bar-animated {
          position: relative;
          overflow: hidden;
        }
        .progress-bar-shine {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
          animation: shine-animation 2s infinite linear;
          opacity: 0;
        }
        .card-hover:hover .progress-bar-shine {
          opacity: 1;
        }
        @keyframes shine-animation {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default DashboardContent;