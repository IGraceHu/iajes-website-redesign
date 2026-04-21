import { useState } from 'react';
import { useNavigate } from "react-router";
import { supabase } from "../supabase";
import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { Popup, PopupForm } from "../components/popup";
import { Banner } from "../components/graphics";
import { updateRequired } from "../helpers/form";

export function meta({ loaderData }) {
  return [
    { title: "Task Force: " + loaderData.name },
    // { name: "description", content: "Welcome to React Router!" },
  ];
}

const tfInfoTemp = [
  {
    url: "research-and-academic-cooperation",
    name: "Research & Academic Cooperation",
    shortDesc: "The Task Force on Research and Academic Cooperation, with its commendable achievements, aims to create a real network between people who perform academic work at the IAJES institutions. We strive to connect people, develop synergies, and strengthen all engineering programs within the network. To date, we have successfully conducted two projects that have provided results and potential opportunities, and we continue to work to connect more people and institutions to improve research and cooperation. ",
    content_top: "The Task Force on Research and Academic Cooperation, with its commendable achievements, aims to create a real network between people who perform academic work at the IAJES institutions. We strive to connect people, develop synergies, and strengthen all engineering programs within the network. To date, we have successfully conducted two projects that have provided results and potential opportunities, and we continue to work to connect more people and institutions to improve research and cooperation. ",
    content_bottom: `- 16-03-2021: Participation in the webinar presenting the PhD Cooperative Program of IQS. 
- 30-03-2021: The Steering Committee Accepts Rosa Nomen as the team leader of this Task Force.
- 11-05-2021: First webinar of the Research & Cooperation Task Force and definition of our work for the next three years.
- 10-09-2021: The first campaign of the Mentoring was launched.
- November 2021 and February 2022: Kick-off meetings for the first campaign of the Mentoring project.
- December 2022 and February 2023: Kick-off meetings for the Ph.D. and Postdoc Collaborative project.
- February 2023: Kick-off meetings for the second campaign of the Mentoring project.
- November 2023: Mentoring project webinar to present the Ignatian Mentoring concept and to know the experiences of some couples or testimonials.
- April 2024: New Webinar on Ignatian Mentoring, strengthening the understanding of how Ignatian Spirituality enlightens Mentoring. A reflection on the effectiveness of the Mentoring Project and future steps was also considered. 
- May 2024: The process is open for the Collaborative Ph.D. and Postdoctoral Program candidates.`,
    imageURL: null,
    team_members: [
      {
        imageURL: "https://lh3.googleusercontent.com/sitesv/AAzXCkee2B7Ov_gofW_iaUKmjUonmMx36p9ryUJKOIWEV2qpObBByLRUd4xK7uvCqRSucGRZzVF0OVjeaMc2_1X2SSvCEFXQn4CM4Ij5UWP0p2boR63ZFfPdmxOlZYqndJK1x1Bdyedn1HdtGETMFPW7V0t8D21G4JZZcLGvt-Bk5K57EchaFLUuxqmntqijNbat7kTVQjBvbsvxi085Jf5Ebsf_o0QqoYynKhrR=w1280",
        name: "Rosa Nomen",
        position: "",
        location: "IQS - URL, Barcelona",
        contact: "rosa.nomen@iqs.url.edu"
      },
      {
        imageURL: "https://lh3.googleusercontent.com/sitesv/AAzXCkc_Nkt9_2KVS4hkxqFjcFth1XbHkTm58Jq0eySqAZQtF9P1bCSUXu86_JxobnPsaGHkeGX6mE7JWoKc4RHKERldnhAcxIdtBpnT5LTcrffvtEQBq5yLj1rY9GoVzLjjDjXms95tEmFWTpfsbPdVRKhdl0klM8ut03MH0Rc3hPO2ASeOSApQQaZ7bzxtDKEskbIVPbUQEw3khB24JDixY0S7mjBXnFE9vhA_=w1280",
        name: "Luis Aaron Martinez",
        position: "",
        location: "UCA El Salvador",
        contact: "lamartinez@uca.edu.sv"
      },
      {
        imageURL: "https://lh3.googleusercontent.com/sitesv/AAzXCkfWnWdt7DDeTn2Hvw4o8WC7rV21DxOWTnh7-XNQdfCFss-U4aVCalXyAoXRaFzIx0mr5IOT6pZVliQEMPaaWLKLVqW_2qgjpIvjbomoXbF44X8sZu9_QR5xUQvuoZIsWPEcW3x6HkAWvUsYWopcykS2vOSxawYb92MAVu4fpo5dCs4rjLxN7Xncxvw=w1280",
        name: "Julià Sempere",
        position: "",
        location: "IQS-URL, Barcelona, Spain",
        contact: "julia.sempere@iqs.url.edu"
      },
      {
        imageURL: "https://lh3.googleusercontent.com/sitesv/AAzXCkc6nfo87bvlH-pYumUIRS8vsHxq5m-Xpx4d_VwavYqeojRjmfsy9fUWWI2VZItS4PK5HA8MbiXPPnIzy7z9BDc3U3ood1h9jG5oQ3pkbnDp_JZ9NB10mql85lZj24DHT5oggt5AeDvT8p_qhHI2SbmjsAO6MythO0JSoKL5qkpFGy_PBOOa6Och=w1280",
        name: "Llorenc Puig, SJ",
        position: "",
        location: "IQS-URL, Barcelona, Spain",
        contact: "llorenc.puig@iqs.url.edu"
      },
      {
        imageURL: "https://lh3.googleusercontent.com/sitesv/AAzXCkd5wPs8UYSgSA4_f8I0SC3n4n85Xp-qYYwx2dLsOMUtfewk0pJMbOVgCjHN492_M9TkGnoRTv4KoH5TeWZSVk2YLoOXVcFKbcnr8XIyX8yI6-G6PDpilH5f3C2h1JFhQVV7xIFW4gRBPgmf5WOBbxIGozFutES3NmyaAXLdWfttM7LFwZOFG5AnRQW2AWPLjVGvgqaBn60r79rwmq5a--gzyBsMtQvACjKUYk4=w1280",
        name: "Muhsin Elie Rahhal",
        position: "",
        location: "St. Joseph, Beirut, Lebanon",
        contact: "muhsin.rahal@usj.edu.lb"
      },
      {
        imageURL: "https://lh3.googleusercontent.com/sitesv/AAzXCkcwgZA7ESwmMfyTFWmf05unRzqMVtSWDqkRH5ANvJrmsAuuLqnyE0JdV-JuHOsMOmKmAUuvitL9eAV58IAuORTBzNfaJFFp2SmnU43bxl0qEjnoLiew4yHVm2tuk6MBPbqMQSig0V-yvp--w1JyHbFrciVfg-3-ECMonnFaHpbbnIUvBYKx5CLuZwFrnm1_oo4olAprkNhVrbgzHLtdkTOEFgWtXg80MqD4lqY=w1280",
        name: "Magda Faijes",
        position: "",
        location: "IQS-URL Barcelona",
        contact: "magda.faijes@iqs.url.edu"
      },
      {
        imageURL: "https://lh3.googleusercontent.com/sitesv/AAzXCkfkps5V8y0lV9nB8h-IB2IB_qdaUwCsXlEa_7XWTkXPmI4tSr5uU6--0mC9fleOwogOfyTLa_LdW0Oba4Ph5u0O2QttKyEp_pYT7eVLJrHcyyLl1NYmVNJmg03FhyMpyMrLELuGnXhNxiBcIo-OQ9Ie81TN8fCBgaTWeTrNpPyj8VO4xIWhm0xBgLkmCYy_naG4ap3vAm0wQJ3toxmttMcbI-Lr5SbMdfG7=w1280",
        name: "Elizabeth Abba",
        position: "",
        location: "XIM University, Odisha, India",
        contact: "elizabeth@xim.edu.in"
      },
      {
        imageURL: "https://lh3.googleusercontent.com/sitesv/AAzXCkdXcvKhEIoa9fjnReF3h2DtlWnX2pKw4LQBIf5hAow0neC3v42gld_9stORcfTbe96SMRNfXgJiSSP3i8lOKXZ2oLNfviLmzmSW2PXOfGddmC2MTskLoJ2DAPmCc3Cv_4riLPLNycCobC8H_7wW0a_mxigrK-I0ycYi5cMWGnZgqFsY4GlfmZAgjTzISiNheNU2ULrJVCiL5_Yz3Bnb7dtaHuEOVf-T6F4n1-M=w1280",
        name: "Carlos Campos",
        position: "",
        location: "UNICAP, Pernambuco",
        contact: "cacamposconsultoria@gmail.com "
      },
      {
        imageURL: "https://lh3.googleusercontent.com/sitesv/AAzXCkcdZ0siwN3YULi1Poe6ohj2YmuULnPZR16NR2cqsx_GBcNLTOi8ZMTiDQfwiBjH4vcj9fYQNVrTvV-egrIeh7W3NYeXm2klD33e7j867hayDnkbWxBiXGL1AvhtnGWwWt7j_LODPHk0gDmJHfO3IB98dGzk6YQ3_7FGs2f9lfyRQZwR2E5m7VatVw1beCYEhVTNGYKHXFKyfeV0Nrmw_Lzsvk4kQbaDDPG-Q5Q=w1280",
        name: "Joy Rodriguez-Salita",
        position: "",
        location: "Ateneo de Manila University , Manila, Philippines",
        contact: "msalita@ateneo.edu"
      }
    ],
    projects: [
      {
        name: "Mentoring",
        desc: "As a theoretical foundation for this Initiative, we have prepared a framework for Ignatian Mentoring. In summary, there is a strong connection between what we define as Mentoring and Ignatian Spirituality. We aim to connect less experienced scholars with more experienced scholars within our network, to facilitate professional, personal and spiritual growth.",
        projectURL: "mentoring",
        imageURL: "",
        externalLinks: [{ text: "Link", url: "" }]
      }
    ]
  },
  {
    name: "name 2",
    desc: "desc",
    imageUrl: null,
    url: "name-2",
    team_members: []
  },
  {
    name: "name 3",
    desc: "desc",
    imageUrl: null,
    url: "name-3"
  },
  {
    name: "name 4",
    desc: "desc",
    imageUrl: null,
    url: "name-4"
  },
  {
    name: "name 5",
    desc: "desc",
    imageUrl: null,
    url: "name-5"
  },
  {
    name: "name 6",
    desc: "desc",
    imageUrl: null,
    url: "name-6"
  },
  {
    name: "name 7",
    desc: "desc",
    imageUrl: null,
    url: "name-7"
  },
  {
    name: "name 8",
    desc: "desc",
    imageUrl: null,
    url: "name-8"
  }
]

