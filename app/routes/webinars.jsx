import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase";
import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { Popup, PopupForm } from "../components/popup";
import { Pagination } from "../components/pagination";
import { updateRequired } from "../helpers/form";

export function meta() {
    return [
        { title: "Webinars" },
        { name: "", content: "" },
    ];
}

function formatDisplayDate(dateValue) {
    if (!dateValue) return "";
    return String(dateValue).split("T")[0].replace(/-/g, "/");
}

function normalizeDateForDatabase(dateValue) {
    return String(dateValue || "").trim().replace(/\//g, "-");
}

function isBlank(value) {
    return String(value || "").trim() === "";
}

function isValidDisplayDate(dateValue) {
    const value = String(dateValue || "").trim();
    if (!/^\d{4}\/\d{2}\/\d{2}$/.test(value)) return false;

    const [year, month, day] = value.split("/").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    );
}

function getTodayDisplayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}/${month}/${day}`;
}

async function getWebinars() {
    const { data, error } = await supabase
        .from("webinars")
        .select("id, title, date, speaker, speaker_university, webinar_thumbnail");

    if (error) {
        console.error("Error fetching webinars:", error);
        return [];
    }

    return data || [];
}

export async function loader() {
    const webinars = await getWebinars();
    return { webinars };
}

async function uploadWebinarFile(file, folder) {
    if (!file || !file.name || file.size <= 0) return null;

    const path = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { error: uploadError } = await supabase.storage
        .from("webinars")
        .upload(path, file);

    if (uploadError) {
        console.error("Error uploading webinar file:", uploadError);
        throw uploadError;
    }

    const { data, error: urlError } = supabase.storage
        .from("webinars")
        .getPublicUrl(path);

    if (urlError) {
        console.error("Error getting webinar file URL:", urlError);
        throw urlError;
    }

    return data.publicUrl;
}

function inputClass(isRequired) {
    return "input input-text w-full " + (isRequired ? "input-required" : "");
}

async function removeUploadedWebinarFiles(urls) {
    const paths = urls
        .map((url) => {
            if (!url) return null;
            const parts = url.split("/webinars/");
            return parts.length > 1 ? parts[parts.length - 1] : null;
        })
        .filter(Boolean);

    if (paths.length === 0) return;

    const { error } = await supabase.storage.from("webinars").remove(paths);
    if (error) {
        console.error("Error deleting uploaded webinar files:", error);
    }
}

async function createWebinar(formData) {
    let thumbnailUrl = null;
    let speakerImgUrl = null;

    try {
        thumbnailUrl = await uploadWebinarFile(formData.get("webinar-thumbnail"), "thumbnails");
        speakerImgUrl = await uploadWebinarFile(formData.get("webinar-speaker-img"), "speakers");
    } catch (error) {
        return error;
    }

    const { data, error } = await supabase
        .from("webinars")
        .insert({
            title: formData.get("webinar-title"),
            webinar_url: formData.get("webinar-link"),
            date: normalizeDateForDatabase(formData.get("webinar-date")),
            webinar_thumbnail: thumbnailUrl,
            webinar_description: formData.get("webinar-desc"),
            speaker: formData.get("webinar-speaker-name"),
            speaker_university: formData.get("webinar-speaker-uni"),
            speaker_image: speakerImgUrl,
            speaker_details: formData.get("webinar-speaker-desc"),
        })
        .select("id");

    if (error) {
        console.error("Database insert error:", error);
        await removeUploadedWebinarFiles([thumbnailUrl, speakerImgUrl]);
        return error;
    }

    if (!data || data.length === 0) {
        const rlsError = new Error("No webinar was created. You may be missing an INSERT policy in Supabase.");
        console.error(rlsError.message);
        await removeUploadedWebinarFiles([thumbnailUrl, speakerImgUrl]);
        return rlsError;
    }

    return null;
}

function WebinarCard({ webinarInfo }) {
    const thumbnail = webinarInfo.webinar_thumbnail === "{}" ? null : webinarInfo.webinar_thumbnail;
    const displayDate = formatDisplayDate(webinarInfo.date);

    return (
        <div>
            <a href={"/webinar/" + webinarInfo.id} className="block w-full p-2 border-2 border-transparent hover:border-primary-light rounded-md">
                <div className="w-full lg:h-[14vw] sm:h-[28vw] h-[52vw] rounded-md mb-2 overflow-hidden bg-primary-dark flex items-center">
                    {thumbnail ?
                        <img className="min-w-full grow-0 shrink-0" src={thumbnail} alt="" />
                        :
                        <div className="relative w-full h-full p-5">
                            <img className="w-[50%] absolute -right-20 -bottom-20 z-0" src="/assets/landing-disc-4a.svg" alt="" />
                            <h5 className="relative z-1" style={{ color: "var(--color-white)" }}>{webinarInfo.title}</h5>
                            <p style={{ color: "var(--color-white)" }}>{displayDate}</p>
                        </div>
                    }
                </div>
                <h6>{webinarInfo.title}</h6>
                <p className="font-semibold text-black"><i>{webinarInfo.speaker}</i></p>
                <p className="text-sm text-disabled-light"><i>{webinarInfo.speaker_university}</i></p>
            </a>
        </div>
    );
}

export default function Webinars({ loaderData }) {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [showCreatePopup, setShowCreatePopup] = useState(false);
    const [showResolvePopup, setShowResolvePopup] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [formRequired, setFormRequired] = useState({
        webinarTitle: false,
        webinarDate: false,
        webinarLink: false,
        webinarSpeakerName: false,
    });
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const getIsAdmin = async (userId) => {
            try {
                const { data, error } = await supabase
                    .from("users")
                    .select("role")
                    .eq("id", userId);

                if (error) {
                    console.log("error");
                    return;
                }

                if (data[0]) {
                    setIsAdmin(data[0].role === "admin");
                } else {
                    console.log("error");
                }
            } catch (error) {
                console.log("error");
            }
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user.id) {
                getIsAdmin(session.user.id);
            } else {
                setIsAdmin(false);
            }
        });

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user.id) {
                getIsAdmin(session.user.id);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const webinarsData = [...(loaderData.webinars || [])].sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
    });

    const webinars = [];
    for (let i = currentPage * 6; i < (currentPage * 6) + 6; i++) {
        if (i < webinarsData.length) {
            webinars.push(<WebinarCard key={webinarsData[i].id} webinarInfo={webinarsData[i]} />);
        } else {
            break;
        }
    }

    async function validate(formData) {
        setHasError(false);

        let isValidated = true;
        const dateValue = formData.get("webinar-date");
        const isRequired = {
            webinarTitle: isBlank(formData.get("webinar-title")),
            webinarDate: !isValidDisplayDate(dateValue),
            webinarLink: isBlank(formData.get("webinar-link")),
            webinarSpeakerName: isBlank(formData.get("webinar-speaker-name")),
        };

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

        const createError = await createWebinar(formData);
        if (createError === null) {
            setShowResolvePopup(true);
        } else {
            console.error("Failed to create webinar:", createError);
            setHasError(true);
        }
    }

    function handleShowCreatePopupForm() {
        setFormRequired({
            webinarTitle: false,
            webinarDate: false,
            webinarLink: false,
            webinarSpeakerName: false,
        });
        setHasError(false);
        setShowCreatePopup(true);
    }

    function checkEmpty(value, inputName) {
        const updatedFormRequired = inputName === "webinarDate"
            ? { ...formRequired, webinarDate: !isValidDisplayDate(value) }
            : updateRequired(value, inputName, formRequired);

        if (updatedFormRequired !== formRequired) {
            setFormRequired(updatedFormRequired);
        }
    }

    function closeResolvePopup() {
        setShowResolvePopup(false);
        setShowCreatePopup(false);
        navigate(0);
    }

    return (
        <>
            {isAdmin &&
                <div className="z-1000 absolute top-0 left-0">
                    <PopupForm id="webinar" show={showCreatePopup} setShow={setShowCreatePopup} validate={validate} hasError={hasError} encType="multipart/form-data">
                        <h4>Create new webinar</h4>
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-5 mb-5 relative">
                            <div>
                                <label htmlFor="webinar-title">Webinar title:</label><br />
                                <input id="webinar-title" name="webinar-title" type="text"
                                    className={inputClass(formRequired?.webinarTitle)}
                                    placeholder="Webinar title"
                                    onChange={(e) => checkEmpty(e.target.value, "webinarTitle")} />
                                <div className="input-error">This field is required.</div>
                                <br /><br />
                                <label htmlFor="webinar-date">Webinar date:</label><br />
                                <input id="webinar-date" name="webinar-date" type="text"
                                    className={inputClass(formRequired?.webinarDate)}
                                    placeholder="YYYY/MM/DD"
                                    defaultValue={getTodayDisplayDate()}
                                    onChange={(e) => checkEmpty(e.target.value, "webinarDate")} />
                                <div className="input-error">Use YYYY/MM/DD.</div>
                            </div>
                            <label>
                                Webinar thumbnail image:
                                <input id="webinar-thumbnail" name="webinar-thumbnail" type="file" accept=".jpg,.jpeg,.png" className="ml-3" />
                            </label>
                        </div>

                        <div className="relative">
                            <label htmlFor="webinar-link">Webinar link:</label><br />
                            <p className="text-sm text-disabled-dark mt-1">This is the webinar link that will be embedded. Please only include the link and not the entire embed.</p>
                            <input id="webinar-link" name="webinar-link" type="text"
                                className={inputClass(formRequired?.webinarLink)}
                                placeholder="e.g. https://www.youtube.com/embed/VIDEO_ID or https://drive.google.com/file/d/...."
                                onChange={(e) => checkEmpty(e.target.value, "webinarLink")} />
                            <div className="input-error">This field is required.</div>
                            <br /><br />
                            <label htmlFor="webinar-desc">Webinar description:</label><br />
                            <textarea id="webinar-desc" name="webinar-desc" className="input input-text w-full h-30" placeholder="Enter your webinar description..."></textarea>
                            <br /> <br />
                        </div>

                        <fieldset className="border-t-2 border-gray-light pt-4 relative">
                            <div className="text-sm font-semibold text-secondary-dark">Speaker Details</div>
                            <div className="mt-3 grid md:grid-cols-2 grid-cols-1 gap-5">
                                <div>
                                    <label htmlFor="webinar-speaker-name">Name:</label><br />
                                    <input id="webinar-speaker-name" name="webinar-speaker-name" type="text"
                                        className={inputClass(formRequired?.webinarSpeakerName)}
                                        placeholder="Name"
                                        onChange={(e) => checkEmpty(e.target.value, "webinarSpeakerName")} />
                                    <div className="input-error">This field is required.</div>
                                </div>
                                <div>
                                    <label htmlFor="webinar-speaker-uni">University:</label><br />
                                    <input id="webinar-speaker-uni" name="webinar-speaker-uni" type="text" className="input input-text w-full" placeholder="University" />
                                </div>
                            </div>
                            <br />
                            <label>
                                Speaker image:
                                <input id="webinar-speaker-img" name="webinar-speaker-img" type="file" accept=".jpg,.jpeg,.png" className="ml-3" />
                            </label>
                            <br /><br />
                            <label htmlFor="webinar-speaker-desc">Description:</label><br />
                            <textarea id="webinar-speaker-desc" name="webinar-speaker-desc" className="input input-text w-full h-20" placeholder="Enter your speaker description..."></textarea>
                        </fieldset>
                    </PopupForm>
                    <Popup id="resolve" className="text-center" show={showResolvePopup} setShow={setShowResolvePopup} closePopup={closeResolvePopup} nested stayOnBlur>
                        <br /><p className="m-2">New webinar created!</p>
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
                    Browse current webinar recordings from members of the IAJES network.
                </p>
                <p>
                    <a href="/webinars/archive">View webinars archive</a>
                </p>
                {webinars.length > 0 ?
                    <div className="my-5 grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-5 gap-y-7">
                        {webinars}
                    </div>
                    :
                    <p className="my-5 text-disabled-light"><i>No webinars available.</i></p>
                }
                <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalItems={webinarsData.length} itemsPerPage={6} pageRange={5} />
            </div>
            <Footer />
        </>
    );
}
