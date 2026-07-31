import { NotionTopBar } from "./topbar";

/* Shared shell for the legal pages (/imprint, /privacy): the familiar
   top bar plus a narrow, readable text column in the site's typography. */
export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <NotionTopBar />
      <main className="mx-auto max-w-[720px] px-6 pt-10 pb-24 sm:px-8">
        <h1 className="text-[1.75rem] leading-[1.25] font-semibold tracking-[-0.01em]">
          {title}
        </h1>
        <div className="mt-6 flex flex-col gap-6 text-[15px] leading-[1.65]">
          {children}
        </div>
      </main>
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0">
      <h2 className="text-[1.15rem] leading-[1.3] font-semibold tracking-[-0.01em]">
        {title}
      </h2>
      <div className="mt-2 flex flex-col gap-2.5 text-notion-text">
        {children}
      </div>
    </section>
  );
}
