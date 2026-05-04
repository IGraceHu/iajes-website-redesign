import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase";
import { Menu } from "../components/menu";
import { Banner } from "../components/graphics";
import { Footer } from "../components/footer";
import { Popup, PopupForm } from "../components/popup";
import { updateRequired } from "../helpers/form";

export function meta() {
    return [
        { title: "Webinar" },
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

async function getWebinar(webinarId) {
    const { data, error } = await supabase
        .from("webinars")
        .select()
        .eq("id", webinarId);

    if (error) {
        console.error("Error fetching webinar:", error);
        return null;
    }

    return data ? data[0] : null;
}

function extractWebinarFilePath(url) {
    if (!url) return null;
    const parts = url.split("/webinars/");
    return parts.length > 1 ? parts[parts.length - 1] : null;
}

async function removeWebinarFiles(urls) {
    const paths = urls.map(extractWebinarFilePath).filter(Boolean);
    if (paths.length === 0) return;

    const { error } = await supabase.storage.from("webinars").remove(paths);
    if (error) {
        console.error("Error deleting webinar files from storage:", error);
    }
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

async function deleteWebinar(webinarId, thumbnailUrl, speakerImgUrl) {
    const { data, error } = await supabase
        .from("webinars")
        .delete()
        .eq("id", webinarId)
        .select("id");

    if (error) {
        console.error("Database delete error:", error);
        return error;
    }

    if (!data || data.length === 0) {
        const rlsError = new Error("No webinar was deleted. You may be missing a DELETE policy in Supabase.");
        console.error(rlsError.message);
        return rlsError;
    }

    await removeWebinarFiles([thumbnailUrl, speakerImgUrl]);

    return null;
}

async function updateWebinar(webinarId, formData, existingData) {
    let thumbnailUrl = existingData.webinar_thumbnail;
    let speakerImgUrl = existingData.speaker_image;
    const filesToRemoveOnSuccess = [];
    const uploadedFilesToRemoveOnError = [];

    try {
        const thumbnailFile = formData.get("webinar-thumbnail");
        if (thumbnailFile && thumbnailFile.name && thumbnailFile.size > 0) {
            const uploadedThumbnailUrl = await uploadWebinarFile(thumbnailFile, "thumbnails");
            uploadedFilesToRemoveOnError.push(uploadedThumbnailUrl);
            if (existingData.webinar_thumbnail) {
                filesToRemoveOnSuccess.push(existingData.webinar_thumbnail);
            }
            thumbnailUrl = uploadedThumbnailUrl;
        }

        const speakerImgFile = formData.get("webinar-speaker-img");
        if (speakerImgFile && speakerImgFile.name && speakerImgFile.size > 0) {
            const uploadedSpeakerImgUrl = await uploadWebinarFile(speakerImgFile, "speakers");
            uploadedFilesToRemoveOnError.push(uploadedSpeakerImgUrl);
            if (existingData.speaker_image) {
                filesToRemoveOnSuccess.push(existingData.speaker_image);
            }
            speakerImgUrl = uploadedSpeakerImgUrl;
        }
    } catch (error) {
        return error;
    }

    const { data, error } = await supabase
        .from("webinars")
        .update({
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
        .eq("id", webinarId)
        .select("id");

    if (error) {
        console.error("Database update error:", error);
        await removeWebinarFiles(uploadedFilesToRemoveOnError);
        return error;
    }

    if (!data || data.length === 0) {
        const rlsError = new Error("No webinar was updated. You may be missing an UPDATE policy in Supabase.");
        console.error(rlsError.message);
        await removeWebinarFiles(uploadedFilesToRemoveOnError);
        return rlsError;
    }

    await removeWebinarFiles(filesToRemoveOnSuccess);

    return null;
}

export async function loader({ params }) {
    const webinar = await getWebinar(params.id);

    if (!webinar) {
        throw new Response("Webinar not found", { status: 404 });
    }

    webinar.title = webinar.title || "";
    webinar.date = formatDisplayDate(webinar.date);
    webinar.speaker = webinar.speaker || "";
    webinar.speaker_university = webinar.speaker_university || "";
    webinar.speaker_details = webinar.speaker_details || "";
    webinar.speaker_image = webinar.speaker_image === "{}" ? null : webinar.speaker_image;
    webinar.webinar_url = webinar.webinar_url || null;
    webinar.webinar_thumbnail = webinar.webinar_thumbnail === "{}" ? null : webinar.webinar_thumbnail;
    webinar.webinar_description = webinar.webinar_description || "";

    return webinar;
}

export default function Webinar({ loaderData }) {
    const navigate = useNavigate();
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showResolvePopup, setShowResolvePopup] = useState(false);
    const [formRequired, setFormRequired] = useState({
        webinarTitle: false,
        webinarDate: false,
        webinarLink: false,
        webinarSpeakerName: false,
    });
    const [hasError, setHasError] = useState(false);

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

        const updateError = await updateWebinar(loaderData.id, formData, loaderData);
        if (updateError === null) {
            setShowResolvePopup(true);
        } else {
            console.error("Failed to update webinar:", updateError);
            setHasError(true);
        }
    }

    function handleShowEditPopupForm() {
        setFormRequired({
            webinarTitle: false,
            webinarDate: false,
            webinarLink: false,
            webinarSpeakerName: false,
        });
        setHasError(false);
        setShowEditPopup(true);
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
        setShowEditPopup(false);
        navigate(0);
    }

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

    async function handleDelete() {
        const deleteError = await deleteWebinar(loaderData.id, loaderData.webinar_thumbnail, loaderData.speaker_image);

        if (deleteError === null) {
            navigate({ pathname: "/webinars" });
        } else {
            console.error("Error during deletion:", deleteError);
            setHasError(true);
        }
    }

    return (
        <>
            {isAdmin &&
                <Popup id="delete-webinar" show={showDeletePopup} setShow={setShowDeletePopup}>
                    <div className="text-center mt-6">Delete this webinar?</div>
                    {hasError && <p className="text-error text-center my-2">An error occurred. Please try again later.</p>}
                    <div className="text-center mt-4">
                        <button type="button" className="button button-light button-delete" onClick={handleDelete}>Delete</button>
                    </div>
                </Popup>
            }

            {isAdmin &&
                <div className="z-1000 absolute top-0 left-0">
                    <PopupForm id="edit-webinar" show={showEditPopup} setShow={setShowEditPopup} validate={validate} hasError={hasError} encType="multipart/form-data">
                        <h4>Edit webinar</h4>
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-5 mb-5 relative">
                            <div>
                                <label htmlFor="webinar-title">Webinar title:</label><br />
                                <input id="webinar-title" name="webinar-title" type="text"
                                    className={inputClass(formRequired?.webinarTitle)}
                                    placeholder="Webinar title"
                                    defaultValue={loaderData.title}
                                    onChange={(e) => checkEmpty(e.target.value, "webinarTitle")} />
                                <div className="input-error">This field is required.</div>
                                <br /><br />
                                <label htmlFor="webinar-date">Webinar date:</label><br />
                                <input id="webinar-date" name="webinar-date" type="text"
                                    className={inputClass(formRequired?.webinarDate)}
                                    placeholder="YYYY/MM/DD"
                                    defaultValue={loaderData.date}
                                    onChange={(e) => checkEmpty(e.target.value, "webinarDate")} />
                                <div className="input-error">Use YYYY/MM/DD.</div>
                            </div>
                            <label>
                                Webinar thumbnail image:
                                <p className="text-sm text-disabled-dark">Leave empty to keep existing thumbnail.</p>
                                <input id="webinar-thumbnail" name="webinar-thumbnail" type="file" accept=".jpg,.jpeg,.png" className="ml-3" />
                            </label>
                        </div>

                        <div className="relative">
                            <label htmlFor="webinar-link">Webinar link:</label><br />
                            <p className="text-sm text-disabled-dark mt-1">This is the webinar link that will be embedded. Please only include the link and not the entire embed.</p>
                            <input id="webinar-link" name="webinar-link" type="text"
                                className={inputClass(formRequired?.webinarLink)}
                                placeholder="e.g. https://www.youtube.com/embed/VIDEO_ID or https://drive.google.com/file/d/...."
                                defaultValue={loaderData.webinar_url}
                                onChange={(e) => checkEmpty(e.target.value, "webinarLink")} />
                            <div className="input-error">This field is required.</div>
                            <br /><br />
                            <label htmlFor="webinar-desc">Webinar description:</label><br />
                            <textarea id="webinar-desc" name="webinar-desc" className="input input-text w-full h-30" placeholder="Enter your webinar description..." defaultValue={loaderData.webinar_description}></textarea>
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
                                        defaultValue={loaderData.speaker}
                                        onChange={(e) => checkEmpty(e.target.value, "webinarSpeakerName")} />
                                    <div className="input-error">This field is required.</div>
                                </div>
                                <div>
                                    <label htmlFor="webinar-speaker-uni">University:</label><br />
                                    <input id="webinar-speaker-uni" name="webinar-speaker-uni" type="text" className="input input-text w-full" placeholder="University" defaultValue={loaderData.speaker_university} />
                                </div>
                            </div>
                            <br />
                            <label>
                                Speaker image:
                                <p className="text-sm text-disabled-dark">Leave empty to keep existing speaker image.</p>
                                <input id="webinar-speaker-img" name="webinar-speaker-img" type="file" accept=".jpg,.jpeg,.png" className="ml-3" />
                            </label>
                            <br /><br />
                            <label htmlFor="webinar-speaker-desc">Description:</label><br />
                            <textarea id="webinar-speaker-desc" name="webinar-speaker-desc" className="input input-text w-full h-20" placeholder="Enter your speaker description..." defaultValue={loaderData.speaker_details}></textarea>
                        </fieldset>
                    </PopupForm>
                    <Popup id="resolve" className="text-center" show={showResolvePopup} setShow={setShowResolvePopup} closePopup={closeResolvePopup} nested stayOnBlur>
                        <br /><p className="m-2">Webinar updated successfully!</p>
                    </Popup>
                </div>
            }

            <Menu currentEndUrl="/webinars" />
            <Banner type="blue">
                <div className="relative z-1">
                    <a href="/webinars" className="banner-breadcrumb">
                        <i className="bi bi-caret-left-fill"></i>
                        <strong>WEBINARS</strong>
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
                        <button className="button button-light" onClick={handleShowEditPopupForm}>Edit Webinar</button>
                        <button className="button button-light button-delete" onClick={() => { setHasError(false); setShowDeletePopup(true); }}>Delete Webinar</button>
                    </div>
                ) : <></>}
                <div className="mb-5 w-full lg:h-[40vw] h-[50vw]">
                    <iframe src={loaderData.webinar_url} width="100%" height="100%"></iframe>
                </div>
                <p>{loaderData.webinar_description}</p>

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
    );
}
