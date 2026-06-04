import { type FormEvent, useState } from "react";
import { sendContact } from "../lib/contact";

export default function Contact() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await sendContact({
        first_name: firstName,
        last_name: lastName,
        email,
        subject,
        message: content,
      });

      setFirstName("");
      setLastName("");
      setEmail("");
      setSubject("");
      setContent("");
      setMessage("Votre message a bien été envoyé.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Impossible d'envoyer le message.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="from-[#0b1020] to-[#070b16] flex items-center justify-center px-4 pb-20">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Votre avis compte !</h1>

        <p className="text-gray-300 max-w-2xl mx-auto mb-12">
          Votre retour est essentiel pour nous améliorer ! Partagez votre expérience, dites-nous ce que vous aimez
          et ce que nous pourrions améliorer. Vos suggestions nous aident à faire de ce blog une ressource toujours
          plus utile et enrichissante.
        </p>

        <div className="border border-purple-500/70 rounded-2xl p-8 bg-[#20223f] backdrop-blur">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-purple-400 mb-2">Nom</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-purple-400 text-white outline-none py-2 focus:border-purple-500 focus:bg-purple-900/15 focus:border-purple-600 focus:shadow-[0_2px_0_0_#9333ea] transition"
                />
              </div>

              <div>
                <label className="block text-purple-400 mb-2">Prénom</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-purple-400 text-white outline-none py-2 focus:border-purple-500 focus:bg-purple-900/15 focus:border-purple-600 focus:shadow-[0_2px_0_0_#9333ea] transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-purple-400 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-purple-400 text-white outline-none py-2 focus:border-purple-500 focus:bg-purple-900/15 focus:border-purple-600 focus:shadow-[0_2px_0_0_#9333ea] transition"
                />
              </div>
              <div>
                <label className="block text-purple-400 mb-2">Objet</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-purple-400 text-white outline-none py-2 focus:border-purple-500 focus:bg-purple-900/15 focus:border-purple-600 focus:shadow-[0_2px_0_0_#9333ea] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-purple-400 mb-2">Message</label>
              <textarea
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full bg-transparent border-b border-purple-400 text-white outline-none py-2 resize-none focus:border-purple-500 focus:bg-purple-900/15 focus:border-purple-600 focus:shadow-[0_2px_0_0_#9333ea] transition"
              />
            </div>

            {message && <p className="text-sm text-purple-300">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white px-10 py-2 rounded-lg transition"
            >
              {loading ? "Envoi..." : "Envoyer"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
