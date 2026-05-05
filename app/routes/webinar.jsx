import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase";
import { Menu } from "../components/menu";
import { Banner } from "../components/graphics"
import { Footer } from "../components/footer";
import { Popup, PopupForm } from "../components/popup";
import { updateRequired } from "../helpers/form";
import "../styles/video-resources.css";

export function meta({ loaderData }) {
    return [
        { title: "Webinar: " + loaderData.title },
        // { name: "description", content: "Welcome to React Router!" },
    ];
}

const tempData = {
    title: "Webinar Title",
    date: "2025-04-02",
    pdf_url: "https://drive.google.com/file/d/1Ut8BdPVqqPD4pwC-0O8GlRbJ-4dLIqTj/preview",
    video_url: "https://drive.google.com/file/d/1gd2J8PqdCEGIMtpfd-eJ-ju70iUReXoQ/preview",
    description: "Description",
    speakers: [
        {
            name: "Name 1",
            university: "University",
            position: "position",
            slides_url: "https://drive.google.com/file/d/1Ut8BdPVqqPD4pwC-0O8GlRbJ-4dLIqTj/preview"
        },
        {
            name: "Name 2",
            university: "University",
            position: "position",
            slides_url: "https://drive.google.com/file/d/1Ut8BdPVqqPD4pwC-0O8GlRbJ-4dLIqTj/preview"
        }
    ]
}

async function getWebinar(webinarId) {
    const { data, error } = await supabase
        .from('webinars')
        .select()
        .eq('id', webinarId)

    if (error) {
        console.error("Error fetching webinar:", error);
        return null;
    }

    if (data[0]) {
        try {
            data[0].speakers = JSON.parse(data[0].speakers);
        } catch(e) {
            data[0].speakers = [];
        }
        return data[0];
    }

    return null;
}

function extractWebinarPath(url) {
    if (!url) return null;
    const parts = url.split('/webinars/');
    return parts.length > 1 ? parts[parts.length - 1] : null;
}

async function removeWebinarFiles(urls) {
    const paths = urls.map(extractWebinarPath).filter(Boolean);
    if (paths.length === 0) return;
    const { error } = await supabase.storage.from('webinars').remove(paths);
    if (error) {
        console.error("Error deleting files from storage:", error);
    }
}

async function deleteWebinar(webinarId, thumbnailUrl, speakersData) {
    const speakerUrls = Array.from(speakersData, (speaker) => speaker.image_url);
    await removeWebinarFiles([thumbnailUrl, ...speakerUrls]);

    const response = await supabase
        .from('webinars')
        .delete()
        .eq('id', webinarId)

    return response;
}

async function updateWebinar(webinarId, formData, existingData) {
    let thumbnailUrl = existingData.thumbnail_url;
    const filesToRemoveOnSuccess = [];

    const thumbnailFile = formData.get("webinar-thumbnail");
    if (thumbnailFile && thumbnailFile.name && thumbnailFile.size > 0) {
        const path = `${webinarId}/${Date.now()}-${thumbnailFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const { error: uploadError } = await supabase.storage
            .from('webinars')
            .upload(path, thumbnailFile);

        if (uploadError) {
            console.error("Error uploading thumbnail:", uploadError);
            return uploadError;
        }

        const { data, error: urlError } = supabase.storage
            .from('webinars')
            .getPublicUrl(path);

        if (urlError) {
            console.error("Error getting thumbnail URL:", urlError);
            return urlError;
        }

        if (existingData.video_thumbnail) {
            filesToRemoveOnSuccess.push(existingData.video_thumbnail);
        }
        thumbnailUrl = data.publicUrl;
    }

    let hasSpeakers = true;
    let i = 0;
    const speakersData = []
    const speakerImageUrls = [];
    while (hasSpeakers) {
        if (formData.get("webinar-speaker-name-" + i) == null) {
            hasSpeakers = false;
            break;
        }

        let speakerImgUrl = formData.get("webinar-speaker-image-url-" + i);
        const speakerImgFile = formData.get("webinar-speaker-image-" + i);
        // If new image upload
        if (speakerImgFile && speakerImgFile.name && speakerImgFile.size > 0) {
            const path = `${webinarId}/${Date.now()}-${speakerImgFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
            const { error: uploadError } = await supabase.storage
                .from('webinars')
                .upload(path, speakerImgFile);

            if (uploadError) {
                console.error("Error uploading speaker image:", uploadError);
                return uploadError;
            }

            const { data, error: urlError } = supabase.storage
                .from('webinars')
                .getPublicUrl(path);

            if (urlError) {
                console.error("Error getting speaker image URL:", urlError);
                return urlError;
            }

            // If there was a previous image url
            if (formData.get("webinar-speaker-image-url-" + i)) {
                filesToRemoveOnSuccess.push(existingData.speaker_image);
            }

            speakerImgUrl = data.publicUrl;
        }
        speakerImageUrls.push(speakerImgUrl);

        speakersData.push({
            name: formData.get("webinar-speaker-name-" + i),
            university: formData.get("webinar-speaker-university-" + i),
            position: formData.get("webinar-speaker-position-" + i),
            // image_url: speakerImageUrl,
            slidesURL: formData.get("webinar-speaker-slides-" + i),
        })
        i++;
    }

    // get all old speaker image urls that are now unused
    for (let speaker in existingData.speakers) {
        if (!speakerImageUrls.includes(speaker.image_url)) {
            filesToRemoveOnSuccess.push(speaker.image_url);
        }
    }

    const speakerDataJSON = JSON.stringify(speakersData);

    const { data, error } = await supabase
        .from('webinars')
        .update({
            title: formData.get("webinar-title"),
            pdf_url: formData.get("webinar-pdf-link"),
            video_url: formData.get("webinar-video-link"),
            date: formData.get("webinar-date"),
            description: formData.get("webinar-desc"),
            thumbnail_url: thumbnailUrl,
            speakers: speakerDataJSON
        })
        .eq('id', webinarId)
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

    await removeWebinarFiles(filesToRemoveOnSuccess);

    return null;
}

