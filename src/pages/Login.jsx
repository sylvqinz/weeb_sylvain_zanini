export default function Login() {
  return (
    <section className=" flex items-center justify-center px-4">
      <div className=" w-full max-w-3xl text-center">
        {/* Title */}
        <h1 className=" md:text-4xl font-bold text-white mb-12">Se connecter</h1>

        {/* Form */}
        <form className="space-y-10">
          {/* Email */}
          <div>
            <label className="block text-purple-400 mb-2">Email</label>
            <input
              type="email"
              className="w-full bg-transparent border-b border-purple-500 text-white outline-none py-2 focus:border-purple-600"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-purple-400 mb-2">Password</label>
            <input
              type="password"
              className="w-full bg-transparent border-b border-purple-500 text-white outline-none py-2 focus:border-purple-600"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className=" mt-4 bg-purple-600 hover:bg-purple-700 text-white px-10 py-2 rounded-lg transition"
          >
            Se connecter
          </button>
        </form>

        {/* Links */}
        <div className="mt-8 space-y-4 text-sm">
          <p className="text-white cursor-pointer hover:underline">Mot de passe oublié ?</p>

          <p className="text-gray-400">
            Vous n’avez pas de compte ?{" "}
            <span className="text-purple-500 cursor-pointer hover:underline">Vous pouvez en créer un</span>
          </p>
        </div>
      </div>
    </section>
  );
}
