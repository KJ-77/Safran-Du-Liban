import React, { useState, useEffect } from "react";
import Hero from "./Hero/Hero";
import useFetch from "../../Hooks/useFetch";
import Features from "./Features/Features";
import AboutUs from "./About/AboutUs";

const Home = () => {
  const { fetchData } = useFetch();
  const [homeData, sethomeData] = useState([]);
  useEffect(() => {
    const loadData = async () => {
      const result = await fetchData(`/home`);
      sethomeData(result);
    };
    loadData();
  }, []);

  return (
    <main>
      <Hero data={homeData?.hero} />
      <AboutUs about={homeData?.about_us} data={homeData?.hero} />
      <Features data={homeData?.features} />
    </main>
  );
};

export default Home;
