import Container from "components/Container/Container";

const IsLoading = () => {
  return (
    <div className="relative overflow-hidden h-[100vh]  bg-gray-300 w-full">
      <Container className={"h-full"}>
        <div className="flex flex-col justify-center lg:flex-row lg:items-center gap-16 h-full">
          <div className="lg:flex-1 flex flex-col gap-4">
            <div className="bg-gray-400 w-1/2 h-[2rem] rounded-md  animate-pulse"></div>
            <div className="bg-gray-400 w-3/4 h-[2rem] rounded-md  animate-pulse"></div>
            <div className="bg-gray-400 w-[20%] h-[2rem] rounded-md  animate-pulse"></div>
          </div>

          <div className="lg:flex-1">
            <div className="bg-gray-400 rounded-md animate-pulse lg:w-3/4 h-[30vh] mx-auto"></div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default IsLoading;