async function getTaskForce(taskForceUrl) {
  const { data, error } = await supabase
    .from('task forces')
    .select()
    .eq('url', taskForceUrl)
  return data[0] || error;
}

async function updateTaskForceField(taskForceUrl, fieldName, fieldValue) {
  const { error } = await supabase
    .from('task forces')
    .update({
      [fieldName]: fieldValue
    })
    .eq('url', taskForceUrl)
  return error;
}

async function getTeamMembers(teamMemberList) {
  const { data, error } = await supabase
    .from('task force members')
    .select()
    .in('id', teamMemberList)
    return data || error;
}

async function addTeamMember(taskForceUrl, teamMemberList, formData) {
  const { data, errorMembers } = await supabase
    .from('task force members')
    .insert({
      name: formData.get("name"),
      role: formData.get("role"),
      location: formData.get("location"),
      contact: formData.get("contact"),
      iajes_url: formData.get("iajes-url"),
    })
    .select()

    if (data) {
      teamMemberList.push(data[0].id);

      const { errorTF } = await supabase
        .from('task forces')
        .update({
          team_members: teamMemberList
        })
        .eq('url', taskForceUrl)
      return teamMemberList || [];
    }

    return teamMemberList;
}

async function updateTeamMember(memberId, formData) {
  const { error } = await supabase
    .from('task force members')
    .update({
      name: formData.get("name"),
      role: formData.get("role"),
      location: formData.get("location"),
      contact: formData.get("contact"),
      iajes_url: formData.get("iajes-url"),
    })
    .eq('id', memberId)
    return error;
}

