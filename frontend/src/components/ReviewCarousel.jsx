import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import '../style/ReviewCarousel.scss';

const reviews = [
  {
    name: 'Alice Johnson',
    feedback: 'Great experience! The service was fast and helpful.',
    rating: 5,
    reply: 'Thank you Alice! We’re happy to hear you had a good experience.',
  },
  {
    name: 'Mark Smith',
    feedback: 'The platform is easy to use and very intuitive.',
    rating: 4,
    reply: 'Appreciate the kind words, Mark!',
  },
  {
    name: 'Sophie Lee',
    feedback: 'Had some issues initially but support was great.',
    rating: 4,
    reply: 'Thanks Sophie, we’re always here to help!',
  },
  {
    name: 'John Doe',
    feedback: 'Could use more features, but good overall.',
    rating: 3,
    reply: 'Thanks for the feedback John, we’re working on it!',
  },
  {
    name: 'Emma Watson',
    feedback: 'Loved it! Would definitely recommend to friends.',
    rating: 5,
    reply: 'Thanks so much Emma!',
  }
];

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 1
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 2,
    slidesToSlide: 1
  },
  mobile: {
    breakpoint: { max: 768, min: 0 },
    items: 1,
    slidesToSlide: 1
  }
};

const ReviewCarousel = () => {
  return (
    <div className="review-carousel">
      <h2>What Our Users Say</h2>
      <p>We value the feedback of every client and strive to provide the best experience possible. Here's what some of our happy customers have to say about our services. Read their reviews to see how we've helped them capture special moments, and feel free to leave your own feedback too!</p>
      <Carousel
        responsive={responsive}
        infinite
        autoPlay
        autoPlaySpeed={5000}
        keyBoardControl
        containerClass="carousel-container"
        removeArrowOnDeviceType={["tablet", "mobile"]}
      >
        {reviews.map((review, index) => (
          <div className="review-card" key={index}>
            <div className='name'>
                <div>
                    {review.name.charAt(0).toUpperCase()}
                </div>
                <h4>{review.name}</h4>
            </div>
            <div>
                <p className="feedback">"{review.feedback}"</p>
                <div className="rating">{'⭐'.repeat(review.rating)}</div>
            </div>
            <div>
                <div className="reply"><strong>Reply:</strong> {review.reply}</div>
            </div>
          </div>
          
        ))}
      </Carousel>
    </div>
  );
};

export default ReviewCarousel;
