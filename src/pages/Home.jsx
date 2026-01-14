import React from "react";
import { Link } from "react-router-dom";
export default function Home() {
  return (
    <>
      <section className="px-8 py-20 max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-[72px] font-extrabold mb-6">
          Explorez le <span className="text-purple-400 font-light">Web</span> sous toutes
          <br />
          ses <span className="underline decoration-4 decoration-purple-400 underline-offset-12">facettes</span>
        </h1>
        <p className="font-normal text-lg mb-8 max-w-[840px] mx-auto ">
          Le monde du web évolue constamment, et nous sommes là pour vous guider à travers ses tendances,
          technologies et meilleures pratiques. Que vous soyez développeur, designer ou passionné du digital, notre
          blog vous offre du contenu de qualité pour rester à la pointe.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/discover"
            className="bg-gradient-to-r from-purple-600 to-purple-500 px-8 py-3 rounded-[8px] font-medium hover:from-purple-500 hover:to-purple-400 transition"
          >
            Découvrir les articles
          </Link>
          <Link
            to="/subscribe"
            className="border-[2px] border-white px-8 py-3 rounded-[8px] font-medium hover:border-gray-400 hover:bg-slate-800 transition"
          >
            S'abonner à la newsletter
          </Link>
        </div>
        <div>
          <img src="/assets/Desktop.jpg" alt="Illustration desktop" className="mx-auto mt-16 w-full max-w-4xl" />
        </div>
      </section>

      <section className="px-8 py-16 max-w-6xl mx-auto text-center">
        <h2 className="text-[56px] font-extrabold mb-20">Ils nous font confiance</h2>
        <div className="flex flex-wrap justify-center items-center gap-12 text-[24px] font-bold ">
          <div className="flex items-center gap-2">
            <img src="/assets/smartFinder_logo.svg" alt="" />
            <span>SmartFinder</span>
          </div>
          <div className="flex items-center gap-2">
            <img src="/assets/zoomer_logo.svg" alt="" />
            <span>Zoomer</span>
          </div>
          <div className="flex items-center gap-2">
            <img src="/assets/shells_logo.svg" alt="" />
            <span>SHELLS</span>
          </div>
          <div className="flex items-center gap-2">
            <img src="/assets/waves_logo.svg" alt="" />
            <span>WAVES</span>
          </div>
          <div className="flex items-center gap-2">
            <img src="/assets/artVenue_logo.svg" alt="" />
            <span>ArtVenue</span>
          </div>
        </div>
      </section>

      <section className="px-8 py-20 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-purple-400 text-sm font-semibold mb-3 tracking-[3px]">
              DES RESSOURCES POUR TOUS LES NIVEAUX
            </p>
            <h3 className="text-5xl font-bold mb-6">
              <span className="text-purple-400">Apprenez</span> et
              <br />
              progressez
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
          <div>
            <img src="/assets/Desktop.jpg" alt="Illustration desktop" className="mx-auto mt-16 w-full max-w-4xl" />
          </div>
        </div>
      </section>

      <section className="px-8 py-20 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <img src="/assets/Shapes.jpg" alt="Illu" className="mx-auto h-[412px] w-[415px]" />
          </div>

          <div className="order-1 md:order-2">
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
              href="#"
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
