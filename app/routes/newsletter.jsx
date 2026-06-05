import { Menu } from "../components/menu"
import { Footer } from "../components/footer.jsx"
import { Subscribe } from "../components/subscribe.jsx"
import { NewsletterList } from "../components/newsletter-components.jsx"
import { useState, useMemo } from "react"

// Shared mock archive used for viewer and archive controls
const MOCK_ARCHIVE = [
    {
        month: "December 2025",
        newsletters: [
            {
                id: "2025-12-15",
                date: "Dec 15, 2025",
                featured: {
                    id: "f1",
                    title: "Feature Article: Toward Sustainable Design",
                    image: "/placeholder-image.jpg",
                    author: { name: "Alex Morgan", photo: "/avatar1.png" },
                },
                others: [
                    { id: "o1", title: "Article One" },
                    { id: "o2", title: "Article Two" },
                    { id: "o3", title: "Article Three" },
                    { id: "o4", title: "Article Four" },
                ],
            },
            {
                id: "2025-12-01",
                date: "Dec 1, 2025",
                featured: {
                    id: "f2",
                    title: "Opening the Fall Semester",
                    image: "/placeholder-image.jpg",
                    author: { name: "Jamie Lee", photo: "/avatar2.png" },
                },
                others: [
                    { id: "o1", title: "Welcome Back" },
                    { id: "o2", title: "Event Recap" },
                ],
            },
        ],
    },
    {
        month: "November 2025",
        newsletters: [
            {
                id: "2025-11-10",
                date: "Nov 10, 2025",
                featured: {
                    id: "f3",
                    title: "Campus Tech Update",
                    image: "/placeholder-image.jpg",
                    author: { name: "Taylor Kim", photo: "/avatar3.png" },
                },
                others: [{ id: "o1", title: "Research Highlights" }],
            },
        ],
    },
]

export function meta() {
    return [
        { title: "IAJES — Newsletter" },
        { name: "description", content: "Newsletter page" },
    ];
}

export function NewsletterViewer({ latestDate }) {
    return (
        <>
            <div className="flex flex-col items-center lg:px-40 px-10 py-20 duration-200">
                <div className="w-full space-y-5">
                    <h1>IAJES News</h1>
                    <div className="text-sm text-gray-dark">{latestDate || "—"}</div>
                    <div className="flex flex-row justify-center">
                        <div className="h-[90vh] w-full bg-gray-light rounded-md">
                            <p>Newsletter PDF Viewer</p>
                        </div>
                        <div className="w-auto flex flex-col justify-start items-start space-y-5 ml-5">
                            <button className="button w-full aspect-square" aria-label="Download newsletter">
                                <i className="bi bi-download" aria-hidden="true"></i>
                            </button>
                            <button className="button w-full aspect-square" aria-label="Copy newsletter link">
                                <i className="bi bi-link-45deg text-2xl" aria-hidden="true"></i>
                            </button>
                            <button className="button w-full aspect-square" aria-label="Share newsletter">
                                <i className="bi bi-share-fill" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export function NewsletterArchive({ onSelect = () => { } }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterMonth, setFilterMonth] = useState("All");
    const [page, setPage] = useState(1);
    const perPage = 4;

    // Flatten newsletters for easy searching/pagination
    const flattened = useMemo(() => MOCK_ARCHIVE.flatMap((g) => g.newsletters.map((n) => ({ ...n, month: g.month }))), []);
    const months = ["All", ...MOCK_ARCHIVE.map((g) => g.month)];

    const filtered = flattened.filter((n) => {
        const q = searchQuery.trim().toLowerCase();
        if (filterMonth !== "All" && n.month !== filterMonth) return false;
        if (!q) return true;
        const inTitle = (n.featured?.title || "").toLowerCase().includes(q);
        const inAuthor = (n.featured?.author?.name || "").toLowerCase().includes(q);
        const inOthers = (n.others || []).some((o) => (o.title || "").toLowerCase().includes(q));
        return inTitle || inAuthor || inOthers;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const current = filtered.slice((page - 1) * perPage, page * perPage);

    // Group by month for display
    const grouped = current.reduce((acc, n) => {
        acc[n.month] = acc[n.month] || [];
        acc[n.month].push(n);
        return acc;
    }, {});

    function onArticleSelect(newsletterId, articleId) {
        const target = `#viewer-${newsletterId}-article-${articleId}`;
        window.location.hash = target;
        console.log("Selected article in archive:", newsletterId, articleId, "-> set hash", target);
        onSelect(newsletterId, articleId);
    }

    return (
        <>
            <div className="flex flex-col items-center lg:px-40 px-10 py-20 duration-200">
                <div className="w-full space-y-5">
                    <h2>Newsletter Archive</h2>

                    <div className="flex items-center space-x-4">
                        <label htmlFor="newsletter-month-filter" className="sr-only">Filter newsletters by month</label>
                        <select id="newsletter-month-filter" value={filterMonth} onChange={(e) => { setFilterMonth(e.target.value); setPage(1); }} className="input input-text">
                            {months.map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>

                        <label htmlFor="newsletter-search" className="sr-only">Search newsletter archive</label>
                        <input
                            id="newsletter-search"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                            className="input input-text w-md"
                            placeholder="Search titles, authors, keywords..."
                        />

                        <div className="text-sm text-gray-500">Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''}</div>
                    </div>

                    <div className="space-y-4">
                        {Object.entries(grouped).length === 0 ? (
                            <div className="text-sm text-gray-600">No newsletters found.</div>
                        ) : (
                            Object.entries(grouped).map(([month, newsletters]) => (
                                <NewsletterList key={month} month={month} newsletters={newsletters} onArticleSelect={onArticleSelect} />
                            ))
                        )}
                    </div>

                    <div className="flex justify-center space-x-2">
                        <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="button" aria-label="Previous archive page"><i className="bi bi-arrow-left-short" aria-hidden="true"></i> Prev</button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button key={p} onClick={() => setPage(p)} className={`button ${p === page ? 'font-semibold' : 'button-light'}`} aria-current={p === page ? "page" : undefined} aria-label={`Archive page ${p}`}>{p}</button>
                        ))}
                        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="button" aria-label="Next archive page">Next <i className="bi bi-arrow-right-short" aria-hidden="true"></i></button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function Newsletter() {
    const [mode, setMode] = useState("member");

    const latestDate = useMemo(() => {
        const all = MOCK_ARCHIVE.flatMap((g) => g.newsletters);
        if (all.length === 0) return null;
        const sorted = all.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
        return sorted[0].date;
    }, []);

    return (
        <div className="bg-white items-center text-black">
            <Menu currentEndUrl="/newsletter"/>
            <div className="lg:px-40 px-10 py-20 duration-200 flex items-center justify-end space-x-2 hidden">
                <div className="text-sm text-gray-600">Debug mode:</div>
                <button className={`button ${mode === 'member' ? 'button' : 'button-light'}`} onClick={() => setMode('member')}>Member</button>
                <button className={`button ${mode === 'manager' ? 'button' : 'button-light'}`} onClick={() => setMode('manager')}>Task Force Admin / Website Manager</button>
                <button className={`button ${mode === 'admin' ? 'button' : 'button-light'}`} onClick={() => setMode('admin')}>Admin</button>
            </div>

            <main id="main-content">
                <NewsletterViewer latestDate={latestDate} />
                <Subscribe />
                <NewsletterArchive />
            </main>
            <Footer />
        </div>
    );
}
