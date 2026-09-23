export const metadata = {
  title: "Privacy Policy — Jonathan Clark",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-20 text-sm leading-relaxed">
      <h1 className="text-2xl font-semibold mb-8">Privacy Policy</h1>
      <p className="text-muted-foreground mb-4">Last updated: September 2026</p>

      <p className="mb-6">
        This application is a personal productivity tool used solely by Jonathan
        Clark. It is not a public service.
      </p>

      <h2 className="font-semibold mt-8 mb-3">Data Collection</h2>
      <p className="mb-6">
        No personal data is collected, stored, or shared with third parties.
        Access to Google services (Gmail, Google Calendar) is used exclusively
        to perform tasks on behalf of the application owner and is never
        transmitted to any external system beyond the Google APIs themselves.
      </p>

      <h2 className="font-semibold mt-8 mb-3">Third-Party Services</h2>
      <p className="mb-6">
        This application connects to Google APIs under the owner&apos;s own
        account. No data is sold, rented, or shared with advertisers or other
        third parties.
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
