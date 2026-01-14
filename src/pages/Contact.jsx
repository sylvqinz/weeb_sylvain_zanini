export default function Contact() {
  return (
    <section className="from-[#0b1020] to-[#070b16] flex items-center justify-center px-4">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Votre avis compte !</h1>

        <p className="text-gray-300 max-w-2xl mx-auto mb-12">
          Votre retour est essentiel pour nous améliorer ! Partagez votre expérience, dites-nous ce que vous aimez
          et ce que nous pourrions améliorer. Vos suggestions nous aident à faire de ce blog une ressource toujours
          plus utile et enrichissante.
        </p>

        
        <div className="border border-purple-500/70 rounded-2xl p-8 bg-[#20223f] backdrop-blur">
          <form className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-purple-400 mb-2">Nom</label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b border-purple-400 text-white outline-none py-2 focus:border-purple-500 focus:bg-purple-900/15 focus:border-purple-600 focus:shadow-[0_2px_0_0_#9333ea] transition"
                />
              </div>

              <div>
                <label className="block text-purple-400 mb-2">Prénom</label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b border-purple-400 text-white outline-none py-2 focus:border-purple-500 focus:bg-purple-900/15 focus:border-purple-600 focus:shadow-[0_2px_0_0_#9333ea] transition"
                />
              </div>
            </div>

            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-purple-400 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full bg-transparent border-b border-purple-400 text-white outline-none py-2 focus:border-purple-500 focus:bg-purple-900/15 focus:border-purple-600 focus:shadow-[0_2px_0_0_#9333ea] transition"
                />
              </div>
              <div>
                <label className="block text-purple-400 mb-2">Objet</label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b border-purple-400 text-white outline-none py-2 focus:border-purple-500 focus:bg-purple-900/15 focus:border-purple-600 focus:shadow-[0_2px_0_0_#9333ea] transition"
                />
              </div>
            </div>

         
            <div>
              <label className="block text-purple-400 mb-2">Message</label>
              <textarea
                rows="3"
                className="w-full bg-transparent border-b border-purple-400 text-white outline-none py-2 resize-none focus:border-purple-500 focus:bg-purple-900/15 focus:border-purple-600 focus:shadow-[0_2px_0_0_#9333ea] transition"
              />
            </div>

            <button
              type="submit"
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-10 py-2 rounded-lg transition"
            >
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
