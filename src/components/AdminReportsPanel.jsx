import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, AlertTriangle, Printer, Award, Download, TrendingUp, TrendingDown, Minus, BookOpen, GraduationCap, Target, Star } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, where, getCountFromServer, Timestamp, getDocs, orderBy } from "firebase/firestore";
import { toast } from '@/components/ui/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ReportCharts from '@/components/ReportCharts'; 

const StatCard = ({ label, value, icon, color, isLoading, trend }) => {
  let TrendIcon = Minus;
  if (trend === 'up') TrendIcon = TrendingUp;
  if (trend === 'down') TrendIcon = TrendingDown;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 25, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } }
      }}
      className={`bg-white p-4 sm:p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-3 sm:space-x-4 card-hover transform hover:-translate-y-2 border-t-4 ${color} relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-8 sm:-translate-y-10 translate-x-8 sm:translate-x-10"></div>
      <div className={`p-3 sm:p-4 rounded-2xl ${color.replace('border-', 'bg-').replace('500', '100')} shadow-lg relative z-10`}>
        {React.cloneElement(icon, { className: `w-6 h-6 sm:w-8 sm:h-8 ${color.replace('border-', 'text-')}` })}
      </div>
      <div className="relative z-10">
        {isLoading ? (
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-16 sm:w-20 animate-pulse mb-1 sm:mb-2"></div>
        ) : (
          <p className="text-2xl sm:text-3xl font-bold text-gray-800">{value}</p>
        )}
        <p className="text-xs sm:text-sm text-gray-600 font-medium">{label}</p>
        {trend && (
          <div className="flex items-center mt-1">
            <TrendIcon className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400'}`} />
            <span className="text-[10px] sm:text-xs text-gray-500">Tendência</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const AdminReportsPanel = ({ allStudents: initialAllStudents }) => {
  const [timeRange, setTimeRange] = useState('all'); 
  const [reportData, setReportData] = useState({
    totalStudents: 0,
    averageScore: 0,
    topPerformers: 0,
    needsAttention: 0,
    startDate: null,
    endDate: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rankedStudentsForReport, setRankedStudentsForReport] = useState([]);
  const reportContentRef = useRef(null);

  const timeRanges = [
    { value: '15d', label: 'Últimos 15 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
    { value: '45d', label: 'Últimos 45 dias' },
    { value: '60d', label: 'Últimos 60 dias' },
    { value: 'all', label: 'Todo o período' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let startDateObj = null;
        let endDateObj = new Date(); 
        if (timeRange !== 'all') {
          const days = parseInt(timeRange.replace('d', ''));
          startDateObj = new Date();
          startDateObj.setDate(startDateObj.getDate() - days);
          startDateObj.setHours(0, 0, 0, 0); 
        }
        
        const studentsQuery = query(collection(db, 'users'), where("type", "==", "student"));
        const studentsSnap = await getCountFromServer(studentsQuery);
        const totalStudents = studentsSnap.data().count;

        const rankedStudents = initialAllStudents
            .map(student => {
                const stats = student.stats || {};
                const scores = [
                    stats.provaParana || 0, stats.saeb || 0, stats.provasInternas || 0,
                    stats.provasExternas || 0, stats.plataformasDigitais || 0,
                ];
                const averageScore = scores.reduce((sum, score) => sum + (Number(score) || 0), 0) / (scores.filter(s => typeof s === 'number' && !isNaN(s)).length || 1);
                return { ...student, averageScore: Math.round(averageScore) };
            })
            .sort((a, b) => {
                if (b.averageScore !== a.averageScore) return b.averageScore - a.averageScore;
                return a.name.localeCompare(b.name);
            });
        
        setRankedStudentsForReport(rankedStudents);

        const overallAverage = rankedStudents.length > 0 
          ? Math.round(rankedStudents.reduce((sum, student) => sum + student.averageScore, 0) / rankedStudents.length)
          : 0;

        const topPerformers = rankedStudents.filter(student => student.averageScore >= 80).length;
        const needsAttention = rankedStudents.filter(student => student.averageScore < 60).length;

        setReportData({
          totalStudents,
          averageScore: overallAverage,
          topPerformers,
          needsAttention,
          startDate: startDateObj ? startDateObj.toLocaleDateString('pt-BR') : 'Início',
          endDate: endDateObj.toLocaleDateString('pt-BR'),
        });

      } catch (err) {
        console.error("Erro ao buscar dados para relatórios:", err);
        setError("Não foi possível carregar os dados. Verifique o console para detalhes.");
        toast({ title: "Erro nos Relatórios", description: err.message, variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [timeRange, initialAllStudents]);

  const reportCardsData = [
    { label: "Total de Alunos", value: reportData.totalStudents, icon: <Users />, color: "border-emerald-500", trend: "stable" },
    { label: "Média Geral da Turma", value: `${reportData.averageScore}%`, icon: <BarChart3 />, color: "border-sky-500", trend: "up" },
    { label: "Alto Desempenho (≥80%)", value: reportData.topPerformers, icon: <Star />, color: "border-amber-500", trend: "up" },
    { label: "Precisam de Atenção (<60%)", value: reportData.needsAttention, icon: <Target />, color: "border-red-500", trend: "down" },
  ];
  
  const handlePrintReport = () => {
    toast({ title: "Preparando para Impressão...", description: "A janela de impressão do seu navegador será aberta." });
    setTimeout(() => window.print(), 500);
  };

  const handleDownloadPdf = async () => {
    toast({ title: "Gerando PDF...", description: "Isso pode levar alguns segundos. Por favor, aguarde." });
    const input = reportContentRef.current;
    if (!input) {
      toast({ title: "Erro", description: "Não foi possível encontrar o conteúdo do relatório.", variant: "destructive" });
      return;
    }
    try {
      const canvas = await html2canvas(input, { scale: 2, useCORS: true, logging: false,
        onclone: (document) => {
          Array.from(document.querySelectorAll('.print\\:hidden-for-pdf')).forEach(el => el.style.display = 'none');
          Array.from(document.querySelectorAll('.print\\:visible-for-pdf')).forEach(el => el.style.display = 'block');
        }
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }
      pdf.save(`relatorio_escolar_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`);
      toast({ title: "PDF Gerado!", description: "Seu relatório foi baixado com sucesso." });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({ title: "Erro ao Gerar PDF", description: "Ocorreu um erro. Tente usar a opção de imprimir.", variant: "destructive" });
    }
  };

  const getMedalColor = (position) => {
    if (position === 1) return "text-yellow-400";
    if (position === 2) return "text-gray-400";
    if (position === 3) return "text-amber-600";
    return "text-gray-700";
  };

  return (
    <div className="space-y-6 sm:space-y-8 p-3 sm:p-4 md:p-6 bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 rounded-2xl shadow-2xl min-h-[calc(100vh-6rem)] sm:min-h-[calc(100vh-8rem)]">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 sm:pb-6 border-b-2 border-gray-200 print:hidden"
      >
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="p-2 sm:p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
            <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">Relatórios Acadêmicos</h2>
            <p className="text-gray-600 text-xs sm:text-sm">Análise completa do desempenho dos alunos do 9º ano.</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)} 
              className="w-full pl-3 sm:pl-4 pr-6 sm:pr-8 py-2 sm:py-3 border border-gray-300 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs sm:text-sm appearance-none bg-white hover:shadow-lg transition-all"
            >
              {timeRanges.map(range => (<option key={range.value} value={range.value}>{range.label}</option>))}
            </select>
          </div>
          <Button className="bg-sky-600 hover:bg-sky-700 text-white shadow-lg hover:shadow-xl transition-all w-full sm:w-auto py-2 sm:py-3 px-3 sm:px-5 rounded-xl text-xs sm:text-sm" onClick={handleDownloadPdf} disabled={isLoading}>
            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2.5" />{isLoading ? "Carregando..." : "Baixar PDF"}
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all w-full sm:w-auto py-2 sm:py-3 px-3 sm:px-5 rounded-xl text-xs sm:text-sm" onClick={handlePrintReport}>
            <Printer className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2.5" />Imprimir
          </Button>
        </div>
      </motion.div>

      <div ref={reportContentRef} className="report-content bg-white p-4 sm:p-6 print:p-4 print:shadow-none print:border-none rounded-2xl shadow-xl">
        <div className="print-header print:visible-for-pdf hidden mb-6 sm:mb-8 text-center border-b-2 pb-4 sm:pb-6 border-gray-300">
            <img src="https://storage.googleapis.com/hostinger-horizons-assets-prod/5106ab5f-59ac-4270-81fc-d7e48fdc8ddd/fabd3a46ec76ba6fff9fec1d4c650677.jpg" alt="Logo Escola" className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 sm:mb-3 rounded-full shadow-md p-1 bg-emerald-50 border border-emerald-200"/>
            <h1 className="text-xl sm:text-2xl font-bold text-emerald-700">Escola Estadual do Campo Vinícius de Moraes</h1>
            <p className="text-sm sm:text-md text-gray-700">Relatório Acadêmico do 9º Ano</p>
            <p className="text-xs sm:text-sm text-gray-500">Período: {reportData.startDate} até {reportData.endDate}</p>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1">Gerado em: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
        </div>

        {error && ( 
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 sm:p-5 rounded-lg shadow-lg flex items-center print:hidden mb-4 sm:mb-6" role="alert"> 
            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 mr-2.5 sm:mr-3.5" /> 
            <p className="text-xs sm:text-sm">{error}</p> 
          </motion.div> 
        )}

        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }}} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {reportCardsData.map((card) => ( <StatCard key={card.label} {...card} isLoading={isLoading} /> ))}
        </motion.div>
        
        <ReportCharts students={rankedStudentsForReport} isLoading={isLoading} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }} className="bg-white p-0 md:p-4 sm:md:p-6 rounded-2xl shadow-xl mt-8 sm:mt-10 border border-gray-200 print:shadow-none print:border-gray-300 print:p-0">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-5 p-3 sm:p-4 bg-gradient-to-r from-emerald-500 to-green-600 rounded-t-2xl">
            <Award className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-300" />
            <h3 className="text-lg sm:text-xl font-semibold text-white tracking-wide">Ranking Acadêmico Detalhado</h3>
          </div>
          {isLoading ? (<p className="text-gray-500 text-center py-4 sm:py-6 text-sm sm:text-base">Carregando ranking...</p>)
          : rankedStudentsForReport.length > 0 ? (
            <div className="overflow-x-auto print:overflow-visible rounded-b-2xl">
              <table className="w-full text-xs sm:text-sm print:text-[8pt]">
                <thead className="bg-gray-100 print:bg-gray-200">
                  <tr className="shadow-sm">
                    <th className="p-2 sm:p-3 text-left font-bold text-gray-600">#</th>
                    <th className="p-2 sm:p-3 text-left font-bold text-gray-600">Aluno</th>
                    <th className="p-2 sm:p-3 text-center font-bold text-gray-600">P. Paraná</th>
                    <th className="p-2 sm:p-3 text-center font-bold text-gray-600">Prova Acerta Brasil</th>
                    <th className="p-2 sm:p-3 text-center font-bold text-gray-600">Rec.Ap.Português</th>
                    <th className="p-2 sm:p-3 text-center font-bold text-gray-600">Rec.Ap.Matemática</th>
                    <th className="p-2 sm:p-3 text-center font-bold text-gray-600">Plataformas</th>
                    <th className="p-2 sm:p-3 text-center font-bold text-gray-600">Frequência</th>
                    <th className="p-2 sm:p-3 text-center font-bold text-emerald-700">Média</th>
                  </tr>
                </thead>
                <tbody>
                  {rankedStudentsForReport.map((student, index) => (
                    <tr key={student.id} className={`border-b border-gray-200 print:border-gray-300 ${index % 2 === 0 ? 'bg-white print:bg-white' : 'bg-gray-50/70 print:bg-gray-100'} hover:bg-emerald-50/50 transition-colors`}>
                      <td className={`p-2 sm:p-3 font-bold ${getMedalColor(index + 1)}`}>{index + 1}º</td>
                      <td className="p-2 sm:p-3 font-medium text-gray-800">{student.name}</td>
                      <td className="p-2 sm:p-3 text-center">{student.stats?.provaParana || 0}%</td>
                      <td className="p-2 sm:p-3 text-center">{student.stats?.saeb || 0}%</td>
                      <td className="p-2 sm:p-3 text-center">{student.stats?.provasInternas || 0}%</td>
                      <td className="p-2 sm:p-3 text-center">{student.stats?.provasExternas || 0}%</td>
                      <td className="p-2 sm:p-3 text-center">{student.stats?.plataformasDigitais || 0}%</td>
                      <td className="p-2 sm:p-3 text-center">{student.stats?.frequencia || 0}%</td>
                      <td className="p-2 sm:p-3 text-center font-extrabold text-emerald-600">{student.averageScore || 0}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (<p className="text-gray-500 text-center py-4 sm:py-6 text-sm sm:text-base">Nenhum aluno no ranking.</p>)}
        </motion.div>

        {/* Insights Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.5 }} className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 rounded-2xl border border-blue-200 shadow-lg">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              <h4 className="text-base sm:text-lg font-semibold text-blue-800">Análise de Desempenho</h4>
            </div>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-blue-700">
              <p>• <strong>{reportData.topPerformers}</strong> alunos com excelente desempenho (≥80%)</p>
              <p>• <strong>{rankedStudentsForReport.filter(s => s.averageScore >= 60 && s.averageScore < 80).length}</strong> alunos com bom desempenho (60-79%)</p>
              <p>• <strong>{reportData.needsAttention}</strong> alunos precisam de atenção especial (<60%)</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 sm:p-6 rounded-2xl border border-green-200 shadow-lg">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              <h4 className="text-base sm:text-lg font-semibold text-green-800">Recomendações</h4>
            </div>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-green-700">
              <p>• Reforço em matemática para alunos com baixo desempenho</p>
              <p>• Programa de mentoria entre alunos de alto e baixo rendimento</p>
              <p>• Atividades extras para manter motivação dos top performers</p>
            </div>
          </div>
        </motion.div>
      </div>
        <style jsx global>{`
            .print-header { display: none; } 
            @media print {
              body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; margin:0; padding:0; font-size: 9pt; background-color: white !important; }
              .report-content { padding: 8mm !important; width: 100% !important; box-sizing: border-box; box-shadow: none !important; border: none !important; }
              .print-header { display: block !important; } 
              .print\\:hidden { display: none !important; }
              .print\\:visible-for-pdf { display: block !important; }
              .print\\:hidden-for-pdf { display: none !important; }
              .shadow-inner, .shadow-lg, .shadow-xl, .shadow-2xl { box-shadow: none !important; }
              .rounded-xl, .rounded-lg, .rounded-2xl { border-radius: 0 !important; }
              .border-t-4 { border-top-width: 2px !important; } 
              .bg-gradient-to-br, .bg-white, .bg-slate-50, .bg-gray-50, .bg-stone-100, .bg-stone-200 { background: none !important; background-color: white !important; }
              .text-gray-800, .text-gray-700, .text-gray-600, .text-gray-500, .text-gray-400, .text-slate-500, .text-slate-400 { color: black !important; }
              .text-indigo-600, .text-indigo-700 { color: #4338ca !important; }
              .border-emerald-500 { border-color: #10b981 !important; } .text-emerald-700 { color: #047857 !important; }
              .border-sky-500 { border-color: #0ea5e9 !important; }
              .border-purple-500 { border-color: #a855f7 !important; }
              .border-amber-500 { border-color: #f59e0b !important; }
              .text-emerald-600 { color: #059669 !important; }
              .text-yellow-400 { color: #facc15 !important; }
              .text-amber-600 { color: #d97706 !important; }
              table { width: 100% !important; border-collapse: collapse !important; }
              th, td { border: 1px solid #e5e7eb !important; padding: 5px !important; text-align: left !important; word-break: break-word; }
              th { background-color: #f9fafb !important; font-weight: bold !important;}
              .overflow-x-auto { overflow-x: visible !important; }
              .p-0, .md\\:p-6 { padding:0 !important} /* Override padding for print */
            }
      `}</style>
    </div>
  );
};

export default AdminReportsPanel;