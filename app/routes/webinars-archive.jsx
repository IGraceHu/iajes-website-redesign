import { useState, useEffect } from 'react';
import cn from 'classnames';
import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import "../styles/webinars.css";

export function meta() {
    return [
        { title: "Webinars Archive" },
        { name: "", content: "" },
    ];
}


const urbanMobilityWebinar = (
    <div>
        <p className="text-md font-semibold">First webinar of the "Infrastructure" Task Force</p>
        <div className="w-full overflow-hidden my-5 lg:h-[70vw] h-[110vw]">
            <iframe title="Urban mobility webinar slides" src="https://drive.google.com/file/d/1Ut8BdPVqqPD4pwC-0O8GlRbJ-4dLIqTj/preview" width="100%" height="100%"></iframe>
        </div>
        <h4>Speakers</h4>
        <div>
            <div className="flex flex-col gap-5 p-5 bg-teal-50">
                <div className="flex">
                    <div className="h-40 mr-5 shrink-0">
                        <img className="w-full h-full" src="/img/webinars/urban_nicolas_rincon_garcia.png" alt="Nicolas Rincon Garcia headshot" />
                    </div>
                    <div className="">
                        <h6>Nicolas Rincon Garcia</h6>
                        <p className="font-semibold">Javeriana University - Bogota, Colombia</p>
                        <p><i>Professor of Industrial Engineering</i></p>
                        <p>Transport Observatory & Data Sciences</p>
                    </div>
                </div>

                <div className="self-center w-full lg:h-[25vw] h-[35vw]">
                    <iframe title="Nicolas Rincon Garcia urban mobility presentation" src="https://drive.google.com/file/d/1lUJKXjJmHK1_bKm8q9g6wBo7kdkUYZyA/preview" width="100%" height="100%"></iframe>
                </div>
            </div>
            <div className="flex flex-col gap-5 p-5">
                <div className="flex">
                    <div className="h-40 mr-5 shrink-0">
                        <img className="w-full h-full" src="/img/webinars/urban_marcus_meyers.png" alt="Marcus Mayers headshot" />
                    </div>
                    <div className="">
                        <h6>Marcus Mayers</h6>
                        <p className="font-semibold">Manchester Metropolitan University</p>
                        <p><i>Research fellow</i></p>
                        <p>Train infrastructure rehabilitation in Colombia</p>
                    </div>
                </div>

                <div className="self-center w-full lg:h-[25vw] h-[35vw]">
                    <iframe title="Marcus Mayers urban mobility presentation" src="https://drive.google.com/file/d/1cxvV09iHECCd-3OgESWC3XUvbvdrg_wa/preview" width="100%" height="100%"></iframe>
                </div>
            </div>
            <div className="flex flex-col gap-5 p-5 bg-teal-50">
                <div className="flex">
                    <div className="h-40 mr-5 shrink-0">
                        <img className="w-full h-full" src="/img/webinars/urban_karla_denis_castro_leite.png" alt="Karla Denis Castro Leite headshot" />
                    </div>
                    <div className="">
                        <h6>Karla Denis Castro Leite</h6>
                        <p className="font-semibold">Catholic University of Pernambuco - Brazil</p>
                        <p><i>Professor of Civil Engineering</i></p>
                        <p>The role of citizen participation in the implementation of public policies for sustainable mobility: the case of the bicycle office in Pernambuco, Brazil</p>
                    </div>
                </div>

                <div className="self-center w-full lg:h-[25vw] h-[35vw]">
                    <iframe title="Karla Denis Castro Leite urban mobility presentation" src="https://drive.google.com/file/d/1cgb_yN5sV9TYrb11zTbJOlHwmBYx91Su/preview" width="100%" height="100%"></iframe>
                </div>
            </div>
        </div>
    </div>
);

const firstTaskForceWebinar = (
    <div>
        <a href="/task-forces/research-and-academic-cooperation" className="button block w-md">
            Research and Academic Cooperation Task Force
            <i className="bi bi-arrow-right ml-2 mt-1" aria-hidden="true"></i>
        </a>
        <div className="w-full my-5 lg:h-[70vw] h-[110vw]">
            <iframe title="Research and Academic Cooperation webinar" src="https://drive.google.com/file/d/1IYsGuviohJKb8AxZim83DMQocxrY7AtJ/preview" width="100%" height="100%"></iframe>
        </div>
    </div>
);

