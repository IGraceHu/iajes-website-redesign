import { useState } from "react";
import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { H2Middle, Break, Banner } from "../components/graphics";
import "../styles/organizational-structure.css";

export function meta() {
    return [
        { title: "Organizational Structure" },
    ];
}

// Section 1: Infographic with organizational structure
function InfographicSection() {
    return (
        <Banner type="dark">

            <h1 className="text-center mb-12 text-white relative z-10">Organizational Structure</h1>

            {/* Triangle infographic */}
            <div className="org-structure-container relative z-10">
                {/* Top box - Governing Board */}
                <div className="org-box org-box-top">
                    <h4 className="text-center mb-4">Governing Board</h4>
                    <p className="text-sm text-center">
                        <strong>Who:</strong> President, Vice-President, Secretary, Chair of Regional Committee, Chair of Operational Committee, Past-President<br /><br />
                        <strong>What:</strong> Guarantees the smooth running of IAJES. Supports projects within IAJES. Facilitates links between members.
                    </p>
                </div>

                {/* Bottom left box - Regional Committee */}
                <div className="org-box org-box-bottom-left">
                    <h4 className="text-center mb-4">Regional Committee</h4>
                    <p className="text-sm text-center">
                        <strong>Who:</strong> The 6 Regional Leaders<br /><br />
                        <strong>What:</strong> Monitors the work of the regions. Guarantees inter-regional links. Each regional manager coordinates the university representatives in their region.
                    </p>
                </div>

                {/* Bottom right box - Operational Committee */}
                <div className="org-box org-box-bottom-right">
                    <h4 className="text-center mb-4">Operational Committee</h4>
                    <p className="text-sm text-center">
                        <strong>Who:</strong> All the Task Force Leaders<br /><br />
                        <strong>What:</strong> Coordinates and encourages progress on current projects. Each TF leader is in charge of the active progress of their group.
                    </p>
                </div>

                {/* Connecting arrows */}
                <svg className="org-arrows" width="100%" height="100%" viewBox="0 0 600 500" preserveAspectRatio="none">
                    {/* Top to Bottom Left */}
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                            <polygon points="0 0, 10 3, 0 6" fill="#1EA493" />
                        </marker>
                    </defs>
                    <line x1="250" y1="120" x2="150" y2="360" stroke="#1EA493" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    <line x1="150" y1="360" x2="250" y2="120" stroke="#1EA493" strokeWidth="2" markerEnd="url(#arrowhead)" />

                    {/* Top to Bottom Right */}
                    <line x1="350" y1="120" x2="450" y2="360" stroke="#1EA493" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    <line x1="450" y1="360" x2="350" y2="120" stroke="#1EA493" strokeWidth="2" markerEnd="url(#arrowhead)" />

                    {/* Bottom Left to Bottom Right */}
                    <line x1="210" y1="420" x2="390" y2="420" stroke="#1EA493" strokeWidth="2" markerEnd="url(#arrowhead)" />
                    <line x1="390" y1="420" x2="210" y2="420" stroke="#1EA493" strokeWidth="2" markerEnd="url(#arrowhead)" />
                </svg>
            </div>
        </Banner>
    );
}

// Member card component
function MemberCard({ name, university, location, email, region, taskForce, position }) {
    return (
        <div className="member-card">
            {/* Placeholder image */}
            <div className="member-image">
                <img src="../assets/landing-disc-2a.svg" alt={name} />
            </div>
            <div className="member-info">
                <h5>{name}</h5>
                <div className="member-detail">
                    <span className="label">University:</span>
                    <span>{university}</span>
                </div>
                <div className="member-detail">
                    <span className="label">Location:</span>
                    <span>{location}</span>
                </div>
                <div className="member-detail">
                    <span className="label">Email:</span>
                    <span>{email}</span>
                </div>
                {region && (
                    <div className="member-detail">
                        <span className="label">Region:</span>
                        <span dangerouslySetInnerHTML={{ __html: region }} />
                    </div>
                )}
                {taskForce && (
                    <div className="member-detail">
                        <span className="label">Role:</span>
                        <span>{taskForce}</span>
                    </div>
                )}
                <div className="member-detail member-position">
                    <span className="label">Position:</span>
                    <span>{position}</span>
                </div>
            </div>
        </div>
    );
}

