
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Address } from './AddressForm';

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (addressId: string) => void;
}

const AddressCard: React.FC<AddressCardProps> = ({ address, onEdit, onDelete }) => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-2">
            <Badge variant={address.type === 'shipping' ? 'default' : 'secondary'}>
              {t(`account.${address.type}`)}
            </Badge>
            {address.isDefault && (
              <Badge variant="outline">{t('account.defaultAddress')}</Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(address)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(address.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-1 text-sm">
          <p className="font-medium">
            {address.firstName} {address.lastName}
          </p>
          {address.company && <p className="text-gray-600">{address.company}</p>}
          <p>{address.streetAddress}</p>
          {address.apartment && <p>{address.apartment}</p>}
          <p>
            {address.city}, {address.state} {address.postalCode}
          </p>
          <p>{address.country}</p>
          <p className="text-gray-600">{address.phone}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressCard;
