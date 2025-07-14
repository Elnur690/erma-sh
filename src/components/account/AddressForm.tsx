
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';

export interface Address {
  id: string;
  type: 'shipping' | 'billing';
  firstName: string;
  lastName: string;
  company?: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface AddressFormProps {
  address?: Address;
  onSave: (address: Omit<Address, 'id'>) => void;
  onCancel: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ address, onSave, onCancel }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    type: address?.type || 'shipping',
    firstName: address?.firstName || '',
    lastName: address?.lastName || '',
    company: address?.company || '',
    streetAddress: address?.streetAddress || '',
    apartment: address?.apartment || '',
    city: address?.city || '',
    state: address?.state || '',
    postalCode: address?.postalCode || '',
    country: address?.country || 'Azerbaijan',
    phone: address?.phone || '',
    isDefault: address?.isDefault || false,
  });

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {address ? t('account.editAddress') : t('account.addAddress')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">{t('account.addressType')}</Label>
            <Select
              value={formData.type}
              onValueChange={(value: 'shipping' | 'billing') => handleInputChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shipping">{t('account.shipping')}</SelectItem>
                <SelectItem value="billing">{t('account.billing')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">{t('account.firstName')}</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">{t('account.lastName')}</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="company">{t('account.company')}</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="streetAddress">{t('account.streetAddress')}</Label>
            <Input
              id="streetAddress"
              value={formData.streetAddress}
              onChange={(e) => handleInputChange('streetAddress', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="apartment">{t('account.apartment')}</Label>
            <Input
              id="apartment"
              value={formData.apartment}
              onChange={(e) => handleInputChange('apartment', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">{t('account.city')}</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="state">{t('account.state')}</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postalCode">{t('account.postalCode')}</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="country">{t('account.country')}</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">{t('account.phone')}</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              checked={formData.isDefault}
              onCheckedChange={(checked) => handleInputChange('isDefault', checked as boolean)}
            />
            <Label htmlFor="isDefault">{t('account.setAsDefault')}</Label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit">
              {address ? t('account.updateAddress') : t('account.saveAddress')}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              {t('account.cancel')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddressForm;
