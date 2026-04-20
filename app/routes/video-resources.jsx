import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase";
import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { Popup, PopupForm } from "../components/popup";
import { Pagination } from "../components/pagination";
import { updateRequired } from "../helpers/form";
import "../styles/video-resources.css";

export function meta() {
  return [
    { title: "Video Resources" },
    { name: "", content: "" },
  ];
}

async function getVideoResources() {
    const { data, error } = await supabase
        .from('video resources')
        .select('id, title, date, speaker, speaker_university, video_thumbnail')
    return data || error;
}

export async function loader({ params }) {    
    const videoResources = await getVideoResources();
    return {videoResources: videoResources};
}

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
    resourceInfo.video_thumbnail = (resourceInfo.video_thumbnail == "{}") ? null : resourceInfo.video_thumbnail;
    return (
        <div className="resource-card">
            <a href={"video-resource/" + resourceInfo.id} className="block w-full p-2 border-2 border-transparent hover:border-primary-light rounded-md">
                <div className="w-full lg:h-[14vw] sm:h-[28vw] h-[52vw] rounded-md mb-2 overflow-hidden bg-primary-dark flex items-center">
                    { resourceInfo.video_thumbnail ? 
                        <img className="min-w-full grow-0 shrink-0" src={resourceInfo?.video_thumbnail} /> 
                        : 
                        <div className="relative w-full h-full p-5">
                            <img className="w-[50%] absolute -right-20 -bottom-20 z-0" src="/assets/landing-disc-4a.svg" />
                            <h5 className="relative z-1" style={{color: "var(--color-white)"}}>{resourceInfo.title}</h5>
                            <p style={{color: "var(--color-white)"}}>{resourceInfo.date.replace(/-/g, '\/')}</p>
                        </div>
                    }
                </div>
                <h6>{resourceInfo.title}</h6>
                <p className="font-semibold text-black"><i>{resourceInfo.speaker}</i></p>
                <p className="text-sm text-disabled-light"><i>{resourceInfo.speaker_university}</i></p>
            </a>
        </div>
    )
}

