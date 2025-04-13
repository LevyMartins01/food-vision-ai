
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
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
        <h1 className="text-2xl font-bold">Termos de Serviço</h1>
      </div>

      <div className="glass-card p-6 space-y-6">
        <section>
          <h2 className="text-xl font-bold mb-3">1. Aceitação dos Termos</h2>
          <p className="text-foodcam-gray">
            Ao acessar ou usar o aplicativo FoodCam AI, você concorda em ficar vinculado a estes Termos de Serviço. Se você não concordar com algum aspecto destes termos, não utilize nosso aplicativo.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">2. Descrição do Serviço</h2>
          <p className="text-foodcam-gray">
            O FoodCam AI é um aplicativo de análise nutricional que utiliza inteligência artificial para identificar alimentos através de imagens e fornecer informações nutricionais estimadas. Oferecemos uma versão gratuita com recursos limitados e planos premium por assinatura com funcionalidades adicionais.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">3. Contas de Usuário</h2>
          <p className="text-foodcam-gray">
            Para usar o FoodCam AI, você precisa criar uma conta fornecendo informações precisas e completas. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrem em sua conta. Notifique-nos imediatamente sobre qualquer uso não autorizado de sua conta.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">4. Assinaturas e Pagamentos</h2>
          <p className="text-foodcam-gray mb-3">
            Oferecemos planos de assinatura que podem ser adquiridos através do aplicativo. Ao assinar:
          </p>
          <ul className="list-disc pl-5 text-foodcam-gray space-y-2">
            <li>Você concorda com os termos de cobrança especificados durante o processo de compra.</li>
            <li>As assinaturas são renovadas automaticamente até que sejam canceladas.</li>
            <li>Você pode cancelar sua assinatura a qualquer momento através das configurações da conta.</li>
            <li>Não oferecemos reembolsos para pagamentos já processados, exceto quando exigido por lei.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">5. Conteúdo do Usuário</h2>
          <p className="text-foodcam-gray">
            Ao enviar imagens para análise em nosso aplicativo, você concede à FoodCam AI uma licença mundial, não exclusiva e isenta de royalties para usar, armazenar e processar essas imagens com o propósito de fornecer e melhorar nossos serviços. Você é responsável pelo conteúdo que envia e não deve carregar conteúdo que viole direitos de terceiros ou nossas diretrizes de uso.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">6. Limitações de Responsabilidade</h2>
          <p className="text-foodcam-gray">
            O FoodCam AI fornece estimativas nutricionais baseadas em reconhecimento de imagem e não substitui aconselhamento nutricional profissional. Não garantimos a precisão absoluta das informações nutricionais fornecidas. Nosso serviço é fornecido "como está" e "conforme disponível", sem garantias de qualquer tipo.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">7. Modificações</h2>
          <p className="text-foodcam-gray">
            Reservamo-nos o direito de modificar ou descontinuar o serviço a qualquer momento, com ou sem aviso prévio. Também podemos atualizar estes Termos de Serviço periodicamente. As alterações entram em vigor após a publicação no aplicativo. O uso contínuo do aplicativo após tais alterações constitui sua aceitação dos novos termos.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">8. Lei Aplicável</h2>
          <p className="text-foodcam-gray">
            Estes termos serão regidos e interpretados de acordo com as leis do Brasil, independentemente de suas disposições sobre conflitos de leis.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">9. Contato</h2>
          <p className="text-foodcam-gray">
            Se você tiver dúvidas sobre estes Termos de Serviço, entre em contato conosco em <a href="mailto:contato@lm7upgrade.com.br" className="text-foodcam-blue hover:underline">contato@lm7upgrade.com.br</a>.
          </p>
        </section>

        <div className="pt-4 text-sm text-center text-foodcam-gray">
          Última atualização: 13 de abril de 2025
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
