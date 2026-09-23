export const metadata = {
  title: "Terms of Service — Jonathan Clark",
};

export default function TermsPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-20 text-sm leading-relaxed">
      <h1 className="text-2xl font-semibold mb-8">Terms of Service</h1>
      <p className="text-muted-foreground mb-4">Last updated: September 2026</p>

      <p className="mb-6">
        This application is a personal productivity tool operated by Jonathan
        Clark for his own use. It is not available to the general public.
      </p>

      <h2 className="font-semibold mt-8 mb-3">Eligibility</h2>
      <p className="mb-6">
        Access to this application is restricted to its owner. Unauthorized use
        is not permitted.
      </p>

      <h2 className="font-semibold mt-8 mb-3">No Warranties</h2>
      <p className="mb-6">
        This application is provided as-is for personal use. No warranties,
        express or implied, are made regarding its availability or fitness for
        any particular purpose.
      </p>

      <h2 className="font-semibold mt-8 mb-3">Contact</h2>
      <p>
        Questions:{" "}
        <a
          href="mailto:jonathanclark11@gmail.com"
          className="underline underline-offset-2"
        >
          jonathanclark11@gmail.com
        </a>
      </p>
    </main>
  );
}
