import { useState, useEffect } from 'react';
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
    return data || [];
}

// Add Team Member
// Adds a team member to the Team Members table
// And adds the member's id to the list of team members of the task force
// Returns the list of task force members
//   Will be updated if successful
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
async function addProject(taskForceUrl, projectList, formData) {
  const { data, errorProjects } = await supabase
    .from('task force projects')
    .insert({
      name: formData.get("name"),
      details: formData.get("details"),
      url: formData.get("url")
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

async function updateProject(projectId, formData) {
  const { error } = await supabase
    .from('task force projects')
    .update({
      name: formData.get("name"),
      details: formData.get("details"),
      url: formData.get("url")
    })
    .eq('id', projectId)
    return error;
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
    <div className="mb-5 mt-5">
      { projectData.url ? 
          <a href={projectData.url} className="hover:text-primary-dark duration-200"><h4>{projectData.name}</h4></a> 
          :
          <h4>{projectData.name}</h4> 
        }
      <div className="grid md:grid-cols-[auto_300px] grid-cols-1 gap-4">
        <p className="text-left">
          {projectData.details}
        </p>
        { projectData.image_url &&
          <div className="rounded-md md:max-h-50 overflow-hidden">
            <img className="rounded-md" src={projectData.image_url} />
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
      const newMembers = await getTeamMembers(updatedTeamMemberList)
      setCurrentTeamMembers(newMembers);
      setShowMemberPopup(false);
    } else {
      const updateMember = await updateTeamMember(focusMember.id, formData);
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
  const navigate = useNavigate();
  const [currentProjects, setCurrentProjects] = useState(projects);
  const [showProjectPopup, setShowProjectPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [focusProject, setFocusProject] = useState({});

  function handleClosePopup() {
    setShowPopup(false);
    navigate(0);
  }

  function handleShowProjectPopup(projectData) {
    setShowProjectPopup(true);
    setFocusProject(projectData);
  }

  function handleDeleteProjectPopup(projectData) {
    setShowDeletePopup(true);
    setFocusProject(projectData);
  }

  const [formRequired, setFormRequired] = useState({ name: false });

  async function validate(formData) {
    let isValidated = true;

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
      const updatedProjectList = await addProject(taskForceUrl, projectList, formData);

      // if the team project is successfully created, fetch project again to update UI
      const newProjects = await getProjects(updatedProjectList)
      setCurrentProjects(newProjects);
      setShowProjectPopup(false);
    } else {
      const updatedProject = await updateProject(focusProject.id, formData);
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
      <Popup id="tf-projects" show={showPopup} setShow={setShowPopup} closePopup={handleClosePopup}>
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
             buttons={[{text:"Remove", onclick:handleRemove}]}>
          <div className="text-center mt-6">Remove {focusProject?.name}?</div>
      </Popup>

      <PopupForm id="tf-project" className="md:w-200" show={showProjectPopup} setShow={setShowProjectPopup} validate={validate} nested>
        <h4>Edit Project</h4>
        <div className="flex gap-5 w-full md:flex-row flex-col mb-5">
          <div>
            <label htmlFor="edit-project-name">Project title:</label><br />
            <input id="edit-project-name" name="name" type="text" className={"input input-text md:w-70 w-full " + (formRequired?.name && "input-required")} 
                   placeholder="Project name" onChange={(e) => checkEmpty(e.target.value, "name")}
                   defaultValue={focusProject?.name} />
            <div className="input-error">This field is required.</div>
          </div>
          <label>
            Image:<br />
            <input id="edit-project-img" name="image-url" type="file" />
            <div className="input-error">This field is required.</div>
          </label>
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


  return (
    <>
      <EditShortDescPopup showPopup={showShortDescPopup} setShowPopup={setShowShortDescPopup} content={taskForceData.short_desc} taskForceUrl={taskForceData.url} />
      <EditContentTopPopup showPopup={showContentTopPopup} setShowPopup={setShowContentTopPopup} content={taskForceData.content_top} taskForceUrl={taskForceData.url} />
      <EditContentBottomPopup showPopup={showContentBottomPopup} setShowPopup={setShowContentBottomPopup} content={taskForceData.content_bottom} taskForceUrl={taskForceData.url} />
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
          {isAdmin && <button className="button button-light md:absolute top-1 right-0" onClick={() => { setShowTeamPopup(true) }}>Edit People</button>}
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
          {isAdmin && <button className="button button-light md:absolute top-1 right-0" onClick={() => { setShowProjectsPopup(true) }}>Edit Projects</button>}
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
