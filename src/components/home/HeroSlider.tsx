
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const HeroSlider = () => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: t('hero.title'),
      subtitle: t('hero.subtitle'),
      image: '/placeholder.svg',
      cta: t('hero.shopNow'),
      ctaLink: '/shop',
      backgroundColor: 'from-primary to-primary/80'
    },
    {
      id: 2,
      title: t('hero.newCollection'),
      subtitle: t('hero.newCollectionSubtitle'),
      image: '/placeholder.svg',
      cta: t('hero.exploreCollection'),
      ctaLink: '/shop',
      backgroundColor: 'from-blue-600 to-blue-500'
    },
    {
      id: 3,
      title: t('hero.specialOffers'),
      subtitle: t('hero.specialOffersSubtitle'),
      image: '/placeholder.svg',
      cta: t('hero.viewOffers'),
      ctaLink: '/shop',
      backgroundColor: 'from-green-600 to-green-500'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[500px] md:h-[600px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : 
              index < currentSlide ? '-translate-x-full' : 'translate-x-full'
            }`}
          >
            <div className={`h-full bg-gradient-to-r ${slide.backgroundColor} text-white`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">
                  <div className="max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-white/90">
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link to={slide.ctaLink}>
                        <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          {slide.cta}
                        </Button>
                      </Link>
                      <Link to="/categories">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-primary">
                          {t('hero.browseCategories')}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-auto max-w-md mx-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
