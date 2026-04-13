import { useState, useEffect, useRef, useActionState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase";
import { Link } from "react-router";
import { Menu } from "../components/menu";
import { Popup, PopupForm } from "../components/popup";

export function meta() {
  return [
    { title: "IAJES Profile" },
    { name: "", content: "" },
  ];
}

async function getProfile(userId) {
  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('id', userId)
  return data[0] || error;
}

async function updateProfile(userId, formData) {
  const { error } = await supabase
    .from('users')
    .update({
      fname: formData.get("fname"),
      lname: formData.get("lname"),
      tagline: formData.get("tagline"),
      job_position: formData.get("job-position"),
      institution: formData.get("institution"),
      country: formData.get("country"),
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

export async function loader({ params }) {
  return getProfile(params.id);
}

function EditPopup({ showPopup, setShowPopup, userId }) {
  const navigate = useNavigate();
  const [formRequired, setFormRequired] = useState({ fname: false, lname: false });
  const [hasError, setHasError] = useState(false);
  const [draft, setDraft] = useState({});

  async function validate(formData) {
    let isValidated = true;
    const isRequired = {
      fname: formData.get('fname') === (null || ""),
      lname: formData.get('lname') === (null || "")
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
    if (update === null) {
      setShowPopup(false);
      navigate(0);
    } else {
      setHasError(true);
    }
  }

  async function loadInfo() {
      const profileInfo = await getProfile(userId);
      setDraft(profileInfo);
    }

  useEffect(() => {
    if (showPopup) {
      loadInfo();
      setHasError(false);
    }
  }, [showPopup])


  return (
    <PopupForm id="profile-edit" className="w-[70vw]" show={showPopup} setShow={setShowPopup} validate={validate} hasError={hasError}>
       <h4>Edit Profile</h4>
       <div className="flex flex-col gap-6">
        <fieldset>
          <div className="text-sm font-semibold text-secondary-dark">Personal Information</div>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div className="relative">
              <label htmlFor="first-name">First Name</label>
              <input
                id="first-name"
                name="fname"
                type="text"
                className={"input-text w-full " + (formRequired?.fname && "input-required")}
                defaultValue={draft.fname}
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
                defaultValue={draft.lname}
              />
              <div className="input-error">This field is required.</div>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="tagline">Tagline</label>
              <input
                id="tagline"
                name="tagline"
                type="text"
                className="input-text w-full"
                defaultValue={draft.tagline}
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
                defaultValue={draft.job_position}
              />
            </div>
            <div>
              <label htmlFor="institution">Institution</label>
              <input
                id="institution"
                name="institution"
                type="text"
                className="input-text w-full"
                defaultValue={draft.institution}
              />
            </div>
            <div>
              <label htmlFor="country">Country</label>
              <input
                id="country"
                name="country"
                type="text"
                className="input-text w-full"
                defaultValue={draft.country}
              />
            </div>
            <div>
              <label htmlFor="major">Major</label>
              <input
                id="major"
                name="major"
                type="text"
                className="input-text w-full"
                defaultValue={draft.major}
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="border-t-2 border-gray-light pt-4">
          <div className="text-sm font-semibold text-secondary-dark">Task Force</div>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="task-force">Task Force</label>
              <input
                id="task-force"
                name="task-force"
                type="text"
                className="input-text w-full"
                defaultValue={draft.task_force}
              />
            </div>
            <div>
              <label htmlFor="task-force-role">Task Force Role</label>
              <input
                id="task-force-role"
                name="task-force-role"
                type="text"
                className="input-text w-full"
                defaultValue={draft.task_force_role}
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="border-t-2 border-gray-light pt-4">
          <div className="text-sm font-semibold text-secondary-dark">Bio</div>
          <div className="mt-3 grid gap-4">
            <div>
              <label htmlFor="research-interests">Research Interests</label>
              <textarea
                id="research-interests"
                name="research-interests"
                type="text"
                className="input-text w-full"
                defaultValue={draft.research_interests}
              />
            </div>
            <div>
              <label htmlFor="biography">Biography</label>
              <textarea
                id="biography"
                name="biography"
                type="text"
                className="input-text w-full"
                defaultValue={draft.biography}
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="border-t-2 border-gray-light pt-4">
          <div className="text-sm font-semibold text-secondary-dark">Social Links</div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div>
              <label htmlFor="linkedin">LinkedIn</label>
              <input
                id="linkedin"
                name="url-linkedin"
                type="text"
                className="input-text w-full"
                defaultValue={draft.url_linkedin}
              />
            </div>
            <div>
              <label htmlFor="instagram">Instagram</label>
              <input
                id="instagram"
                name="url-instagram"
                type="text"
                className="input-text w-full"
                defaultValue={draft.url_instagram}
              />
            </div>
            <div>
              <label htmlFor="x">X (Twitter)</label>
              <input
                id="x"
                name="url-twitter"
                type="text"
                className="input-text w-full"
                defaultValue={draft.url_twitter}
              />
            </div>
            <div>
              <label htmlFor="facebook">Facebook</label>
              <input
                id="facebook"
                name="url-facebook"
                type="text"
                className="input-text w-full"
                defaultValue={draft.url_facebook}
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="url-website"
                type="text"
                className="input-text w-full"
                defaultValue={draft.url_website}
              />
            </div>
          </div>
        </fieldset>
      </div>
    </PopupForm>
  )
}

export default function ProfileRoute({ loaderData }) {
  const basePerson = loaderData;
  const [profile, setProfile] = useState(basePerson);
  const [showPopup, setShowPopup] = useState(false);
  const [showPhotoPopup, setShowPhotoPopup] = useState(false);
  const [photoDraftUrl, setPhotoDraftUrl] = useState(basePerson?.avatarUrl || "");
  const [photoObjectUrl, setPhotoObjectUrl] = useState("");
  const fileInputRef = useRef(null);

  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUserId(session?.user.id ?? null);
    });

    // Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUserId(session?.user.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setProfile(basePerson);
    setPhotoDraftUrl(basePerson?.avatarUrl || "");
    setPhotoObjectUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return "";
    });
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
      if (prev && prev !== profile.avatarUrl) URL.revokeObjectURL(prev);
      return url;
    });
    setPhotoDraftUrl(url);
    setShowPhotoPopup(true);
    event.target.value = "";
  };

  const handlePhotoSave = () => {
    setProfile((prev) => ({ ...prev, avatarUrl: photoDraftUrl }));
    setShowPhotoPopup(false);
  };

  const handlePhotoCancel = () => {
    if (photoObjectUrl && photoDraftUrl === photoObjectUrl && profile.avatarUrl !== photoObjectUrl) {
      URL.revokeObjectURL(photoObjectUrl);
      setPhotoObjectUrl("");
    }
    setPhotoDraftUrl(profile.avatarUrl || "");
    setShowPhotoPopup(false);
  };

  

  const photoPopupDetails = {
    content: (
      <div className="flex flex-col gap-4">
        <div className="text-lg font-semibold text-secondary-dark">Profile Photo</div>
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-48 w-48 items-center justify-center overflow-hidden rounded-md border-2 border-gray-light bg-gray-light">
            {photoDraftUrl ? (
              <img src={photoDraftUrl} alt="Profile preview" className="h-full w-full object-cover" />
            ) : (
              <i className="bi bi-person-fill text-[72px] text-secondary-dark/60" aria-hidden="true" />
            )}
          </div>
          <button type="button" className="button button-light" onClick={openPhotoPicker}>
            Change Photo
          </button>
          <div className="text-xs text-gray-dark/70">Changes apply after you click Save Changes.</div>
        </div>
      </div>
    ),
    buttons: [{ text: "Save Changes", onclick: handlePhotoSave }],
    defaultButton: { text: "Cancel", onclick: handlePhotoCancel },
    closeOnBlur: false,
  };

  const profilePhotoContent = profile.avatarUrl ? (
    <img
      src={profile.avatarUrl}
      alt={`${profile.fname} ${profile.lname}`}
      className="h-full w-full object-cover"
    />
  ) : (
    <i className="bi bi-person-fill text-[64px] text-secondary-dark/60" aria-hidden="true" />
  );

  return (
    <div className="min-h-screen bg-white">
      <EditPopup showPopup={showPopup} setShowPopup={setShowPopup} userId={currentUserId} />
      <Popup id="profile-photo" show={showPhotoPopup} setShow={setShowPhotoPopup} details={photoPopupDetails} />
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
        <div className="relative h-[220px] rounded-md bg-gray-light" aria-label="Profile banner placeholder">
          {currentUserId == profile.id ? (
            <div className="absolute right-5 top-5 flex flex-col gap-3">
              <IconSquare title="Edit" icon="bi-pencil" onClick={handleOpenEdit} />
            </div>
          ) : null}
        </div>

        <div className="-mt-16 rounded-md border-2 border-gray-light bg-white p-6 pt-16 shadow-sm relative z-10">
          <div className="grid gap-8 lg:grid-cols-[220px_1fr_300px]">
            <div className="flex flex-col items-center text-center">
              <div className="relative -mt-12">
                <div className="flex h-36 w-36 items-center justify-center rounded-full border-4 border-white bg-gray-light overflow-hidden">
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
              <p className="mt-1 text-sm text-gray-dark/70">
                {profile.job_position}, {profile.institution}
              </p>
              <p className="text-sm italic text-gray-dark/60">{profile.tagline}</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col w-full gap-4 sm:flex-row">
                { profile?.task_force &&
                  <div className="w-full rounded-md border-2 border-primary-light bg-white px-4 py-3 text-xs">
                    <p className="font-semibold text-secondary-dark">{profile.task_force_role}:</p>
                    <p className="mt-1 text-gray-dark/70">{profile.task_force}</p>
                  </div>
                }

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
              </div>

              <p className="leading-relaxed text-gray-dark/80">{profile.biography}</p>
            </div>

            <div className="flex flex-col gap-5 border-t border-gray-light pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <div className="grid gap-3 text-sm">
                <InfoRow label="Country" value={profile.country} />
                <InfoRow label="Institution" value={profile.institution} />
                <InfoRow label="Major" value={profile.major} />
                <InfoRow label="Research Interests" value={profile.research_interests} />
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
    </div>
  );
}

function InfoRow({ label, value }) {
  if (value !== (null || "")) {
    return (
      <div className="grid grid-cols-[140px_1fr] gap-4">
        <p className="italic text-gray-dark/60 py-0">{label}</p>
        <p className="font-semibold text-secondary-dark py-0">{value}</p>
      </div>
    );
  }
}

function IconSquare({ className, title, icon, onClick, small=false }) {
  const size = small ? "h-10 w-10 " : "h-12 w-12 ";
  return (
    <button
      type="button"
      title={title}
      className={"button button-light flex items-center justify-center text-xl shadow-sm transition hover:shadow-md " + size + className}
      onClick={onClick}
    >
      <i className={`bi ${icon}`} aria-hidden="true" />
    </button>
  );
}

function SocialIcon({ label, href, icon }) {
  if (href !== (null || "")) {
    
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
