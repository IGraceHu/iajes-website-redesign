import { useState, useEffect, useRef, useActionState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { supabase } from "../supabase";
import { Link } from "react-router";
import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { MultiSelect } from "../components/multi-select";
import { Popup, PopupForm } from "../components/popup";
import { updateRequired } from "../helpers/form";
import { currentHasPermissions, getUserVerified } from "../helpers/permissions";
import "../styles/profile.css";

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

const ENGINEERINGDATA = new Map([
  ['Aerospace Engineering', ['Aerodynamics', 'Space Systems', 'Aircraft Structures', 'Propulsion Systems', 'Autonomous Flight'] ],
  ['Artificial Intelligence Engineering', ['Machine Learning', 'Generative AI', 'Computer Vision', 'Natural Language Processing', 'Responsible AI'] ],
  ['Automotive Engineering', ['Electric Vehicles', 'Autonomous Driving', 'Vehicle Dynamics', 'Powertrain Systems', 'Connected Mobility'] ],
  ['Biomedical Engineering', ['Medical Devices', 'Biomedical Imaging', 'Biomaterials', 'Rehabilitation Engineering', 'Digital Health'] ],
  ['Bioengineering', ['Synthetic Biology', 'Tissue Engineering', 'Bioprocess Engineering', 'Biosensors', 'Genetic Engineering'] ],
  ['Chemical Engineering', ['Process Design', 'Catalysis', 'Reaction Engineering', 'Sustainable Manufacturing', 'Separation Processes'] ],
  ['Civil Engineering', ['Smart Infrastructure', 'Geotechnical Engineering', 'Water Resources', 'Structural Design', 'Urban Development'] ],
  ['Computer Engineering', ['Embedded Systems', 'Computer Architecture', 'IoT Systems', 'Edge Computing', 'Hardware-Software Co-Design'] ],
  ['Computer Science & Engineering', ['Algorithms', 'Distributed Systems', 'Artificial Intelligence', 'Human-Computer Interaction', 'Cloud Computing'] ],
  ['Construction Engineering', ['Construction Management', 'Building Information Modeling (BIM)', 'Sustainable Construction', 'Project Planning', 'Construction Automation'] ],
  ['Cybersecurity Engineering', ['Network Security', 'Cryptography', 'Secure Software', 'Digital Forensics', 'Cyber-Physical Systems Security'] ],
  ['Data Engineering', ['Big Data Systems', 'Data Pipelines', 'Data Governance', 'Data Warehousing', 'Real-Time Analytics'] ],
  ['Electrical Engineering', ['Power Systems', 'Signal Processing', 'Renewable Energy Systems', 'Electronics', 'Smart Grids'] ],
  ['Electronic Engineering', ['Analog & Digital Circuits', 'Microelectronics', 'Embedded Electronics', 'Semiconductor Devices', 'Sensor Systems'] ],
  ['Energy Engineering', ['Renewable Energy', 'Energy Storage', 'Smart Grids', 'Hydrogen Technologies', 'Energy Efficiency'] ],
  ['Environmental Engineering', ['Water Treatment', 'Air Quality', 'Climate Adaptation', 'Waste Management', 'Environmental Monitoring'] ],
  ['Industrial Engineering', ['Operations Research', 'Supply Chain Management', 'Process Optimization', 'Human Factors', 'Quality Engineering'] ],
  ['Information Engineering', ['Information Systems', 'Data Analytics', 'Knowledge Management', 'Decision Support Systems', 'Information Security'] ],
  ['Information Technology', ['Cloud Computing', 'IT Infrastructure', 'Enterprise Systems', 'Network Administration', 'Digital Transformation'] ],
  ['Materials Engineering', ['Advanced Materials', 'Nanomaterials', 'Polymers', 'Composite Materials', 'Materials Characterization'] ],
  ['Mechanical Engineering', ['Advanced Manufacturing', 'Thermofluids', 'Robotics', 'Machine Design', 'Computational Mechanics'] ],
  ['Mechatronics Engineering', ['Intelligent Automation', 'Control Systems', 'Embedded Systems', 'Robotics', 'Smart Manufacturing'] ],
  ['Mining Engineering', ['Mineral Processing', 'Mine Automation', 'Rock Mechanics', 'Sustainable Mining', 'Resource Exploration'] ],
  ['Petroleum Engineering', ['Reservoir Engineering', 'Drilling Technologies', 'Enhanced Oil Recovery', 'Carbon Storage', 'Energy Transition'] ],
  ['Robotics Engineering', ['Autonomous Robots', 'Robot Perception', 'Human-Robot Interaction', 'Swarm Robotics', 'Robotic Manipulation'] ],
  ['Software Engineering', ['Software Architecture', 'DevOps', 'Software Testing', 'Agile Development', 'Software Quality Assurance'] ],
  ['Structural Engineering', ['Earthquake Engineering', 'Structural Health Monitoring', 'Advanced Materials', 'Bridge Engineering', 'Resilient Infrastructure'] ],
  ['Systems Engineering', ['Systems Modeling', 'Complex Systems', 'Digital Twins', 'Systems Integration', 'Decision Analysis'] ],
  ['Telecommunications Engineering', ['Wireless Communications', '5G/6G Networks', 'Optical Communications', 'Network Security', 'Internet of Things (IoT)'] ],
  ['Transportation Engineering', ['Intelligent Transportation Systems', 'Traffic Engineering', 'Sustainable Mobility', 'Transportation Planning', 'Autonomous Transportation'] ],
  ['Other', [] ]
]);

const COUNTRYDATA = ['Afghanistan', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'The Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'British Virgin Islands', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde (Cape Verde)', 'Cambodia', 'Cameroon', 'Canada', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Democratic Republic of the Congo', 'Republic of the Congo', 'Cook Islands', 'Costa Rica', 'Côte d’Ivoire', 'Croatia', 'Cuba', 'Curaçao', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor (Timor-Leste)', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini (Swaziland)', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia', 'Gabon', 'The Gambia', 'Gaza Strip', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'North Korea', 'South Korea', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Myanmar (Burma)', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'North Macedonia', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn Island', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Réunion', 'Romania', 'Russia', 'Rwanda', 'Saint Helena', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint-Pierre and Miquelon', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Sint Maarten', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'Spain', 'Sri Lanka', 'South Sudan', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Turks and Caicos Islands', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'United States Virgin Islands', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Wallis and Futuna', 'West Bank', 'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe'];

const LANGUAGEDATA = ['Afrikaans', 'Albanian', 'Amharic', 'Arabic', 'Armenian (Eastern)', 'Armenian (Western)', 'Azerbaijani (Azeri)', 'Bassa', 'Belarusian', 'Bengali', 'Bosnian', 'Braille', 'Bulgarian', 'Burmese', 'Cambodian (Khmer)', 'Cape Verde Creole', 'Cebuano', 'Chinese (Simplified)', 'Chinese (Traditional)', 'Chuukese', 'Croatian', 'Czech', 'Danish', 'Dari', 'Dutch', 'English', 'Estonian', 'Farsi (Persian)', 'Finnish', 'Flemmish', 'French (Canada)', 'French (France)', 'Fulani', 'Georgian', 'German', 'Greek', 'Gujarati', 'Haitian Creole', 'Hakha Chin', 'Hakka (Chinese)', 'Hebrew', 'Hindi', 'Hmong', 'Hungarian', 'Icelandic', 'Igbo/Ibo', 'Ilocano', 'Ilonggo (Hiligaynon)', 'Indonesian', 'Italian', 'Japanese', 'Javanese', 'Kannada', 'Karen', 'Kazakh', 'Kinyarwanda', 'Kirundi', 'Korean', 'Kurdish (Kurmanji dialect)', 'Kurdish (Sorani dialect)', 'Kyrgyz/Kirgiz', 'Lao (Laotian)', 'Latvian', 'Lithuanian', 'Macedonian', 'Malay (Malaysian)', 'Mandinka', 'Marathi', 'Marshallese', 'Mien', 'Mongolian', 'Montenegrin', 'Navajo', 'Nepali', 'Norwegian', 'Oromo', 'Pashto', 'Polish', 'Portuguese (Brazil)', 'Portuguese (Portugal)', 'Punjabi', 'Rohingya', 'Romanian (Moldavan)', 'Russian', 'Serbian', 'Slovak', 'Slovenian', 'Somali', 'Spanish (Castilian)', 'Spanish (Latin American)', 'Spanish (other varieties)', 'Swahili', 'Swedish', 'Tagalog', 'Tamil', 'Telugu', 'Thai', 'Tibetan', 'Tigrinya', 'Turkish', 'Ukrainian', 'Urdu', 'Uzbek', 'Vietnamese', 'Wolof', 'Yoruba'];

const tempUserData = {
  fname: "First",
  lname: "Last",
  roles: ['member'],
  is_seen_by_visitors: true,
  is_contact_by_visitors: true,
  is_contact_by_members: true,
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
    profile.is_seen_by_visitors = profile.is_seen_by_visitors || true;
    profile.is_contact_by_visitors = profile.is_contact_by_visitors || true;
    profile.is_contact_by_members = profile.is_contact_by_members || true;
    profile.banner_type = profile.banner_type || 1; 
    profile.biography = profile.biography || "";

    profile.engineering_type = profile.engineering_type || [];
    profile.position_type = profile.position_type || [];
    profile.title = profile.title || ""
    profile.tech_interests = profile.tech_interests || [];
    profile.general_interests = profile.general_interests || [];
    profile.is_get_interest_info = profile.is_get_interest_info || false;
    
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
      is_seen_by_visitors: formData.get("is-seen-by-visitors"),
      is_contact_by_visitors: formData.get("is-contact-by-visitors"),
      is_contact_by_members: formData.get("is-contact-by-members"),
      banner_type: formData.get("banner-type"),
      biography: formData.get("biography"),

      engineering_type: formData.getAll("engineering-type"),
      position_type: formData.getAll("position-type"),
      title: formData.get("title"),
      tech_interests: formData.getAll("tech-interests"),
      general_interests: formData.getAll("general-interests"),
      is_get_interest_info: formData.get("is-get-interest-info"),
      
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

  const person = await getProfile(params.id);
  if (!person) {
        throw new Response("Profile not found", { status: 404 });
    }
  
  return { person: person, taskForceList: taskForceList, universityList: universityList };
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
                      selected={links[id].type || "personal"}
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
  // const [draft, setDraft] = useState({});
  const draft = profileInfo;
  const [links, setLinks] = useState([])
  const [interestOptions, setInterestOptions] = useState([]);

  async function validate(formData) {
    console.log(formData);
    console.log(links);
    

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

    const update = await updateProfile(userId, formData, cleanLinks);
    if (update === null) {
      setShowPopup(false);
      navigate("/profile/" + userId);
    } else {
      setHasError(true);
      console.log(update);
    }
  }

  async function loadInfo() {
    // const profileInfo = await getProfile(userId);
    // setDraft(profileInfo);
    setLinks(draft.links);
    setFormRequired({ fname: false, lname: false })
    onEngineeringChange(draft.engineering_type);
    // console.log(profileInfo);
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
    // console.log(possibleOptions);
    setInterestOptions(possibleOptions);
  }

  function onTechInterestChange() {
    console.log("tech");
  }

  function addLink(e) {
        e.preventDefault();
        setLinks([...links, {url: "", type: "personal"}]);
  }

  return (
    <PopupForm id="profile-edit" className="w-[80vw]" show={showPopup} setShow={setShowPopup} validate={validate} hasError={hasError}>
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
                className="input-text w-full h-30"
                defaultValue={draft.biography} placeholder="Biography..."
              />
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
                      <input id="banner-type-0" type="radio" name="banner-type" value="0" defaultChecked={draft.banner_type == 0}/><p>Gray</p>
                </label>
                <label htmlFor="banner-type-1" className="radio-button green">
                    <input id="banner-type-1" type="radio" name="banner-type" value="1" defaultChecked={draft.banner_type == 1}/><p>Green</p>
                </label>
                <label htmlFor="banner-type-2" className="radio-button blue">
                    <input id="banner-type-2" type="radio" name="banner-type" value="2" defaultChecked={draft.banner_type == 2}/><p>Blue</p>
                </label>
                <label htmlFor="banner-type-3" className="radio-button dark-blue">
                    <input id="banner-type-3" type="radio" name="banner-type" value="3" defaultChecked={draft.banner_type == 3}/><p>Dark Blue</p>
                </label>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="languages">Languages</label>
              <MultiSelect id="languages" name="languages" value={draft?.languages} className="w-full" size="6" >
                { (LANGUAGEDATA) ? LANGUAGEDATA.map((language, idx) => <option key={"lan-" + idx} value={language}>{language}</option>) : <></>}
                <option value="Other">Other</option>
              </MultiSelect>
            </div>
            
          </div>
        </fieldset>

        <fieldset className="border-t-2 border-gray-light pt-4">
          <div className="text-sm font-semibold text-secondary-dark">Professional Information</div>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="engineering-type">Type of Engineering</label>
              <MultiSelect id="engineering-type" name="engineering-type" 
                value={draft.engineering_type} onChange={onEngineeringChange}
                className="w-full" size="5">
                  {Array.from(ENGINEERINGDATA.keys()).map(engineeringType => {
                    return <option key={engineeringType} value={engineeringType}>{engineeringType}</option>
                  })}
              </MultiSelect>
            </div>

            <div>
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                className="input-text w-full"
                defaultValue={draft.title} placeholder="Title"
              />
            </div>

            <div>
              <label htmlFor="position-type">Type of Position</label>
              <MultiSelect id="position-type" name="position-type" value={draft.position_type} className="w-full" size="4" >
                  <option value="Professor">Professor</option>
                  <option value="Staff">Staff</option>
                  <option value="Researcher">Researcher</option>
                  <option value="Student">Student</option>
              </MultiSelect>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="tech-interests">Technical Interests</label>
              { (interestOptions.length == 0) && <div className="w-full p-2 text-sm text-disabled-light italic">Please select Type of Engineering options to see Technical Interest options.</div>}
              <MultiSelect id="tech-interests" name="tech-interests"
                value={draft?.tech_interests} onChange={onTechInterestChange}
                className="input input-text w-full" >
                  {interestOptions.map(interest => {
                    return <option key={interest} value={interest}>{interest}</option>
                  })}
              </MultiSelect>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="general-interests">General Interests</label>
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
                <option selected={draft.country == ""} disabled>-- Select your country --</option>
                { (COUNTRYDATA) ? COUNTRYDATA.map((country, idx) => <option key={"cou-" + idx} value={country} selected={country == draft.country}>{country}</option>) : <></>}
              </select>
            </div>
            <div>
              <label htmlFor="region">Region</label>
              <select id="region" name="region" className="input input-text w-full" defaultValue={draft.region}>
                  <option selected={draft.region == ""} disabled>-- Select your region --</option>
                  <option value="JHEASA" selected={"JHEASA" == draft.region}>JHEASA</option>
                  <option value="AJCU-NA" selected={"AJCU-NA" == draft.region}>AJCU - NA</option>
                  <option value="AUSJAL" selected={"AUSJAL" == draft.region}>AUSJAL</option>
                  <option value="KIRCHER" selected={"KIRCHER" == draft.region}>KIRCHER</option>
                  <option value="AJCU-AP" selected={"AJCU-AP" == draft.region}>AJCU - AP</option>
                  <option value="AJCU-AM" selected={"AJCU-AM" == draft.region}>AJCU - AM</option>
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
            <label>
              Resume
              <br/>
                <input id="resume-pdf" name="resume-pdf" type="file" />
            </label>  
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
          function (verified) {setIsVerified(verified)}
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
          function (verified) {setIsVerified(verified)}
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
                {profile.job_position}{ profile?.job_position && profile?.institution && <span>, </span>}{profile.institution}
              </p>
              <p className="text-sm italic text-gray-dark/60">{profile.tagline}</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col w-full gap-4 sm:flex-row">
                { profile?.task_force &&
                  <a href={"/task-forces/" + userTaskForceUrl} className="w-full rounded-md border-2 border-primary-light bg-white px-4 py-3 text-sm hover:border-secondary-light">
                    <p className="font-semibold text-secondary-dark">{profile.task_force}</p>
                    { profile?.task_force_role &&
                    <p className="mt-1 text-gray-dark/70">{profile.task_force_role}</p> }
                  </a>
                }

                { (profile?.allow_contact || ((currentUserId != null) && (isVerified))) &&
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
                { profile.region && <InfoRow label="Region" value={profile.region} /> }
                { profile.country && <InfoRow label="Country" value={profile.country} /> }
                { profile.languages && <InfoRow label="Languages" value={profile.languages} /> }
                { profile.institution && <InfoRow label="Institution" value={profile.institution} /> }
                { profile.major && <InfoRow label="Academic Focus" value={profile.major} /> }
                { profile.research_interests && <InfoRow label="Research Interests" value={profile.research_interests} /> }
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
