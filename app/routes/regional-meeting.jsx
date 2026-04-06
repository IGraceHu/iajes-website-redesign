import { useState } from "react";
import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { Banner } from "../components/graphics";
import { Popup } from "../components/popup";
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
    },
    "AJCU-NA": {
        name: "AJCU - NA",
        nameFull: "Association of Jesuit Colleges and Universities of North America",
        count: 30,
    },
    AUSJAL: {
        name: "AUSJAL",
        nameFull: "Association of Universities Entrusted to the Society of Jesus in Latin America",
        count: 30,
    },
    Kircher: {
        name: "Kircher",
        nameFull: "Kircher Network - Jesuit Higher Education in Europe and the Near East",
        count: 28,
    },
    "AJCU-AP": {
        name: "AJCU - AP",
        nameFull: "Association of Jesuit Colleges and Universities in Asia Pacific",
        count: 19,
    },
    "AJCU-AM": {
        name: "AJCU - AM",
        nameFull: "Association of Jesuit Colleges and Universities of Africa and Madagascar",
        count: 10,
    },
};

export default function RegionalMeeting() {
    const { regionName } = useParams();
    const region = regionalData[regionName];

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

    const [meetings, setMeetings] = useState([
        {
            title: "Meeting Title",
            date: "January 1, 2000",
            dateUrl: "1-1-2000",
            location: "Santa Clara University",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            agendaLink: "#",
            agendaPdf: null,
            reportLink: "#",
            reportPdf: null,
            images: [],
            videos: []
        },
        {
            title: "Second Meeting Title",
            date: "February 15, 2001",
            dateUrl: "2-15-2001",
            location: "Boston College",
            description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            agendaLink: "#",
            agendaPdf: null,
            reportLink: "#",
            reportPdf: null,
            images: [],
            videos: []
        },
        {
            title: "Third Meeting Title",
            date: "March 22, 2002",
            dateUrl: "3-22-2002",
            location: "Georgetown University",
            description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            agendaLink: "#",
            agendaPdf: null,
            reportLink: "#",
            reportPdf: null,
            images: [],
            videos: []
        },
    ]);

    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [addForm, setAddForm] = useState({ region: regionName, title: '', date: '', location: '', description: '', agendaLink: '', agendaPdf: null, reportLink: '', reportPdf: null, images: [], videos: [] });
    const [editForm, setEditForm] = useState({ region: regionName, title: '', date: '', location: '', description: '', agendaLink: '', agendaPdf: null, reportLink: '', reportPdf: null, images: [], videos: [] });
    const [editingIndex, setEditingIndex] = useState(null);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [addErrors, setAddErrors] = useState({ title: false, date: false, location: false });
    const [editErrors, setEditErrors] = useState({ title: false, date: false, location: false });

    const addPopupDetails = {
        content: (
            <div className="p-4 max-h-[80vh] overflow-y-auto">
                <h4>Add Meeting</h4>
                <div className="space-y-4 mt-4">
                    <div>
                        <label>Region:</label>
                        <select className="input input-text w-full" value={addForm.region} onChange={e => setAddForm({ ...addForm, region: e.target.value })}>
                            {regions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div>
                        <label>Title:</label>
                        <input className="input input-text w-full" type="text" placeholder="Title" value={addForm.title} onChange={e => setAddForm({ ...addForm, title: e.target.value })} />
                    </div>
                    <div>
                        <label>Date:</label>
                        <input className="input input-text w-full" type="text" placeholder="Date (e.g. 1-1-2000)" value={addForm.date} onChange={e => setAddForm({ ...addForm, date: e.target.value })} />
                    </div>
                    <div>
                        <label>Location:</label>
                        <input className="input input-text w-full" type="text" placeholder="Location" value={addForm.location} onChange={e => setAddForm({ ...addForm, location: e.target.value })} />
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea className="input input-text w-full" placeholder="Description" value={addForm.description} onChange={e => setAddForm({ ...addForm, description: e.target.value })} rows="4" />
                    </div>
                    <div>
                        <label>Agenda Link:</label>
                        <input className="input input-text w-full" type="url" placeholder="Agenda Link" value={addForm.agendaLink} onChange={e => setAddForm({ ...addForm, agendaLink: e.target.value })} />
                    </div>
                    <div>
                        <label>Agenda PDF:</label>
                        <input className="input input-text w-full" type="file" accept=".pdf" onChange={e => setAddForm({ ...addForm, agendaPdf: e.target.files[0] })} />
                    </div>
                    <div>
                        <label>Meeting Report Link:</label>
                        <input className="input input-text w-full" type="url" placeholder="Meeting Report Link" value={addForm.reportLink} onChange={e => setAddForm({ ...addForm, reportLink: e.target.value })} />
                    </div>
                    <div>
                        <label>Meeting Report PDF:</label>
                        <input className="input input-text w-full" type="file" accept=".pdf" onChange={e => setAddForm({ ...addForm, reportPdf: e.target.files[0] })} />
                    </div>
                    <div>
                        <p className="font-semibold">Photos</p>
                        <input type="file" multiple accept="image/*" onChange={e => {
                            const files = Array.from(e.target.files);
                            const newImages = files.map(f => ({ url: URL.createObjectURL(f), featured: false }));
                            setAddForm({ ...addForm, images: [...addForm.images, ...newImages] });
                        }} />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {addForm.images.map((img, idx) => (
                                <div key={idx} className="relative border p-2">
                                    <img src={img.url} className="w-24 h-24 object-cover" />
                                    <input type="checkbox" checked={img.featured} onChange={e => {
                                        const copy = [...addForm.images];
                                        copy.forEach((i, j) => i.featured = j === idx ? e.target.checked : false);
                                        setAddForm({ ...addForm, images: copy });
                                    }} className="absolute top-1 left-1" /> Featured
                                    <button className="absolute bottom-1 right-1 text-red-600" onClick={() => setAddForm({ ...addForm, images: addForm.images.filter((_, i) => i !== idx) })} ><i className="bi bi-trash"></i></button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold">Videos</p>
                        <input type="file" multiple accept="video/*" onChange={e => {
                            const files = Array.from(e.target.files);
                            const newVideos = files.map(f => ({ url: URL.createObjectURL(f) }));
                            setAddForm({ ...addForm, videos: [...addForm.videos, ...newVideos] });
                        }} />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {addForm.videos.map((vid, idx) => (
                                <div key={idx} className="relative border p-2">
                                    <video src={vid.url} className="w-24 h-24" />
                                    <button className="absolute bottom-1 right-1 text-red-600" onClick={() => setAddForm({ ...addForm, videos: addForm.videos.filter((_, i) => i !== idx) })} ><i className="bi bi-trash"></i></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        ),
        buttons: [
            { text: "Cancel", onclick: () => { setShowAddPopup(false); setAddErrors({ title: false, date: false, location: false }); } },
            {
                text: "Add", onclick: () => {
                    const newErrors = {
                        title: !addForm.title.trim(),
                        date: !addForm.date.trim(),
                        location: !addForm.location.trim()
                    };
                    setAddErrors(newErrors);
                    if (!newErrors.title && !newErrors.date && !newErrors.location) {
                        setMeetings([...meetings, { ...addForm, dateUrl: addForm.date }]);
                        setShowAddPopup(false);
                    }
                }, className: "button"
            },
        ],
        defaultButton: { text: "", onclick: () => { } },
        closeOnBlur: false,
    };

    const editPopupDetails = {
        content: (
            <div className="p-4 max-h-[80vh] overflow-y-auto">
                <h4>Edit Meeting</h4>
                <div className="space-y-4 mt-4">
                    <div>
                        <label>Region:</label>
                        <select className="input input-text w-full" value={editForm.region} onChange={e => setEditForm({ ...editForm, region: e.target.value })}>
                            {regions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div>
                        <label>Title:</label>
                        <input className="input input-text w-full" type="text" placeholder="Title" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
                    </div>
                    <div>
                        <label>Date:</label>
                        <input className="input input-text w-full" type="text" placeholder="Date (e.g. 1-1-2000)" value={editForm.date} onChange={e => setEditForm({ ...editForm, date: e.target.value })} />
                    </div>
                    <div>
                        <label>Location:</label>
                        <input className="input input-text w-full" type="text" placeholder="Location" value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })} />
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea className="input input-text w-full" placeholder="Description" value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} rows="4" />
                    </div>
                    <div>
                        <label>Agenda Link:</label>
                        <input className="input input-text w-full" type="url" placeholder="Agenda Link" value={editForm.agendaLink} onChange={e => setEditForm({ ...editForm, agendaLink: e.target.value })} />
                    </div>
                    <div>
                        <label>Agenda PDF:</label>
                        <input className="input input-text w-full" type="file" accept=".pdf" onChange={e => setEditForm({ ...editForm, agendaPdf: e.target.files[0] })} />
                    </div>
                    <div>
                        <label>Meeting Report Link:</label>
                        <input className="input input-text w-full" type="url" placeholder="Meeting Report Link" value={editForm.reportLink} onChange={e => setEditForm({ ...editForm, reportLink: e.target.value })} />
                    </div>
                    <div>
                        <label>Meeting Report PDF:</label>
                        <input className="input input-text w-full" type="file" accept=".pdf" onChange={e => setEditForm({ ...editForm, reportPdf: e.target.files[0] })} />
                    </div>
                    <div>
                        <p className="font-semibold">Photos</p>
                        <input type="file" multiple accept="image/*" onChange={e => {
                            const files = Array.from(e.target.files);
                            const newImages = files.map(f => ({ url: URL.createObjectURL(f), featured: false }));
                            setEditForm({ ...editForm, images: [...editForm.images, ...newImages] });
                        }} />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {editForm.images.map((img, idx) => (
                                <div key={idx} className="relative border p-2">
                                    <img src={img.url} className="w-24 h-24 object-cover" />
                                    <input type="checkbox" checked={img.featured} onChange={e => {
                                        const copy = [...editForm.images];
                                        copy.forEach((i, j) => i.featured = j === idx ? e.target.checked : false);
                                        setEditForm({ ...editForm, images: copy });
                                    }} className="absolute top-1 left-1" /> Featured
                                    <button className="absolute bottom-1 right-1 text-red-600" onClick={() => setEditForm({ ...editForm, images: editForm.images.filter((_, i) => i !== idx) })} ><i className="bi bi-trash"></i></button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold">Videos</p>
                        <input type="file" multiple accept="video/*" onChange={e => {
                            const files = Array.from(e.target.files);
                            const newVideos = files.map(f => ({ url: URL.createObjectURL(f) }));
                            setEditForm({ ...editForm, videos: [...editForm.videos, ...newVideos] });
                        }} />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {editForm.videos.map((vid, idx) => (
                                <div key={idx} className="relative border p-2">
                                    <video src={vid.url} className="w-24 h-24" />
                                    <button className="absolute bottom-1 right-1 text-red-600" onClick={() => setEditForm({ ...editForm, videos: editForm.videos.filter((_, i) => i !== idx) })} ><i className="bi bi-trash"></i></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        ),
        buttons: [
            { text: "Cancel", onclick: () => { setShowEditPopup(false); setEditErrors({ title: false, date: false, location: false }); } },
            {
                text: "Save", onclick: () => {
                    const newErrors = {
                        title: !editForm.title.trim(),
                        date: !editForm.date.trim(),
                        location: !editForm.location.trim()
                    };
                    setEditErrors(newErrors);
                    if (!newErrors.title && !newErrors.date && !newErrors.location) {
                        setMeetings(meetings.map((m, i) => i === editingIndex ? editForm : m));
                        setShowEditPopup(false);
                    }
                }, className: "button"
            },
        ],
        defaultButton: { text: "", onclick: () => { } },
        closeOnBlur: false,
    };

    const deletePopupDetails = {
        content: <p>This will delete "{meetings[deleteIndex]?.title}". Are you sure?</p>,
        buttons: [
            { text: "Cancel", onclick: () => setShowDeletePopup(false) },
            { text: "Delete", onclick: () => { setMeetings(meetings.filter((_, i) => i !== deleteIndex)); setShowDeletePopup(false); }, className: "button" },
        ],
        defaultButton: { text: "", onclick: () => { } },
        closeOnBlur: false,
    };

    return (
        <>
            <Popup id="add" show={showAddPopup} setShow={setShowAddPopup} details={addPopupDetails} />
            <Popup id="edit" show={showEditPopup} setShow={setShowEditPopup} details={editPopupDetails} />
            <Popup id="delete" show={showDeletePopup} setShow={setShowDeletePopup} details={deletePopupDetails} />
            <Menu />
            <Banner>
                <a href="/regional-meetings" className="banner-breadcrumb">
                    <i className="bi bi-caret-left-fill"></i>
                    <strong>REGIONAL MEETINGS</strong>
                </a>
                <h1 style={{ color: "white" }}>{region.name}</h1>
                <p>{region.nameFull}</p>
            </Banner>

            <div className="py-20 px-10 lg:px-40 duration-200">
                <div className="flex justify-end mb-4">
                    <button className="button button-light" onClick={() => { setAddForm({ region: regionName, title: '', date: '', location: '', description: '', agendaLink: '', agendaPdf: null, reportLink: '', reportPdf: null, images: [], videos: [] }); setShowAddPopup(true); }}>Add Meeting <i className="bi bi-plus ml-1"></i></button>
                </div>
                {/* meeting rows */}
                {meetings.map((mtg, idx) => (
                    <div key={mtg.dateUrl} className={`meeting-row ${idx % 2 === 1 ? "bg-gray" : ""} ${idx % 2 === 1 ? "reverse" : ""}`}>
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
                                <Link to={`/regional-meetings/${regionName}/${mtg.dateUrl}?title=${encodeURIComponent(mtg.title)}`} className="button button-light">
                                    View Meeting
                                </Link>
                                <a href={mtg.agendaLink} className="button button-light">
                                    Agenda <i className="bi bi-box-arrow-up-right ml-2"></i>
                                </a>
                                <a href={mtg.reportLink} className="button button-light">
                                    Full Report <i className="bi bi-box-arrow-up-right ml-2"></i>
                                </a>
                                <button className="button button-light inline-flex h-11 w-11 items-center justify-center" onClick={() => { setEditingIndex(idx); setEditForm(meetings[idx]); setShowEditPopup(true); }}><i className="bi bi-pencil text-lg"></i></button>
                                <button className="button button-light inline-flex h-11 w-11 items-center justify-center" onClick={() => { setDeleteIndex(idx); setShowDeletePopup(true); }}><i className="bi bi-trash text-lg text-red-600"></i></button>
                            </div>
                        </div>
                        <Link to={`/regional-meetings/${regionName}/${mtg.dateUrl}?title=${encodeURIComponent(mtg.title)}`} className="meeting-img" />
                    </div>
                ))}
            </div>
            <Footer />
        </>
    );
}
