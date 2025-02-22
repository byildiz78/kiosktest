"use client";

import { useCartStore } from '@/store/cart';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CefSharpMessageType } from '@/types/cefsharp.d';
import { useState, useEffect } from 'react';
import useBranchStore from '@/store/branch';
import { CurrencyDisplay } from '@/components/payment/currency-display';

const PaymentSuccess = ({ amount, onReturn, t }: { amount: number; onReturn: () => void, t: any }) => {
  return (
    <motion.div
      key="complete"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center gap-4 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4">
        <CheckCircle2 className="h-10 w-10 text-white" />
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white">{t.common.paymentCompleted}</h2>
        <p className="text-2xl font-bold text-primary">₺ {amount.toFixed(2)}</p>
      </div>
      <Button onClick={onReturn} className="gap-2 mt-4">
        <CheckCircle2 className="h-4 w-4" />
        {t.common.returnToMenu}
      </Button>
    </motion.div>
  );
};

const PaymentPending = ({ amount, t }: { amount: number; t: any }) => (
  <motion.div
    key="pending"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="text-center space-y-6"
  >
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl">
      <div className="text-center space-y-2">
        <div className="text-4xl font-bold text-white mb-2">₺ {amount.toFixed(2)}</div>
        <div className="text-lg text-white/80">{t.common.paymentPending}...</div>
      </div>
    </div>
  </motion.div>
);

const PaymentPrinting = ({ amount, t }: { amount: number; t: any }) => (
  <motion.div
    key="printing"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="text-center space-y-6"
  >
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl">
      <div className="text-center space-y-2">
        <div className="text-4xl font-bold text-white mb-2">₺ {amount.toFixed(2)}</div>
        <div className="text-lg text-white/80">{t.common.paymentPrinting}...</div>
      </div>
    </div>
  </motion.div>
);

const PaymentConnecting = ({ amount, t }: { amount: number; t: any }) => (
  <motion.div
    key="connecting"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="text-center space-y-6"
  >
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl">
      <div className="text-center space-y-2">
        <div className="text-4xl font-bold text-white mb-2">₺ {amount.toFixed(2)}</div>
        <div className="text-lg text-white/80">{t.common.paymentConnecting}...</div>
      </div>
    </div>
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
    className="text-center space-y-6"
  >
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
          <X className="w-8 h-8 text-red-500" />
        </div>
        <div className="text-center space-y-2">
          <div className="text-4xl font-bold text-white mb-2">₺ {amount.toFixed(2)}</div>
          <div className="text-lg text-red-400">{error}</div>
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-6">
        {onRetry && (
          <Button onClick={onRetry} className="gap-2 bg-primary hover:bg-primary/90">
            {t.common.retry}
          </Button>
        )}
        {onCancel && (  
          <Button onClick={onCancel} variant="outline" className="gap-2 border-red-500/20 text-red-500 hover:bg-red-500/10">
            {t.common.cancelOrder}
          </Button>
        )}
        {onChangePaymentMethod && (
          <Button
            onClick={onChangePaymentMethod}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            {t.common.changePaymentMethod}
          </Button>
        )}
      </div>
    </div>
  </motion.div>
);

export default function PaymentTransactionPage() {
  const { cart, clearCart } = useCartStore();
  const { t } = useBranchStore();
  const router = useRouter();
  const params = useParams();
  const [cefSharpMessage, setCefSharpMessage] = useState<{ Type: CefSharpMessageType, Code: string, Arg: string } | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  // Helper function to replace template variables in error messages
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

    // Demo simulation function
    const simulateCefSharpResponses = () => {
      const amount = updatedCart.AmountDue;
      
      if (amount > 1000) {
        // Error states for amounts over 1000 TL
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
        // Normal success flow for amounts under 1000 TL
        // Show PaymentPending immediately
        cefSharpMessageHandler(
          CefSharpMessageType.PAYMENT_PENDING,
          "101",
          "Payment pending..."
        );

        // Schedule the rest of the states
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
      window.handleCefSharpMessage = cefSharpMessageHandler;
      // Start simulation
      simulateCefSharpResponses();
    }

    try {
      if (typeof window !== 'undefined' && 'CefSharp' in window) {
        window.CefSharp.PostMessage({ saveOrder: updatedCart });
      } else {
        console.warn("CefSharp not found - may be running in browser environment");
      }
    } catch (error) {
      console.error("CefSharp communication error:", error);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.handleCefSharpMessage = () => '';
      }
    };
  }, []);

  // Return to menu function
  const handleReturnToMenu = () => {
    clearCart();
    router.push(`/${params?.branchId}/menu`);
  };

  // Payment menu function
  const handlePaymentMenu = () => {
    router.push(`/${params?.branchId}/payment?stepNumber=3`);
  };

  // Retry function
  const handleRetry = () => {
    setIsRetrying(true);

    setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && 'CefSharp' in window) {
          window.CefSharp.PostMessage({ saveOrder: cart });
        }
      } catch (error) {
        console.error("CefSharp communication error:", error);
        setIsRetrying(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background and overlay elements */}
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

      <div className="relative min-h-screen backdrop-blur-sm flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-3xl mx-auto space-y-12">
          <AnimatePresence mode="wait">
            {(() => {
              if (isRetrying || !cefSharpMessage) {
                return (
                  <div className="space-y-12">
                    <PaymentConnecting amount={cart.AmountDue} t={t}/>
                    <CurrencyDisplay amount={cart.AmountDue} />
                  </div>
                );
              }

              const errorMessage = cefSharpMessage.Code && cefSharpMessage.Code in t.errors
                ? replaceTemplateVariables(t.errors[cefSharpMessage.Code as keyof typeof t.errors], cefSharpMessage.Arg)
                : cefSharpMessage.Arg;

              switch (cefSharpMessage.Type) {
                case CefSharpMessageType.PAYMENT_SUCCESS:
                  return (
                    <div className="space-y-12">
                      <PaymentSuccess amount={cart.AmountDue} onReturn={handleReturnToMenu} t={t} />
                      <CurrencyDisplay amount={cart.AmountDue} />
                    </div>
                  );
                case CefSharpMessageType.PAYMENT_PENDING:
                  return (
                    <div className="space-y-12">
                      <PaymentPending amount={cart.AmountDue} t={t} />
                      <CurrencyDisplay amount={cart.AmountDue} />
                    </div>
                  );
                case CefSharpMessageType.PAYMENT_PRINTING:
                  return (
                    <div className="space-y-12">
                      <PaymentPrinting amount={cart.AmountDue} t={t} />
                      <CurrencyDisplay amount={cart.AmountDue} />
                    </div>
                  );
                case CefSharpMessageType.VALIDATION_ERROR:
                case CefSharpMessageType.PAYMENT_ERROR:
                case CefSharpMessageType.ORDER_SAVE_ERROR:
                case CefSharpMessageType.ECR_ERROR:
                case CefSharpMessageType.ACTION_RESPONSE:
                  return (
                    <div className="space-y-12">
                      <Error
                        amount={cart.AmountDue}
                        error={errorMessage}
                        onRetry={handleRetry}
                        onCancel={handleReturnToMenu}
                        onChangePaymentMethod={handlePaymentMenu}
                        t={t}
                      />
                      <CurrencyDisplay amount={cart.AmountDue} />
                    </div>
                  );
                default:
                  return null;
              }
            })()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}