import { useState, useEffect } from "react";
import { Link } from "react-router";
import { supabase } from "../supabase";
import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { Banner } from "../components/graphics";
import { PopupForm } from "../components/popup";
import { checkCurrentAuth } from "../helpers/permissions";
import "../styles/regional-meetings.css";

export function meta() {
    return [
        { title: "Regional Meetings" },
    ];
}

const regionalData = [
    {
        name: "JHEASA",
        nameFull: "Jesuit Higher Education in South Asia",
        count: 60,
        url: "JHEASA",
        location: "South Asia",
    },
    {
        name: "AJCU - NA",
        nameFull: "Association of Jesuit Colleges and Universities of North America",
        count: 30,
        url: "AJCU-NA",
        location: "United States, District of Columbia, District of Belize, Canada",
    },
    {
        name: "AUSJAL",
        nameFull: "Association of Universities Entrusted to the Society of Jesus in Latin America",
        count: 30,
        url: "AUSJAL",
        location: "Latin America",
    },
    {
        name: "Kircher",
        nameFull: "Kircher Network - Jesuit Higher Education in Europe and the Near East",
        count: 28,
        url: "Kircher",
        location: "Europe, Near East",
    },
    {
        name: "AJCU - AP",
        nameFull: "Association of Jesuit Colleges and Universities in Asia Pacific",
        count: 19,
        url: "AJCU-AP",
        location: "East Asia and Oceania",
    },
    {
        name: "AJCU - AM",
        nameFull: "Association of Jesuit Colleges and Universities of Africa and Madagascar",
        count: 10,
        url: "AJCU-AM",
        location: "Africa, Madagascar",
    },
];

const THUMBNAIL_PREFIX = "region-thumbnails";

async function getRegionThumbnails() {
    const { data: files, error } = await supabase.storage
        .from("regional-meetings-resources")
        .list(THUMBNAIL_PREFIX, { limit: 1000 });

    if (error || !files) {
        return {};
    }

    const thumbnails = {};
    for (const f of files) {
        const baseName = f.name.replace(/\.[^.]+$/, "");
        const { data: urlData } = supabase.storage
            .from("regional-meetings-resources")
            .getPublicUrl(`${THUMBNAIL_PREFIX}/${f.name}`);
        // Cache-bust on updated_at so replaced files refresh
        const cacheBust = f.updated_at ? `?t=${new Date(f.updated_at).getTime()}` : "";
        thumbnails[baseName] = urlData.publicUrl + cacheBust;
    }
    return thumbnails;
}

async function removeRegionThumbnailFiles(regionUrl) {
    const { data: files } = await supabase.storage
        .from("regional-meetings-resources")
        .list(THUMBNAIL_PREFIX, { limit: 1000 });

    if (!files) return;

    const matches = files
        .filter(f => f.name.replace(/\.[^.]+$/, "") === regionUrl)
        .map(f => `${THUMBNAIL_PREFIX}/${f.name}`);

    if (matches.length > 0) {
        await supabase.storage
            .from("regional-meetings-resources")
            .remove(matches);
    }
}

async function uploadRegionThumbnail(regionUrl, file) {
    // Remove any existing thumbnail (possibly with a different extension) so it
    // does not linger alongside the new one.
    await removeRegionThumbnailFiles(regionUrl);

    const ext = file.name.split(".").pop();
    const path = `${THUMBNAIL_PREFIX}/${regionUrl}.${ext}`;

    const { error } = await supabase.storage
        .from("regional-meetings-resources")
        .upload(path, file, { upsert: true });

    if (error) {
        console.error("Error uploading region thumbnail:", error);
        return null;
    }
}

