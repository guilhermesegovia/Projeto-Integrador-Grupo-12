import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-hero">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-foreground">SafeWork Pro</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Início
          </Link>
          <Link
            to="/epi-consulta"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/epi-consulta") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Consulta de EPI
          </Link>
          <Link
            to="/employees"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/employees") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Funcionários
          </Link>
          <Link to="/register">
            <Button variant="outline" size="sm">
              Cadastrar Empresa
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 flex flex-col gap-4">
            <Link
              to="/"
              className={`text-sm font-medium ${
                isActive("/") ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Início
            </Link>
            <Link
              to="/epi-consulta"
              className={`text-sm font-medium ${
                isActive("/epi-consulta") ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Consulta de EPI
            </Link>
            <Link
              to="/employees"
              className={`text-sm font-medium ${
                isActive("/employees") ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Funcionários
            </Link>
            <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" size="sm" className="w-full">
                Cadastrar Empresa
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
