"use client";

import { useCartStore } from '@/store/cart';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, ArrowLeft, CreditCard, Printer, Wifi } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CefSharpMessageType } from '@/types/cefsharp.d';
import { useState, useEffect } from 'react';
import useBranchStore from '@/store/branch';

const PaymentSuccess = ({ amount, onReturn, t }: { amount: number; onReturn: () => void, t: any }) => {
  return (
    <motion.div
      key="complete"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center gap-8 text-center max-w-xl mx-auto"
    >
      {/* Success Animation */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
          <CheckCircle2 className="h-16 w-16 text-white" />
        </div>
      </motion.div>

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
          {t.common.paymentCompleted}
        </h2>
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl font-semibold text-gray-600">₺ {amount.toFixed(2)}</p>
          <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            {t.common.paymentCompleted}
          </div>
        </div>
      </motion.div>

      {/* Return Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button 
          onClick={onReturn} 
          size="lg"
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white gap-2 px-8 py-6 text-lg rounded-xl shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30 transition-all"
        >
          <CheckCircle2 className="h-5 w-5" />
          {t.common.returnToMenu}
        </Button>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>
    </motion.div>
  );
};

const PaymentPrinting = ({ amount, t }: { amount: number; t: any }) => (
  <motion.div
    key="printing"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="max-w-xl mx-auto text-center"
  >
    {/* Printer Animation */}
    <motion.div 
      className="relative mb-8"
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
        <Printer className="w-16 h-16 text-white" />
      </div>
    </motion.div>

    {/* Status Message */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
    >
      <div className="space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
          {t.common.paymentPrinting}
        </h2>
        <p className="text-4xl font-bold">₺ {amount.toFixed(2)}</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-orange-500 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Receipt Animation */}
      <motion.div
        className="w-full h-2 bg-orange-200 rounded-full overflow-hidden"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          className="h-full bg-orange-500"
          animate={{
            x: ["0%", "100%"],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>
    </motion.div>
  </motion.div>
);

const PaymentPending = ({ amount, t }: { amount: number; t: any }) => (
  <motion.div
    key="pending"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="max-w-xl mx-auto text-center"
  >
    {/* Card Animation */}
    <motion.div 
      className="relative mb-8"
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
        <CreditCard className="w-16 h-16 text-white" />
      </div>
    </motion.div>

    {/* Status Message */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
    >
      <div className="space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          {t.common.paymentPending}
        </h2>
        <p className="text-4xl font-bold">₺ {amount.toFixed(2)}</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-primary rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <motion.div
        className="w-full h-2 bg-primary/20 rounded-full overflow-hidden"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 30 }}
      >
        <motion.div
          className="h-full bg-primary"
          animate={{
            x: ["0%", "100%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>
    </motion.div>
  </motion.div>
);

const PaymentConnecting = ({ amount, t }: { amount: number; t: any }) => (
  <motion.div
    key="connecting"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="max-w-xl mx-auto text-center"
  >
    {/* Connection Animation */}
    <motion.div 
      className="relative mb-8"
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
        <Wifi className="w-16 h-16 text-white" />
      </div>
    </motion.div>

    {/* Status Message */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
    >
      <div className="space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
          {t.common.paymentConnecting}
        </h2>
        <p className="text-4xl font-bold">₺ {amount.toFixed(2)}</p>
      </div>

      {/* Connection Waves */}
      <div className="relative h-16">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border-2 border-blue-500 rounded-full"
            animate={{
              scale: [1, 2],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
        ))}
      </div>
    </motion.div>
  </motion.div>
);

const Error = ({ amount, error, onRetry, onCancel, onChangePaymentMethod, t }: {
  amount: number;
  error: string;
  onRetry?: () => void;
  onCancel?: () => void;
  onChangePaymentMethod?: () => void;
  t: any;
}) => (
  <motion.div
    key="error"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="max-w-xl mx-auto text-center"
  >
    {/* Error Icon */}
    <motion.div 
      className="relative mb-8"
      initial={{ y: -20 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-rose-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center">
        <X className="w-16 h-16 text-white" />
      </div>
    </motion.div>

    {/* Error Message */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
    >
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-red-500">
          {t.common.error}
        </h2>
        <p className="text-4xl font-bold">₺ {amount.toFixed(2)}</p>
        <p className="text-xl text-red-400 font-medium">
          {error}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        {onRetry && (
          <Button 
            onClick={onRetry}
            size="lg"
            className="w-full h-14 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white gap-2"
          >
            {t.common.retry}
          </Button>
        )}
        {onChangePaymentMethod && (
          <Button
            onClick={onChangePaymentMethod}
            variant="outline"
            size="lg"
            className="w-full h-14 text-lg gap-2"
          >
            {t.common.changePaymentMethod}
          </Button>
        )}
        {onCancel && (
          <Button 
            onClick={onCancel}
            variant="destructive"
            size="lg"
            className="w-full h-14 text-lg gap-2"
          >
            {t.common.cancelOrder}
          </Button>
        )}
      </div>
    </motion.div>
  </motion.div>
);

export default function PaymentTransactionPage() {
  const { cart, clearCart } = useCartStore();
  const { t } = useBranchStore();
  const router = useRouter();
  const params = useParams();
  const [cefSharpMessage, setCefSharpMessage] = useState<{ Type: CefSharpMessageType, Code: string, Arg: string } | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const replaceTemplateVariables = (template: string, args: string) => {
    return template.replace(/\${(\w+)}/g, () => args);
  };

  useEffect(() => {
    const updatedCart = useCartStore.getState().cart;
    const cefSharpMessageHandler = (Type: CefSharpMessageType, Code: string, Arg: string) => {
      console.log(updatedCart)
      console.log({ Type, Code, Arg })
      setCefSharpMessage({ Type, Code, Arg });
      setIsRetrying(false);
    };

    const simulateCefSharpResponses = () => {
      const amount = updatedCart.AmountDue;
      
      if (amount > 1000) {
        const errorResponses = [
          { 
            Type: CefSharpMessageType.VALIDATION_ERROR, 
            Code: "400", 
            Arg: "Validation error: Amount exceeds limit" 
          },
          { 
            Type: CefSharpMessageType.PAYMENT_ERROR, 
            Code: "500", 
            Arg: "Payment processing failed" 
          },
          { 
            Type: CefSharpMessageType.ORDER_SAVE_ERROR, 
            Code: "501", 
            Arg: "Order could not be saved" 
          },
          { 
            Type: CefSharpMessageType.ECR_ERROR, 
            Code: "502", 
            Arg: "ECR communication error" 
          },
          { 
            Type: CefSharpMessageType.ACTION_RESPONSE, 
            Code: "503", 
            Arg: "Action failed to complete" 
          }
        ];

        errorResponses.forEach((response, index) => {
          setTimeout(() => {
            cefSharpMessageHandler(
              response.Type,
              response.Code,
              response.Arg
            );
          }, index * 5000);
        });
      } else {
        cefSharpMessageHandler(
          CefSharpMessageType.PAYMENT_PENDING,
          "101",
          "Payment pending..."
        );

        const successResponses = [
          { Type: CefSharpMessageType.PAYMENT_CONNECTING, Code: "100", Arg: "Connecting to terminal...", delay: 5000 },
          { Type: CefSharpMessageType.PAYMENT_PRINTING, Code: "102", Arg: "Printing receipt...", delay: 10000 },
          { Type: CefSharpMessageType.PAYMENT_SUCCESS, Code: "200", Arg: "Payment completed successfully", delay: 15000 }
        ];

        successResponses.forEach((response) => {
          setTimeout(() => {
            cefSharpMessageHandler(
              response.Type,
              response.Code,
              response.Arg
            );
          }, response.delay);
        });
      }
    };

    if (typeof window !== 'undefined') {
      (window as Window).handleCefSharpMessage = cefSharpMessageHandler;
      simulateCefSharpResponses();
    }

    try {
      if (typeof window !== 'undefined' && 'CefSharp' in window) {
        window.CefSharp.PostMessage({ saveOrder: updatedCart });
      } else {
        console.warn("CefSharp bulunamadı - tarayıcı ortamında çalışıyor olabilir");
      }
    } catch (error) {
      console.error("CefSharp iletişim hatası:", error);
    }

    return () => {
      if (typeof window !== 'undefined') {
        (window as Window).handleCefSharpMessage = () => '';
      }
    };
  }, []);

  const handleReturnToMenu = () => {
    clearCart();
    router.push(`/${params?.branchId}/menu`);
  };

  const handlePaymentMenu = () => {
    router.push(`/${params?.branchId}/payment?stepNumber=3`);
  };

  const handleRetry = () => {
    setIsRetrying(true);

    setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && 'CefSharp' in window) {
          window.CefSharp.PostMessage({ saveOrder: cart });
        }
      } catch (error) {
        console.error("CefSharp iletişim hatası:", error);
        setIsRetrying(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div 
        className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1556742393-d75f468bfcb0?q=80&w=2070')] bg-cover bg-center"
        style={{ filter: 'brightness(0.1)' }}
      />
      
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[url('/patterns/topography.svg')] bg-repeat opacity-5" />
        <div className="absolute inset-0 bg-[url('/patterns/circuit-board.svg')] bg-repeat opacity-5" />
      </div>
      
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/95 to-primary/10" />
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-96 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-48 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob opacity-50" />
        <div className="absolute top-3/4 -left-48 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob animation-delay-2000 opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-blob animation-delay-4000 opacity-50" />
      </div>

      <div className="relative min-h-screen backdrop-blur-sm flex items-center justify-center p-8">
        <AnimatePresence mode="wait">
          {(() => {
            if (isRetrying || !cefSharpMessage) {
              return <PaymentConnecting amount={cart.AmountDue} t={t}/>;
            }

            const errorMessage = cefSharpMessage.Code && cefSharpMessage.Code in t.errors
              ? replaceTemplateVariables(t.errors[cefSharpMessage.Code as keyof typeof t.errors], cefSharpMessage.Arg)
              : cefSharpMessage.Arg;

            switch (cefSharpMessage.Type) {
              case CefSharpMessageType.PAYMENT_SUCCESS:
                return <PaymentSuccess amount={cart.AmountDue} onReturn={handleReturnToMenu} t={t} />;
              case CefSharpMessageType.PAYMENT_PENDING:
                return <PaymentPending amount={cart.AmountDue} t={t} />;
              case CefSharpMessageType.PAYMENT_PRINTING:
                return <PaymentPrinting amount={cart.AmountDue} t={t} />;
              case CefSharpMessageType.VALIDATION_ERROR:
                return (
                  <Error
                    amount={cart.AmountDue}
                    error={errorMessage}
                    onRetry={handleRetry}
                    onCancel={handleReturnToMenu}
                    onChangePaymentMethod={handlePaymentMenu}
                    t={t}
                  />
                );
              case CefSharpMessageType.PAYMENT_ERROR:
                return <Error
                  amount={cart.AmountDue}
                  error={errorMessage}
                  onRetry={handleRetry}
                  onCancel={handleReturnToMenu}
                  onChangePaymentMethod={handlePaymentMenu}
                  t={t}
                />;
              case CefSharpMessageType.ORDER_SAVE_ERROR:
                return <Error
                  amount={cart.AmountDue}
                  error={errorMessage}
                  onRetry={handleRetry}
                  onCancel={handleReturnToMenu}
                  onChangePaymentMethod={handlePaymentMenu}
                  t={t}
                />;
              case CefSharpMessageType.ECR_ERROR:
                return <Error
                  amount={cart.AmountDue}
                  error={errorMessage}
                  onRetry={handleRetry}
                  onCancel={handleReturnToMenu}
                  onChangePaymentMethod={handlePaymentMenu}
                  t={t}
                />;
              case CefSharpMessageType.ACTION_RESPONSE:
                return <Error
                  amount={cart.AmountDue}
                  error={errorMessage}
                  onRetry={handleRetry}
                  onCancel={handleReturnToMenu}
                  onChangePaymentMethod={handlePaymentMenu}
                  t={t}
                />;
              default:
                return null;
            }
          })()}
        </AnimatePresence>
      </div>
    </div>
  );
}