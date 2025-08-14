/*
  # Schema inicial para o Portal do 9º Ano

  1. Tabelas principais
    - `profiles` - Perfis dos usuários (alunos e admins)
    - `news` - Notícias da escola
    - `events` - Eventos escolares
    - `chat_conversations` - Conversas com professores IA
    - `chat_messages` - Mensagens das conversas

  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas para controle de acesso baseado no tipo de usuário
*/

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de perfis dos usuários
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar text,
  type text NOT NULL CHECK (type IN ('student', 'admin')),
  stats jsonb DEFAULT '{
    "provaParana": 0,
    "saeb": 0,
    "provasInternas": 0,
    "provasExternas": 0,
    "frequencia": 0,
    "plataformasDigitais": 0,
    "provaParanaTrend": "stable",
    "saebTrend": "stable",
    "internasTrend": "stable",
    "externasTrend": "stable",
    "frequenciaTrend": "stable",
    "plataformasDigitaisTrend": "stable",
    "ranking": 0
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de notícias
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  summary text NOT NULL,
  image text,
  author_email text NOT NULL,
  author_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de eventos
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  location text NOT NULL,
  description text,
  author_email text NOT NULL,
  author_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de conversas com professores IA
CREATE TABLE IF NOT EXISTS chat_conversations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  teacher_name text NOT NULL,
  teacher_subject text NOT NULL,
  title text NOT NULL DEFAULT 'Nova conversa',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de mensagens das conversas
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id uuid REFERENCES chat_conversations(id) ON DELETE CASCADE,
  sender_type text NOT NULL CHECK (sender_type IN ('student', 'teacher')),
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Tabela de atividades (para logs de admin)
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  user_email text NOT NULL,
  user_name text NOT NULL,
  action text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Usuários podem ver todos os perfis" ON profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins podem inserir novos perfis" ON profiles
  FOR INSERT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND type = 'admin'
    )
  );

CREATE POLICY "Admins podem deletar perfis" ON profiles
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND type = 'admin'
    )
  );

-- Políticas para news
CREATE POLICY "Todos podem ver notícias" ON news
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins podem gerenciar notícias" ON news
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND type = 'admin'
    )
  );

-- Políticas para events
CREATE POLICY "Todos podem ver eventos" ON events
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins podem gerenciar eventos" ON events
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND type = 'admin'
    )
  );

-- Políticas para chat_conversations
CREATE POLICY "Estudantes podem ver suas próprias conversas" ON chat_conversations
  FOR SELECT TO authenticated USING (
    student_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Estudantes podem criar conversas" ON chat_conversations
  FOR INSERT TO authenticated USING (
    student_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid() AND type = 'student'
    )
  );

CREATE POLICY "Estudantes podem atualizar suas conversas" ON chat_conversations
  FOR UPDATE TO authenticated USING (
    student_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Políticas para chat_messages
CREATE POLICY "Usuários podem ver mensagens de suas conversas" ON chat_messages
  FOR SELECT TO authenticated USING (
    conversation_id IN (
      SELECT id FROM chat_conversations 
      WHERE student_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Usuários podem inserir mensagens em suas conversas" ON chat_messages
  FOR INSERT TO authenticated USING (
    conversation_id IN (
      SELECT id FROM chat_conversations 
      WHERE student_id IN (
        SELECT id FROM profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Políticas para activities
CREATE POLICY "Admins podem ver todas as atividades" ON activities
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND type = 'admin'
    )
  );

CREATE POLICY "Admins podem inserir atividades" ON activities
  FOR INSERT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND type = 'admin'
    )
  );

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_conversations_updated_at BEFORE UPDATE ON chat_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();