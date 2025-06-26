import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Download, Printer, Users, BarChart3, TrendingUp, Calendar, FileText, Eye, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import ReportCharts from '@/components/ReportCharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const AdminReportsPanel = ({ allStudents = [], allNews = [], allEvents = [] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState({
    totalStudents: 0,
    averageScore: 0,
    topPerformer: null,
    totalNews: 0,
    totalEvents: 0,
    performanceDistribution: {},
    subjectAverages: {}
  });

  useEffect(() => {
    setIsLoading(true);
    
    // Calculate report statistics
    const totalStudents = allStudents.length;
    
    if (totalStudents > 0) {
      // Calculate overall average
      let totalScore = 0;
      let validStudentsForAverage = 0;
      
      const studentAverages = allStudents.map(student => {
        const stats = student.stats || {};
        const scores = [
          stats.provaParana || 0,
          stats.saeb || 0,
          stats.provasInternas || 0,
          stats.provasExternas || 0,
          stats.plataformasDigitais || 0,
        ];
        const validScores = scores.filter(s => typeof s === 'number' && !isNaN(s));
        const average = validScores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / validScores.length : 0;
        
        if (!isNaN(average)) {
          totalScore += average;
          validStudentsForAverage++;
        }
        
        return { ...student, averageScore: Math.round(average) };
      });
      
      const overallAverage = validStudentsForAverage > 0 ? Math.round(totalScore / validStudentsForAverage) : 0;
      
      // Find top performer
      const topPerformer = studentAverages.reduce((top, current) => 
        (current.averageScore > (top?.averageScore || 0)) ? current : top, null
      );
      
      // Performance distribution
      const distribution = {
        'Excelente (90-100%)': studentAverages.filter(s => s.averageScore >= 90).length,
        'Muito Bom (80-89%)': studentAverages.filter(s => s.averageScore >= 80 && s.averageScore < 90).length,
        'Bom (70-79%)': studentAverages.filter(s => s.averageScore >= 70 && s.averageScore < 80).length,
        'Regular (60-69%)': studentAverages.filter(s => s.averageScore >= 60 && s.averageScore < 70).length,
        'Precisa Melhorar (<60%)': studentAverages.filter(s => s.averageScore < 60).length,
      };
      
      // Subject averages
      const subjectAverages = {
        'Prova Paraná': Math.round(allStudents.reduce((sum, s) => sum + (s.stats?.provaParana || 0), 0) / totalStudents),
        'Prova Acerta Brasil': Math.round(allStudents.reduce((sum, s) => sum + (s.stats?.saeb || 0), 0) / totalStudents),
        'Rec.Ap.Português': Math.round(allStudents.reduce((sum, s) => sum + (s.stats?.provasInternas || 0), 0) / totalStudents),
        'Rec.Ap.Matemática': Math.round(allStudents.reduce((sum, s) => sum + (s.stats?.provasExternas || 0), 0) / totalStudents),
        'Plataformas Digitais': Math.round(allStudents.reduce((sum, s) => sum + (s.stats?.plataformasDigitais || 0), 0) / totalStudents),
      };
      
      setReportData({
        totalStudents,
        averageScore: overallAverage,
        topPerformer,
        totalNews: allNews.length,
        totalEvents: allEvents.length,
        performanceDistribution: distribution,
        subjectAverages
      });
    } else {
      setReportData({
        totalStudents: 0,
        averageScore: 0,
        topPerformer: null,
        totalNews: allNews.length,
        totalEvents: allEvents.length,
        performanceDistribution: {},
        subjectAverages: {}
      });
    }
    
    setIsLoading(false);
  }, [allStudents, allNews, allEvents]);

  const generatePDF = async () => {
    try {
      setIsLoading(true);
      toast({
        title: "Gerando Relatório",
        description: "Preparando o relatório em PDF. Aguarde alguns segundos...",
      });

      const element = document.getElementById('report-content');
      if (!element) {
        throw new Error('Elemento do relatório não encontrado');
      }

      // Capture the element as canvas with high quality
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Calculate dimensions to fit the page
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      // Add header
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Relatório Acadêmico - 9º Ano', pdfWidth / 2, 20, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Escola Estadual do Campo Vinícius de Moraes', pdfWidth / 2, 28, { align: 'center' });
      pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pdfWidth / 2, 35, { align: 'center' });

      // Add the captured image
      pdf.addImage(imgData, 'PNG', imgX, 45, imgWidth * ratio, imgHeight * ratio);

      // Add footer
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.text(`Página ${i} de ${pageCount}`, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
      }

      // Save the PDF
      pdf.save(`relatorio-academico-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: "Relatório Gerado!",
        description: "O relatório em PDF foi baixado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao Gerar PDF",
        description: "Ocorreu um erro ao gerar o relatório. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    toast({
      title: "Preparando Impressão",
      description: "Seu relatório está sendo preparado para impressão.",
    });
    setTimeout(() => window.print(), 500);
  };

  const StatCard = ({ title, value, icon: Icon, color, description }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white p-4 sm:p-6 rounded-xl shadow-lg border-l-4 ${color} card-hover print:shadow-none print:border`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 print:text-black">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 print:text-black">{value}</p>
          {description && <p className="text-xs text-gray-500 mt-1 print:text-gray-700">{description}</p>}
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-l-4 border-', 'bg-').replace('-500', '-100')} print:bg-gray-200`}>
          <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${color.replace('border-l-4 border-', 'text-')} print:text-gray-700`} />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6 sm:space-y-8 p-4 md:p-6 bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 rounded-xl shadow-inner min-h-[calc(100vh-10rem)]">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-200 print:border-gray-400"
      >
        <div className="flex items-center space-x-3.5">
          <FileSpreadsheet className="w-9 h-9 text-indigo-600" />
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight print:text-black">Relatórios Acadêmicos</h2>
            <p className="text-gray-500 text-sm print:text-gray-700">Análise completa do desempenho da turma do 9º ano.</p>
          </div>
        </div>
        <div className="flex space-x-2 sm:space-x-3 print:hidden">
          <Button
            onClick={handlePrint}
            variant="outline"
            className="border-gray-500 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md px-3 sm:px-4 py-2 text-xs sm:text-sm"
            disabled={isLoading}
          >
            <Printer className="w-4 h-4 mr-1.5 sm:mr-2" />
            Imprimir
          </Button>
          <Button
            onClick={generatePDF}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm"
            disabled={isLoading}
          >
            <Download className="w-4 h-4 mr-1.5 sm:mr-2" />
            {isLoading ? 'Gerando...' : 'Baixar PDF'}
          </Button>
        </div>
      </motion.div>

      <div id="report-content" className="space-y-6 sm:space-y-8">
        {/* Header for Print */}
        <div className="hidden print:block text-center mb-6 border-b border-gray-300 pb-4">
          <h1 className="text-2xl font-bold text-black">Relatório Acadêmico - 9º Ano</h1>
          <h2 className="text-lg text-gray-700">Escola Estadual do Campo Vinícius de Moraes</h2>
          <p className="text-sm text-gray-600">Gerado em: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        {/* Statistics Overview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6"
        >
          <StatCard
            title="Total de Alunos"
            value={reportData.totalStudents}
            icon={Users}
            color="border-blue-500"
            description="Alunos matriculados"
          />
          <StatCard
            title="Média Geral"
            value={`${reportData.averageScore}%`}
            icon={BarChart3}
            color="border-green-500"
            description="Média da turma"
          />
          <StatCard
            title="Melhor Aluno"
            value={reportData.topPerformer ? `${reportData.topPerformer.averageScore}%` : 'N/A'}
            icon={TrendingUp}
            color="border-yellow-500"
            description={reportData.topPerformer?.name || 'Nenhum dado'}
          />
          <StatCard
            title="Notícias Publicadas"
            value={reportData.totalNews}
            icon={FileText}
            color="border-purple-500"
            description="Total de comunicados"
          />
          <StatCard
            title="Eventos Realizados"
            value={reportData.totalEvents}
            icon={Calendar}
            color="border-orange-500"
            description="Atividades programadas"
          />
        </motion.div>

        {/* Performance Distribution */}
        {reportData.totalStudents > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 print:shadow-none print:border-gray-300"
          >
            <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-4 print:text-black">Distribuição de Desempenho</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              {Object.entries(reportData.performanceDistribution).map(([range, count]) => (
                <div key={range} className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg print:bg-gray-100">
                  <p className="text-lg sm:text-2xl font-bold text-gray-800 print:text-black">{count}</p>
                  <p className="text-xs sm:text-sm text-gray-600 print:text-gray-700">{range}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Subject Averages */}
        {reportData.totalStudents > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 print:shadow-none print:border-gray-300"
          >
            <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-4 print:text-black">Médias por Área de Conhecimento</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              {Object.entries(reportData.subjectAverages).map(([subject, average]) => (
                <div key={subject} className="text-center p-3 sm:p-4 bg-gradient-to-br from-emerald-50 to-green-100 rounded-lg print:bg-gray-100">
                  <p className="text-lg sm:text-2xl font-bold text-emerald-700 print:text-black">{average}%</p>
                  <p className="text-xs sm:text-sm text-emerald-600 print:text-gray-700">{subject}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Charts Section */}
        <ReportCharts students={allStudents} isLoading={isLoading} />

        {/* Footer for Print */}
        <div className="hidden print:block text-center mt-8 pt-4 border-t border-gray-300">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Escola Estadual do Campo Vinícius de Moraes. 
            Relatório gerado automaticamente pelo Portal do 9º Ano.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            font-size: 11pt;
            background-color: white !important;
          }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:border { border: 1px solid #ccc !important; }
          .print\\:border-gray-300 { border-color: #d1d5db !important; }
          .print\\:border-gray-400 { border-color: #9ca3af !important; }
          .print\\:bg-gray-100 { background-color: #f3f4f6 !important; }
          .print\\:bg-gray-200 { background-color: #e5e7eb !important; }
          .print\\:text-black { color: black !important; }
          .print\\:text-gray-700 { color: #374151 !important; }
          .print\\:text-gray-600 { color: #4b5563 !important; }
          .min-h-screen { min-height: auto !important; }
          .overflow-y-auto { overflow-y: visible !important; }
          .card-hover { transform: none !important; }
          .card-hover:hover { transform: none !important; box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminReportsPanel;