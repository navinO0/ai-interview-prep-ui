"use client";
export default function LandingPage() {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white font-sans min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 flex flex-row md:flex-row justify-center items-center">
        <section className="min-h-screen flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            QR Auth
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mb-8 text-gray-300">
            A passwordless authentication system that leverages the power of QR codes and real-time verification to deliver seamless, secure logins — with just one scan.
          </p>
          <a
            href="#features"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-lg transition"
          >
            Explore Features
          </a>
        </section>
        <div className="hidden lg:flex">
          <div className="flex justify-center items-center h-[90vh] w-[100%] ">
            <img
              src={"https://res.cloudinary.com/dzapdxkgc/image/upload/v1743199597/Lovepik_com-380422385-smart-payment-method-illustration-qr-code-scan-code-payment-simple-retail_wzyehm.png"}
              alt="Home Image"
              className="w-100 h-100 object-cover " />
          </div>
        </div>
      </div>
      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-800 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12 text-white">Why Choose QR Auth?</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-slate-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-2xl font-semibold mb-3 text-blue-400">🔐 QR Code Login</h3>
              <p className="text-gray-300">
                Say goodbye to forgotten passwords! Just scan a QR code with your mobile device to authenticate quickly and securely. Perfect for both web and mobile apps.
              </p>
            </div>
            <div className="bg-slate-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-2xl font-semibold mb-3 text-green-400">⚡ Real-time WebSocket Verification</h3>
              <p className="text-gray-300">
                Experience blazing-fast authentication with real-time socket communication between your devices. As soon as you scan the QR, your session is instantly validated.
              </p>
            </div>
            <div className="bg-slate-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-2xl font-semibold mb-3 text-yellow-400">📱 Multi-Device Compatibility</h3>
              <p className="text-gray-300">
                Works seamlessly across desktops, smartphones, tablets, and smart devices — offering universal login without compromising security or user experience.
              </p>
            </div>
            <div className="bg-slate-700 rounded-xl p-6 shadow-lg md:col-span-1">
              <h3 className="text-2xl font-semibold mb-3 text-purple-400">🧠 Session Management</h3>
              <p className="text-gray-300">
                Each QR code is linked to a unique session ID stored temporarily in Redis. It ensures each login attempt is traceable, secure, and valid only once.
              </p>
            </div>
            <div className="bg-slate-700 rounded-xl p-6 shadow-lg md:col-span-2">
              <h3 className="text-2xl font-semibold mb-3 text-pink-400">🌐 Secure API Integration</h3>
              <p className="text-gray-300">
                Easily connect your existing app or platform with our secure backend APIs powered by Fastify, PostgreSQL, and token-based validation. Future-proof your auth flow!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 bg-gradient-to-tr from-slate-900 to-slate-800 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12 text-white">Built With Modern Web Tech</h2>
          <p className="text-gray-400 max-w-3xl mx-auto mb-8">
            QR Auth is engineered with a robust, scalable tech stack tailored for real-time performance and production-grade reliability.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-lg font-medium text-gray-300">
            {[
              'Next.js - Frontend Framework',
              'Tailwind CSS - Styling',
              'Fastify - API Backend',
              'Socket.io - Real-time Messaging',
              'Redis - Session Store',
              'PostgreSQL - Relational DB',
              'NextAuth.js - Auth Management',
              'QRCode - Dynamic QR Generator',
            ].map((tech) => (
              <span
                key={tech}
                className="bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600 transition"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-6 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} QR Auth. Crafted with ❤️ using modern web technologies.
      </footer>
    </div>
  );
}
