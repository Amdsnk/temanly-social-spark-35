
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ServiceRestrictionNoticeProps {
  isVerified: boolean;
  restrictedServices: string[];
}

const ServiceRestrictionNotice: React.FC<ServiceRestrictionNoticeProps> = ({ 
  isVerified, 
  restrictedServices 
}) => {
  if (isVerified || restrictedServices.length === 0) return null;

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-yellow-800 mb-2">
              Verification Required
            </h4>
            <p className="text-sm text-yellow-700 mb-3">
              To book {restrictedServices.join(' and ')}, you need to complete identity verification with KTP, email, and WhatsApp verification.
            </p>
            <Link to="/user-verification">
              <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                <Shield className="w-4 h-4 mr-2" />
                Complete Verification
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceRestrictionNotice;
