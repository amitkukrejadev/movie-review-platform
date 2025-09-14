import React from "react";

export default function Careers() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold">Careers</h1>
        <p className="text-slate-600 mt-2">
          Open roles (demo site) & how to apply.
        </p>
      </header>

      <section className="space-y-6">
        <p>
          This demo doesn't currently run hiring campaigns, but we appreciate
          interest. If you'd like to work with us on this project or build
          extensions, email us at{" "}
          <a href="mailto:thenameisamitkukreja@gmail.com">
            thenameisamitkukreja@gmail.com
          </a>{" "}
          with a short note and links to your work.
        </p>

        <div className="bg-slate-50 p-4 rounded border">
          <h3 className="font-semibold">How to apply</h3>
          <ol className="list-decimal pl-6 mt-2">
            <li>Send a short introduction and GitHub link.</li>
            <li>Describe a small improvement you'd make to this app.</li>
            <li>Attach resume or portfolio if available.</li>
          </ol>
        </div>
      </section>
    </div>
  );
}
