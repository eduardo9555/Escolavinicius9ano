import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, Users, BarChart3, TrendingUp, Download, Calendar, Award, BookOpen, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import ReportCharts from '@/components/ReportCharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const StatCard = ({ label, value, icon: Icon, color, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className={`bg-white p-4 sm:p-6 rounded-xl shadow-lg border-l-4 ${color} card-hover`}
  >
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color.replace('border-', 'text-')}`} />
          <h3 className="text-sm sm:text-base font-semibold text-gray-700">{label}</h3>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-gray-800">{value}</p>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">{description}</p>
      </div>
    </div>
  </motion.div>
);

const AdminReportsPanel = ({ allStudents = [], allNews = [], allEvents = [] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState({
    totalStudents: 0,
    averageScore: 0,
    topPerformer: null,
    attendanceRate: 0,
    totalNews: 0,
    totalEvents: 0,
  });

  useEffect(() => {
    setIsLoading(true);
    
    // Calculate report statistics
    const totalStudents = allStudents.length;
    
    let totalScore = 0;
    let totalAttendance = 0;
    let topPerformer = null;
    let highestScore = 0;

    allStudents.forEach(student => {
      if (student.stats) {
        const { provaParana = 0, saeb = 0, provasInternas = 0, provasExternas = 0, plataformasDigitais = 0, frequencia = 0 } = student.stats;
        const studentAverage = (provaParana + saeb + provasInternas + provasExternas + plataformasDigitais) / 5;
        
        if (!isNaN(studentAverage)) {
          totalScore += studentAverage;
          
          if (studentAverage > highestScore) {
            highestScore = studentAverage;
            topPerformer = student;
          }
        }
        
        if (!isNaN(frequencia)) {
          totalAttendance += frequencia;
        }
      }
    });

    const averageScore = totalStudents > 0 ? Math.round(totalScore / totalStudents) : 0;
    const attendanceRate = totalStudents > 0 ? Math.round(totalAttendance / totalStudents) : 0;

    setReportData({
      totalStudents,
      averageScore,
      topPerformer,
      attendanceRate,
      totalNews: allNews.length,
      totalEvents: allEvents.length,
    });

    setIsLoading(false);
  }, [allStudents, allNews, allEvents]);

  const generatePDFReport = async () => {
    try {
      toast({
        title: "Gerando Relatório",
        description: "Preparando o relatório em PDF...",
      });

      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      // Header
      pdf.setFontSize(20);
      pdf.setFont(undefined, 'bold');
      pdf.text('Relatório Acadêmico - 9º Ano', pageWidth / 2, 30, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'normal');
      pdf.text('Escola Estadual do Campo Vinícius de Moraes', pageWidth / 2, 40, { align: 'center' });
      pdf.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, 50, { align: 'center' });

      // Statistics
      let yPosition = 70;
      pdf.setFontSize(16);
      pdf.setFont(undefined, 'bold');
      pdf.text('Estatísticas Gerais', 20, yPosition);
      
      yPosition += 20;
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'normal');
      
      const stats = [
        `Total de Alunos: ${reportData.totalStudents}`,
        `Média Geral da Turma: ${reportData.averageScore}%`,
        `Taxa de Frequência: ${reportData.attendanceRate}%`,
        `Notícias Publicadas: ${reportData.totalNews}`,
        `Eventos Agendados: ${reportData.totalEvents}`,
      ];

      stats.forEach(stat => {
        pdf.text(stat, 20, yPosition);
        yPosition += 10;
      });

      if (reportData.topPerformer) {
        yPosition += 10;
        pdf.setFont(undefined, 'bold');
        pdf.text('Melhor Desempenho:', 20, yPosition);
        yPosition += 10;
        pdf.setFont(undefined, 'normal');
        pdf.text(`${reportData.topPerformer.name} - ${Math.round(reportData.topPerformer.averageScore || 0)}%`, 20, yPosition);
      }

      // Student List
      if (allStudents.length > 0) {
        yPosition += 30;
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        pdf.text('Lista de Alunos', 20, yPosition);
        
        yPosition += 20;
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        
        allStudents.forEach((student, index) => {
          if (yPosition > 250) {
            pdf.addPage();
            yPosition = 30;
          }
          
          const stats = student.stats || {};
          const average = Math.round(
            ((stats.provaParana || 0) + (stats.saeb || 0) + (stats.provasInternas || 0) + 
             (stats.provasExternas || 0) + (stats.plataformasDigitais || 0)) / 5
          );
          
          pdf.text(`${index + 1}. ${student.name} - Média: ${average}% - Frequência: ${stats.frequencia || 0}%`, 20, yPosition);
          yPosition += 8;
        });
      }

      pdf.save(`relatorio-9ano-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: "Relatório Gerado!",
        description: "O relatório PDF foi baixado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao Gerar Relatório",
        description: "Ocorreu um erro ao gerar o relatório PDF.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 rounded-xl shadow-inner min-h-[calc(100vh-10rem)]">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-200"
      >
        <div className="flex items-center space-x-3">
          <FileSpreadsheet className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600" />
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">Relatórios e Análises</h2>
            <p className="text-gray-500 text-sm">Visualize estatísticas e gere relatórios detalhados</p>
          </div>
        </div>
        
        <Button
          onClick={generatePDFReport}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105 rounded-lg px-4 sm:px-6 py-2.5 sm:py-3"
          disabled={isLoading}
        >
          <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Gerar Relatório PDF
        </Button>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          label="Total de Alunos"
          value={reportData.totalStudents}
          icon={Users}
          color="border-blue-500"
          description="Alunos cadastrados no sistema"
        />
        <StatCard
          label="Média Geral"
          value={`${reportData.averageScore}%`}
          icon={BarChart3}
          color="border-green-500"
          description="Média de todas as avaliações"
        />
        <StatCard
          label="Taxa de Frequência"
          value={`${reportData.attendanceRate}%`}
          icon={Calendar}
          color="border-purple-500"
          description="Frequência média dos alunos"
        />
        <StatCard
          label="Notícias Publicadas"
          value={reportData.totalNews}
          icon={BookOpen}
          color="border-amber-500"
          description="Total de comunicados"
        />
        <StatCard
          label="Eventos Agendados"
          value={reportData.totalEvents}
          icon={Activity}
          color="border-pink-500"
          description="Atividades programadas"
        />
        {reportData.topPerformer && (
          <StatCard
            label="Melhor Desempenho"
            value={reportData.topPerformer.name}
            icon={Award}
            color="border-yellow-500"
            description={`${Math.round(reportData.topPerformer.averageScore || 0)}% de média`}
          />
        )}
      </div>

      {/* Performance Analysis Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-white p-4 sm:p-6 rounded-xl shadow-xl border border-gray-200"
      >
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600" />
          <h3 className="text-lg sm:text-xl font-bold text-gray-700">Análise de Desempenho</h3>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Carregando análises...</p>
          </div>
        ) : allStudents.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Distribuição de Notas</h4>
                <div className="space-y-1">
                  <div>Excelente (90-100%): {allStudents.filter(s => (s.averageScore || 0) >= 90).length} alunos</div>
                  <div>Muito Bom (80-89%): {allStudents.filter(s => (s.averageScore || 0) >= 80 && (s.averageScore || 0) < 90).length} alunos</div>
                  <div>Bom (70-79%): {allStudents.filter(s => (s.averageScore || 0) >= 70 && (s.averageScore || 0) < 80).length} alunos</div>
                  <div>Regular (60-69%): {allStudents.filter(s => (s.averageScore || 0) >= 60 && (s.averageScore || 0) < 70).length} alunos</div>
                  <div>Precisa Melhorar (&lt;60%): {allStudents.filter(s => (s.averageScore || 0) < 60).length} alunos</div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">Resumo Estatístico</h4>
                <div className="space-y-1">
                  <div>Maior nota: {Math.max(...allStudents.map(s => s.averageScore || 0))}%</div>
                  <div>Menor nota: {Math.min(...allStudents.map(s => s.averageScore || 0))}%</div>
                  <div>Mediana: {allStudents.length > 0 ? Math.round(allStudents.sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0))[Math.floor(allStudents.length / 2)]?.averageScore || 0) : 0}%</div>
                  <div>Alunos acima da média: {allStudents.filter(s => (s.averageScore || 0) > reportData.averageScore).length}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum dado de aluno disponível para análise</p>
          </div>
        )}
      </motion.div>

      {/* Charts Section */}
      <ReportCharts students={allStudents} isLoading={isLoading} />
    </div>
  );
};

export default AdminReportsPanel;