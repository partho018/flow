import React from 'react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] py-20 px-6 sm:px-12 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">Terms of Service</h1>
        <p className="text-[#a1a1aa] text-sm">Last updated: April 30, 2026</p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">1. Agreement to Terms</h2>
          <p className="text-[#d4d4d8] leading-relaxed">
            By accessing or using FlowStudio, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">2. Description of Service</h2>
          <p className="text-[#d4d4d8] leading-relaxed">
            FlowStudio provides automation tools for Instagram Direct Messages and comments. We utilize the official Meta (Facebook/Instagram) Graph API to deliver these services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">3. Meta/Facebook Platform Rules</h2>
          <p className="text-[#d4d4d8] leading-relaxed">
            As a user of FlowStudio, you must also comply with the Facebook Terms of Service and Instagram Terms of Use. You agree not to use our automation tools to send spam, harass users, or violate any of Meta's community standards.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">4. Account Responsibilities</h2>
          <p className="text-[#d4d4d8] leading-relaxed">
            You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You must maintain the security of your connected Instagram accounts.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">5. Termination</h2>
          <p className="text-[#d4d4d8] leading-relaxed">
            We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms or violate Meta's Platform policies.
          </p>
        </section>
      </div>
    </div>
  );
}
