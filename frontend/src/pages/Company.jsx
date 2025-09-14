import React from "react";
import { Link } from "react-router-dom";

export default function Company() {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold">Company</h1>
        <p className="text-slate-600 mt-2">
          Learn more about the team and opportunities.
        </p>
      </header>

      <section className="space-y-6 text-slate-700">
        <div>
          <h2 className="text-xl font-semibold">Overview</h2>
          <p>
            We’re a small team building delightful movie product experiences.
            This project is a demo for a full-stack assignment — it demonstrates
            how to integrate a React frontend with a Node/Express backend and
            MongoDB.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Values</h2>
          <ul className="list-disc pl-6">
            <li>Quality UX and accessibility</li>
            <li>Simplicity and extensibility</li>
            <li>Well-documented APIs and tests</li>
          </ul>
        </div>

        <div>
          <p>
            View <Link to="/careers">Careers</Link> or reach us at{" "}
            <a href="mailto:thenameisamitkukreja@gmail.com">
              thenameisamitkukreja@gmail.com
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
