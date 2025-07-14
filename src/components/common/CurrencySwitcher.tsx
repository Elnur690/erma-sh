
import React from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Coins } from 'lucide-react';

const CurrencySwitcher = () => {
  const { currentCurrency, currencies, changeCurrency } = useCurrency();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Coins className="h-4 w-4" />
          <span className="hidden sm:inline">{currentCurrency.flag}</span>
          <span className="text-xs">{currentCurrency.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {currencies.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => changeCurrency(currency)}
            className={`flex items-center gap-2 ${
              currentCurrency.code === currency.code ? 'bg-accent' : ''
            }`}
          >
            <span>{currency.flag}</span>
            <span className="flex-1">{currency.name}</span>
            <span className="text-xs text-muted-foreground">{currency.symbol}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencySwitcher;