export default function VideoResources({ loaderData }) {
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

    const videoResourcesData = loaderData.videoResources.sort(function(a,b) {return new Date(b.date) - new Date(a.date)});

    const videoResources = [];
    for (let i = (currentPage * 6); i < currentPage + 6; i++) {
        if (i < videoResourcesData.length) {
            videoResources.push(<ResourceCard key={videoResourcesData[i].id} resourceInfo={videoResourcesData[i]} />)
        } else {
            break;
        }
    }


    // EVERYTHING BELOW IS POPUP EDIT THINGS --------------------------------------------------------------------------------
    const [showResolvePopup, setShowResolvePopup] = useState(false);

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
            setShowResolvePopup(true);
        } else {
            setHasError(true);
        }
    }
    
    // This resets formRequired so that there are no error messages when the form is reloaded
    function handleShowCreatePopupForm() {
        setFormRequired({
            vidResourceTitle: "",
            vidResourceLink: "",
            vidResourceSpeakerName: ""
        })
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
            { isAdmin &&
                <div className="z-1000 absolute top-0 left-0">
                    <PopupForm id="video-resource" show={showCreatePopup} setShow={setShowCreatePopup} validate={validate} hasError={hasError}>
                        <h4>Create new video resource</h4>
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-5 mb-5 relative">
                            <div>
                                <label htmlFor="vid-resource-title">Video resource title:</label><br />
                                <input id="vid-resource-title" name="vid-resource-title" type="text" 
                                       className={"input input-text w-full " + (formRequired?.vidResourceTitle && "input-required")} 
                                       placeholder="Video title"
                                       onChange={(e) => checkEmpty(e.target.value, "vidResourceTitle")} />
                                <div className="input-error">This field is required.</div>
                                <br /><br />
                                <label htmlFor="vid-resource-date">Video resource date:</label><br />
                                <input id="vid-resource-date" name="vid-resource-date" type="date" className="input input-text w-full" defaultValue={todayString} />
                            </div>
                            <label>
                                Video resource thumbnail image:
                                <input id="vid-resource-thumbnail" name="vid-resource-thumbnail" type="file" accept=".jpg,.jpeg,.png" />
                                <div className="input-error">This field is required.</div>
                            </label>
                        </div>
                        
                        <div className="relative">
                            <label htmlFor="vid-resource-link">Video resource link:</label><br />
                            <p className="text-sm text-disabled-dark mt-1">This is the video link that will be embedded. Please only include the link and not the entire embed.</p>
                            <input id="vid-resource-link" name="vid-resource-link" type="text" 
                                   className={"input input-text w-full " + (formRequired?.vidResourceLink && "input-required")} 
                                   placeholder="Video link"
                                   onChange={(e) => checkEmpty(e.target.value, "vidResourceLink")}  />
                            <div className="input-error">This field is required.</div>
                            <br /><br />
                            <label htmlFor="vid-resource-desc">Video description:</label><br />
                            <textarea id="vid-resource-desc" name="vid-resource-desc" className="input input-text w-full h-30" placeholder="Enter your video description..."></textarea>
                            <br/> <br/>
                        </div>

                        <fieldset className="border-t-2 border-gray-light pt-4 relative">
                            <div className="text-sm font-semibold text-secondary-dark">Speaker Details</div>
                            <div className="mt-3 grid md:grid-cols-2 grid-cols-1 gap-5">
                                <div>
                                    <label htmlFor="vid-resource-speaker-name">Name:</label><br />
                                    <input id="vid-resource-speaker-name" name="vid-resource-speaker-name" type="text" 
                                           className={"input input-text w-full " + (formRequired?.vidResourceSpeakerName && "input-required")}
                                           placeholder="Name" 
                                           onChange={(e) => checkEmpty(e.target.value, "vidResourceSpeakerName")} />
                                    <div className="input-error">This field is required.</div>
                                </div>
                                <div>
                                    <label htmlFor="vid-resource-speaker-uni">University:</label><br />
                                    <input id="vid-resource-speaker-uni" name="vid-resource-speaker-uni" type="text" className="input input-text w-full" placeholder="University" />
                                </div>
                            </div>
                            <br/>
                            <label>
                                Speaker image:
                                <input id="vid-resource-speaker-img" name="vid-resource-speaker-img" type="file" accept=".jpg,.jpeg,.png" className="ml-3" />
                                <div className="input-error">This field is required.</div>
                            </label>
                            <br /><br />
                            <label htmlFor="vid-resource-speaker-desc">Description:</label><br />
                            <textarea id="vid-resource-speaker-desc" name="vid-resource-speaker-desc" className="input input-text w-full h-20" placeholder="Enter your speaker descrption..."></textarea>
                        </fieldset>
                    </PopupForm>
                    <Popup id="resolve" className="text-center" show={showResolvePopup} setShow={setShowResolvePopup} closePopup={closeResolvePopup} nested stayOnBlur>
                        <br/><p className="m-2">New video resource created!</p>
                    </Popup>
                </div>
            }
            <Menu currentEndUrl="/video-resources" />
            <div className="py-20 px-10 lg:px-40 duration-200">
                <div className="flex justify-between md:items-center md:flex-row flex-col md:mb-0 mb-5">
                    <h1>Video Resources</h1>
                    { isAdmin && <button className="button" onClick={handleShowCreatePopupForm}><i className="bi bi-plus-lg mr-3"></i>Create new video resource</button> }
                </div>
                <p>
                    Here you will find some videos provided by members of our network that you can use for your own training and also share with your students.
                </p>
                <div className="my-5 grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-5 gap-y-7">
                    {videoResources}
                </div>
                <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalItems={videoResourcesData.length} itemsPerPage={6} pageRange={5} />
            </div>
            <Footer />
        </>
    );
}
