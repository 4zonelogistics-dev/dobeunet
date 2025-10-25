import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, CheckCircle, ExternalLink, Newspaper } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already subscribed!",
            description: "This email is already subscribed to The Digital Wharf.",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Successfully subscribed!",
          description: "Welcome to The Digital Wharf newsletter. Check your email for confirmation.",
        });
        setEmail("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: CheckCircle,
      title: "Supply Chain Insights",
      description: "Latest trends, strategies, and innovations in supply chain management"
    },
    {
      icon: CheckCircle,
      title: "Tech & AI Updates",
      description: "Cutting-edge technology solutions and AI/ML applications for business"
    },
    {
      icon: CheckCircle,
      title: "Marketing Strategies", 
      description: "Digital marketing tips, brand development insights, and SEO techniques"
    },
    {
      icon: CheckCircle,
      title: "Exclusive Resources",
      description: "Free templates, tools, and research available only to subscribers"
    }
  ];

  return (
    <section id="newsletter" className="py-24 bg-accent/5">
      <div className="container-max section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Newspaper className="h-4 w-4" />
            The Digital Wharf Newsletter
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Stay Ahead of the <span className="gradient-text">Curve</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Join The Digital Wharf newsletter for exclusive insights on supply chain innovation, 
            emerging technologies, and strategic business growth. Get monthly expert analysis 
            delivered straight to your inbox.
          </p>

          <div className="flex justify-center gap-4 mb-12">
            <Badge variant="outline" className="bg-background">
              <Mail className="h-3 w-3 mr-1" />
              Monthly Newsletter
            </Badge>
            <Badge variant="outline" className="bg-background">
              Free Resources
            </Badge>
            <Badge variant="outline" className="bg-background">
              Expert Insights
            </Badge>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Newsletter Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold mb-8">What You'll Get:</h3>
            
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4"
                >
                  <div className="bg-primary/10 p-2 rounded-lg mt-1">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{benefit.title}</h4>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </div>
                </motion.div>
              );
            })}

            <div className="pt-6">
              <a
                href="https://digitalwharf.dobeu.net/subscribe"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <span className="text-sm">Also available on Medium</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="border-0 shadow-2xl bg-card/50 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl">Join The Digital Wharf</CardTitle>
                <p className="text-muted-foreground">
                  Get exclusive access to premium content and insights
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      name="email"
                      id="newsletter-email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 text-center"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full h-12 rounded-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Subscribing..." : "Subscribe to Newsletter"}
                    <Mail className="ml-2 h-4 w-4" />
                  </Button>
                </form>

                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Join 500+ professionals already subscribed. 
                    Unsubscribe at any time.
                  </p>
                </div>

                {/* Premium Features Teaser */}
                <div className="border-t border-border pt-6">
                  <p className="text-sm font-medium text-center mb-4">
                    Premium Subscribers Get:
                  </p>
                  <div className="space-y-2">
                    {[
                      "Supply Chain Notion Templates",
                      "Exclusive AI Tool Research", 
                      "Direct Messaging Access",
                      "Monthly Live Q&A Sessions"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4" disabled>
                    Premium Features Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;