async function deleteTeamMember(taskForceUrl, teamMemberList, memberId) {
  const memberPosition = teamMemberList.indexOf(memberId);
  if (memberPosition >= 0) {
    const response = await supabase
      .from('task force members')
      .delete()
      .eq('id', memberId)
    
    if (response) {
      teamMemberList.splice(memberPosition, 0);
      const { errorTF } = await supabase
        .from('task forces')
        .update({
          team_members: teamMemberList
        })
        .eq('url', taskForceUrl)
      return teamMemberList || [];
    }
    return teamMemberList;
  }
  return false;
}

export async function loader({ params }) {
  // const found = tfInfoTemp.find((tfInf) => tfInf.url == params.tfName);
  const tf = await getTaskForce(params.tfName);
  const teamMembers = await getTeamMembers(tf.team_members || [])
  // Ensure expected arrays/fields exist to avoid runtime errors when mapping
  tf.team_members = teamMembers || []
  tf.projects = tf.projects || [];
  tf.content_top = tf.content_top || "";
  tf.content_bottom = tf.content_bottom || "";
  tf.name = tf.name || "";
  return tf;
}

function MemberCard({ memberData }) {
  return (
    <div className="text-center w-full">
      <div className="max-w-50 w-full max-h-50 m-5 mx-auto bg-gray-light overflow-hidden">
        <img className="min-w-full min-h-full" src={memberData.imageURL} />
      </div>
      { memberData.iajes_url ? 
          <a href={memberData.iajes_url} className="block font-semibold text-secondary-dark mb-2 hover:text-primary-dark duration-200">{memberData.name}</a> 
          :
          <p className="font-semibold text-secondary-dark">{memberData.name}</p> 
        }
      
      <p className="text-sm italic text-secondary-light">{memberData.role}{memberData?.role && memberData?.location && <span>, </span>}{memberData.location}</p>
      <p className="text-sm text-gray-dark/70">{memberData.contact}</p>
    </div>
  )
}

