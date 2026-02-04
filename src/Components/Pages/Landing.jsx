import React from "react";
import "../../Styles/Landing.scss";

const deals = [
  {
    name: "Smart Watch",
    price: "$49.99",
    rating: 4,
    image: "/Images/comp1.jpg",
  },
  {
    name: "Wireless Headphones",
    price: "$79.99",
    rating: 5,
    image: "/Images/comp2.jpg",
  },
  {
    name: "Bluetooth Speaker",
    price: "$39.99",
    rating: 4,
    image: "/Images/comp3.jpg",
  },
  {
    name: "Gaming Mouse",
    price: "$29.99",
    rating: 4,
    image: "/Images/comp3.jpg",
  },
   {
    name: "Smart Watch",
    price: "$49.99",
    rating: 4,
    image: "/Images/comp1.jpg",
  },
   {
    name: "Smart Watch",
    price: "$49.99",
    rating: 4,
    image: "/Images/comp1.jpg",
  },
];

const HomeHero = () => {
  return (
    <section className="home">
      {/* Hero Banner */}
      <div className="hero">
        <div className="hero__content">
          <h1>
            Fill your desk full <br /> of technology
          </h1>
          <p className="price">
            Starting from <span>$45.00</span>
          </p>
          <button className="hero__btn">Learn More</button>
        </div>

        <div className="hero__image">
          <img src="/Images/comp.jpg" alt="Tech products" />
        </div>
      </div>

      {/* Best Deals */}
      <div className="deals">
        <h2>Best Deals</h2>

        <div className="deals__grid">
          {deals.map((item, index) => (
            <div className="deal-card" key={index}>
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <div className="rating">
                {"★".repeat(item.rating)}
                {"☆".repeat(5 - item.rating)}
              </div>
              <span className="price">{item.price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