export async function loader({ params }) {
    const webinar = await getWebinar(params.webinarId);

    if (!webinar) {
        throw new Response("Webinar not found", { status: 404 });
    }
    return webinar;
}

function SpeakerEdit({ id, speakers, setSpeakers }) {
    const [nameRequired, setNameRequired] = useState(false);

    function removeSpeaker(e) {
        e.preventDefault();
        setSpeakers(speakers.toSpliced(id, 1));
    }

    function handleNameChange(e) {
        setSpeakers(speakers.toSpliced(id, 1, {
            ...speakers[id],
            name: e.target.value
        }));
        setNameRequired(e.target.value.length == 0);
    }

    function handleUniversityChange(e) {
        setSpeakers(speakers.toSpliced(id, 1,{
            ...speakers[id],
            university: e.target.value
        }));
    }

    function handlePositionChange(e) {
        setSpeakers(speakers.toSpliced(id, 1,{
            ...speakers[id],
            position: e.target.value
        }));
    }

    function handleImageChange(e) {
        setSpeakers(speakers.toSpliced(id, 1,{
            ...speakers[id],
            image: e.target.value
        }));
    }

    function handleSlidesChange(e) {
        setSpeakers(speakers.toSpliced(id, 1,{
            ...speakers[id],
            slides_url: e.target.value
        }));
    }

    return (
        <div className="px-2 py-4 first:pt-0 border-b-2 border-primary-light last:border-0">
            <div className="text-sm font-semibold mb-2 flex justify-between">
                <div className="text-secondary-dark">Speaker Details</div>
                <button className="text-error hover:text-error-dark hover:cursor-pointer duration-200" onClick={(e) => {removeSpeaker(e)}}>Remove Speaker</button>
            </div>
            <div className="md:grid grid-cols-2 flex flex-col gap-5">
                <div>
                    <label htmlFor={"webinar-speaker-name-" + id}>Name:</label><br />
                    <input id={"webinar-speaker-name-" + id} name={"webinar-speaker-name-" + id} type="text"
                        className={"input input-text w-full " + (nameRequired && "input-required")}
                        placeholder="Name"
                        value={speakers[id].name}
                        onChange={(e) => {handleNameChange(e)}} />
                    <div className="input-error">This field is required.</div>
                </div>
                <div>
                    <label htmlFor={"webinar-speaker-position-" + id}>Position:</label><br />
                    <input id={"webinar-speaker-position-" + id} name={"webinar-speaker-position-" + id} type="text" 
                    className="input input-text w-full" 
                    placeholder="Position"
                    value={speakers[id].position}
                    onChange={(e) => {handlePositionChange(e)}} />
                </div>
                <div>
                    <label htmlFor={"webinar-speaker-university-" + id}>University:</label><br />
                    <input id={"webinar-speaker-university-" + id} name={"webinar-speaker-university-" + id} type="text" 
                    className="input input-text w-full" 
                    placeholder="University"
                    value={speakers[id].university}
                    onChange={(e) => {handleUniversityChange(e)}} />
                </div>
                <label>
                    Speaker image:
                    <input id={"webinar-speaker-image-" + id} name={"webinar-speaker-image-" + id} type="file" accept=".jpg,.jpeg,.png" className="ml-3"
                    value={speakers[id].image}
                    onChange={(e) => {handleImageChange(e)}} />
                    <div className="input-error">This field is required.</div>
                </label>
                <input className="hidden" name={"webinar-speaker-image-url-" + id} value={speakers[id].image_url} />
                <div className="col-span-2">
                    <label htmlFor={"webinar-speaker-slides-" + id}>Slides:</label><br />
                    <input id={"webinar-speaker-slides-" + id} name={"webinar-speaker-slides-" + id} type="text" 
                    className="input input-text w-full" 
                    placeholder="https://drive.google.com/file/d/...."
                    value={speakers[id].slides_url}
                    onChange={(e) => {handleSlidesChange(e)}} />
                </div>
            </div>
        </div>
    )
}

