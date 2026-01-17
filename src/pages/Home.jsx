import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useObserver from "../hooks/useObserver";
import useScroll from "../hooks/useScroll";

const logos = [
  { img: "/assets/smartFinder_logo.svg", name: "SmartFinder" },
  { img: "/assets/zoomer_logo.svg", name: "Zoomer" },
  { img: "/assets/shells_logo.svg", name: "SHELLS" },
  { img: "/assets/waves_logo.svg", name: "WAVES" },
  { img: "/assets/artVenue_logo.svg", name: "ArtVenue" },
];

export default function Home() {
  const containerRef = useRef(null);
  const [scrollProgress, scrollVisible] = useScroll(containerRef);
  const [logosRef, logosVisible] = useObserver(0.2, true);

  return (
    <>
      <section className="px-8 py-20 max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white text-center">
          Explorez le <span className="text-purple-400">Web</span> sous toutes ses{" "}
          <span className="underline decoration-4 decoration-purple-400 underline-offset-12">facettes</span>
        </h1>

        <p className="font-normal text-lg mb-8 mt-8 max-w-[840px] mx-auto">
          Le monde du web évolue constamment, et nous sommes là pour vous guider à travers ses tendances,
          technologies et meilleures pratiques. Que vous soyez développeur, designer ou passionné du digital, notre
          blog vous offre du contenu de qualité pour rester à la pointe.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/discover"
            className="bg-gradient-to-r from-purple-600 to-purple-500 px-8 py-3 rounded-lg font-medium hover:from-purple-500 hover:to-purple-400 transition"
          >
            Découvrir les articles
          </Link>
          <Link
            to="/subscribe"
            className="border-2 border-white px-8 py-3 rounded-lg font-medium hover:border-gray-400 hover:bg-slate-800 transition"
          >
            S'abonner à la newsletter
          </Link>
        </div>

        <img
          src="/assets/Desktop.jpg"
          alt="Illustration desktop"
          className="mx-auto mt-16 w-full max-w-4xl"
          loading="lazy"
        />
      </section>

      <section className="px-8 py-16 max-w-6xl mx-auto text-center">
        <h2 className="text-5xl md:text-6xl font-extrabold mb-20">Ils nous font confiance</h2>
        <div ref={logosRef} className="flex flex-wrap justify-center items-center gap-12 text-2xl font-bold">
          {logos.map((logo, index) => (
            <div
              key={logo.name}
              className={`flex items-center gap-2 transition-all duration-700 ease-out ${
                logosVisible ? "translate-y-0 opacity-100" : "-translate-y-32 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <img src={logo.img} alt={`Logo ${logo.name}`} loading="lazy" />
              <span>{logo.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-8 py-20 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold mb-3 tracking-[3px]">DES RESSOURCES POUR TOUS LES NIVEAUX</p>
            <h3 className="text-5xl font-bold mb-6">
              <span className="text-purple-400">Apprenez</span> et
              <br />
              <span className="text-purple-400">progressez</span>
            </h3>
            <p className="leading-relaxed mb-6">
              Que vous débutiez en développement web ou que vous soyez un expert cherchant à approfondir vos
              connaissances, nous vous proposons des tutoriels, guides et bonnes pratiques pour apprendre
              efficacement.
            </p>
            <Link
              to="/ressources"
              className="inline-flex items-center gap-2 text-purple-400 font-medium hover:gap-3 transition-all"
            >
              Explorer les ressources <span>→</span>
            </Link>
          </div>
          <img
            src="/assets/Desktop.jpg"
            alt="Ressources d'apprentissage"
            className="w-full max-w-4xl"
            loading="lazy"
          />
        </div>
      </section>

      <section className="px-8 py-20 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div ref={containerRef} className="relative flex items-center justify-center">
            <div
              className="relative w-[500px] h-[500px] transition-all duration-1000"
              style={{
                opacity: scrollVisible ? 1 : 0,
                transform: scrollVisible ? "scale(1)" : "scale(0.8)",
              }}
            >
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="absolute inset-0 border-4 border-purple-500 rounded-lg transition-all duration-300"
                  style={{
                    transform: `rotate(${i * 15 + scrollProgress * 360}deg) scale(${1 - i * 0.05})`,
                    opacity: scrollVisible ? 0.4 - i * 0.05 : 0,
                    transitionDelay: `${i * 100}ms`,
                  }}
                />
              ))}

              <div
                className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 rounded-lg shadow-2xl shadow-pink-500/50 transition-all duration-500"
                style={{
                  transform: `translate(-50%, -50%) rotate(${12 + scrollProgress * 180}deg)`,
                  opacity: scrollVisible ? 1 : 0,
                }}
              />
            </div>
          </div>

          <div className="order-1 md:order-2 z-10">
            <p className="text-sm font-semibold mb-3 tracking-[3px]">
              LE WEB, UN ÉCOSYSTÈME EN CONSTANTE ÉVOLUTION
            </p>
            <h3 className="text-5xl font-bold mb-6">
              Restez informé des
              <br />
              dernières <span className="text-purple-400">tendances</span>
            </h3>
            <p className="leading-relaxed mb-6">
              Chaque semaine, nous analysons les nouveautés du web : frameworks émergents, bonnes pratiques SEO,
              accessibilité, et bien plus encore. Ne manquez aucune actualité du digital !
            </p>
            <Link
              to="/news"
              className="inline-flex items-center gap-2 text-purple-400 font-medium hover:gap-3 transition-all"
            >
              Lire les articles récents <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
