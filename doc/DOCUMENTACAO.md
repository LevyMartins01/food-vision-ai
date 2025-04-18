# Documentação do Projeto FoodCam AI

## 1. Visão Geral

FoodCam AI é uma aplicação web desenvolvida para fornecer análise nutricional instantânea de alimentos utilizando inteligência artificial. Os usuários podem tirar uma foto ou fazer upload de uma imagem de um alimento, e a aplicação identifica o alimento e retorna informações nutricionais estimadas (calorias, proteínas, carboidratos, gorduras).

A aplicação possui um sistema de autenticação, histórico de análises, perfil de usuário e um modelo de assinatura freemium:
*   **Gratuito:** Limite de 2 análises diárias.
*   **Premium (Mensal/Anual):** Análises ilimitadas e acesso a recursos futuros.

## 2. Tecnologias Utilizadas e Documentação Oficial

É uma **boa prática consultar a documentação oficial** das tecnologias antes de implementar novas funcionalidades ou ao depurar problemas complexos. Muitas vezes, a resposta ou a melhor abordagem já está documentada.

*   **Frontend:**
    *   React 18+: [https://react.dev/](https://react.dev/)
    *   Vite: [https://vitejs.dev/](https://vitejs.dev/)
    *   TypeScript: [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)
    *   Tailwind CSS: [https://tailwindcss.com/docs/](https://tailwindcss.com/docs/)
    *   Shadcn/UI: [https://ui.shadcn.com/docs](https://ui.shadcn.com/docs) (Ótima para exemplos de uso dos componentes)
    *   React Router DOM: [https://reactrouter.com/en/main](https://reactrouter.com/en/main)
    *   React Hook Form: [https://react-hook-form.com/](https://react-hook-form.com/)
    *   Lucide React: [https://lucide.dev/](https://lucide.dev/)
    *   Sonner: [https://sonner.emilkowal.ski/](https://sonner.emilkowal.ski/)
*   **Backend & Banco de Dados:**
    *   Supabase: [https://supabase.com/docs](https://supabase.com/docs) (Essencial para Auth, DB, Edge Functions)
*   **APIs Externas:**
    *   OpenAI API: [https://platform.openai.com/docs/](https://platform.openai.com/docs/) (Consultar modelos, limites, erros)
        *   **Referência API REST:** [https://platform.openai.com/docs/api-reference/introduction](https://platform.openai.com/docs/api-reference/introduction) (Essencial para entender as chamadas HTTP diretas)
    *   Stripe API: [https://stripe.com/docs/api](https://stripe.com/docs/api) (Para pagamentos e webhooks)
*   **Gerenciador de Pacotes:**
    *   NPM: [https://docs.npmjs.com/](https://docs.npmjs.com/)

## 3. Estrutura do Projeto

```
food-vision-ai/
├── public/             # Arquivos estáticos públicos
├── src/                # Código fonte principal da aplicação
│   ├── assets/         # Imagens, fontes, etc.
│   ├── components/     # Componentes React reutilizáveis
│   │   ├── analysis/
│   │   ├── camera/
│   │   ├── layout/
│   │   ├── subscription/
│   │   └── ui/         # Componentes Shadcn/UI customizados ou base
│   ├── contexts/       # Context API (ex: AuthContext)
│   ├── integrations/   # Configuração de clientes de API
│   │   └── supabase/   # Cliente Supabase e tipos gerados
│   ├── pages/          # Componentes de página (rotas)
│   ├── services/       # Lógica de chamada para APIs externas (OpenAI, Stripe via Supabase Functions)
│   ├── styles/         # Estilos globais (ex: index.css)
│   └── utils/          # Funções utilitárias genéricas
│   ├── App.tsx         # Componente raiz e configuração de rotas
│   └── main.tsx        # Ponto de entrada da aplicação React
├── supabase/           # Configuração e funções do Supabase
│   ├── functions/      # Edge Functions (Deno/TypeScript)
│   │   ├── check-upload-limit/
│   │   ├── create-checkout/
│   │   └── webhook-stripe/
│   └── migrations/     # Migrações do banco de dados SQL
├── .env                # Variáveis de ambiente REAIS (NÃO COMITAR!) - Apenas local/servidor
├── .env.example        # Arquivo de exemplo para variáveis de ambiente (COMITAR)
├── .gitignore          # Arquivos e pastas ignorados pelo Git
├── index.html          # Ponto de entrada HTML
├── package.json        # Metadados do projeto e dependências
├── package-lock.json   # Lockfile do NPM
├── postcss.config.js   # Configuração do PostCSS (para Tailwind)
├── tailwind.config.js  # Configuração do Tailwind CSS
├── tsconfig.json       # Configuração do TypeScript
├── vite.config.ts      # Configuração do Vite
└── doc/                # Pasta de documentação
    └── DOCUMENTACAO.md # Este arquivo
```

## 4. Instalação e Configuração Local

1.  **Clonar o Repositório:**
    ```bash
    git clone <url_do_repositorio>
    cd food-vision-ai
    ```
2.  **Instalar Dependências:**
    ```bash
    npm install
    ```
3.  **Configurar Variáveis de Ambiente:**
    *   Copie o arquivo de exemplo:
        ```bash
        cp .env.example .env
        ```
    *   **IMPORTANTE:** Edite o arquivo `.env` **localmente** com suas chaves de API reais e URLs. **NUNCA comite este arquivo `.env` no Git.** Consulte a seção "Variáveis de Ambiente" abaixo para mais detalhes e a lista de variáveis necessárias.
4.  **Configurar o Supabase:**
    *   Certifique-se de que seu projeto Supabase está criado.
    *   **Instalar a CLI do Supabase:** Siga as instruções oficiais ([https://supabase.com/docs/guides/cli](https://supabase.com/docs/guides/cli)). Para Windows, o método recomendado é via Scoop (`scoop install supabase`). Para outros sistemas, use o gerenciador de pacotes apropriado (ex: `brew install supabase/tap/supabase`).
    *   **Autenticar e Linkar:** Após instalar a CLI, autentique-se (`supabase login`) e linke seu projeto local ao projeto remoto Supabase (`supabase link --project-ref <seu_project_ref>`). Pode ser necessário fornecer a senha do banco de dados.
    *   **Aplicar Migrações:** Execute as migrações encontradas em `supabase/migrations/` para criar/atualizar as tabelas e funções necessárias no seu banco de dados Supabase remoto. Use a CLI: `supabase db push`. Certifique-se de que todas as migrações locais foram aplicadas ao banco remoto.
    *   **(Opcional) Gerar Tipos TypeScript:** Após aplicar migrações que alteram o schema ou adicionam funções RPC, gere os tipos atualizados para o frontend: `supabase gen types typescript --project-id <seu_project_ref> --schema public > src/integrations/supabase/types.ts`.
    *   Faça o deploy das Edge Functions encontradas em `supabase/functions/` para o seu projeto Supabase. Use a CLI do Supabase: `supabase functions deploy --project-ref <seu_project_ref>`.
5.  **Rodar a Aplicação em Modo de Desenvolvimento:**
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:8080` (ou outra porta, se configurado).

## 5. Variáveis de Ambiente (Segurança Crucial!)

A gestão segura das variáveis de ambiente é vital para proteger suas chaves de API e outras informações sensíveis.

*   **`.env`**:
    *   **Propósito:** Contém as chaves de API REAIS, URLs e outras configurações sensíveis para o ambiente específico (desenvolvimento local, staging, produção).
    *   **Segurança:** **NUNCA, JAMAIS** deve ser enviado (commitado) para o Git ou qualquer sistema de controle de versão. Se ele for enviado acidentalmente, as chaves expostas devem ser revogadas IMEDIATAMENTE.
    *   **Uso:** Criado localmente (copiando do `.env.example`) e configurado diretamente nos servidores de produção/staging (por exemplo, através do painel do Easy Panel, variáveis de ambiente do sistema, etc.).

*   **`.env.example`**:
    *   **Propósito:** Serve como um **template** ou **exemplo**. Ele lista TODAS as variáveis de ambiente que a aplicação precisa para funcionar, mas com valores fictícios, vazios ou descritivos (ex: `sua_chave_aqui`).
    *   **Segurança:** **DEVE** ser enviado (commitado) para o Git. Isso permite que outros desenvolvedores (ou você no futuro) saibam quais variáveis precisam configurar em seus próprios arquivos `.env` locais.

*   **`.gitignore`**:
    *   **Propósito:** Instrui o Git sobre quais arquivos ou pastas ignorar e não rastrear.
    *   **Segurança:** É **ESSENCIAL** que este arquivo contenha uma linha para ignorar o `.env`:
        ```gitignore
        # Ignorar arquivos de variáveis de ambiente reais
        .env
        .env.local
        .env.*.local
        ```
    *   **Verificação:** Se o arquivo `.env` foi commitado acidentalmente no passado, apenas adicioná-lo ao `.gitignore` agora não o remove do histórico. Use `git rm --cached .env` para parar de rastreá-lo e, se necessário, use ferramentas mais avançadas para limpar o histórico do Git de informações sensíveis (com cuidado!).

**Variáveis Necessárias:**

Preencha estas variáveis no seu arquivo `.env` local e nas configurações do ambiente de produção:

```dotenv
# Chave da API da OpenAI (GPT-4 Vision) para análise de imagens
# OBTENHA EM: https://platform.openai.com/api-keys
VITE_OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# URL do seu projeto Supabase
# OBTENHA NO PAINEL DO SUPABASE: Project Settings > API > Project URL
VITE_SUPABASE_URL=https://<seu_ref_projeto>.supabase.co

# Chave Anônima (public) do seu projeto Supabase
# OBTENHA NO PAINEL DO SUPABASE: Project Settings > API > Project API keys > anon public
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Links de Pagamento do Stripe (Modo Produção ou Teste)
# OBTENHA NO PAINEL DO STRIPE: Products > Payment Links
VITE_STRIPE_MONTHLY_LINK=https://buy.stripe.com/xxxxxxxxxxxxxx_MENSAL
VITE_STRIPE_ANNUAL_LINK=https://buy.stripe.com/xxxxxxxxxxxxxx_ANUAL

# Chave Publicável do Stripe (Modo Produção ou Teste)
# OBTENHA NO PAINEL DO STRIPE: Developers > API Keys > Publishable key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ou pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**IMPORTANTE:** Você mencionou que vai gerar uma nova chave da OpenAI. Certifique-se de usar a NOVA chave no seu `.env` local e nas configurações de produção. As demais chaves/links (Supabase, Stripe) devem ser os corretos para seus respectivos ambientes, mas protegidos da mesma forma.

## 6. Comandos Úteis

*   **Rodar em Desenvolvimento:**
    ```bash
    npm run dev
    ```
*   **Build para Produção:**
    ```bash
    npm run build
    ```
    Gera a pasta `dist/` com os arquivos otimizados.
*   **Preview do Build de Produção:**
    ```bash
    npm run preview
    ```
    Inicia um servidor local para servir os arquivos da pasta `dist/`.
*   **Lint:**
    ```bash
    npm run lint
    ```
    Verifica erros de estilo e potenciais problemas no código.

## 7. Funcionalidades Principais

*   **Autenticação:** Cadastro e login de usuários (usando Supabase Auth - email/senha, possivelmente OAuth).
*   **Câmera/Upload:** Permite ao usuário tirar uma foto ou selecionar um arquivo de imagem.
*   **Análise Nutricional:** Envia a imagem para a API da OpenAI Vision (via Supabase Function ou diretamente, dependendo da implementação final), que analisa a imagem e retorna dados nutricionais estimados. A aplicação exibe esses dados.
    *   Utiliza a API OpenAI Vision (`gpt-4o`) para identificar o alimento e estimar macronutrientes totais.
    *   **Detalhes da Análise (Modal):** Ao clicar no botão "Detalhes" no card de resultado, um modal é exibido.
        *   Este modal mostra a imagem original, os dados nutricionais totais e uma análise textual mais detalhada.
        *   A análise textual é gerada por uma segunda chamada à API OpenAI (modelo `gpt-4o`, apenas texto), solicitando uma descrição visual, equilíbrio nutricional e sugestões, formatada com Markdown básico (negrito).
*   **Histórico:** Salva as análises realizadas. Para usuários não logados ou gratuitos, usa `localStorage`. Para usuários Premium logados, salva no banco de dados Supabase. Permite "ocultar" (soft delete) o histórico online para usuários Premium. Inclui busca por nome para usuários Premium.
*   **Perfil:** Exibe informações do usuário (nome, email, status premium) e um resumo estatístico (total de refeições/calorias/proteínas dos últimos 100 uploads). Para usuários Premium, permite definir e acompanhar uma meta diária de calorias.
*   **Assinaturas:**
    *   Verifica o status da assinatura do usuário.
    *   Limita uploads para usuários gratuitos (2 por dia).
    *   Exibe opções de planos (Mensal/Anual).
    *   Integração com Stripe Checkout para iniciar o processo de assinatura.
    *   Webhook do Stripe (via Supabase Function) para atualizar o status da assinatura no banco de dados após pagamento bem-sucedido.

## 8. Backend (Supabase)

*   **Banco de Dados:**
    *   `users` (implícita, gerenciada pelo Supabase Auth)
    *   `subscriptions`: Armazena o status da assinatura de cada usuário, plano, ID do cliente Stripe, etc.
    *   `food_uploads`: Armazena um registro de cada análise feita (ID do usuário, nome do alimento, dados nutricionais, timestamp, `is_deleted` para soft delete).
    *   `user_goals`: Armazena a meta diária de calorias para usuários premium (`user_id`, `daily_calories_goal`).
    *   **Índices:** Inclui índices em `food_uploads` para otimizar consultas (ex: `idx_food_uploads_user_id_is_deleted`, `idx_food_uploads_is_deleted`).
    *   **Segurança:** Políticas de RLS (Row Level Security) são aplicadas para garantir que usuários só possam acessar/modificar seus próprios dados (`user_profiles`, `subscriptions`, `food_uploads`, `user_goals`). As políticas de `food_uploads` consideram o status `is_deleted`. As políticas de `user_goals` permitem que usuários gerenciem apenas suas próprias metas.
*   **Edge Functions:**
    *   `check-upload-limit`: Verifica se um usuário (gratuito) atingiu o limite diário de uploads.
    *   `create-checkout`: Cria uma sessão de checkout no Stripe para um plano específico.
    *   `webhook-stripe`: Recebe eventos do Stripe e atualiza o status da assinatura no banco de dados Supabase.
*   **Funções RPC (Banco de Dados):**
    *   `get_calories_consumed_today(p_user_id UUID)`: Calcula e retorna o total de calorias consumidas pelo usuário no dia atual (usado na página de Perfil para monitoramento da meta).

## 9. API Integrations

*   **OpenAI:** A chave `VITE_OPENAI_API_KEY` é usada para autenticar requisições à API da OpenAI, especificamente para o modelo de análise de imagem (GPT-4 Vision ou similar).
*   **Stripe:**
    *   `VITE_STRIPE_PUBLISHABLE_KEY`: Usada no frontend para inicializar o Stripe.js e redirecionar para o Checkout.
    *   Links de Pagamento (`VITE_STRIPE_MONTHLY_LINK`, `VITE_STRIPE_ANNUAL_LINK`): Podem ser usados para redirecionamento direto ou como referência na criação de sessões de checkout.
    *   Chave Secreta do Stripe: **NÃO DEVE** estar no frontend. É configurada como variável de ambiente segura nas Edge Functions do Supabase (`create-checkout`, `webhook-stripe`) para interagir com a API do Stripe no backend.
*   **Histórico Aprimorado (Premium):**
        *   **Busca e Filtro:** 
            *   Implementada busca por nome do alimento para usuários Premium, com debounce para performance.
            *   Implementada funcionalidade de "Ocultar Histórico" (Soft Delete) via botão Limpar.
            *   Interface de busca visível apenas para Premium.
            *   Usuários não-premium veem uma mensagem de upgrade e botão Limpar atua apenas no `localStorage`.
            *   Filtros avançados (data, calorias) planejados para o futuro.
        *   **Visualização de Dados:** Apresentar gráficos simples (ex: resumo calórico diário/semanal) na página de histórico.
*   **Metas e Acompanhamento (Premium):**
    *   **Definição de Metas:** Implementado formulário na página de Perfil para permitir ao usuário Premium definir/atualizar/limpar sua meta diária de calorias.
    *   **Monitoramento:** Implementada exibição na página de Perfil mostrando as calorias consumidas no dia atual (via função RPC `get_calories_consumed_today`) em comparação com a meta definida, incluindo uma barra de progresso visual.
    *   **Próximos Passos:** Permitir metas semanais, definir metas de macronutrientes, calcular metas automaticamente.
*   **Plano Alimentar AI (Premium):**
    *   **Formulário de Perfil:** Coletar informações do usuário (objetivos, restrições, preferências básicas, nível de atividade).
    *   **Geração por IA:** Utilizar um modelo de linguagem da OpenAI para gerar sugestões de planos alimentares personalizados com base no formulário preenchido.
*   **Melhorias Gerais de UX:**
    *   Otimização contínua da performance.
    *   Refinamento do feedback visual durante operações assíncronas.
*   **Paywall Básico:** Implementada lógica inicial para diferenciar conteúdo/funcionalidade entre usuários gratuitos e premium (ex: busca no histórico).

## 10. Deploy (VPS com Easy Panel)

1.  **Build:** Execute `npm run build` para gerar a pasta `dist/`.
2.  **Configuração do Servidor:**
    *   Configure um servidor web (Nginx, Apache) na sua VPS para servir os arquivos estáticos da pasta `dist/`.
    *   Configure o servidor para redirecionar todas as requisições para `index.html` para que o roteamento do React funcione (configuração de SPA - Single Page Application). Exemplo Nginx: `try_files $uri $uri/ /index.html;`.
    *   **Alternativa (Easy Panel):** Se o Easy Panel gerencia o servidor, configure-o para servir a pasta `dist` como raiz do site e habilite o modo SPA se disponível, ou use um servidor Node.js simples como `serve` (`npx serve -s dist -l <porta>`).
3.  **Variáveis de Ambiente:** **NÃO** envie o arquivo `.env`. Configure as variáveis de ambiente necessárias (listadas na Seção 5) diretamente no painel do Easy Panel ou nas configurações do ambiente da sua VPS.
4.  **Supabase:** Certifique-se de que as Edge Functions e as configurações do banco de dados (migrações, RLS) estejam aplicadas no ambiente Supabase de produção.
5.  **CI/CD (Opcional):** Configure um fluxo de CI/CD (GitHub Actions) para automatizar o build e o deploy para a VPS/Easy Panel a cada push na branch principal.
6.  **Domínio e SSL:** Configure seu domínio e um certificado SSL/TLS (Let's Encrypt) para servir a aplicação via HTTPS.

## 11. Considerações de Segurança Adicionais

*   **Validação de Entrada:** Valide todas as entradas do usuário no frontend e, se aplicável, no backend (Edge Functions).
*   **Limitação de Taxa (Rate Limiting):** Considere implementar limitação de taxa nas Edge Functions ou na API Gateway (se usar uma) para prevenir abuso.
*   **Políticas de CORS:** Configure corretamente os cabeçalhos CORS nas suas Edge Functions do Supabase para permitir requisições apenas do seu domínio frontend.
*   **Atualizações de Dependência:** Mantenha as dependências do projeto (NPM) atualizadas regularmente para corrigir vulnerabilidades de segurança.

## 12. Funcionalidades Planejadas (Roadmap - Maioria Premium)

A seguir estão funcionalidades planejadas para futuras versões, a maioria das quais será exclusiva para assinantes Premium:

*   **Histórico Aprimorado (Premium):**
        *   **Busca e Filtro:** 
            *   Implementada busca por nome do alimento para usuários Premium, com debounce para performance.
            *   Implementada funcionalidade de "Ocultar Histórico" (Soft Delete) via botão Limpar.
            *   Interface de busca visível apenas para Premium.
            *   Usuários não-premium veem uma mensagem de upgrade e botão Limpar atua apenas no `localStorage`.
            *   Filtros avançados (data, calorias) planejados para o futuro.
        *   **Visualização de Dados:** Apresentar gráficos simples (ex: resumo calórico diário/semanal) na página de histórico.
*   **Metas e Acompanhamento (Premium):**
    *   **Definição de Metas:** Permitir ao usuário definir metas personalizadas (diárias, semanais) de calorias, macronutrientes (proteína, carboidratos, gorduras) com base em objetivos (perder peso, manter, ganhar massa).
    *   **Monitoramento:** Exibir o progresso do dia atual em relação às metas definidas, utilizando os dados das análises realizadas.
*   **Plano Alimentar AI (Premium):**
    *   **Formulário de Perfil:** Coletar informações do usuário (objetivos, restrições, preferências básicas, nível de atividade).
    *   **Geração por IA:** Utilizar um modelo de linguagem da OpenAI para gerar sugestões de planos alimentares personalizados com base no formulário preenchido.
*   **Melhorias Gerais de UX:**
    *   Otimização contínua da performance.
    *   Refinamento do feedback visual durante operações assíncronas.
*   **Paywall Básico:** Implementada lógica inicial para diferenciar conteúdo/funcionalidade entre usuários gratuitos e premium (ex: busca no histórico).

Esta documentação deve fornecer uma boa base para entender e gerenciar o projeto FoodCam AI. Lembre-se de mantê-la atualizada conforme o projeto evolui. 