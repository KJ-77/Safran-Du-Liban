import Container from "Components/Container/Container";
import bird from "assests/Images/bird.png";
const Features = ({ data }) => {
  return (
    <section className="bg-background py-12 sm:py-16 md:py-20 lg:py-24">
      <Container>
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 md:gap-16 lg:gap-20 xxl:gap-x-44">
          <div className="flex-1 flex flex-col gap-y-8 sm:gap-y-12 md:gap-y-16  lg:mt-18 xl:mt-20">
            {data?.about_us?.map((item, index) => (
              <div key={index}>
                <h4 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl  italic mb-2 font-semibold leading-tight xl:leading-normal">
                  {item.title}
                </h4>
                <div
                  className="rich-text-content text-sm sm:text-base lg:text-base"
                  dangerouslySetInnerHTML={{ __html: item.text }}
                />
              </div>
            ))}
            <div className="flex items-center justify-center w-full w-2/3 sm:w-3/4 md:w-2/3 lg:w-2/3 xl:w-[70%] mx-auto mt-0 lg:mt-20">
              <img
                src={bird}
                alt=""
                className="w-full h-auto max-w-xs sm:max-w-sm md:max-w-md xl:max-w-none object-contain"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-secondary text-white  h-max rounded-3xl sm:rounded-[50px] md:rounded-[70px] lg:rounded-[80px] xl:rounded-[99px]  gap-y-8 sm:gap-y-12 md:gap-y-16 lg:gap-y-20 mt-8 lg:mt-0 p-8 sm:p-12 md:p-16 lg:p-18 xl:p-20">
            {data?.why_us?.map((item, index) => (
              <div className="" key={index}>
                <h4 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl  italic text-primary mb-2 font-semibold leading-tight xl:leading-normal">
                  {item.title}
                </h4>
                <div
                  className="text-white rich-text-content text-sm sm:text-base lg:text-base"
                  dangerouslySetInnerHTML={{ __html: item.text }}
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Features;