function ProjectCard({ projectData }) {
  return (
    <div className="md:text-left w-full mb-5 grid grid-rows-[2.5rem_auto] md:grid-cols-[400px_auto] grid-cols-1 gap-5">
      <a href={"/projects/" + projectData.url} className="md:order-2"><h3>{projectData.name}</h3></a>
      <div className="m-auto md:row-span-2 md:order-1">
        <iframe src="https://drive.google.com/file/d/1Lb-tAYB5vcDcjZ4L-3u26jZ23k8dZLSy/preview" width="400" height="280"></iframe>
      </div>
      <p className="text-left md:order-3">
        {projectData.desc}
      </p>
    </div>
  )
}

function EditShortDescPopup({showPopup, setShowPopup, content, taskForceUrl}) {
  const navigate = useNavigate();
  const [hasError, setHasError] = useState(false);

  async function validate(formData) {
    const update = await updateTaskForceField(taskForceUrl, "short_desc", formData.get("tf-desc-input"));
    if (update === null) {
      setShowPopup(false);
      navigate(0);
    } else {
      setHasError(true);
    }
  }

  return (
    <PopupForm id="tf-shortdesc" className="md:w-[60vw] duration-200 mx-10 my-5" show={showPopup} setShow={setShowPopup} validate={validate} hasError={hasError}>
      <h4>Edit short description:</h4>
      <p>The short description appears in the main task force page.</p>
      <textarea id="tf-desc-input" name="tf-desc-input" placeholder="Task force short description..."
                className="input-text w-full min-h-30 h-[30vh]"
                defaultValue={content}>
      </textarea>
    </PopupForm>
  )
}

