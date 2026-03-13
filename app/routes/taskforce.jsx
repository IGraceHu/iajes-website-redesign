import { useState } from 'react';
import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { Popup, PopupForm } from "../components/popup";
import { Banner } from "../components/graphics";


export function meta() {
  return [
    { title: "Task Force" },
    // { name: "description", content: "Welcome to React Router!" },
  ];
}

const tfInfoTemp = [
  {
    url: "research-and-academic-cooperation",
    name: "Research & Academic Cooperation",
    shortDesc: "The Task Force on Research and Academic Cooperation, with its commendable achievements, aims to create a real network between people who perform academic work at the IAJES institutions. We strive to connect people, develop synergies, and strengthen all engineering programs within the network. To date, we have successfully conducted two projects that have provided results and potential opportunities, and we continue to work to connect more people and institutions to improve research and cooperation. ",
    textarea1: "The Task Force on Research and Academic Cooperation, with its commendable achievements, aims to create a real network between people who perform academic work at the IAJES institutions. We strive to connect people, develop synergies, and strengthen all engineering programs within the network. To date, we have successfully conducted two projects that have provided results and potential opportunities, and we continue to work to connect more people and institutions to improve research and cooperation. ",
    textarea2: `- 16-03-2021: Participation in the webinar presenting the PhD Cooperative Program of IQS. 
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
    people: [
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
    people: []
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

export async function loader({ params }) {
  const found = tfInfoTemp.find((tfInf) => tfInf.url == params.tfName);
  const tf = found || {};
  // Ensure expected arrays/fields exist to avoid runtime errors when mapping
  tf.people = tf.people || [];
  tf.projects = tf.projects || [];
  tf.textarea1 = tf.textarea1 || "";
  tf.textarea2 = tf.textarea2 || "";
  tf.name = tf.name || "";
  return tf;
}

function MemberCard({ memberData }) {
  return (
    <div className="text-center w-full">
      <div className="max-w-50 w-full max-h-50 m-5 mx-auto bg-gray-light overflow-hidden">
        <img className="min-w-full min-h-full" src={memberData.imageURL} />
      </div>
      <p>{memberData.name}</p>
      <p>{memberData.position}</p>
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

function EditShortDescPopup({showPopup, setShowPopup, taskForceId, userId}) {
  function validate(formData) {

  }

  return (
    <PopupForm id="tf-shortdesc" className="md:w-[60vw] duration-200 mx-10 my-5" show={showPopup} setShow={setShowPopup} validate={validate}>
      <h4>Edit short description:</h4>
      <p>The short description appears in the main task force page.</p>
      <textarea id="tf-desc-input" name="tf-desc-input" className="input-text w-full min-h-30 h-[30vh]"></textarea>
    </PopupForm>
  )
}

function EditTextarea1Popup({showPopup, setShowPopup, taskForceId, userId}) {
  function validate(formData) {

  }
  
  return (
    <PopupForm id="tf-textarea1" className="md:w-[70vw] duration-200 mx-10 my-5" show={showPopup} setShow={setShowPopup} validate={validate}>
      <h4>Edit area:</h4>
      <textarea id="tf-textarea1-input" name="tf-textarea1-input" className="input-text w-full min-h-50 h-[50vh]"></textarea>
    </PopupForm>
  )
}

function EditTextarea2Popup({showPopup, setShowPopup, taskForceId, userId}) {
  function validate(formData) {

  }
  
  return (
    <PopupForm id="tf-textarea2" className="md:w-[70vw] duration-200 mx-10 my-5" show={showPopup} setShow={setShowPopup} validate={validate}>
      <h4>Edit area:</h4>
      <textarea id="tf-textarea2-input" name="tf-textarea2-input" className="input-text w-full min-h-50 h-[50vh]"></textarea>
    </PopupForm>
  )
}

function EditTeam({showPopup, setShowPopup, taskForceId, userId, people}) {
  const [showMemberPopup, setShowMemberPopup] = useState(false);
  const [editMember, setEditMember] = useState({});

  function handleShowMemberPopup(memberId) {
    setShowMemberPopup(true);
    setEditMember(memberId);
  }

  function validate() {
    
  }

  return (
    <>
      <Popup id="tf-team" show={showPopup} setShow={setShowPopup}>
        <h4>Edit Task Force Team</h4>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-y-5 gap-x-10 max-h-100 my-5 overflow-y-auto">
          {people.map(person => <div key={person.name} className="flex items-center hover:bg-teal-50 duration-200 px-5 rounded-sm">
            <button className="button-icon mr-2 flex justify-between grow-2 h-[100%] items-center" onClick={() => handleShowMemberPopup(person)}>
              <p className="pr-5 mr-auto" style={{ color: "black" }}>{person.name}</p>
              <i className="bi bi-pencil-square"></i>
            </button>
            <button className="button-icon button-red"><i className="bi bi-x" style={{ fontSize: "2rem" }}></i></button>
          </div>)}
        </div>
        <button className="button button-light mx-auto block my-5" onClick={() => handleShowMemberPopup()}>Add a team member</button>
      </Popup>

      <PopupForm id="tf-team-member" show={showMemberPopup} setShow={setShowMemberPopup} validate={validate} nested>
        <h4>Edit Team Member</h4>
        <label for="edit-member-name">Name:</label><br />
        <input id="edit-person-name" name="edit-person-name" type="text" className="input input-text w-full" />
        <br /><br />
        <label for="edit-member-loc">Location:</label><br />
        <input id="edit-member-loc" name="edit-member-loc" type="text" className="input input-text w-full" />
        <br /><br />
        <label for="edit-member-contact">Contact:</label><br />
        <input id="edit-member-contact" name="edit-member-contact" type="text" className="input input-text w-full" />
        <br /><br />
        <label for="edit-member-url">IAJES Profile URL:</label><br />
        <input id="edit-member-url" name="edit-member-url" type="text" className="input input-text w-full" />
        <br /><br />
        <label>
          Image:<br />
          <input id="edit-member-image" name="edit-member-image" type="file" />
          <div className="input-error">This field is required.</div>
        </label>
      </PopupForm>
    </>
  )
}

function EditProjects({showPopup, setShowPopup, taskForceId, userId, projects}) {
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
            <label for="edit-project-title">Project title:</label><br />
            <input id="edit-project-title" name="edit-project-title" type="text" className="input input-text md:w-70 w-full" />
          </div>
          <label>
            Image:<br />
            <input id="upload" type="file" />
            <div className="input-error">This field is required.</div>
          </label>
        </div>
        <div className="mb-5">
          <label for="edit-project-url">Project URL:</label><br />
          <input id="edit-project-url" name="edit-project-url" type="text" className="input input-text w-full" />
        </div>
        <div className="">
          <label for="edit-project-desc">Project details:</label><br />
          <textarea id="edit-project-desc" name="edit-project-desc" className="input input-text w-full h-60" ></textarea>
        </div>
      </PopupForm>
    </>
  )
}

export default function TaskForce({ loaderData }) {
  const isAdmin = true;

  const taskForceId = "";
  const currentUserId = "";

  const [showShortDescPopup, setShowShortDescPopup] = useState(false);
  const [showTextarea1Popup, setShowTextarea1Popup] = useState(false);
  const [showTextarea2Popup, setShowTextarea2Popup] = useState(false);
  const [showTeamPopup, setShowTeamPopup] = useState(false);
  const [showProjectsPopup, setShowProjectsPopup] = useState(false);

  let memberClassName = "w-full my-5 duration-200 grid gap-5 justify-items-center ";
  if (loaderData.people) {
    if (loaderData.people.length == 1) {
      memberClassName += "grid-cols-1";
    } else if (loaderData.people.length == 2) {
      memberClassName += "grid-cols-2";
    } else if (loaderData.people.length == 3) {
      memberClassName += "xl:grid-cols-3 grid-cols-2";
    } else {
      memberClassName += "xl:grid-cols-4 lg:grid-cols-3 grid-cols-2";
    }
  }


  return (
    <>
      <EditShortDescPopup showPopup={showShortDescPopup} setShowPopup={setShowShortDescPopup} taskForceId={taskForceId} userId={currentUserId} />
      <EditTextarea1Popup showPopup={showTextarea1Popup} setShowPopup={setShowTextarea1Popup} taskForceId={taskForceId} userId={currentUserId} />
      <EditTextarea2Popup showPopup={showTextarea2Popup} setShowPopup={setShowTextarea2Popup} taskForceId={taskForceId} userId={currentUserId} />
      <EditTeam showPopup={showTeamPopup} setShowPopup={setShowTeamPopup} taskForceId={taskForceId} userId={currentUserId} people={loaderData.people} />
      <EditProjects showPopup={showProjectsPopup} setShowPopup={setShowProjectsPopup} taskForceId={taskForceId} userId={currentUserId} projects={loaderData.projects} />
      
      <Menu />
      <Banner>
        <p><strong>TASK FORCE</strong></p>
          <h1 style={{ color: "white" }}>{loaderData.name}</h1>
      </Banner>

      <div className="w-full lg:px-40 px-10 py-15 duration-200 text-center">

        <div className="w-full text-left duration-200 mb-10">
          <p>{loaderData.shortDesc}</p>
          {isAdmin &&
            <div className="w-full mt-5 text-right">
              <button className="button button-light" onClick={() => { setShowShortDescPopup(true) }}>
                Edit Short Description
              </button>
            </div>
          }
        </div>

        <div className="w-full text-left duration-200 mb-10">
          <p>{loaderData.textarea1}</p>
          {isAdmin &&
            <div className="w-full mt-5 text-right">
              <button className="button button-light" onClick={() => { setShowTextarea1Popup(true) }}>
                Edit Area
              </button>
            </div>}
        </div>

        <div className="w-full md:text-left relative duration-200 mb-10">
          <h2>Team Members</h2>
          {isAdmin && <button className="button button-light md:absolute -top-1 right-0" onClick={() => { setShowTeamPopup(true) }}>Edit People</button>}
          <div className={memberClassName}>
            {loaderData.people.map(person => <MemberCard key={person.name} memberData={person} />)}
          </div>
        </div>

        <div className="w-full text-left duration-200 mb-10">
          <p>{loaderData?.textarea2}</p>
          {isAdmin &&
            <div className="w-full mt-5 text-right">
              <button className="button button-light" onClick={() => { setShowTextarea2Popup(true) }}>
                Edit Area
              </button>
            </div>}
        </div>

        <div className="w-full md:text-left relative duration-200 mb-10">
          <h2>Projects</h2>
          {isAdmin && <button className="button button-light md:absolute -top-1 right-0" onClick={() => { setShowProjectsPopup(true) }}>Edit Projects</button>}
          {loaderData.projects.map(project => <ProjectCard key={project.name} projectData={project} />)}
        </div>

        {/* <div className="w-full md:text-left relative duration-200 mb-10">
          <h2>External Links</h2>
          {isAdmin && <button className="button button-light md:absolute -top-1 right-0">Edit</button>}

        </div> */}

        <a href="/task-forces" className="button">Back to Task Forces</a>

      </div>
      <Footer />
    </>
  );
}
