
import React, { useState } from 'react';
import { Star, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
  verified?: boolean;
}

interface ProductReviewsProps {
  productId: string;
  averageRating?: number;
  reviewCount?: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ 
  productId, 
  averageRating = 0, 
  reviewCount = 0 
}) => {
  const { t } = useLanguage();
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, content: '' });

  // Mock reviews data - in real app, this would come from GraphQL
  const reviews: Review[] = [
    {
      id: '1',
      author: 'John Doe',
      rating: 5,
      date: '2024-01-15',
      content: 'Great product! Highly recommended.',
      verified: true
    },
    {
      id: '2',
      author: 'Jane Smith',
      rating: 4,
      date: '2024-01-10',
      content: 'Good quality, fast shipping.',
      verified: true
    }
  ];

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive ? () => setNewReview(prev => ({ ...prev, rating: star })) : undefined}
          />
        ))}
      </div>
    );
  };

  const handleSubmitReview = () => {
    // In real app, this would submit to backend
    console.log('Submitting review:', newReview);
    setShowWriteReview(false);
    setNewReview({ rating: 5, content: '' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <span>{t('reviews.title')}</span>
              {reviewCount > 0 && (
                <Badge variant="secondary">{reviewCount}</Badge>
              )}
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowWriteReview(!showWriteReview)}
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('reviews.writeReview')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {averageRating > 0 && (
            <div className="flex items-center space-x-2 mb-6">
              {renderStars(averageRating)}
              <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
              <span className="text-gray-500">({reviewCount} {t('reviews.title').toLowerCase()})</span>
            </div>
          )}

          {showWriteReview && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('reviews.rating')}</label>
                    {renderStars(newReview.rating, true)}
                  </div>
                  <div>
                    <Textarea
                      placeholder="Write your review..."
                      value={newReview.content}
                      onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                      rows={4}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleSubmitReview}>Submit Review</Button>
                    <Button variant="outline" onClick={() => setShowWriteReview(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{review.author}</span>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">Verified</Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          {renderStars(review.rating)}
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">{t('reviews.noReviews')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductReviews;
