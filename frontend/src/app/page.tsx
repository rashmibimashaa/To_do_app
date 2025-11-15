export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h1 className="text-6xl font-bold mb-6 bg-ggit add frontend/src/app/page.tsxradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to Todo App
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Organize your tasks efficiently and boost your productivity
        </p>
        
        <div className="flex gap-4 justify-center">
          <a 
            href="/login" 
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            Login
          </a>
          <a 
            href="/register" 
            className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            Register
          </a>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">✓</div>
            <h3 className="text-lg font-semibold mb-2">Create Tasks</h3>
            <p className="text-gray-600">Add and organize your todos easily</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">✎</div>
            <h3 className="text-lg font-semibold mb-2">Edit Anytime</h3>
            <p className="text-gray-600">Update your tasks on the go</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">✔</div>
            <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600">Mark tasks as complete</p>
          </div>
        </div>
      </div>
    </div>
  );
}