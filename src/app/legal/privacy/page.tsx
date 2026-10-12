export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto p-10 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Information Collection</h2>
          <p>We collect information when you register on our site, place an order, subscribe to our newsletter, respond to a survey, or fill out a form. When ordering or registering on our site, as appropriate, you may be asked to enter your name, email address, mailing address, or phone number.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Use of Information</h2>
          <p>Any of the information we collect from you may be used in one of the following ways: to personalize your experience, to improve our website, to improve customer service, to process transactions, or to send periodic emails.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Protection of Information</h2>
          <p>We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.</p>
        </section>
      </div>
    </div>
  );
}
