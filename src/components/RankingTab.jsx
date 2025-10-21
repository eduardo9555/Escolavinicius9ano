import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Trophy, Medal, Star, Crown } from 'lucide-react';

const PodiumStep = ({ student, position, delay }) => {
  const getPositionConfig = (pos) => {
    switch (pos) {
      case 1:
        return {
          height: 'h-32 sm:h-40',
          bgColor: 'bg-gradient-to-t from-yellow-400 to-yellow-300',
          textColor: 'text-yellow-800',
          icon: <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600" />,
          medal: '🥇',
          title: '1º LUGAR'
        };
      case 2:
        return {
          height: 'h-24 sm:h-32',
          bgColor: 'bg-gradient-to-t from-gray-400 to-gray-300',
          textColor: 'text-gray-800',
          icon: <Medal className="w-7 h-7 sm:w-9 sm:h-9 text-gray-600" />,
          medal: '🥈',
          title: '2º LUGAR'
        };
      case 3:
        return {
          height: 'h-20 sm:h-28',
          bgColor: 'bg-gradient-to-t from-amber-600 to-amber-400',
          textColor: 'text-amber-900',
          icon: <Award className="w-6 h-6 sm:w-8 sm:h-8 text-amber-700" />,
          medal: '🥉',
          title: '3º LUGAR'
        };
      default:
        return {
          height: 'h-16',
          bgColor: 'bg-gray-200',
          textColor: 'text-gray-600',
          icon: <Star className="w-5 h-5" />,
          medal: '',
          title: `${pos}º LUGAR`
        };
    }
  };

  const config = getPositionConfig(position);
  const averageScore = student.stats ? Math.round(
    ((student.stats.provaParana || 0) +
     (student.stats.saeb || 0) +
     (student.stats.provasInternas || 0) +
     (student.stats.provasExternas || 0)) / 4
  ) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, type: "spring", stiffness: 100 }}
      className="flex flex-col items-center"
    >
      {/* Avatar e informações do aluno */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.3, type: "spring", stiffness: 200 }}
        className="mb-3 sm:mb-4 text-center"
      >
        <div className="relative mb-2 sm:mb-3">
          <img
            src={student.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`}
            alt={student.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white shadow-lg object-cover mx-auto"
          />
          <div className="absolute -top-2 -right-2 text-2xl sm:text-3xl">
            {config.medal}
          </div>
        </div>
        <h3 className="font-bold text-gray-800 text-sm sm:text-base mb-1 px-2 text-center leading-tight">
          {student.name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-1">
          Média: <span className="font-semibold text-emerald-600">{averageScore}%</span>
        </p>
        <div className="flex items-center justify-center space-x-1">
          {config.icon}
        </div>
      </motion.div>

      {/* Degrau do pódio */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: 'auto' }}
        transition={{ duration: 0.8, delay: delay + 0.5, ease: "easeOut" }}
        className={`${config.height} ${config.bgColor} w-20 sm:w-28 rounded-t-lg shadow-lg border-2 border-white flex flex-col items-center justify-center relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        <div className={`${config.textColor} font-bold text-xs sm:text-sm text-center z-10`}>
          {config.title}
        </div>
        <div className={`${config.textColor} font-extrabold text-lg sm:text-2xl z-10`}>
          {position}
        </div>
      </motion.div>
    </motion.div>
  );
};