const embodyEcologyWebinar = (
    <div>
        <div className="p-10 bg-secondary-light text-center text-white rounded-md">
            <p className="text-md font-semibold">"What does integral ecology bring to the learning of design thinking? Why does it matter? What might be implications for Jesuit schools of engineering?"</p>
        </div>
        <div className="p-5 grid grid-cols-2 gap-5 place-items-center">
            <div className="h-40">
                <img className="w-full h-full" src="/img/webinars/embody_lanny_vincent.jpg" alt="Lanny Vincent headshot" />
            </div>
            <div>
                <h6>Lanny Vincent</h6>
                <p>Adjunct Lecturer Innovation Theology, Intrapreneurship, Collaborative Creativity, Systems Thinking, Design and innovation - Santa Clara University (SCU)</p>
            </div>
            <div>
                <iframe title="Lanny Vincent integral ecology presentation" src="https://drive.google.com/file/d/1xmWGxc7kqXWLgDOKV1FZrRV0WPhvNg-I/preview" width="100%" height="100%"></iframe>
            </div>
            <div>
                <iframe title="Lanny Vincent integral ecology discussion" src="https://drive.google.com/file/d/14oPb6ghOh4iWYLcb1SEHU4o1xK7SxcDu/preview" width="100%" height="100%"></iframe>
            </div>
        </div>
        <div className="mb-5 p-1 bg-secondary-light text-center text-white rounded-md"></div>


        <div className="p-10 bg-secondary-light text-center text-white rounded-md">
            <p className="text-md font-semibold">"What if speculative design could be applied in order to develop experimental architecture / design projects at undergraduate level?"</p>
        </div>
        <div className="p-5 grid grid-cols-2 gap-5 place-items-center">
            <div className="h-40">
                <img className="w-full h-full" src="/img/webinars/embody_celina_andino.png" alt="Celina Andino headshot" />
            </div>
            <div>
                <h6>Celina Andino</h6>
                <p>Program Director of Product Design Master degree - Universidad Centroamericana "José Simeón Cañas" - San Salvador</p>
            </div>
            <div>
                <iframe title="Celina Andino integral ecology presentation" src="https://drive.google.com/file/d/1PPphj1Jz2nDfz95wGfEHrovSr8OZZ3Nc/preview" width="100%" height="100%"></iframe>
            </div>
            <div>
                <iframe title="Celina Andino integral ecology discussion" src="https://drive.google.com/file/d/1knDXu15fi872jEJw5pI6ZMiepZquc3m0/preview" width="100%" height="100%"></iframe>
            </div>
        </div>
        <div className="mb-5 p-1 bg-secondary-light text-center text-white rounded-md"></div>


        <div className="p-10 bg-secondary-light text-center text-white rounded-md">
            <p className="text-md font-semibold">"...to create an impact for the betterment of our society in the empowerment of the next generation of innovators and technopreneurs..."</p>
        </div>
        <div className="p-5 grid grid-cols-2 gap-5 place-items-center">
            <div className="h-40">
                <img className="w-full h-full" src="/img/webinars/embody_carlos_toto_oppus.png" alt="Carlos Toto Oppus headshot" />
            </div>
            <div>
                <h6>Carlos Toto Oppus</h6>
                <p>Director, Ateneo Innovation Center - Computer Engineering - Manila</p>
            </div>
            <div>
                <iframe title="Carlos Toto Oppus integral ecology presentation" src="https://drive.google.com/file/d/1U492PBs5fdmd1MNklb2GZiyVdUFl83ZJ/preview" width="100%" height="100%"></iframe>
            </div>
            <div>
                <iframe title="Carlos Toto Oppus integral ecology discussion" src="https://drive.google.com/file/d/11-9mcORt9-VmuMtJINaxyS82fCx9wLgX/preview" width="100%" height="100%"></iframe>
            </div>
        </div>
        <div className="mb-5 p-1 bg-secondary-light text-center text-white rounded-md"></div>


        <div className="p-10 bg-secondary-light text-center text-white rounded-md">
            <p className="text-md font-semibold">"Teaching this Jesuit value while meeting students and engineering curriculums where they are."</p>
        </div>
        <div className="p-5 grid grid-cols-2 gap-5 place-items-center">
            <div className="h-40">
                <img className="w-full h-full" src="/img/webinars/embody_tonya_nilsson.jpg" alt="Tonya Nilsson headshot" />
            </div>
            <div>
                <h6>Tonya Nilsson</h6>
                <p>Senior Lecturer - Civil - environment and  sustainable Engineering - Santa Clara University (SCU)</p>
            </div>
            <div>
                <iframe title="Tonya Nilsson integral ecology presentation" src="https://drive.google.com/file/d/1SCHpSQWDXHP3lPZ_xMQpw9-PYAUjcssD/preview" width="100%" height="100%"></iframe>
            </div>
            <div>
                <iframe title="Tonya Nilsson integral ecology discussion" src="https://drive.google.com/file/d/1hTtjruvo0Z81bTeILPPpGiKfDnD1zfP5/preview" width="100%" height="100%"></iframe>
            </div>
        </div>

        <div className="mb-5 p-1 bg-secondary-light text-center text-white rounded-md"></div>
        <h4>Q & A Session</h4>
        <div className="w-full lg:h-[30vw] h-[50vw]">
            <iframe title="Integral ecology webinar question and answer session" src="https://drive.google.com/file/d/1orgU9xY3zrZiBoB77ISVc6sPy7F-a5xF/preview" width="100%" height="100%"></iframe>
        </div>
    </div>
);

