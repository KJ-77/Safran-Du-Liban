import React, { useState } from "react";
import Hero from "./Hero/Hero";
import Features from "./Features/Features";
import AboutUs from "./About/AboutUs";

const Home = () => {
  // Hardcoded data structure
  const [homeData] = useState({
    // Data for Hero section (passed to AboutUs as 'data' prop)
    hero: {
      about_us: {
        title: "The Saffron Project",
        description:
          "Lebanon experienced a long and severe economic crisis during the 20 years of civil war that ravaged the country, and triggered an important rural exodus. This project is inscribed in an effort to regenerate the rural and economic development of the region: bringing back families to agriculture and introducing new cultivation to the area (this is the first of its kind in Lebanon). Our choice of land is the Bekaa Valley, known for its fertile soil, a symbol of Lebanese agriculture. Saffron is a fascinating crop as it reproduces itself every year: 1 bulb will give 3 bulbs after one year, and 10 bulbs after 3 years. The new saffron corms grow on top of the previous ones, and need to be replanted every 5-6 years to avoid suffocation. Once taken out of the soil, the bulbs will be distributed to the local community, with the purpose of creating a cooperative. This will enable families to grow their own saffron and transmit their knowledge from generation to generation. Last year, we started working with new 4 organic farmers all over Lebanon. The idea will be to finally be able to create a social cooperative around & be able to help more & more families with time.",
      },
    },

    // Data for AboutUs section cards (passed to AboutUs as 'about' prop)
    about_us: {
      about_us: [
        {
          _id: "1",
          title: "Excellence with a purpose",
          text: "Lebanon's first safron project accomplished the unthinkable: attain the finest quality in terms of color and flavor while having a social responsible impact on local communities.",
        },
        {
          _id: "2",
          title: "Cultivation",
          text: "It is an agricultural artform that requires passion, patience , experience and know-how. Far from the steel of industrial manufacturing, its cultivation.",
        },
      ],
    },

    // Data for Features section (passed to Features as 'data' prop)
    features: {
      about_us: [
        {
          title: "A Table!",
          text: "<p>Lebanon’s first saffron project accomplished the unthinkable: attain the finest quality in terms of color and flavor while having a social responsible impact on local communities. <br />This organic and healthy product can be found at several michelin star restaurants</p>",
        },
        {
          title: "We Guarantee",
          text: "<ul><li>The highest quality of saffron, as evidenced in full stigmas</li><li>100% organic & hand-harvested cultivation</li><li>Its freshness, flavour & colour. The saffron will retain its high quality for 3 years.</li></ul><p>‘Safran du Liban’ has been analysed and approved by the department of Consumer and Veterinary Affairs (SCAV) in Switzerland.</p>",
        },
        {
          title: "Did You Know?",
          text: "<p>Since antiquity, this spice is considered a panacea for many illnesses</p><ul><li>Rich in carotenoids, it has anticarcinogenic properties.</li><li>It is an antioxidant which stimulates digestion and relieves the liver</li><li>Safron is also known for its antidepressant, aphrodisiac and analgesic characteristics. To consume without moderation!</li></ul>",
        },
      ],
      why_us: [
        {
          title: "The Social Project",
          text: "<p>This project is part of a global framework, it is rural and an economic development for the country: It’s about introducing a new culture because it is the first safron farm in Lebanon, it also trains families in order to develop their own expertise in cultivating safron, and passing their know-how from generation to generation.</p>",
        },
        {
          title: "The Magic Spice",
          text: "<p>Since ancient times, this spice has been considered like a miracle cure:</p><ul><li>Rich in carotenoids, it has anticancer properties</li><li>An antioxidant, it stimulates digestion and relieves the liver.</li><li>Known for its virtues antidepressant, aphrodisiac and analgesic.</li></ul>",
        },
        {
          title: "Culture",
          text: "<p>It is an agricultural art that requires passion, patience and experience. Its flower is ephemeral: it blooms, once per year, and dies within 48 hours. 200 flowers harvested by hand equals 1 gram of dry safron.</p>",
        },
      ],
    },
  });

  return (
    <main>
      <Hero />
      <AboutUs about={homeData?.about_us} data={homeData?.hero} />
      <Features data={homeData?.features} />
    </main>
  );
};

export default Home;
