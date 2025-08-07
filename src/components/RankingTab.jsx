import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Trophy, Medal, Star } from 'lucide-react';

const RankingTab = ({ user, allStudents }) => {
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
    return avgB - avgA;
  }) : [];

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
          <h1 className="text-3xl font-bold text-emerald-800">Ranking Geral</h1>
        </div>
        <p className="text-emerald-600 text-lg">
          Confira a classificação dos alunos baseada no desempenho geral
        </p>
      </div>

      <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Classificação dos Estudantes</h2>
        
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
              
              const isCurrentUser = student.uid === user.uid || student.email === user.email;

              return (
                <motion.div
                  key={student.id || student.uid}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                    isCurrentUser 
                      ? 'bg-emerald-50 border-emerald-300 shadow-lg' 
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
                        {isCurrentUser && <span className="ml-2 text-sm text-emerald-600">(Você)</span>}
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