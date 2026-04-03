import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase";
import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { PopupForm } from "../components/popup";
import { Pagination } from "../components/pagination";
import "../styles/video-resources.css";

export function meta() {
  return [
    { title: "Video Resources" },
    { name: "", content: "" },
  ];
}

const resources = [
    {
        title: "Optimizing industrial processes with CAE",
        date: new Date("2022-03-25"),
        speaker: "Alejandro López García",
        university: "University of Deusto, Bilbao, Spain",
        speakerDetails: "Lecturer and Programme Leader at the University of Deusto - Research in Computational Mechanics, Fluid Mechanics, Granular matter and powder flow, additive manufacturing, Erosion processes",
        speakerImg: "https://lh3.googleusercontent.com/sitesv/APaQ0SQ_f2Xs3xgWvX0lZlmpQLezeSdExHZBy7Rugb0t4Ba1Q9fTG0FzhdgQjN67XvFLsIFX5vPgFXkoBb5GC57L8ZAxKEmlg2bMkg1zPVDj0BnbaeqWTWFCJnwk1cOCiN9V8WQXYX8CBc93CHb8YGo_GYGTxM4GP9qU6BnO76gN82KnbcqNeem7xtUwp-syEIx2i3DPhCsrzZ1MO6wQZ0_45VFbS5Nr7Te3gJDc=w1280",
        video: "https://drive.google.com/file/d/1gd2J8PqdCEGIMtpfd-eJ-ju70iUReXoQ/preview",
        videoThumbnail: null,
        desc: "How can we improve industrial processes with Computer Aided Engineering?",
        id: 1
    }
]

async function createVideoResource(formData) {
    const { error } = await supabase
        .from('video resources')
        .insert({ 
            title: formData.get("vid-resource-title"),
            video_url: formData.get("vid-resource-link"),
            date: formData.get("vid-resource-date"),
            video_thumbnail: formData.get("vid-resource-thumbnail"),
            video_description: formData.get("vid-resource-desc"),
            speaker: formData.get("vid-resource-speaker-name"),
            speaker_university: formData.get("vid-resource-speaker-uni"),
            speaker_image: formData.get("vid-resource-speaker-img"),
            speaker_details: formData.get("vid-resource-speaker-desc"),
         })
    return error;
}

function ResourceCard({resourceInfo}) {
    return (
        <div className="resource-card">
            <a href={"video-resource/" + resourceInfo.id} className="block w-full p-2 border-2 border-transparent hover:border-primary-light rounded-md">
                <div className="w-full lg:h-[14vw] sm:h-[28vw] h-[52vw] rounded-md mb-2 overflow-hidden bg-primary-dark flex items-center">
                    { resourceInfo?.videoThumbnail ? 
                        <img className="min-w-full grow-0 shrink-0" src={resourceInfo?.videoThumbnail} /> 
                        : 
                        <div className="relative w-full h-full p-5">
                            <img className="w-[50%] absolute -right-20 -bottom-20 z-0" src="/assets/landing-disc-4a.svg" />
                            <h5 className="relative z-1" style={{color: "var(--color-white)"}}>{resourceInfo.title}</h5>
                            <p style={{color: "var(--color-white)"}}>{resourceInfo.date.toLocaleDateString()}</p>
                        </div>
                    }
                </div>
                <h6>{resourceInfo.title}</h6>
                <p className="font-semibold text-black"><i>{resourceInfo.speaker}</i></p>
                <p className="text-sm text-disabled-light"><i>{resourceInfo.university}</i></p>
            </a>
        </div>
    )
}

