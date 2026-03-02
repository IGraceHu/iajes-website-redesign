import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { Banner } from "../components/graphics";

export function meta() {
  return [
    { title: "Task Forces" },
  ];
}

const tfInfoTemp = [
    {
        url: "research-and-academic-cooperation",
        name: "Research & Academic Cooperation",
        desc: "The Task Force on Research and Academic Cooperation, with its commendable achievements, aims to create a real network between people who perform academic work at the IAJES institutions. We strive to connect people, develop synergies, and strengthen all engineering programs within the network. To date, we have successfully conducted two projects that have provided results and potential opportunities, and we continue to work to connect more people and institutions to improve research and cooperation. ",
        imageURL: null,
    },
    {
        name: "Women In STEM",
        desc: "Looking at STEM with a Women's Perspective - Network for Women in STEM\nInternational network that fosters the incorporation and retention of women in STEM programs at Jesuit Higher Education institutions around the world.",
        imageUrl: null,
        url: "name-2"
    },
    {
        name: "Healthcare",
        desc: "Improved Quality Life Through Social Justice in Healthcare Technology",
        imageUrl: null,
        url: "name-3"
    },
    {
        name: "Artificial Intelligence & Humanity",
        desc: "The Artificial Intelligence & Humanity Task Force of the International Association of Jesuit Engineering and Science Schools (IAJES), promotes ethical AI development and social justice within Jesuit education by fostering collaboration among global institutions, encouraging innovative practices, and addressing inequities in AI and big data systems. Through initiatives like the 2025 article on AI’s role in educating rural communities, it leverages tools like natural language processing to enhance equitable access to education and sustainable livelihoods, aligning with IAJES’s mission to cultivate excellence and critical thinking in engineering and science for the greater good.",
        imageUrl: null,
        url: "name-4"
    },
    {
        name: "Engineering and Social Justice",
        desc: "At each of our Jesuit institutions, our university core curriculum transforms our students through Ignatian pedagogy.  Our engineering students can draw upon this social justice foundation in analyzing how engineering decisions affect the world.  At Loyola Chicago, the social justice case studies embedded in our engineering curriculum provide methods for this analysis and the path towards an increased sense of engineering professional responsibility.",
        imageUrl: null,
        url: "name-5"
    },
    {
        name: "Humanitarian Technology & Frugal Innovation",
        desc: "",
        imageUrl: null,
        url: "name-6"
    },
    {
        name: "Infrastructure",
        desc: "The goal is to grow together and empower our Engineering Schools by mutual collaboration, so we are able to elaborate and participate in meaningful infrastructure projects.",
        imageUrl: null,
        url: "name-7"
    },
    {
        name: "Energy",
        desc: "Build an active International Network to support Sustainable and Fair Energy Access and Transition. ",
        imageUrl: null,
        url: "name-8"
    }
]

function TaskForceSection({taskForceInfo}) {
    let cardClass = "flex w-full px-10 py-10 gap-10 duration-200";
    return (
        <div className={cardClass}>
            <div className="w-full">
                <a href={"/task-forces/" + taskForceInfo.url}><h2 className="text-center">{taskForceInfo.name}</h2></a>
                <p>{taskForceInfo.desc}</p>
            </div>
            { taskForceInfo?.imageUrl && 
            <img className="w-100 h-full min-h-50 max-h-75" src={taskForceInfo.imageUrl} />}
        </div>
    )
}

export default function TaskForces() {
    const taskForces = [];
    tfInfoTemp.map((tf) => {
        taskForces.push(<TaskForceSection key={tf.url} taskForceInfo={tf}/>);
    })

    return (
        <>
            <Menu />
            <div className="w-full duration-200">
                <Banner type="blue">
                    <h1 className="w-full text-center" style={{color: "var(--color-primary-extralight)"}}>Task Forces</h1>
                </Banner>
                <div id="task-forces" className="grid lg:grid-cols-2 grid-cols-1">
                    {taskForces}
                </div>
            </div>
            <Footer />
        </>
    );
}
