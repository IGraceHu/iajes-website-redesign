import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import { supabase } from "../supabase";
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

const regions = ["JHEASA", "AJCU-NA", "AUSJAL", "Kircher", "AJCU-AP", "AJCU-AM"];

// Database functions
async function getMeetingById(meetingId) {
    const { data, error } = await supabase
        .from('regional meetings')
        .select('*')
        .eq('id', meetingId)
        .single();

    if (error) {
        console.error('Error fetching meeting:', error);
        return null;
    }
    return data;
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

        // Handle images (existing + new + reordered)
        if (extras.allImages) {
            for (let i = 0; i < extras.allImages.length; i++) {
                const img = extras.allImages[i];

                if (img.toDelete && img.id) {
                    // delete DB row
                    await supabase
                        .from('regional meetings resources')
                        .delete()
                        .eq('id', img.id);

                    // delete storage file
                    const path = img.resource_url.split('/regional-meeting-resources/')[1];
                    if (path) {
                        await supabase.storage
                            .from('regional-meetings-resources')
                            .remove([`regional-meeting-resources/${path}`]);
                    }
                }
                else if (img.isNew && img.file) {
                    await uploadResource(meetingId, img.file, 'image', i);
                }
                else if (img.id) {
                    await supabase
                        .from('regional meetings resources')
                        .update({ sort_order: i })
                        .eq('id', img.id);
                }
            }
        }

        // Handle videos (same logic)
        if (extras.allVideos) {
            for (let i = 0; i < extras.allVideos.length; i++) {
                const vid = extras.allVideos[i];

                if (vid.toDelete && vid.id) {
                    await supabase
                        .from('regional meetings resources')
                        .delete()
                        .eq('id', vid.id);

                    const path = vid.resource_url.split('/regional-meeting-resources/')[1];
                    if (path) {
                        await supabase.storage
                            .from('regional-meetings-resources')
                            .remove([`regional-meeting-resources/${path}`]);
                    }
                }
                else if (vid.isNew && vid.file) {
                    await uploadResource(meetingId, vid.file, 'video', i);
                }
                else if (vid.id) {
                    await supabase
                        .from('regional meetings resources')
                        .update({ sort_order: i })
                        .eq('id', vid.id);
                }
            }
        }
    }

    return { data: data[0], error: null };
}

async function deleteMeeting(meetingId) {
    // Delete ALL files by folder prefix (reliable)
    const prefixes = [
        `regional-meeting-resources/${meetingId}`,
        `regional-meetings-pdfs/${meetingId}`,
    ];

    for (const prefix of prefixes) {
        const { data: files } = await supabase.storage
            .from('regional-meetings-resources')
            .list(prefix, { limit: 1000 });

        if (files && files.length > 0) {
            const paths = files.map(f => `${prefix}/${f.name}`);
            await supabase.storage
                .from('regional-meetings-resources')
                .remove(paths);
        }
    }

    // DB cleanup
    await supabase
        .from('regional meetings resources')
        .delete()
        .eq('regional_meeting_id', meetingId);

    const { error } = await supabase
        .from('regional meetings')
        .delete()
        .eq('id', meetingId);

    return error;
}

async function uploadPdf(meetingId, type, file) {
    // Delete existing PDF if it exists
    const meeting = await getMeetingById(meetingId);
    const existingPdfField = type === 'agenda' ? 'agenda_pdf_url' : 'meeting_report_pdf_url';
    const existingPdfUrl = meeting?.[existingPdfField];

    if (existingPdfUrl) {
        try {
            const urlParts = existingPdfUrl.split('/');
            const filePath = urlParts.slice(-2).join('/');
            await supabase.storage.from('regional-meetings-resources').remove([filePath]);
        } catch (e) {
            console.error('Error deleting existing PDF:', e);
        }
    }

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

async function uploadResource(meetingId, file, type, sortOrder) {
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
            sort_order: sortOrder,
        }]);

    if (insertError) console.error(insertError);

    // return urlData.publicUrl;
}

