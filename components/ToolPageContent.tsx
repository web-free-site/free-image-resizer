import type { Locale } from "@/lib/i18n";
import { homeSeo, pageSeo } from "@/lib/tools";
import { ImageWorkbench } from "./ImageWorkbench";
import { AdSlot, SponsoredLink } from "./AdSlot";
import type { ToolPage } from "@/lib/tools";

export function ToolPageContent({
  locale,
  tool,
}: {
  locale: Locale;
  tool?: ToolPage;
}) {
  const seo = tool ? pageSeo(locale, tool.slug) : homeSeo(locale);
  const toolId = tool?.id ?? "home";
  return (
    <article className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_180px]">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{seo.h1}</h1>
          <p className="mt-3 text-lg text-slate-600">{seo.description}</p>
          <div className="mt-8">
            <ImageWorkbench
              locale={locale}
              toolId={toolId}
              defaultOptions={tool?.defaultOptions ?? { format: "jpeg" }}
              batch={tool?.batch}
            />
          </div>
          <AdSlot slot="banner468x60" className="my-6" />
          <AdSlot slot="banner300x250" className="my-8" />
          <SponsoredLink />
          <section className="prose prose-slate max-w-none">
            {seo.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-slate-900">FAQ</h2>
            <ul className="mt-4 space-y-4">
              {seo.faq.map((item) => (
                <li key={item.q}>
                  <h3 className="font-medium text-slate-800">{item.q}</h3>
                  <p className="text-slate-600">{item.a}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <aside className="hidden flex-col gap-6 lg:flex">
          <AdSlot slot="banner160x600" />
          <AdSlot slot="banner160x300" />
        </aside>
      </div>
    </article>
  );
}
