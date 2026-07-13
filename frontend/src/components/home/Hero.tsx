import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import barberimage from "../../assets/hero/hero-barber.jpeg";

export default function Hero() {
  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={barberimage}
          alt="Barbería clásica"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/95 via-zinc-900/80 to-transparent dark:from-background/95 dark:to-background/50"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-2xl animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg text-white">
            Cortes de Pelo, Barba y <span className="text-primary">Estilo Premium</span>
          </h1>
          <p className="text-lg sm:text-xl mb-8 text-zinc-200 max-w-xl drop-shadow-md">
            Experimentá el arte de la barbería tradicional y moderna, donde el estilo se encuentra con la excelencia.
          </p>
          <Link
            to="/reservar"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]"
          >
            Reservar Turno
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}