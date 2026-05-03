import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] py-20 px-6 sm:px-12 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">Privacy Policy</h1>
        <p className="text-[#a1a1aa] text-sm">Last updated: April 30, 2026</p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">1. Introduction</h2>
          <p className="text-[#d4d4d8] leading-relaxed">
            Welcome to FlowStudio. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">2. Data We Collect (Facebook & Instagram)</h2>
          <p className="text-[#d4d4d8] leading-relaxed">
            When you connect your Instagram or Facebook account using Facebook Login for Business, we request access to certain information required to provide our automation services:
          </p>
          <ul className="list-disc pl-5 text-[#d4d4d8] space-y-2">
            <li><strong>Profile Information:</strong> Such as your name, username, and profile picture.</li>
            <li><strong>Messaging Data:</strong> We require the <code>instagram_manage_messages</code> permission to automate replies and read incoming Direct Messages on your behalf.</li>
            <li><strong>Comments Data:</strong> We require the <code>instagram_manage_comments</code> permission to automate replies to comments on your posts.</li>
            <li><strong>Page Data:</strong> We require the <code>pages_show_list</code> permission to identify which Facebook pages are linked to your Instagram business account.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">3. How We Use Your Data</h2>
          <p className="text-[#d4d4d8] leading-relaxed">
            The data we collect from Meta APIs is strictly used to provide the DM and comment automation services you explicitly configure within FlowStudio. We do not sell your data, nor do we use it for targeted advertising.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">4. Data Deletion Instructions</h2>
          <p className="text-[#d4d4d8] leading-relaxed">
            According to Facebook Platform rules, we provide Data Deletion Instructions. If you want to delete your activities for FlowStudio, you can remove your information by following these steps:
          </p>
          <ol className="list-decimal pl-5 text-[#d4d4d8] space-y-2">
            <li>Go to your Facebook Account's "Settings & Privacy".</li>
            <li>Click on "Settings" and then "Apps and Websites".</li>
            <li>Find "FlowStudio" in the list of active apps and click "Remove".</li>
            <li>Upon removal, our system will automatically receive a webhook to delete all your associated Instagram automation data from our servers.</li>
          </ol>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">5. Contact Us</h2>
          <p className="text-[#d4d4d8] leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at support@flowstudio.com.
          </p>
        </section>
      </div>
    </div>
  );
}
