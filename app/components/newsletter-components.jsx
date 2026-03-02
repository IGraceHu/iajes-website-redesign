import { useState } from "react";
import { NavLink } from "react-router";

export function Profile({ author }) {
    return (
        <div className="flex items-center space-x-2">
            <img
                src={author?.photo || "/placeholder-avatar.png"}
                alt={author?.name || "Author"}
                className="w-8 h-8 rounded-full object-cover bg-gray-light"
            />
            <span className="text-sm font-medium">{author?.name || "Unknown"}</span>
        </div>
    );
}

export function ArticleCard({ article, newsletterId, onSelect, editable = false, onEdit, onDownload, onDelete }) {
    return (
        <div className="border-2 border-gray-light rounded-md overflow-hidden bg-white shadow-sm">
            <NavLink
                to={editable ? `/newsletter/drafts/${newsletterId}/edit/${article.id}` : undefined}
                className={({ isActive }) => `w-full text-left block ${isActive ? "opacity-90" : ""}`}
                onClick={(e) => {
                    if (!editable) {
                        e.preventDefault();
                        onSelect && onSelect(newsletterId, article.id);
                    }
                }}
            >
                <img src={article?.image || "/placeholder-image.jpg"} alt={article?.title} className="w-full h-44 object-cover bg-gray-light" />
                <div className="p-3 flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        <img src={article?.author?.photo || "/placeholder-avatar.png"} alt={article?.author?.name || "Author"} className="w-10 h-10 rounded-full object-cover bg-gray-light" />
                        <div>
                            <div className="text-sm font-semibold flex items-center space-x-2">
                                <span>{article?.title}</span>
                            </div>
                            <div className="text-xs text-gray-500">by {article?.author?.name || "Unknown"}</div>
                        </div>
                    </div>
                    {editable ? (
                        <div className="flex space-x-2">
                            <button onClick={(e) => { e.preventDefault(); onEdit && onEdit(article); }} className="p-2 text-gray-600 hover:text-gray-dark" title="Edit">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /></svg>
                            </button>
                            <button onClick={(e) => { e.preventDefault(); onDownload && onDownload(article); }} className="p-2 text-gray-600 hover:text-gray-dark" title="Download">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3 14a1 1 0 011-1h12a1 1 0 011 1v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2z" /><path d="M7 10l3 3 3-3M10 2v11" /></svg>
                            </button>
                            <button onClick={(e) => { e.preventDefault(); onDelete && onDelete(article); }} className="p-2 text-red-600 hover:text-red-800" title="Delete">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H3a1 1 0 100 2h14a1 1 0 100-2h-2V3a1 1 0 00-1-1H6zM7 8a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V9a1 1 0 00-1-1H7z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                    ) : null}
                </div>
            </NavLink>
        </div>
    );
}

export function OtherArticlesList({ articles = [], onSelect }) {
    const [expanded, setExpanded] = useState(false);
    if (!articles || articles.length === 0) return null;

    // Show first 2 articles by default; when expanded, show all and provide a "show less" control
    const visible = expanded ? articles : articles.slice(0, 2);
    const remaining = Math.max(0, articles.length - 2);

    return (
        <div className="mt-2 text-sm text-gray-700">
            <div className="flex flex-col gap-2">
                {visible.map((a) => (
                    <button key={a.id} onClick={() => onSelect && onSelect(a)} className="text-left">
                        <p><a>{a.title}</a></p>
                    </button>
                ))}
            </div>
            {remaining > 0 && !expanded && (
                <div className="mt-2">
                    <button className="text-sm text-gray-500" onClick={() => setExpanded(true)}>
                        <a>and {remaining} more</a>
                    </button>
                </div>
            )}
            {expanded && articles.length > 2 && (
                <div className="mt-2">
                    <button className="text-sm text-gray-500" onClick={() => setExpanded(false)}>
                        <a>show less</a>
                    </button>
                </div>
            )}
        </div>
    );
}

export function NewsletterCard({ newsletter, onArticleSelect, editable = false }) {
    return (
        <article id={`newsletter-${newsletter?.id}`} className="border-2 border-gray-light rounded-md p-5">
            <header className="mb-3 flex items-center justify-between">
                <div>
                    <div className="text-sm text-gray-500">{newsletter?.date}</div>
                </div>
                {editable && (
                    <div className="flex items-center space-x-2">
                        <button onClick={() => window.confirm("Delete newsletter draft?") && console.log("delete newsletter", newsletter?.id)} className="text-red-600">Delete Draft</button>
                    </div>
                )}
            </header>
            <div className="space-y-3">
                <ArticleCard
                    article={newsletter?.featured}
                    newsletterId={newsletter?.id}
                    onSelect={(nId, aId) => onArticleSelect && onArticleSelect(nId, aId)}
                    editable={editable}
                    onEdit={(a) => console.log("edit article", a)}
                    onDownload={(a) => console.log("download article", a)}
                    onDelete={(a) => console.log("delete article", a)}
                />
                <OtherArticlesList articles={newsletter?.others} onSelect={(a) => onArticleSelect && onArticleSelect(newsletter?.id, a.id)} />
            </div>
        </article>
    );
}

export function NewsletterList({ month, newsletters = [], onArticleSelect, editable = false }) {
    if (!newsletters || newsletters.length === 0) return null;
    return (
        <section className="space-y-4">
            <h4 className="font-semibold">{month}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {newsletters.map((n) => (
                    <NewsletterCard key={n.id} newsletter={n} onArticleSelect={onArticleSelect} editable={editable} />
                ))}
            </div>
        </section>
    );
}