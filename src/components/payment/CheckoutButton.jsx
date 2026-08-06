import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { Loader2, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export default function CheckoutButton({
  productType,
  productId,
  productName,
  price,
  className = "",
  variant = "default",
  size = "default"
}) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (e) => {
    e.stopPropagation();

    if (!price || price <= 0) {
      toast.error('Prix non disponible. Contactez-nous pour un devis.');
      return;
    }

    setLoading(true);

    try {
      const response = await base44.functions.invoke('createCheckout', {
        productType,
        productId,
        productName,
        price
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('URL de paiement non reçue');
      }
    } catch (error) {
      console.error('Erreur checkout:', error);
      toast.error('Erreur lors de la création du paiement. Veuillez réessayer.');
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading || !price || price <= 0}
      className={className}
      variant={variant}
      size={size}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Chargement...
        </>
      ) : (
        <>
          <CreditCard className="w-4 h-4 mr-2" />
          {price && price > 0 ? `Acheter ${price}€` : 'Devis'}
        </>
      )}
    </Button>
  );
}