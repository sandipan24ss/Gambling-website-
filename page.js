import { getArticles, formatDate } from "@/lib/firebase";

export const dynamic = "force-dynamic";

function ArticleCard({ article }) {
  return (
    <article className="article-card">
      <a className="article-link" href={`/?article=${encodeURIComponent(article.slug)}`}>
        {article.image ? <img className="card-image" src={article.image} alt={article.title} loading="lazy" /> : <div className="card-placeholder" />}
        <div className="card-body">
          <span className="category">{article.category}</span>
          <h3>{article.title}</h3>
          <p>{article.description || article.content.slice(0, 145)}</p>
          <div className="meta"><span>{article.author}</span><span>·</span><time>{formatDate(article.publishedAt)}</time></div>
        </div>
      </a>
    </article>
  );
}

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  if (!params?.article) return { title: "Newstrain — Latest Articles", description: "Latest stories and updates." };
  const articles = await getArticles();
  const article = articles.find(a => a.slug === params.article || a.id === params.article);
  return article ? {
    title: article.title,
    description: article.description || article.title,
    openGraph: { title: article.title, description: article.description || article.title, type: "article", ...(article.image ? { images: [article.image] } : {}) }
  } : { title: "Article not found" };
}

export default async function Page({ searchParams }) {
  const [articles, params] = await Promise.all([getArticles(), searchParams]);
  const selectedSlug = params?.article;
  const category = params?.category;

  if (selectedSlug) {
    const article = articles.find(a => a.slug === selectedSlug || a.id === selectedSlug);
    if (!article) return <main className="container"><section className="article-shell"><div className="empty"><h1>Article not found</h1><p>This article may have been removed or is not published.</p><a className="back-link" href="/">← Back to homepage</a></div></section></main>;
    return <main className="container"><article className="article-shell"><a className="back-link" href="/">← Back to all articles</a><div className="article-top" style={{marginTop:22}}>{article.category} · {article.author} · {formatDate(article.publishedAt)}</div><h1>{article.title}</h1>{article.description && <p className="article-description">{article.description}</p>}{article.image && <img className="article-cover" src={article.image} alt={article.title} />}{article.content.split(/\r?\n\s*\r?\n/).map((paragraph, index) => <p className="article-content" key={index}>{paragraph}</p>)}</article></main>;
  }

  const visible = category ? articles.filter(a => a.category.toLowerCase() === String(category).toLowerCase()) : articles;
  return <main className="container"><section className="hero"><div className="eyebrow">Independent stories · Fresh perspectives</div><h1>Know what matters.<br/>Understand what’s next.</h1><p>Explore the latest stories across technology, science, business and more — published straight from our Firebase database.</p></section><div className="section-head"><h2>{category || "Latest articles"}</h2><p>{visible.length} {visible.length === 1 ? "story" : "stories"}</p></div>{visible.length ? <section className="article-grid">{visible.map(article => <ArticleCard key={article.id} article={article} />)}</section> : <div className="empty">No articles found in Firebase /articles.</div>}</main>;
}
