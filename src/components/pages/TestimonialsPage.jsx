import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TestimonialsPage = () => {
  const navigate = useNavigate();
  const testimonials = [
    {
      quote: "Rootd connected me with a local coffee shop I love. It felt authentic and really helped me build my brand in the community.",
      name: "Alex Johnson",
      title: "College Athlete",
      outcome: "Landed 3 deals in my first month!",
      alt: "Smiling young male athlete in a basketball jersey"
    },
    {
      quote: "As a small business, finding the right athlete to represent us was tough. Rootd made it simple and effective. Our partnership has been a huge success!",
      name: "Maria Garcia",
      title: "Owner, The Corner Cafe",
      outcome: "40% increase in foot traffic.",
      alt: "Confident female business owner standing in her cafe"
    },
    {
      quote: "The platform is so easy to use. I took the quiz and got matched with three great opportunities within a week. Highly recommend!",
      name: "David Chen",
      title: "University Soccer Player",
      outcome: "Secured a year-long partnership.",
      alt: "Male soccer player posing with a soccer ball"
    },
    {
      quote: "We've seen a huge ROI since partnering with a local athlete through Rootd. It's been a game-changer for our marketing.",
      name: "Brian Smith",
      title: "Manager, Local Sports Store",
      outcome: "2x return on ad spend.",
      alt: "Friendly male manager in a sports retail store"
    }
  ];

  return (
    <div className="pt-20 min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Rootd - Testimonials</title>
        <meta name="description" content="See what athletes and businesses are saying about Rootd." />
      </Helmet>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Success Stories
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Hear from the athletes and businesses building their brands with Rootd.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                <CarouselItem className="md:basis-1/2">
                  <div className="p-1 h-full">
                    <div className="bg-card p-8 rounded-2xl shadow-md border border-border flex flex-col h-full">
                      <p className="text-foreground text-lg italic mb-6 flex-grow">"{testimonials[0].quote}"</p>
                      <div className="flex items-center">
                        <div className="w-14 h-14 rounded-full mr-4 bg-muted flex-shrink-0">
                          <img class="w-full h-full object-cover rounded-full" alt={testimonials[0].alt} src="https://images.unsplash.com/photo-1682486519525-a2c2d1c65b8b" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{testimonials[0].name}</p>
                          <p className="text-muted-foreground">{testimonials[0].title}</p>
                        </div>
                      </div>
                      {testimonials[0].outcome && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-sm font-bold text-forest-green">{testimonials[0].outcome}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem className="md:basis-1/2">
                  <div className="p-1 h-full">
                    <div className="bg-card p-8 rounded-2xl shadow-md border border-border flex flex-col h-full">
                      <p className="text-foreground text-lg italic mb-6 flex-grow">"{testimonials[1].quote}"</p>
                      <div className="flex items-center">
                        <div className="w-14 h-14 rounded-full mr-4 bg-muted flex-shrink-0">
                          <img class="w-full h-full object-cover rounded-full" alt={testimonials[1].alt} src="https://images.unsplash.com/photo-1698156058812-e80383f7ee06" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{testimonials[1].name}</p>
                          <p className="text-muted-foreground">{testimonials[1].title}</p>
                        </div>
                      </div>
                      {testimonials[1].outcome && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-sm font-bold text-forest-green">{testimonials[1].outcome}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem className="md:basis-1/2">
                  <div className="p-1 h-full">
                    <div className="bg-card p-8 rounded-2xl shadow-md border border-border flex flex-col h-full">
                      <p className="text-foreground text-lg italic mb-6 flex-grow">"{testimonials[2].quote}"</p>
                      <div className="flex items-center">
                        <div className="w-14 h-14 rounded-full mr-4 bg-muted flex-shrink-0">
                          <img class="w-full h-full object-cover rounded-full" alt={testimonials[2].alt} src="https://images.unsplash.com/photo-1492283394804-2891416bc76e" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{testimonials[2].name}</p>
                          <p className="text-muted-foreground">{testimonials[2].title}</p>
                        </div>
                      </div>
                      {testimonials[2].outcome && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-sm font-bold text-forest-green">{testimonials[2].outcome}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem className="md:basis-1/2">
                  <div className="p-1 h-full">
                    <div className="bg-card p-8 rounded-2xl shadow-md border border-border flex flex-col h-full">
                      <p className="text-foreground text-lg italic mb-6 flex-grow">"{testimonials[3].quote}"</p>
                      <div className="flex items-center">
                        <div className="w-14 h-14 rounded-full mr-4 bg-muted flex-shrink-0">
                          <img class="w-full h-full object-cover rounded-full" alt={testimonials[3].alt} src="https://images.unsplash.com/photo-1564175981616-1e5085529f62" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{testimonials[3].name}</p>
                          <p className="text-muted-foreground">{testimonials[3].title}</p>
                        </div>
                      </div>
                      {testimonials[3].outcome && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-sm font-bold text-forest-green">{testimonials[3].outcome}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-20"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Write Your Own Success Story?</h2>
            <p className="text-lg text-muted-foreground mb-8">Join the community of athletes and businesses winning with Rootd.</p>
            <Button onClick={() => navigate('/auth')} size="lg" className="forest-green hover:bg-forest-green-light text-white rounded-full shadow-lg">
              Sign Up Free <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TestimonialsPage;