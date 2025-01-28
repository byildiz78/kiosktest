
"use client";

import { CartSheet } from '@/components/cart-sheet';
import { useCartStore } from '@/store/cart';
import { motion } from 'framer-motion';
import { Price } from '../ui/price';
import { ShoppingBag, Trash2, ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';
import { usePathname } from 'next/navigation';
import useBranchStore from '@/store/branch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function CartFooter() {
  const { cart, clearCart } = useCartStore();
  const { branchData, selectedLanguage, t } = useBranchStore();
  const pathname = usePathname();
  
  const hasItems = cart.Items.length > 0;
  const isProductDetail = pathname?.startsWith('/product/');

  if (!hasItems || isProductDetail || !branchData || !selectedLanguage) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/80 to-transparent -top-20 pointer-events-none backdrop-blur-sm" />
      
      {/* Main content */}
      <div className="relative bg-card border-t shadow-2xl p-4" style={{backdropFilter: 'blur(16px)', backgroundColor: 'rgba(255,255,255,0.9)'}}>
        <div className="container grid grid-cols-3 items-center">
          <div className="flex items-center gap-3">
            {/* Pull up handle */}
            <div className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
              <ChevronUp className="w-5 h-5" />
            </div>
            
            {/* Clear cart button with confirmation */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="lg"
                  className="gap-2 hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
                >
                  <Trash2 className="w-5 h-5" />
                  <span className="hidden sm:inline">{t.common.clearCart}</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t.common.clearCart}</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bu işlem sepetinizdeki tüm ürünleri silecektir. Devam etmek istiyor musunuz?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>İptal</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={clearCart}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Sepeti Boşalt
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Total amount - centered */}
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm text-muted-foreground font-medium">{t.common.total}</p>
            <Price 
              amount={cart.AmountDue} 
              className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary bg-clip-text text-transparent" 
            />
          </div>

          {/* Cart info and show cart button - right aligned */}
          <div className="flex justify-end">
            <CartSheet>
              <Button 
                size="lg" 
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>
                  {t.common.showCart} ({cart.Items.length} {t.common.product})
                </span>
              </Button>
            </CartSheet>
          </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
