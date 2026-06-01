import { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import { supabase } from "../supabase";
import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { Popup, PopupForm } from "../components/popup";
import { Banner, Break } from "../components/graphics";
import { updateRequired } from "../helpers/form";
import { checkCurrentAuth } from "../helpers/permissions";

export function meta({ loaderData }) {
  return [
    { title: "Task Force: " + loaderData.name },
  ];
}

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
    if (data) {
      data.sort((a, b) => { return a.id - b.id });
    }
    return data || [];
}

// Add Team Member
// Adds a team member to the Team Members table
// And adds the member's id to the list of team members of the task force
// Returns the list of task force members
//   Will be updated if successful
async function addTeamMember(taskForceUrl, teamMemberList, formData, imageUrl) {
  const { data, errorMembers } = await supabase
    .from('task force members')
    .insert({
      name: formData.get("name"),
      role: formData.get("role"),
      location: formData.get("location"),
      contact: formData.get("contact"),
      iajes_url: formData.get("iajes-url"),
      image_url: imageUrl
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
    }

    return teamMemberList;
}

async function updateTeamMember(memberId, formData, imageUrl) {
  if (imageUrl == null || imageUrl == "") {
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
  } else {
    const { error } = await supabase
      .from('task force members')
      .update({
        name: formData.get("name"),
        role: formData.get("role"),
        location: formData.get("location"),
        contact: formData.get("contact"),
        iajes_url: formData.get("iajes-url"),
        image_url: imageUrl
      })
      .eq('id', memberId)
      return error;
  }
  
}

async function deleteTeamMember(taskForceUrl, teamMemberList, memberId) {
  const memberPosition = teamMemberList.indexOf(memberId);
  if (memberPosition >= 0) {
    const response = await supabase
      .from('task force members')
      .delete()
      .eq('id', memberId)
    
    if (response) {
      teamMemberList.splice(memberPosition, 1);
      const { errorTF } = await supabase
        .from('task forces')
        .update({
          team_members: teamMemberList
        })
        .eq('url', taskForceUrl)
    }
  }
  return teamMemberList;
}

async function getProjects(projectList) {
  const { data, error } = await supabase
    .from('task force projects')
    .select()
    .in('id', projectList)
    return data || [];
}

// Add Team Member
// Adds a team member to the Team Members table
// And adds the member's id to the list of team members of the task force
// Returns the list of task force members
//   Will be updated if successful
async function addProject(taskForceUrl, projectList, formData, imageUrl) {
  const { data, errorProjects } = await supabase
    .from('task force projects')
    .insert({
      name: formData.get("name"),
      details: formData.get("details"),
      url: formData.get("url"),
      image_url: imageUrl
    })
    .select()

    if (data) {
      projectList.push(data[0].id);

      const { errorTF } = await supabase
        .from('task forces')
        .update({
          projects: projectList
        })
        .eq('url', taskForceUrl)
    }

    return projectList;
}

async function updateProject(projectId, formData, imageUrl) {
  if (imageUrl == null || imageUrl == "") {
    const { error } = await supabase
      .from('task force projects')
      .update({
        name: formData.get("name"),
        details: formData.get("details"),
        url: formData.get("url")
      })
      .eq('id', projectId)
    return error;
  } else {
    const { error } = await supabase
      .from('task force projects')
      .update({
        name: formData.get("name"),
        details: formData.get("details"),
        url: formData.get("url"),
        image_url: imageUrl
      })
      .eq('id', projectId)
    return error;
  }
}

async function deleteProject(taskForceUrl, projectList, projectId) {
  const projectPosition = projectList.indexOf(projectId);
  if (projectPosition >= 0) {
    const response = await supabase
      .from('task force projects')
      .delete()
      .eq('id', projectId)
    
    if (response) {
      projectList.splice(projectPosition, 1);
      const { errorTF } = await supabase
        .from('task forces')
        .update({
          projects: projectList
        })
        .eq('url', taskForceUrl)
    }
  }
  return projectList;
}


async function uploadTaskForceImage(file, folder) {
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const path = `${folder}/${Date.now()}-${safeName}`;
  const { error: uploadError } = await supabase.storage
    .from('task-forces')
    .upload(path, file);
  if (uploadError) {
    console.error("Error uploading task force image:", uploadError);
    return { error: uploadError };
  }
  const { data } = supabase.storage.from('task-forces').getPublicUrl(path);
  return { url: data.publicUrl };
}

function getStoragePathFromPublicUrl(url, bucket) {
  if (!url) return null;
  const marker = `/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

async function removeTaskForceImage(url) {
  const path = getStoragePathFromPublicUrl(url, 'task-forces');
  if (!path) return;
  const { error } = await supabase.storage.from('task-forces').remove([path]);
  if (error) {
    console.error("Error removing previous task force image:", error);
  }
}



// -------------------------------------------------------------------------------------------




export async function loader({ params }) {
  // const found = tfInfoTemp.find((tfInf) => tfInf.url == params.tfName);
  const tf = await getTaskForce(params.tfName);
  const teamMembers = await getTeamMembers(tf.team_members || [])
  const projects = await getProjects(tf.projects || [])
  // Ensure expected arrays/fields exist to avoid runtime errors when mapping
  tf.team_members = teamMembers || []
  tf.projects = projects || [];
  tf.content_top = tf.content_top || "";
  tf.content_bottom = tf.content_bottom || "";
  tf.name = tf.name || "";
  return tf;
}



function MemberCard({ memberData }) {
  return (
    <div className="text-center w-full flex flex-col justify-end">
      { memberData?.image_url &&
        <div className="max-w-50 w-full max-h-50 m-5 mx-auto bg-gray-light overflow-hidden">
          <img className="min-w-full min-h-full object-cover" src={memberData.image_url} />
        </div>
      }
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
    <div className="mb-5 mt-5">
      { projectData.projectURL ? 
          <a href={projectData.projectURL} className="hover:text-primary-dark duration-200"><h4>{projectData.name}</h4></a> 
          :
          <h4>{projectData.name}</h4> 
        }
      <div className="grid md:grid-cols-[auto_300px] grid-cols-1 gap-4">
        <p className="text-left">
          {projectData.details}
        </p>
        { projectData.image_url &&
          <div className="rounded-md md:max-h-50 overflow-hidden">
            <img className="rounded-md object-cover" src={projectData.image_url} />
          </div>
        }
      </div>
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
      <p>This is the short description appears in the main task force page.</p>
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
  const [formRequired, setFormRequired] = useState({ name: false, iajesUrl: false });

  const [memberHasError, setMemberHasError] = useState(false);
  const [memberImagePreview, setMemberImagePreview] = useState("");


  function handleClosePopup() {
    setShowPopup(false);
    navigate(0);
  }

  function handleShowMemberPopup(memberData) {
    setMemberHasError(false);
    setMemberImagePreview(memberData?.image_url || "");    
    setShowMemberPopup(true);
    setFormRequired({ name: false, iajesUrl: false });
    setFocusMember(memberData);
  }

  function handleDeleteMemberPopup(memberData) {
    setShowDeletePopup(true);
    setFocusMember(memberData);
  }

  function handleMemberImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setMemberImagePreview(URL.createObjectURL(file));
  }


  // create and update
  async function memberValidate(formData) {
    let isValidated = true;

    // IMAGE HANDLING -------------------------------------
    const imageFile = formData.get("edit-member-image");
    const previousImageUrl = focusMember?.image_url || null;
    let imageUrl = previousImageUrl;

    if (imageFile && imageFile.name && imageFile.size > 0) {
      const uploadResult = await uploadTaskForceImage(imageFile, `members/${taskForceUrl || "unknown"}`);
      if (uploadResult.error) {
        setMemberHasError(true);
        return false;
      }
      imageUrl = uploadResult.url;
      if (previousImageUrl) {
        await removeTaskForceImage(previousImageUrl);
      }
    }

    // URL HANDLING -------------------------------------
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
      const updatedTeamMemberList = await addTeamMember(taskForceUrl, teamMemberList, formData, imageUrl);

      // if the team member is successfully created, fetch team members again to update UI
      const newMembers = await getTeamMembers(updatedTeamMemberList)
      setCurrentTeamMembers(newMembers);
      setShowMemberPopup(false);
    } else {
      const updateMember = await updateTeamMember(focusMember.id, formData, imageUrl);
      if (updateMember === null) {
        const newMembers = await getTeamMembers(teamMemberList);
        setCurrentTeamMembers(newMembers);
      }
      setShowMemberPopup(false);
    }
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
      
      const newMembers = await getTeamMembers(updatedTeamMemberList)
      setCurrentTeamMembers(newMembers);
      setShowDeletePopup(false);
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
             buttons={[{text:"Remove", onclick:handleRemove, className: "button-red"}]}>
          <div className="text-center mt-6">Remove {focusMember?.name}?</div>
      </Popup>

      <PopupForm id="tf-team-member" show={showMemberPopup} setShow={setShowMemberPopup} validate={memberValidate} hasError={memberHasError} encType="multipart/form-data"  nested>
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

        <label htmlFor="edit-member-image">Image:</label><br />
          {focusMember?.image_url && !memberImagePreview && (
            <p className="text-sm text-disabled-dark">Leave empty to keep existing image.</p>
          )}
          {memberImagePreview && (
            <img src={memberImagePreview} alt="Member preview" className="my-2 max-h-40 object-cover rounded" />
          )}
        <input id="edit-member-image" name="edit-member-image" type="file" accept=".jpg,.jpeg,.png" onChange={handleMemberImageChange} />

      </PopupForm>
    </>
  )
}

function EditProjects({showPopup, setShowPopup, taskForceUrl, projects}) {
  const navigate = useNavigate();
  const [currentProjects, setCurrentProjects] = useState(projects);
  const [showProjectPopup, setShowProjectPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [focusProject, setFocusProject] = useState({});
  const [formRequired, setFormRequired] = useState({ name: false });

  const [projectHasError, setProjectHasError] = useState(false);
  const [projectImagePreview, setProjectImagePreview] = useState("");


  function handleClosePopup() {
    setShowPopup(false);
    navigate(0);
  }

  function handleShowProjectPopup(projectData) {
    setProjectHasError(false);
    setProjectImagePreview(projectData?.image_url || "");    
    setShowProjectPopup(true);
    setFormRequired({ name: false });
    setFocusProject(projectData);
  }

  function handleDeleteProjectPopup(projectData) {
    setShowDeletePopup(true);
    setFocusProject(projectData);
  }


  function handleProjectImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setProjectImagePreview(URL.createObjectURL(file));
  }


  async function validate(formData) {
    let isValidated = true;


    const imageFile = formData.get("edit-project-img");
    const previousImageUrl = focusProject?.image_url || null;
    let imageUrl = previousImageUrl;

    if (imageFile && imageFile.name && imageFile.size > 0) {
      const uploadResult = await uploadTaskForceImage(imageFile, `projects/${taskForceUrl || "unknown"}`);
      if (uploadResult.error) {
        setProjectHasError(true);
        return false;
      }
      imageUrl = uploadResult.url;
      if (previousImageUrl) {
        await removeTaskForceImage(previousImageUrl);
      }
    }


    const isRequired = {
      name: formData.get('name') === (null || ""),
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

    // creates a list of current project ids to update the task force project list
    const projectList = [];
    if (currentProjects.length > 0) {
      currentProjects.map((project) => projectList.push(project.id));
    }
    
    // if focus project is null => new project
    if (focusProject == null) {
      const updatedProjectList = await addProject(taskForceUrl, projectList, formData, imageUrl);

      // if the team project is successfully created, fetch project again to update UI
      const newProjects = await getProjects(updatedProjectList)
      setCurrentProjects(newProjects);
      setShowProjectPopup(false);
    } else {
      const updatedProject = await updateProject(focusProject.id, formData, imageUrl);
      if (updatedProject === null) {
        const newProjects = await getProjects(projectList);
        setCurrentProjects(newProjects);
      }
      setShowProjectPopup(false);
    }
    setFocusProject(null);
  }

  function checkEmpty(value, inputName) {
      const updatedFormRequired = updateRequired(value, inputName, formRequired);
      if (updatedFormRequired != formRequired) {
        setFormRequired(updatedFormRequired);
      }
  }

  async function handleRemove() {
    try {
      // creates a list of current member ids to update the task force member list
      const projectList = [];
      if (currentProjects.length > 0) {
        currentProjects.map((project) => projectList.push(project.id));
      }

      const updatedProjectList = await deleteProject(taskForceUrl, projectList, focusProject.id);
      
      const newProjects = await getProjects(updatedProjectList)
      setCurrentProjects(newProjects);
      setShowDeletePopup(false);
    }
    catch (error) {
      console.log(error);
    }
    setFocusProject(null);
  }

  return (
    <>
      <Popup id="tf-projects" show={showPopup} setShow={setShowPopup} closePopup={handleClosePopup} hasError={projectHasError} encType="multipart/form-data">
        <h4>Edit Task Force Projects</h4>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-y-5 gap-x-10 max-h-100 overflow-y-auto">
            {currentProjects.map(project => <div key={project.name} className="flex items-center hover:bg-teal-50 duration-200 px-5 rounded-sm">
              <button className="button-icon mr-2 flex justify-between grow-2 h-[100%] items-center" onClick={() => handleShowProjectPopup(project)}>
                <p className="pr-5 mr-auto" style={{ color: "black" }}>{project.name}</p>
                <i className="bi bi-pencil-square"></i>
              </button>
              <button className="button-icon button-red" onClick={() => handleDeleteProjectPopup(project)}><i className="bi bi-x" style={{ fontSize: "2rem" }}></i></button>
            </div>)}
          </div>
          <button className="button button-light mx-auto block my-5" onClick={() => handleShowProjectPopup(null)}>Add a project</button>
      </Popup>

      <Popup id="tf-delete-project" show={showDeletePopup} setShow={setShowDeletePopup} nested
             buttons={[{text:"Remove", onclick:handleRemove, className: "button-red"}]}>
          <div className="text-center mt-6">Remove {focusProject?.name}?</div>
      </Popup>

      <PopupForm id="tf-project" className="md:w-200" show={showProjectPopup} setShow={setShowProjectPopup} validate={validate} hasError={projectHasError} encType="multipart/form-data" nested>
        <h4>Edit Project</h4>
        <div className="flex gap-5 w-full md:flex-row flex-col mb-5">
          <div>
            <label htmlFor="edit-project-name">Project title:</label><br />
            <input id="edit-project-name" name="name" type="text" className={"input input-text md:w-70 w-full " + (formRequired?.name && "input-required")} 
                   placeholder="Project name" onChange={(e) => checkEmpty(e.target.value, "name")}
                   defaultValue={focusProject?.name} />
            <div className="input-error">This field is required.</div>
          </div>
          <div>
            <label htmlFor="edit-project-img">Image:</label><br />
            {focusProject?.image_url && !projectImagePreview && (
              <p className="text-sm text-disabled-dark">Leave empty to keep existing image.</p>
            )}
            {projectImagePreview && (
              <img src={projectImagePreview} alt="Project preview" className="my-2 max-h-40 object-cover rounded" />
            )}
            <input id="edit-project-img" name="edit-project-img" type="file" accept=".jpg,.jpeg,.png" onChange={handleProjectImageChange} />
          </div>
        </div>
        <div className="mb-5">
          <label htmlFor="edit-project-url">Project URL:</label><br />
          <input id="edit-project-url" name="url" type="text" className="input input-text w-full"
                 placeholder="https://example.com"
                 defaultValue={focusProject?.url} />
        </div>
        <div className="">
          <label htmlFor="edit-project-desc">Project details:</label><br />
          <textarea id="edit-project-desc" name="details" className="input input-text w-full h-60" 
                 placeholder="Project details..."
                 defaultValue={focusProject?.details} ></textarea>
        </div>
      </PopupForm>
    </>
  )
}

export default function TaskForce({ loaderData }) {
  const [isAdmin, setIsAdmin] = useState(false);

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

  useEffect(() => {
        return checkCurrentAuth(setIsAdmin, "admin-tf-" + taskForceData.name_abbrv)
    }, []);


  return (
    <>
      <EditShortDescPopup showPopup={showShortDescPopup} setShowPopup={setShowShortDescPopup} content={taskForceData.short_desc} taskForceUrl={taskForceData.url} />
      <EditContentTopPopup showPopup={showContentTopPopup} setShowPopup={setShowContentTopPopup} content={taskForceData.content_top} taskForceUrl={taskForceData.url} />
      <EditContentBottomPopup showPopup={showContentBottomPopup} setShowPopup={setShowContentBottomPopup} content={taskForceData.content_bottom} taskForceUrl={taskForceData.url} />
      <EditTeam 
        showPopup={showTeamPopup} 
        setShowPopup={setShowTeamPopup} 
        taskForceUrl={taskForceData.url} 
        taskForceId={taskForceData.id}
        teamMembers={taskForceData.team_members} 
      />
      <EditProjects 
        showPopup={showProjectsPopup} 
        setShowPopup={setShowProjectsPopup} 
        taskForceUrl={taskForceData.url} 
        taskForceId={taskForceData.id}
        projects={taskForceData.projects} 
      />
      
      <Menu />
      <Banner>
        <a href="/task-forces" className="banner-breadcrumb">
            <i className="bi bi-caret-left-fill"></i>
            <strong>TASK FORCES</strong>
        </a>
        <h1 style={{ color: "white" }}>{taskForceData.name}</h1>
      </Banner>

      <div className="w-full lg:px-40 px-10 py-15 duration-200 text-center">
        <div className="w-full text-left duration-200 mb-5">
          <p>{taskForceData.short_desc}</p>
          {isAdmin &&
            <div className="w-full mt-5 text-right">
              <button className="button button-light" onClick={() => { setShowShortDescPopup(true) }}>
                Edit Short Description
              </button>
            </div>
          }
        </div>

        <Break />

        { (isAdmin || taskForceData?.content_top.length > 0) &&
          <div className="w-full text-left duration-200 mb-10">
            <p>{taskForceData.content_top}</p>
            {isAdmin &&
              <div className="w-full mt-5 text-right">
                <button className="button button-light" onClick={() => { setShowContentTopPopup(true) }}>
                  Edit Area
                </button>
              </div>}
          </div>
        }

        { (isAdmin || taskForceData.team_members.length > 0) &&
          <div className="w-full md:text-left relative duration-200 mb-15">
            <h2>Team Members</h2>
            {isAdmin && <button className="button button-light md:absolute top-1 right-0" onClick={() => { setShowTeamPopup(true) }}>Edit People</button>}
            <div className={memberClassName}>
              {taskForceData.team_members.map((member, idx) => <MemberCard key={`${member.name}-${idx}`} memberData={member} />)}
            </div>
          </div>
        }
        { (isAdmin || taskForceData?.content_bottom.length > 0) &&
          <div className="w-full text-left duration-200 mb-10">
            <p>{taskForceData?.content_bottom}</p>
            {isAdmin &&
              <div className="w-full mt-5 text-right">
                <button className="button button-light" onClick={() => { setShowContentBottomPopup(true) }}>
                  Edit Area
                </button>
              </div>}
          </div>
        }

        { (isAdmin || taskForceData.projects.length > 0) &&
          <div className="w-full md:text-left relative duration-200 mb-10">
            <h2>Projects</h2>
            {isAdmin && <button className="button button-light md:absolute top-1 right-0" onClick={() => { setShowProjectsPopup(true) }}>Edit Projects</button>}
            {taskForceData.projects.map((project, idx) => <ProjectCard key={`${project.name}-${idx}`} projectData={project} />)}
          </div>
        }

      </div>
      <Footer />
    </>
  );
}