export default function Webinar({ loaderData }) {
    // console.log(loaderData);

    // return (<div></div>);
    const navigate = useNavigate();
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    // EDIT LOGIC ADDITION
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showResolvePopup, setShowResolvePopup] = useState(false);
    const [speakers, setSpeakers] = useState([])

    function addSpeaker(e) {
        e.preventDefault();
        setSpeakers([...speakers, {name: "", university: "", position: "", image: "", slidesURL: ""}]);
    }

    const [formRequired, setFormRequired] = useState({
        webinarTitle: false,
    });
    const [hasError, setHasError] = useState(false);

    function handleShowEditPopupForm() {
        setFormRequired({
            webinarTitle: false,
        });
        setSpeakers(loaderData.speakers);
        setHasError(false);
        setShowEditPopup(true);
    }

    async function validate(formData) {
        let isValidated = true;
        const isRequired = {
            webinarTitle: formData.get('webinar-title') === (null || ""),
        }
        for (let value of Object.values(isRequired)) {
            if (value) {
                isValidated = false;
                break;
            }
        }
        for (let speaker of speakers) {
            if (speaker.name == "") {
                isValidated = false;
                break;
            }
        }
        if (!isValidated) {
            setFormRequired(isRequired);
            return false;
        }

        const updateError = await updateWebinar(loaderData.id, formData, loaderData);
        if (updateError === null) {
            setShowResolvePopup(true);
        } else {
            console.error("Failed to update video resource:", updateError);
            setHasError(true);
        }
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

    async function handleDelete() {
        try {
            await deleteWebinar(loaderData.id, loaderData.thumbnail_url, loaderData.speakers);
            navigate({ pathname: "/webinars" });
        }
        catch (error) {
            console.error("Error during deletion:", error);
        }
    }

    return (
        <>
            <Popup id="delete-webinar" show={showDeletePopup} setShow={setShowDeletePopup}
                buttons={[{ text: "Delete", onclick: handleDelete }]}>
                <div className="text-center mt-6">Delete this webinar?</div>
            </Popup>

            {isAdmin &&
                <div className="z-1000 absolute top-0 left-0">
                    <PopupForm id="edit-webinar" show={showEditPopup} setShow={setShowEditPopup} validate={validate} hasError={hasError} encType="multipart/form-data">
                        <h4>Create new webinar</h4>
                        <div className="md:grid grid-cols-2 flex flex-col gap-5 mb-5 relative">
                            <div>
                                <label htmlFor="webinar-title">Webinar title:</label><br />
                                <input id="webinar-title" name="webinar-title" type="text"
                                    className={"input input-text w-full " + (formRequired?.webinarTitle && "input-required")}
                                    placeholder="Webinar title"
                                    defaultValue={loaderData.title}
                                    onChange={(e) => checkEmpty(e.target.value, "webinarTitle")} />
                                <div className="input-error">This field is required.</div>
                                <br /><br />
                                <label htmlFor="webinar-date">Webinar date:</label><br />
                                <input id="webinar-date" name="webinar-date" type="date" defaultValue={loaderData.date} className="input input-text w-full" />
                            </div>
                            <label>
                                Webinar thumbnail image:
                                <input id="webinar-thumbnail" name="webinar-thumbnail" type="file" accept=".jpg,.jpeg,.png" className="ml-3" />
                                <div className="input-error">This field is required.</div>
                            </label>
                        </div>

                        <div className="relative">
                            <label htmlFor="webinar-pdf-link">Webinar PDF link:</label><br />
                            <p className="text-sm text-disabled-dark mt-1">This is the PDF that will be embedded. Please only include the link and not the entire embed.</p>
                            <input id="webinar-pdf-link" name="webinar-pdf-link" type="text"
                                className="input input-text w-full"
                                defaultValue={loaderData.pdf_url}
                                placeholder="https://drive.google.com/file/d/...."
                                onChange={(e) => {}} />
                            <br /><br />
                            <label htmlFor="webinar-video-link">Webinar video link:</label><br />
                            <p className="text-sm text-disabled-dark mt-1">This is the video link that will be embedded. Please only include the link and not the entire embed.</p>
                            <input id="webinar-video-link" name="webinar-video-link" type="text"
                                className="input input-text w-full"
                                defaultValue={loaderData.video_url}
                                placeholder="e.g. https://www.youtube.com/embed/VIDEO_ID or https://drive.google.com/file/d/...."
                                onChange={(e) => {}} />
                            <br /><br />
                            <label htmlFor="webinar-desc">Webinar description:</label><br />
                            <textarea id="webinar-desc" name="webinar-desc" className="input input-text w-full h-30" placeholder="Enter your video description..." defaultValue={loaderData.description}></textarea>
                            <br /> <br />
                        </div>

                        <fieldset className="border-t-2 border-gray-light pt-4 relative">
                            <h5 >Speaker Details</h5>
                            <div>
                                { speakers.map((speaker, idx) => <SpeakerEdit key={idx} id={idx} speakers={speakers} setSpeakers={setSpeakers} />)}
                            </div>
                            <button className="button button-light" onClick={(e) => addSpeaker(e)}>Add Speaker</button>
                        </fieldset>
                    </PopupForm>
                    <Popup id="resolve" className="text-center" show={showResolvePopup} setShow={setShowResolvePopup} closePopup={closeResolvePopup} nested stayOnBlur>
                        <br /><p className="m-2">Webinar updated successfully!</p>
                    </Popup>
                </div>
            }

            <Menu />
            <Banner type="blue">
                <div className="relative z-1">
                    <a href="/video-resources" className="banner-breadcrumb">
                        <i className="bi bi-caret-left-fill"></i>
                        <strong>WEBINARS</strong>
                    </a>
                    <h1 style={{ color: "white", textTransform: "none !important" }}>{loaderData.title}</h1>
                    <p className="opacity-70">
                        <i>{loaderData?.date.replace(/-/g, '\/')}</i>
                    </p>
                </div>
            </Banner>

            <div className="py-20 px-10 lg:px-40 duration-200">
                {isAdmin ? (
                    <div className="text-right mb-4 flex justify-end gap-2">
                        <button className="button button-light" onClick={handleShowEditPopupForm}>Edit Webinar</button>
                        <button className="button button-light button-red" onClick={() => setShowDeletePopup(true)}>Delete Webinar</button>
                    </div>
                ) : <></>}
                { loaderData?.pdf_url &&
                    <div className="mt-6 flex justify-center">
                        <iframe
                            src={loaderData.pdf_url}
                            className="w-full lg:max-w-[75%]"
                            style={{ height: '80vh' }}
                            title="Webinar Details PDF"
                        />
                    </div>
                }
                <br />
                { loaderData?.video_url &&
                    <div className="mb-5 w-full lg:h-[40vw] h-[50vw]">
                        <iframe src={loaderData.video_url} width="100%" height="100%"></iframe>
                    </div>
                }

                <p>{loaderData.description}</p>

                { loaderData.speakers.map((speaker, idx) => 
                    <div className="relative mt-5 rounded-md border-2 border-gray-light p-5 flex flex-col md:flex-row place-items-center justify-between">
                        <div className="flex flex-row place-items-center md:mb-0 mb-5 text-center">
                            {speaker?.image_url && <img className="mx-auto w-50 shrink-0 grow-0" src={speaker.image_url} alt="" />}
                            
                            <div className="shrink-0 grow-0 m-3 md:text-left text-center">
                                <p className="font-semibold mr-2"><i>{speaker.name}</i></p>
                                <p className="text-disabled-light">{speaker.university}</p>
                                <p>{speaker.position}</p>
                            </div>
                        </div>
                        <div>
                            <iframe
                            src={loaderData.pdf_url}
                            className="w-sm"
                            style={{ height: '200px' }}
                            title="Webinar Details PDF"
                        />
                        </div>
                    </div>
                )}

            </div>

            <Footer />
        </>
    )
}