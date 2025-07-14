
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

interface CurrencyContextType {
  currentCurrency: Currency;
  currencies: Currency[];
  changeCurrency: (currency: Currency) => void;
  convertPrice: (price: number, fromCurrency?: string) => number;
  formatPrice: (price: number) => string;
  exchangeRates: Record<string, number>;
}

const currencies: Currency[] = [
  { code: 'AZN', name: 'Azerbaijani Manat', symbol: '₼', flag: '🇦🇿' },
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' }
];

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('currency');
    return saved ? JSON.parse(saved) : currencies[0]; // Default to AZN
  });

  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({
    AZN: 1,
    USD: 0.59,
    EUR: 0.51,
    RUB: 44.1
  });

  useEffect(() => {
    localStorage.setItem('currency', JSON.stringify(currentCurrency));
  }, [currentCurrency]);

  // Simulate fetching exchange rates
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        // In a real app, you'd fetch from a currency API
        // For now, we'll use mock rates
        console.log('Exchange rates loaded:', exchangeRates);
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
      }
    };

    fetchExchangeRates();
  }, []);

  const changeCurrency = (currency: Currency) => {
    setCurrentCurrency(currency);
  };

  const convertPrice = (price: number, fromCurrency: string = 'AZN'): number => {
    if (fromCurrency === currentCurrency.code) return price;
    
    // Convert to AZN first if not already
    const aznPrice = fromCurrency === 'AZN' ? price : price / exchangeRates[fromCurrency];
    
    // Convert from AZN to target currency
    return currentCurrency.code === 'AZN' ? aznPrice : aznPrice * exchangeRates[currentCurrency.code];
  };

  const formatPrice = (price: number): string => {
    const convertedPrice = convertPrice(price);
    return `${currentCurrency.symbol}${convertedPrice.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{
      currentCurrency,
      currencies,
      changeCurrency,
      convertPrice,
      formatPrice,
      exchangeRates
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};
