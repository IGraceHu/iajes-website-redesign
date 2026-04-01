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
            <div className="relative w-full lg:px-40 px-10 py-20 bg-secondary-light overflow-hidden" style={{ color: "white" }}>
                <div className="absolute top-0 left-0 w-full z-0">
                    <div className="relative w-full opacity-50">
                        <img className="absolute w-50 -top-20 -right-15" src="../assets/landing-disc-2a.svg" />
                        <img className="absolute w-60 top-15 -left-30 -rotate-20" src="../assets/landing-disc-4b.svg" />
                    </div>
                </div>
                <div className="relative z-1">
                    <div className="-ml-4 flex w-fit duration-200 hover:-ml-5 hover:text-primary-light">
                        <i className="bi bi-caret-left-fill"></i>
                        <a href="/video-resources" className="link-back border-b-2 border-transparent hover:border-primary-light ml-1 hover:ml-2">
                            <strong>VIDEO RESOURCES</strong>
                        </a>
                    </div>
                    <h1 style={{ color: "white", textTransform: "none !important" }}>{loaderData.title}</h1>
                    <p className="text-lg">By {loaderData.speaker}</p>
                </div>
            </div>

            <div className="py-20 px-10 lg:px-40 duration-200">
                <div className="grid lg:grid-cols-[32rem_auto] grid-cols-1 gap-5">
                    <div className="lg:mr-5 mb-5 lg:h-80 w-full h-[50vw]">
                        <iframe src={loaderData.video} width="100%" height="100%"></iframe>
                    </div>

                    <div className="relative lg:row-start-1 lg:col-start-2 row-start-3">
                        <p><i><span className="font-semibold mr-2">{loaderData.speaker}</span> <span className="text-disabled-light">{loaderData.university}</span></i></p>
                        <img className="my-5 mx-auto" src={loaderData.speakerImg} alt="" />
                        <p>{loaderData.speakerDetails}</p>
                    </div>

                    <div className="lg:col-span-2 row-start-2">
                    <p>{loaderData.desc}</p>
                </div>
                </div>
                
            </div>
            
            <Footer />
        </>
    )
}