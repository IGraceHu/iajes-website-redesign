import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { Banner } from "../components/graphics";
import "../styles/regional-meetings.css";
import "../styles/video-resources.css";
import { useParams } from "react-router";

export function meta() {
    return [
        { title: "Regional Meeting" },
    ];
}

const regionalData = {
    JHEASA: {
        name: "JHEASA",
        count: 60,
    },
    "AJCU-NA": {
        name: "AJCU - NA",
        count: 30,
    },
    AUSJAL: {
        name: "AUSJAL",
        count: 30,
    },
    Kircher: {
        name: "Kircher",
        count: 28,
    },
    "AJCU-AP": {
        name: "AJCU - AP",
        count: 19,
    },
    "AJCU-AM": {
        name: "AJCU - AM",
        count: 10,
    },
};

export default function RegionalMeeting() {
    const { regionName } = useParams();
    const region = regionalData[regionName];

    if (!region) {
        return (
            <>
                <Menu />
                <div className="w-full bg-white">
                    <div className="lg:px-40 px-10 py-20">
                        <p>Region not found</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // sample meeting data until database is available
    const meetings = [
        {
            title: "Meeting Title",
            date: "January 1, 2000",
            dateUrl: "1-1-2000",
            location: "Santa Clara University",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            agendaLink: "#",
        },
        {
            title: "Second Meeting Title",
            date: "February 15, 2001",
            dateUrl: "2-15-2001",
            location: "Boston College",
            description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            agendaLink: "#",
        },
        {
            title: "Third Meeting Title",
            date: "March 22, 2002",
            dateUrl: "3-22-2002",
            location: "Georgetown University",
            description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            agendaLink: "#",
        },
    ];

    return (
        <>
            <Menu />
            <div className="relative w-full lg:px-40 px-10 py-20 bg-secondary-light overflow-hidden" style={{ color: "white" }}>
                <div className="absolute top-0 left-0 w-full z-0">
                    <div className="relative w-full opacity-50">
                        <img className="absolute w-50 -top-20 -right-15" src="/assets/landing-disc-2a.svg" />
                        <img className="absolute w-60 top-15 -left-30 -rotate-20" src="/assets/landing-disc-4b.svg" />
                    </div>
                </div>
                <div className="relative z-1">
                    <div className="-ml-4 flex w-fit duration-200 hover:-ml-5 hover:text-primary-light">
                        <i className="bi bi-caret-left-fill"></i>
                        <a href="/regional-meetings" className="link-back border-b-2 border-transparent hover:border-primary-light ml-1 hover:ml-2">
                            <strong>REGIONAL MEETINGS</strong>
                        </a>
                    </div>
                    <h1 style={{ color: "white", textTransform: "none !important" }}>{region.name}</h1>
                </div>
            </div>

            <div className="py-20 px-10 lg:px-40 duration-200">
                {/* meeting rows */}
                {meetings.map((mtg, idx) => (
                    <div key={mtg.dateUrl} className={`meeting-row ${idx % 2 === 1 ? "bg-gray" : ""} ${idx % 2 === 1 ? "reverse" : ""}`}>
                        <div className="meeting-info">
                            <h2>{mtg.title}</h2>
                            <div>
                                <span className="font-bold">{mtg.date}</span>
                                <span className="font-bold ml-4">{mtg.location}</span>
                            </div>
                            <p className="mt-2">{mtg.description}</p>
                            <div className="meeting-buttons">
                                <a href={mtg.agendaLink} className="button button-light">
                                    Agenda <i className="bi bi-box-arrow-up-right ml-2"></i>
                                </a>
                                <a href={`/regional-meetings/${regionName}/${mtg.dateUrl}?title=${encodeURIComponent(mtg.title)}`} className="button button-light">
                                    Full Report
                                </a>
                            </div>
                        </div>
                        <div className="meeting-img" />
                    </div>
                ))}
            </div>
            <Footer />
        </>
    );
}
