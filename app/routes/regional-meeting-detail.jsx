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

async function getMeetingByDateUrl(region, dateUrl) {
    const { data, error } = await supabase
        .from('regional meetings')
        .select('*')
        .eq('region', region)
        .eq('date_url', dateUrl)
        .single();

    if (error) {
        console.error('Error fetching meeting:', error);
        return null;
    }
    return data;
}

async function getUniqueDateUrl(region, title, currentMeetingId = null, originalTitle = null) {
    const baseUrl = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // If the title hasn't changed (comparing slugified versions), keep the existing URL
    if (originalTitle) {
        const originalSlug = originalTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        if (baseUrl === originalSlug) {
            return baseUrl; // Keep existing URL (no number added/removed)
        }
    }

    // Get all meetings in this region with similar date_url
    const { data: existing } = await supabase
        .from('regional meetings')
        .select('id, date_url')
        .eq('region', region)
        .like('date_url', `${baseUrl}%`);

    if (!existing || existing.length === 0) {
        return baseUrl;
    }

    // Filter out the current meeting being edited
    const otherMeetings = existing.filter(m => m.id !== currentMeetingId);
    if (otherMeetings.length === 0) {
        return baseUrl;
    }

    // Find the highest number suffix
    let maxNum = 0;
    for (const meeting of otherMeetings) {
        const match = meeting.date_url.match(/-(\d+)$/);
        if (match) {
            maxNum = Math.max(maxNum, parseInt(match[1]));
        }
    }

    return `${baseUrl}-${maxNum + 1}`;
}

