import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "../style/ReviewCarousel.scss";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarEmpty } from "@fortawesome/free-regular-svg-icons";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 2,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 768, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const ReviewCarousel = ({ reviewData }) => {
  console.log("d ", reviewData);
  return (
    <div className="review-carousel">
      <h2>What Our Users Say</h2>
      <p>
        We value the feedback of every client and strive to provide the best
        experience possible. Here's what some of our happy customers have to say
        about our services. Read their reviewData to see how we've helped them
        capture special moments, and feel free to leave your own feedback too!
      </p>
      <Carousel
        responsive={responsive}
        infinite
        autoPlay
        autoPlaySpeed={5000}
        keyBoardControl
        containerClass="carousel-container"
        removeArrowOnDeviceType={["tablet", "mobile"]}
      >
        {reviewData.map((review, index) => (
          <div className="review-card shadow" key={index}>
            <div className="name">
              <div>{review.username.charAt(0).toUpperCase()}</div>
              <h4 className="text-capitalize">{review.username}</h4>
            </div>
            <div className="d-flex flex-column align-items-center stify-content-center">
              <p className="feedback fw-bold w-100 text-start mt-2">"{review.feedback}"</p>
              <div style={{ display: "flex" }} className="stars ">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    style={{
                      cursor: "pointer",
                      fontSize: "24px",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={star <= review.rating ? faStar : faStarEmpty}
                      style={{ color: star <= review.rating ? "gold" : "gold" }}
                      size="x"
                    />
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="reply">
                <strong>Reply:</strong> {review.reply_msg}
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ReviewCarousel;
