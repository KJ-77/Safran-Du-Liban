import Container from "components/Container/Container";

import { ReactComponent as ErrorIcon } from "assests/undraw_fixing_bugs_w7gi.svg";

const IsError = ({ iswhite }) => {
  return (
    <div className="flex items-center gap-x-4 h-[100vh]">
      <Container>
        <div className="flex flex-col lg:flex-row justify-between items-center gap-14 w-full h-full">
          <p
            className={`flex-1 font-roboto text-xl font-medium text-center ${
              iswhite ? "text-white" : ""
            }`}
          >
            Oops! Something went wrong.
            <br />
            Don't worry, we're on it. Please try again later.
          </p>

          <div className=" flex-1">
            <ErrorIcon className="flex-1 w-full h-full" />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default IsError;
