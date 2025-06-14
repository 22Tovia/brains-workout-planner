import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-500 via-orange-500 to-green-500">
      <form className="text-center bg-purple-300 p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-4xl mb-8 font-extrabold text-blue-950">
          Welcome
        </h1>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 text-lg">
            Email:
          </label>
          <input
            id="email"
            placeholder='enter your email'
            name="email"
            type="email"
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-1 text-lg">
            Password:
          </label>
          <input
            id="password"
            placeholder='enter your password'
            name="password"
            type="password"
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
        </div>

        <div className="flex justify-center space-x-4">
          <button
            formAction={login}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Log in
          </button>
          <button
            formAction={signup}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  )
}