export default function RegionalMeetingDetail() {
    const { regionName, meetingDate } = useParams();
    const { search } = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(search);
    const meetingId = query.get("id");
    const canEdit = true; // For testing, always show edit buttons

    const [meetingData, setMeetingData] = useState(null);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [editForm, setEditForm] = useState(null);
    const [saving, setSaving] = useState(false);
    const [previewingPdf, setPreviewingPdf] = useState(null);

    // Fetch meeting from database
    useEffect(() => {
        async function loadMeeting() {
            setLoading(true);

            if (meetingId) {
                const data = await getMeetingById(meetingId);
                setMeetingData(data);

                if (data) {
                    const resourcesData = await getMeetingResources(meetingId);
                    setResources(resourcesData);
                }
            }

            setLoading(false);
        }

        if (meetingId) {
            loadMeeting();
        } else {
            setLoading(false);
        }
    }, [meetingId]);

    const handleSaveEditMeeting = async (formData) => {
        if (saving || !meetingId) return;
        setSaving(true);

        const extras = {
            agendaPdf: editForm?.agendaPdf,
            reportPdf: editForm?.reportPdf,
            allImages: editForm?.allImages || [],
            allVideos: editForm?.allVideos || [],
        };

        const result = await updateMeeting(meetingId, formData, extras);

        setSaving(false);

        if (result.error) {
            alert('Error updating meeting: ' + result.error.message);
            return;
        }

        setShowEditPopup(false);

        // Refresh meeting data
        const data = await getMeetingById(meetingId);
        setMeetingData(data);

        if (data) {
            const resourcesData = await getMeetingResources(meetingId);
            setResources(resourcesData);
        }
    };

    const handleConfirmDeleteMeeting = async () => {
        if (!meetingId) return;

        const error = await deleteMeeting(meetingId);

        if (error) {
            alert('Error deleting meeting: ' + error.message);
            return;
        }

        // Navigate back to regional meetings list
        navigate(`/regional-meetings/${regionName}`);
    };

    const openEditPopup = () => {
        if (meetingData) {
            const allImages = resources
                .filter(r => r.resource_type === 'image')
                .sort((a, b) => a.sort_order - b.sort_order);

            const allVideos = resources
                .filter(r => r.resource_type === 'video')
                .sort((a, b) => a.sort_order - b.sort_order);

            setEditForm({
                region: meetingData.region || regionName,
                title: meetingData.name || '',
                date: meetingData.date || '',
                location: meetingData.location || '',
                description: meetingData.description || '',
                agendaLink: meetingData.agenda_url || '',
                reportLink: meetingData.meeting_report_url || '',
                agendaPdf: null,
                reportPdf: null,
                allImages,
                allVideos,
            });
        }
        setShowEditPopup(true);
    };

    // Filter resources by type
    const images = resources.filter(r => r.resource_type === 'image');
    const videos = resources.filter(r => r.resource_type === 'video');

    if (loading) {
        return (
            <>
                <Menu />
                <div className="w-full bg-white">
                    <div className="lg:px-40 px-10 py-20">
                        <p>Loading...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (!meetingData) {
        return (
            <>
                <Menu />
                <div className="w-full bg-white">
                    <div className="lg:px-40 px-10 py-20">
                        <p>Meeting not found</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const editPopupContent = (
        <>
            <div className="space-y-4 p-4">
                <h4>Edit Meeting</h4>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label>Region:</label>
                        <select name="region" className="input input-text w-full" value={editForm?.region || regionName} onChange={e => setEditForm({ ...editForm, region: e.target.value })}>
                            {regions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div>
                        <label>Title:</label>
                        <input name="title" className="input input-text w-full" type="text" value={editForm?.title || ''} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label>Date:</label>
                        <input name="date" className="input input-text w-full" type="text" value={editForm?.date || ''} onChange={e => setEditForm({ ...editForm, date: e.target.value })} />
                    </div>
                    <div>
                        <label>Location:</label>
                        <input name="location" className="input input-text w-full" type="text" value={editForm?.location || ''} onChange={e => setEditForm({ ...editForm, location: e.target.value })} />
                    </div>
                </div>
                <div>
                    <label>Description:</label>
                    <textarea name="description" className="input input-text w-full" value={editForm?.description || ''} onChange={e => setEditForm({ ...editForm, description: e.target.value })} rows="12" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label>Agenda Link:</label>
                        <input name="agendaLink" className="input input-text w-full" type="text" value={editForm?.agendaLink || ''} onChange={e => setEditForm({ ...editForm, agendaLink: e.target.value })} />
                    </div>
                    <div>
                        <label>Meeting Report Link:</label>
                        <input name="reportLink" className="input input-text w-full" type="text" value={editForm?.reportLink || ''} onChange={e => setEditForm({ ...editForm, reportLink: e.target.value })} />
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
                    <label>Photos:</label>
                    <input className="w-full" type="file" multiple accept="image/*" onChange={e => {
                        const files = Array.from(e.target.files);
                        const newImages = files.map(f => ({ file: f, url: URL.createObjectURL(f), isNew: true }));
                        setEditForm({ ...editForm, allImages: [...(editForm?.allImages || []), ...newImages] });
                    }} />
                    {(editForm?.allImages || []).length > 0 && (
                        <div className="mt-2">
                            <p className="font-bold">Photos (click arrows to reorder, X to delete):</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {editForm.allImages.map((img, idx) => (
                                    <div key={img.id || `new-${idx}`} className="relative border p-2">
                                        <img src={img.resource_url || img.url} className="w-24 h-24 object-cover" />
                                        <div className="absolute top-1 left-1 flex gap-1">
                                            <button
                                                type="button"
                                                className="text-xs bg-white rounded-full p-1 hover:bg-gray-200"
                                                onClick={() => {
                                                    if (idx === 0) return;
                                                    const updated = [...editForm.allImages];
                                                    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
                                                    setEditForm({ ...editForm, allImages: updated });
                                                }}
                                                disabled={idx === 0}
                                            >
                                                <i className="bi bi-arrow-left"></i>
                                            </button>
                                            <button
                                                type="button"
                                                className="text-xs bg-white rounded-full p-1 hover:bg-gray-200"
                                                onClick={() => {
                                                    if (idx === editForm.allImages.length - 1) return;
                                                    const updated = [...editForm.allImages];
                                                    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
                                                    setEditForm({ ...editForm, allImages: updated });
                                                }}
                                                disabled={idx === editForm.allImages.length - 1}
                                            >
                                                <i className="bi bi-arrow-right"></i>
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            className="absolute top-1 right-1 text-red-600 bg-white rounded-full p-1"
                                            onClick={() => {
                                                if (img.isNew) {
                                                    setEditForm({ ...editForm, allImages: editForm.allImages.filter((_, i) => i !== idx) });
                                                } else {
                                                    const updated = editForm.allImages.map((i, iIdx) =>
                                                        iIdx === idx ? { ...i, toDelete: true } : i
                                                    );
                                                    setEditForm({ ...editForm, allImages: updated });
                                                }
                                            }}
                                        >
                                            <i className="bi bi-x"></i>
                                        </button>
                                        <span className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs p-1">{idx + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    <label>Videos:</label>
                    <input className="w-full" type="file" multiple accept="video/*" onChange={e => {
                        const files = Array.from(e.target.files);
                        const newVideos = files.map(f => ({ file: f, url: URL.createObjectURL(f), isNew: true }));
                        setEditForm({ ...editForm, allVideos: [...(editForm?.allVideos || []), ...newVideos] });
                    }} />
                    {(editForm?.allVideos || []).length > 0 && (
                        <div className="mt-2">
                            <p className="font-bold">Videos (click arrows to reorder, X to delete):</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {editForm.allVideos.map((vid, idx) => (
                                    <div key={vid.id || `new-${idx}`} className="relative border p-2">
                                        <video src={vid.resource_url || vid.url} className="w-24 h-24 object-cover" />
                                        <div className="absolute top-1 left-1 flex gap-1">
                                            <button
                                                type="button"
                                                className="text-xs bg-white rounded-full p-1 hover:bg-gray-200"
                                                onClick={() => {
                                                    if (idx === 0) return;
                                                    const updated = [...editForm.allVideos];
                                                    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
                                                    setEditForm({ ...editForm, allVideos: updated });
                                                }}
                                                disabled={idx === 0}
                                            >
                                                <i className="bi bi-arrow-left"></i>
                                            </button>
                                            <button
                                                type="button"
                                                className="text-xs bg-white rounded-full p-1 hover:bg-gray-200"
                                                onClick={() => {
                                                    if (idx === editForm.allVideos.length - 1) return;
                                                    const updated = [...editForm.allVideos];
                                                    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
                                                    setEditForm({ ...editForm, allVideos: updated });
                                                }}
                                                disabled={idx === editForm.allVideos.length - 1}
                                            >
                                                <i className="bi bi-arrow-right"></i>
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            className="absolute top-1 right-1 text-red-600 bg-white rounded-full p-1"
                                            onClick={() => {
                                                if (vid.isNew) {
                                                    setEditForm({ ...editForm, allVideos: editForm.allVideos.filter((_, i) => i !== idx) });
                                                } else {
                                                    const updated = editForm.allVideos.map((v, vIdx) =>
                                                        vIdx === idx ? { ...v, toDelete: true } : v
                                                    );
                                                    setEditForm({ ...editForm, allVideos: updated });
                                                }
                                            }}
                                        >
                                            <i className="bi bi-x"></i>
                                        </button>
                                        <span className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs p-1">{idx + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );

    const deletePopupContent = <p>Are you sure you want to delete this meeting? This action cannot be undone.</p>;

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
                <img src={images[current].resource_url} className="w-full h-full object-contain" />
                <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 p-2 rounded">
                    Image {current + 1} of {images.length}
                </div>
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl z-10" onClick={next}><i className="bi bi-chevron-right"></i></button>
            </div>
        );
    }

    return (
        <>
            <PopupForm id="edit-meeting-detail" className="md:w-[70vw] relative" show={showEditPopup} setShow={setShowEditPopup} validate={handleSaveEditMeeting}>
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
                <h1 style={{ color: "white" }}>{meetingData.name}</h1>
                <p>{meetingData.date} - {meetingData.location}</p>
            </Banner>

            <div className="py-20 px-10 lg:px-40">
                <div className="flex justify-end mb-4">
                    {canEdit && <button className="button button-light" onClick={openEditPopup}>Edit Meeting <i className="bi bi-pencil ml-1"></i></button>}
                    {canEdit && <button className="button button-light button-delete ml-4" onClick={() => setShowDeletePopup(true)}>Delete Meeting <i className="bi bi-trash ml-1"></i></button>}
                </div>
                <p>{meetingData.description}</p>
                <Break />
                {(meetingData.meeting_report_url || meetingData.meeting_report_pdf_url) && (
                    <div className="mt-10">
                        <h2 className="text-center">Meeting Report</h2>
                        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
                            {meetingData.meeting_report_url && (
                                <a href={meetingData.meeting_report_url} className="button button-light">
                                    Meeting Report <i className="bi bi-box-arrow-up-right ml-2"></i>
                                </a>
                            )}
                            {meetingData.meeting_report_pdf_url && (
                                <button
                                    className={`button ${previewingPdf === "report" ? "button" : "button-light"}`}
                                    onClick={() => setPreviewingPdf(previewingPdf === "report" ? null : "report")}
                                >
                                    <i className={`bi ${previewingPdf === "report" ? "bi-eye-slash" : "bi-eye"} mr-2`}></i>
                                    {previewingPdf === "report" ? "Hide" : "Preview"}
                                </button>
                            )}
                        </div>
                        {previewingPdf === "report" && meetingData.meeting_report_pdf_url && (
                            <div className="mt-6 flex justify-center">
                                <iframe
                                    src={meetingData.meeting_report_pdf_url}
                                    className="w-full lg:max-w-[75%]"
                                    style={{ height: '80vh' }}
                                    title="Meeting Report PDF"
                                />
                            </div>
                        )}
                    </div>
                )}

                {(meetingData.agenda_url || meetingData.agenda_pdf_url) && (
                    <div className="mt-10">
                        <h2 className="text-center">Meeting Agenda</h2>
                        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
                            {meetingData.agenda_url && (
                                <a href={meetingData.agenda_url} className="button button-light">
                                    Meeting Agenda <i className="bi bi-box-arrow-up-right ml-2"></i>
                                </a>
                            )}
                            {meetingData.agenda_pdf_url && (
                                <button
                                    className={`button ${previewingPdf === "agenda" ? "button" : "button-light"}`}
                                    onClick={() => setPreviewingPdf(previewingPdf === "agenda" ? null : "agenda")}
                                >
                                    <i className={`bi ${previewingPdf === "agenda" ? "bi-eye-slash" : "bi-eye"} mr-2`}></i>
                                    {previewingPdf === "agenda" ? "Hide" : "Preview"}
                                </button>
                            )}
                        </div>
                        {previewingPdf === "agenda" && meetingData.agenda_pdf_url && (
                            <div className="mt-6 flex justify-center">
                                <iframe
                                    src={meetingData.agenda_pdf_url}
                                    className="w-full lg:max-w-[75%]"
                                    style={{ height: '80vh' }}
                                    title="Meeting Agenda PDF"
                                />
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-10">
                    <h1>Gallery</h1>
                    <div className="mt-6">
                        <Carousel images={images} />
                    </div>
                    <div className="mt-6 flex flex-col md:flex-row gap-4">
                        {videos.length > 0 ? videos.map((vid, idx) => (
                            <video key={idx} src={vid.resource_url} controls className="w-full md:w-1/2 h-64 object-cover" />
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