import heroImage from "@/assets/hero-food.jpg";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      <img
        src={heroImage}
        alt="Fersk og fargerik mat"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />

      <div className="relative z-10 container mx-auto h-full flex items-center px-4">
        <div className="max-w-xl space-y-6 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground leading-tight">
            Fersk mat,{" "}
            <span className="text-secondary">levert til deg</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 font-body">
            Håndlaget med kjærlighet fra lokale råvarer. Bestill enkelt og nyt smakfulle retter hjemme.
          </p>
          <Button
            size="lg"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-lg px-8 py-6"
            onClick={() => document.getElementById("meny")?.scrollIntoView({ behavior: "smooth" })}
          >
            Se menyen
            <ArrowDown className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
