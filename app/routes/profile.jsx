import { useState, useEffect, useRef, useActionState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { supabase } from "../supabase";
import { Link } from "react-router";
import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { MultiSelect } from "../components/multi-select";
import { Popup, PopupForm } from "../components/popup";
import { currentHasPermissions, getUserVerified } from "../helpers/permissions";
import { ROLENAMES, LANGUAGEDATA, ENGINEERINGDATA, COUNTRYDATA } from "../helpers/listdata";
import "../styles/profile.css";
import { updateRequired } from "../helpers/form";
// NOTE: adjust this path if newsletter.server.js lives somewhere else in your project.
// This import (and everything it pulls in, like supabaseAdmin) is safe here because it is
// only ever called from the `action` export below, which React Router only runs on the server.
import { isSubscribed, subscribeConfirmedUser, unsubscribeByEmail } from "../server/newsletter.server";

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

const tempUserData = {
  fname: "First",
  lname: "Last",
  roles: ['member'],
  is_seen_by_visitors: true,
  is_contact_by_visitors: true,
  is_contact_by_members: true,
  is_subscribed: false,
  banner_type: 1,
  biography: "",

  engineering_type: [],
  position_type: [],
  title: "",
  tech_interests: [],
  general_interests: [],
  is_get_interest_info: false,
  
  university: "",
  country: "",
  region: "",

  tf_interests: [],

  links: [],
  resume_pdf_url: ""
}


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
  if (data[0]) {
    const profile = data[0];
    profile.fname = profile.fname || "";
    profile.lname = profile.lname || "";
    profile.roles = profile.roles || ["member"];
    profile.is_seen_by_visitors = profile.is_seen_by_visitors;
    profile.is_contact_by_visitors = profile.is_contact_by_visitors;
    profile.is_contact_by_members = profile.is_contact_by_members;
    profile.banner_type = profile.banner_type || 1; 
    profile.biography = profile.biography || "";
    profile.languages = profile.languages || [];

    profile.engineering_type = profile.engineering_type || [];
    profile.position_type = profile.position_type || [];
    profile.title = profile.title || ""
    profile.tech_interests = profile.tech_interests || [];
    profile.general_interests = profile.general_interests || [];
    profile.is_get_interest_info = profile.is_get_interest_info;
    
    profile.university = profile.university || "";
    profile.country = profile.country || "";
    profile.region = profile.region || "";

    profile.tf_interests = profile.tf_interests || [];

    if (data[0].links == "" || data[0].links == null) {
      data[0].links = [];
    } else {
      try {
        data[0].links = JSON.parse(data[0].links);
      } catch(e) {
        data[0].links = [];
      }
    }
    
    profile.resume_pdf_url = profile.resume_pdf_url || "";

    // Newsletter subscription lives in its own admin-only table, so it's
    // looked up separately here (this function only ever runs server-side,
    // inside the `loader` below).
    profile.is_subscribed = profile.email ? await isSubscribed(profile.email) : false;

    return data[0]
  }
  return error;
}

