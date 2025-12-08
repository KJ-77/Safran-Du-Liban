import React from "react";
import Container from "Components/Container/Container";
import Logo from "assets/Images/safran-logo-1.png";
import bannerImage from "assets/Images/banner101-1.png";

const Hero = () => {
  return (
    <div
      id="hero-section"
      className="h-[20vh] xsm:h-[22vh] ss:h-[26vh] sxs:h-[28vh] bxs:h-[30vh] sm:h-[32vh] sms:h-[36vh] ssm:h-[40vh] md:h-[40vh] mds:h-[42vh] lds:h-[55vh] lg:h-[60vh] xxl:h-[80vh] relative overflow-hidden "
    >
      <div className="absolute top-0 left-0 w-full ">
        {/* <img className="object-s w-full h-full" src={heroImage} alt="" /> */}
        <img
          className="object-s w-full h-full"
          src={bannerImage}
          alt="Banner"
        />
      </div>

      <Container className="h-full flex flex-col items-center justify-center relative z-[100]">
        <div>
          <div className="flex flex-col mt-40 xsm:mt-48 lg:mt-72 justify-center items-center">
            <div className="mr-10 lg:hidden">
            </div>
            <img
              src={Logo}
              alt="Logo"
              className="hidden lg:block lg:w-[18rem] xxl:w-[26rem] mx-auto object-contain"
            />

            <p className="text-whiste  italic mt-20 lg:mt-16 xxl:mt-20 text-center text-3xl font-bold">
              From the land of cedars
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Hero;
