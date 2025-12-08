import { useEffect, useState, useCallback } from "react";
import Container from "Components/Container/Container";
import useFetch from "Hooks/useFetch";
import BASE_URL from "Utilities/BASE_URL";
import { IMAGE_URL } from "Utilities/BASE_URL";

const Carrer = () => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const { fetchData } = useFetch();
  const getData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      const data = await fetchData("/career");
      setData(data?.data);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [fetchData]);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormSuccess(false);
    setFormError(false);

    try {
      // Submit career application form to backend
      const response = await fetch(`${BASE_URL}/career/apply`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();

      // Check if the request was successful
      if (data.status === "success") {
        setFormSuccess(true);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          message: "",
        });
      } else {
        throw new Error(data.message || "Failed to submit application");
      }
    } catch (err) {
      console.error("Error submitting application:", err);
      setFormError(true);
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <section className="py-secondary lg:py-primary  bg-background">
      <Container>
        <div className="mb-32 w-full flex justify-center">
          <img
            src={`${IMAGE_URL}/${data?.image}`}
            // src={image}
            alt={data?.title}
            className="w-full h-[300px] object-cover rounded-[16px]"
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-[2]">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-[600px]">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">
                  Loading career information...
                </p>
              </div>
            )}

            {isError && (
              <div className="flex flex-col items-center justify-center h-[600px] text-red-600">
                <p>Failed to load career information.</p>
                <button
                  onClick={getData}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
                >
                  Try Again
                </button>
              </div>
            )}

            {!isLoading && !isError && data && (
              <>
                <h1 className="text-3xl md:text-4xl lg:text-5xl text-black italic font-bold lg:mb-20 mb-10 text-start">
                  {data?.title}
                </h1>
                <p className="text-start lg:w-3/4 ">{data?.description}</p>
                <p className="text-2xl italic ml-auto text-end w-3/4 mt-16 font-semibold">
                  {data?.slogan}
                </p>
              </>
            )}
          </div>
          <form
            className="flex-1 shadow-2xl rounded-lg p-8"
            onSubmit={handleSubmit}
          >
            <h2 className="text-xl font-bold mb-10">
              Be Part of Safran du Liban’s team
            </h2>

            {formSuccess && (
              <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
                Your application has been submitted successfully! We'll get back
                to you soon.
              </div>
            )}

            {formError && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
                There was an error submitting your application. Please try
                again.
              </div>
            )}

            <div className="mb-8 flex items-center">
              <label htmlFor="firstName" className="text-sm font-medium w-1/5">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-[60%] p-2 bg-gray-100 focus:border-primary outline-none transition-colors"
                required
                disabled={formSubmitting}
              />
            </div>

            <div className="mb-8 flex items-center space-x-1">
              <label htmlFor="lastName" className="text-sm font-medium w-1/5">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="   w-[60%] p-2 bg-gray-100 focus:border-primary outline-none transition-colors"
                required
                disabled={formSubmitting}
              />
            </div>

            <div className="mb-8 flex items-center space-x-1">
              <label htmlFor="email" className="text-sm font-medium w-1/5">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-[60%] p-2 bg-gray-100 focus:border-primary outline-none transition-colors"
                required
                disabled={formSubmitting}
              />
            </div>

            <div className="mb-6 flex items-start space-x-1">
              <label
                htmlFor="message"
                className="text-sm font-medium w-1/5 pt-3"
              >
                About you
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-[60%] p-3 bg-gray-100 focus:border-primary outline-none transition-colors min-h-[100px] resize-y"
                required
                disabled={formSubmitting}
              ></textarea>
            </div>

            <div className="text-rights w-1/2 ml-auto">
              <button
                type="submit"
                className={`px-6 py-2 bg-[#faf7ef] shadow-xl text-black hover:text-white rounded-lg hover:bg-primary transition-all ${
                  formSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={formSubmitting}
              >
                {formSubmitting ? "Submitting..." : "Apply Now"}
              </button>
            </div>
          </form>
        </div>
      </Container>
    </section>
  );
};

export default Carrer;
