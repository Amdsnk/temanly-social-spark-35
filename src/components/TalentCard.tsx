
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TalentCardProps {
  talent: any;
  featured?: boolean;
  isNewcomer?: boolean;
}

const TalentCard = ({ talent, featured = false, isNewcomer = false }: TalentCardProps) => {
  const levelColors = {
    fresh: 'bg-green-100 text-green-800',
    elite: 'bg-blue-100 text-blue-800',
    vip: 'bg-purple-100 text-purple-800'
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className={`overflow-hidden hover:shadow-xl transition-all duration-300 group ${
      featured ? 'ring-2 ring-yellow-400 shadow-lg' : ''
    }`}>
      {/* Header badges */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {featured && (
          <Badge className="bg-yellow-500 text-white flex items-center gap-1">
            <Star className="h-3 w-3" />
            Featured
          </Badge>
        )}
        {isNewcomer && (
          <Badge className="bg-green-500 text-white flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            New
          </Badge>
        )}
      </div>

      <CardHeader className="p-0">
        {/* Profile Image */}
        <div className="relative h-64 bg-gradient-to-br from-pink-100 to-purple-100 overflow-hidden">
          {talent.profile_image ? (
            <img
              src={talent.profile_image}
              alt={talent.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Heart className="h-16 w-16 text-pink-300" />
            </div>
          )}
          
          {/* Availability indicator */}
          <div className="absolute bottom-4 right-4">
            {talent.is_available ? (
              <Badge className="bg-green-500 text-white">Available</Badge>
            ) : (
              <Badge variant="secondary">Busy</Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Name and basic info */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{talent.name}</h3>
            <Badge className={levelColors[talent.talent_level as keyof typeof levelColors]}>
              {talent.talent_level?.toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            {talent.age && <span>{talent.age} years</span>}
            {talent.city && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{talent.city}</span>
              </div>
            )}
          </div>

          {talent.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{talent.rating}</span>
              <span className="text-sm text-gray-500">({talent.total_bookings || 0} orders)</span>
            </div>
          )}
        </div>

        {/* Bio */}
        {talent.bio && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{talent.bio}</p>
        )}

        {/* Interests */}
        {talent.talent_interests && talent.talent_interests.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {talent.talent_interests.slice(0, 3).map((interest: any, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {interest.interest}
                </Badge>
              ))}
              {talent.talent_interests.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{talent.talent_interests.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Services and pricing */}
        {talent.talent_services && talent.talent_services.length > 0 && (
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">Available Services:</div>
            <div className="flex flex-wrap gap-1">
              {talent.talent_services.slice(0, 2).map((service: any, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {service.service_type.replace('_', ' ')}
                </Badge>
              ))}
              {talent.talent_services.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{talent.talent_services.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Pricing */}
        {talent.hourly_rate && (
          <div className="mb-4">
            <span className="text-lg font-semibold text-gray-900">
              {formatPrice(talent.hourly_rate)}
            </span>
            <span className="text-sm text-gray-600">/hour</span>
          </div>
        )}

        {/* Additional info */}
        <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
          {talent.zodiac && <span>♈ {talent.zodiac}</span>}
          {talent.love_language && <span>💝 {talent.love_language}</span>}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button asChild className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
            <Link to={`/talent/${talent.id}`}>View Profile</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link to={`/book/${talent.id}`}>Book Now</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TalentCard;
