'use client';

import { MessageCircle } from 'lucide-react';
import { whatsappNumber } from '@/data/products';

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${whatsappNumber.replace('+', '')}?text=Hi! I'm interested in Orpind's organic spices.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:bg-green-600 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
    </a>
  );
}
