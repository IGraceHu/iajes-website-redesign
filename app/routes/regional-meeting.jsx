import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { supabase } from "../supabase";
import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { Banner } from "../components/graphics";
import { Popup, PopupForm } from "../components/popup";
import "../styles/regional-meetings.css";
import "../styles/video-resources.css";

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

const regions = ["JHEASA", "AJCU-NA", "AUSJAL", "Kircher", "AJCU-AP", "AJCU-AM"];

// Database functions
async function getMeetingsByRegion(region) {
    const { data, error } = await supabase
        .from('regional meetings')
        .select('*')
        .eq('region', region)
        .order('date', { ascending: false });

    if (error) {
        console.error('Error fetching meetings:', error);
        return [];
    }
    return data || [];
}

async function getMeetingResources(meetingId) {
    const { data, error } = await supabase
        .from('regional meetings resources')
        .select('*')
        .eq('regional_meeting_id', meetingId)
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching resources:', error);
        return [];
    }
    return data || [];
}

async function createMeeting(formData, extras = {}) {
    const title = (formData.get('title') || '').toString().trim() || 'Untitled Meeting';
    const dateUrl = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const meetingData = {
        name: title,
        region: formData.get('region') || '',
        date: formData.get('date') || '',
        date_url: dateUrl,
        location: formData.get('location') || '',
        description: formData.get('description') || '',
        agenda_url: formData.get('agendaLink') || '',
        meeting_report_url: formData.get('reportLink') || '',
    };

    const { data, error } = await supabase
        .from('regional meetings')
        .insert([meetingData])
        .select();

    if (error) {
        console.error('Error creating meeting:', error);
        return { error };
    }

    // Handle resource uploads if any
    if (data && data[0]) {
        const meetingId = data[0].id;

        // Upload agenda PDF if provided
        if (extras.agendaPdf) {
            await uploadPdf(meetingId, 'agenda', extras.agendaPdf);
        }

        // Upload report PDF if provided
        if (extras.reportPdf) {
            await uploadPdf(meetingId, 'report', extras.reportPdf);
        }

        // Upload images
        if (extras.images && extras.images.length > 0) {
            for (const image of extras.images) {
                if (image.file) {
                    await uploadResource(meetingId, image.file, 'image');
                }
            }
        }

        // Upload videos
        if (extras.videos && extras.videos.length > 0) {
            for (const video of extras.videos) {
                if (video.file) {
                    await uploadResource(meetingId, video.file, 'video');
                }
            }
        }
    }

    return { data: data[0], error: null };
}

async function updateMeeting(meetingId, formData, extras = {}) {
    const title = (formData.get('title') || '').toString().trim() || 'Untitled Meeting';
    const dateUrl = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const meetingData = {
        name: title,
        region: formData.get('region') || '',
        date: formData.get('date') || '',
        date_url: dateUrl,
        location: formData.get('location') || '',
        description: formData.get('description') || '',
        agenda_url: formData.get('agendaLink') || '',
        meeting_report_url: formData.get('reportLink') || '',
    };

    const { data, error } = await supabase
        .from('regional meetings')
        .update(meetingData)
        .eq('id', meetingId)
        .select();

    if (error) {
        console.error('Error updating meeting:', error);
        return { error };
    }

    // Handle new PDF uploads if provided
    if (data && data[0]) {
        // Upload agenda PDF if provided
        if (extras.agendaPdf) {
            await uploadPdf(meetingId, 'agenda', extras.agendaPdf);
        }

        // Upload report PDF if provided
        if (extras.reportPdf) {
            await uploadPdf(meetingId, 'report', extras.reportPdf);
        }

        // Upload new images
        if (extras.images && extras.images.length > 0) {
            for (const image of extras.images) {
                if (image.file) {
                    await uploadResource(meetingId, image.file, 'image');
                }
            }
        }

        // Upload new videos
        if (extras.videos && extras.videos.length > 0) {
            for (const video of extras.videos) {
                if (video.file) {
                    await uploadResource(meetingId, video.file, 'video');
                }
            }
        }
    }

    return { data: data[0], error: null };
}

async function deleteMeeting(meetingId) {
    // Resources will be automatically deleted due to ON DELETE CASCADE
    const { error } = await supabase
        .from('regional meetings')
        .delete()
        .eq('id', meetingId);

    return error;
}

