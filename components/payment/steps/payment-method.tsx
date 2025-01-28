
"use client";

import { motion, AnimatePresence } from 'framer-motion';
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
  
  const creditCardMethods = paymentMethods.filter(method => method.Type === 'CREDIT_CARD');
  const mealCardMethods = paymentMethods.filter(method => method.Type === 'MEAL_CARD');

  const handlePaymentMethodSelect = async (method: PaymentMethodType) => {
    await onSelect(method);
    router.push('payment/transaction');
  };

  const PaymentMethodCard = ({ method }: { method: PaymentMethodType }) => (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => handlePaymentMethodSelect(method)}
      className="group relative w-full overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl" />
      
      <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-100 p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
            <div className="relative w-20 h-20 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              {paymentMethodIcons[method.Type] || <CreditCardIcon className="w-10 h-10 text-primary" />}
            </div>
          </div>
          
          <div className="flex-1 text-left">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent transition-all duration-300">
              {method.PaymentName}
            </h3>
            <p className="text-base text-gray-600 group-hover:text-primary/80 transition-colors mt-1">
              {method.Name}
            </p>
          </div>

          <ChevronRight className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors transform group-hover:translate-x-2" />
        </div>
      </div>
    </motion.button>
  );

  return (
    <AnimatePresence>
      <motion.div
        key="payment"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-6xl mx-auto space-y-8 p-6"
      >
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-100 p-6 shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <StickyNote className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{t.common.orderNotes}</p>
                <p className="text-base font-medium text-gray-900">
                  {notes || t.common.noOrderNotes}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-100 p-6 shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{t.common.selectedDevice}</p>
                <p className="text-2xl font-bold text-primary">{callNumber}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-100 p-6 shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <CircleDollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{t.common.amountToPay}</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  ₺ {cart.AmountDue.toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-100 p-8 shadow-lg"
          >
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                <CreditCardIcon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
                  Kredi Kartı
                </h2>
                <p className="text-gray-600">
                  Kredi kartı ile güvenli ödeme yapın
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {creditCardMethods.map((method) => (
                <PaymentMethodCard key={method.PaymentMethodKey} method={method} />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-100 p-8 shadow-lg"
          >
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                <Wallet className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
                  Yemek Kartları
                </h2>
                <p className="text-gray-600">
                  Yemek kartı ile hızlı ödeme yapın
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mealCardMethods.map((method) => (
                <PaymentMethodCard key={method.PaymentMethodKey} method={method} />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
