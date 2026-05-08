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

async function getMeetingThumbnail(meetingId) {
    const { data, error } = await supabase
        .from('regional meetings resources')
        .select('resource_url')
        .eq('regional_meeting_id', meetingId)
        .eq('resource_type', 'image')
        .order('sort_order', { ascending: true })
        .limit(1);

    if (error || !data || data.length === 0) {
        return null;
    }
    return data[0].resource_url;
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

async function createMeeting(formData, extras = {}) {
    const title = (formData.get('title') || '').toString().trim() || 'Untitled Meeting';
    // const dateUrl = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    // Get unique date_url based on region and title (adds number prefix if there are same-region same-name meetings)
    const dateUrl = await getUniqueDateUrl(extras.region || formData.get('region'), title);

    const meetingData = {
        name: title,
        region: formData.get('region') || extras.region || '',
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
        if (extras.allImages) {
            for (let i = 0; i < extras.allImages.length; i++) {
                const img = extras.allImages[i];
                if (img.file) {
                    await uploadResource(meetingId, img.file, 'image', i);
                }
            }
        }

        // Upload videos
        if (extras.allVideos) {
            for (let i = 0; i < extras.allVideos.length; i++) {
                const vid = extras.allVideos[i];
                if (vid.file) {
                    await uploadResource(meetingId, vid.file, 'video', i);
                }
            }
        }
    }

    return { data: data[0], error: null };
}

async function updateMeeting(meetingId, formData, extras = {}) {
    const title = (formData.get('title') || '').toString().trim() || 'Untitled Meeting';
    // const dateUrl = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    // Get unique date_url, passing the current meeting ID to exclude it from collision check
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
        // Upload agenda PDF if provided
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

        // IMAGES (existing + new + reordered + deleted)
        if (extras.allImages) {
            for (let i = 0; i < extras.allImages.length; i++) {
                const img = extras.allImages[i];

                if (img.toDelete && img.id) {
                    await supabase
                        .from('regional meetings resources')
                        .delete()
                        .eq('id', img.id);

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

        // VIDEOS (same logic)
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
    // Delete all files from storage using prefix matching (more reliable)
    const prefixes = [
        `regional-meeting-resources/${meetingId}`,
        `regional-meetings-pdfs/${meetingId}`,
    ];

    for (const prefix of prefixes) {
        const { data: files } = await supabase.storage
            .from('regional-meetings-resources')
            .list(prefix, { limit: 1000 });

        if (files?.length) {
            const paths = files.map(f => `${prefix}/${f.name}`);
            await supabase.storage
                .from('regional-meetings-resources')
                .remove(paths);
        }
    }

    // Delete resource records from database
    await supabase
        .from('regional meetings resources')
        .delete()
        .eq('regional_meeting_id', meetingId);

    // Delete the meeting
    const { error } = await supabase
        .from('regional meetings')
        .delete()
        .eq('id', meetingId);

    return error;
}

async function uploadPdf(meetingId, type, file) {
    // Delete existing PDF if it exists
    const meeting = await getMeetingResources(meetingId);
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

export default function RegionalMeeting() {
    const { regionName } = useParams();
    const navigate = useNavigate();
    const region = regionalData[regionName];
    const [isAdmin, setIsAdmin] = useState(false);
    const canEdit = isAdmin;

    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [thumbnails, setThumbnails] = useState({});

    // Fetch meetings from database
    useEffect(() => {
        async function loadMeetings() {
            setLoading(true);
            const data = await getMeetingsByRegion(regionName);
            setMeetings(data);

            // Fetch thumbnails for each meeting
            const thumbs = {};
            for (const mtg of data) {
                thumbs[mtg.id] = await getMeetingThumbnail(mtg.id);
            }
            setThumbnails(thumbs);

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

        if (regionName) {
            loadMeetings();
        }

        return () => subscription.unsubscribe();
    }, [regionName]);

    if (!region) {
        return (
            <>
                <Menu currentEndUrl="/regional-meetings" />
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
        allImages: [],
        allVideos: []
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
    const [formRequired, setFormRequired] = useState({
        addTitle: "",
        addDate: "",
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

    const openEditMeeting = async (meeting) => {
        if (!canEdit) {
            alert("You must be an admin and logged in to edit meetings.");
            return;
        }

        const resources = await getMeetingResources(meeting.id);

        const allImages = resources
            .filter(r => r.resource_type === 'image')
            .sort((a, b) => a.sort_order - b.sort_order);

        const allVideos = resources
            .filter(r => r.resource_type === 'video')
            .sort((a, b) => a.sort_order - b.sort_order);

        setEditingMeeting(meeting);
        setEditForm({
            region: meeting.region || regionName,
            title: meeting.name || '',
            date: parseDateFormat(meeting.date) || '',
            location: meeting.location || '',
            description: meeting.description || '',
            agendaLink: meeting.agenda_url || '',
            reportLink: meeting.meeting_report_url || '',
            agendaPdf: null,
            reportPdf: null,
            existingAgendaPdfUrl: meeting.agenda_pdf_url || null,
            existingReportPdfUrl: meeting.meeting_report_pdf_url || null,
            deleteAgendaPdf: false,
            deleteReportPdf: false,
            allImages,
            allVideos,
        });

        setShowEditMeetingFormPopup(true);
    };

    const openDeleteMeeting = (meeting) => {
        setDeleteMeetingId(meeting.id);
        setShowDeleteMeetingPopup(true);
    };

    const handleSaveAddMeeting = async (formData) => {
        if (!canEdit) {
            alert("You must be an admin and logged in to add meetings.");
            return false;
        }

        // Validate required fields
        const title = formData.get('title') || '';
        const date = formData.get('date') || '';

        const isRequired = {
            addTitle: !title.trim(),
            addDate: !date.trim(),
        };

        if (isRequired.addTitle || isRequired.addDate) {
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

        if (saving) return;
        setSaving(true);

        const extras = {
            agendaPdf: addForm.agendaPdf,
            reportPdf: addForm.reportPdf,
            allImages: addForm.allImages,
            allVideos: addForm.allVideos,
            region: addForm.region,
        };

        const result = await createMeeting(formData, extras);

        setSaving(false);

        if (result.error) {
            // Check for RLS policy violation
            if (result.error.message.includes('row-level security') || result.error.code === '42501') {
                alert('You must be an admin and logged in to add meetings.');
            } else {
                alert('Error creating meeting: ' + result.error.message);
            }
            return;
        }

        setAddForm(initialMeetingForm);
        setShowAddMeetingFormPopup(false);

        // Refresh meetings list
        const data = await getMeetingsByRegion(regionName);
        setMeetings(data);
    };

    const handleSaveEditMeeting = async (formData) => {
        if (!canEdit) {
            alert("You must be an admin and logged in to edit meetings.");
            return true;
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
            return;
        }

        if (saving || !editingMeeting) return;
        setSaving(true);

        const extras = {
            region: editForm.region,
            originalTitle: editingMeeting.name,
            agendaPdf: editForm.agendaPdf,
            reportPdf: editForm.reportPdf,
            deleteAgendaPdf: editForm.deleteAgendaPdf,
            deleteReportPdf: editForm.deleteReportPdf,
            existingAgendaPdfUrl: editForm.existingAgendaPdfUrl,
            existingReportPdfUrl: editForm.existingReportPdfUrl,
            allImages: editForm.allImages,
            allVideos: editForm.allVideos,
        };

        const result = await updateMeeting(editingMeeting.id, formData, extras);

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

        setEditingMeeting(null);
        setShowEditMeetingFormPopup(false);

        // Refresh meetings list
        const data = await getMeetingsByRegion(regionName);
        setMeetings(data);
    };

    const handleDeleteMeeting = async () => {
        if (!canEdit) {
            alert("You must be an admin and logged in to delete meetings.");
            return;
        }

        if (!deleteMeetingId) return;

        const error = await deleteMeeting(deleteMeetingId);

        if (error) {
            // Check for RLS policy violation
            if (error.message.includes('row-level security') || error.code === '42501') {
                alert('You do not have permission to delete this meeting. Please contact an administrator.');
            } else {
                alert('Error deleting meeting: ' + error.message);
            }
            return;
        }

        setDeleteMeetingId(null);
        setShowDeleteMeetingPopup(false);

        // Refresh meetings list
        const data = await getMeetingsByRegion(regionName);
        setMeetings(data);
    };

    // Reset form required state when opening popup
    function handleShowAddMeetingForm() {
        if (!canEdit) {
            alert("You must be an admin and logged in to add meetings.");
            return;
        }

        setFormRequired(prev => ({ ...prev, addTitle: "", addDate: "" }));
        resetAddForm();
        setShowAddMeetingFormPopup(true);
    }

    // Check empty and update required state
    function checkEmpty(value, inputName) {
        const updatedFormRequired = { ...formRequired };
        updatedFormRequired[inputName] = value === "" || value === null;
        setFormRequired(updatedFormRequired);
    }

    const resetAddForm = () => {
        setAddForm({ ...initialMeetingForm, region: regionName });
    };

    const mainPopupButtons = [
        { text: "Add Meeting", onclick: () => { handleShowAddMeetingForm(); } },
    ];

    return (
        <>
            <Popup id="edit-meetings" show={showEditMeetingsPopup} setShow={(v) => {
                if (!v) {
                    setFormRequired({ editTitle: "", editDate: "" });
                }
                setShowEditMeetingsPopup(v);
            }} buttons={mainPopupButtons}>
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
                        <div>
                            <label>Region:</label>
                            {/* <select name="region" className="input input-text w-full" value={addForm.region} onChange={e => setAddForm({ ...addForm, region: e.target.value })}>
                                {regions.map(r => <option key={r} value={r}>{r}</option>)}
                            </select> */}
                            <p className="inline-block pl-1">{addForm.region}</p>
                        </div>
                        <div>
                            <label>Title:</label>
                            <input name="title" className={"input input-text w-full " + (formRequired?.addTitle && "input-required")} type="text" placeholder="Title" value={addForm.title} onChange={e => { setAddForm({ ...addForm, title: e.target.value }); checkEmpty(e.target.value, "addTitle"); }} />
                            <div className="input-error">This field is required.</div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label>Date:</label>
                                <input name="date" className={"input input-text w-full " + (formRequired?.addDate && "input-required")} type="date" placeholder="Date" value={toInputDateFormat(addForm.date)} onChange={e => { setAddForm({ ...addForm, date: fromInputDateFormat(e.target.value) }); checkEmpty(e.target.value, "addDate"); }} />
                                <div className="input-error">This field is required.</div>
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
                                <input name="agendaLink" className="input input-text w-full" type="text" placeholder="https://drive.google.com/file/d/.../preview" value={addForm.agendaLink} onChange={e => setAddForm({ ...addForm, agendaLink: e.target.value })} />
                            </div>
                            <div>
                                <label>Meeting Report Link:</label>
                                <input name="reportLink" className="input input-text w-full" type="text" placeholder="https://drive.google.com/file/d/.../preview" value={addForm.reportLink} onChange={e => setAddForm({ ...addForm, reportLink: e.target.value })} />
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
                                const newImages = files.map(f => ({
                                    file: f,
                                    url: URL.createObjectURL(f),
                                    isNew: true,
                                }));
                                setAddForm({
                                    ...addForm,
                                    allImages: [...addForm.allImages, ...newImages],
                                });
                                e.target.value = '';
                            }} />
                            {addForm.allImages.filter(img => !img.toDelete).length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {addForm.allImages.map((img, idx) => img.toDelete ? null : (
                                        <div key={idx} className="relative p-2" style={{ border: '2px solid var(--color-primary-dark)', borderRadius: 'var(--radius-md)' }}>
                                            <img src={img.url || img.resource_url} className="w-24 h-24 object-contain" />

                                            {/* reorder */}
                                            <div className="absolute top-1 left-1 flex gap-1">
                                                <button type="button" className="text-xs bg-white rounded-full p-1 cursor-pointer hover:bg-gray-200" onClick={() => {
                                                    if (idx === 0) return;
                                                    const updated = [...addForm.allImages];
                                                    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
                                                    setAddForm({ ...addForm, allImages: updated });
                                                }} disabled={idx === 0}><i className="bi bi-arrow-left"></i></button>

                                                <button type="button" className="text-xs bg-white rounded-full p-1 cursor-pointer hover:bg-gray-200" onClick={() => {
                                                    if (idx === addForm.allImages.length - 1) return;
                                                    const updated = [...addForm.allImages];
                                                    [updated[idx + 1], updated[idx]] = [updated[idx], updated[idx + 1]];
                                                    setAddForm({ ...addForm, allImages: updated });
                                                }} disabled={idx === addForm.allImages.length - 1}><i className="bi bi-arrow-right"></i></button>
                                            </div>

                                            {/* delete */}
                                            <button
                                                type="button"
                                                className="absolute top-1 right-1 text-red-600 bg-white rounded-full p-1 cursor-pointer"
                                                onClick={() => {
                                                    if (img.isNew) {
                                                        setAddForm({ ...addForm, allImages: addForm.allImages.filter((_, i) => i !== idx) });
                                                    } else {
                                                        const updated = [...addForm.allImages];
                                                        updated[idx] = { ...updated[idx], toDelete: true };
                                                        setAddForm({ ...addForm, allImages: updated });
                                                    }
                                                }}>
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
                                const newVideos = files.map(f => ({
                                    file: f,
                                    url: URL.createObjectURL(f),
                                    isNew: true,
                                }));
                                setAddForm({
                                    ...addForm,
                                    allVideos: [...addForm.allVideos, ...newVideos]
                                });
                                e.target.value = '';
                            }} />
                            {addForm.allVideos.filter(v => !v.toDelete).length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {addForm.allVideos.map((vid, idx) => vid.toDelete ? null : (
                                        <div key={idx} className="relative p-2" style={{ border: '2px solid var(--color-primary-dark)', borderRadius: 'var(--radius-md)' }}>
                                            <video src={vid.url || vid.resource_url} className="w-24 h-24 object-contain" />

                                            {/* reorder */}
                                            <div className="absolute top-1 left-1 flex gap-1">
                                                <button type="button" className="text-xs bg-white rounded-full p-1 cursor-pointer hover:bg-gray-200" onClick={() => {
                                                    if (idx === 0) return;
                                                    const updated = [...addForm.allVideos];
                                                    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
                                                    setAddForm({ ...addForm, allVideos: updated });
                                                }} disabled={idx === 0}><i className="bi bi-arrow-left"></i></button>

                                                <button type="button" className="text-xs bg-white rounded-full p-1 cursor-pointer hover:bg-gray-200" onClick={() => {
                                                    if (idx === addForm.allVideos.length - 1) return;
                                                    const updated = [...addForm.allVideos];
                                                    [updated[idx + 1], updated[idx]] = [updated[idx], updated[idx + 1]];
                                                    setAddForm({ ...addForm, allVideos: updated });
                                                }} disabled={idx === addForm.allVideos.length - 1}><i className="bi bi-arrow-right"></i></button>
                                            </div>

                                            {/* delete */}
                                            <button
                                                type="button"
                                                className="absolute top-1 right-1 text-red-600 bg-white rounded-full p-1 cursor-pointer"
                                                onClick={() => {
                                                    if (vid.isNew) {
                                                        setAddForm({ ...addForm, allVideos: addForm.allVideos.filter((_, i) => i !== idx) });
                                                    } else {
                                                        const updated = [...addForm.allVideos];
                                                        updated[idx] = { ...updated[idx], toDelete: true };
                                                        setAddForm({ ...addForm, allVideos: updated });
                                                    }
                                                }}>
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

            <PopupForm id="edit-meeting" className="md:w-[70vw] relative" show={showEditMeetingFormPopup} setShow={(v) => {
                if (!v) {
                    setFormRequired({ editTitle: "", editDate: "" });
                }
                setShowEditMeetingFormPopup(v);
            }} validate={handleSaveEditMeeting} nested>
                <div className="space-y-4 p-4">
                    <h4>Edit Meeting</h4>
                    <div className="grid gap-4">
                        <div>
                            <label>Region:</label>
                            {/* <select name="region" className="input input-text w-full" value={editForm.region || editingMeeting?.region} onChange={e => setEditForm({ ...editForm, region: e.target.value })}>
                                {regions.map(r => <option key={r} value={r}>{r}</option>)}
                            </select> */}
                            <p className="inline-block pl-1">{editForm.region}</p>
                        </div>
                        <div>
                            <label>Title:</label>
                            <input name="title" className={"input input-text w-full " + (formRequired?.editTitle && "input-required")} type="text" placeholder="Title" value={editForm.title} onChange={e => { setEditForm({ ...editForm, title: e.target.value }); checkEmpty(e.target.value, "editTitle"); }} />
                            <div className="input-error">This field is required.</div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label>Date:</label>
                                <input name="date" className={"input input-text w-full " + (formRequired?.editDate && "input-required")} type="date" placeholder="Date" value={toInputDateFormat(editForm.date)} onChange={e => { setEditForm({ ...editForm, date: fromInputDateFormat(e.target.value) }); checkEmpty(e.target.value, "editDate"); }} />
                                <div className="input-error">This field is required.</div>
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
                                <input name="agendaLink" className="input input-text w-full" type="text" placeholder="https://drive.google.com/file/d/.../preview" value={editForm.agendaLink} onChange={e => setEditForm({ ...editForm, agendaLink: e.target.value })} />
                            </div>
                            <div>
                                <label>Meeting Report Link:</label>
                                <input name="reportLink" className="input input-text w-full" type="text" placeholder="https://drive.google.com/file/d/.../preview" value={editForm.reportLink} onChange={e => setEditForm({ ...editForm, reportLink: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label>Agenda PDF:</label>
                                {editForm.existingAgendaPdfUrl && !editForm.deleteAgendaPdf && !editForm.agendaPdf ? (
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
                                ) : editForm.deleteAgendaPdf ? (
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-sm text-gray-dark italic flex-1">PDF will be deleted on save.</span>
                                        <button type="button" className="text-sm text-primary-dark cursor-pointer" onClick={() => setEditForm({ ...editForm, deleteAgendaPdf: false })}>Undo</button>
                                    </div>
                                ) : null}
                                {(!editForm.existingAgendaPdfUrl || editForm.deleteAgendaPdf || editForm.agendaPdf) && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <input name="agendaPdf" className="w-full" type="file" accept=".pdf" onChange={e => setEditForm({ ...editForm, agendaPdf: e.target.files[0], deleteAgendaPdf: false })} />
                                        {editForm.agendaPdf && (
                                            <button type="button" className="text-red-600 cursor-pointer shrink-0" onClick={() => setEditForm({ ...editForm, agendaPdf: null })}><i className="bi bi-x-lg"></i></button>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label>Meeting Report PDF:</label>
                                {editForm.existingReportPdfUrl && !editForm.deleteReportPdf && !editForm.reportPdf ? (
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
                                ) : editForm.deleteReportPdf ? (
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-sm text-gray-dark italic flex-1">PDF will be deleted on save.</span>
                                        <button type="button" className="text-sm text-primary-dark cursor-pointer" onClick={() => setEditForm({ ...editForm, deleteReportPdf: false })}>Undo</button>
                                    </div>
                                ) : null}
                                {(!editForm.existingReportPdfUrl || editForm.deleteReportPdf || editForm.reportPdf) && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <input name="reportPdf" className="w-full" type="file" accept=".pdf" onChange={e => setEditForm({ ...editForm, reportPdf: e.target.files[0], deleteReportPdf: false })} />
                                        {editForm.reportPdf && (
                                            <button type="button" className="text-red-600 cursor-pointer shrink-0" onClick={() => setEditForm({ ...editForm, reportPdf: null })}><i className="bi bi-x-lg"></i></button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label>Photos (upload new photos):</label>
                            <input className="w-full" type="file" multiple accept="image/*" onChange={e => {
                                const files = Array.from(e.target.files);
                                const newImages = files.map(f => ({
                                    file: f,
                                    url: URL.createObjectURL(f),
                                    isNew: true,
                                }));
                                setEditForm({
                                    ...editForm,
                                    allImages: [...editForm.allImages, ...newImages]
                                });
                                e.target.value = '';
                            }} />
                            {editForm.allImages.filter(img => !img.toDelete).length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {editForm.allImages.map((img, idx) => img.toDelete ? null : (
                                        <div key={idx} className="relative p-2" style={{ border: '2px solid var(--color-primary-dark)', borderRadius: 'var(--radius-md)' }}>
                                            <img src={img.url || img.resource_url} className="w-24 h-24 object-contain" />

                                            {/* reorder */}
                                            <div className="absolute top-1 left-1 flex gap-1">
                                                <button type="button" className="text-xs bg-white rounded-full p-1 cursor-pointer hover:bg-gray-200" onClick={() => {
                                                    if (idx === 0) return;
                                                    const updated = [...editForm.allImages];
                                                    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
                                                    setEditForm({ ...editForm, allImages: updated });
                                                }} disabled={idx === 0}><i className="bi bi-arrow-left"></i></button>

                                                <button type="button" className="text-xs bg-white rounded-full p-1 cursor-pointer hover:bg-gray-200" onClick={() => {
                                                    if (idx === editForm.allImages.length - 1) return;
                                                    const updated = [...editForm.allImages];
                                                    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
                                                    setEditForm({ ...editForm, allImages: updated });
                                                }} disabled={idx === editForm.allImages.length - 1}><i className="bi bi-arrow-right"></i></button>
                                            </div>

                                            {/* delete */}
                                            <button
                                                type="button"
                                                className="absolute top-1 right-1 text-red-600 bg-white rounded-full p-1 cursor-pointer"
                                                onClick={() => {
                                                    if (img.isNew) {
                                                        setEditForm({ ...editForm, allImages: editForm.allImages.filter((_, i) => i !== idx) });
                                                    } else {
                                                        const updated = [...editForm.allImages];
                                                        updated[idx] = { ...updated[idx], toDelete: true };
                                                        setEditForm({ ...editForm, allImages: updated });
                                                    }
                                                }}>
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
                                const newVideos = files.map(f => ({
                                    file: f,
                                    url: URL.createObjectURL(f),
                                    isNew: true,
                                }));
                                setEditForm({
                                    ...editForm,
                                    allVideos: [...editForm.allVideos, ...newVideos]
                                });
                                e.target.value = '';
                            }} />
                            {editForm.allVideos.filter(v => !v.toDelete).length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {editForm.allVideos.map((vid, idx) => vid.toDelete ? null : (
                                        <div key={idx} className="relative p-2" style={{ border: '2px solid var(--color-primary-dark)', borderRadius: 'var(--radius-md)' }}>
                                            <video src={vid.url || vid.resource_url} className="w-24 h-24 object-contain" />

                                            {/* reorder */}
                                            <div className="absolute top-1 left-1 flex gap-1">
                                                <button type="button" className="text-xs bg-white rounded-full p-1 cursor-pointer hover:bg-gray-200" onClick={() => {
                                                    if (idx === 0) return;
                                                    const updated = [...editForm.allVideos];
                                                    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
                                                    setEditForm({ ...editForm, allVideos: updated });
                                                }} disabled={idx === 0}><i className="bi bi-arrow-left"></i></button>

                                                <button type="button" className="text-xs bg-white rounded-full p-1 cursor-pointer hover:bg-gray-200" onClick={() => {
                                                    if (idx === editForm.allVideos.length - 1) return;
                                                    const updated = [...editForm.allVideos];
                                                    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
                                                    setEditForm({ ...editForm, allVideos: updated });
                                                }} disabled={idx === editForm.allVideos.length - 1}><i className="bi bi-arrow-right"></i></button>
                                            </div>

                                            {/* delete */}
                                            <button
                                                type="button"
                                                className="absolute top-1 right-1 text-red-600 bg-white rounded-full p-1 cursor-pointer"
                                                onClick={() => {
                                                    if (vid.isNew) {
                                                        setEditForm({ ...editForm, allVideos: editForm.allVideos.filter((_, i) => i !== idx) });
                                                    } else {
                                                        const updated = [...editForm.allVideos];
                                                        updated[idx] = { ...updated[idx], toDelete: true };
                                                        setEditForm({ ...editForm, allVideos: updated });
                                                    }
                                                }}>
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

            <Popup id="delete-meeting" show={showDeleteMeetingPopup} setShow={setShowDeleteMeetingPopup} stayOnBlur={true} nested buttons={[{ text: "Delete", onclick: handleDeleteMeeting }]}>
                <div className="text-center py-4">
                    <p>Are you sure you want to delete this meeting?</p>
                    <p className="mt-2">This action cannot be undone.</p>
                </div>
            </Popup>
            <Menu currentEndUrl="/regional-meetings" />
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
                    {canEdit && <button className="button button-light" onClick={() => { setShowEditMeetingsPopup(true); }}>Edit Meetings <i className="bi bi-pencil ml-1"></i></button>}
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
                                    {/* <Link to={`/regional-meetings/${regionName}/${mtg.date_url}?id=${mtg.id}`}> */}
                                    <Link to={`/regional-meetings/${regionName}/${mtg.date_url}`}>
                                        <h2>{mtg.name}</h2>
                                    </Link>
                                    <div>
                                        <span className="font-bold">{mtg.date}</span>
                                        <span className="font-bold ml-4">{mtg.location}</span>
                                    </div>
                                    <p className="mt-2">{mtg.description}</p>
                                    <div className="meeting-buttons">
                                        {mtg.agenda_url && (
                                            <a href={mtg.agenda_url} className="button">
                                                Agenda <i className="bi bi-box-arrow-up-right ml-2"></i>
                                            </a>
                                        )}
                                        {mtg.meeting_report_url && (
                                            <a href={mtg.meeting_report_url} className="button">
                                                Meeting Report <i className="bi bi-box-arrow-up-right ml-2"></i>
                                            </a>
                                        )}
                                    </div>
                                </div>
                                {/* <Link
                                    to={`/regional-meetings/${regionName}/${mtg.date_url}?id=${mtg.id}`}
                                    className="meeting-img"
                                    style={thumbnails[mtg.id] ? { backgroundImage: `url(${thumbnails[mtg.id]})` } : {}}
                                > */}
                                <Link
                                    to={`/regional-meetings/${regionName}/${mtg.date_url}`}
                                    className="meeting-img"
                                    style={thumbnails[mtg.id] ? { backgroundImage: `url(${thumbnails[mtg.id]})` } : {}}
                                >
                                    {!thumbnails[mtg.id] && (
                                        <div className="highlight-header relative bg-secondary-light grow h-full rounded-md overflow-hidden duration-200" style={{ minHeight: '200px' }}>
                                            <img className="absolute -bottom-30 -right-15 size-100" src="/assets/logo.svg" />
                                            <img className="disc absolute -top-20 -left-40 size-100 transform-[rotate(20deg)_rotateY(180deg)] opacity-30" src="/assets/landing-disc-4a.svg" />
                                        </div>
                                    )}
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <Footer />
        </>
    );
}