async function updateProfile(userId, formData, links) {
  const linksJSON = JSON.stringify(links);

  const { error } = await supabase
    .from('users')
    .update({
      fname: formData.get("fname"),
      lname: formData.get("lname"),
      is_seen_by_visitors: formData.get("is-seen-by-visitors") || false,
      is_contact_by_visitors: formData.get("is-contact-by-visitors") || false,
      is_contact_by_members: formData.get("is-contact-by-members") || false,
      banner_type: formData.get("banner-type"),
      biography: formData.get("biography"),
      languages: formData.getAll("languages"),

      engineering_type: formData.getAll("engineering-type"),
      position_type: formData.getAll("position-type"),
      title: formData.get("title"),
      tech_interests: formData.getAll("tech-interests"),
      general_interests: formData.getAll("general-interests"),
      is_get_interest_info: formData.get("is-get-interest-info") || false,
      
      university: formData.get("university"),
      country: formData.get("country"),
      region: formData.get("region"),

      tf_interests: formData.getAll("tf-interests"),

      links: linksJSON,
      resume_pdf_url: formData.get("resume-pdf-url")
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
  const taskForceList = await getTaskForces();
  const universityList = await getUniversities();
  universityList.push({university: "Other"});
  universityList.push({university: "Not Applicable"});

  const person = await getProfile(params.id);
  if (!person) {
    throw new Response("Profile not found", { status: 404 });
  }
  return { person: person, taskForceList: taskForceList, universityList: universityList };
}

// Called from the client (see validate() in EditPopup) to add/remove the
// subscriber row. This posts back to this same route, so no new route is
// needed - React Router just runs the `action` export below on the server.
async function syncNewsletterSubscription(email, wantsSubscribe) {
  if (!email || !email.includes("@")) {
    return null;
  }

  const body = new FormData();
  body.set("intent", "sync-newsletter");
  body.set("email", email);
  body.set("subscribe", wantsSubscribe ? "true" : "false");

  const response = await fetch(window.location.pathname, {
    method: "POST",
    body,
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok || result?.error) {
    throw new Error(result?.error || "Unable to update newsletter subscription.");
  }

  return result;
}

// Server-side action for this route. Handles the newsletter add/remove so
// the service-role supabaseAdmin client never has to touch the browser.
export async function action({ request }) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "sync-newsletter") {
    const email = (formData.get("email") || "").toString().trim().toLowerCase();
    const wantsSubscribe = formData.get("subscribe") === "true";

    if (!email || !email.includes("@")) {
      return Response.json({ error: "A valid email is required." }, { status: 400 });
    }

    try {
      const result = wantsSubscribe
        ? await subscribeConfirmedUser(email)
        : await unsubscribeByEmail(email);
      return Response.json(result);
    } catch (err) {
      console.error("Newsletter sync error:", err);
      return Response.json({ error: "Unable to update newsletter subscription." }, { status: 500 });
    }
  }

  return Response.json({ error: "Unknown intent." }, { status: 400 });
}


function LinksEdit({ id, links, setLinks }) {
  const [linkRequired, setLinkRequired] = useState(false);

    function removeLink(e) {
        e.preventDefault();
        setLinks(links.toSpliced(id, 1));
    }

    function handleTypeChange(e) {
        setLinks(links.toSpliced(id, 1, {
            ...links[id],
            type: e.target.value
        }));
    }

    function handleURLChange(e) {
        setLinks(links.toSpliced(id, 1, {
            ...links[id],
            url: e.target.value
        }));
        setLinkRequired(e.target.value.length == 0);
    }

    return (
        <div className="px-2 py-4 first:pt-0 border-b-2 border-primary-light last:border-0">
            <div className="text-sm mb-1 flex justify-between">
                <div className="text-secondary-dark">Social Link</div>
                <button className="text-error font-semibold hover:text-error-dark hover:cursor-pointer duration-200" onClick={(e) => {removeLink(e)}}><i className="bi bi-trash"></i> Remove Link</button>
            </div>
            <div className="md:grid grid-cols-[200px_auto] flex flex-col gap-x-5 gap-y-2 pb-2">
              <div>
                  <label htmlFor={"link-type-" + id}>Social Link Type:</label><br />
                  <select id={"link-type-" + id} name={"link-type-" + id} type="text"
                      className={"input input-text w-full"}
                      placeholder="Link Type"
                      value={links[id].type || "personal"}
                      onChange={(e) => {handleTypeChange(e)}}>
                    <option value="personal">Personal Website</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter</option>
                    <option value="facebook">Facebook</option>
                  </select>
              </div>
              <div>
                  <label htmlFor={"link-url-" + id}>Social Link URL:</label><br />
                  <input id={"link-url-" + id} name={"link-url-" + id} type="text"
                      className={"input input-text w-full " + (linkRequired && "input-required")}
                      placeholder="Link URL"
                      value={links[id].url}
                      onChange={(e) => {handleURLChange(e)}} />
                  <div className="input-error">This field is required.</div>
              </div>
            </div>
        </div>
    )
}

function EditPopup({ showPopup, setShowPopup, userId, profileInfo, taskForceList, universityList, currentUserId }) {
  const navigate = useNavigate();
  const [formRequired, setFormRequired] = useState({ fname: false, lname: false });
  const [hasError, setHasError] = useState(false);
  const draft = profileInfo;
  const [links, setLinks] = useState([])
  const [interestOptions, setInterestOptions] = useState([]);

  async function validate(formData) {
    let isValidated = true;
    const isRequired = {
      fname: formData.get('fname') === (null || ""),
      lname: formData.get('lname') === (null || ""),
    }
    for (let value of Object.values(isRequired)) {
      if (value) {
        isValidated = false;
        break;
      }
    }
    for (let link of links) {
      if (link.url == "") {
          isValidated = false;
          break;
      }
    }
    if (!isValidated) {
      setFormRequired(isRequired);
      return false;
    }

    const cleanLinks = []

    for (let link of links) {
      if (link.url.length > 0) {
          cleanLinks.push(link);
      }
    }

    // set disabled field values if profile was edited by admin
    if (currentUserId != userId) {
      formData.set('is-seen-by-visitors', draft.is_seen_by_visitors);
      formData.set('is-contact-by-visitors', draft.is_contact_by_visitors);
      formData.set('is-contact-by-members', draft.is_contact_by_members);
      formData.set('is-get-interest-info', draft.is_get_interest_info);
      
      // disabled checkboxes aren't included in FormData at all, so without this
      // an admin saving someone else's profile would silently unsubscribe them
      formData.set('subscribe-news', draft.is_subscribed ? 'on' : '');
    }

    const update = await updateProfile(userId, formData, cleanLinks);

    try {
      const wantsSubscribe = formData.get("subscribe-news") === "on";
      const email = (draft?.email || "").trim().toLowerCase();
      await syncNewsletterSubscription(email, wantsSubscribe);
    } catch (err) {
      console.error('Subscription update error', err);
    }

    if (update === null) {
      setShowPopup(false);
      navigate("/profile/" + userId);
    } else {
      setHasError(true);
      console.log(update);
    }
  }

  async function loadInfo() {
    setLinks(draft.links);
    setFormRequired({ fname: false, lname: false })
    onEngineeringChange(draft.engineering_type);
  }

  useEffect(() => {
    if (showPopup) {
      loadInfo();
      setHasError(false);
      setFormRequired({ fname: false, lname: false })
    }
  }, [showPopup])

  function checkEmpty(value, inputName) {
    const updatedFormRequired = updateRequired(value, inputName, formRequired);
    if (updatedFormRequired != formRequired) {
      setFormRequired(updatedFormRequired);
    }
  }

  function onEngineeringChange(selected) {
    const possibleOptions = [];
    for (let engType of selected) {
      ENGINEERINGDATA.get(engType).map((interest) => {
        possibleOptions.push(interest);
      })
    }
    setInterestOptions(possibleOptions);
  }

  function onTechInterestChange() {
  }

  function addLink(e) {
        e.preventDefault();
        setLinks([...links, {url: "", type: "personal"}]);
  }

  return (
    <PopupForm id="profile-edit" className="sm:w-[80vw]" show={showPopup} setShow={setShowPopup} validate={validate} hasError={hasError}>
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
              <label htmlFor="biography">Biography</label>
              <textarea
                id="biography"
                name="biography"
                type="text"
                className="input-text w-full h-30 mb-3"
                defaultValue={draft.biography} placeholder="Biography..."
              />

              <label htmlFor="subscribe-news" className="checkbox">
                <input id="subscribe-news" name="subscribe-news" type="checkbox"
                  className={""} defaultChecked={draft.is_subscribed}
                  disabled={currentUserId != userId}
                /><p>Subscribe to IAJES News</p>
              </label>
            </div>

            <div className="">
              <p>Site Visibility</p>
              <label htmlFor="is-seen-by-visitors" className="checkbox mb-4">
                  <input id="is-seen-by-visitors" name="is-seen-by-visitors" type="checkbox" 
                         className={""} defaultChecked={draft.is_seen_by_visitors}
                         disabled={currentUserId != userId}
                          /><p>Allow site visitors without an account and unverified IAJES members to see your profile?</p>
              </label>
              <label htmlFor="is-contact-by-visitors" className="checkbox mb-4">
                  <input id="is-contact-by-visitors" name="is-contact-by-visitors" type="checkbox" 
                         className={""} defaultChecked={draft.is_contact_by_visitors}
                         disabled={currentUserId != userId}
                          /><p>Allow site visitors without an account and unverified IAJES members to contact you?</p>
              </label>
              <label htmlFor="is-contact-by-members" className="checkbox mb-4">
                  <input id="is-contact-by-members" name="is-contact-by-members" type="checkbox" 
                         className={""} defaultChecked={draft.is_contact_by_members}
                         disabled={currentUserId != userId}
                          /><p>Allow verified IAJES members to contact you?</p>
              </label>
            </div>
            
            <div>
              <p>Banner Type</p>
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
              <label htmlFor="languages">Languages <span className="text-disabled-light italic">(Select one or more.)</span></label>
              <MultiSelect id="languages" name="languages" value={draft?.languages} className="w-full" size="6" >
                {(LANGUAGEDATA) ? LANGUAGEDATA.map((language, idx) => <option key={"lan-" + idx} value={language}>{language}</option>) : <></>}
                <option value="Other">Other</option>
              </MultiSelect>
            </div>

          </div>
        </fieldset>

        <fieldset className="border-t-2 border-gray-light pt-4">
          <div className="text-sm font-semibold text-secondary-dark">Professional Information</div>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="engineering-type">Types of Engineering <span className="text-disabled-light italic">(Select one or more.)</span></label>
              <div className="w-full py-2 text-sm text-disabled-light italic">Please select the type(s) of engineering that best describes your professional background.</div>
              <MultiSelect id="engineering-type" name="engineering-type" 
                value={draft.engineering_type} onChange={onEngineeringChange}
                className="w-full" size="5">
                  {Array.from(ENGINEERINGDATA.keys()).map(engineeringType => {
                    return <option key={engineeringType} value={engineeringType}>{engineeringType}</option>
                  })}
              </MultiSelect>
            </div>

            <div>
              <label htmlFor="title">Current Professional Title</label>
              <input
                id="title"
                name="title"
                type="text"
                className="input-text w-full"
                defaultValue={draft.title} placeholder="Title"
              />
            </div>

            <div>
              <label htmlFor="position-type">Types of Position <span className="text-disabled-light italic">(Select one or more.)</span></label>
              <MultiSelect id="position-type" name="position-type" value={draft.position_type} className="w-full" size="4" >
                  <option value="Professor">Professor</option>
                  <option value="Staff">Staff</option>
                  <option value="Researcher">Researcher</option>
                  <option value="Student">Student</option>
              </MultiSelect>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="tech-interests">Technical Interests <span className="text-disabled-light italic">(Select one or more.)</span></label>
              { (interestOptions.length == 0) && <div className="w-full py-2 text-sm text-disabled-light italic">Please select Type of Engineering options to see Technical Interest options.</div>}
              <MultiSelect id="tech-interests" name="tech-interests"
                value={draft?.tech_interests} onChange={onTechInterestChange}
                className="input input-text w-full" >
                  {interestOptions.map(interest => {
                    return <option key={interest} value={interest}>{interest}</option>
                  })}
              </MultiSelect>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="general-interests">General Interests <span className="text-disabled-light italic">(Select one or more.)</span></label>
              <MultiSelect id="general-interests" name="general-interests" value={draft.general_interests}  className="w-full" size="4" >
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Entrepreneurship">Entrepreneurship</option>
                  <option value="Industry Relations/Cooperations">Industry Relations/Cooperations</option>
                  <option value="Environment">Environment</option>
                  <option value="Internationalization">Internationalization</option>
                  <option value="Policies">Policies</option>
                  <option value="University Management">University Management</option>
                  <option value="Social Impact">Social Impact</option>
                  <option value="Rankings and Acreditations">Rankings and Acreditations</option>
                  <option value="Other">Other</option>
              </MultiSelect>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="is-get-interest-info" className="checkbox">
                <input id="is-get-interest-info" name="is-get-interest-info" type="checkbox" 
                        className={""} defaultChecked={draft.is_get_interest_info}
                        disabled={currentUserId != userId}
                        /><p>Are you interested in receiving information about colleagues with similar areas of interest?</p>
              </label>
              <div className="w-full p-2 text-sm text-disabled-light italic">This is a beta functionality that will connect people with similar interests automatically and share professional information to facilitate collaborations among IAJES participants.</div>
            </div>
          </div>
        </fieldset>

        <fieldset className="border-t-2 border-gray-light pt-4">
          <div className="text-sm font-semibold text-secondary-dark">Affliations</div>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="university">University</label>
              <select id="university" name="university" className="input-text w-full" defaultValue={draft.university}>
                <option selected={draft.university == ""} disabled>-- Select your university --</option>
                { (universityList) ? universityList.map((universityObj, idx) => <option key={"uni-" + idx} value={universityObj.university} selected={universityObj.university == draft.university}>{universityObj.university}</option>) : <></>}
              </select>
            </div>
            <div>
              <label htmlFor="country">Country</label>
              <select id="country" name="country" className="input-text w-full" defaultValue={draft.country}>
                <option value="" disabled>-- Select your country --</option>
                { (COUNTRYDATA) ? COUNTRYDATA.map((country, idx) => <option key={"cou-" + idx} value={country}>{country}</option>) : <></>}
              </select>
            </div>
            <div>
              <label htmlFor="region">Region</label>
              <select id="region" name="region" className="input input-text w-full" defaultValue={draft.region}>
                  <option value="" disabled>-- Select your region --</option>
                  <option value="JHEASA">JHEASA</option>
                  <option value="AJCU-NA">AJCU - NA</option>
                  <option value="AUSJAL">AUSJAL</option>
                  <option value="KIRCHER">KIRCHER</option>
                  <option value="AJCU-AP">AJCU - AP</option>
                  <option value="AJCU-AM">AJCU - AM</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="tf-interests">Are there any Task Forces you would be interested in joining?</label>
              <MultiSelect id="tf-interests" name="tf-interests" value={draft?.tf_interests} className="w-full" size="4" >
                  {taskForceList.map(tf => {
                    return <option key={tf.url} value={tf.name}>{tf.name}</option>
                  })}
              </MultiSelect>
            </div>
          </div>
        </fieldset>

        <fieldset className="border-t-2 border-gray-light pt-4">
          <div className="text-sm font-semibold text-secondary-dark">Social</div>
          <div className="mt-3 grid gap-4">
            <div>
                { links.map((link, idx) => <LinksEdit key={idx} id={idx} links={links} setLinks={setLinks} />)}
            </div>
            <button className="button button-light" onClick={(e) => addLink(e)}>Add Social Link</button>
            
            <div>
              <label htmlFor="resume-pdf-url">Resume</label>
                <input
                  id="resume-pdf-url"
                  name="resume-pdf-url"
                  type="text"
                  className="input-text w-full"
                  defaultValue={draft.resume_pdf_url} placeholder="Link to resume..."
                /> 
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

  // console.log(loaderData);

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
      <EditPopup showPopup={showPopup} setShowPopup={setShowPopup} userId={profile.id} profileInfo={profile} taskForceList={loaderData.taskForceList} universityList={loaderData.universityList} currentUserId={currentUserId} />
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
        
        <div className={"-mt-16 rounded-md border-2 bg-white p-6 pt-10 shadow-sm relative z-10 border" + bannerClass}>
          <div className="grid gap-x-6 md:gap-y-5 gap-y-1 lg:grid-cols-[220px_auto]">

            <div className="flex flex-col items-center text-center p-2">
              <div className="relative -mt-2">
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
                        return <div key={"role-" + idx} className="text-xs inline-block me-2 mb-2 last:me-0 px-2 py-1 shrink-0 text-secondary-light border-2 border-primary-light border-2 rounded-md">{ROLENAMES.get(role)}</div>
                    }
                })}
              </div>
              <p className="text-sm text-gray-dark/70">
                {profile.title}
              </p>
              <p className="text-sm text-gray-dark/70">
                {profile.position_type.map((position, idx) => {
                    return (idx > 0) ? ", " + position : position;
                })}
              </p>
            </div>

            <div className="flex flex-col">
              <div className="pb-3 border-b-2 border-gray-light">
                <div className="flex md:flex-row flex-col justify-between items-center">

                  <p className="font-semibold text-secondary-dark md:mt-0 mt-2">
                    {profile.engineering_type.map((engineering, idx) => {
                      return (idx > 0) ? ", " + engineering : engineering;
                    })}
                  </p>

                  <>
                  { (profile.is_contact_by_members || ((currentUserId != null) && (isVerified))) ||
                    (profile.is_contact_by_visitors)
                   ?
                    <button
                      type="button"
                      className="md:order-none order-first button flex items-center justify-center gap-3 text-lg font-semibold"
                      onClick={() => {
                        window.location.href = `mailto:${profile.email}?subject=IAJES%20Connection`;
                      }}
                    >
                      <i className="bi bi-envelope" aria-hidden="true" />
                      Contact
                    </button>
                    :
                    <></>
                  }
                  </>

                </div>

                <div className="md:text-left text-center md:mt-0 mt-2">
                  <p>{profile.university}, {profile.country} — <span className="font-semibold text-secondary-dark">{profile.region}</span></p>
                </div>

                <div className="md:text-left text-center mt-2">
                  <p className="text-sm">
                    {(profile.languages.length > 0) && <span className="font-semibold text-secondary-dark">Languages: </span>}
                    {profile.languages.map((language, idx) => {
                      return (idx > 0) ? ", " + language : language;
                    })}
                  </p>
                </div>

              </div>

              <div className="py-3">
                {profile.biography}
              </div>

            </div>


            <div className="md:col-span-2 flex flex-wrap justify-between py-3 border-t-2 border-gray-light">
              { (profile.tech_interests.length > 0 || profile.general_interests.length > 0) && 
              <div className="mr-5 mb-5">
                <h5>Interests</h5>
                <div className="flex">
                  { (profile.tech_interests.length > 0) &&
                  <ul className="mr-12">
                    {profile.tech_interests.map((interest, idx) => {
                      return <li key={"tech-" + idx}>{interest}</li>
                    })}
                  </ul>
                  }
                  <ul className="mr-12">
                    {profile.general_interests.map((interest, idx) => {
                      return <li key={"tech-" + idx}>{interest}</li>
                    })}
                  </ul>
                </div>
              </div>
              }

              { (profile.links.length > 0) && 
              <div className="mr-5 mb-5">
                <h5>Social</h5>
                {profile.links.map((link, idx) => {
                  return <SocialLink key={"link-" + idx} href={link.url} type={link.type} />
                })}
              </div>
              }

              { (profile.resume_pdf_url.length > 0) && 
              <div className="relative md:w-auto w-full">
                <a href={profile.resume_pdf_url} className="block button button-light md:w-auto w-full">Resume<i className="ml-2 bi bi-box-arrow-up-right"></i></a>
              </div>
              }
            </div>

            
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function IconSquare({ className, title, icon, onClick, small=false, children }) {
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

function SocialLink({ href, type }) {
  if (href !== null && href !== "") {
    let icon = "bi-globe";
    let label = "Personal Website"
    switch (type) {
      case "linkedin":
        icon = "bi-linkedin";
        label = "LinkedIn";
        break;
      case "instagram":
        icon = "bi-instagram";
        label = "Instagram";
        break;
      case "twitter":
        icon = "bi-twitter-x";
        label = "Twitter (X)";
        break;
      case "facebook":
        icon = "bi-facebook";
        label = "Facebook";
        break;
    }

    return (
      <a
        href={href}
        aria-label={type}
        className="flex block w-fit mb-2 py-2 px-3 items-center justify-center rounded-md border-2 border-gray-light bg-white text-secondary-light transition-200 hover:border-primary-light"
        onClick={(event) => {
          if (href === "#") event.preventDefault();
        }}
      >
        <i className={`mr-2 bi ${icon}`} aria-hidden="true" />{label}
      </a>
    );

  }
}