function EditContentTopPopup({showPopup, setShowPopup, content, taskForceUrl}) {
  const navigate = useNavigate();
  const [hasError, setHasError] = useState(false);

  async function validate(formData) {
    const update = await updateTaskForceField(taskForceUrl, "content_top", formData.get("tf-contenttop-input"));
    if (update === null) {
      setShowPopup(false);
      navigate(0);
    } else {
      setHasError(true);
    }
  }
  
  return (
    <PopupForm id="tf-contenttop" className="md:w-[70vw] duration-200 mx-10 my-5" show={showPopup} setShow={setShowPopup} validate={validate} hasError={hasError}>
      <h4>Edit area:</h4>
      <textarea id="tf-contenttop-input" name="tf-contenttop-input" placeholder="Task force area..."
                className="input-text w-full min-h-50 h-[30vh]"
                defaultValue={content}>
      </textarea>
    </PopupForm>
  )
}

function EditContentBottomPopup({showPopup, setShowPopup, content, taskForceUrl}) {
  const navigate = useNavigate();
  const [hasError, setHasError] = useState(false);

  async function validate(formData) {
    const update = await updateTaskForceField(taskForceUrl, "content_bottom", formData.get("tf-contentbottom-input"));
    if (update === null) {
      setShowPopup(false);
      navigate(0);
    } else {
      setHasError(true);
    }
  }
  
  return (
    <PopupForm id="tf-contentbottom" className="md:w-[70vw] duration-200 mx-10 my-5" show={showPopup} setShow={setShowPopup} validate={validate} hasError={hasError}>
      <h4>Edit area:</h4>
      <textarea id="tf-contentbottom-input" name="tf-contentbottom-input" placeholder="Task force area..."
                className="input-text w-full min-h-50 h-[30vh]"
                defaultValue={content}>
      </textarea>
    </PopupForm>
  )
}

