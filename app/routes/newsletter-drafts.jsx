import { useState } from "react";
import { Menu } from "../components/menu.jsx";
import { Footer } from "../components/footer.jsx"
import { NewsletterList, Profile } from "../components/newsletter-components.jsx";
import { NavLink } from "react-router";

export function meta() {
    return [{ title: "IAJES — Newsletter Drafts" }];
}

export default function NewsletterDrafts() {
    // sample draft data - will be replaced when DB is available
    const [drafts, setDrafts] = useState([
        {
            id: "draft-1",
            title: "December Newsletter",
            deadline: "Dec 20, 2025",
            articles: [
                { id: "d-a1", title: "Drafted Feature", author: { name: "Alice" }, image: "/placeholder-image.jpg", lastEdited: "Dec 19, 2025" },
                { id: "d-a2", title: "Draft Other 1", lastEdited: "Dec 18, 2025" },
                { id: "d-a3", title: "Draft Other 2", lastEdited: "Dec 17, 2025" },
            ],
        },
        {
            id: "draft-2",
            title: "November Newsletter",
            deadline: "Nov 25, 2025",
            articles: [
                { id: "d2-a1", title: "Another Draft Feature", author: { name: "Bob" }, image: "/placeholder-image.jpg", lastEdited: "Nov 24, 2025" },
                { id: "d2-a2", title: "Short piece", lastEdited: "Nov 23, 2025" },
            ],
        },
    ]);

    const [mode, setMode] = useState("member"); // member | manager | admin
    const [page, setPage] = useState(1);
    const perPage = 3;

    function deleteNewsletter(id) {
        if (!window.confirm("Delete draft newsletter?")) return;
        setDrafts((s) => s.filter((d) => d.id !== id));
    }

    function addNewsletter() {
        const id = `draft-${Date.now()}`;
        setDrafts((s) => [...s, { id, title: "Untitled", deadline: "", articles: [] }]);
    }

    function addArticle(draftId) {
        const id = `a-${Date.now()}`;
        setDrafts((s) => s.map((d) => d.id === draftId ? { ...d, articles: [...d.articles, { id, title: "New Article", lastEdited: new Date().toLocaleDateString() }] } : d));
    }

    function deleteArticle(draftId, articleId) {
        if (!window.confirm("Delete article draft?")) return;
        setDrafts((s) => s.map((d) => d.id === draftId ? { ...d, articles: d.articles.filter((a) => a.id !== articleId) } : d));
    }

    function moveArticle(draftId, index, direction) {
        setDrafts((s) => s.map((d) => {
            if (d.id !== draftId) return d;
            const arr = [...d.articles];
            const to = index + direction;
            if (to < 0 || to >= arr.length) return d;
            const tmp = arr[index];
            arr[index] = arr[to];
            arr[to] = tmp;
            return { ...d, articles: arr };
        }));
    }

    function updateDraftField(draftId, field, value) {
        setDrafts((s) => s.map((d) => d.id === draftId ? { ...d, [field]: value } : d));
    }

    function publishDraft(draftId) {
        if (mode !== 'admin') {
            alert('You do not have permission to publish.');
            return;
        }
        // placeholder for publish logic
        alert('Published ' + draftId);
    }

    const paged = drafts.slice((page - 1) * perPage, page * perPage);
    const totalPages = Math.max(1, Math.ceil(drafts.length / perPage));

    return (
        <div className="bg-white items-center text-black">
            <Menu />
            <div className="py-4 container mx-auto flex items-center justify-end space-x-2 hidden">
                <div className="text-sm text-gray-600">Debug mode:</div>
                <button className={`button ${mode === 'member' ? 'button' : 'button-light'}`} onClick={() => setMode('member')}>Member</button>
                <button className={`button ${mode === 'manager' ? 'button' : 'button-light'}`} onClick={() => setMode('manager')}>Task Force Admin / Website Manager</button>
                <button className={`button ${mode === 'admin' ? 'button' : 'button-light'}`} onClick={() => setMode('admin')}>Admin</button>
            </div>

            <main className="py-20 container mx-auto min-h-[60vh]">
                <h2 className="text-2xl font-semibold mb-4">Newsletter Drafts {/*mode === 'admin' ? 'Admin' : mode === 'manager' ? 'Manager' : 'Member'*/}</h2>

                <div className="space-y-6">
                    {paged.map((d) => (
                        <section key={d.id} className="p-4 border-2 border-gray-light rounded-md">
                            <div className="flex justify-between items-center mb-3">
                                <div>
                                    <div className="text-sm text-gray-500">
                                        <input className="input input-text mr-3" value={d.title} onChange={(e) => updateDraftField(d.id, 'title', e.target.value)} placeholder="Title" />
                                        <input className="input input-text" value={d.deadline} onChange={(e) => updateDraftField(d.id, 'deadline', e.target.value)} placeholder="Deadline (MM/DD/YY)" />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => deleteNewsletter(d.id)} className="text-red-600 cursor-pointer">Delete Draft</button>
                                    <button onClick={() => addArticle(d.id)} className="button">Add Article</button>
                                    <button onClick={() => publishDraft(d.id)} disabled={mode !== 'admin'} className={`${mode !== 'admin' ? 'button button-light button-disabled' : 'button'}`}>Publish Newsletter</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {/* <h4 className="mb-2">Articles</h4> */}
                                <div className="flex flex-col gap-2">
                                    {d.articles.map((a, idx) => (
                                        <div key={a.id} className="flex items-center justify-between p-2 border-2 border-gray-light rounded-md shadow-sm">
                                            <div>
                                                <div className="font-semibold">{a.title} {idx === 0 && (<span className="text-xs text-gray-500">· Featured</span>)}</div>
                                                <div className="text-xs text-gray-500">Last edited: {a.lastEdited || '—'}</div>
                                            </div>

                                            <div className="flex gap-3">
                                                <button><NavLink to={`/newsletter/drafts/${d.id}/edit/${a.id}`} className="text-primary-dark">Edit</NavLink></button>
                                                <button onClick={() => deleteArticle(d.id, a.id)} className="text-red-600 cursor-pointer">Delete</button>
                                                <div className="flex flex-col">
                                                    <button onClick={() => moveArticle(d.id, idx, -1)} className="text-gray-dark cursor-pointer" title="Move up">▲</button>
                                                    <button onClick={() => moveArticle(d.id, idx, 1)} className="text-gray-dark cursor-pointer" title="Move down">▼</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    ))}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-5">
                    <button onClick={addNewsletter} className="button button-light w-full">Create Newsletter <i className="bi bi-plus-lg"></i></button>
                    <button className="button button-light w-full flex justify-center gap-2">Start from Upload <i className="bi bi-upload"></i></button>
                </div>
                <div className="mt-5 flex justify-center space-x-2">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="button"><i className="bi bi-arrow-left-short"></i> Prev</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button key={p} onClick={() => setPage(p)} className={`button ${p === page ? 'font-semibold' : 'button-light'}`}>{p}</button>
                    ))}
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="button">Next <i className="bi bi-arrow-right-short"></i></button>
                </div>
            </main>

            <Footer />
        </div>
    );
}
