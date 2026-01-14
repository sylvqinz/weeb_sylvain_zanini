import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <h1 className="text-9xl font-extrabold mb-6 select-none">404</h1>
      <p className="text-2xl mb-8">Page non trouvée</p>
      <Link
        to="/"
        className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
      >
        Retour à l&apos;accueil
      </Link>
    </section>
  );
}

export default NotFound;
