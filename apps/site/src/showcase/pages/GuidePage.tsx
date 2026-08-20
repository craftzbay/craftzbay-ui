import type { GuideDoc } from '../registry/types';

interface GuidePageProps {
  doc: GuideDoc;
}

export function GuidePage({ doc }: GuidePageProps) {
  return (
    <article className="max-w-3xl">
      <header className="mb-10 border-b border-border pb-6">
        <p className="text-xs font-medium uppercase tracking-wider text-accent">Guide</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{doc.title}</h1>
        <p className="mt-3 text-base leading-relaxed text-foreground-muted">{doc.description}</p>
      </header>

      <div className="[&_.prose-block_h2]:mb-3 [&_.prose-block_h2]:mt-10 [&_.prose-block_h2]:text-xl [&_.prose-block_h2]:font-semibold [&_.prose-block_h2]:tracking-tight [&_.prose-block_h3]:mb-2 [&_.prose-block_h3]:mt-8 [&_.prose-block_h3]:text-base [&_.prose-block_h3]:font-semibold [&_.prose-block_p]:mb-3 [&_.prose-block_p]:text-sm [&_.prose-block_p]:leading-relaxed [&_.prose-block_p]:text-foreground-muted [&_.prose-block_ul]:mb-3 [&_.prose-block_ul]:list-disc [&_.prose-block_ul]:pl-6 [&_.prose-block_li]:mt-1 [&_.prose-block_li]:text-sm [&_.prose-block_li]:text-foreground-muted [&_.prose-block_li]:leading-relaxed [&_.prose-block_code]:rounded [&_.prose-block_code]:bg-background-muted [&_.prose-block_code]:px-1 [&_.prose-block_code]:py-0.5 [&_.prose-block_code]:font-mono [&_.prose-block_code]:text-xs [&_.prose-block_code]:text-foreground">
        {doc.body}
      </div>
    </article>
  );
}
