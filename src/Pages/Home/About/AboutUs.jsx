import React, { useState, useEffect } from "react";
import Container from "Components/Container/Container";

const AboutUs = ({ data, about }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const description = data?.about_us?.description || "";

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  return (
    <div className="">
      <Container>
        <div className="py-8 lg:py-24">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl italic font-medium text-center mb-3 sm:mb-4 md:mb-5 lg:mb-6 xxl:mb-14 text-primary">
            {data?.about_us?.title}
          </h1>
          <div className="flex flex-col items-center">
            <p className="text-center text-sm sm:text-base md:text-lg lg:text-lg xxl:text-lg px-4 sm:px-8 md:px-12 lg:px-16">
              {isMobile && !isExpanded
                ? truncateText(description, 150)
                : description}
            </p>
            {isMobile && description.length > 150 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-primary font-medium"
              >
                {isExpanded ? "Read less" : "Read more"}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 md:gap-16 lg:gap-20 xxl:gap-24  rounded-2xl sm:rounded-3xl lg:rounded-[32px] pb-8 lg:py-24">
          {about?.about_us?.map((item) => (
            <div className="flex-1 text-center" key={item._id}>
              <h4 className="text-primary italic text-2xl sm:text-3xl md:text-4xl lg:text-4xl xxl:text-5xl mb-3 sm:mb-4 md:mb-5 lg:mb-6 xxl:mb-6 font-medium">
                {item?.title}
              </h4>
              <p className="text-black text-sm sm:text-base lg:text-base">
                {item?.text}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default AboutUs;
