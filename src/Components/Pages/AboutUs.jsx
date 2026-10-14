import React from "react";
import { ArrowRight, Check, HeartHandshake, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../Layout/Footer";

const values = [
  { icon: <ShieldCheck size={22} />, title: "Quality you can count on", text: "We focus on dependable products that earn a place in your everyday life." },
  { icon: <HeartHandshake size={22} />, title: "People come first", text: "Helpful, honest support is part of the experience—not an afterthought." },
  { icon: <Sparkles size={22} />, title: "Curated with care", text: "A thoughtful range makes finding the right technology feel simple." },
  { icon: <Truck size={22} />, title: "Here for the journey", text: "From choosing your device to getting it home, we are here to help." },
];

export default function AboutUs() {
  const navigate = useNavigate();
  return (
    <main className="about-page">
      <section className="about-hero container">
        <div><span className="store-eyebrow">A LITTLE ABOUT REPA KALISIMBI</span><h1>Good technology.<br /><em>Good people.</em></h1><p>We believe the best technology is the kind that makes your day easier, more connected, and a little more inspiring.</p><button type="button" className="store-button store-button-dark" onClick={() => navigate("/category")}>Explore our collection <ArrowRight size={17} /></button></div>
        <div className="about-hero-image"><img src="/Images/comp.jpg" alt="A collection of modern consumer technology" /><span>Technology for real life.</span></div>
      </section>
      <section className="about-story container"><span className="store-eyebrow">OUR POINT OF VIEW</span><h2>Shopping for your next device should feel as good as using it.</h2><p>Repa Kalisimbi brings together useful technology and a more thoughtful way to shop. We put clarity first: products worth considering, straightforward choices, and a team that is ready to help you find what fits.</p><p>Whether you are upgrading your workspace, finding a gift, or simply curious about what is new, we want every step to feel confident and easy.</p><div className="about-signoff"><span><Check size={17} /> Carefully selected</span><span><Check size={17} /> Ready to help</span><span><Check size={17} /> Made for everyday</span></div></section>
      <section className="about-values"><div className="container"><span className="store-eyebrow">WHAT MATTERS TO US</span><h2>A better kind of tech shop.</h2><div className="about-value-grid">{values.map((value) => <article key={value.title}><div>{value.icon}</div><h3>{value.title}</h3><p>{value.text}</p></article>)}</div></div></section>
      <section className="about-policies container">
        <article id="terms"><span className="store-eyebrow">TERMS OF USE</span><h2>Shopping, made clear.</h2><p>This storefront lets you browse products, keep a local cart and wishlist, and place a locally recorded order. Product availability, pricing, and delivery details should be confirmed with our team before purchase. Contact us on WhatsApp if you need help.</p></article>
        <article id="privacy"><span className="store-eyebrow">PRIVACY</span><h2>Your details stay in your browser.</h2><p>This version stores account details, cart items, saved products, newsletter sign-ups, and order records in this browser only. It does not send this information to a server. Clearing browser storage will remove locally saved data. Do not enter sensitive payment details.</p></article>
      </section>
      <section className="about-bottom container"><div><span className="store-eyebrow">LET&apos;S FIND YOUR NEXT FAVOURITE</span><h2>Ready when you are.</h2></div><button type="button" className="store-button store-button-dark" onClick={() => navigate("/category")}>Start exploring <ArrowRight size={17} /></button></section>
      <Footer />
    </main>
  );
}