export default function VideoResources() {
    const navigate = useNavigate();
    const isAdmin = true;
    const [showPopup, setShowPopup] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const userId = "";

    const videoResources = [];
    for (let i = (currentPage * 6); i < currentPage + 6; i++) {
        if (i < resources.length) {
            videoResources.push(<ResourceCard key={resources[i].id} resourceInfo={resources[i]} />)
        } else {
            break;
        }
    }

    const [formRequired, setFormRequired] = useState({
        vidResourceTitle: "",
        vidResourceLink: "",
        vidResourceSpeakerName: "",
    })
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

        const create = await createVideoResource(formData);
        if (create === null) {
            setShowPopup(false);
            navigate(0);
        } else {
            setHasError(true);
        }
    }

    function handleShowPopupForm() {
        // This resets formRequired so that there are no error messages when the form is reloaded
        setFormRequired({
            vidResourceTitle: "",
            vidResourceLink: "",
            vidResourceSpeakerName: ""
        })
        setShowPopup(true);
    }

    const today = new Date(Date.now()).toISOString().substring(0,10);

    return (
        <>
            { isAdmin &&
                <div className="z-1000 absolute top-0 left-0">
                    <PopupForm show={showPopup} setShow={setShowPopup} validate={validate} hasError={hasError}>
                        <h4>Create new video resource</h4>
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-5 mb-5 relative">
                            <div>
                                <label for="vid-resource-title">Video resource title:</label><br />
                                <input id="vid-resource-title" name="vid-resource-title" type="text" className={"input input-text w-full " + (formRequired?.vidResourceTitle && "input-required")} placeholder="Video title" />
                                <div className="input-error">This field is required.</div>
                                <br /><br />
                                <label for="vid-resource-date">Video resource date:</label><br />
                                <input id="vid-resource-date" name="vid-resource-date" type="date" className="input input-text w-full" defaultValue={today} />
                            </div>
                            <label>
                                Video resource thumbnail image:
                                <input id="vid-resource-thumbnail" name="vid-resource-thumbnail" type="file" />
                                <div className="input-error">This field is required.</div>
                            </label>
                        </div>
                        
                        <div className="relative">
                            <label for="vid-resource-link">Video resource link:</label><br />
                            <p className="text-sm text-disabled-dark mt-1">This is the video link that will be embedded. Please only include the link and not the entire embed.</p>
                            <input id="vid-resource-link" name="vid-resource-link" type="text" className={"input input-text w-full " + (formRequired?.vidResourceLink && "input-required")} placeholder="Video link"  />
                            <div className="input-error">This field is required.</div>
                            <br /><br />
                            <label for="vid-resource-desc">Video description:</label><br />
                            <textarea id="vid-resource-desc" name="vid-resource-desc" className="input input-text w-full h-30" placeholder="Enter your video description..."></textarea>
                            <br/> <br/>
                        </div>

                        <fieldset className="border-t-2 border-gray-light pt-4 relative">
                            <div className="text-sm font-semibold text-secondary-dark">Speaker Details</div>
                            <div className="mt-3 grid md:grid-cols-2 grid-cols-1 gap-5">
                                <div>
                                    <label for="vid-resource-speaker-name">Name:</label><br />
                                    <input id="vid-resource-speaker-name" name="vid-resource-speaker-name" type="text" className={"input input-text w-full " + (formRequired?.vidResourceSpeakerName && "input-required")} placeholder="Name" />
                                    <div className="input-error">This field is required.</div>
                                </div>
                                <div>
                                    <label for="vid-resource-speaker-uni">University:</label><br />
                                    <input id="vid-resource-speaker-uni" name="vid-resource-speaker-uni" type="text" className="input input-text w-full" placeholder="University" />
                                </div>
                            </div>
                            <br/>
                            <label>
                                Speaker image:
                                <input id="vid-resource-speaker-img" name="vid-resource-speaker-img" type="file" className="ml-3" />
                                <div className="input-error">This field is required.</div>
                            </label>
                            <br /><br />
                            <label for="vid-resource-speaker-desc">Description:</label><br />
                            <textarea id="vid-resource-speaker-desc" name="vid-resource-speaker-desc" className="input input-text w-full h-20" placeholder="Enter your speaker descrption..."></textarea>
                        </fieldset>
                    </PopupForm>
                </div>
            }
            <Menu />
            <div className="py-20 px-10 lg:px-40 duration-200">
                <div className="flex justify-between md:items-center md:flex-row flex-col md:mb-0 mb-5">
                    <h1>Video Resources</h1>
                    { isAdmin && <button className="button" onClick={handleShowPopupForm}><i className="bi bi-plus-lg mr-3"></i>Create new video resource</button> }
                </div>
                <p>
                    Here you will find some videos provided by members of our network that you can use for your own training and also share with your students.
                </p>
                <div className="my-5 grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-5 gap-y-7">
                    {videoResources}
                </div>
                <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalItems={resources.length} itemsPerPage={6} pageRange={5} />
            </div>
            <Footer />
        </>
    );
}
