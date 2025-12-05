import { useEffect, useState } from "react";
import Container from "Components/Container/Container";
import useFetch from "Hooks/useFetch";
import { IMAGE_URL } from "Utilities/BASE_URL";

const Inspiration = () => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { fetchData } = useFetch();

  const getData = async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      const res = await fetchData("/inspiration");
      setData(res?.data);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleItemClick = (item) => {
    // Only open modal on large screens (lg and above)
    if (window.innerWidth >= 1024) {
      setSelectedItem(selectedItem === item ? null : item);
    }
  };

  if (isLoading) {
    return (
      <section className="py-secondary lg:py-primary bg-background min-h-[60vh] flex items-center justify-center">
        <Container>
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </Container>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-secondary lg:py-primary bg-background min-h-[60vh] flex items-center justify-center">
        <Container>
          <div className="text-center text-secondary">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p>
              We couldn't load the inspiration content. Please try again later.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-secondary lg:py-primary bg-background">
      <Container>
        <div className="max-w-4xl mx-auto text-center mb-32">
          <h1 className="text-3xl md:text-4xl lg:text-5xl text-black italic font-bold mb-6 relative">
            {data?.page_title}
            {/* <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></span> */}
          </h1>
          <p className="text-black/80 mt-8 max-w-2xl mx-auto">
            {data?.page_description}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(data?.gallery || []).map((item, idx) => (
            <div
              key={idx}
              className="group cursor-pointer hover:-translate-y-2 transition-transform duration-300"
              onClick={() => handleItemClick(item)}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg aspect-[4/3]">
                {item.image && (
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    src={`${IMAGE_URL}/${item.image}`}
                    alt={item.text || `Inspiration ${idx + 1}`}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent lg:opacity-0 lg:group-hover:opacity-100 opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white lg:transform lg:translate-y-4 lg:group-hover:translate-y-0 transition-transform duration-300">
                    <p className=" font-medium line-clamp-2">{item.text}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* 
        {selectedItem && window.innerWidth >= 1024 && (
          <div
            className="fixed inset-0 bg-secondary/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <div
              className="bg-white rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="md:w-1/2 h-64 md:h-auto">
                <img
                  src={`${IMAGE_URL}/${selectedItem.image}`}
                  alt={selectedItem.text}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 md:w-1/2 overflow-y-auto">
                <h3 className="text-xl font-semibold text-secondary mb-4">
                  Inspiration Details
                </h3>
                <p className="text-xl text-secondary/80">{selectedItem.text}</p>
                <button
                  className="mt-6 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
                  onClick={() => setSelectedItem(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )} */}
      </Container>
    </section>
  );
};

export default Inspiration;
