import { type FormEvent, useState } from "react";
import Button from "../components/Button";
import TextField from "../components/TextField";
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
              <TextField label="Nom" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />

              <TextField label="Prénom" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <TextField label="Objet" type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
            </div>

            <TextField
              label="Message"
              multiline
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              fieldClassName="resize-none"
            />

            {message && <p className="text-sm text-purple-300">{message}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="mt-4 px-10"
            >
              {loading ? "Envoi..." : "Envoyer"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
