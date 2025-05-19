import ReviewCard from '@/components/ReviewCard';

// Example data structure
const sampleReview = {
  id: '1',
  title: 'Great teaching style!',
  comment: 'The session was very informative and well-structured. Learned a lot in just 60 minutes!',
  rating: 5,
  createdAt: '2023-06-15T14:32:00Z',
  reviewer: {
    name: 'Alex Johnson',
    image: '/path/to/image.jpg'
  },
  session: {
    skill: 'Photography Basics',
    date: '2023-06-10T16:00:00Z'
  },
  isPending: false
};

function ReviewsList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ReviewCard review={sampleReview} />
      {/* Map through reviews array */}
      {reviews.map(review => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}