function RegionalCard({ region, imageUrl }) {
    return (
        <div className="regional-card duration-200">
            <Link to={`/regional-meetings/${region.url}`} className="block w-full p-2 border-2 border-transparent hover:border-primary-light duration-200 rounded-md">
                <div className="w-full lg:h-[14vw] sm:h-[28vw] h-[52vw] rounded-md mb-2 overflow-hidden bg-slate-100 flex items-center">
                    {imageUrl ? (
                        <img className="min-w-full h-full object-cover grow-0 shrink-0" src={imageUrl} alt={region.name} />
                    ) : (
                        <div className="relative w-full h-full p-5">
                            <img className="w-[50%] absolute -right-20 -bottom-20 z-0" src="../assets/landing-disc-4a.svg" alt="" aria-hidden="true" />
                        </div>
                    )}
                </div>
                <div className="regional-card-content">
                    <div className="regional-card-top-row">
                        <h2 className="regional-card-title">{region.name}</h2>
                        <div className="regional-card-stat-section">
                            <span className="regional-card-statistic">{region.count}</span>
                        </div>
                    </div>
                    <div className="regional-card-bottom-row">
                        <p className="regional-card-location">{region.location}</p>
                        <p className="regional-card-caption">Universities</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default function RegionalMeetings() {
    const [isAdmin, setIsAdmin] = useState(false);
    const canEdit = isAdmin;

    const [thumbnails, setThumbnails] = useState({});
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [editForm, setEditForm] = useState({}); // { [regionUrl]: { file, preview, toDelete } }
    const [saving, setSaving] = useState(false);

    async function loadThumbnails() {
        const thumbs = await getRegionThumbnails();
        setThumbnails(thumbs);
    }

    useEffect(() => {
        loadThumbnails();
        return checkCurrentAuth(setIsAdmin)
    }, []);

    function openEditPopup() {
        if (!canEdit) {
            alert("You must be an admin and logged in to edit thumbnails.");
            return;
        }
        // Reset pending edits
        const initial = {};
        for (const region of regionalData) {
            initial[region.url] = { file: null, preview: null, toDelete: false };
        }
        setEditForm(initial);
        setShowEditPopup(true);
    }

    function handleFileSelect(regionUrl, file) {
        if (!file) return;
        setEditForm(prev => ({
            ...prev,
            [regionUrl]: {
                file,
                preview: URL.createObjectURL(file),
                toDelete: false,
            },
        }));
    }

    function handleClearPending(regionUrl) {
        setEditForm(prev => ({
            ...prev,
            [regionUrl]: { file: null, preview: null, toDelete: false },
        }));
    }

    function handleMarkDelete(regionUrl) {
        setEditForm(prev => ({
            ...prev,
            [regionUrl]: { file: null, preview: null, toDelete: true },
        }));
    }

    async function handleSave() {
        if (!canEdit) {
            alert("You must be an admin and logged in to edit thumbnails.");
            return;
        }
        if (saving) return;
        setSaving(true);

        try {
            for (const region of regionalData) {
                const pending = editForm[region.url];
                if (!pending) continue;

                if (pending.file) {
                    await uploadRegionThumbnail(region.url, pending.file);
                } else if (pending.toDelete) {
                    await removeRegionThumbnailFiles(region.url);
                }
            }
            await loadThumbnails();
            setShowEditPopup(false);
        } catch (e) {
            console.error("Error saving thumbnails:", e);
            alert("Error saving thumbnails. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    const cards = regionalData.map((region) => (
        <RegionalCard key={region.url} region={region} imageUrl={thumbnails[region.url]} />
    ));

    return (
        <>
            <PopupForm
                id="edit-region-thumbnails"
                className="md:w-[70vw] relative"
                label="Edit region thumbnails"
                show={showEditPopup}
                setShow={setShowEditPopup}
                validate={handleSave}
            >
                <div className="space-y-4 p-4">
                    <h4>Edit Region Thumbnails</h4>
                    <p className="text-sm text-gray-dark">Upload an image for each region card. Recommended aspect ratio matches the card preview.</p>
                    <div className="grid gap-4 md:grid-cols-2">
                        {regionalData.map(region => {
                            const pending = editForm[region.url] || {};
                            const showExisting = !pending.file && !pending.toDelete;
                            const existingUrl = thumbnails[region.url];
                            const previewUrl = pending.preview || (showExisting ? existingUrl : null);

                            return (
                                <div key={region.url} className="p-3 rounded-md" style={{ border: "2px solid var(--color-primary-dark)" }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-semibold">{region.name}</p>
                                    </div>
                                    <div className="w-full h-32 rounded-md mb-2 overflow-hidden bg-slate-100 flex items-center justify-center">
                                        {previewUrl ? (
                                            <img src={previewUrl} alt={region.name} className="min-w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-sm text-gray-dark italic">
                                                {pending.toDelete ? "Will be removed on save" : "No thumbnail"}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            className="w-full"
                                            type="file"
                                            accept="image/*"
                                            onChange={e => handleFileSelect(region.url, e.target.files[0])}
                                        />
                                        {pending.file && (
                                            <button type="button" className="text-red-600 cursor-pointer shrink-0" aria-label={`Cancel selected thumbnail for ${region.name}`} title="Cancel selection" onClick={() => handleClearPending(region.url)}>
                                                <i className="bi bi-x-lg" aria-hidden="true"></i>
                                            </button>
                                        )}
                                        {!pending.file && existingUrl && !pending.toDelete && (
                                            <button type="button" className="text-red-600 cursor-pointer shrink-0" aria-label={`Remove thumbnail for ${region.name}`} title="Remove thumbnail" onClick={() => handleMarkDelete(region.url)}>
                                                <i className="bi bi-trash" aria-hidden="true"></i>
                                            </button>
                                        )}
                                        {pending.toDelete && (
                                            <button type="button" className="text-sm text-primary-dark cursor-pointer shrink-0" onClick={() => handleClearPending(region.url)}>
                                                Undo
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </PopupForm>

            <Menu currentEndUrl="/regional-meetings" />
            <main id="main-content" className="w-full duration-200">
                <Banner type="blue">
                    <h1 className="w-full text-center" style={{ color: "white" }}>Regional Meetings</h1>
                </Banner>
                <div className="regional-meetings-container">
                    <div className="regional-meetings-content">
                        <h3 className="regional-subheader">The Six Jesuit Regions of the World</h3>
                        <p className="regional-description">
                            The following are the 6 regions identified by the IAJU (International Association of Jesuit Universities).
                        </p>

                        {canEdit && (
                            <div className="flex justify-end mb-4">
                                <button className="button button-light" onClick={openEditPopup}>
                                    Edit Thumbnails <i className="bi bi-pencil ml-1" aria-hidden="true"></i>
                                </button>
                            </div>
                        )}

                        <div className="regional-cards-grid">{cards}</div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
