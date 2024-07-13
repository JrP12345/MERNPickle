import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/ImageSlider.css'; // Import CSS file for custom styles

const ImageSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, 
    autoplaySpeed: 5000,
    adaptiveHeight: true // Ensures the height adjusts according to the content
  };

  const images = [
    { src: "/s6.jpg", alt: "Image 1" },
    { src: "/s6.jpg", alt: "Image 1" },
    { src: "/s6.jpg", alt: "Image 1" },
  ];

  return (
    <div className="slidercontainer">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <img src={image.src} alt={image.alt} className="slider-image" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
