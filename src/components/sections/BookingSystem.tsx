import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon, Clock, MessageSquare, CheckCircle } from "lucide-react";
import { format } from "date-fns";

const BookingSystem = () => {
  const [step, setStep] = useState<'consultation' | 'calendar' | 'details' | 'confirmation'>('consultation');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    consultation_type: "",
    message: "",
    preferred_date: "",
    preferred_time: ""
  });
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingId, setBookingId] = useState<string>("");
  const { toast } = useToast();

  // Load available time slots when date changes
  useEffect(() => {
    if (selectedDate && step === 'calendar') {
      loadAvailableSlots(selectedDate);
    }
  }, [selectedDate, step]);

  const loadAvailableSlots = async (date: Date) => {
    try {
      const { data, error } = await supabase.functions.invoke('check-calendar-availability', {
        body: { 
          date: format(date, 'yyyy-MM-dd'),
          adminId: 'admin' // You would get this from your admin context
        }
      });

      if (error) throw error;

      if (data?.availableSlots) {
        setAvailableSlots(data.availableSlots.map((slot: any) => slot.time));
      } else {
        // Fallback to default slots if calendar integration isn't set up
        setAvailableSlots(["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"]);
      }
    } catch (error) {
      console.error('Error loading available slots:', error);
      // Fallback to default slots
      setAvailableSlots(["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"]);
    }
  };

  const consultationTypes = [
    {
      id: "supply_chain",
      title: "Supply Chain Consulting",
      description: "Optimize your operations, logistics, and fleet management",
      duration: "60 minutes",
      features: ["Operations Analysis", "Process Optimization", "Cost Reduction Strategies"]
    },
    {
      id: "it_tech", 
      title: "IT & Technology Solutions",
      description: "AI/ML implementation, software development, and digital transformation",
      duration: "45 minutes",
      features: ["AI/ML Strategy", "Software Solutions", "Digital Transformation"]
    },
    {
      id: "design_marketing",
      title: "Marketing & Brand Development", 
      description: "Brand strategy, design services, and digital marketing optimization",
      duration: "45 minutes",
      features: ["Brand Strategy", "Logo & Design", "SEO & Marketing"]
    },
    {
      id: "networking",
      title: "Professional Networking",
      description: "Collaboration opportunities and industry connections",
      duration: "30 minutes", 
      features: ["Industry Insights", "Partnership Opportunities", "Career Guidance"]
    },
    {
      id: "question",
      title: "Quick Question / Advice",
      description: "Brief consultation for specific questions or guidance",
      duration: "15 minutes",
      features: ["Quick Advice", "Specific Questions", "Industry Insights"]
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          ...formData,
          preferred_date: formData.preferred_date && formData.preferred_time 
            ? new Date(`${formData.preferred_date}T${formData.preferred_time}:00`).toISOString() 
            : null
        }])
        .select()
        .single();

      if (error) throw error;

      setBookingId(data.id);
      setStep('confirmation');

      toast({
        title: "Booking Request Submitted!",
        description: "I'll review your request and get back to you within 24 hours to schedule.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again or contact me directly.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConsultationSelect = (consultationType: string) => {
    setFormData(prev => ({ ...prev, consultation_type: consultationType }));
    setStep('calendar');
  };

  const handleDateTimeSelect = () => {
    if (selectedDate && selectedTime) {
      setFormData(prev => ({ 
        ...prev, 
        preferred_date: format(selectedDate, "yyyy-MM-dd"),
        preferred_time: selectedTime
      }));
      setStep('details');
    }
  };

  const handleBackStep = () => {
    if (step === 'calendar') setStep('consultation');
    else if (step === 'details') setStep('calendar');
  };

  const selectedConsultation = consultationTypes.find(
    type => type.id === formData.consultation_type
  );

  return (
    <section id="booking" className="py-24 bg-background">
      <div className="container-max section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="mobile-heading font-bold mb-6">
            Book a <span className="gradient-text">Consultation</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to transform your business? Schedule a consultation to discuss your specific needs 
            and explore how my expertise can drive your success.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {step === 'consultation' && (
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-center mb-8">Choose Your Consultation Type:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {consultationTypes.map((type, index) => (
                  <motion.div
                    key={type.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => handleConsultationSelect(type.id)}
                  >
                    <Card className="h-full border-2 hover:border-primary transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-lg">{type.title}</h4>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {type.duration}
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground text-sm mb-4">{type.description}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {type.features.map((feature, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-accent/50 text-accent-foreground px-2 py-1 rounded-md"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'calendar' && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-md mx-auto"
            >
              <div className="text-center mb-6">
                <Button variant="ghost" onClick={handleBackStep} className="mb-4">
                  ← Back to consultation types
                </Button>
                <h3 className="text-2xl font-bold">Select a Day</h3>
                <p className="text-muted-foreground mt-2">
                  {selectedConsultation?.title} • {selectedConsultation?.duration}
                </p>
              </div>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="w-full"
                  />
                  
                  {selectedDate && (
                    <div className="mt-6 border-t pt-6">
                      <h4 className="text-sm font-medium mb-3">Available Times</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {availableSlots.map((time) => {
                          const timeLabel = time === "13:00" ? "1:00 PM" : 
                                          time === "14:00" ? "2:00 PM" :
                                          time === "15:00" ? "3:00 PM" :
                                          time === "16:00" ? "4:00 PM" :
                                          `${parseInt(time.split(':')[0])}:00 AM`;
                          
                          return (
                            <Button
                              key={time}
                              variant={selectedTime === time ? "default" : "outline"}
                              size="sm"
                              className="text-xs"
                              onClick={() => {
                                setSelectedTime(time);
                                setTimeout(handleDateTimeSelect, 100);
                              }}
                            >
                              {timeLabel}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 'details' && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-md mx-auto"
            >
              <Card className="border-0 shadow-2xl bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <Button variant="ghost" onClick={handleBackStep} className="self-start mb-4">
                    ← Back to calendar
                  </Button>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Calendar className="h-6 w-6 text-primary" />
                    Complete Your Booking
                  </CardTitle>
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-4">
                    <h4 className="font-semibold text-primary mb-1">
                      {selectedConsultation?.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedDate && selectedTime && 
                        `${format(selectedDate, "EEEE, MMMM d, yyyy")} at ${selectedTime === "13:00" ? "1:00 PM" : 
                          selectedTime === "14:00" ? "2:00 PM" :
                          selectedTime === "15:00" ? "3:00 PM" :
                          selectedTime === "16:00" ? "4:00 PM" :
                          `${parseInt(selectedTime.split(':')[0])}:00 AM`}`
                      }
                    </p>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Full Name *</label>
                        <Input
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Email Address *</label>
                        <Input
                          type="email"
                          name="email"
                          id="booking-email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Message <span className="text-muted-foreground">(Optional)</span>
                      </label>
                      <Textarea
                        placeholder="Tell me about your project, challenges, or specific goals..."
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        rows={4}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full rounded-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Submitting..." : "Request Consultation"}
                      <MessageSquare className="ml-2 h-4 w-4" />
                    </Button>

                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">
                        I'll respond within 24 hours to confirm your booking. 
                        Sessions are conducted via video call or phone.
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 'confirmation' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="max-w-md mx-auto text-center"
            >
              <Card className="border-0 shadow-2xl bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
                    <p className="text-muted-foreground">
                      Thank you for requesting a consultation. I've received your booking request.
                    </p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                      What's Next?
                    </h4>
                    <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                      <li>• I'll review your request within 24 hours</li>
                      <li>• You'll receive a confirmation email</li>
                      <li>• I'll send a calendar invite with meeting details</li>
                    </ul>
                  </div>

                  <Button 
                    onClick={() => {
                      setStep('consultation');
                      setFormData({
                        name: "",
                        email: "",
                        consultation_type: "",
                        message: "",
                        preferred_date: "",
                        preferred_time: ""
                      });
                      setSelectedDate(undefined);
                      setSelectedTime("");
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Book Another Consultation
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BookingSystem;