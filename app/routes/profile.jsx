import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router";
import { Menu } from "../components/menu";
import { Popup } from "../components/popup";
import { supabase } from "../supabase";

function mapUserRow(row) {
  return {
    id: row.id,
    firstName: row.fname || "",
    lastName: row.lname || "",
    email: row.email || "",
    title: row.title || "",
    institution: row.institution || "",
    tagline: row.tagline || "",
    description: row.description || "",
    country: row.country || "",
    school: row.school || "",
    major: row.major || "",
    interests: row.interests || "",
    taskForceRole: row.task_force_role || "",
    taskForce: row.task_force || "",
    socials: {
      linkedin: row.linkedin || "",
      instagram: row.instagram || "",
      x: row.x || "",
      facebook: row.facebook || "",
      website: row.website || "",
    },
    avatarUrl: row.avatar_url || "",
  };
}

export default function ProfileRoute() {
  const params = useParams();
  const [profile, setProfile] = useState(null);
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showPhotoPopup, setShowPhotoPopup] = useState(false);
  const [photoDraftUrl, setPhotoDraftUrl] = useState("");
  const [photoObjectUrl, setPhotoObjectUrl] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProfile() {
      setLoading(true);

      // Fetch profile from users table
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", params.id)
        .single();

      if (cancelled) return;

      if (error || !data) {
        setProfile(null);
        setDraft(null);
        setLoading(false);
        return;
      }

      const mapped = mapUserRow(data);
      setProfile(mapped);
      setDraft(mapped);
      setPhotoDraftUrl(mapped.avatarUrl);

      // Check if this is the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!cancelled) {
        setIsCurrentUser(user?.id === params.id);
        setLoading(false);
      }
    }

    fetchProfile();
    return () => { cancelled = true; };
  }, [params.id]);

  useEffect(() => {
    return () => {
      if (photoObjectUrl) URL.revokeObjectURL(photoObjectUrl);
    };
  }, [photoObjectUrl]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Menu />
        <div className="mx-auto max-w-[1100px] px-6 pb-20 pt-12">
          <p className="text-gray-dark/70">Loading profile…</p>
        </div>
      </div>
    );
  }

  if (!profile) {
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
    setDraft(profile);
    setShowPopup(true);
  };

  const handleSave = () => {
    setProfile(draft);
    setShowPopup(false);
  };

  const updateField = (field) => (event) => {
    const value = event.target.value;
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const updateSocial = (field) => (event) => {
    const value = event.target.value;
    setDraft((prev) => ({ ...prev, socials: { ...prev.socials, [field]: value } }));
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
    setDraft((prev) => ({ ...prev, avatarUrl: photoDraftUrl }));
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

  const popupDetails = {
    content: (
      <div className="flex flex-col gap-4">
        <h4>Edit Profile</h4>
        <div className="max-h-[60vh] overflow-y-auto pr-2">
          <div className="flex flex-col gap-6">
            <section>
              <div className="text-sm font-semibold text-secondary-dark">Personal Information</div>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="first-name">First Name</label>
                  <input
                    id="first-name"
                    className="input-text w-full"
                    value={draft.firstName}
                    onChange={updateField("firstName")}
                  />
                </div>
                <div>
                  <label htmlFor="last-name">Last Name</label>
                  <input
                    id="last-name"
                    className="input-text w-full"
                    value={draft.lastName}
                    onChange={updateField("lastName")}
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    className="input-text w-full"
                    value={draft.email}
                    onChange={updateField("email")}
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="tagline">Tagline</label>
                  <input
                    id="tagline"
                    className="input-text w-full"
                    value={draft.tagline}
                    onChange={updateField("tagline")}
                  />
                </div>
              </div>
            </section>

            <section className="border-t-2 border-gray-light pt-4">
              <div className="text-sm font-semibold text-secondary-dark">Academic Information</div>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="title">Job/Position</label>
                  <input
                    id="title"
                    className="input-text w-full"
                    value={draft.title}
                    onChange={updateField("title")}
                  />
                </div>
                <div>
                  <label htmlFor="institution">Institution</label>
                  <input
                    id="institution"
                    className="input-text w-full"
                    value={draft.institution}
                    onChange={updateField("institution")}
                  />
                </div>
                <div>
                  <label htmlFor="country">Country</label>
                  <input
                    id="country"
                    className="input-text w-full"
                    value={draft.country}
                    onChange={updateField("country")}
                  />
                </div>
                <div>
                  <label htmlFor="school">School</label>
                  <input
                    id="school"
                    className="input-text w-full"
                    value={draft.school}
                    onChange={updateField("school")}
                  />
                </div>
                <div>
                  <label htmlFor="major">Major</label>
                  <input
                    id="major"
                    className="input-text w-full"
                    value={draft.major}
                    onChange={updateField("major")}
                  />
                </div>
              </div>
            </section>

            <section className="border-t-2 border-gray-light pt-4">
              <div className="text-sm font-semibold text-secondary-dark">Task Force</div>
              <div className="mt-3 grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="task-force-role">Task Force Role</label>
                  <input
                    id="task-force-role"
                    className="input-text w-full"
                    value={draft.taskForceRole}
                    onChange={updateField("taskForceRole")}
                  />
                </div>
                <div>
                  <label htmlFor="task-force">Task Force</label>
                  <input
                    id="task-force"
                    className="input-text w-full"
                    value={draft.taskForce}
                    onChange={updateField("taskForce")}
                  />
                </div>
              </div>
            </section>

            <section className="border-t-2 border-gray-light pt-4">
              <div className="text-sm font-semibold text-secondary-dark">Bio</div>
              <div className="mt-3 grid gap-4">
                <div>
                  <label htmlFor="interests">Research Interests</label>
                  <textarea
                    id="interests"
                    className="input-text w-full"
                    value={draft.interests}
                    onChange={updateField("interests")}
                  />
                </div>
                <div>
                  <label htmlFor="description">Biography</label>
                  <textarea
                    id="description"
                    className="input-text w-full"
                    value={draft.description}
                    onChange={updateField("description")}
                  />
                </div>
              </div>
            </section>

            <section className="border-t-2 border-gray-light pt-4">
              <div className="text-sm font-semibold text-secondary-dark">Social Links</div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div>
                  <label htmlFor="linkedin">LinkedIn</label>
                  <input
                    id="linkedin"
                    className="input-text w-full"
                    value={draft.socials.linkedin}
                    onChange={updateSocial("linkedin")}
                  />
                </div>
                <div>
                  <label htmlFor="instagram">Instagram</label>
                  <input
                    id="instagram"
                    className="input-text w-full"
                    value={draft.socials.instagram}
                    onChange={updateSocial("instagram")}
                  />
                </div>
                <div>
                  <label htmlFor="x">X (Twitter)</label>
                  <input
                    id="x"
                    className="input-text w-full"
                    value={draft.socials.x}
                    onChange={updateSocial("x")}
                  />
                </div>
                <div>
                  <label htmlFor="facebook">Facebook</label>
                  <input
                    id="facebook"
                    className="input-text w-full"
                    value={draft.socials.facebook}
                    onChange={updateSocial("facebook")}
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    className="input-text w-full"
                    value={draft.socials.website}
                    onChange={updateSocial("website")}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    ),
    buttons: [{ text: "Save Changes", onclick: handleSave }],
    defaultButton: { text: "Cancel", onclick: () => setShowPopup(false) },
    closeOnBlur: false,
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
      alt={`${profile.firstName} ${profile.lastName}`}
      className="h-full w-full object-cover"
    />
  ) : (
    <i className="bi bi-person-fill text-[64px] text-secondary-dark/60" aria-hidden="true" />
  );

  return (
    <div className="min-h-screen bg-white">
      <Popup id="profile-edit" show={showPopup} setShow={setShowPopup} details={popupDetails} />
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
          {isCurrentUser ? (
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
                {isCurrentUser ? (
                  <button
                    type="button"
                    className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-md border-2 border-white bg-white/90 text-secondary-dark shadow-sm transition hover:border-primary-light hover:bg-white hover:shadow-md hover:text-primary-light cursor-pointer"
                    aria-label="Change profile photo"
                    onClick={(event) => {
                      event.stopPropagation();
                      openPhotoPicker();
                    }}
                  >
                    <i className="bi bi-pencil" aria-hidden="true" />
                  </button>
                ) : null}
              </div>
              <div className="mt-5 text-xl font-semibold text-secondary-dark">
                {profile.firstName} {profile.lastName}
              </div>
              <div className="mt-2 text-sm text-gray-dark/70">
                {profile.title}, {profile.institution}
              </div>
              <div className="mt-2 text-sm italic text-gray-dark/60">{profile.tagline}</div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid w-full gap-4 sm:grid-cols-2">
                <div className="w-full rounded-md border-2 border-primary-light bg-white px-4 py-3 text-xs">
                  <div className="font-semibold text-secondary-dark">{profile.taskForceRole}:</div>
                  <div className="mt-1 text-gray-dark/70">{profile.taskForce}</div>
                </div>

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

              <p className="text-sm leading-relaxed text-gray-dark/80">{profile.description}</p>
            </div>

            <div className="flex flex-col gap-5 border-t border-gray-light pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <div className="grid gap-3 text-sm">
                <InfoRow label="Country" value={profile.country} />
                <InfoRow label="School" value={profile.school} />
                <InfoRow label="Major" value={profile.major} />
                <InfoRow label="Research Interests" value={profile.interests} />
              </div>

              <div className="flex items-center gap-4 text-xl text-secondary-light">
                <SocialIcon label="LinkedIn" href={profile.socials.linkedin} icon="bi-linkedin" />
                <SocialIcon label="Instagram" href={profile.socials.instagram} icon="bi-instagram" />
                <SocialIcon label="X" href={profile.socials.x} icon="bi-twitter-x" />
                <SocialIcon label="Facebook" href={profile.socials.facebook} icon="bi-facebook" />
                <SocialIcon label="Website" href={profile.socials.website} icon="bi-globe" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-4">
      <div className="italic text-gray-dark/60">{label}</div>
      <div className="font-semibold text-secondary-dark">{value}</div>
    </div>
  );
}

function IconSquare({ title, icon, onClick }) {
  return (
    <button
      type="button"
      title={title}
      className="button button-light flex h-12 w-12 items-center justify-center text-xl shadow-sm transition hover:shadow-md"
      onClick={onClick}
    >
      <i className={`bi ${icon}`} aria-hidden="true" />
    </button>
  );
}

function SocialIcon({ label, href, icon }) {
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