const covidWebinar = (
    <div>
        <div className="w-full my-5 lg:h-[70vw] h-[110vw]">
            <iframe title="Covid 19 web cooperation webinar slides" src="https://drive.google.com/file/d/1a1DNVV1_tafmCm3nnEVz_Ych1lBbQigA/preview" width="100%" height="100%"></iframe>
        </div>
        <br />
        <h4>Webinar Recording</h4>
        <div className="w-full lg:h-[30vw] h-[50vw]">
            <iframe title="Covid 19 web cooperation webinar recording" src="https://drive.google.com/file/d/18giFFUSupFJ9baMfzWFXgCOWqdn1RHqu/preview" width="100%" height="100%"></iframe>
        </div>
    </div>
);

const icamWebinar = (
    <div>
        <p>
            <img className="xl:float-right xl:w-sm mb-5" src="/img/webinars/icam_intro.png" alt="Icam Parcours Ouvert introduction" />
            <strong>In 2017, Icam launched the “Parcours Ouvert”</strong> - Considering the changing profile of the younger generation and the complexity of the issues that engineers will have to address in the coming years, Icam has taken a bold step forward in the pedagogical innovation. The “Parcours ouvert” is built on five founding principles:
            <ul className="my-2 ml-2 list-disc list-inside">
                <li>Larger scale of student profiles</li>
                <li>A cross-disciplinary, experiential curriculum</li>
                <li>International inter-campus synchronized program</li>
                <li>Project and Problem based learning as the royal path to creativity and innovation</li>
                <li>Addressing of the real world problems in the vision of Integral ecology</li>
            </ul>
            This program with students distributed in Douala, Recife, Kinshasa … and in the near future in other places around the world is an extraordinary promising opportunity for new generations of international multi-disciplinary engineers.
            <br /><br />
            <strong>In this activity, we</strong> introduce the "Parcours Ouvert" to the broader IAJES community with the hopes of obtaining feedback from participants on the design of the program, and to stimulate discussions on topics of common interest. This online event will include an introduction to the "Parcours ouvert" program followed by exchanges based on the questions.
        </p>
        <div className="w-full my-5 lg:h-[30vw] h-[50vw]">
            <iframe title="Icam Parcours Ouvert webinar recording" src="https://drive.google.com/file/d/1wCNq24bStjSvzrJb3Bf_LIZS4t8vcLOo/preview" width="100%" height="100%"></iframe>
        </div>
        <h4>Collection of words at the end of the webinar</h4>
        <div className="grid grid-cols-2 gap-2 text-center items-top justify-items-top">
            <p>First Session</p>
            <p>Second Session</p>
            <img src="/img/webinars/icam_words_1.png" alt="Word collection from first Icam webinar session" />
            <img src="/img/webinars/icam_words_2.png" alt="Word collection from second Icam webinar session" />
        </div>
    </div>
);

const bostonWebinar = (
    <div>
        <img className="float-right" src="/img/webinars/boston_image.png" alt="Boston College human-centered engineering program" />
        <ul className="my-2 ml-2 list-disc list-inside">
            <li>THE PRESENTATION - Human-centered Engineering at BC</li>

            <li>RESULTS: Share and Learn breakout sessions</li>
            <ul className="my-2 ml-2 list-disc list-inside">
                <li>Curricular Balance</li>
                <li>Organization and Administration</li>
                <li>Curricular Elements related to the Common Good</li>
                <li>Integration of Ethics in the Curriculum</li>
                <li>Foundational Experiences</li>
            </ul>

            <li>BC WEBSITE - HCE Engineering Program</li>
        </ul>
    </div>
);

