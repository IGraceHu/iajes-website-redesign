import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase";
import { Menu } from "../components/menu";
import { Banner } from "../components/graphics"
import { Footer } from "../components/footer";
import { Popup, PopupForm } from "../components/popup";
import { updateRequired } from "../helpers/form";
import "../styles/video-resources.css";

export function meta() {
    return [
        { title: "Video Resource" },
        // { name: "description", content: "Welcome to React Router!" },
    ];
}

async function getVideoResource(resourceId) {
    const { data, error } = await supabase
        .from('video resources')
        .select()
        .eq('id', resourceId)

    if (error) {
        console.error("Error fetching video resource:", error);
        return null;
    }

    return data ? data[0] : null;
}

async function deleteVideoResource(resourceId) {
    const response = await supabase
        .from('video resources')
        .delete()
        .eq('id', resourceId)
    return response;
}

async function updateVideoResource(resourceId, formData, existingData) {
    let thumbnailUrl = existingData.video_thumbnail;
    let speakerImgUrl = existingData.speaker_image;

    const thumbnailFile = formData.get("vid-resource-thumbnail");
    if (thumbnailFile && thumbnailFile.name && thumbnailFile.size > 0) {
        const path = `${Date.now()}-${thumbnailFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const { error: uploadError } = await supabase.storage
            .from('video-resources')
            .upload(path, thumbnailFile);

        if (uploadError) {
            console.error("Error uploading thumbnail:", uploadError);
            return uploadError;
        }

        const { data, error: urlError } = supabase.storage
            .from('video-resources')
            .getPublicUrl(path);

        if (urlError) {
            console.error("Error getting thumbnail URL:", urlError);
            return urlError;
        }

        thumbnailUrl = data.publicUrl;
    }

    const speakerImgFile = formData.get("vid-resource-speaker-img");
    if (speakerImgFile && speakerImgFile.name && speakerImgFile.size > 0) {
        const path = `${Date.now()}-${speakerImgFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const { error: uploadError } = await supabase.storage
            .from('video-resources')
            .upload(path, speakerImgFile);

        if (uploadError) {
            console.error("Error uploading speaker image:", uploadError);
            return uploadError;
        }

        const { data, error: urlError } = supabase.storage
            .from('video-resources')
            .getPublicUrl(path);

        if (urlError) {
            console.error("Error getting speaker image URL:", urlError);
            return urlError;
        }

        speakerImgUrl = data.publicUrl;
    }

    const { data, error } = await supabase
        .from('video resources')
        .update({
            title: formData.get("vid-resource-title"),
            video_url: formData.get("vid-resource-link"),
            date: formData.get("vid-resource-date"),
            video_thumbnail: thumbnailUrl,
            video_description: formData.get("vid-resource-desc"),
            speaker: formData.get("vid-resource-speaker-name"),
            speaker_university: formData.get("vid-resource-speaker-uni"),
            speaker_image: speakerImgUrl,
            speaker_details: formData.get("vid-resource-speaker-desc"),
        })
        .eq('id', resourceId)
        .select();

    if (error) {
        console.error("Database update error:", error);
        return error;
    }

    if (!data || data.length === 0) {
        const rlsError = new Error("No rows updated. You may be missing an UPDATE policy in Supabase.");
        console.error(rlsError.message);
        return rlsError;
    }

    return null;
}

export async function loader({ params }) {
    const vid = await getVideoResource(params.vidId);

    if (!vid) {
        throw new Response("Video resource not found", { status: 404 });
    }

    // Ensure expected arrays/fields exist to avoid runtime errors when mapping
    vid.title = vid.title || "";
    vid.date = (vid.date || "").replace(/-/g, '\/') || "";
    vid.speaker = vid.speaker || "";
    vid.speaker_university = vid.speaker_university || "";
    vid.speaker_details = vid.speaker_details || "";
    vid.speaker_image = (vid.speaker_image == "{}") ? null : vid.speaker_image;
    vid.video_url = vid.video_url || null;
    vid.video_thumbnail = (vid.video_thumbnail == "{}") ? null : vid.video_thumbnail;
    vid.video_description = vid.video_description || "";
    return vid;
}

export default function VideoResource({ loaderData }) {
    const navigate = useNavigate();
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    // EDIT LOGIC ADDITION
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showResolvePopup, setShowResolvePopup] = useState(false);
    const [formRequired, setFormRequired] = useState({
        vidResourceTitle: false,
        vidResourceLink: false,
        vidResourceSpeakerName: false
    });
    const [hasError, setHasError] = useState(false);

    async function validate(formData) {
        let isValidated = true;
        const isRequired = {
            vidResourceTitle: formData.get('vid-resource-title') === (null || ""),
            vidResourceLink: formData.get('vid-resource-link') === (null || ""),
            vidResourceSpeakerName: formData.get('vid-resource-speaker-name') === (null || "")
        }
        for (let value of Object.values(isRequired)) {
            if (value) {
                isValidated = false;
                break;
            }
        }
        if (!isValidated) {
            setFormRequired(isRequired);
            return false;
        }

        const updateError = await updateVideoResource(loaderData.id, formData, loaderData);
        if (updateError === null) {
            setShowResolvePopup(true);
        } else {
            console.error("Failed to update video resource:", updateError);
            setHasError(true);
        }
    }

    function handleShowEditPopupForm() {
        setFormRequired({
            vidResourceTitle: false,
            vidResourceLink: false,
            vidResourceSpeakerName: false
        });
        setHasError(false);
        setShowEditPopup(true);
    }

    function checkEmpty(value, inputName) {
        const updatedFormRequired = updateRequired(value, inputName, formRequired);
        if (updatedFormRequired != formRequired) {
            setFormRequired(updatedFormRequired);
        }
    }

    function closeResolvePopup() {
        setShowResolvePopup(false);
        setShowEditPopup(false);
        navigate(0);
    }

    useEffect(() => {
        const getIsAdmin = async (userId) => {
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('role')
                    .eq("id", userId);
                if (data[0]) {
                    setIsAdmin(data[0].role == "admin");
                }
                else { console.log("error"); }

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


        return () => subscription.unsubscribe();
    }, []);

    function handleDelete() {
        try {
            deleteVideoResource(loaderData.id);
            navigate({ pathname: "/video-resources" });
        }
        catch (error) {
            console.log("Error");
        }
    }

    return (
        <>
            <Popup id="delete-vidr" show={showDeletePopup} setShow={setShowDeletePopup}
                buttons={[{ text: "Delete", onclick: handleDelete }]}>
                <div className="text-center mt-6">Delete this video resource?</div>
            </Popup>

            {isAdmin &&
                <div className="z-1000 absolute top-0 left-0">
                    <PopupForm id="edit-video-resource" show={showEditPopup} setShow={setShowEditPopup} validate={validate} hasError={hasError} encType="multipart/form-data">
                        <h4>Edit video resource</h4>
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-5 mb-5 relative">
                            <div>
                                <label htmlFor="vid-resource-title">Video resource title:</label><br />
                                <input id="vid-resource-title" name="vid-resource-title" type="text"
                                    className={"input input-text w-full " + (formRequired?.vidResourceTitle && "input-required")}
                                    placeholder="Video title"
                                    defaultValue={loaderData.title}
                                    onChange={(e) => checkEmpty(e.target.value, "vidResourceTitle")} />
                                <div className="input-error">This field is required.</div>
                                <br /><br />
                                <label htmlFor="vid-resource-date">Video resource date:</label><br />
                                {/* Expected format for <input type="date"> is YYYY-MM-DD */}
                                <input id="vid-resource-date" name="vid-resource-date" type="date" className="input input-text w-full" defaultValue={loaderData.date.replace(/\//g, '-')} />
                            </div>
                            <label>
                                Video resource thumbnail image:
                                <p className="text-sm text-disabled-dark">Leave empty to keep existing thumbnail.</p>
                                <input id="vid-resource-thumbnail" name="vid-resource-thumbnail" type="file" accept=".jpg,.jpeg,.png" className="ml-3" />
                            </label>
                        </div>

                        <div className="relative">
                            <label htmlFor="vid-resource-link">Video resource link:</label><br />
                            <p className="text-sm text-disabled-dark mt-1">This is the video link that will be embedded. Please only include the link and not the entire embed.</p>
                            <input id="vid-resource-link" name="vid-resource-link" type="text"
                                className={"input input-text w-full " + (formRequired?.vidResourceLink && "input-required")}
                                placeholder="Video link"
                                defaultValue={loaderData.video_url}
                                onChange={(e) => checkEmpty(e.target.value, "vidResourceLink")} />
                            <div className="input-error">This field is required.</div>
                            <br /><br />
                            <label htmlFor="vid-resource-desc">Video description:</label><br />
                            <textarea id="vid-resource-desc" name="vid-resource-desc" className="input input-text w-full h-30" placeholder="Enter your video description..." defaultValue={loaderData.video_description}></textarea>
                            <br /> <br />
                        </div>

                        <fieldset className="border-t-2 border-gray-light pt-4 relative">
                            <div className="text-sm font-semibold text-secondary-dark">Speaker Details</div>
                            <div className="mt-3 grid md:grid-cols-2 grid-cols-1 gap-5">
                                <div>
                                    <label htmlFor="vid-resource-speaker-name">Name:</label><br />
                                    <input id="vid-resource-speaker-name" name="vid-resource-speaker-name" type="text"
                                        className={"input input-text w-full " + (formRequired?.vidResourceSpeakerName && "input-required")}
                                        placeholder="Name"
                                        defaultValue={loaderData.speaker}
                                        onChange={(e) => checkEmpty(e.target.value, "vidResourceSpeakerName")} />
                                    <div className="input-error">This field is required.</div>
                                </div>
                                <div>
                                    <label htmlFor="vid-resource-speaker-uni">University:</label><br />
                                    <input id="vid-resource-speaker-uni" name="vid-resource-speaker-uni" type="text" className="input input-text w-full" placeholder="University" defaultValue={loaderData.speaker_university} />
                                </div>
                            </div>
                            <br />
                            <label>
                                Speaker image:
                                <p className="text-sm text-disabled-dark">Leave empty to keep existing speaker image.</p>
                                <input id="vid-resource-speaker-img" name="vid-resource-speaker-img" type="file" accept=".jpg,.jpeg,.png" className="ml-3" />
                            </label>
                            <br /><br />
                            <label htmlFor="vid-resource-speaker-desc">Description:</label><br />
                            <textarea id="vid-resource-speaker-desc" name="vid-resource-speaker-desc" className="input input-text w-full h-20" placeholder="Enter your speaker description..." defaultValue={loaderData.speaker_details}></textarea>
                        </fieldset>
                    </PopupForm>
                    <Popup id="resolve" className="text-center" show={showResolvePopup} setShow={setShowResolvePopup} closePopup={closeResolvePopup} nested stayOnBlur>
                        <br /><p className="m-2">Video resource updated successfully!</p>
                    </Popup>
                </div>
            }

            <Menu />
            <Banner type="blue">
                <div className="relative z-1">
                    <a href="/video-resources" className="banner-breadcrumb">
                        <i className="bi bi-caret-left-fill"></i>
                        <strong>VIDEO RESOURCES</strong>
                    </a>
                    <h1 style={{ color: "white", textTransform: "none !important" }}>{loaderData.title}</h1>
                    <p>
                        <span className="text-lg">By {loaderData.speaker}</span> <span className="ml-5 opacity-70"><i>{loaderData.date}</i></span>
                    </p>
                </div>
            </Banner>

            <div className="py-20 px-10 lg:px-40 duration-200">
                {isAdmin ? (
                    <div className="text-right mb-4 flex justify-end gap-2">
                        <button className="button button-light" onClick={handleShowEditPopupForm}>Edit Video Resource</button>
                        <button className="button button-light button-red" onClick={() => setShowDeletePopup(true)}>Delete Video Resource</button>
                    </div>
                ) : <></>}
                <div className="mb-5 w-full lg:h-[40vw] h-[50vw]">
                    <iframe src={loaderData.video_url} width="100%" height="100%"></iframe>
                </div>
                <p>{loaderData.video_description}</p>

                <div className="relative mt-5 rounded-md border-2 border-gray-light p-5 flex flex-col md:flex-row place-items-center">
                    {loaderData.speaker_image && <img className="mx-auto w-50 shrink-0 grow-0" src={loaderData.speaker_image} alt="" />}
                    <div className="w-full md:w-70 shrink-0 grow-0 m-3">
                        <p className="font-semibold mr-2"><i>{loaderData.speaker}</i></p>
                        <p className="text-disabled-light">{loaderData.speaker_university}</p>
                    </div>
                    <p>{loaderData.speaker_details}</p>
                </div>

            </div>

            <Footer />
        </>
    )
}