function EditTeam({showPopup, setShowPopup, taskForceUrl, teamMembers}) {
  const navigate = useNavigate();
  const [currentTeamMembers, setCurrentTeamMembers] = useState(teamMembers);
  const [showMemberPopup, setShowMemberPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [focusMember, setFocusMember] = useState(null);

  function handleClosePopup() {
    setShowPopup(false);
    navigate(0);
  }

  function handleShowMemberPopup(memberData) {
    setShowMemberPopup(true);
    setFocusMember(memberData);
  }

  function handleDeleteMemberPopup(memberData) {
    setShowDeletePopup(true);
    setFocusMember(memberData);
  }


  const [formRequired, setFormRequired] = useState({ name: false, iajesUrl: false });
  // create and update
  async function memberValidate(formData) {
    let isValidated = true;

    const iajesUrl = formData.get("iajes-url")
    const isRequired = {
      name: formData.get('name') === (null || ""),
      iajesUrl: (iajesUrl && !iajesUrl.match(/\/profile\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/))
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

    // creates a list of current member ids to update the task force member list
    const teamMemberList = [];
    if (currentTeamMembers.length > 0) {
      currentTeamMembers.map((member) => teamMemberList.push(member.id));
    }
    
    // if focus member is null => new member
    if (focusMember == null) {
      const updatedTeamMemberList = await addTeamMember(taskForceUrl, teamMemberList, formData);

      // if the team member is successfully created, fetch team members again to update UI
      if (updatedTeamMemberList != null) {
        const newMembers = await getTeamMembers(updatedTeamMemberList)
        setCurrentTeamMembers(newMembers);
        setShowMemberPopup(false);
      }
    } else {
      const updateMember = await updateTeamMember(focusMember.id, formData);
      if (updateMember === null) {
        const newMembers = await getTeamMembers(teamMemberList)
        setCurrentTeamMembers(newMembers);
        setShowMemberPopup(false);
      }
    }
    // const update = await updateProfile(userId, formData);
    setFocusMember(null);
  }

  function checkEmpty(value, inputName) {
      const updatedFormRequired = updateRequired(value, inputName, formRequired);
      if (updatedFormRequired != formRequired) {
        setFormRequired(updatedFormRequired);
      }
  }

  function iajesUrlChange() {
    const updatedFormRequired = structuredClone(formRequired);
    updatedFormRequired.iajesUrl = false;
    if (updatedFormRequired != formRequired) {
      setFormRequired(updatedFormRequired);
    }
  }

  async function handleRemove() {
    try {
      // creates a list of current member ids to update the task force member list
      const teamMemberList = [];
      if (currentTeamMembers.length > 0) {
        currentTeamMembers.map((member) => teamMemberList.push(member.id));
      }

      const updatedTeamMemberList = await deleteTeamMember(taskForceUrl, teamMemberList, focusMember.id);
      
      if (updatedTeamMemberList && updatedTeamMemberList != null) {
        const newMembers = await getTeamMembers(updatedTeamMemberList)
        setCurrentTeamMembers(newMembers);
        setShowDeletePopup(false);
      }
    }
    catch (error) {
      console.log(error);
    }
    setFocusMember(null);
  }

  return (
    <>
      <Popup id="tf-team" show={showPopup} setShow={setShowPopup} closePopup={handleClosePopup}>
        <h4>Edit Task Force Team</h4>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-y-5 gap-x-10 max-h-100 my-5 overflow-y-auto">
          {currentTeamMembers.map(member => <div key={member.name} className="flex items-center hover:bg-teal-50 duration-200 px-5 rounded-sm">
            <button className="button-icon mr-2 flex justify-between grow-2 h-[100%] items-center" onClick={() => handleShowMemberPopup(member)}>
              <p className="pr-5 mr-auto" style={{ color: "black" }}>{member.name}</p>
              <i className="bi bi-pencil-square"></i>
            </button>
            <button className="button-icon button-red" onClick={() => handleDeleteMemberPopup(member)}><i className="bi bi-x" style={{ fontSize: "2rem" }}></i></button>
          </div>)}
        </div>
        <button className="button button-light mx-auto block my-5" onClick={() => handleShowMemberPopup(null)}>Add a team member</button>
      </Popup>

      <Popup id="tf-delete-member" show={showDeletePopup} setShow={setShowDeletePopup} nested
             buttons={[{text:"Remove", onclick:handleRemove}]}>
          <div className="text-center mt-6">Remove {focusMember?.name}?</div>
      </Popup>

      <PopupForm id="tf-team-member" show={showMemberPopup} setShow={setShowMemberPopup} validate={memberValidate} nested>
        <h4>Edit Team Member</h4>
        <label htmlFor="edit-member-name">Name:</label><br />
        <input id="edit-person-name" name="name" type="text" className={"input input-text w-full " + (formRequired?.name && "input-required")}
               placeholder="Name" onChange={(e) => checkEmpty(e.target.value, "name")}
               defaultValue={focusMember?.name} />
        <div className="input-error">This field is required.</div>
        
        <br /><br />
        <label htmlFor="edit-member-role">Task Force Role:</label><br />
        <input id="edit-person-role" name="role" type="text" className="input input-text w-full"
               placeholder="Task Force Role"
               defaultValue={focusMember?.role} />
        <br /><br />
        <label htmlFor="edit-member-loc">Location:</label><br />
        <input id="edit-member-loc" name="location" type="text" className="input input-text w-full"
               placeholder="Location"
               defaultValue={focusMember?.location} />
        <br /><br />
        <label htmlFor="edit-member-contact">Contact:</label><br />
        <input id="edit-member-contact" name="contact" type="text" className="input input-text w-full"
               placeholder="Contact"
               defaultValue={focusMember?.contact} />
        <br /><br />
        <label htmlFor="edit-member-url">IAJES Profile URL:</label><br />
        <input id="edit-member-url" name="iajes-url" type="text" className={"input input-text w-full " + (formRequired?.iajesUrl && "input-required")}
               placeholder="/profile/..." onChange={iajesUrlChange}
               defaultValue={focusMember?.iajes_url} />
        <div className="input-error">Invalid profile URL. IAJES profile URL must start with /profile/</div>
        <br /><br />
        <label>
          Image:<br />
          <input id="edit-member-image" name="image" type="file" />
          <div className="input-error">This field is required.</div>
        </label>
      </PopupForm>
    </>
  )
}

function EditProjects({showPopup, setShowPopup, taskForceUrl, projects}) {
  const [showProjectPopup, setShowProjectPopup] = useState(false);
  const [editProject, setEditProject] = useState({});

  function handleShowProjectPopup(projectId) {
    setShowProjectPopup(true);
    setEditProject(projectId);
  }

  function validate() {
    
  }
  
  return (
    <>
      <Popup id="tf-projects" show={showPopup} setShow={setShowPopup}>
        <h4>Edit Task Force Projects</h4>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-y-5 gap-x-10 max-h-100 overflow-y-auto">
            {projects.map(project => <div key={project.name} className="flex items-center hover:bg-teal-50 duration-200 px-5 rounded-sm">
              <button className="button-icon mr-2 flex justify-between grow-2 h-[100%] items-center" onClick={() => handleShowProjectPopup(project)}>
                <p className="pr-5 mr-auto" style={{ color: "black" }}>{project.name}</p>
                <i className="bi bi-pencil-square"></i>
              </button>
              <button className="button-icon button-red"><i className="bi bi-x" style={{ fontSize: "2rem" }}></i></button>
            </div>)}
          </div>
          <button className="button button-light mx-auto block my-5" onClick={() => handleShowProjectPopup()}>Add a project</button>
      </Popup>

      <PopupForm id="tf-project" className="md:w-200" show={showProjectPopup} setShow={setShowProjectPopup} validate={validate} nested>
        <h4>Edit Project</h4>
        <div className="flex gap-5 w-full md:flex-row flex-col mb-5">
          <div>
            <label htmlFor="edit-project-title">Project title:</label><br />
            <input id="edit-project-title" name="edit-project-title" type="text" className="input input-text md:w-70 w-full" />
          </div>
          <label>
            Image:<br />
            <input id="edit-project-img" name="edit-project-img" type="file" />
            <div className="input-error">This field is required.</div>
          </label>
        </div>
        <div className="mb-5">
          <label htmlFor="edit-project-url">Project URL:</label><br />
          <input id="edit-project-url" name="edit-project-url" type="text" className="input input-text w-full" />
        </div>
        <div className="">
          <label htmlFor="edit-project-desc">Project details:</label><br />
          <textarea id="edit-project-desc" name="edit-project-desc" className="input input-text w-full h-60" ></textarea>
        </div>
      </PopupForm>
    </>
  )
}

export default function TaskForce({ loaderData }) {
  const isAdmin = true;

  const taskForceData = loaderData;

  const [showShortDescPopup, setShowShortDescPopup] = useState(false);
  const [showContentTopPopup, setShowContentTopPopup] = useState(false);
  const [showContentBottomPopup, setShowContentBottomPopup] = useState(false);
  const [showTeamPopup, setShowTeamPopup] = useState(false);
  const [showProjectsPopup, setShowProjectsPopup] = useState(false);

  let memberClassName = "w-full my-5 duration-200 grid gap-5 justify-items-center ";
  if (taskForceData.team_members) {
    if (taskForceData.team_members.length == 1) {
      memberClassName += "grid-cols-1";
    } else if (taskForceData.team_members.length == 2) {
      memberClassName += "grid-cols-2";
    } else if (taskForceData.team_members.length == 3) {
      memberClassName += "xl:grid-cols-3 grid-cols-2";
    } else {
      memberClassName += "xl:grid-cols-4 lg:grid-cols-3 grid-cols-2";
    }
  }


  return (
    <>
      <EditShortDescPopup showPopup={showShortDescPopup} setShowPopup={setShowShortDescPopup} content={taskForceData.short_desc} taskForceUrl={taskForceData.url} />
      <EditContentTopPopup showPopup={showContentTopPopup} setShowPopup={setShowContentTopPopup} content={taskForceData.content_top} taskForceUrl={taskForceData.url} />
      <EditContentBottomPopup showPopup={showContentBottomPopup} setShowPopup={setShowContentBottomPopup} content={taskForceData.content_top} taskForceUrl={taskForceData.url} />
      <EditTeam showPopup={showTeamPopup} setShowPopup={setShowTeamPopup} taskForceUrl={taskForceData.url} teamMembers={taskForceData.team_members} />
      <EditProjects showPopup={showProjectsPopup} setShowPopup={setShowProjectsPopup} taskForceUrl={taskForceData.url} projects={taskForceData.projects} />
      
      <Menu />
      <Banner>
        <a href="/task-forces" className="banner-breadcrumb">
            <i className="bi bi-caret-left-fill"></i>
            <strong>TASK FORCES</strong>
        </a>
        <h1 style={{ color: "white" }}>{taskForceData.name}</h1>
      </Banner>

      <div className="w-full lg:px-40 px-10 py-15 duration-200 text-center">

        <div className="w-full text-left duration-200 mb-10">
          <p>{taskForceData.short_desc}</p>
          {isAdmin &&
            <div className="w-full mt-5 text-right">
              <button className="button button-light" onClick={() => { setShowShortDescPopup(true) }}>
                Edit Short Description
              </button>
            </div>
          }
        </div>

        <div className="w-full text-left duration-200 mb-10">
          <p>{taskForceData.content_top}</p>
          {isAdmin &&
            <div className="w-full mt-5 text-right">
              <button className="button button-light" onClick={() => { setShowContentTopPopup(true) }}>
                Edit Area
              </button>
            </div>}
        </div>

        <div className="w-full md:text-left relative duration-200 mb-10">
          <h2>Team Members</h2>
          {isAdmin && <button className="button button-light md:absolute -top-1 right-0" onClick={() => { setShowTeamPopup(true) }}>Edit People</button>}
          <div className={memberClassName}>
            {taskForceData.team_members.map(person => <MemberCard key={person.name} memberData={person} />)}
          </div>
        </div>

        <div className="w-full text-left duration-200 mb-10">
          <p>{taskForceData?.content_bottom}</p>
          {isAdmin &&
            <div className="w-full mt-5 text-right">
              <button className="button button-light" onClick={() => { setShowContentBottomPopup(true) }}>
                Edit Area
              </button>
            </div>}
        </div>

        <div className="w-full md:text-left relative duration-200 mb-10">
          <h2>Projects</h2>
          {isAdmin && <button className="button button-light md:absolute -top-1 right-0" onClick={() => { setShowProjectsPopup(true) }}>Edit Projects</button>}
          {taskForceData.projects.map(project => <ProjectCard key={project.name} projectData={project} />)}
        </div>

        {/* <div className="w-full md:text-left relative duration-200 mb-10">
          <h2>External Links</h2>
          {isAdmin && <button className="button button-light md:absolute -top-1 right-0">Edit</button>}

        </div> */}

      </div>
      <Footer />
    </>
  );
}
