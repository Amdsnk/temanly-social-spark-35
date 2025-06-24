
interface ServiceSelection {
  id: string;
  duration: number;
  durationUnit: string;
}

interface ServicePricing {
  [key: string]: {
    basePrice: number;
    unit: string;
  };
}

const servicePricing: ServicePricing = {
  'chat': { basePrice: 25000, unit: 'per day' },
  'call': { basePrice: 40000, unit: 'per hour' },
  'video-call': { basePrice: 65000, unit: 'per hour' },
  'rent-a-lover': { basePrice: 85000, unit: 'per day' },
  'offline-date': { basePrice: 285000, unit: 'per 3 hours' },
  'party-buddy': { basePrice: 1000000, unit: 'per event' }
};

export const calculateServicePrice = (service: ServiceSelection): number => {
  const pricing = servicePricing[service.id];
  if (!pricing) return 0;

  let multiplier = service.duration;

  // Handle different duration units
  if (service.id === 'offline-date') {
    // Offline date base price is for 3 hours
    if (service.durationUnit === 'hours') {
      multiplier = Math.ceil(service.duration / 3);
    }
  } else if (service.id === 'rent-a-lover' && service.durationUnit === 'weeks') {
    multiplier = service.duration * 7;
  }

  return pricing.basePrice * multiplier;
};

export const calculateTotalPrice = (services: ServiceSelection[]): number => {
  return services.reduce((total, service) => {
    return total + calculateServicePrice(service);
  }, 0);
};

export const getServiceRestrictions = (isVerified: boolean): string[] => {
  if (isVerified) return [];
  return ['Offline Date', 'Party Buddy'];
};

export const hasRestrictedServices = (services: ServiceSelection[], isVerified: boolean): boolean => {
  if (isVerified) return false;
  return services.some(service => ['offline-date', 'party-buddy'].includes(service.id));
};
