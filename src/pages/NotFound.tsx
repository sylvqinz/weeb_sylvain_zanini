import Button from "../components/Button";

function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <h1 className="text-9xl font-extrabold mb-6 select-none">404</h1>
      <p className="text-2xl mb-8">Page non trouvée</p>
      <Button
        to="/"
        className="px-6 py-3 font-semibold"
      >
        Retour à l&apos;accueil
      </Button>
    </section>
  );
}

export default NotFound;
