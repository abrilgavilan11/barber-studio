import { Link } from "react-router-dom";
import { Scissors, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Scissors className="w-5 h-5 text-primary" />
              <span className="font-semibold text-lg text-foreground">Barber Studio</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Tu estilo, nuestra pasión. Barbería tradicional y cortes modernos con atención premium.
            </p>

          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Enlaces Rápidos</h4>
            <div className="flex flex-col gap-2">
              <Link to="/servicios" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Servicios y Precios
              </Link>
              <Link to="/reservar" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Reservar Turno
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contacto</h4>
            <div className="text-muted-foreground text-sm space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <p>Calle Principal 123<br />Plottier, Neuquén</p>
              </div>
              <p className="pl-6">+54 9 299 123-4567</p>
            </div>
            
            <div className="mt-4 rounded-lg overflow-hidden border border-border h-32 opacity-80 hover:opacity-100 transition-opacity">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d49635.80800650631!2d-68.2612!3d-38.9669!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x960a3a144e5cc5b5%3A0xcb13eb0674cebc76!2sPlottier%2C%20Neuqu%C3%A9n!5e0!3m2!1sen!2sar!4v1700000000000!5m2!1sen!2sar"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="mt-4 pl-6">
              <Link
                to="/admin/login"
                className="text-xs text-muted-foreground/50 hover:text-primary transition-colors"
              >
                Acceso a tu cuenta
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Barber Studio. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}