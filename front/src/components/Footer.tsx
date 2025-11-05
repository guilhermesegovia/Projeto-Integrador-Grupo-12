import { Shield, Mail, Phone, Clock, HeadphonesIcon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t bg-muted/50 mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-hero">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">Security Pro</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Gestão completa de equipamentos de proteção individual para sua empresa.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>contato@safeworkpro.com.br</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>(11) 3000-0000</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Horário de Atendimento</h3>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 text-primary mt-0.5" />
              <div>
                <p>Segunda a Sexta: 8h às 18h</p>
                <p>Sábado: 8h às 12h</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <Button 
              onClick={() => navigate('/support')}
              variant="default"
              size="lg"
              className="gap-2"
            >
              <HeadphonesIcon className="w-5 h-5" />
              Fale com o Suporte
            </Button>
            <Button 
              onClick={() => navigate('/support-admin')}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <Settings className="w-5 h-5" />
              Área Administrativa
            </Button>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            &copy; 2025 Security Pro. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
