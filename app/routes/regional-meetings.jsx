import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { Banner } from "../components/graphics";
import { Link } from "react-router";
import "../styles/regional-meetings.css";

export function meta() {
    return [
        { title: "Regional Meetings" },
    ];
}

const regionalData = [
    {
        name: "JHEASA",
        nameFull: "Jesuit Higher Education in South Asia",
        count: 60,
        url: "JHEASA",
        location: "South Asia",
        imageUrl: null,
    },
    {
        name: "AJCU - NA",
        nameFull: "Association of Jesuit Colleges and Universities of North America",
        count: 30,
        url: "AJCU-NA",
        location: "United States, District of Columbia, District of Belize, Canada",
        imageUrl: null,
    },
    {
        name: "AUSJAL",
        nameFull: "Association of Universities Entrusted to the Society of Jesus in Latin America",
        count: 30,
        url: "AUSJAL",
        location: "Latin America",
        imageUrl: null,
    },
    {
        name: "Kircher",
        nameFull: "Kircher Network - Jesuit Higher Education in Europe and the Near East",
        count: 28,
        url: "Kircher",
        location: "Europe, Near East",
        imageUrl: null,
    },
    {
        name: "AJCU - AP",
        nameFull: "Association of Jesuit Colleges and Universities in Asia Pacific",
        count: 19,
        url: "AJCU-AP",
        location: "East Asia and Oceania",
        imageUrl: null,
    },
    {
        name: "AJCU - AM",
        nameFull: "Association of Jesuit Colleges and Universities of Africa and Madagascar",
        count: 10,
        url: "AJCU-AM",
        location: "Africa, Madagascar",
        imageUrl: null,
    },
];

function RegionalCard({ region }) {
    return (
        <div className="regional-card">
            <Link to={`/regional-meetings/${region.url}`} className="block w-full p-2 border-2 border-transparent hover:border-primary-light rounded-md">
                <div className="w-full lg:h-[14vw] sm:h-[28vw] h-[52vw] rounded-md mb-2 overflow-hidden bg-slate-100 flex items-center">
                    {region.imageUrl ? (
                        <img className="min-w-full grow-0 shrink-0" src={region.imageUrl} alt={region.name} />
                    ) : (
                        <div className="relative w-full h-full p-5">
                            <img className="w-[50%] absolute -right-20 -bottom-20 z-0" src="../assets/landing-disc-4a.svg" />
                            {/*<h5 className="relative z-1 text-secondary-dark">{region.name}</h5>*/}
                        </div>
                    )}
                </div>
                <div className="regional-card-content">
                    <div className="regional-card-top-row">
                        <h2 className="regional-card-title">{region.name}</h2>
                        <div className="regional-card-stat-section">
                            <span className="regional-card-statistic">{region.count}</span>
                        </div>
                    </div>
                    <div className="regional-card-bottom-row">
                        <p className="regional-card-location">{region.location}</p>
                        <p className="regional-card-caption">Universities</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default function RegionalMeetings() {
    const canEdit = true; // For testing, always show edit buttons

    const cards = regionalData.map((region) => (
        <RegionalCard key={region.url} region={region} />
    ));

    return (
        <>
            <Menu />
            <div className="w-full duration-200">
                <Banner type="blue">
                    <h1 className="w-full text-center" style={{ color: "white" }}>Regional Meetings</h1>
                </Banner>
                <div className="regional-meetings-container">
                    <div className="regional-meetings-content">
                        <h3 className="regional-subheader">The Six Jesuit Regions of the World</h3>
                        <p className="regional-description">
                            The following are the 6 regions identified by the IAJU (International Association of Jesuit Universities).
                        </p>

                        <div className="regional-cards-grid">{cards}</div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
