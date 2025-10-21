import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAIu0pmX_36vL1uMzoLg3cxacxaMqt_bbc",
  authDomain: "projeto-lindo-nono-ano.firebaseapp.com",
  projectId: "projeto-lindo-nono-ano",
  storageBucket: "projeto-lindo-nono-ano.appspot.com",
  messagingSenderId: "155172461147",
  appId: "1:155172461147:web:18eb30fca82b5d2c44bd7e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const studentUIDMap = {
  'costa.silva.isabella@escola.pr.gov.br': 'dDNJUSBez9QnkhkWKfX1ywaYRV13',
  'vanessa.azarias@escola.pr.gov.br': 'h9bj9oQCZQQlQB7j4sSyizmFcn12',
  'silva.souza.pedro1707@escola.pr.gov.br': '4u8oxAXDMzfSVXg0dnWRJWlhBU62',
  'hiuriqui.santos@escola.pr.gov.br': '71JyHgw1l1Yk9gOyqMJw3HiBXy53',
  'salles.alexandre@escola.pr.gov.br': '7fBTzZBXeFdczjjraTZHau8fS313',
  'silva.kemyli@escola.pr.gov.br': 'm7DIoh17x5MyWi0A2C4kMeej9dN2',
  'oliveira.teixeira.erick@escola.pr.gov.br': 'kYRl1mxFEbMIggA0TnXhuUDmqmM2',
  'silva.eloisa28@escola.pr.gov.br': '8b15AzDVdCbohzpgjZYQzro46Y03',
  'batista.silva.giovanna@escola.pr.gov.br': 'PNyQg8ni6pZowUpptIqgd8qz1xK2',
  'stefani.alcides.souza@escola.pr.gov.br': 'nVJkdiCvgFTzYMnuGLFdVCZD0S83',
  'rauane.costa.silva@escola.pr.gov.br': 'qbny5uPrazY0MUVjmCvYpwaXXLS2',
  'marcos.guilherme.soares@escola.pr.gov.br': 'MCNvuXT3eQP2MHLbXouT6JEZNTn2',
  'hemily.silva.costa@escola.pr.gov.br': '7ffoscLdnohkJ3vXmHSC3tqydTl1',
  'ana.mirandola@escola.pr.gov.br': 'bPnrfstEYSTCBKBAXNZVdY8F2ao1',
  'ketlyn.coelho.nascimento@escola.pr.gov.br': 'tqLYGVKyjvO1a8JFoOgJRmq6ZqJ2',
  'lucas.pigentini.ventura@escola.pr.gov.br': 'X1XhY7QW6hY05Y6k6xt79NTqQeC3',
  'ana.miorini@escola.pr.gov.br': 'tgURYcQQeoNQWr28Pt70fuDfwY02',
  'murilo.bispo.rosa@escola.pr.gov.br': '1MFemYD5uSQrFhg3nPdxsav1TjN2',
  'nicole.cassiolato@escola.pr.gov.br': 'XdbfBzZjm0YVJcvgBESWsD2nLEN2',
  'jhordana.alves@escola.pr.gov.br': '80vHknMiYcU3gpaxowuyc0i3fkq1',
  'santos.silva.jose2712@escola.pr.gov.br': 'zUtY4z9sbfY1IIC2NBcbdWTJOHy2'
};

async function updateStudentUIDs() {
  console.log('Iniciando atualização de UIDs dos alunos...\n');

  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where("type", "==", "student"));
    const querySnapshot = await getDocs(q);

    let updated = 0;
    let notFound = 0;
    let errors = 0;

    for (const docSnapshot of querySnapshot.docs) {
      const data = docSnapshot.data();
      const email = data.email?.toLowerCase();

      if (!email) {
        console.log(`❌ Documento ${docSnapshot.id} não tem email`);
        errors++;
        continue;
      }

      const correctUID = studentUIDMap[email];

      if (!correctUID) {
        console.log(`⚠️  Email não encontrado no mapa: ${email}`);
        notFound++;
        continue;
      }

      if (data.uid === correctUID) {
        console.log(`✓ ${email} - UID já está correto`);
        continue;
      }

      try {
        const docRef = doc(db, 'users', docSnapshot.id);
        await updateDoc(docRef, {
          uid: correctUID
        });
        console.log(`✓ ${email} - UID atualizado de "${data.uid || 'undefined'}" para "${correctUID}"`);
        updated++;
      } catch (error) {
        console.error(`❌ Erro ao atualizar ${email}:`, error.message);
        errors++;
      }
    }

    console.log('\n=== RESUMO ===');
    console.log(`✓ Atualizados: ${updated}`);
    console.log(`⚠️  Emails não encontrados: ${notFound}`);
    console.log(`❌ Erros: ${errors}`);
    console.log(`📊 Total de documentos: ${querySnapshot.docs.length}`);

  } catch (error) {
    console.error('Erro fatal:', error);
  }
}

updateStudentUIDs()
  .then(() => {
    console.log('\n✓ Script concluído!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Erro:', error);
    process.exit(1);
  });
