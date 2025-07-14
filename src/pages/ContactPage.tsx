
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const ContactPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: t('contact.success'),
        description: "Thank you for your message. We'll get back to you soon.",
      });
      
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast({
        title: t('contact.error'),
        description: t('contact.errorMessage'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('contact.title')}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('contact.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  {t('contact.address')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  123 Business Street<br />
                  Baku, Azerbaijan<br />
                  AZ1000
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-primary" />
                  {t('contact.phone')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  +994 12 345 67 89<br />
                  +994 50 123 45 67
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-primary" />
                  {t('contact.email')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  info@ermashop.com<br />
                  support@ermashop.com
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  {t('contact.hours')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Mon - Fri: 9:00 - 18:00<br />
                  Sat: 10:00 - 16:00<br />
                  Sun: Closed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">{t('contact.faq')}</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="shipping">
                <AccordionTrigger>{t('faq.shipping')}</AccordionTrigger>
                <AccordionContent>
                  {t('faq.shippingAnswer')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="returns">
                <AccordionTrigger>{t('faq.returns')}</AccordionTrigger>
                <AccordionContent>
                  {t('faq.returnsAnswer')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="international">
                <AccordionTrigger>{t('faq.international')}</AccordionTrigger>
                <AccordionContent>
                  {t('faq.internationalAnswer')}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>{t('contact.formTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.name')}
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('contact.name')}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.emailLabel')}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('contact.emailLabel')}
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.subject')}
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder={t('contact.subject')}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.message')}
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('contact.messagePlaceholder')}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t('contact.sending')}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {t('contact.send')}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactPage;
