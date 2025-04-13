
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)} 
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Política de Privacidade</h1>
      </div>

      <div className="glass-card p-6 space-y-6">
        <section>
          <h2 className="text-xl font-bold mb-3">Introdução</h2>
          <p className="text-foodcam-gray">
            A FoodCam AI valoriza sua privacidade e está comprometida com a proteção dos seus dados pessoais. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você usa nosso aplicativo FoodCam AI.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Informações que Coletamos</h2>
          <p className="text-foodcam-gray mb-2">
            <strong>Informações da Conta:</strong> Nome, endereço de e-mail e senha quando você cria uma conta.
          </p>
          <p className="text-foodcam-gray mb-2">
            <strong>Imagens de Alimentos:</strong> Fotos que você tira ou carrega para análise nutricional.
          </p>
          <p className="text-foodcam-gray mb-2">
            <strong>Dados de Uso:</strong> Informações sobre como você interage com nosso aplicativo, incluindo dados nutricionais das análises realizadas.
          </p>
          <p className="text-foodcam-gray">
            <strong>Informações de Pagamento:</strong> Quando você assina nosso serviço premium, coletamos informações de pagamento através do nosso provedor de pagamentos (Stripe).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Como Usamos Suas Informações</h2>
          <ul className="list-disc pl-5 text-foodcam-gray space-y-2">
            <li>Para fornecer, manter e melhorar nossos serviços de análise nutricional.</li>
            <li>Para processar suas transações de pagamento para assinaturas premium.</li>
            <li>Para enviar notificações relacionadas ao serviço, atualizações ou ofertas promocionais.</li>
            <li>Para analisar tendências de uso e melhorar a precisão de nossa tecnologia de reconhecimento de alimentos.</li>
            <li>Para personalizar sua experiência e fornecer conteúdo relevante.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Compartilhamento de Dados</h2>
          <p className="text-foodcam-gray mb-3">
            Não vendemos seus dados pessoais a terceiros. Podemos compartilhar suas informações com:
          </p>
          <ul className="list-disc pl-5 text-foodcam-gray space-y-2">
            <li>Provedores de serviços que nos ajudam a operar nosso aplicativo (como serviços de IA para análise de imagens e processadores de pagamento).</li>
            <li>Parceiros comerciais com seu consentimento explícito.</li>
            <li>Autoridades legais quando exigido por lei ou para proteger nossos direitos.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Armazenamento e Segurança</h2>
          <p className="text-foodcam-gray">
            Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger seus dados pessoais contra acesso não autorizado, perda ou divulgação. Suas informações são armazenadas em servidores seguros e são retidas apenas pelo tempo necessário para os fins para os quais foram coletadas.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Seus Direitos</h2>
          <p className="text-foodcam-gray mb-3">
            Dependendo da sua localização, você pode ter os seguintes direitos:
          </p>
          <ul className="list-disc pl-5 text-foodcam-gray space-y-2">
            <li>Acessar, corrigir ou excluir seus dados pessoais.</li>
            <li>Restringir ou se opor ao processamento de seus dados.</li>
            <li>Solicitar a portabilidade de seus dados.</li>
            <li>Retirar o consentimento a qualquer momento.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Contato</h2>
          <p className="text-foodcam-gray">
            Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade ou nossas práticas de dados, entre em contato conosco em <a href="mailto:contato@lm7upgrade.com.br" className="text-foodcam-blue hover:underline">contato@lm7upgrade.com.br</a>.
          </p>
        </section>

        <div className="pt-4 text-sm text-center text-foodcam-gray">
          Última atualização: 13 de abril de 2025
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
