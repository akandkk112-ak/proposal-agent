export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto p-10 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
      <p className="mb-4 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h2>
          <p>By accessing and using Proposal Studio, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Provision of Services</h2>
          <p>You agree and acknowledge that Proposal Studio is entitled to modify, improve or discontinue any of its services at its sole discretion and without notice to you even if it may result in you being prevented from accessing any information contained in it.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Proprietary Rights</h2>
          <p>You acknowledge and agree that Proposal Studio may contain proprietary and confidential information including trademarks, service marks and patents protected by intellectual property laws and international intellectual property treaties. Proposal Studio authorizes you to view and make a single copy of portions of its content for offline, personal, non-commercial use.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">4. International Use</h2>
          <p>Recognizing the global nature of the Internet, you agree to comply with all local rules regarding online conduct and acceptable content. Specifically, you agree to comply with all applicable laws regarding the transmission of technical data exported from the United States or the country in which you reside.</p>
        </section>
      </div>
    </div>
  );
}
