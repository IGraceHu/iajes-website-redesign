import { useState } from "react";
import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { Banner } from "../components/graphics";
import { Popup, PopupForm } from "../components/popup";
import "../styles/regional-meetings.css";
import "../styles/video-resources.css";
import { useParams, Link } from "react-router";

export function meta() {
    return [
        { title: "Regional Meeting" },
    ];
}

const regionalData = {
    JHEASA: {
        name: "JHEASA",
        nameFull: "Jesuit Higher Education in South Asia",
        count: 60,
        location: "South Asia",
    },
    "AJCU-NA": {
        name: "AJCU - NA",
        nameFull: "Association of Jesuit Colleges and Universities of North America",
        count: 30,
        location: "United States, District of Columbia, District of Belize, Canada",
    },
    AUSJAL: {
        name: "AUSJAL",
        nameFull: "Association of Universities Entrusted to the Society of Jesus in Latin America",
        count: 30,
        location: "Latin America",
    },
    Kircher: {
        name: "Kircher",
        nameFull: "Kircher Network - Jesuit Higher Education in Europe and the Near East",
        count: 28,
        location: "Europe, Near East",
    },
    "AJCU-AP": {
        name: "AJCU - AP",
        nameFull: "Association of Jesuit Colleges and Universities in Asia Pacific",
        count: 19,
        location: "East Asia and Oceania",
    },
    "AJCU-AM": {
        name: "AJCU - AM",
        nameFull: "Association of Jesuit Colleges and Universities of Africa and Madagascar",
        count: 10,
        location: "Africa, Madagascar",
    },
};

const regionalMeetingsData = {
    JHEASA: [
        {
            title: 'South Asia Leadership Meeting',
            date: 'August 12–14, 2024',
            location: 'New Delhi, India',
            description: 'A gathering of university leaders to discuss Jesuit higher education strategy and regional partnerships.',
            agendaLink: '#',
            reportLink: '#',
            dateUrl: 'south-asia-leadership-meeting-2024',
        },
        {
            title: 'Jesuit Education Forum',
            date: 'January 15–17, 2024',
            location: 'Colombo, Sri Lanka',
            description: 'A forum to explore curriculum innovation, faculty development, and shared research in South Asia.',
            agendaLink: '#',
            reportLink: '#',
            dateUrl: 'jesuit-education-forum-2024',
        },
    ],
    "AJCU-NA": [
        {
            title: 'North America Annual Meeting',
            date: 'September 3–5, 2024',
            location: 'Washington, D.C., USA',
            description: 'Annual leadership conference for Jesuit colleges and universities in North America.',
            agendaLink: '#',
            reportLink: '#',
            dateUrl: 'north-america-annual-meeting-2024',
        },
    ],
    AUSJAL: [
        {
            title: 'Latin America Higher Ed Summit',
            date: 'October 20–22, 2024',
            location: 'São Paulo, Brazil',
            description: 'A summit addressing regional collaboration, student mobility, and institutional sustainability.',
            agendaLink: '#',
            reportLink: '#',
            dateUrl: 'latin-america-higher-ed-summit-2024',
        },
    ],
    Kircher: [
        {
            title: 'Europe & Near East Network Meeting',
            date: 'November 5–7, 2024',
            location: 'Rome, Italy',
            description: 'A meeting focused on network growth, research partnerships, and mission-driven learning.',
            agendaLink: '#',
            reportLink: '#',
            dateUrl: 'europe-near-east-network-meeting-2024',
        },
    ],
    "AJCU-AP": [
        {
            title: 'Asia Pacific Leadership Forum',
            date: 'July 8–10, 2024',
            location: 'Manila, Philippines',
            description: 'Leaders from Jesuit institutions discuss regional strategy and community engagement.',
            agendaLink: '#',
            reportLink: '#',
            dateUrl: 'asia-pacific-leadership-forum-2024',
        },
    ],
    "AJCU-AM": [
        {
            title: 'Africa & Madagascar Regional Meeting',
            date: 'June 1–3, 2024',
            location: 'Nairobi, Kenya',
            description: 'A regional meeting on capacity building, sustainability, and Jesuit higher education priorities.',
            agendaLink: '#',
            reportLink: '#',
            dateUrl: 'africa-madagascar-regional-meeting-2024',
        },
    ],
};