async function updateMeeting(meetingId, formData, extras = {}) {
    const title = (formData.get('title') || '').toString().trim() || 'Untitled Meeting';
    // const dateUrl = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    // Get unique date_url
    const dateUrl = await getUniqueDateUrl(
        extras.region || formData.get('region') || '',
        title,
        meetingId,
        extras.originalTitle
    );

    const meetingData = {
        name: title,
        region: extras.region || formData.get('region') || '',
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
        // Delete agenda PDF if flagged
        if (extras.deleteAgendaPdf && extras.existingAgendaPdfUrl) {
            await deletePdf(meetingId, 'agenda', extras.existingAgendaPdfUrl);
        }
        // Upload agenda PDF if provided (replaces any existing)
        if (extras.agendaPdf) {
            await uploadPdf(meetingId, 'agenda', extras.agendaPdf);
        }

        // Delete report PDF if flagged
        if (extras.deleteReportPdf && extras.existingReportPdfUrl) {
            await deletePdf(meetingId, 'report', extras.existingReportPdfUrl);
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

async function deletePdf(meetingId, type, existingUrl) {
    // Delete from storage
    if (existingUrl) {
        try {
            const urlParts = existingUrl.split('/');
            const filePath = urlParts.slice(-2).join('/');
            await supabase.storage.from('regional-meetings-resources').remove([`regional-meetings-pdfs/${filePath}`]);
        } catch (e) {
            // try alternate path extraction
        }
        // Also try the full path approach used elsewhere
        try {
            const urlParts = existingUrl.split('/');
            const filePath = urlParts.slice(-2).join('/');
            await supabase.storage.from('regional-meetings-resources').remove([filePath]);
        } catch (e) {
            console.error('Error deleting PDF from storage:', e);
        }
    }
    // Clear the URL field in the DB
    const updateField = type === 'agenda' ? 'agenda_pdf_url' : 'meeting_report_pdf_url';
    await supabase
        .from('regional meetings')
        .update({ [updateField]: null })
        .eq('id', meetingId);
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
    // const meetingId = query.get("id");

    const [isAdmin, setIsAdmin] = useState(false);
    const canEdit = isAdmin;

    const [meetingData, setMeetingData] = useState(null);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [editForm, setEditForm] = useState(null);
    const [saving, setSaving] = useState(false);
    const [previewingPdf, setPreviewingPdf] = useState(null);
    const [formRequired, setFormRequired] = useState({
        editTitle: "",
        editDate: "",
    });

    // Parse date to YYYY/MM/DD format
    function parseDateFormat(dateStr) {
        if (!dateStr) return '';

        // handle already-correct format
        if (dateStr.match(/^\d{4}\/\d{2}\/\d{2}$/)) {
            return dateStr;
        }

        // SAFE local date parsing (prevents +1 day bug)
        const parts = dateStr.split(/[-\/]/);
        if (parts.length === 3) {
            const year = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1;
            const day = parseInt(parts[2]);
            const date = new Date(year, month, day); // LOCAL time

            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            return `${y}/${m}/${d}`;
        }

        return '';
    }

    // Convert YYYY/MM/DD to input date value (YYYY-MM-DD)
    function toInputDateFormat(dateStr) {
        if (!dateStr) return '';
        return dateStr.replace(/\//g, '-');
    }

    // Convert input date value (YYYY-MM-DD) to YYYY/MM/DD
    function fromInputDateFormat(dateStr) {
        if (!dateStr) return '';
        return dateStr.replace(/-/g, '/');
    }

    // Fetch meeting from database
    useEffect(() => {
        async function loadMeeting() {
            setLoading(true);

            if (meetingDate && regionName) {
                const data = await getMeetingByDateUrl(regionName, meetingDate);
                setMeetingData(data);

                if (data) {
                    const resourcesData = await getMeetingResources(data.id);
                    setResources(resourcesData);
                }
            }

            setLoading(false);
        }

        async function getIsAdmin(userId) {
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('role')
                    .eq("id", userId);
                if (data[0]) {
                    setIsAdmin(data[0].role == "admin");
                }
            } catch (error) {
                console.log("error");
            }
        }

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user.id) {
                getIsAdmin(session?.user.id);
            }
        });

        // Check current session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user.id) {
                getIsAdmin(session?.user.id);
            }
        });

        if (meetingDate && regionName) {
            loadMeeting();
        } else {
            setLoading(false);
        }

        return () => subscription.unsubscribe();
    }, [meetingDate, regionName]);

    const handleSaveEditMeeting = async (formData) => {
        if (!canEdit) {
            alert("You must be an admin and logged in to edit meetings.");
            return;
        }

        // Validate required fields
        const title = formData.get('title') || '';
        const date = formData.get('date') || '';

        const isRequired = {
            editTitle: !title.trim(),
            editDate: !date.trim(),
        };

        if (isRequired.editTitle || isRequired.editDate) {
            setFormRequired(prev => ({ ...prev, ...isRequired }));
            // Scroll to first error
            setTimeout(() => {
                const firstError = document.querySelector('.input-required');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
            return false;
        }

        if (saving || !meetingData?.id) return;
        setSaving(true);

        const extras = {
            region: meetingData.region,
            originalTitle: meetingData.name,
            agendaPdf: editForm?.agendaPdf,
            reportPdf: editForm?.reportPdf,
            deleteAgendaPdf: editForm?.deleteAgendaPdf,
            deleteReportPdf: editForm?.deleteReportPdf,
            existingAgendaPdfUrl: editForm?.existingAgendaPdfUrl,
            existingReportPdfUrl: editForm?.existingReportPdfUrl,
            allImages: editForm?.allImages || [],
            allVideos: editForm?.allVideos || [],
        };

        const result = await updateMeeting(meetingData.id, formData, extras);

        setSaving(false);

        if (result.error) {
            // Check for RLS policy violation
            if (result.error.message.includes('row-level security') || result.error.code === '42501') {
                alert('You must be an admin and logged in to edit meetings.');
            } else {
                alert('Error updating meeting: ' + result.error.message);
            }
            return;
        }

        setShowEditPopup(false);

        // If title changed, redirect to the new URL
        if (editForm && editForm.title !== meetingData.name) {
            const newDateUrl = result.data?.date_url;
            if (newDateUrl) {
                navigate(`/regional-meetings/${regionName}/${newDateUrl}`, { replace: true });
                return;
            }
        }

        // Refresh meeting data
        const data = await getMeetingById(meetingData.id);
        setMeetingData(data);

        if (data) {
            const resourcesData = await getMeetingResources(meetingId);
            setResources(resourcesData);
        }
    };

    const handleConfirmDeleteMeeting = async () => {
        if (!canEdit) {
            alert("You must be an admin and logged in to delete meetings.");
            return;
        }

        if (!meetingData?.id) return;

        const error = await deleteMeeting(meetingData.id);

        if (error) {
            // Check for RLS policy violation
            if (error.message.includes('row-level security') || error.code === '42501') {
                alert('You must be an admin and logged in to delete meetings.');
            } else {
                alert('Error deleting meeting: ' + error.message);
            }
            return;
        }

        // Navigate back to regional meetings list
        navigate(`/regional-meetings/${regionName}`);
    };

    const openEditPopup = () => {
        if (!canEdit) {
            alert("You must be an admin and logged in to edit meetings.");
            return;
        }

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
                date: parseDateFormat(meetingData.date) || '',
                location: meetingData.location || '',
                description: meetingData.description || '',
                agendaLink: meetingData.agenda_url || '',
                reportLink: meetingData.meeting_report_url || '',
                agendaPdf: null,
                reportPdf: null,
                existingAgendaPdfUrl: meetingData.agenda_pdf_url || null,
                existingReportPdfUrl: meetingData.meeting_report_pdf_url || null,
                deleteAgendaPdf: false,
                deleteReportPdf: false,
                allImages,
                allVideos,
            });

            // Reset form required state
            setFormRequired({ editTitle: "", editDate: "" });
        }
        setShowEditPopup(true);
    };

    // Check empty and update required state
    function checkEmpty(value, inputName) {
        const updatedFormRequired = { ...formRequired };
        updatedFormRequired[inputName] = value === "" || value === null;
        setFormRequired(updatedFormRequired);
    }

    // Filter resources by type
    const images = resources.filter(r => r.resource_type === 'image');
    const videos = resources.filter(r => r.resource_type === 'video');

    const hasDescription = !!meetingData?.description?.trim();

    const hasReportSection =
        meetingData?.agenda_url ||
        meetingData?.agenda_pdf_url ||
        meetingData?.meeting_report_url ||
        meetingData?.meeting_report_pdf_url;

    const hasGallerySection =
        images.length > 0 || videos.length > 0;

    const sections = [hasDescription, hasReportSection, hasGallerySection].filter(Boolean).length;

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
                <div className="grid gap-4">
                    <div>
                        <label>Region:</label>
                        <p className="inline-block pl-1">{meetingData.region}</p>
                    </div>
                    <div>
                        <label>Title:</label>
                        <input name="title" className={"input input-text w-full " + (formRequired?.editTitle && "input-required")} type="text" placeholder="Title" value={editForm?.title || ''} onChange={e => { setEditForm({ ...editForm, title: e.target.value }); checkEmpty(e.target.value, "editTitle"); }} />
                        <div className="input-error">This field is required.</div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label>Date:</label>
                            <input name="date" className={"input input-text w-full " + (formRequired?.editDate && "input-required")} type="date" value={toInputDateFormat(editForm?.date)} onChange={e => { setEditForm({ ...editForm, date: fromInputDateFormat(e.target.value) }); checkEmpty(e.target.value, "editDate"); }} />
                            <div className="input-error">This field is required.</div>
                        </div>
                        <div>
                            <label>Location:</label>
                            <input name="location" className="input input-text w-full" type="text" placeholder="Location" value={editForm?.location || ''} onChange={e => setEditForm({ ...editForm, location: e.target.value })} />
                        </div>
                    </div>
                </div>
                <label>Description:</label>
                <textarea name="description" className="input input-text w-full" placeholder="Description" value={editForm?.description || ''} onChange={e => setEditForm({ ...editForm, description: e.target.value })} rows="12" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label>Agenda Link:</label>
                    <input name="agendaLink" className="input input-text w-full" type="text" placeholder="Agenda Link" value={editForm?.agendaLink || ''} onChange={e => setEditForm({ ...editForm, agendaLink: e.target.value })} />
                </div>
                <div>
                    <label>Meeting Report Link:</label>
                    <input name="reportLink" className="input input-text w-full" type="text" placeholder="Meeting Report Link" value={editForm?.reportLink || ''} onChange={e => setEditForm({ ...editForm, reportLink: e.target.value })} />
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label>Agenda PDF:</label>
                    {editForm?.existingAgendaPdfUrl && !editForm?.deleteAgendaPdf && !editForm?.agendaPdf ? (
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-dark truncate flex-1 input input-text w-full py-1">
                                {editForm.existingAgendaPdfUrl.split('/').pop()}
                            </span>
                            <button
                                type="button"
                                className="text-red-600 cursor-pointer shrink-0"
                                title="Remove PDF"
                                onClick={() => setEditForm({ ...editForm, deleteAgendaPdf: true })}
                            >
                                <i className="bi bi-trash"></i>
                            </button>
                        </div>
                    ) : editForm?.deleteAgendaPdf ? (
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-dark italic flex-1">PDF will be deleted on save.</span>
                            <button type="button" className="text-sm text-primary-dark cursor-pointer" onClick={() => setEditForm({ ...editForm, deleteAgendaPdf: false })}>Undo</button>
                        </div>
                    ) : null}
                    {(!editForm?.existingAgendaPdfUrl || editForm?.deleteAgendaPdf || editForm?.agendaPdf) && (
                        <div className="flex items-center gap-2 mt-1">
                            <input name="agendaPdf" className="w-full" type="file" accept=".pdf" onChange={e => setEditForm({ ...editForm, agendaPdf: e.target.files[0], deleteAgendaPdf: false })} />
                            {editForm?.agendaPdf && (
                                <button type="button" className="text-red-600 cursor-pointer shrink-0" onClick={() => setEditForm({ ...editForm, agendaPdf: null })}><i className="bi bi-x-lg"></i></button>
                            )}
                        </div>
                    )}
                </div>
                <div>
                    <label>Meeting Report PDF:</label>
                    {editForm?.existingReportPdfUrl && !editForm?.deleteReportPdf && !editForm?.reportPdf ? (
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-dark truncate flex-1 input input-text w-full py-1">
                                {editForm.existingReportPdfUrl.split('/').pop()}
                            </span>
                            <button
                                type="button"
                                className="text-red-600 cursor-pointer shrink-0"
                                title="Remove PDF"
                                onClick={() => setEditForm({ ...editForm, deleteReportPdf: true })}
                            >
                                <i className="bi bi-trash"></i>
                            </button>
                        </div>
                    ) : editForm?.deleteReportPdf ? (
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-dark italic flex-1">PDF will be deleted on save.</span>
                            <button type="button" className="text-sm text-primary-dark cursor-pointer" onClick={() => setEditForm({ ...editForm, deleteReportPdf: false })}>Undo</button>
                        </div>
                    ) : null}
                    {(!editForm?.existingReportPdfUrl || editForm?.deleteReportPdf || editForm?.reportPdf) && (
                        <div className="flex items-center gap-2 mt-1">
                            <input name="reportPdf" className="w-full" type="file" accept=".pdf" onChange={e => setEditForm({ ...editForm, reportPdf: e.target.files[0], deleteReportPdf: false })} />
                            {editForm?.reportPdf && (
                                <button type="button" className="text-red-600 cursor-pointer shrink-0" onClick={() => setEditForm({ ...editForm, reportPdf: null })}><i className="bi bi-x-lg"></i></button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div>
                <label>Photos:</label>
                <input className="w-full" type="file" multiple accept="image/*" onChange={e => {
                    const files = Array.from(e.target.files);
                    const newImages = files.map(f => ({ file: f, url: URL.createObjectURL(f), isNew: true }));
                    setEditForm({ ...editForm, allImages: [...(editForm?.allImages || []), ...newImages] });
                    e.target.value = '';
                }} />
                {(editForm?.allImages || []).length > 0 && (
                    <div className="mt-2">
                        <p className="font-bold">Photos (click arrows to reorder, trash to delete):</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {editForm.allImages.map((img, idx) => img.toDelete ? null : (
                                <div key={img.id || `new-${idx}`} className="relative p-2" style={{ border: '2px solid var(--color-primary-dark)', borderRadius: 'var(--radius-md)' }}>
                                    <img src={img.resource_url || img.url} className="w-24 h-24 object-contain" />
                                    <div className="absolute top-1 left-1 flex gap-1">
                                        <button
                                            type="button"
                                            className="text-xs bg-white rounded-full p-1 cursor-pointer hover:bg-gray-200"
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
                                            className="text-xs bg-white rounded-full p-1 cursor-pointer hover:bg-gray-200"
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
                                        className="absolute top-1 right-1 text-red-600 bg-white rounded-full p-1 cursor-pointer"
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
                                        <i className="bi bi-trash"></i>
                                    </button>
                                    <span className="absolute bottom-1 left-1 bg-black/50 rounded-md text-white text-xs p-1">{idx + 1}</span>
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
                    e.target.value = '';
                }} />
                {(editForm?.allVideos || []).length > 0 && (
                    <div className="mt-2">
                        <p className="font-bold">Videos (click arrows to reorder, trash to delete):</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {editForm.allVideos.map((vid, idx) => vid.toDelete ? null : (
                                <div key={vid.id || `new-${idx}`} className="relative p-2" style={{ border: '2px solid var(--color-primary-dark)', borderRadius: 'var(--radius-md)' }}>
                                    <video src={vid.resource_url || vid.url} className="w-24 h-24 object-contain" />
                                    <div className="absolute top-1 left-1 flex gap-1">
                                        <button
                                            type="button"
                                            className="text-xs bg-white rounded-full p-1 cursor-pointer hover:bg-gray-200"
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
                                            className="text-xs bg-white rounded-full p-1 cursor-pointer hover:bg-gray-200"
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
                                        className="absolute top-1 right-1 text-red-600 bg-white rounded-full p-1 cursor-pointer"
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
                                        <i className="bi bi-trash"></i>
                                    </button>
                                    <span className="absolute bottom-1 left-1 bg-black/50 rounded-md text-white text-xs p-1">{idx + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );

    const deletePopupContent = (
        <div className="text-center py-4">
            <p>Are you sure you want to delete this meeting?</p>
            <p className="mt-2">This action cannot be undone.</p>
        </div>
    );

    function Carousel({ images }) {
        const [current, setCurrent] = useState(0);
        const [animating, setAnimating] = useState(false);
        const [direction, setDirection] = useState(null); // 'next' | 'prev'
        const [displayed, setDisplayed] = useState(0);

        if (images.length === 0) {
            return <div className="aspect-video max-w-2xl mx-auto bg-gray-light flex items-center justify-center text-gray-500">No images available</div>;
        }

        const go = (dir) => {
            if (animating) return;
            setDirection(dir);
            setAnimating(true);
            setTimeout(() => {
                const next = dir === 'next'
                    ? (current + 1) % images.length
                    : (current - 1 + images.length) % images.length;
                setCurrent(next);
                setDisplayed(next);
                setAnimating(false);
            }, 220);
        };

        const slideOutClass = animating
            ? (direction === 'next' ? 'carousel-exit-left' : 'carousel-exit-right')
            : '';

        return (
            <>
                <style>{`
                    @keyframes carouselExitLeft {
                        from { opacity: 1; transform: translateX(0); }
                        to   { opacity: 0; transform: translateX(-48px); }
                    }
                    @keyframes carouselExitRight {
                        from { opacity: 1; transform: translateX(0); }
                        to   { opacity: 0; transform: translateX(48px); }
                    }
                    @keyframes carouselEnterLeft {
                        from { opacity: 0; transform: translateX(-48px); }
                        to   { opacity: 1; transform: translateX(0); }
                    }
                    @keyframes carouselEnterRight {
                        from { opacity: 0; transform: translateX(48px); }
                        to   { opacity: 1; transform: translateX(0); }
                    }
                    .carousel-exit-left  { animation: carouselExitLeft  0.22s ease forwards; }
                    .carousel-exit-right { animation: carouselExitRight 0.22s ease forwards; }
                    .carousel-enter-left  { animation: carouselEnterLeft  0.22s ease forwards; }
                    .carousel-enter-right { animation: carouselEnterRight 0.22s ease forwards; }
                `}</style>
                <div className="relative aspect-video max-w-2xl mx-auto bg-gray-900 overflow-hidden">
                    <button
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl z-10 cursor-pointer"
                        style={{ color: 'var(--color-zinc-400)', transition: 'color 0.2s, transform 0.2s', transform: 'translateY(-50%)' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-zinc-50)'; e.currentTarget.style.transform = 'translateY(-50%) translateX(-3px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-zinc-400)'; e.currentTarget.style.transform = 'translateY(-50%) translateX(0)'; }}
                        onClick={() => go('prev')}
                    >
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    <img
                        key={current}
                        src={images[current].resource_url}
                        className={`w-full h-full object-contain ${animating ? (direction === 'next' ? 'carousel-exit-left' : 'carousel-exit-right') : (direction ? (direction === 'next' ? 'carousel-enter-right' : 'carousel-enter-left') : '')}`}
                    />
                    <div className="absolute bottom-4 left-4 text-white text-xs p-2 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        Photo {current + 1} of {images.length}
                    </div>
                    <button
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl z-10 cursor-pointer"
                        style={{ color: 'var(--color-zinc-400)', transition: 'color 0.2s, transform 0.2s', transform: 'translateY(-50%)' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-zinc-50)'; e.currentTarget.style.transform = 'translateY(-50%) translateX(3px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-zinc-400)'; e.currentTarget.style.transform = 'translateY(-50%) translateX(0)'; }}
                        onClick={() => go('next')}
                    >
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>
                {images[current].caption && (
                    <p className="mt-3 text-xs text-gray-dark/70">{images[current].caption}</p>
                )}
            </>
        );
    }

    return (
        <>
            <PopupForm id="edit-meeting-detail" className="md:w-[70vw] relative" show={showEditPopup} setShow={(v) => {
                if (!v) {
                    setFormRequired({ editTitle: "", editDate: "" });
                }
                setShowEditPopup(v);
            }} validate={handleSaveEditMeeting}>
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
                {sections === 0 && (
                    <div className="flex items-center justify-center h-96 text-gray-400 text-xl text-center">
                        There is no content for this meeting yet.
                    </div>
                )}
                {hasDescription && (
                    <>
                        <p>{meetingData.description}</p>
                        {(hasReportSection || hasGallerySection) && <Break />}
                    </>
                )}
                {hasReportSection && (
                    <>
                        {(meetingData.meeting_report_url || meetingData.meeting_report_pdf_url) && (
                            <div className="mt-5">
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
                            <div className="mt-5">
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
                        {hasGallerySection && <Break />}
                    </>
                )}

                {hasGallerySection && (
                    <>
                        {/* {(meetingData.meeting_report_url || meetingData.meeting_report_pdf_url || meetingData.agenda_url || meetingData.agenda_pdf_url) && <Break />} */}
                        {(images.length > 0 || videos.length > 0) && (
                            <div className="mt-5">
                                <h1 className="text-center">Gallery</h1>
                                {images.length > 0 && (
                                    <div className="mt-6">
                                        <Carousel images={images} />
                                    </div>
                                )}
                                {videos.length > 0 && (
                                    <div className="mt-6 flex flex-wrap gap-4">
                                        {videos.map((vid, idx) => (
                                            <video key={idx} src={vid.resource_url} controls controlsList="nodownload" className="w-full md:w-[calc(50%-8px)] h-64 object-cover" />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
            <Footer />
        </>
    );
}