const webinars = [
    {
        title: "Urban mobility in the Perspective of Integral Ecology & Digitalisation",
        date: "2021/05/23",
        content: urbanMobilityWebinar,
    },
    {
        title: 'First "Research & Academic Cooperation" Task Force Webinar',
        date: "2021/05/11",
        content: firstTaskForceWebinar
    },
    {
        title: "Embodying Integral Ecology in Learning Design",
        date: "2021/4/21",
        content: embodyEcologyWebinar
    },
    {
        title: "Covid 19, Opened New Doors for Web-Cooperation",
        date: "2021/03/16",
        content: covidWebinar
    },
    {
        title: 'Icam "Parcours Ouvert" Engineering program',
        date: "2020/10/20",
        content: icamWebinar
    },
    {
        title: "Boston College Human Centered Engineering Program",
        date: "2020/07/08",
        content: bostonWebinar
    },
]

function Webinar({ info }) {
    useEffect(() => {

    })

    return (
        <div>
            <span id="webinar" className="block h-30 -mt-30"></span>
            <h3>{info.title}</h3>
            <p className="text-disabled-light" style={{ marginBottom: "calc(var(--spacing) * 2)" }}><i>{info.date}</i></p>
            {info.content}
        </div>
    )
}

function WebinarButton({ className, title, date, active = false, onClick }) {
    let buttonClasses = "webinar-list-button w-full p-4 flex justify-between items-center border-x-2 border-t-2 border-gray-light text-left hover:bg-teal-50 hover:cursor-pointer duration-200";
    buttonClasses += (active) ? " active" : "";
    return (
        <button
            className={buttonClasses + " " + className}
            onClick={() => {
                onClick();
                document.getElementById("webinar")?.scrollIntoView({ behavior: "smooth" });
            }}
            aria-pressed={active}
        >
            <div>
                <p className="mr-5 font-semibold text-secondary-dark lg:block inline">{title}</p>
                <p className="text-s text-disabled-light lg:block inline"><i>{date}</i></p>
            </div>
            <i className="bi bi-chevron-double-right duration-500 text-white" style={{ fontSize: "1.8rem" }} aria-hidden="true"></i>
        </button>
    )
}



export default function Webinars() {
    const [activeWebinar, setActiveWebinar] = useState(0);

    const webinarList = [];
    for (let i = 0; i < webinars.length; i++) {
        let itemClasses = "";
        if (i == 0) {
            itemClasses = "rounded-t-md";
        }
        if (i == webinars.length - 1) {
            itemClasses = "rounded-b-md border-b-2";
        }

        webinarList.push(<WebinarButton key={i} className={itemClasses} title={webinars[i].title} date={webinars[i].date} active={i == activeWebinar} onClick={() => setActiveWebinar(i)} />);
    }

    const [showScrollContainer, setShowScrollContainer] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollContainer(window.scrollY > 500);
        };

        window.addEventListener("scroll", handleScroll);

    }, [showScrollContainer]);

    return (
        <>
            <Menu currentEndUrl="/webinars" />
            <main id="main-content" className="lg:px-40 px-10 py-20 duration-200">
                <div className="flex justify-between md:items-center md:flex-row flex-col md:mb-0 mb-5">
                    
                    <h1>Webinars Archive</h1>
                        
                    <a href="/webinars" className="button button-light block">Current Webinars</a>

                </div>
                <div className="relative w-full grid lg:grid-cols-[min-content_auto] grid-rows-[min-content_auto] gap-5 z-1">
                    <div className="flex flex-col justify-between">
                        <div className="relative flex flex-col mb-10 lg:w-xs z-1">
                            {webinarList}
                        </div>
                        <div className={cn("z-0 sticky w-min bottom-10 opacity-0 duration-200 overflow-visible lg:block hidden", showScrollContainer && "opacity-100")}>
                            <p className="text-primary-light w-min"><strong>WEBINAR</strong></p>
                            <h4 className="w-xs">{webinars[activeWebinar].title}</h4>
                            <p className="text-s text-disabled-light w-min"><i>{webinars[activeWebinar].date}</i></p>
                        </div>
                    </div>
                    <div className="relative w-full overflow-hidden">
                        <Webinar info={webinars[activeWebinar]} />
                    </div>
                </div>

                <div className={cn("z-2 h-0 sticky -bottom-20 lg:-mt-20 mt-3 float-right text-end opacity-0 duration-500", showScrollContainer && "opacity-100 h-50")}>
                    <div>
                        <button className="button button-light lg:-mr-25" onClick={() => window.scrollTo(0, 0)} aria-label="Scroll to top"><i className="bi bi-chevron-double-up duration-500" style={{ fontSize: "1.2rem" }} aria-hidden="true"></i></button>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
