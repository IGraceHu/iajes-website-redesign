import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase";
import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { Popup, PopupForm } from "../components/popup";
import { Pagination } from "../components/pagination";
import { updateRequired } from "../helpers/form";
import "../styles/webinars.css";

export function meta() {
    return [
        { title: "Webinars" },
        { name: "", content: "" },
    ];
}

async function getWebinars() {
    return [];
    // const { data, error } = await supabase
    //     .from('webinars')
    //     .select('id, title, date, speaker, speaker_university, video_thumbnail')
    // return data || error;
}

export async function loader({ params }) {
    const webinars = await getWebinars();
    return { webinars: webinars };
}

// async function createWebinars(formData) {
//     let thumbnailUrl = null;
//     let speakerImgUrl = null;

//     const thumbnailFile = formData.get("vid-resource-thumbnail");
//     if (thumbnailFile && thumbnailFile.name && thumbnailFile.size > 0) {
//         const path = `${Date.now()}-${thumbnailFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
//         const { error: uploadError } = await supabase.storage
//             .from('video-resources')
//             .upload(path, thumbnailFile);

//         if (uploadError) {
//             console.error("Error uploading thumbnail:", uploadError);
//             return uploadError;
//         }

//         const { data, error: urlError } = supabase.storage
//             .from('video-resources')
//             .getPublicUrl(path);

//         if (urlError) {
//             console.error("Error getting thumbnail URL:", urlError);
//             return urlError;
//         }

//         thumbnailUrl = data.publicUrl;
//     }

//     const speakerImgFile = formData.get("vid-resource-speaker-img");
//     if (speakerImgFile && speakerImgFile.name && speakerImgFile.size > 0) {
//         const path = `${Date.now()}-${speakerImgFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
//         const { error: uploadError } = await supabase.storage
//             .from('video-resources')
//             .upload(path, speakerImgFile);

//         if (uploadError) {
//             console.error("Error uploading speaker image:", uploadError);
//             return uploadError;
//         }

//         const { data, error: urlError } = supabase.storage
//             .from('video-resources')
//             .getPublicUrl(path);

//         if (urlError) {
//             console.error("Error getting speaker image URL:", urlError);
//             return urlError;
//         }

//         speakerImgUrl = data.publicUrl;
//     }

//     const { error } = await supabase
//         .from('video resources')
//         .insert({
//             title: formData.get("vid-resource-title"),
//             video_url: formData.get("vid-resource-link"),
//             date: formData.get("vid-resource-date"),
//             video_thumbnail: thumbnailUrl,
//             video_description: formData.get("vid-resource-desc"),
//             speaker: formData.get("vid-resource-speaker-name"),
//             speaker_university: formData.get("vid-resource-speaker-uni"),
//             speaker_image: speakerImgUrl,
//             speaker_details: formData.get("vid-resource-speaker-desc"),
//         })

//     if (error) {
//         console.error("Database insert error:", error);
//     }

//     return error;
// }

function WebinarCard({ webinarInfo }) {
    webinarInfo.video_thumbnail = (webinarInfo.video_thumbnail == "{}") ? null : webinarInfo.video_thumbnail;
    return (
        <div className="resource-card duration-200">
            <a href={"webinars/" + webinarInfo.id} className="block w-full p-2 border-2 border-transparent hover:border-primary-light duration-200 rounded-md">
                <div className="w-full lg:h-[14vw] sm:h-[28vw] h-[52vw] rounded-md mb-2 overflow-hidden bg-primary-dark flex items-center">
                    {webinarInfo.video_thumbnail ?
                        <img className="min-w-full grow-0 shrink-0" src={webinarInfo?.video_thumbnail} />
                        :
                        <div className="relative w-full h-full p-5">
                            <img className="w-[50%] absolute -right-20 -bottom-20 z-0" src="/assets/landing-disc-4a.svg" />
                            <h5 className="relative z-1" style={{ color: "var(--color-white)" }}>{webinarInfo.title}</h5>
                            <p style={{ color: "var(--color-white)" }}>{webinarInfo.date.replace(/-/g, '\/')}</p>
                        </div>
                    }
                </div>
                <h6>{webinarInfo.title}</h6>
                <p className="font-semibold text-black"><i>{webinarInfo.speaker}</i></p>
                <p className="text-sm text-disabled-light"><i>{webinarInfo.speaker_university}</i></p>
            </a>
        </div>
    )
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
            slidesURL: e.target.value
        }));
    }

    return (
        <div className="px-2 py-4 first:pt-0 border-b-2 border-primary-light last:border-0">
            <div className="text-sm font-semibold mb-2 flex justify-between">
                <div className="text-secondary-dark">Speaker Details</div>
                <button className="text-error hover:text-error-dark hover:cursor-pointer duration-200" onClick={(e) => {removeSpeaker(e)}}>Remove Speaker</button>
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
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
                    <label htmlFor={"webinar-speaker-university-" + id}>University:</label><br />
                    <input id={"webinar-speaker-university-" + id} name={"webinar-speaker-university-" + id} type="text" 
                    className="input input-text w-full" 
                    placeholder="University"
                    value={speakers[id].university}
                    onChange={(e) => {handleUniversityChange(e)}} />
                </div>
                <div>
                    <label htmlFor={"webinar-speaker-position-" + id}>Position:</label><br />
                    <input id={"webinar-speaker-position-" + id} name={"webinar-speaker-position-" + id} type="text" 
                    className="input input-text w-full" 
                    placeholder="Position"
                    value={speakers[id].position}
                    onChange={(e) => {handlePositionChange(e)}} />
                </div>
                <label>
                    Speaker image:
                    <input id={"webinar-speaker-image-" + id} name={"webinar-speaker-image-" + id} type="file" accept=".jpg,.jpeg,.png" className="ml-3"
                    value={speakers[id].image}
                    onChange={(e) => {handleImageChange(e)}} />
                    <div className="input-error">This field is required.</div>
                </label>
                <div className="col-span-2">
                    <label htmlFor={"webinar-speaker-slides-" + id}>Slides:</label><br />
                    <input id={"webinar-speaker-slides-" + id} name={"webinar-speaker-slides-" + id} type="text" 
                    className="input input-text w-full" 
                    placeholder="https://drive.google.com/file/d/...."
                    value={speakers[id].slidesURL}
                    onChange={(e) => {handleSlidesChange(e)}} />
                </div>
            </div>
        </div>
    )
}

