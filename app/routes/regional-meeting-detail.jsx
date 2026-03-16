import { useState } from "react";
import { useParams, useLocation } from "react-router";
import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { Popup } from "../components/popup";
import { Break } from "../components/graphics";
import "../styles/regional-meetings.css";
import "../styles/video-resources.css";

export function meta() {
    return [{ title: "Meeting Detail" }];
}

export default function RegionalMeetingDetail() {
    const { regionName, meetingDate } = useParams();
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const passedTitle = query.get("title");
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);

    // placeholder meeting information
    const meetingTitle = passedTitle || `Meeting ${meetingDate}`;
    const description = "Faculty members from universities in the Kircher Region play an important role in the International Association of Jesuit Engineering Schools (IAJES) through their active participation in various task forces and projects. Among the key task forces within the region are those focused on energy, which aims to establish a dynamic international network for sustainable and equitable energy access, and the Artificial Intelligence & Humanity task force, dedicated to equipping engineers with the skills to identify and address injustices in artificial intelligence and big data systems. Additionally, the Research & Academic Cooperation task force stands out for its commitment to initiatives like mentoring programs, cooperative PhD programs, and the development of cross-disciplinary skills for scientists and engineers.\n\nAn in-person event for IAJES representatives  in the Kircher Region is scheduled for February 22-23, 2024 in Deusto. This landmark meeting marks a milestone where universities from the region will convene in one location, fostering dialogue and exploring research, exchange, and networking synergies among our institutions. The meeting will focus on discussing ambitious goals and themes, providing a platform for the exchange of experiences in these areas, and creating spaces for community building among the members of the Kircher region.";

    const [meetingData, setMeetingData] = useState({
        title: meetingTitle,
        date: meetingDate,
        location: "Santa Clara University",
        description: description,
        agendaLink: "#",
        agendaPdf: null,
        reportPdf: null,
        images: [],
        videos: []
    });

    const [editForm, setEditForm] = useState(meetingData);
    const [errors, setErrors] = useState({ title: false, date: false, location: false });

    const editPopupDetails = {
        content: (
            <div className="p-4 max-h-[80vh] overflow-y-auto">
                <h4>Edit Meeting</h4>
                <div className="space-y-4 mt-4">
                    <div>
                        <label>Title:</label>
                        <input className="input input-text w-full" type="text" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
                    </div>
                    <div>
                        <label>Date:</label>
                        <input className="input input-text w-full" type="text" value={editForm.date} onChange={e => setEditForm({ ...editForm, date: e.target.value })} />
                    </div>
                    <div>
                        <label>Location:</label>
                        <input className="input input-text w-full" type="text" value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })} />
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea className="input input-text w-full" value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} rows="4" />
                    </div>
                    <div>
                        <label>Agenda Link:</label>
                        <input className="input input-text w-full" type="url" value={editForm.agendaLink} onChange={e => setEditForm({ ...editForm, agendaLink: e.target.value })} />
                    </div>
                    <div>
                        <label>Agenda PDF:</label>
                        <input className="input input-text w-full" type="file" accept=".pdf" onChange={e => setEditForm({ ...editForm, agendaPdf: e.target.files[0] })} />
                    </div>
                    <div>
                        <label>Meeting Report PDF:</label>
                        <input className="input input-text w-full" type="file" accept=".pdf" onChange={e => setEditForm({ ...editForm, reportPdf: e.target.files[0] })} />
                    </div>
                    <div>
                        <label>Photos:</label>
                        <input type="file" multiple accept="image/*" onChange={e => {
                            const files = Array.from(e.target.files);
                            const newImages = files.map(f => ({ url: URL.createObjectURL(f), featured: false }));
                            setEditForm({ ...editForm, images: [...editForm.images, ...newImages] });
                        }} />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {editForm.images.map((img, idx) => (
                                <div key={idx} className="relative border p-2">
                                    <img src={img.url} className="w-24 h-24 object-cover" />
                                    <div className="mt-1">
                                        <input type="checkbox" checked={img.featured} onChange={e => {
                                            const copy = [...editForm.images];
                                            copy.forEach((i, j) => i.featured = j === idx ? e.target.checked : false);
                                            setEditForm({ ...editForm, images: copy });
                                        }} /> Featured
                                    </div>
                                    <button className="absolute top-1 right-1 text-red-600" onClick={() => setEditForm({ ...editForm, images: editForm.images.filter((_, i) => i !== idx) })} ><i className="bi bi-trash"></i></button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label>Videos:</label>
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
            { text: "Cancel", onclick: () => { setShowEditPopup(false); setEditForm(meetingData); setErrors({ title: false, date: false, location: false }); } },
            {
                text: "Save", onclick: () => {
                    const newErrors = {
                        title: !editForm.title.trim(),
                        date: !editForm.date.trim(),
                        location: !editForm.location.trim()
                    };
                    setErrors(newErrors);
                    if (!newErrors.title && !newErrors.date && !newErrors.location) {
                        setMeetingData(editForm);
                        setShowEditPopup(false);
                    }
                }, className: "button"
            },
        ],
        defaultButton: { text: "", onclick: () => { } },
        closeOnBlur: false,
    };

    const deletePopupDetails = {
        content: <p>This will delete "{meetingData.title}". Are you sure?</p>,
        buttons: [
            { text: "Cancel", onclick: () => setShowDeletePopup(false) },
            { text: "Delete", onclick: () => { setShowDeletePopup(false); } },
        ],
        defaultButton: { text: "", onclick: () => { } },
        closeOnBlur: false,
    };

    function Carousel({ images }) {
        const [current, setCurrent] = useState(0);
        if (images.length === 0) {
            return <div className="aspect-video max-w-2xl mx-auto bg-gray-light flex items-center justify-center text-gray-500">No images available</div>;
        }
        const next = () => setCurrent((current + 1) % images.length);
        const prev = () => setCurrent((current - 1 + images.length) % images.length);
        return (
            <div className="relative aspect-video max-w-2xl mx-auto bg-gray-900 overflow-hidden">
                <button className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl z-10" onClick={prev}><i className="bi bi-chevron-left"></i></button>
                <img src={images[current].url} className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 p-2 rounded">
                    Image {current + 1} of {images.length}
                </div>
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl z-10" onClick={next}><i className="bi bi-chevron-right"></i></button>
            </div>
        );
    }

    return (
        <>
            <Popup id="edit" show={showEditPopup} setShow={setShowEditPopup} details={editPopupDetails} />
            <Popup id="delete" show={showDeletePopup} setShow={setShowDeletePopup} details={deletePopupDetails} />
            <Menu />
            <div className="relative w-full lg:px-40 px-10 py-20 bg-primary-dark overflow-hidden" style={{ color: "white" }}>
                <div className="absolute top-0 left-0 w-full z-0">
                    <div className="relative w-full opacity-100">
                        <img className="absolute w-50 -top-20 -right-15" src="/assets/landing-disc-2a.svg" />
                        <img className="absolute w-60 top-15 -left-30 -rotate-20" src="/assets/landing-disc-4b.svg" />
                    </div>
                </div>
                <div className="relative z-1">
                    <div className="-ml-4 flex w-fit duration-200 hover:-ml-5 hover:text-primary-light">
                        <i className="bi bi-caret-left-fill"></i>
                        <a href="/regional-meetings" className="link-back border-b-2 border-transparent hover:border-primary-light ml-1 hover:ml-2">
                            <strong>REGIONAL MEETINGS</strong>
                        </a>
                    </div>
                    <div className="-ml-4 flex w-fit duration-200 hover:-ml-5 hover:text-primary-light mt-2">
                        <i className="bi bi-caret-left-fill"></i>
                        <a href={`/regional-meetings/${regionName}`} className="link-back border-b-2 border-transparent hover:border-primary-light ml-1 hover:ml-2">
                            <strong>{regionName}</strong>
                        </a>
                    </div>
                    <h1 style={{ color: "white", textTransform: "none !important" }}>{meetingTitle}</h1>
                    <p>{meetingData.date} - {meetingData.location}</p>
                </div>
            </div>

            <div className="py-20 px-10 lg:px-40">
                <div className="flex justify-end mb-4">
                    <button className="button button-light" onClick={() => setShowEditPopup(true)}>Edit Meeting <i className="bi bi-pencil ml-1"></i></button>
                    <button className="button button-light ml-4" onClick={() => setShowDeletePopup(true)}>Delete Meeting <i className="bi bi-trash ml-1"></i></button>
                </div>
                <p>{description}</p>
                <Break />
                <div className="mt-10 flex flex-col md:flex-row gap-4">
                    <div className="w-full">
                        <h2 className="text-center">Meeting Report</h2>
                        <div className="pdf-placeholder h-128 bg-gray-light"></div>
                    </div>
                    <div className="w-full">
                        <h2 className="text-center">Meeting Agenda</h2>
                        <div className="pdf-placeholder h-128 bg-gray-light"></div>
                    </div>
                </div>

                <div className="mt-10">
                    <h1>Gallery</h1>
                    <div className="mt-6">
                        <Carousel images={meetingData.images} />
                    </div>
                    <div className="mt-6 flex flex-col md:flex-row gap-4">
                        {meetingData.videos.length > 0 ? meetingData.videos.map((vid, idx) => (
                            <video key={idx} src={vid.url} controls className="w-full md:w-1/2 h-64 object-cover" />
                        )) : (
                            <>
                                <div className="w-full md:w-1/2 h-64 bg-gray-light flex items-center justify-center text-gray-500">Video placeholder</div>
                                <div className="w-full md:w-1/2 h-64 bg-gray-light flex items-center justify-center text-gray-500">Video placeholder</div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}