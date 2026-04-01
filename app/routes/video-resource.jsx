import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import "../styles/video-resources.css";

export function meta() {
  return [
    { title: "Video Resource" },
    // { name: "description", content: "Welcome to React Router!" },
  ];
}

const resourcesTemp = [
    {
        id: 1,
        title: "Optimizing Industrial Processes with CAE",
        date: new Date("2022-03-25"),
        speaker: "Alejandro López García",
        university: "University of Deusto, Bilbao, Spain",
        speakerDetails: "Lecturer and Programme Leader at the University of Deusto - Research in Computational Mechanics, Fluid Mechanics, Granular matter and powder flow, additive manufacturing, Erosion processes",
        speakerImg: "https://lh3.googleusercontent.com/sitesv/APaQ0SQ_f2Xs3xgWvX0lZlmpQLezeSdExHZBy7Rugb0t4Ba1Q9fTG0FzhdgQjN67XvFLsIFX5vPgFXkoBb5GC57L8ZAxKEmlg2bMkg1zPVDj0BnbaeqWTWFCJnwk1cOCiN9V8WQXYX8CBc93CHb8YGo_GYGTxM4GP9qU6BnO76gN82KnbcqNeem7xtUwp-syEIx2i3DPhCsrzZ1MO6wQZ0_45VFbS5Nr7Te3gJDc=w1280",
        video: "https://drive.google.com/file/d/1gd2J8PqdCEGIMtpfd-eJ-ju70iUReXoQ/preview",
        desc: "How can we improve industrial processes with Computer Aided Engineering?"
    }
]


export async function loader({ params }) {
  const found = resourcesTemp.find((vidInf) => vidInf.id == params.vidId);
  const vid = found || {};
  // Ensure expected arrays/fields exist to avoid runtime errors when mapping
  vid.title = vid.title || "";
  vid.speaker = vid.speaker || "";
  vid.univeristy = vid.university || "";
  vid.speakerDetails = vid.speakerDetails || "";
  vid.speakerImg = vid.speakerImg || "";
  vid.video = vid.video || "";
  vid.desc = vid.desc || "";
  return vid;
}

export default function VideoResource({ loaderData }) {
    return (
        <>
            <Menu />
            <Banner type="blue">
                <div className="relative z-1"> 
                    <a href="/video-resources" className="banner-breadcrumb">
                        <i className="bi bi-caret-left-fill"></i>
                        <strong>VIDEO RESOURCES</strong>
                    </a>
                    <h1 style={{ color: "white", textTransform: "none !important" }}>{loaderData.title}</h1>
                    <p>
                        <span className="text-lg">By {loaderData.speaker}</span> <span className="ml-5 opacity-70"><i>{loaderData.date.toLocaleDateString()}</i></span>
                    </p>
                </div>
            </Banner>

            <div className="py-20 px-10 lg:px-40 duration-200">
                <div className="mb-5 w-full h-[43vw]">
                        <iframe src={loaderData.video} width="100%" height="100%"></iframe>
                </div>
                <p>{loaderData.desc}</p>

                <div className="relative mt-5 rounded-md border-2 border-gray-light p-5 flex flex-col md:flex-row place-items-center">
                    <img className="mx-auto w-50 shrink-0 grow-0" src={loaderData.speakerImg} alt="" />
                    <div className="w-full md:w-70 shrink-0 grow-0 m-3">
                        <p className="font-semibold mr-2"><i>{loaderData.speaker}</i></p>
                        <p className="text-disabled-light">{loaderData.university}</p>
                    </div>
                    <p>{loaderData.speakerDetails}</p>
                </div>
                
            </div>
            
            <Footer />
        </>
    )
}