async function uploadPdf(meetingId, type, file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${meetingId}/${type}.${fileExt}`;
    const filePath = `regional-meetings-pdfs/${fileName}`;

    const { data, error } = await supabase.storage
        .from('regional-meetings-resources')
        .upload(filePath, file, { upsert: true });

    if (error) {
        console.error(`Error uploading ${type} PDF:`, error);
        return null;
    }

    const { data: urlData } = supabase.storage
        .from('regional-meetings-resources')
        .getPublicUrl(filePath);

    // Update the meeting with the PDF URL
    const updateField = type === 'agenda' ? 'agenda_pdf_url' : 'meeting_report_pdf_url';
    const { error: updateError } = await supabase
        .from('regional meetings')
        .update({ [updateField]: urlData.publicUrl })
        .eq('id', meetingId);

    if (updateError) console.error(updateError);

    return urlData.publicUrl;
}

async function uploadResource(meetingId, file, type) {
    const fileExt = file.name.split('.').pop();
    const filePath = `regional-meeting-resources/${meetingId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from('regional-meetings-resources')
        .upload(filePath, file, { upsert: true });

    if (uploadError) {
        console.error('Upload error:', uploadError);
        return;
    }

    const { data: urlData } = supabase.storage
        .from('regional-meetings-resources')
        .getPublicUrl(filePath);

    // Create resource record
    const { error: insertError } = await supabase
        .from('regional meetings resources')
        .insert([{
            regional_meeting_id: meetingId,
            resource_url: urlData.publicUrl,
            resource_type: type,
            sort_order: 0,
        }]);

    if (insertError) console.error(insertError);

    // return urlData.publicUrl;
}

export default function RegionalMeeting() {
    const { regionName } = useParams();
    const navigate = useNavigate();
    const region = regionalData[regionName];
    const canEdit = true; // For testing, always show edit buttons

    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch meetings from database
    useEffect(() => {
        async function loadMeetings() {
            setLoading(true);
            const data = await getMeetingsByRegion(regionName);
            setMeetings(data);
            setLoading(false);
        }

        if (regionName) {
            loadMeetings();
        }
    }, [regionName]);

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

    const initialMeetingForm = {
        region: regionName,
        title: '',
        date: '',
        location: '',
        description: '',
        agendaLink: '',
        agendaPdf: null,
        reportLink: '',
        reportPdf: null,
        images: [],
        videos: []
    };

    const [showEditMeetingsPopup, setShowEditMeetingsPopup] = useState(false);
    const [showAddMeetingFormPopup, setShowAddMeetingFormPopup] = useState(false);
    const [showEditMeetingFormPopup, setShowEditMeetingFormPopup] = useState(false);
    const [showDeleteMeetingPopup, setShowDeleteMeetingPopup] = useState(false);
    const [addForm, setAddForm] = useState(initialMeetingForm);
    const [editForm, setEditForm] = useState(initialMeetingForm);
    const [editingMeeting, setEditingMeeting] = useState(null);
    const [deleteMeetingId, setDeleteMeetingId] = useState(null);
    const [saving, setSaving] = useState(false);

    const openEditMeeting = (meeting) => {
        setEditingMeeting(meeting);
        setEditForm({
            region: meeting.region,
            title: meeting.name || '',
            date: meeting.date || '',
            location: meeting.location || '',
            description: meeting.description || '',
            agendaLink: meeting.agenda_url || '',
            reportLink: meeting.meeting_report_url || '',
            agendaPdf: null,
            reportPdf: null,
            images: [],
            videos: [],
        });
        setShowEditMeetingFormPopup(true);
    };

    const openDeleteMeeting = (meeting) => {
        setDeleteMeetingId(meeting.id);
        setShowDeleteMeetingPopup(true);
    };

    const handleSaveAddMeeting = async (formData) => {
        if (saving) return;
        setSaving(true);

        const extras = {
            agendaPdf: addForm.agendaPdf,
            reportPdf: addForm.reportPdf,
            images: addForm.images,
            videos: addForm.videos,
        };

        const result = await createMeeting(formData, extras);

        setSaving(false);

        if (result.error) {
            alert('Error creating meeting: ' + result.error.message);
            return;
        }

        setAddForm(initialMeetingForm);
        setShowAddMeetingFormPopup(false);

        // Refresh meetings list
        const data = await getMeetingsByRegion(regionName);
        setMeetings(data);
    };

    const handleSaveEditMeeting = async (formData) => {
        if (saving || !editingMeeting) return;
        setSaving(true);

        const extras = {
            agendaPdf: editForm.agendaPdf,
            reportPdf: editForm.reportPdf,
            images: editForm.images,
            videos: editForm.videos,
        };

        const result = await updateMeeting(editingMeeting.id, formData, extras);

        setSaving(false);

        if (result.error) {
            alert('Error updating meeting: ' + result.error.message);
            return;
        }

        setEditingMeeting(null);
        setShowEditMeetingFormPopup(false);

        // Refresh meetings list
        const data = await getMeetingsByRegion(regionName);
        setMeetings(data);
    };

    const handleDeleteMeeting = async () => {
        if (!deleteMeetingId) return;

        const error = await deleteMeeting(deleteMeetingId);

        if (error) {
            alert('Error deleting meeting: ' + error.message);
            return;
        }

        setDeleteMeetingId(null);
        setShowDeleteMeetingPopup(false);

        // Refresh meetings list
        const data = await getMeetingsByRegion(regionName);
        setMeetings(data);
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
                    {loading ? (
                        <p>Loading...</p>
                    ) : meetings.length === 0 ? (
                        <p>No meetings found. Click "Add Meeting" to create one.</p>
                    ) : (
                        <div className="grid gap-3">
                            {meetings.map((mtg) => (
                                <div key={mtg.id} className="flex items-center hover:bg-teal-50 duration-200 px-5 rounded-sm cursor-pointer">
                                    <button type="button" className="text-left grow" onClick={() => openEditMeeting(mtg)}>
                                        <p className="font-semibold">{mtg.name}</p>
                                        <p className="text-sm text-gray-dark mt-1">{mtg.date} · {mtg.location}</p>
                                    </button>
                                    <div className="flex items-center gap-2 ml-4">
                                        <button type="button" className="button-icon text-primary-dark" onClick={() => openEditMeeting(mtg)}>
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button type="button" className="button-red" onClick={() => openDeleteMeeting(mtg)}>
                                            <i className="bi bi-x" style={{ fontSize: "2rem" }}></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
                                <input name="agendaLink" className="input input-text w-full" type="text" placeholder="Agenda Link" value={addForm.agendaLink} onChange={e => setAddForm({ ...addForm, agendaLink: e.target.value })} />
                            </div>
                            <div>
                                <label>Meeting Report Link:</label>
                                <input name="reportLink" className="input input-text w-full" type="text" placeholder="Meeting Report Link" value={addForm.reportLink} onChange={e => setAddForm({ ...addForm, reportLink: e.target.value })} />
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
                                const newImages = files.map(f => ({ file: f, url: URL.createObjectURL(f) }));
                                setAddForm({ ...addForm, images: [...addForm.images, ...newImages] });
                            }} />
                            {addForm.images.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {addForm.images.map((img, idx) => (
                                        <div key={idx} className="relative border p-2">
                                            <img src={img.url} className="w-24 h-24 object-cover" />
                                            <button className="absolute top-1 right-1 text-red-600" onClick={() => setAddForm({ ...addForm, images: addForm.images.filter((_, i) => i !== idx) })}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <label>Videos:</label>
                            <input className="w-full" type="file" multiple accept="video/*" onChange={e => {
                                const files = Array.from(e.target.files);
                                const newVideos = files.map(f => ({ file: f, url: URL.createObjectURL(f) }));
                                setAddForm({ ...addForm, videos: [...addForm.videos, ...newVideos] });
                            }} />
                            {addForm.videos.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {addForm.videos.map((vid, idx) => (
                                        <div key={idx} className="relative border p-2">
                                            <video src={vid.url} className="w-24 h-24" />
                                            <button className="absolute top-1 right-1 text-red-600" onClick={() => setAddForm({ ...addForm, videos: addForm.videos.filter((_, i) => i !== idx) })}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
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
                            <input name="agendaLink" className="input input-text w-full" type="text" placeholder="Agenda Link" value={editForm.agendaLink} onChange={e => setEditForm({ ...editForm, agendaLink: e.target.value })} />
                        </div>
                        <div>
                            <label>Meeting Report Link:</label>
                            <input name="reportLink" className="input input-text w-full" type="text" placeholder="Meeting Report Link" value={editForm.reportLink} onChange={e => setEditForm({ ...editForm, reportLink: e.target.value })} />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label>Agenda PDF (upload to replace existing):</label>
                            <input name="agendaPdf" className="w-full" type="file" accept=".pdf" onChange={e => setEditForm({ ...editForm, agendaPdf: e.target.files[0] })} />
                        </div>
                        <div>
                            <label>Meeting Report PDF (upload to replace existing):</label>
                            <input name="reportPdf" className="w-full" type="file" accept=".pdf" onChange={e => setEditForm({ ...editForm, reportPdf: e.target.files[0] })} />
                        </div>
                    </div>
                    <div>
                        <label>Photos (upload new photos):</label>
                        <input className="w-full" type="file" multiple accept="image/*" onChange={e => {
                            const files = Array.from(e.target.files);
                            const newImages = files.map(f => ({ file: f, url: URL.createObjectURL(f) }));
                            setEditForm({ ...editForm, images: [...editForm.images, ...newImages] });
                        }} />
                        {editForm.images.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {editForm.images.map((img, idx) => (
                                    <div key={idx} className="relative border p-2">
                                        <img src={img.url} className="w-24 h-24 object-cover" />
                                        <button className="absolute top-1 right-1 text-red-600" onClick={() => setEditForm({ ...editForm, images: editForm.images.filter((_, i) => i !== idx) })}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        <label>Videos (upload new videos):</label>
                        <input className="w-full" type="file" multiple accept="video/*" onChange={e => {
                            const files = Array.from(e.target.files);
                            const newVideos = files.map(f => ({ file: f, url: URL.createObjectURL(f) }));
                            setEditForm({ ...editForm, videos: [...editForm.videos, ...newVideos] });
                        }} />
                        {editForm.videos.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {editForm.videos.map((vid, idx) => (
                                    <div key={idx} className="relative border p-2">
                                        <video src={vid.url} className="w-24 h-24" />
                                        <button className="absolute top-1 right-1 text-red-600" onClick={() => setEditForm({ ...editForm, videos: editForm.videos.filter((_, i) => i !== idx) })}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </PopupForm>

            <Popup id="delete-meeting" show={showDeleteMeetingPopup} setShow={setShowDeleteMeetingPopup} stayOnBlur={true} nested buttons={[{ text: "Delete", onclick: handleDeleteMeeting }]}>
                <p>Are you sure you want to delete this meeting? This action cannot be undone.</p>
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
                {loading ? (
                    <div className="px-10 lg:px-40">
                        <p>Loading meetings...</p>
                    </div>
                ) : meetings.length === 0 ? (
                    <div className="px-10 lg:px-40">
                        <p>No meetings found for this region.</p>
                    </div>
                ) : (
                    meetings.map((mtg, idx) => (
                        <div key={mtg.id} className={`meeting-row-wrapper ${idx % 2 === 1 ? "bg-slate-100" : ""}`}>
                            <div className={`meeting-row ${idx % 2 === 1 ? "reverse" : ""} px-10 lg:px-40`}>
                                <div className="meeting-info">
                                    <Link to={`/regional-meetings/${regionName}/${mtg.date_url}?id=${mtg.id}`}>
                                        <h2>{mtg.name}</h2>
                                    </Link>
                                    <div>
                                        <span className="font-bold">{mtg.date}</span>
                                        <span className="font-bold ml-4">{mtg.location}</span>
                                    </div>
                                    <p className="mt-2">{mtg.description}</p>
                                    <div className="meeting-buttons">
                                        <a href={mtg.agenda_url} className="button">
                                            Agenda <i className="bi bi-box-arrow-up-right ml-2"></i>
                                        </a>
                                        <a href={mtg.meeting_report_url} className="button">
                                            Meeting Report <i className="bi bi-box-arrow-up-right ml-2"></i>
                                        </a>
                                    </div>
                                </div>
                                <Link to={`/regional-meetings/${regionName}/${mtg.date_url}?id=${mtg.id}`} className="meeting-img" />
                            </div>
                        </div>
                    ))
                )}
            </div>
            <Footer />
        </>
    );
}
