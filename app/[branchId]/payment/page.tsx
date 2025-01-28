"use client";

import { useCartStore } from '@/store/cart';
import { AnimatePresence } from 'framer-motion';
import {
  CreditCardIcon,
  Banknote,
  Wallet,
  Receipt,
  Store,
  StickyNote,
  Smartphone
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useRef, useCallback, useEffect } from 'react';
import useBranchStore from '@/store/branch';
import { PaymentMethod } from '@/types/branch';
import { useKeyboardStore } from '@/components/ui/virtual-keyboard';
import { PaymentHeader } from '@/components/payment/payment-header';
import { PaymentSteps } from '@/components/payment/payment-steps';
import { OrderNotes } from '@/components/payment/steps/order-notes';
import { DeviceNumber } from '@/components/payment/steps/device-number';
import { PaymentMethod as PaymentMethodStep } from '@/components/payment/steps/payment-method';

const paymentMethodIcons: { [key: string]: JSX.Element } = {
  CREDIT_CARD: <CreditCardIcon className="w-8 h-8" />,
  MEAL_CARD: <Banknote className="w-8 h-8" />,
  SODEXO: <Wallet className="w-8 h-8" />,
  MULTINET: <Receipt className="w-8 h-8" />,
  SETCARD: <Store className="w-8 h-8" />
};

export default function PaymentPage() {
  const { cart, updateCart } = useCartStore();
  const { branchData, t } = useBranchStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStep = searchParams?.get('stepNumber') ? parseInt(searchParams.get('stepNumber')!) : 1;
  const [step, setStep] = useState(initialStep);
  const [error, setError] = useState('');
  const { setInputRef, setIsOpen } = useKeyboardStore();
  const noteInputRef = useRef<HTMLTextAreaElement>(null);

  const steps = [
    { icon: StickyNote, label: t.common.orderNotes },
    { icon: Smartphone, label: t.common.selectedDevice },
    { icon: CreditCardIcon, label: t.common.paymentMethod }
  ];

  useEffect(() => {
    if (noteInputRef.current) {
      noteInputRef.current.value = cart.Notes || '';
      setInputRef(noteInputRef.current);
    }
  }, []);

  const handleFocus = useCallback(() => {
    if (noteInputRef.current) {
      setInputRef(noteInputRef.current);
      setIsOpen(true);
    }
  }, [setInputRef, setIsOpen]);

  const handleNextStep = useCallback(() => {
    if (noteInputRef.current) {
      updateCart({ Notes: noteInputRef.current.value });
    }
    setStep(2);
  }, [updateCart]);

  const handleDeviceNumberChange = async (digit: string) => {
    if (digit === 'delete') {
      await updateCart({ CallNumber: cart.CallNumber?.slice(0, -1) });
      setError('');
    } else {
      const newNumber = (cart.CallNumber || '') + digit;
      if (newNumber === '0') {
        setError(t.common.deviceNumberZeroError);
        return;
      }
      const strippedNumber = newNumber.replace(/^0+/, '');
      await updateCart({ CallNumber: strippedNumber });
      setError('');
    }
  };

  const handleDeviceNumberSubmit = () => {
    if (!cart.CallNumber) {
      setError(t.common.enterDeviceNumberWarning);
      return;
    }
    setError('');
    setStep(3);
  };

  const handlePaymentMethodSelect = async (paymentMethod: PaymentMethod) => {
    await updateCart({
      Notes: cart.Notes,
      PaymentType: paymentMethod.Type as 'CREDIT_CARD' | 'MEAL_CARD',
      PaymentMethod: {
        Key: paymentMethod.PaymentMethodKey,
        PaymentMethodID: paymentMethod.PaymentMethodID,
        PaymentName: paymentMethod.PaymentName,
        Name: paymentMethod.Name,
        Type: paymentMethod.Type as 'CREDIT_CARD' | 'MEAL_CARD'
      }
    });
    router.push('transaction');
  };

  const progress = (step / 3) * 100;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div 
        className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1615799998603-7c6270a45196?q=80&w=2304')] bg-cover bg-center"
        style={{ 
          filter: 'brightness(0.1)',
          transform: 'scale(1.1)',
          transition: 'transform 0.5s ease-out'
        }}
      />
      
      {/* Animated Patterns */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[url('/patterns/topography.svg')] bg-repeat opacity-5 animate-[move 20s linear infinite]" />
        <div className="absolute inset-0 bg-[url('/patterns/circuit-board.svg')] bg-repeat opacity-5 animate-[move 15s linear infinite]" />
      </div>
      
      {/* Gradient Overlays */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/95 to-primary/10" />
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-96 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Animated Blobs */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-48 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob opacity-50" />
        <div className="absolute top-3/4 -left-48 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob animation-delay-2000 opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob animation-delay-4000 opacity-50" />
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen backdrop-blur-sm">
        <PaymentHeader
          totalAmount={cart.AmountDue}
          progress={progress}
          onBack={() => router.back()}
          t={t}
        />

        <div className="container mx-auto px-4 py-12 max-w-6xl relative">
          <PaymentSteps steps={steps} currentStep={step} t={t} />

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <OrderNotes
                onNext={handleNextStep}
                onFocus={handleFocus}
                noteInputRef={noteInputRef}
                t={t}
              />
            ) : step === 2 ? (
              <DeviceNumber
                callNumber={cart.CallNumber || ''}
                error={error}
                onDigitPress={handleDeviceNumberChange}
                onSubmit={handleDeviceNumberSubmit}
                t={t}
              />
            ) : (
              <PaymentMethodStep
                notes={cart.Notes || ''}
                callNumber={cart.CallNumber || ''}
                paymentMethods={branchData?.PaymentMethods || []}
                onSelect={handlePaymentMethodSelect}
                paymentMethodIcons={paymentMethodIcons}
                t={t}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}