export default function Webinars({ loaderData }) {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [showCreatePopup, setShowCreatePopup] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

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

    const webinarsData = loaderData.webinars.sort(function (a, b) { return new Date(b.date) - new Date(a.date) });

    const webinars = [];
    for (let i = (currentPage * 6); i < currentPage + 6; i++) {
        if (i < webinarsData.length) {
            webinars.push(<ResourceCard key={webinarsData[i].id} webinarInfo={webinarsData[i]} />)
        } else {
            break;
        }
    }


    // EVERYTHING BELOW IS POPUP EDIT THINGS --------------------------------------------------------------------------------
    const [showResolvePopup, setShowResolvePopup] = useState(false);
    const [speakers, setSpeakers] = useState([])

    function addSpeaker(e) {
        e.preventDefault();
        setSpeakers([...speakers, {name: "", university: "", position: "", image: "", slidesURL: ""}]);
    }

    const [formRequired, setFormRequired] = useState({
        webinarTitle: "",
    })
    const [hasError, setHasError] = useState(false);

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

        const createError = await createVideoResource(formData);
        if (createError === null) {
            setShowResolvePopup(true);
        } else {
            console.error("Failed to create video resource:", createError);
            setHasError(true);
        }
    }

    // This resets formRequired so that there are no error messages when the form is reloaded
    function handleShowCreatePopupForm() {
        setFormRequired({
            webinarTitle: "",
        })
        setSpeakers([]);
        setShowCreatePopup(true);
    }

    // This resolves required fields once fields are no longer empty
    function checkEmpty(value, inputName) {
        const updatedFormRequired = updateRequired(value, inputName, formRequired);
        if (updatedFormRequired != formRequired) {
            setFormRequired(updatedFormRequired);
        }
    }

    const today = new Date();

    let day = today.getDate();
    let month = today.getMonth() + 1;
    let year = today.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    const todayString = `${year}\-${month}\-${day}`

    function closeResolvePopup() {
        setShowResolvePopup(false);
        setShowCreatePopup(false);
        navigate(0);
    }

    return (
        <>
            {isAdmin &&
                <div className="z-1000 absolute top-0 left-0">
                    <PopupForm id="video-resource" show={showCreatePopup} setShow={setShowCreatePopup} validate={validate} hasError={hasError} encType="multipart/form-data">
                        <h4>Create new webinar</h4>
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-5 mb-5 relative">
                            <div>
                                <label htmlFor="vid-resource-title">Webinar title:</label><br />
                                <input id="webinar-title" name="webinar-title" type="text"
                                    className={"input input-text w-full " + (formRequired?.webinarTitle && "input-required")}
                                    placeholder="Webinar title"
                                    onChange={(e) => checkEmpty(e.target.value, "webinarTitle")} />
                                <div className="input-error">This field is required.</div>
                                <br /><br />
                                <label htmlFor="webinar-date">Webinar date:</label><br />
                                <input id="webinar-date" name="webinar-date" type="date" className="input input-text w-full" defaultValue={todayString} />
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
                                placeholder="https://drive.google.com/file/d/...."
                                onChange={(e) => {}} />
                            <br /><br />
                            <label htmlFor="webinar-video-link">Webinar video link:</label><br />
                            <p className="text-sm text-disabled-dark mt-1">This is the video link that will be embedded. Please only include the link and not the entire embed.</p>
                            <input id="webinar-video-link" name="webinar-video-link" type="text"
                                className="input input-text w-full"
                                placeholder="e.g. https://www.youtube.com/embed/VIDEO_ID or https://drive.google.com/file/d/...."
                                onChange={(e) => {}} />
                            <br /><br />
                            <label htmlFor="webinar-desc">Webinar description:</label><br />
                            <textarea id="webinar-desc" name="webinar-desc" className="input input-text w-full h-30" placeholder="Enter your video description..."></textarea>
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
                        <br /><p className="m-2">New video resource created!</p>
                    </Popup>
                </div>
            }
            <Menu currentEndUrl="/webinars" />
            <div className="py-20 px-10 lg:px-40 duration-200">
                <div className="flex justify-between md:items-center md:flex-row flex-col md:mb-0 mb-5">
                    <h1>Webinars</h1>
                    {isAdmin && <button className="button" onClick={handleShowCreatePopupForm}><i className="bi bi-plus-lg mr-3"></i>Create new webinar</button>}
                </div>
                <p>
                    Pilot test the onset of a branded forward thinking interactive online workshop series that would help IAJES members share experiences and lessons learned in delivering quality Jesuit engineering education for the current and future society 
                </p>
                <div className="my-5 grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-5 gap-y-7">
                    {webinars}
                </div>
                <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalItems={webinarsData.length} itemsPerPage={6} pageRange={5} />
            </div>
            <Footer />
        </>
    );
}
