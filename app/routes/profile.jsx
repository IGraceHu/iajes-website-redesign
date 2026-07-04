import { useState, useEffect, useRef, useActionState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { supabase } from "../supabase";
import { Link } from "react-router";
import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { Popup, PopupForm } from "../components/popup";
import { currentHasPermissions, getUserVerified } from "../helpers/permissions";
import "../styles/profile.css";
import { updateRequired } from "../helpers/form";

export function meta({ loaderData }) {
  if (loaderData?.person?.fname) {
    return [
      { title: loaderData.person.fname + " " + loaderData.person.lname },
      { name: "", content: "" },
    ];
  }
  return [
    { title: "Profile" },
    { name: "", content: "" },
  ];

}

const roleNames = new Map([
  ["member", "Member"],
  ["admin-super", "Superadmin"],
  ["admin-region-jheasa", "Regional Representative (JHEASA)"],
  ["admin-region-ajcu-na", "Regional Representative (AJCU-NA)"],
  ["admin-region-ausjal", "Regional Representative (AUSJAL)"],
  ["admin-region-kircher", "Regional Representative (KIRCHER)"],
  ["admin-region-ajcu-ap", "Regional Representative (AJCU-AP)"],
  ["admin-region-ajcu-am", "Regional Representative (AJCU-AM)"],
  ["admin-tf-rac", "TF Admin (Research & Academic Cooperation)"],
  ["admin-tf-wis", "TF Admin (Women in STEM)"],
  ["admin-tf-hea", "TF Admin (Health)"],
  ["admin-tf-aih", "TF Admin (Artificial Intelligence & Humanity)"],
  ["admin-tf-esj", "TF Admin (Engineering & Social Justice)"],
  ["admin-tf-htfi", "TF Admin (Humanitarian Tech & Frugal Innovation)"],
  ["admin-tf-infr", "TF Admin (Infrastructure)"],
  ["admin-tf-ene", "TF Admin (Energy)"],
  ["admin-newsletter", "Newsletter Admin"],
  ["admin-resources", "Resources Admin"],
  ["admin-university", "University Representative"]
]);

async function getTaskForces() {
  const { data, error } = await supabase
    .from('task forces')
    .select('name, url')
  if (data) {
    // const list = data.map((item) => item.name);
    return data;
  }
  return error;
}

async function getUniversities() {
  const { data, error } = await supabase
    .from('universities')
    .select('university')
  if (data) {
    data.sort((a, b) => { return a.university > b.university ? 1 : -1 });
    return data;
  }
  return error;
}

async function getProfile(userId) {
  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('id', userId);
  return data[0] || error;
}

async function updateProfile(userId, formData) {
  const { error } = await supabase
    .from('users')
    .update({
      fname: formData.get("fname"),
      lname: formData.get("lname"),
      allow_contact: formData.get("allow-contact") || false,
      languages: formData.get("languages"),
      banner_type: formData.get("banner-type"),
      tagline: formData.get("tagline"),
      job_position: formData.get("job-position"),
      institution: formData.get("institution"),
      country: formData.get("country"),
      region: formData.get("region"),
      major: formData.get("major"),
      task_force: formData.get("task-force"),
      task_force_role: formData.get("task-force-role"),
      research_interests: formData.get("research-interests"),
      biography: formData.get("biography"),
      url_linkedin: formData.get("url-linkedin"),
      url_instagram: formData.get("url-instagram"),
      url_twitter: formData.get("url-twitter"),
      url_facebook: formData.get("url-facebook"),
      url_website: formData.get("url-website")
    })
    .eq('id', userId)
  return error;
}

async function uploadProfileImage(userId, file) {
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const path = `${userId}/${Date.now()}-${safeName}`;
  const { error: uploadError } = await supabase.storage
    .from('user-images')
    .upload(path, file);
  if (uploadError) {
    console.error("Error uploading profile image:", uploadError);
    return { error: uploadError };
  }
  const { data } = supabase.storage.from('user-images').getPublicUrl(path);
  return { url: data.publicUrl };
}

function getStoragePathFromPublicUrl(url, bucket) {
  if (!url) return null;
  const marker = `/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

async function updateProfileImage(userId, imageUrl) {
  const { error } = await supabase
    .from('users')
    .update({ image_url: imageUrl })
    .eq('id', userId);
  return error;
}

export async function loader({ params }) {
  const person = await getProfile(params.id);
  if (!person) {
    throw new Response("Profile not found", { status: 404 });
  }
  const taskForceList = await getTaskForces();
  const universityList = await getUniversities();
  universityList.push("Other");
  return { person: person, taskForceList: taskForceList, universityList: universityList };
}

async function syncNewsletterSubscription(email, wantsSubscribe) {
  if (!email || !email.includes("@")) {
    return null;
  }

  const response = await fetch("/profile-subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ op: wantsSubscribe ? "subscribe" : "unsubscribe", email }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.message || "Unable to update newsletter subscription.");
  }

  return result;
}

async function checkNewsletterSubscription(email) {
  if (!email || !email.includes("@")) {
    return false;
  }

  const response = await fetch("/profile-subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ op: "check", email }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.message || "Unable to check newsletter subscription.");
  }

  return !!result.confirmed_at;
}

function EditPopup({ showPopup, setShowPopup, userId, taskForceList, universityList, currentUserId }) {
  const navigate = useNavigate();
  const [formRequired, setFormRequired] = useState({ fname: false, lname: false, urlLinkedin: false, urlInstagram: false, urlTwitter: false, urlfacebook: false, urlWebsite: false });
  const [hasError, setHasError] = useState(false);
  const [draft, setDraft] = useState({});
  const [subscribeChecked, setSubscribeChecked] = useState(false);

  async function validate(formData) {
    let isValidated = true;
    const isRequired = {
      fname: formData.get('fname') === (null || ""),
      lname: formData.get('lname') === (null || ""),
      urlLinkedin: (formData.get('url-linkedin') && !formData.get('url-linkedin').match(/https:\/\//)),
      urlInstagram: (formData.get('url-instagram') && !formData.get('url-instagram').match(/https:\/\//)),
      urlTwitter: (formData.get('url-twitter') && !formData.get('url-twitter').match(/https:\/\//)),
      urlFacebook: (formData.get('url-facebook') && !formData.get('url-facebook').match(/https:\/\//)),
      urlWebsite: (formData.get('url-website') && !formData.get('url-website').match(/https:\/\//))
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

    const update = await updateProfile(userId, formData);
    try {
      const wantsSubscribe = formData.get("subscribe-news") === "on";
      const email = (draft?.email || "").trim().toLowerCase();
      const result = await syncNewsletterSubscription(email, wantsSubscribe);
      if (result?.success) {
        alert(wantsSubscribe ? "Successfully subscribed to IAJES News." : "Successfully unsubscribed from IAJES News.");
      }
    } catch (err) {
      console.error('Subscription update error', err);
    }

    if (update === null) {
      setShowPopup(false);
      navigate("/profile/" + userId);
    } else {
      setHasError(true);
    }
  }

  async function loadInfo() {
    const profileInfo = await getProfile(userId);
    setDraft(profileInfo);
    setFormRequired({ fname: false, lname: false, urlLinkedin: false, urlInstagram: false, urlTwitter: false, urlfacebook: false, urlWebsite: false })
    try {
      const email = (profileInfo?.email || "").trim().toLowerCase();
      if (email) {
        const subscribed = await checkNewsletterSubscription(email);
        setSubscribeChecked(subscribed);
      }
    } catch (err) {
      console.error('Error checking subscription', err);
    }
  }

  useEffect(() => {
    if (showPopup) {
      loadInfo();
      setHasError(false);
      setFormRequired({ fname: false, lname: false, urlLinkedin: false, urlInstagram: false, urlTwitter: false, urlfacebook: false, urlWebsite: false })
    }
  }, [showPopup])

  function checkEmpty(value, inputName) {
    const updatedFormRequired = updateRequired(value, inputName, formRequired);
    if (updatedFormRequired != formRequired) {
      setFormRequired(updatedFormRequired);
    }
  }

  function urlChange(inputName) {
    const updatedFormRequired = structuredClone(formRequired);
    updatedFormRequired[inputName] = false;
    if (updatedFormRequired != formRequired) {
      setFormRequired(updatedFormRequired);
    }
  }

  return (
    <PopupForm id="profile-edit" className="w-[70vw]" show={showPopup} setShow={setShowPopup} validate={validate} hasError={hasError}>
      <h4>Edit Profile</h4>
      <div className="flex flex-col gap-6">
        <fieldset>
          <div className="text-sm font-semibold text-secondary-dark">Personal Information</div>
          <div className="mt-3 grid gap-5 md:grid-cols-2">
            <div className="relative">
              <label htmlFor="first-name">First Name</label>
              <input
                id="first-name"
                name="fname"
                type="text"
                className={"input-text w-full " + (formRequired?.fname && "input-required")}
                defaultValue={draft.fname} placeholder="First name" onChange={(e) => checkEmpty(e.target.value, "fname")}
              />
              <div className="input-error">This field is required.</div>
            </div>
            <div className="relative">
              <label htmlFor="last-name">Last Name</label>
              <input
                id="last-name"
                name="lname"
                type="text"
                className={"input-text w-full " + (formRequired?.lname && "input-required")}
                defaultValue={draft.lname} placeholder="Last name" onChange={(e) => checkEmpty(e.target.value, "lname")}
              />
              <div className="input-error">This field is required.</div>
            </div>
            <div className="md:col-span-2">
              <div className="flex flex-col md:flex-row md:items-center md:gap-6">
                <label htmlFor="allow-contact" className="checkbox">
                  <input id="allow-contact" name="allow-contact" type="checkbox"
                    className={""} defaultChecked={draft.allow_contact}
                    disabled={currentUserId != userId}
                  /><p>Allow site visitors without an account and unverified IAJES members to contact you?</p>
                </label>

                <label htmlFor="subscribe-news" className="checkbox">
                  <input id="subscribe-news" name="subscribe-news" type="checkbox"
                    className={""} checked={subscribeChecked} onChange={(e) => setSubscribeChecked(e.target.checked)}
                    disabled={currentUserId != userId}
                  /><p>Subscribe to IAJES News</p>
                </label>
              </div>
              <div className="w-full p-2 text-sm text-disabled-light italic">All IAJES members with verified accounts will be able to contact you.</div>
            </div>
            <div className="">
              <label htmlFor="languages">Languages</label>
              <input
                id="languages"
                name="languages"
                type="text"
                className="input-text w-full"
                defaultValue={draft.languages} placeholder="Languages"
              />
            </div>
            <div>
              <p>Banner Type:</p>
              <div className="mt-1">
                <label htmlFor="banner-type-0" className="radio-button gray">
                  <input id="banner-type-0" type="radio" name="banner-type" value="0" defaultChecked={draft.banner_type == 0} /><p>Gray</p>
                </label>
                <label htmlFor="banner-type-1" className="radio-button green">
                  <input id="banner-type-1" type="radio" name="banner-type" value="1" defaultChecked={draft.banner_type == 1} /><p>Green</p>
                </label>
                <label htmlFor="banner-type-2" className="radio-button blue">
                  <input id="banner-type-2" type="radio" name="banner-type" value="2" defaultChecked={draft.banner_type == 2} /><p>Blue</p>
                </label>
                <label htmlFor="banner-type-3" className="radio-button dark-blue">
                  <input id="banner-type-3" type="radio" name="banner-type" value="3" defaultChecked={draft.banner_type == 3} /><p>Dark Blue</p>
                </label>
              </div>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="tagline">Tagline</label>
              <input
                id="tagline"
                name="tagline"
                type="text"
                className="input-text w-full"
                defaultValue={draft.tagline} placeholder="Tagline"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="biography">Biography</label>
              <textarea
                id="biography"
                name="biography"
                type="text"
                className="input-text w-full h-40"
                defaultValue={draft.biography} placeholder="Biography..."
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="border-t-2 border-gray-light pt-4">
          <div className="text-sm font-semibold text-secondary-dark">Academic Information</div>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="job-position">Job/Position</label>
              <input
                id="job-position"
                name="job-position"
                type="text"
                className="input-text w-full"
                defaultValue={draft.job_position} placeholder="Job/Position"
              />
            </div>
            <div>
              <label htmlFor="major">Academic Focus</label>
              <input
                id="major"
                name="major"
                type="text"
                className="input-text w-full"
                defaultValue={draft.major} placeholder="Academic Focus"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="institution">University</label>
              <input list="institution" name="institution" className="input-text w-full" placeholder="University" defaultValue={draft.institution} />
              <datalist
                id="institution"
                className="input-text w-full"
              >
                {(universityList) ? universityList.map((universityObj, idx) => <option key={"uni-" + idx} value={universityObj.university} selected={universityObj.university == draft.institution}>{universityObj.university}</option>) : <></>}
              </datalist>
            </div>
            <div>
              <label htmlFor="country">Country</label>
              <input
                id="country"
                name="country"
                type="text"
                className="input-text w-full"
                defaultValue={draft.country} placeholder="Country"
              />
            </div>
            <div>
              <label htmlFor="region">Region</label>
              <select id="region" name="region" className="input input-text w-full" >
                <option value="">Select a region</option>
                <option value="JHEASA" selected={"JHEASA" == draft.region}>JHEASA</option>
                <option value="AJCU-NA" selected={"AJCU-NA" == draft.region}>AJCU - NA</option>
                <option value="AUSJAL" selected={"AUSJAL" == draft.region}>AUSJAL</option>
                <option value="KIRCHER" selected={"KIRCHER" == draft.region}>KIRCHER</option>
                <option value="AJCU-AP" selected={"AJCU-AP" == draft.region}>AJCU - AP</option>
                <option value="AJCU-AM" selected={"AJCU-AM" == draft.region}>AJCU - AM</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="research-interests">Research Interests</label>
              <textarea
                id="research-interests"
                name="research-interests"
                type="text"
                className="input-text w-full"
                defaultValue={draft.research_interests} placeholder="Research interests..."
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="border-t-2 border-gray-light pt-4">
          <div className="text-sm font-semibold text-secondary-dark">Task Force</div>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="task-force">Task Force</label>
              <select id="task-force" name="task-force" className="input input-text w-full" >
                <option value="">None</option>
                {(taskForceList) ? taskForceList.map((taskForce) => <option key={taskForce.url} value={taskForce.name} selected={taskForce.name == draft.task_force}>{taskForce.name}</option>) : <></>}
              </select>
            </div>
            <div>
              <label htmlFor="task-force-role">Task Force Role</label>
              <input
                id="task-force-role"
                name="task-force-role"
                type="text"
                className="input-text w-full"
                defaultValue={draft.task_force_role} placeholder="Task Force Role"
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="border-t-2 border-gray-light pt-4">
          <div className="text-sm font-semibold text-secondary-dark">Social Links</div>
          <div className="mt-3 grid gap-x-3 gap-y-5 md:grid-cols-2">
            <div>
              <label htmlFor="linkedin">LinkedIn</label>
              <input
                id="linkedin"
                name="url-linkedin"
                type="text"
                className={"input input-text w-full " + (formRequired?.urlLinkedin && "input-required")}
                onChange={() => urlChange("urlLinkedin")}
                defaultValue={draft.url_linkedin} placeholder="LinkedIn URL"
              />
              <div className="input-error">Invalid link.</div>
            </div>
            <div>
              <label htmlFor="instagram">Instagram</label>
              <input
                id="instagram"
                name="url-instagram"
                type="text"
                className={"input input-text w-full " + (formRequired?.urlInstagram && "input-required")}
                onChange={() => urlChange("urlInstagram")}
                defaultValue={draft.url_instagram} placeholder="Instagram URL"
              />
              <div className="input-error">Invalid link.</div>
            </div>
            <div>
              <label htmlFor="x">X (Twitter)</label>
              <input
                id="x"
                name="url-twitter"
                type="text"
                className={"input input-text w-full " + (formRequired?.urlTwitter && "input-required")}
                onChange={() => urlChange("urlTwittern")}
                defaultValue={draft.url_twitter} placeholder="X (Twitter) URL"
              />
              <div className="input-error">Invalid link.</div>
            </div>
            <div>
              <label htmlFor="facebook">Facebook</label>
              <input
                id="facebook"
                name="url-facebook"
                type="text"
                className={"input input-text w-full " + (formRequired?.urlFacebook && "input-required")}
                onChange={() => urlChange("urlFacebook")}
                defaultValue={draft.url_facebook} placeholder="Facebook URL"
              />
              <div className="input-error">Invalid link.</div>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="url-website"
                type="text"
                className={"input input-text w-full " + (formRequired?.urlWebsite && "input-required")}
                onChange={() => urlChange("urlWebsite")}
                defaultValue={draft.url_website} placeholder="Website URL"
              />
              <div className="input-error">Invalid link.</div>
            </div>
          </div>
        </fieldset>
      </div>
    </PopupForm>
  )
}

export default function ProfileRoute({ loaderData }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAdmin, setIsAdmin] = useState(false);


  const basePerson = loaderData.person || {};
  const [profile, setProfile] = useState(basePerson);
  const [showPopup, setShowPopup] = useState(false);
  const [showPhotoPopup, setShowPhotoPopup] = useState(false);
  const [photoDraftUrl, setPhotoDraftUrl] = useState(basePerson?.image_url || "");
  const [photoObjectUrl, setPhotoObjectUrl] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoSaving, setPhotoSaving] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const fileInputRef = useRef(null);

  const [currentUserId, setCurrentUserId] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  const userTaskForceUrl = loaderData.taskForceList.find((val, index, array) => {
    return val.name == basePerson.task_force;
  })?.url;

  let bannerClass = "-gray-light"
  switch (basePerson.banner_type) {
    case 1:
      bannerClass = "-primary-dark";
      break;
    case 2:
      bannerClass = "-secondary-light";
      break;
    case 3:
      bannerClass = "-secondary-dark";
      break;
  };


  useEffect(() => {

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUserId(session?.user.id ?? null);
      currentHasPermissions(session?.user.id).then(
        function (hasPermissions) { setIsAdmin(hasPermissions); }
      );
      if (session?.user.id) {
        getUserVerified(session?.user.id).then(
          function (verified) { setIsVerified(verified) }
        )
      }
    });

    // Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUserId(session?.user.id ?? null);
      currentHasPermissions(session?.user.id).then(
        function (hasPermissions) { setIsAdmin(hasPermissions); }
      );
      if (session?.user.id) {
        getUserVerified(session?.user.id).then(
          function (verified) { setIsVerified(verified) }
        )
      }
      if (searchParams.get('new') && (session?.user.id == basePerson?.id)) {
        setShowPopup(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setProfile(basePerson);
    setPhotoDraftUrl(basePerson?.image_url || "");
    setPhotoObjectUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return "";
    });
    setPhotoFile(null);
    setPhotoError("");
  }, [basePerson]);

  useEffect(() => {
    return () => {
      if (photoObjectUrl) URL.revokeObjectURL(photoObjectUrl);
    };
  }, [photoObjectUrl]);

  // If user id is invalid
  if (!basePerson || !profile) {
    return (
      <div className="min-h-screen bg-white">
        <Menu />
        <div className="mx-auto max-w-[1100px] px-6 pb-20 pt-12">
          <h1>Profile</h1>
          <p className="text-gray-dark/70">No profile found for id: {params.id}</p>
          <Link to="/search" className="font-semibold text-primary-dark">
            Back to People
          </Link>
        </div>
      </div>
    );
  }

  const handleOpenEdit = () => {
    setShowPopup(true);
  };


  const openPhotoPicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePhotoSelection = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoObjectUrl((prev) => {
      if (prev && prev !== profile.image_url) URL.revokeObjectURL(prev);
      return url;
    });
    setPhotoDraftUrl(url);
    setPhotoFile(file);
    setPhotoError("");
    setShowPhotoPopup(true);
    event.target.value = "";
  };

  const handlePhotoSave = async () => {
    if (!photoFile || !currentUserId || currentUserId !== profile.id) {
      setShowPhotoPopup(false);
      return;
    }
    setPhotoSaving(true);
    setPhotoError("");

    const uploadResult = await uploadProfileImage(currentUserId, photoFile);
    if (uploadResult.error) {
      setPhotoError("Failed to upload image. Please try again.");
      setPhotoSaving(false);
      return;
    }

    const dbError = await updateProfileImage(currentUserId, uploadResult.url);
    if (dbError) {
      console.error("Error saving image URL to profile:", dbError);
      setPhotoError("Image uploaded but profile update failed. Please try again.");
      setPhotoSaving(false);
      return;
    }

    const previousPath = getStoragePathFromPublicUrl(profile.image_url, 'user-images');
    if (previousPath) {
      const { error: removeError } = await supabase.storage
        .from('user-images')
        .remove([previousPath]);
      if (removeError) {
        console.error("Error removing previous profile image:", removeError);
      }
    }

    setProfile((prev) => ({ ...prev, image_url: uploadResult.url }));
    setPhotoFile(null);
    setPhotoSaving(false);
    setShowPhotoPopup(false);
    navigate(0);
  };

  const handlePhotoCancel = () => {
    if (photoObjectUrl && photoDraftUrl === photoObjectUrl && profile.image_url !== photoObjectUrl) {
      URL.revokeObjectURL(photoObjectUrl);
      setPhotoObjectUrl("");
    }
    setPhotoDraftUrl(profile.image_url || "");
    setPhotoFile(null);
    setPhotoError("");
    setShowPhotoPopup(false);
  };


  const profilePhotoContent = profile.image_url ? (
    <img
      src={profile.image_url}
      alt={`${profile.fname} ${profile.lname}`}
      className="h-full w-full object-cover"
    />
  ) : (
    <i className="bi bi-person-fill text-[64px] text-secondary-dark/60" aria-hidden="true" />
  );

  return (
    <div className="min-h-screen bg-white">
      <EditPopup showPopup={showPopup} setShowPopup={setShowPopup} userId={profile.id} taskForceList={loaderData.taskForceList} universityList={loaderData.universityList} currentUserId={currentUserId} />
      <Popup
        id="profile-photo"
        show={showPhotoPopup}
        setShow={setShowPhotoPopup}
        closePopup={handlePhotoCancel}
        stayOnBlur
        buttons={[{ text: photoSaving ? "Saving..." : "Save Changes", onclick: handlePhotoSave }]}
      >
        <div className="flex flex-col gap-4">
          <div className="text-lg font-semibold text-secondary-dark">Profile Photo</div>
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-48 w-48 items-center justify-center overflow-hidden rounded-full border-2 border-gray-light bg-gray-light">
              {photoDraftUrl ? (
                <img src={photoDraftUrl} alt="Profile preview" className="h-full w-full object-cover" />
              ) : (
                <i className="bi bi-person-fill text-[72px] text-secondary-dark/60" aria-hidden="true" />
              )}
            </div>
            <button type="button" className="button button-light" onClick={openPhotoPicker} disabled={photoSaving}>
              Change Photo
            </button>
            <div className="text-xs text-gray-dark/70">Changes apply after you click Save Changes.</div>
            {photoSaving && <div className="text-xs text-gray-dark/70">Uploading...</div>}
            {photoError && <div className="text-xs text-error">{photoError}</div>}
          </div>
        </div>
      </Popup>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoSelection}
      />
      <Menu />

      <div className="mx-auto max-w-[1200px] px-6 pb-20 pt-8">
        <div className="mb-4 flex justify-start">
          <a href="/search" className="button button-light flex items-center gap-2">
            <i className="bi bi-arrow-left-short" aria-hidden="true" />
            Back to Search
          </a>
        </div>
        <div className={"relative h-[220px] rounded-md overflow-hidden bg" + bannerClass} aria-label="Profile banner placeholder">
          <div className={"relative w-full opacity-50"}>
            <img className="absolute w-50 transform-[rotate(30deg)_rotateY(180deg)] -top-25 -left-5" src="/assets/landing-disc-4b.svg" />
          </div>
          {(currentUserId == profile.id) || isAdmin ? (
            <div className="absolute right-5 top-5 flex flex-col gap-3">
              <IconSquare title="Edit" icon="bi-pencil" onClick={handleOpenEdit}>
                <p className="text-base mr-3">Edit Profile</p>
              </IconSquare>
            </div>
          ) : null}
        </div>

        {/* This makes the colors able to be used by border cuz Tailwind gets confused if it isnt explicitly written */}
        <span className="border-primary-dark border-secondary-light border-secondary-dark"></span>

        <div className={"-mt-16 rounded-md border-2 bg-white p-6 pt-16 shadow-sm relative z-10 border" + bannerClass}>
          <div className="grid gap-8 lg:grid-cols-[220px_1fr_300px]">
            <div className="flex flex-col items-center text-center">
              <div className="relative -mt-8">
                <div className="flex h-36 w-36 items-center justify-center rounded-full border-3 border-primary-dark bg-gray-light overflow-hidden">
                  {profilePhotoContent}
                </div>
                {currentUserId == profile.id ? (
                  <IconSquare className="absolute bottom-1 right-1" title="Change Profile Photo" icon="bi-pencil" small
                    onClick={(event) => {
                      event.stopPropagation();
                      openPhotoPicker();
                    }}
                  />
                ) : null}
              </div>
              <h4 className="mt-5">
                {profile.fname} {profile.lname}
              </h4>
              <div className="text-center">
                {profile.roles.map((role, idx) => {
                  if (role.startsWith("admin-region") || role.startsWith("admin-university")) {
                    return <div key={"role-" + idx} className="text-xs inline-block me-2 mb-2 last:me-0 px-2 py-1 shrink-0 text-secondary-light border-2 border-primary-light border-2 rounded-md">{roleNames.get(role)}</div>
                  }
                })}
              </div>
              <p className="mt-1 text-sm text-gray-dark/70">
                {profile.job_position}{profile?.job_position && profile?.institution && <span>, </span>}{profile.institution}
              </p>
              <p className="text-sm italic text-gray-dark/60">{profile.tagline}</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col w-full gap-4 sm:flex-row">
                {profile?.task_force &&
                  <a href={"/task-forces/" + userTaskForceUrl} className="w-full rounded-md border-2 border-primary-light bg-white px-4 py-3 text-sm hover:border-secondary-light">
                    <p className="font-semibold text-secondary-dark">{profile.task_force}</p>
                    {profile?.task_force_role &&
                      <p className="mt-1 text-gray-dark/70">{profile.task_force_role}</p>}
                  </a>
                }

                {(profile?.allow_contact || ((currentUserId != null) && (isVerified))) &&
                  <button
                    type="button"
                    className="button flex w-full items-center justify-center gap-3 text-lg font-semibold"
                    onClick={() => {
                      window.location.href = `mailto:${profile.email}?subject=IAJES%20Connection`;
                    }}
                  >
                    <i className="bi bi-envelope" aria-hidden="true" />
                    Contact
                  </button>
                }
              </div>

              <p className="leading-relaxed text-gray-dark/80">{profile.biography}</p>
            </div>

            <div className="flex flex-col gap-5 border-t border-gray-light pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <div className="grid gap-3 text-sm">
                {profile.region && <InfoRow label="Region" value={profile.region} />}
                {profile.country && <InfoRow label="Country" value={profile.country} />}
                {profile.languages && <InfoRow label="Languages" value={profile.languages} />}
                {profile.institution && <InfoRow label="Institution" value={profile.institution} />}
                {profile.major && <InfoRow label="Academic Focus" value={profile.major} />}
                {profile.research_interests && <InfoRow label="Research Interests" value={profile.research_interests} />}
              </div>

              <div className="flex items-center gap-4 text-xl text-secondary-light">
                <SocialIcon label="LinkedIn" href={profile.url_linkedin} icon="bi-linkedin" />
                <SocialIcon label="Instagram" href={profile.url_instagram} icon="bi-instagram" />
                <SocialIcon label="X" href={profile.url_twitter} icon="bi-twitter-x" />
                <SocialIcon label="Facebook" href={profile.url_facebook} icon="bi-facebook" />
                <SocialIcon label="Website" href={profile.url_website} icon="bi-globe" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function InfoRow({ label, value }) {
  if (value !== (null || "")) {
    return (
      <div className="grid grid-cols-[70px_1fr] gap-4">
        <p className="italic text-gray-dark/60 py-0">{label}</p>
        <p className="font-semibold text-secondary-dark py-0">{value}</p>
      </div>
    );
  }
}

function IconSquare({ className, title, icon, onClick, small = false, children }) {
  const size = small ? "h-10 w-10 " : "h-12 min-w-12 ";
  return (
    <button
      type="button"
      title={title}
      className={"button button-light flex items-center justify-center text-xl shadow-sm transition hover:shadow-md " + size + className}
      onClick={onClick}
    >
      {children}
      <i className={`bi ${icon}`} aria-hidden="true" />
    </button>
  );
}

function SocialIcon({ label, href, icon }) {
  if (href !== null && href !== "") {

    return (
      <a
        href={href}
        aria-label={label}
        className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-gray-light bg-white text-secondary-light transition hover:border-primary-light"
        onClick={(event) => {
          if (href === "#") event.preventDefault();
        }}
      >
        <i className={`bi ${icon}`} aria-hidden="true" />
      </a>
    );

  }
}
