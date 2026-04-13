import { useState } from "react";
import { useParams, useLocation } from "react-router";
import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { Banner } from "../components/graphics";
import { Popup, PopupForm } from "../components/popup";
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
    const canEdit = true; // For testing, always show edit buttons
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);

    const regions = ["JHEASA", "AJCU-NA", "AUSJAL", "Kircher", "AJCU-AP", "AJCU-AM"];

    const handleSaveEditMeeting = () => {
        setShowEditPopup(false);
    };

    const handleConfirmDeleteMeeting = () => {
        setShowDeletePopup(false);
    };

    // placeholder meeting information
    const meetingTitle = passedTitle || `Meeting ${meetingDate}`;
    const description = "Faculty members from universities in the Kircher Region play an important role in the International Association of Jesuit Engineering Schools (IAJES) through their active participation in various task forces and projects. Among the key task forces within the region are those focused on energy, which aims to establish a dynamic international network for sustainable and equitable energy access, and the Artificial Intelligence & Humanity task force, dedicated to equipping engineers with the skills to identify and address injustices in artificial intelligence and big data systems. Additionally, the Research & Academic Cooperation task force stands out for its commitment to initiatives like mentoring programs, cooperative PhD programs, and the development of cross-disciplinary skills for scientists and engineers.\n\nAn in-person event for IAJES representatives  in the Kircher Region is scheduled for February 22-23, 2024 in Deusto. This landmark meeting marks a milestone where universities from the region will convene in one location, fostering dialogue and exploring research, exchange, and networking synergies among our institutions. The meeting will focus on discussing ambitious goals and themes, providing a platform for the exchange of experiences in these areas, and creating spaces for community building among the members of the Kircher region.";

    const [meetingData, setMeetingData] = useState({
        region: regionName,
        title: meetingTitle,
        date: "January 1-3, 2026",
        location: "Santa Clara University",
        description: description,
        agendaLink: "https://example.com/agenda",
        agendaPdf: { name: "Meeting_Agenda.pdf", url: "agenda.pdf" },
        reportLink: "https://example.com/report",
        reportPdf: { name: "Meeting_Report.pdf", url: "report.pdf" },
        images: [],
        videos: []
    });

    const [editForm, setEditForm] = useState(meetingData);
    const [errors, setErrors] = useState({ title: false, date: false, location: false });
    const [previewingPdf, setPreviewingPdf] = useState(null); // "report", "agenda", or null

    const editPopupContent = (
        <div className="p-4 max-h-[80vh] overflow-y-auto">
            <h4>Edit Meeting</h4>
            <div className="space-y-4 mt-4">
                <div>
                    <label>Region:</label>
                    <select name="region" className="input input-text w-full" value={editForm.region} onChange={e => setEditForm({ ...editForm, region: e.target.value })}>
                        {regions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
                <div>
                    <label>Title:</label>
                    <input name="title" className="input input-text w-full" type="text" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
                </div>
                <div>
                    <label>Date:</label>
                    <input name="date" className="input input-text w-full" type="text" value={editForm.date} onChange={e => setEditForm({ ...editForm, date: e.target.value })} />
                </div>
                <div>
                    <label>Location:</label>
                    <input name="location" className="input input-text w-full" type="text" value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })} />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea name="description" className="input input-text w-full" value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} rows="4" />
                </div>
                <div>
                    <label>Agenda Link:</label>
                    <input name="agendaLink" className="input input-text w-full" type="url" value={editForm.agendaLink} onChange={e => setEditForm({ ...editForm, agendaLink: e.target.value })} />
                </div>
                <div>
                    <label>Agenda PDF:</label>
                    <input name="agendaPdf" className="input input-text w-full" type="file" accept=".pdf" onChange={e => setEditForm({ ...editForm, agendaPdf: e.target.files[0] })} />
                </div>
                <div>
                    <label>Meeting Report Link:</label>
                    <input name="reportLink" className="input input-text w-full" type="url" value={editForm.reportLink} onChange={e => setEditForm({ ...editForm, reportLink: e.target.value })} />
                </div>
                <div>
                    <label>Meeting Report PDF:</label>
                    <input name="reportPdf" className="input input-text w-full" type="file" accept=".pdf" onChange={e => setEditForm({ ...editForm, reportPdf: e.target.files[0] })} />
                </div>
                <div>
                    <label>Photos:</label>
                    <input className="w-full" type="file" multiple accept="image/*" onChange={e => {
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
                    <input className="w-full" type="file" multiple accept="video/*" onChange={e => {
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
    );

    const deletePopupContent = <p>This will delete "{meetingData.title}". Are you sure?</p>;

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
            <PopupForm id="edit-meeting-detail" className="md:w-[70vw] relative" show={showEditPopup} setShow={setShowEditPopup} validate={() => handleSaveEditMeeting()}>
                {editPopupContent}
            </PopupForm>
            <Popup id="delete-meeting-detail" show={showDeletePopup} setShow={setShowDeletePopup} stayOnBlur={true} buttons={[{ text: "Delete", onclick: handleConfirmDeleteMeeting }]}>
                {deletePopupContent}
            </Popup>
            <Menu />
            <Banner>
                <a href="/regional-meetings" className="banner-breadcrumb">
                    <i className="bi bi-caret-left-fill"></i>
                    <strong>REGIONAL MEETINGS</strong>
                </a>
                <br />
                <a href={`/regional-meetings/${regionName}`} className="banner-breadcrumb">
                    <i className="bi bi-caret-left-fill"></i>
                    <strong>{regionName}</strong>
                </a>
                <h1 style={{ color: "white" }}>{meetingTitle}</h1>
                <p>{meetingData.date} - {meetingData.location}</p>
            </Banner>

            <div className="py-20 px-10 lg:px-40">
                <div className="flex justify-end mb-4">
                    {canEdit && <button className="button button-light" onClick={() => setShowEditPopup(true)}>Edit Meeting <i className="bi bi-pencil ml-1"></i></button>}
                    {canEdit && <button className="button button-light button-delete ml-4" onClick={() => setShowDeletePopup(true)}>Delete Meeting <i className="bi bi-trash ml-1"></i></button>}
                </div>
                <p>{description}</p>
                <Break />
                {(meetingData.reportLink !== "#" || meetingData.reportPdf) && (meetingData.agendaLink !== "#" || meetingData.agendaPdf) && (
                    <div className="mt-10">
                        <h2 className="text-center">Meeting Resources</h2>
                        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
                            <a href={meetingData.reportLink} className="button button-light">
                                Meeting Report <i className="bi bi-box-arrow-up-right ml-2"></i>
                            </a>
                            {meetingData.reportPdf && (
                                <button
                                    className={`button ${previewingPdf === "report" ? "button" : "button-light"}`}
                                    onClick={() => setPreviewingPdf(previewingPdf === "report" ? null : "report")}
                                >
                                    <i className={`bi ${previewingPdf === "report" ? "bi-eye-slash" : "bi-eye"} mr-2`}></i>
                                    {previewingPdf === "report" ? "Hide" : "Preview"}
                                </button>
                            )}
                            <div class="hidden min-[768px]:inline-block h-[80px] min-h-[1em] w-0.5 self-stretch bg-primary-dark"></div>
                            <a href={meetingData.agendaLink} className="button button-light">
                                Meeting Agenda <i className="bi bi-box-arrow-up-right ml-2"></i>
                            </a>
                            {meetingData.agendaPdf && (
                                <button
                                    className={`button ${previewingPdf === "agenda" ? "button" : "button-light"}`}
                                    onClick={() => setPreviewingPdf(previewingPdf === "agenda" ? null : "agenda")}
                                >
                                    <i className={`bi ${previewingPdf === "agenda" ? "bi-eye-slash" : "bi-eye"} mr-2`}></i>
                                    {previewingPdf === "agenda" ? "Hide" : "Preview"}
                                </button>
                            )}
                        </div>
                        {previewingPdf && (
                            <div className="mt-6 flex justify-center">
                                <div className="bg-gray-light w-full lg:max-w-[75%]" style={{ aspectRatio: '8.5 / 11' }}></div>
                            </div>
                        )}
                    </div>
                )}

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