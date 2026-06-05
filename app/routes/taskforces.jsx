import { Menu } from "../components/menu";
import { supabase } from "../supabase";
import { Footer } from "../components/footer";
import { Banner } from "../components/graphics";

export function meta() {
  return [
    { title: "Task Forces" },
  ];
}

async function getTaskForces() {
    const { data, error } = await supabase
        .from('task forces')
        .select("id, name, url, short_desc, image_url");

    if (data) {
        data.sort((a, b) => { return a.id - b.id })
    }

    return data || [];
}

export async function loader({ params }) {
  return await getTaskForces();
}

function TaskForceSection({taskForceInfo}) {
    let cardClass = "flex w-full px-15 py-10 gap-10 duration-200";
    return (
        <div className={cardClass}>
            <div className="w-full">
                <a href={"/task-forces/" + taskForceInfo.url}><h2 className="text-center">{taskForceInfo.name}</h2></a>
                <p>{taskForceInfo.short_desc}</p>
            </div>
            { taskForceInfo?.image_url && 
            <img className="w-100 h-full min-h-50 max-h-75" src={taskForceInfo.image_url} alt={`${taskForceInfo.name} task force`} />}
        </div>
    )
}

export default function TaskForces({ loaderData }) {
    const taskForcesData = loaderData;

    const taskForces = [];
    taskForcesData.map((tf) => {
        taskForces.push(<TaskForceSection key={tf.url} taskForceInfo={tf}/>);
    })

    return (
        <>
            <Menu />
            <main id="main-content" className="w-full duration-200">
                <Banner type="blue">
                    <h1 className="w-full text-center" style={{color: "var(--color-primary-extralight)"}}>Task Forces</h1>
                </Banner>
                <div id="task-forces" className="grid lg:grid-cols-2 grid-cols-1">
                    {taskForces}
                </div>
            </main>
            <Footer />
        </>
    );
}
