
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Footer from '@/components/Footer';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is Temanly?",
      answer: "Temanly is a platform that connects people for various activities like dining, conversations, gaming, and more. You can find companions for different experiences or offer your time as a companion."
    },
    {
      question: "How do I book a companion?",
      answer: "Browse through our companions, check their profiles and availability, then click 'Book Now' to send a request. You'll receive confirmation once they accept."
    },
    {
      question: "Is it safe to use Temanly?",
      answer: "Yes, we prioritize safety. All companions are verified, and we have safety guidelines, rating systems, and 24/7 support to ensure a secure experience for everyone."
    },
    {
      question: "How much does it cost?",
      answer: "Prices vary depending on the companion and activity type. Each companion sets their own rates, which are clearly displayed on their profile."
    },
    {
      question: "Can I become a companion?",
      answer: "Absolutely! If you're 18+ and want to meet new people while earning money, you can apply to become a Temanly partner through our 'Be a Babe' program."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept various payment methods including credit cards, debit cards, and digital wallets. All payments are processed securely through our platform."
    },
    {
      question: "Can I cancel a booking?",
      answer: "Yes, you can cancel bookings according to our cancellation policy. The refund amount depends on how far in advance you cancel."
    },
    {
      question: "How do ratings work?",
      answer: "After each interaction, both parties can rate each other. These ratings help maintain quality and trust within our community."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/a8b92c73-b6d3-423f-9e71-b61f792f8a7a.png" 
                alt="Temanly Logo"
                className="h-10 w-auto"
              />
            </Link>
            <Link to="/">
              <Button variant="ghost">← Kembali ke Beranda</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about Temanly
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="overflow-hidden">
              <button
                className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <h3 className="font-semibold text-lg text-gray-900">{faq.question}</h3>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {openIndex === index && (
                <CardContent className="px-6 pb-6 pt-0">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQ;