// Section 2: Member Showcases
function MembersSection() {
    // Placeholder data
    const governingBoardMembers = [
        { name: "John Doe", university: "University 1", location: "Location 1", email: "john@example.com", position: "President" },
        { name: "Jane Smith", university: "University 2", location: "Location 2", email: "jane@example.com", position: "Vice-President" },
        { name: "Michael Brown", university: "University 3", location: "Location 3", email: "michael@example.com", position: "Secretary" },
        { name: "Sarah Williams", university: "University 4", location: "Location 4", email: "sarah@example.com", position: "Chair of Regional Committee" },
        { name: "David Johnson", university: "University 5", location: "Location 5", email: "david@example.com", position: "Chair of Operational Committee" },
        { name: "Emily Davis", university: "University 6", location: "Location 6", email: "emily@example.com", position: "Past-President" },
    ];

    const regionalMembers = [
        { name: "Region Leader 1", university: "University 1", location: "North America", email: "leader1@example.com", region: "AJCU-US<br />North America", position: "Regional Leader" },
        { name: "Region Leader 2", university: "University 2", location: "Latin America", email: "leader2@example.com", region: "AUSJAL<br />Latin America", position: "Regional Leader" },
        { name: "Region Leader 3", university: "University 3", location: "Europe", email: "leader3@example.com", region: "KIRCHER<br />Europe and Near East", position: "Regional Leader" },
        { name: "Region Leader 4", university: "University 4", location: "Africa", email: "leader4@example.com", region: "AJCU - AM<br />Africa and Madagascar", position: "Regional Leader" },
        { name: "Region Leader 5", university: "University 5", location: "South Asia", email: "leader5@example.com", region: "JHEASA<br />South Asia", position: "Regional Leader" },
        { name: "Region Leader 6", university: "University 6", location: "Asia Pacific", email: "leader6@example.com", region: "AJCU - AP<br />Asia Pacific", position: "Regional Leader" },
    ];

    const operationalMembers = [
        { name: "TF Leader 1", university: "University 1", location: "Location 1", email: "tf1@example.com", taskForce: "Task Force Leader (Research & Academic Cooperation)", position: "Task Force Leader" },
        { name: "TF Leader 2", university: "University 2", location: "Location 2", email: "tf2@example.com", taskForce: "Task Force Leader (Women In STEM)", position: "Task Force Leader" },
        { name: "TF Leader 3", university: "University 3", location: "Location 3", email: "tf3@example.com", taskForce: "Task Force Leader (Healthcare)", position: "Task Force Leader" },
        { name: "TF Leader 4", university: "University 4", location: "Location 4", email: "tf4@example.com", taskForce: "Task Force Leader (Artificial Intelligence & Humanity)", position: "Task Force Leader" },
        { name: "TF Leader 5", university: "University 5", location: "Location 5", email: "tf5@example.com", taskForce: "Task Force Leader (Engineering and Social Justice)", position: "Task Force Leader" },
        { name: "TF Leader 6", university: "University 6", location: "Location 6", email: "tf6@example.com", taskForce: "Task Force Leader (Humanitarian Technology)", position: "Task Force Leader" },
        { name: "TF Leader 7", university: "University 7", location: "Location 7", email: "tf7@example.com", taskForce: "Task Force Leader (Infrastructure)", position: "Task Force Leader" },
        { name: "TF Leader 8", university: "University 8", location: "Location 8", email: "tf8@example.com", taskForce: "Task Force Leader (Energy)", position: "Task Force Leader" },
        { name: "TF Leader 9", university: "University 9", location: "Location 9", email: "tf9@example.com", taskForce: "Task Force Leader (Communication)", position: "Task Force Leader" },
    ];

    return (
        <div className="bg-white py-20 px-10">
            {/* Governing Board */}
            <div className="mb-24">
                <H2Middle className="text-center">Governing Board</H2Middle>
                <div className="grid lg:grid-cols-6 md:grid-cols-3 min-[500px]:grid-cols-2 grid-cols-1 gap-12 mt-12 lg:mx-6 mx-0">
                    {governingBoardMembers.map((member, idx) => (
                        <MemberCard key={idx} {...member} />
                    ))}
                </div>
            </div>

            {/* Regional Committee */}
            <div className="mb-24">
                <H2Middle className="text-center">Regional Committee</H2Middle>
                <div className="grid lg:grid-cols-6 md:grid-cols-3 min-[500px]:grid-cols-2 grid-cols-1 gap-12 mt-12 lg:mx-6 mx-0">
                    {regionalMembers.map((member, idx) => (
                        <MemberCard key={idx} {...member} region={member.region} />
                    ))}
                </div>
            </div>

            {/* Operational Committee */}
            <div className="mb-24">
                <H2Middle className="text-center">Operational Committee</H2Middle>
                <div className="grid lg:grid-cols-6 md:grid-cols-3 min-[500px]:grid-cols-2 grid-cols-1 gap-12 mt-12 lg:mx-6 mx-0">
                    {operationalMembers.slice(0, 6).map((member, idx) => (
                        <MemberCard key={idx} {...member} taskForce={member.taskForce} />
                    ))}
                </div>
                <div className="grid lg:grid-cols-6 md:grid-cols-3 min-[500px]:grid-cols-2 grid-cols-1 gap-12 mt-12 lg:mx-6 mx-0">
                    {operationalMembers.slice(6).map((member, idx) => (
                        <MemberCard key={idx + 6} {...member} taskForce={member.taskForce} />
                    ))}
                </div>
            </div>

            {/* Regions and Task Forces Info */}
            <div className="bg-teal-50 py-20 px-10 lg:px-20 mt-20">
                {/* Regions */}
                <div className="mb-16">
                    <h3 className="text-center mb-8">The 6 Regions identified by IAJU</h3>
                    <div className="regions-grid">
                        <table className="regions-table">
                            <tbody>
                                <tr>
                                    <td><strong>AJCU - AM</strong></td>
                                    <td>Africa and Madagascar</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="regions-table">
                            <tbody>
                                <tr>
                                    <td><strong>JHEASA</strong></td>
                                    <td>South Asia</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="regions-table">
                            <tbody>
                                <tr>
                                    <td><strong>AJCU - AP</strong></td>
                                    <td>Asia Pacific</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="regions-table">
                            <tbody>
                                <tr>
                                    <td><strong>AJCU - US</strong></td>
                                    <td>North America</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="regions-table">
                            <tbody>
                                <tr>
                                    <td><strong>AUSJAL</strong></td>
                                    <td>Latin America</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="regions-table">
                            <tbody>
                                <tr>
                                    <td><strong>KIRCHER</strong></td>
                                    <td>Europe and Near East</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-center text-pretty text-gray-dark mt-6 text-sm">
                        The biennial international meeting, which allows us to welcome new members, takes place in turn in the 6 regions identified by the IAJU (International Association of Jesuit Universities).
                    </p>
                </div>
                <Break dark />

                {/* Task Forces */}
                <div className="mt-10">
                    <h3 className="text-center mb-8">Task Forces</h3>
                    <div className="text-center text-gray-dark text-sm leading-relaxed">
                        <p className="font-semibold mb-4">1 Leader, several IAJES Members</p>
                        <ul className="text-left space-y-2 max-w-3xl mx-auto list-disc">
                            <li>The federating themes of IAJES are treated (validated by the Governing Board)</li>
                            <li>Each group decides on its organization and the necessary means, in particular the rhythm of the team meetings which guarantees the progress of the actions</li>
                            <li>Each group offers at least one webinar every two years and shares its results at the IAJES biennial meeting</li>
                        </ul>
                        <p className="mt-4"><strong>Types of projects that can be carried out over a given period of time:</strong> specific proposal for a new federating theme, improvement of communication (website, database, facebook, instagram, twitter...), inter-university challenge for students, specific proposal for a webinar, organization of the biennial meeting, reflection on financing, proposal for the evolution of the organizational structure, etc.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Section 3: Roles Grid
function RolesSection() {
    const roles = [
        {
            title: "President",
            description: "• Chairs the Governing Board.\n• Supports the actions of regional leaders.\n• Follows and encourages the committees and task forces.\n• Represents IAJES at the IAJU Board.\n• Is elected for 2 years. After that, he or she is expected to be Past President."
        },
        {
            title: "Vice-President",
            description: "• Assists the President in his various tasks and replaces him or her when necessary.\n• Leads the preparation group for the biennial meeting.\n• Is elected for 2 years. After that, he or she is expected to be President."
        },
        {
            title: "Chair of the Regional Committee",
            description: "• Chairs the Regional Committee.\n• Organizes a regional event every two years, preferably during the year when there is no summit.\n• Identifies a secretary among the other regional leaders. \n• Is elected for 2 years and can be reelected once."
        },
        {
            title: "Chair of the Operational Committee",
            description: "• Chairs the Operational Committee.\n• Identify a secretary among the other task force leaders.\n• Is elected for 2 years and can be reelected once."
        },
        {
            title: "Secretary",
            description: "• Assists the President or Chair to prepare the committees and special working sessions.\n• Writes and shares session minutes.\n• Is elected for 2 years and can be reelected once."
        },
        {
            title: "Past President",
            description: "• Assists the President and the Governing Board when necessary, offering his or her experience."
        },
        {
            title: "Regional Leader",
            description: "• Represents and facilitates the IAJES network in its region.\n• Contacts the deans to explain the IAJES network and ensure that each Jesuit engineering and science school is an active member of the network.\n• Coordinates the group of university representatives in the region.\n• Facilitates the participation of regional members in task forces.\n• Informs other regional leaders about relevant events.\n• Promotes events proposed by other regions within the region.\n• Participates in the Regional Committee meetings.\n• Is elected for 2 years and may be reelected."
        },
        {
            title: "Task force and project leader",
            description: "• Constitutes and leads its work group by ensuring a good dynamic.\n• Defines the objective in line with the vision of IAJES.\n• Strives to have active members from all regions in his group (at least 3 of the 6 regions should be represented).\n• Ensures concrete results are achieved and shared with all members.\n• Reports to the Operational Committee."
        },
        {
            title: "University Representative",
            description: "• Promotes the actions of IAJES in his own university.\n• Informs its regional leader about news to be shared in IAJES.\n• Presents the network's activities at its university and encourages participation in the various actions.\n• Updates the database for members of his or her university.\n• Designated by his or her university."
        },
        {
            title: "Remarks:",
            description: "• The Governing Board propose a roadmap for the development of IAJES (vision, ambition, objectives, organization). This road map must find the right balance to allow the development of the association, the realization of the actions (task force, projects), the right rhythm of the events (annual or biennial gathering, extraordinary meetings of the committees), the necessary involvement of the members, the close relationship with IAJU.\n• Each member negotiates with his university the time necessary for the good realization of his mission. The university is thus involved in conscience in the development of IAJES. This commitment could eventually take the form of a mission letter written by the university.\n• This prior negotiation with one's university is essential for roles with responsibilities such as: President, Vice President, Chair of the Regional Committee, Chair of the Operational Committee, Secretary, Past President, Regional leader, Task force and project leader, University representative.\n• It is desirable that the different roles be taken on for a given time and by members from different regions in order to promote the international development of the network",
            isLastBox: true
        }
    ];

    return (
        <div className="bg-secondary-dark py-20 px-0 lg:px-0 relative overflow-hidden">
            {/* Decorative discs */}
            <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
                <img className="absolute w-50 -top-20 -right-15 opacity-20" src="../assets/landing-disc-2a.svg" />
                <img className="absolute w-60 top-15 -left-30 -rotate-20 opacity-20" src="../assets/landing-disc-4b.svg" />
            </div>

            <div className="text-center mb-12 px-10 lg:px-40 relative z-10">
                <h2 className="text-white mb-4">Roles</h2>
                <p className="text-white text-sm">These roles were established at the Bhubaneshwar Summit in July 2024.</p>
            </div>

            <div className="roles-grid px-10 relative z-10">
                {roles.map((role, idx) => (
                    <div key={idx} className={`role-card ${role.isLastBox ? 'role-card-last' : ''}`}>
                        <h4>{role.title}</h4>
                        <div className="role-content">
                            {role.description.split('\n').map((line, lineIdx) => (
                                <div key={lineIdx} className="role-line">{line}</div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Section 4: Logo Section
function LogoSection() {
    return (
        <div className="bg-white py-20 px-10 lg:px-40">
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
                <div className="flex flex-col justify-center order-2 md:order-1">
                    <h2 className="mb-6">The IAJES Logo</h2>
                    <p className="text-gray-dark">
                        The logo was designed by students of Javeriana Cali <a href="#" target="_blank" rel="noopener noreferrer">Arte, Arquitectura y Diseño</a> section.<br /><br />
                        It was received with enthusiasm and agreement from the participating members and has become the official logo of IAJES.
                    </p>
                </div>

                <div className="flex items-stretch order-1 md:order-2">
                    <img
                        src="../assets/logo-iajes.svg"
                        alt="IAJES Logo"
                        className="w-full h-[70vh] object-contain rounded-md md:h-auto"
                        style={{ minHeight: 160 }}
                    />
                </div>
            </div>
        </div>
    );
}

export default function OrganizationalStructure() {
    return (
        <>
            <Menu />
            <div className="w-full duration-200">
                <InfographicSection />
                <MembersSection />
                <RolesSection />
                <LogoSection />
            </div>
            <Footer />
        </>
    );
}
