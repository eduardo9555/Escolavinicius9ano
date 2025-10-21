import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Users, Plus, Edit, Trash2, Search, ChevronDown, ChevronUp, BarChartHorizontal, TrendingUp, TrendingDown, Minus, Activity, PieChart, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import StudentForm from '@/components/StudentForm';
import StudentTable from '@/components/StudentTable';
import { db, auth } from '@/lib/firebase';
import { collection, onSnapshot, updateDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp, addDoc, setDoc, getDoc } from "firebase/firestore";

const ScoreCard = ({ label, value, icon, color, trend }) => {
  let TrendIcon;
  let trendColor = "text-gray-500";
  const displayValue = value === null || typeof value === 'undefined' ? 0 : value;


  if (trend === 'up') {
    TrendIcon = TrendingUp;
    trendColor = "text-green-500";
  } else if (trend === 'down') {
    TrendIcon = TrendingDown;
    trendColor = "text-red-500";
  } else {
    TrendIcon = Minus;
  }

  return (
    <motion.div 
      className={`bg-white p-3 sm:p-4 rounded-xl shadow-lg border-l-4 ${color} card-hover`}
      whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-1.5 sm:space-x-2 text-gray-600">
          {React.cloneElement(icon, { className: "w-4 h-4 sm:w-5 sm:h-5" })}
          <span className="text-xs sm:text-sm font-medium">{label}</span>
        </div>
        {TrendIcon && <TrendIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${trendColor}`} />}
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-gray-800">{displayValue}%</p>
      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
        <motion.div 
          className={`h-1.5 rounded-full ${color.replace('border-l-4', '').replace('border-', 'bg-')}`}
          initial={{ width: 0 }}
          animate={{ width: `${displayValue}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
};


const AdminPanel = () => {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [selectedStudentForScores, setSelectedStudentForScores] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [firestoreError, setFirestoreError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setFirestoreError(null);
    const usersCollectionRef = collection(db, 'users');
    const q = query(usersCollectionRef, where("type", "==", "student"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const studentsList = querySnapshot.docs
        .map(docSnap => {
          try {
            const data = docSnap.data();
            if (!data || !docSnap.id) {
              console.warn("Documento de aluno inválido encontrado:", docSnap.id);
              return null;
            }
            return {
              id: docSnap.id,
              ...data,
              email: data.email?.toLowerCase() || '',
              name: data.name || 'Sem nome',
              stats: data.stats || {
                provaParana: 0,
                saeb: 0,
                provasInternas: 0,
                provasExternas: 0,
                frequencia: 0,
                plataformasDigitais: 0,
              }
            };
          } catch (error) {
            console.error("Erro ao processar documento:", docSnap.id, error);
            return null;
          }
        })
        .filter(student => student !== null)
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

      setStudents(studentsList);
      if (studentsList.length > 0 && (!selectedStudentForScores || !studentsList.find(s => s.id === selectedStudentForScores?.id))) {
        setSelectedStudentForScores(studentsList[0]);
      } else if (studentsList.length === 0) {
        setSelectedStudentForScores(null);
      }
      setIsLoading(false);
      setFirestoreError(null);
    }, (error) => {
      console.error("Erro ao buscar alunos: ", error);
      setFirestoreError("Erro ao carregar alunos. Por favor, recarregue a página.");
      toast({ title: "Erro ao carregar alunos", description: "Por favor, recarregue a página e tente novamente.", variant: "destructive" });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []); 
  

  const handleFormSubmit = async (formDataFromForm) => {
    setIsLoading(true);
    const studentEmailDomain = "@escola.pr.gov.br";
    const emailToCheck = formDataFromForm.email.toLowerCase();
    if (!emailToCheck.endsWith(studentEmailDomain)) {
        toast({
            title: "Email Inválido",
            description: `O email do aluno deve ser do domínio ${studentEmailDomain}.`,
            variant: "destructive",
        });
        setIsLoading(false);
        return;
    }

    const dataToSubmit = {
      name: formDataFromForm.name,
      email: emailToCheck,
      type: 'student',
      avatar: formDataFromForm.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${formDataFromForm.name}`,
      stats: {
        provaParana: formDataFromForm.stats.provaParana || 0,
        saeb: formDataFromForm.stats.saeb || 0,
        provasInternas: formDataFromForm.stats.provasInternas || 0,
        provasExternas: formDataFromForm.stats.provasExternas || 0,
        frequencia: formDataFromForm.stats.frequencia || 0,
        plataformasDigitais: formDataFromForm.stats.plataformasDigitais || 0,
        provaParanaTrend: editingStudent?.stats?.provaParanaTrend || 'stable',
        saebTrend: editingStudent?.stats?.saebTrend || 'stable',
        internasTrend: editingStudent?.stats?.internasTrend || 'stable',
        externasTrend: editingStudent?.stats?.externasTrend || 'stable',
        frequenciaTrend: editingStudent?.stats?.frequenciaTrend || 'stable',
        plataformasDigitaisTrend: editingStudent?.stats?.plataformasDigitaisTrend || 'stable',
        ranking: editingStudent?.stats?.ranking || 0,
      },
      updatedAt: serverTimestamp()
    };

    if (editingStudent?.uid) {
      dataToSubmit.uid = editingStudent.uid;
    }

    try {
      let activityAction = "";
      if (editingStudent) {
        if (!editingStudent.id || editingStudent.id.trim() === '') {
          toast({
            title: "Erro ao atualizar",
            description: "O ID do aluno está inválido. Por favor, recarregue a página e tente novamente.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const studentDocRef = doc(db, 'users', editingStudent.id);

        const docSnapshot = await getDoc(studentDocRef);
        if (!docSnapshot.exists()) {
          toast({
            title: "Aluno não encontrado",
            description: "Este aluno não existe mais no banco de dados. Por favor, recarregue a página.",
            variant: "destructive",
          });
          console.error(`Documento não encontrado: users/${editingStudent.id}`);
          resetForm();
          setIsLoading(false);
          return;
        }

        const existingData = docSnapshot.data();
        const mergedData = {
          ...dataToSubmit,
          uid: existingData.uid || dataToSubmit.uid,
          createdAt: existingData.createdAt,
        };

        await setDoc(studentDocRef, mergedData, { merge: true });
        activityAction = `atualizou os dados do aluno ${dataToSubmit.name}`;
        toast({
          title: "Dados atualizados!",
          description: `Os dados de ${dataToSubmit.name} foram atualizados com sucesso.`,
        });
        if (selectedStudentForScores && selectedStudentForScores.id === editingStudent.id) {
          setSelectedStudentForScores(prev => ({ ...prev, ...mergedData }));
        }
      } else {
        const docRef = await addDoc(collection(db, 'users'), { ...dataToSubmit, createdAt: serverTimestamp() });
        activityAction = `adicionou o novo aluno ${dataToSubmit.name}`;
         toast({
          title: "Aluno Adicionado!",
          description: `${dataToSubmit.name} foi adicionado(a) com sucesso.`,
        });
      }

      // Record activity
      if (auth.currentUser && activityAction) {
        const adminUserNames = {
          'izafantin26@gmail.com': 'Diretora Iza',
          'juniedu9@gmail.com': 'Admin Juni',
          'josepsouza@escola.pr.gov.br': 'Pedagogo José',
        };
        const currentAdminName = adminUserNames[auth.currentUser.email.toLowerCase()] || auth.currentUser.displayName || auth.currentUser.email.split('@')[0];
        await addDoc(collection(db, 'activities'), {
          userId: auth.currentUser.uid,
          userEmail: auth.currentUser.email,
          userName: currentAdminName,
          action: activityAction,
          timestamp: serverTimestamp()
        });
      }

    } catch (error) {
      console.error("Erro ao salvar aluno:", error);
      toast({ title: "Erro ao salvar aluno", description: error.message, variant: "destructive" });
    }
    resetForm();
    setIsLoading(false);
  };

  const resetForm = () => {
    setEditingStudent(null);
    setShowForm(false);
  };

  const handleEdit = async (student) => {
    if (!student?.id) {
      toast({
        title: "Erro ao editar",
        description: "O aluno selecionado não possui um ID válido. Tente recarregar a página.",
        variant: "destructive",
      });
      return;
    }

    try {
      const studentDocRef = doc(db, 'users', student.id);
      const docSnapshot = await getDoc(studentDocRef);

      if (!docSnapshot.exists()) {
        toast({
          title: "Aluno não encontrado",
          description: "Este aluno não existe mais no banco de dados. A lista será atualizada.",
          variant: "destructive",
        });
        return;
      }

      const currentData = docSnapshot.data();
      const studentWithCurrentData = {
        id: student.id,
        ...currentData,
        stats: {
          ...currentData.stats,
        }
      };

      setEditingStudent(studentWithCurrentData);
      setShowForm(true);
      setSelectedStudentForScores(studentWithCurrentData);
    } catch (error) {
      console.error("Erro ao verificar aluno:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do aluno. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    const studentDocRef = doc(db, 'users', id);
    const studentToDelete = students.find(s => s.id === id);
    try {
      await deleteDoc(studentDocRef);
      toast({
        title: "Aluno removido!",
        description: `${studentToDelete?.name || 'O aluno'} foi removido.`,
        variant: "destructive"
      });
      if (selectedStudentForScores && selectedStudentForScores.id === id) {
        setSelectedStudentForScores(students.length > 1 ? students.filter(s => s.id !== id)[0] : null);
      }
       // Record activity
      if (auth.currentUser && studentToDelete) {
        const adminUserNames = {
          'izafantin26@gmail.com': 'Diretora Iza',
          'juniedu9@gmail.com': 'Admin Juni',
          'josepsouza@escola.pr.gov.br': 'Pedagogo José',
        };
        const currentAdminName = adminUserNames[auth.currentUser.email.toLowerCase()] || auth.currentUser.displayName || auth.currentUser.email.split('@')[0];
        await addDoc(collection(db, 'activities'), {
          userId: auth.currentUser.uid,
          userEmail: auth.currentUser.email,
          userName: currentAdminName,
          action: `removeu o aluno ${studentToDelete.name}`,
          timestamp: serverTimestamp()
        });
      }
    } catch (error) {
      toast({ title: "Erro ao remover", description: error.message, variant: "destructive" });
    }
    setIsLoading(false);
  };
  
  const handleRowClick = (student) => {
    setSelectedStudentForScores(student);
    setShowForm(false); 
    setEditingStudent(null);
  };


  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let valA = a.stats?.[sortConfig.key] ?? a[sortConfig.key];
    let valB = b.stats?.[sortConfig.key] ?? b[sortConfig.key];

    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    
    if (valA < valB) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (valA > valB) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <ChevronUp className="w-4 h-4 ml-1 opacity-70" /> : <ChevronDown className="w-4 h-4 ml-1 opacity-70" />;
  };


  return (
    <div className="space-y-6 sm:space-y-8 p-3 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-br from-slate-100 via-gray-100 to-stone-100 rounded-xl shadow-inner min-h-[calc(100vh-8rem)] sm:min-h-[calc(100vh-10rem)]">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-gray-200"
      >
        <div className="flex items-center space-x-2.5 sm:space-x-3.5">
          <Users className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" />
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">Gerenciar Alunos</h2>
            <p className="text-gray-500 text-xs sm:text-sm">Adicione, edite ou remova dados dos alunos do 9º ano.</p>
          </div>
        </div>
        
        <Button
          onClick={() => { setEditingStudent(null); setSelectedStudentForScores(null); setShowForm(true); }}
          className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-lg px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base"
          disabled={isLoading}
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
          Adicionar Aluno
        </Button>
      </motion.div>

      {showForm && (
        <StudentForm
          initialData={editingStudent}
          onSubmit={handleFormSubmit}
          onCancel={resetForm}
          isLoading={isLoading}
        />
      )}

      {firestoreError && !showForm && (
         <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 rounded-md shadow-md flex items-start my-4"
            role="alert"
        >
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm">{firestoreError}</p>
        </motion.div>
      )}

      {selectedStudentForScores && !showForm && !firestoreError && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white p-4 sm:p-6 rounded-xl shadow-2xl border border-gray-200 mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-emerald-700">{selectedStudentForScores.name}</h3>
              <p className="text-xs sm:text-sm text-gray-500">{selectedStudentForScores.email}</p>
            </div>
            <Button onClick={() => handleEdit(selectedStudentForScores)} variant="outline" className="w-full sm:w-auto border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg shadow-sm hover:shadow-md text-xs sm:text-sm" disabled={isLoading}>
              <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" /> Editar Notas
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <ScoreCard label="Prova Paraná" value={selectedStudentForScores.stats?.provaParana} icon={<BarChartHorizontal />} color="border-blue-500" trend={selectedStudentForScores.stats?.provaParanaTrend} />
            <ScoreCard label="Prova Acerta Brasil" value={selectedStudentForScores.stats?.saeb} icon={<BarChartHorizontal />} color="border-green-500" trend={selectedStudentForScores.stats?.saebTrend} />
            <ScoreCard label="Rec.Ap.Português" value={selectedStudentForScores.stats?.provasInternas} icon={<BarChartHorizontal />} color="border-yellow-500" trend={selectedStudentForScores.stats?.internasTrend} />
            <ScoreCard label="Rec.Ap.Matemática" value={selectedStudentForScores.stats?.provasExternas} icon={<BarChartHorizontal />} color="border-purple-500" trend={selectedStudentForScores.stats?.externasTrend} />
            <ScoreCard label="Frequência" value={selectedStudentForScores.stats?.frequencia} icon={<Users />} color="border-pink-500" trend={selectedStudentForScores.stats?.frequenciaTrend} />
            <ScoreCard label="Plataformas Digitais" value={selectedStudentForScores.stats?.plataformasDigitais} icon={<PieChart />} color="border-orange-500" trend={selectedStudentForScores.stats?.plataformasDigitaisTrend} />
          </div>
        </motion.div>
      )}


      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: showForm ? 0.3 : 0.1, duration: 0.5 }}
        className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-2xl border border-gray-200"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-700">Lista de Alunos</h3>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 sm:left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Buscar aluno..."
              className="w-full sm:w-64 md:w-72 pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading && <p className="text-center text-gray-500 py-8 sm:py-10 text-sm sm:text-base">Carregando dados dos alunos...</p>}
        {!isLoading && !firestoreError && sortedStudents.length > 0 && (
          <StudentTable 
            students={sortedStudents} 
            onEdit={handleEdit} 
            onDelete={handleDelete}
            onSort={requestSort}
            getSortIcon={getSortIcon}
            onRowClick={handleRowClick}
            selectedStudentId={selectedStudentForScores?.id}
            isLoading={isLoading}
          />
        )}
        {!isLoading && (firestoreError || sortedStudents.length === 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8 sm:py-12"
          >
            <Users className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4 sm:mb-6" />
            <h3 className="text-lg sm:text-2xl font-semibold text-gray-500">
              {firestoreError ? "Erro ao Carregar Alunos" : "Nenhum aluno encontrado."}
            </h3>
            <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
              {firestoreError ? "Verifique o console para detalhes e a configuração do índice." : 
               (searchTerm ? "Tente um termo de busca diferente." : "Os alunos aparecerão aqui após o primeiro login ou cadastro.")
              }
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminPanel;