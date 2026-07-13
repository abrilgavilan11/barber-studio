import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const portfolioImages = [
  "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=600&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=600&auto=format&fit=crop", 
  "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=600&auto=format&fit=crop", 
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLzTPhty1Hllrt9f6o06x9nyPBge8Y5srDOYuPBmK012_fx6JlN3QGiMXj&s=10", 
];

export default function PortfolioPreview() {
  return (
    <section className="py-16 md:py-24 bg-card text-card-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Nuestra Galería
          </h2>
          <p className="text-lg text-muted-foreground">
            Un vistazo a nuestros trabajos y el estudio
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {portfolioImages.map((image, index) => (
            <div
              key={index}
              className="aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <img
                src={image}
                alt={`Trabajo de barbería ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/reservar"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
          >
            Reserva tu Turno
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}