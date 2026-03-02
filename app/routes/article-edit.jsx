import { useState } from "react";
import { useParams } from "react-router";
import { Menu } from "../components/menu.jsx";
import { Profile } from "../components/newsletter-components.jsx";

export function meta() {
    return [{ title: "IAJES — Edit Article" }];
}

export default function ArticleEdit() {
    const params = useParams();
    const { newsletterId, articleId } = params;

    // mock saved article state (would be fetched)
    const [title, setTitle] = useState("Sample Article Title");
    const [authors, setAuthors] = useState([{ id: "a1", name: "Alex Morgan", photo: "/avatar1.png" }]);
    const [media, setMedia] = useState([{ id: "m1", name: "photo1.jpg", url: "/placeholder-image.jpg" }]);
    const [blocks, setBlocks] = useState([
        { id: "b1", content: "Paragraph one." },
        { id: "b2", content: "Paragraph two." },
    ]);

    function addAuthor(name) {
        const id = `a${Math.random().toString(36).slice(2, 7)}`;
        setAuthors((s) => [...s, { id, name }]);
    }

    function removeAuthor(id) {
        setAuthors((s) => s.filter((a) => a.id !== id));
    }

    function addBlock() {
        const id = `b${Math.random().toString(36).slice(2, 7)}`;
        setBlocks((s) => [...s, { id, content: "" }]);
    }

    function removeBlock(id) {
        setBlocks((s) => s.filter((b) => b.id !== id));
    }

    function moveBlock(idx, dir) {
        setBlocks((s) => {
            const copy = [...s];
            const swap = idx + dir;
            if (swap < 0 || swap >= copy.length) return copy;
            [copy[idx], copy[swap]] = [copy[swap], copy[idx]];
            return copy;
        });
    }

    function updateBlock(id, content) {
        setBlocks((s) => s.map((b) => (b.id === id ? { ...b, content } : b)));
    }

    function save() {
        console.log("Saving", { newsletterId, articleId, title, authors, media, blocks });
        window.alert("Saved (mock)");
    }

    return (
        <div className="bg-white items-center text-black">
            <Menu />
            <main className="pt-8 p-4 container mx-auto min-h-[60vh]">
                <div className="flex justify-between gap-2 mb-4">
                    <h2 className="text-2xl font-semibold m-0!">Edit Article</h2>
                    <div className="flex gap-4">
                        <button onClick={save} className="button">Save</button>
                        <button onClick={() => window.history.back()} className="button button-light">Cancel</button>
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Title</label>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Article Title" className="input-text w-full" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Authors</label>
                        <div className="flex gap-2 flex-wrap">
                            {authors.map((a) => (
                                <div key={a.id} className="flex items-center gap-2 border-2 border-gray-light rounded-md p-2">
                                    <Profile author={a} />
                                    <button className="text-red-600 ml-2" onClick={() => removeAuthor(a.id)}>Remove</button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-2 flex gap-2">
                            <input id="author-search" placeholder="Add author (mock)" className="input-text m-0!" />
                            <button onClick={() => addAuthor(document.getElementById("author-search").value)} className="button">Add</button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Uploaded media</label>
                        <div className="flex gap-2 flex-wrap">
                            {media.map((m) => (
                                <div key={m.id} className="border-2 border-gray-light rounded p-2 flex items-center gap-2">
                                    {m.url ? (
                                        <img src={m.url} alt={m.name} className="w-24 h-24 object-cover rounded bg-gray-light" />
                                    ) : (
                                        <div className="text-sm">{m.name}</div>
                                    )}
                                    <button onClick={() => setMedia((s) => s.filter(x => x.id !== m.id))} className="text-red-600">Remove</button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-2">
                            <input type="file" onChange={(e) => { const f = e.target.files[0]; if (f) { const url = URL.createObjectURL(f); setMedia((s) => [...s, { id: `m${Math.random().toString(36).slice(2, 6)}`, name: f.name, url }]); } }} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Article content</label>
                        <div className="space-y-2">
                            {blocks.map((b, idx) => (
                                <div key={b.id} className="border-2 border-gray-light rounded p-2">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="text-sm text-gray-600">Block {idx + 1}</div>
                                        <div className="flex gap-2">
                                            <button onClick={() => moveBlock(idx, -1)} className="text-sm cursor-pointer">Up</button>
                                            <button onClick={() => moveBlock(idx, 1)} className="text-sm cursor-pointer">Down</button>
                                            <button onClick={() => removeBlock(b.id)} className="text-sm text-red-600 cursor-pointer">Remove</button>
                                        </div>
                                    </div>
                                    <textarea value={b.content} onChange={(e) => updateBlock(b.id, e.target.value)} className="input-text w-full min-h-20" />
                                </div>
                            ))}
                            <div>
                                <button onClick={addBlock} className="button button-light w-full">Add block <i class="bi bi-plus"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