const Podium = ({ topThree }) => {
  if (topThree.length === 0) return null;

  // Reorganizar para mostrar 2º, 1º, 3º (ordem visual do pódio)
  const podiumOrder = [];
  if (topThree[1]) podiumOrder.push({ student: topThree[1], position: 2, delay: 0.2 });
  if (topThree[0]) podiumOrder.push({ student: topThree[0], position: 1, delay: 0.4 });
  if (topThree[2]) podiumOrder.push({ student: topThree[2], position: 3, delay: 0.6 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl border border-blue-200"
    >
      <div className="text-center mb-6 sm:mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 150 }}
          className="flex items-center justify-center space-x-2 mb-3"
        >
          <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Pódio dos Campeões</h2>
          <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500" />
        </motion.div>
        <p className="text-gray-600 text-sm sm:text-base">Os três melhores alunos da turma</p>
      </div>

      <div className="flex items-end justify-center space-x-4 sm:space-x-8">
        {podiumOrder.map((item, index) => (
          <PodiumStep
            key={item.student.id || item.student.uid}
            student={item.student}
            position={item.position}
            delay={item.delay}
          />
        ))}
      </div>

      {/* Efeitos decorativos */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full opacity-60"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

const RankingTab = ({ user, allStudents, isAdminView = false }) => {
  // Sort students by average score
  const sortedStudents = allStudents ? [...allStudents].sort((a, b) => {
    const avgA = a.stats ? Math.round(
      ((a.stats.provaParana || 0) + 
       (a.stats.saeb || 0) + 
       (a.stats.provasInternas || 0) + 
       (a.stats.provasExternas || 0) +
       (a.stats.plataformasDigitais || 0)) / 5
    ) : 0;
    const avgB = b.stats ? Math.round(
      ((b.stats.provaParana || 0) + 
       (b.stats.saeb || 0) + 
       (b.stats.provasInternas || 0) + 
       (b.stats.provasExternas || 0) +
       (b.stats.plataformasDigitais || 0)) / 5
    ) : 0;
    
    if (avgB !== avgA) {
      return avgB - avgA;
    }
    return a.name.localeCompare(b.name);
  }) : [];

  const topThree = sortedStudents.slice(0, 3);
  const remainingStudents = sortedStudents.slice(3);

  const getRankIcon = (position) => {
    if (position === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (position === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (position === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return <Star className="w-5 h-5 text-gray-500" />;
  };

  const getRankColor = (position) => {
    if (position === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    if (position === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500';
    if (position === 3) return 'bg-gradient-to-r from-amber-400 to-amber-600';
    return 'bg-gradient-to-r from-blue-400 to-blue-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl p-6 border-2 border-emerald-200">
        <div className="flex items-center space-x-3 mb-6">
          <Users className="w-8 h-8 text-emerald-600" />
          <h1 className="text-3xl font-bold text-emerald-800">{isAdminView ? 'Ranking Geral - Visão Admin' : 'Ranking Geral'}</h1>
        </div>
        <p className="text-emerald-600 text-lg">
          Confira a classificação dos alunos baseada no desempenho geral
        </p>
      </div>

      {/* Pódio dos três melhores */}
      {topThree.length > 0 && (
        <div className="relative">
          <Podium topThree={topThree} />
        </div>
      )}

      {/* Ranking completo */}
      <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Users className="w-6 h-6 mr-2 text-emerald-600" />
          Classificação Completa
        </h2>
        
        {sortedStudents.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Nenhum estudante encontrado</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedStudents.map((student, index) => {
              const position = index + 1;
              const averageScore = student.stats ? Math.round(
                ((student.stats.provaParana || 0) + 
                 (student.stats.saeb || 0) + 
                 (student.stats.provasInternas || 0) + 
                 (student.stats.provasExternas || 0) +
                 (student.stats.plataformasDigitais || 0)) / 5
              ) : 0;
              
              const isCurrentUser = isAdminView ? false : (
                student.uid === user.uid || 
                student.id === user.uid ||
                student.email?.toLowerCase() === user.email?.toLowerCase() ||
                student.name === user.name
              );

              const isTopThree = position <= 3;

              return (
                <motion.div
                  key={student.id || student.uid}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                    isCurrentUser 
                      ? 'bg-emerald-50 border-emerald-300 shadow-lg' 
                      : isTopThree
                      ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300 shadow-md'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full text-white font-bold ${getRankColor(position)}`}>
                      {position <= 3 ? getRankIcon(position) : position}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isCurrentUser ? 'text-emerald-800' : 'text-gray-800'}`}>
                        {student.name}
                        {isCurrentUser && !isAdminView && <span className="ml-2 text-sm text-emerald-600">(Você)</span>}
                        {position === 1 && (
                          <span className="ml-2 text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full font-medium">
                            🥇 1º LUGAR
                          </span>
                        )}
                        {position === 2 && (
                          <span className="ml-2 text-xs px-2 py-1 bg-gray-200 text-gray-800 rounded-full font-medium">
                            🥈 2º LUGAR
                          </span>
                        )}
                        {position === 3 && (
                          <span className="ml-2 text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded-full font-medium">
                            🥉 3º LUGAR
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">{student.email}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${isCurrentUser ? 'text-emerald-700' : 'text-gray-700'}`}>
                      {averageScore}%
                    </div>
                    <div className="text-sm text-gray-500">Média Geral</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RankingTab;