function createMeetingFromFormData(formData, extras = {}) {
    const title = (formData.get('title') || '').toString().trim() || 'Untitled Meeting';
    const dateUrl = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return {
        region: formData.get('region') || '',
        title,
        date: formData.get('date') || '',
        location: formData.get('location') || '',
        description: formData.get('description') || '',
        agendaLink: formData.get('agendaLink') || '#',
        reportLink: formData.get('reportLink') || '#',
        agendaPdf: formData.get('agendaPdf') || null,
        reportPdf: formData.get('reportPdf') || null,
        images: extras.images || [],
        videos: extras.videos || [],
        dateUrl,
    };
}

export default function RegionalMeeting() {
    const { regionName } = useParams();
    const region = regionalData[regionName];
    const canEdit = true; // For testing, always show edit buttons

    if (!region) {
        return (
            <>
                <Menu />
                <div className="w-full bg-white">
                    <div className="lg:px-40 px-10 py-20">
                        <p>Region not found</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const regions = ["JHEASA", "AJCU-NA", "AUSJAL", "Kircher", "AJCU-AP", "AJCU-AM"];

    const initialMeetingForm = { region: regionName, title: '', date: '', location: '', description: '', agendaLink: '', agendaPdf: null, reportLink: '', reportPdf: null, images: [], videos: [] };

    const [showEditMeetingsPopup, setShowEditMeetingsPopup] = useState(false);
    const [showAddMeetingFormPopup, setShowAddMeetingFormPopup] = useState(false);
    const [showEditMeetingFormPopup, setShowEditMeetingFormPopup] = useState(false);
    const [showDeleteMeetingPopup, setShowDeleteMeetingPopup] = useState(false);
    const [addForm, setAddForm] = useState(initialMeetingForm);
    const [editForm, setEditForm] = useState(initialMeetingForm);
    const [editingIndex, setEditingIndex] = useState(null);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [meetings, setMeetings] = useState(regionalMeetingsData[regionName] || []);

    const openEditMeeting = (idx) => {
        setEditingIndex(idx);
        setEditForm({ ...meetings[idx] });
        setShowEditMeetingFormPopup(true);
    };

    const openDeleteMeeting = (idx) => {
        setDeleteIndex(idx);
        setShowDeleteMeetingPopup(true);
    };

    const handleSaveAddMeeting = (formData) => {
        const meeting = createMeetingFromFormData(formData, { images: addForm.images, videos: addForm.videos });
        setMeetings(prevMeetings => [meeting, ...prevMeetings]);
        setAddForm(initialMeetingForm);
        setShowAddMeetingFormPopup(false);
    };

    const handleSaveEditMeeting = (formData) => {
        const updatedMeeting = createMeetingFromFormData(formData, { images: editForm.images, videos: editForm.videos });
        setMeetings(prevMeetings => prevMeetings.map((meeting, idx) => idx === editingIndex ? updatedMeeting : meeting));
        setEditingIndex(null);
        setShowEditMeetingFormPopup(false);
    };

    const handleDeleteMeeting = () => {
        setMeetings(prevMeetings => prevMeetings.filter((_, i) => i !== deleteIndex));
        setDeleteIndex(null);
        setShowDeleteMeetingPopup(false);
    };

    const resetAddForm = () => {
        setAddForm({ ...initialMeetingForm, region: regionName });
    };

    const mainPopupButtons = [
        { text: "Add Meeting", onclick: () => { resetAddForm(); setShowAddMeetingFormPopup(true); } },
    ];

    return (
        <>
            <Popup id="edit-meetings" show={showEditMeetingsPopup} setShow={setShowEditMeetingsPopup} buttons={mainPopupButtons}>
                <div className="space-y-4 p-4 max-h-[80vh] overflow-y-auto">
                    <h4>Edit Meetings</h4>
                    <div className="grid gap-3">
                        {meetings.map((mtg, idx) => (
                            <div key={mtg.dateUrl} className="flex items-center hover:bg-teal-50 duration-200 px-5 rounded-sm cursor-pointer">
                                <button type="button" className="text-left grow" onClick={() => openEditMeeting(idx)}>
                                    <p className="font-semibold">{mtg.title}</p>
                                    <p className="text-sm text-gray-dark mt-1">{mtg.date} · {mtg.location}</p>
                                </button>
                                <div className="flex items-center gap-2 ml-4">
                                    <button type="button" className="button-icon text-primary-dark" onClick={() => openEditMeeting(idx)}>
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                    <button type="button" className="button-red" onClick={() => openDeleteMeeting(idx)}>
                                        <i className="bi bi-x" style={{ fontSize: "2rem" }}></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Popup>

            <PopupForm id="add-meeting" className="md:w-[70vw] relative" show={showAddMeetingFormPopup} setShow={setShowAddMeetingFormPopup} validate={handleSaveAddMeeting} nested>
                <div className="space-y-4 p-4">
                    <h4>Add Meeting</h4>
                    <div className="grid gap-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label>Region:</label>
                                <select name="region" className="input input-text w-full" value={addForm.region} onChange={e => setAddForm({ ...addForm, region: e.target.value })}>
                                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div>
                                <label>Title:</label>
                                <input name="title" className="input input-text w-full" type="text" placeholder="Title" value={addForm.title} onChange={e => setAddForm({ ...addForm, title: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label>Date:</label>
                                <input name="date" className="input input-text w-full" type="text" placeholder="Date (e.g. 1-1-2000)" value={addForm.date} onChange={e => setAddForm({ ...addForm, date: e.target.value })} />
                            </div>
                            <div>
                                <label>Location:</label>
                                <input name="location" className="input input-text w-full" type="text" placeholder="Location" value={addForm.location} onChange={e => setAddForm({ ...addForm, location: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <label>Description:</label>
                            <textarea name="description" className="input input-text w-full" placeholder="Description" value={addForm.description} onChange={e => setAddForm({ ...addForm, description: e.target.value })} rows="12" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label>Agenda Link:</label>
                                <input name="agendaLink" className="input input-text w-full" type="url" placeholder="Agenda Link" value={addForm.agendaLink} onChange={e => setAddForm({ ...addForm, agendaLink: e.target.value })} />
                            </div>
                            <div>
                                <label>Meeting Report Link:</label>
                                <input name="reportLink" className="input input-text w-full" type="url" placeholder="Meeting Report Link" value={addForm.reportLink} onChange={e => setAddForm({ ...addForm, reportLink: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label>Agenda PDF:</label>
                                <input name="agendaPdf" className="w-full" type="file" accept=".pdf" onChange={e => setAddForm({ ...addForm, agendaPdf: e.target.files[0] })} />
                            </div>
                            <div>
                                <label>Meeting Report PDF:</label>
                                <input name="reportPdf" className="w-full" type="file" accept=".pdf" onChange={e => setAddForm({ ...addForm, reportPdf: e.target.files[0] })} />
                            </div>
                        </div>
                        <div>
                            <label>Photos:</label>
                            <input className="w-full" type="file" multiple accept="image/*" onChange={e => {
                                const files = Array.from(e.target.files);
                                const newImages = files.map(f => ({ url: URL.createObjectURL(f), featured: false }));
                                setAddForm({ ...addForm, images: [...addForm.images, ...newImages] });
                            }} />
                        </div>
                        <div>
                            <label>Videos:</label>
                            <input className="w-full" type="file" multiple accept="video/*" onChange={e => {
                                const files = Array.from(e.target.files);
                                const newVideos = files.map(f => ({ url: URL.createObjectURL(f) }));
                                setAddForm({ ...addForm, videos: [...addForm.videos, ...newVideos] });
                            }} />
                        </div>
                    </div>
                </div>
            </PopupForm>

            <PopupForm id="edit-meeting" className="md:w-[70vw] relative" show={showEditMeetingFormPopup} setShow={setShowEditMeetingFormPopup} validate={handleSaveEditMeeting} nested>
                <div className="space-y-4 p-4">
                    <h4>Edit Meeting</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label>Region:</label>
                            <select name="region" className="input input-text w-full" value={editForm.region} onChange={e => setEditForm({ ...editForm, region: e.target.value })}>
                                {regions.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div>
                            <label>Title:</label>
                            <input name="title" className="input input-text w-full" type="text" placeholder="Title" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label>Date:</label>
                            <input name="date" className="input input-text w-full" type="text" placeholder="Date (e.g. 1-1-2000)" value={editForm.date} onChange={e => setEditForm({ ...editForm, date: e.target.value })} />
                        </div>
                        <div>
                            <label>Location:</label>
                            <input name="location" className="input input-text w-full" type="text" placeholder="Location" value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea name="description" className="input input-text w-full" placeholder="Description" value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} rows="12" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label>Agenda Link:</label>
                            <input name="agendaLink" className="input input-text w-full" type="url" placeholder="Agenda Link" value={editForm.agendaLink} onChange={e => setEditForm({ ...editForm, agendaLink: e.target.value })} />
                        </div>
                        <div>
                            <label>Meeting Report Link:</label>
                            <input name="reportLink" className="input input-text w-full" type="url" placeholder="Meeting Report Link" value={editForm.reportLink} onChange={e => setEditForm({ ...editForm, reportLink: e.target.value })} />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label>Agenda PDF:</label>
                            <input name="agendaPdf" className="w-full" type="file" accept=".pdf" onChange={e => setEditForm({ ...editForm, agendaPdf: e.target.files[0] })} />
                        </div>
                        <div>
                            <label>Meeting Report PDF:</label>
                            <input name="reportPdf" className="w-full" type="file" accept=".pdf" onChange={e => setEditForm({ ...editForm, reportPdf: e.target.files[0] })} />
                        </div>
                    </div>
                    <div>
                        <label>Photos:</label>
                        <input className="w-full" type="file" multiple accept="image/*" onChange={e => {
                            const files = Array.from(e.target.files);
                            const newImages = files.map(f => ({ url: URL.createObjectURL(f), featured: false }));
                            setEditForm({ ...editForm, images: [...editForm.images, ...newImages] });
                        }} />
                    </div>
                    <div>
                        <label>Videos:</label>
                        <input className="w-full" type="file" multiple accept="video/*" onChange={e => {
                            const files = Array.from(e.target.files);
                            const newVideos = files.map(f => ({ url: URL.createObjectURL(f) }));
                            setEditForm({ ...editForm, videos: [...editForm.videos, ...newVideos] });
                        }} />
                    </div>
                </div>
            </PopupForm>

            <Popup id="delete-meeting" show={showDeleteMeetingPopup} setShow={setShowDeleteMeetingPopup} stayOnBlur={true} nested buttons={[{ text: "Delete", onclick: handleDeleteMeeting }]}>
                <p>This will delete "{meetings[deleteIndex]?.title}". Are you sure?</p>
            </Popup>
            <Menu />
            <Banner>
                <a href="/regional-meetings" className="banner-breadcrumb">
                    <i className="bi bi-caret-left-fill"></i>
                    <strong>REGIONAL MEETINGS</strong>
                </a>
                <h1 style={{ color: "white" }}>{region.name}</h1>
                <p>{region.nameFull}</p>
                <div className="regional-meeting-banner-meta">
                    <p>{region.location}</p>
                    <p>{region.count} Universities</p>
                </div>
            </Banner>

            <div className="py-20 px-0 duration-200">
                <div className="flex justify-end px-10 lg:px-40 mb-4">
                    {canEdit && <button className="button button-light" onClick={() => { setShowEditMeetingsPopup(true); }}>Edit Meetings <i className="bi bi-pencil-square ml-1"></i></button>}
                </div>
                {/* meeting rows */}
                {meetings.map((mtg, idx) => (
                    <div key={mtg.dateUrl} className={`meeting-row-wrapper ${idx % 2 === 1 ? "bg-slate-100" : ""}`}>
                        <div className={`meeting-row ${idx % 2 === 1 ? "reverse" : ""} px-10 lg:px-40`}>
                            <div className="meeting-info">
                                <Link to={`/regional-meetings/${regionName}/${mtg.dateUrl}?title=${encodeURIComponent(mtg.title)}`}>
                                    <h2>{mtg.title}</h2>
                                </Link>
                                <div>
                                    <span className="font-bold">{mtg.date}</span>
                                    <span className="font-bold ml-4">{mtg.location}</span>
                                </div>
                                <p className="mt-2">{mtg.description}</p>
                                <div className="meeting-buttons">
                                    <a href={mtg.agendaLink} className="button">
                                        Agenda <i className="bi bi-box-arrow-up-right ml-2"></i>
                                    </a>
                                    <a href={mtg.reportLink} className="button">
                                        Meeting Report <i className="bi bi-box-arrow-up-right ml-2"></i>
                                    </a>
                                </div>
                            </div>
                            <Link to={`/regional-meetings/${regionName}/${mtg.dateUrl}?title=${encodeURIComponent(mtg.title)}`} className="meeting-img" />
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
        </>
    );
}
