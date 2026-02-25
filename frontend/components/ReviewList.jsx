import React, { useEffect, useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { getWorkshopReviews } from '../api/reviews';

const ReviewList = ({ workshopId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await getWorkshopReviews(workshopId);
                setReviews(data.reviews || []);
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        if (workshopId) {
            fetchReviews();
        }
    }, [workshopId]);

    if (loading) return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-gray-200 rounded w-3/4"></div></div></div>;

    if (reviews.length === 0) return (
        <div className="text-center p-6 border-2 border-dashed border-gray-100 rounded-xl text-gray-500">
            <MessageSquare className="mx-auto mb-2 opacity-50" size={24} />
            لا توجد تقييمات لهذه الورشة بعد.
        </div>
    );

    // Calculate average rating
    const avgRating = (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1);

    return (
        <div className="mt-8">
            <div className="flex items-center gap-4 mb-6">
                <h3 className="text-xl font-bold">تقييمات الزبائن</h3>
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                    <Star size={16} fill="#fbbf24" color="#fbbf24" />
                    <span className="font-bold text-yellow-700">{avgRating}</span>
                    <span className="text-sm text-yellow-600">({reviews.length} تقييم)</span>
                </div>
            </div>

            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="font-bold text-gray-900">{review.reviewerName || 'زائر'}</h4>
                                <span className="text-xs text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString('ar-DZ')}
                                </span>
                            </div>
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        fill={i < review.rating ? '#fbbf24' : '#f3f4f6'}
                                        color={i < review.rating ? '#fbbf24' : '#f3f4f6'}
                                    />
                                ))}
                            </div>
                        </div>
                        {review.comment && (
                            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                                {review.comment}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewList;
