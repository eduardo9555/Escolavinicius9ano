import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { motion } from 'framer-motion';
import { Users, BarChartHorizontal, TrendingUp, BookOpen } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const ReportCharts = ({ students, isLoading }) => {
  if (isLoading) {
    return (
      <div className="mt-10 p-8 bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl border border-dashed border-slate-300 text-center print:hidden shadow-lg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 text-slate-400 mx-auto mb-4"
        >
            <Users/>
        </motion.div>
        <p className="text-slate-600 font-semibold text-lg">Carregando análises acadêmicas...</p>
        <p className="text-sm text-slate-400 mt-2">Preparando gráficos de desempenho dos alunos.</p>
      </div>
    );
  }

  const studentAverageScores = students.map(s => s.averageScore || 0);
  const averageScoreDistribution = {
    'Excelente (90-100%)': studentAverageScores.filter(s => s >= 90).length,
    'Muito Bom (80-89%)': studentAverageScores.filter(s => s >= 80 && s < 90).length,
    'Bom (70-79%)': studentAverageScores.filter(s => s >= 70 && s < 80).length,
    'Regular (60-69%)': studentAverageScores.filter(s => s >= 60 && s < 70).length,
    'Precisa Melhorar (<60%)': studentAverageScores.filter(s => s < 60).length,
  };

  const barChartData = {
    labels: Object.keys(averageScoreDistribution),
    datasets: [
      {
        label: 'Número de Alunos',
        data: Object.values(averageScoreDistribution),
        backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(249, 115, 22, 0.8)',
            'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
            'rgb(34, 197, 94)',
            'rgb(59, 130, 246)',
            'rgb(245, 158, 11)',
            'rgb(249, 115, 22)',
            'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: [
            'rgba(34, 197, 94, 0.9)',
            'rgba(59, 130, 246, 0.9)',
            'rgba(245, 158, 11, 0.9)',
            'rgba(249, 115, 22, 0.9)',
            'rgba(239, 68, 68, 0.9)',
        ]
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top', 
        labels: { 
          font: { size: 14, family: 'Inter', weight: 'bold' }, 
          color: '#374151',
          padding: 20
        } 
      },
      title: { 
        display: true, 
        text: 'Distribuição de Desempenho dos Alunos', 
        font: { size: 18, family: 'Inter', weight: 'bold' }, 
        color: '#1f2937', 
        padding: { bottom: 30 } 
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: { family: 'Inter', weight: 'bold', size: 14 },
        bodyFont: { family: 'Inter', size: 12 },
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((context.parsed.y / total) * 100).toFixed(1) : 0;
            return `${context.dataset.label}: ${context.parsed.y} alunos (${percentage}%)`;
          }
        }
      }
    },
    scales: {
      y: { 
        beginAtZero: true, 
        title: { 
          display: true, 
          text: 'Número de Alunos', 
          font: { family: 'Inter', weight: 'semibold', size: 14 }, 
          color: '#4B5563' 
        },
        ticks: { 
          stepSize: 1, 
          font: { family: 'Inter', size: 12 }, 
          color: '#6B7280' 
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.3)'
        }
      },
      x: {
        title: { 
          display: true, 
          text: 'Faixas de Desempenho', 
          font: { family: 'Inter', weight: 'semibold', size: 14 }, 
          color: '#4B5563' 
        },
        ticks: { 
          font: { family: 'Inter', size: 11 }, 
          color: '#6B7280',
          maxRotation: 45
        },
        grid: {
          display: false
        }
      }
    },
  };

  // Subject performance analysis
  const subjectAverages = {
    'Prova Paraná': students.reduce((sum, s) => sum + (s.stats?.provaParana || 0), 0) / (students.length || 1),
    'Prova Acerta Brasil': students.reduce((sum, s) => sum + (s.stats?.saeb || 0), 0) / (students.length || 1),
    'Rec.Ap.Português': students.reduce((sum, s) => sum + (s.stats?.provasInternas || 0), 0) / (students.length || 1),
    'Rec.Ap.Matematica': students.reduce((sum, s) => sum + (s.stats?.provasExternas || 0), 0) / (students.length || 1),
    'Plataformas Digitais': students.reduce((sum, s) => sum + (s.stats?.plataformasDigitais || 0), 0) / (students.length || 1),
  };

  const pieChartData = {
    labels: Object.keys(subjectAverages),
    datasets: [
      {
        label: 'Média por Área',
        data: Object.values(subjectAverages).map(avg => Math.round(avg)),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', 
          'rgba(34, 197, 94, 0.8)', 
          'rgba(245, 158, 11, 0.8)',
          'rgba(168, 85, 247, 0.8)', 
          'rgba(249, 115, 22, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)', 
          'rgb(34, 197, 94)', 
          'rgb(245, 158, 11)',
          'rgb(168, 85, 247)', 
          'rgb(249, 115, 22)'
        ],
        borderWidth: 2,
        hoverOffset: 12,
        hoverBorderColor: 'rgba(255, 255, 255, 1)',
        hoverBorderWidth: 3,
      },
    ],
  };
  
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'right', 
        labels: { 
          font: { size: 12, family: 'Inter', weight: 'semibold' }, 
          color: '#374151', 
          boxWidth: 20, 
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        } 
      },
      title: { 
        display: true, 
        text: 'Desempenho Médio por Área de Conhecimento', 
        font: { size: 18, family: 'Inter', weight: 'bold' }, 
        color: '#1f2937', 
        padding: { bottom: 30 } 
      },
       tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: { family: 'Inter', weight: 'bold', size: 14 },
        bodyFont: { family: 'Inter', size: 12 },
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${value}% (média da turma)`;
          }
        }
      }
    },
  };

  if (students.length === 0) {
    return (
         <motion.div 
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.2, duration: 0.5 }}
            className="mt-10 p-8 bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl border-2 border-dashed border-slate-300 text-center print:hidden shadow-lg"
        >
            <BarChartHorizontal className="w-20 h-20 text-slate-400 mx-auto mb-6 animate-pulse"/>
            <h4 className="text-2xl text-slate-600 font-bold mb-3">Sem dados para análise</h4>
            <p className="text-sm text-slate-500">
              Os gráficos de desempenho acadêmico aparecerão aqui quando houver dados dos alunos.
            </p>
        </motion.div>
    );
  }

  return (
    <motion.div 
        initial={{ opacity:0 }}
        animate={{ opacity:1 }}
        transition={{ delay:0.3, duration:0.6 }}
        className="mt-10 space-y-10"
    >
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-200 print:shadow-none print:border-gray-300 card-hover">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="text-xl font-bold text-gray-700 print:text-base">Análise de Desempenho Acadêmico</h4>
        </div>
        <div className="h-[400px] md:h-[500px] print:h-[300px]">
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-200 print:shadow-none print:border-gray-300 card-hover">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <BookOpen className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="text-xl font-bold text-gray-700 print:text-base">Desempenho por Área de Conhecimento</h4>
        </div>
        <div className="h-[400px] md:h-[450px] print:h-[280px] mx-auto max-w-2xl">
             <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>
    </motion.div>
  );
};

export default ReportCharts;