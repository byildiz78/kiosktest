"use client";

import { motion } from 'framer-motion';
import { CreditCardIcon, StickyNote, Smartphone, Wallet, ChevronRight, CircleDollarSign } from 'lucide-react';
import { PaymentMethod as PaymentMethodType } from '@/types/branch';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';

interface PaymentMethodProps {
  notes: string;
  callNumber: string;
  paymentMethods: PaymentMethodType[];
  onSelect: (method: PaymentMethodType) => void;
  t: any;
  paymentMethodIcons: Record<string, JSX.Element>;
}

export function PaymentMethod({ notes, callNumber, paymentMethods, onSelect, t, paymentMethodIcons }: PaymentMethodProps) {
  const router = useRouter();
  const { cart } = useCartStore();
  
  // Separate payment methods by type
  const creditCardMethods = paymentMethods.filter(method => method.Type === 'CREDIT_CARD');
  const mealCardMethods = paymentMethods.filter(method => method.Type === 'MEAL_CARD');

  const handlePaymentMethodSelect = async (method: PaymentMethodType) => {
    await onSelect(method);
    router.push('payment/transaction');
  };

  const PaymentMethodCard = ({ method }: { method: PaymentMethodType }) => (
    <motion.button
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => handlePaymentMethodSelect(method)}
      className="group relative w-full"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />
      
      {/* Card content */}
      <div className="relative bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-4">
          {/* Icon container with glow effect */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-lg blur group-hover:blur-md transition-all" />
            <div className="relative w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              {paymentMethodIcons[method.Type] || <CreditCardIcon className="w-8 h-8 text-primary" />}
            </div>
          </div>
          
          {/* Text content */}
          <div className="flex-1 text-left min-w-0">
            <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 group-hover:from-primary group-hover:to-primary/80 bg-clip-text text-transparent transition-all duration-300 truncate">
              {method.PaymentName}
            </h3>
            <p className="text-sm text-gray-500 group-hover:text-primary/70 transition-colors truncate">
              {method.Name}
            </p>
          </div>

          {/* Arrow indicator */}
          <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
        </div>
      </div>
    </motion.button>
  );

  return (
    <motion.div
      key="payment"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      {/* Order Info and Amount */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Order Notes */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 p-4 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <StickyNote className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">{t.common.orderNotes}</p>
              <p className="text-sm font-medium truncate">
                {notes || t.common.noOrderNotes}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Device Number */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 p-4 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{t.common.selectedDevice}</p>
              <p className="text-lg font-bold text-primary">{callNumber}</p>
            </div>
          </div>
        </motion.div>

        {/* Total Amount */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 p-4 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <CircleDollarSign className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{t.common.amountToPay}</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                ₺ {cart.AmountDue.toFixed(2)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment Methods Sections */}
      <div className="space-y-6">
        {/* Credit Cards Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 p-6 shadow-lg"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <CreditCardIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Kredi Kartı</h2>
              <p className="text-sm text-gray-500">Kredi kartı ile güvenli ödeme yapın</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {creditCardMethods.map((method) => (
              <PaymentMethodCard key={method.PaymentMethodKey} method={method} />
            ))}
          </div>
        </motion.div>

        {/* Meal Cards Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 p-6 shadow-lg"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Yemek Kartları</h2>
              <p className="text-sm text-gray-500">Yemek kartı ile hızlı ödeme yapın</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mealCardMethods.map((method) => (
              <PaymentMethodCard key={method.PaymentMethodKey} method={method} />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}