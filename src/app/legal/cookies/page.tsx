export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto p-10 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
      <p className="mb-4 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">1. What Are Cookies</h2>
          <p>As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it, and why we sometimes need to store these cookies.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">2. How We Use Cookies</h2>
          <p>We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">3. The Cookies We Set</h2>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Account related cookies:</strong> If you create an account with us, we will use cookies for the management of the signup process and general administration.</li>
            <li><strong>Login related cookies:</strong> We use cookies when you are logged in so that we can remember this fact, preventing you from having to log in every time you visit a new page.</li>
            <li><strong>Site preferences cookies:</strong> To provide you with a great experience on this site, we provide the functionality to set your preferences for how this site runs when you use it.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
