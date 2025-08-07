import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Printer, BarChartHorizontal, Users, PieChart, TrendingUp, TrendingDown, Minus, FileText } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';


const ReportStatCard = ({ label, value, icon: Icon, color, trend }) => {
  let TrendIcon = Minus;
  if (trend === 'up') TrendIcon = TrendingUp;
  if (trend === 'down') TrendIcon = TrendingDown;

  return (
    <div className={`p-3 sm:p-4 rounded-lg shadow-md border-l-4 ${color} print:shadow-none print:border`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-1.5 sm:space-x-2 text-gray-700 print:text-black">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm font-medium">{label}</span>
        </div>
        <TrendIcon className={`w-4 h-4 sm:w-5 sm:h-5 print:hidden ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'}`} />
      </div>
      <p className="text-xl sm:text-2xl font-bold text-gray-800 print:text-black">{value || 0}%</p>
      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5 print:bg-gray-300">
        <div 
            className={`h-1.5 rounded-full ${color.replace('border-l-4 border-', 'bg-')} print:bg-gray-700`} 
            style={{ width: `${value || 0}%` }}
        />
      </div>
    </div>
  );
};


const StudentReportPage = ({ student, onClose }) => {
  if (!student) return null;

  const schoolInfo = {
    name: "Escola Estadual do Campo Vinícius de Moraes",
    grade: "Portal do 9º Ano",
    logoUrl: "/google-logo.svg"
  };
  
  const stats = student.stats || {};
  const averageScore = Math.round(
    ( (stats.provaParana || 0) + 
      (stats.saeb || 0) + 
      (stats.provasInternas || 0) + 
      (stats.provasExternas || 0) +
      (stats.plataformasDigitais || 0)
    ) / 5
  );

  const performanceData = [
    { label: "Prova Paraná", value: stats.provaParana, icon: BarChartHorizontal, color: "border-blue-500", trend: stats.provaParanaTrend },
    { label: "Prova Acerta Brasil", value: stats.saeb, icon: BarChartHorizontal, color: "border-green-500", trend: stats.saebTrend },
    { label: "Rec.Ap.Português", value: stats.provasInternas, icon: BarChartHorizontal, color: "border-yellow-500", trend: stats.internasTrend },
    { label: "Rec.Ap.Matemática", value: stats.provasExternas, icon: BarChartHorizontal, color: "border-purple-500", trend: stats.externasTrend },
    { label: "Frequência", value: stats.frequencia, icon: Users, color: "border-pink-500", trend: stats.frequenciaTrend },
    { label: "Plataformas Digitais", value: stats.plataformasDigitais, icon: PieChart, color: "border-orange-500", trend: stats.plataformasDigitaisTrend },
  ];

  const handlePrint = () => {
    toast({
      title: "Preparando Impressão",
      description: "Seu relatório está sendo preparado para impressão."
    });
    setTimeout(() => window.print(), 500);
  };

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-100 p-2 sm:p-4 md:p-8 print:p-0 overflow-y-auto z-[9999]" // Ensure high z-index
    >
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg print:shadow-none print:rounded-none">
        <header className="bg-emerald-600 text-white p-4 sm:p-6 rounded-t-lg print:bg-emerald-600 print:text-white print:rounded-none">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <img src={schoolInfo.logoUrl} alt="Logo da Escola" className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-white bg-white p-0.5" />
              <div>
                <h1 className="text-lg sm:text-2xl font-bold">{schoolInfo.name}</h1>
                <p className="text-xs sm:text-sm opacity-90">{schoolInfo.grade} - Relatório de Desempenho</p>
              </div>
            </div>
            <div className="print:hidden flex space-x-1 sm:space-x-2">
                <Button variant="outline" size="icon" onClick={handlePrint} className="bg-white/20 text-white hover:bg-white/30 border-white/50 h-8 w-8 sm:h-10 sm:w-10">
                    <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                <Button variant="outline" size="icon" onClick={onClose} className="bg-white/20 text-white hover:bg-white/30 border-white/50 h-8 w-8 sm:h-10 sm:w-10">
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
          <section className="border-b pb-4 sm:pb-6 mb-4 sm:mb-6 print:border-gray-400">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-1 print:text-black">Dados do Aluno</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-1 sm:gap-y-2 text-xs sm:text-sm">
              <p><strong className="font-medium text-gray-600 print:text-black">Nome:</strong> {student.name}</p>
              <p><strong className="font-medium text-gray-600 print:text-black">Email:</strong> {student.email}</p>
              <p><strong className="font-medium text-gray-600 print:text-black">Turma:</strong> 9º Ano</p>
              <p><strong className="font-medium text-gray-600 print:text-black">Data do Relatório:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 sm:mb-4 print:text-black">Resumo do Desempenho</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {performanceData.map(item => (
                <ReportStatCard key={item.label} {...item} />
              ))}
            </div>
            <div className="mt-4 sm:mt-6 bg-emerald-50 p-4 sm:p-5 rounded-lg border border-emerald-200 text-center print:bg-gray-100 print:border-gray-400">
                <h3 className="text-base sm:text-lg font-semibold text-emerald-700 print:text-black">Média Geral Calculada</h3>
                <p className="text-3xl sm:text-4xl font-bold text-emerald-600 mt-1 print:text-black">{averageScore}%</p>
            </div>
          </section>

          <section className="pt-4 sm:pt-6 border-t mt-6 sm:mt-8 print:border-gray-400">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3 print:text-black">Observações</h2>
            <div className="min-h-[60px] sm:min-h-[80px] p-2 sm:p-3 border border-dashed border-gray-300 rounded-md text-gray-500 text-xs sm:text-sm print:border-gray-600 print:text-black">
              <p>Espaço reservado para observações da secretaria ou professores.</p>
            </div>
          </section>
        </main>

        <footer className="text-center text-[10px] sm:text-xs text-gray-500 p-4 sm:p-6 border-t print:mt-6 sm:print:mt-8 print:border-gray-400 print:text-black">
          <p>&copy; {new Date().getFullYear()} {schoolInfo.name}. Todos os direitos reservados..</p>
          <p>Este é um relatório gerado automaticamente pelo Portal do 9º Ano.</p>
        </footer>
      </div>
       <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            margin:0;
            padding:0;
            font-family: Arial, sans-serif; /* Common print font */
            font-size: 11pt; /* Standard print size */
            background-color: white !important;
          }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:rounded-none { border-radius: 0 !important; }
          .print\\:hidden { display: none !important; }
          .print\\:bg-emerald-600 { background-color: #059669 !important; color: white !important; }
          .print\\:text-white { color: white !important; }
          .print\\:border { border: 1px solid #ccc !important; }
          .print\\:border-gray-400 { border-color: #9ca3af !important; }
          .print\\:bg-gray-100 { background-color: #f3f4f6 !important; }
          .print\\:bg-gray-300 { background-color: #d1d5db !important; }
          .print\\:bg-gray-700 { background-color: #374151 !important; }
          .print\\:text-black { color: black !important; }
          .fixed { position: static !important; } /* Override fixed position for print */
          .overflow-y-auto { overflow-y: visible !important; }
          .min-h-screen { min-height: auto !important; }
          .max-w-4xl { max-width: 100% !important; margin: 0 auto !important; }
          .rounded-lg, .rounded-t-lg { border-radius: 0 !important; }
        }
      `}</style>
    </motion.div>
  );
};

export default StudentReportPage;