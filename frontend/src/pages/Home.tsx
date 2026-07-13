import Hero from "../components/home/Hero";
import Philosophy from "../components/home/Philosophy";
import FeaturedServices from "../components/home/FeaturedServices";
import PortfolioPreview from "../components/home/PortfolioPreview";

export default function Home() {
  return (
    <div className="bg-background w-full">
      <Hero />
      <Philosophy />
      <FeaturedServices />
      <PortfolioPreview />
    </div>
  );
}