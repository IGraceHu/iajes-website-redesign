import { useState } from "react";
import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { Break } from "../components/graphics";
import "../styles/about.css";

export function meta() {
    return [
        { title: "About IAJES" },
    ];
}

// Section 1: Title Section
function TitleSection() {
    return (
        <div className="lg:px-40 px-10 py-12">
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
                <div className="flex flex-col justify-center">
                    <h1 className="mb-6">About IAJES</h1>
                    <p className="text-gray-dark">
                        The International Association of Jesuit Engineering and Science Schools (IAJES) is a network
                        of Jesuit universities and colleges that collaborate to advance engineering and science education
                        through shared research, innovation, and commitment to social justice.
                    </p>
                </div>

                <div className="md:flex hidden items-stretch">
                    <img
                        src="../assets/logo-iajes.svg"
                        alt="IAJES"
                        className="w-[80%] h-[70vh] object-contain rounded-md"
                        style={{ minHeight: 160 }}
                    />
                </div>
            </div>
        </div>
    );
}

// Section 2: What We Do - Image Buttons
function WhatWeDoSection() {
    const cards = [
        { title: "Regional Meetings", href: "/regional-meetings", img: "../assets/landing-disc-2a.svg" },
        { title: "Biennial Meetings", href: "/biennial-meetings", img: "../assets/landing-disc-4b.svg" },
        { title: "Task Forces", href: "/task-forces", img: "../assets/landing-disc-2a.svg" },
        { title: "Projects", href: "/projects", img: "../assets/landing-disc-4b.svg" },
        { title: "Webinars", href: "/webinars", img: "../assets/landing-disc-2a.svg" },
    ];

    const Card = ({ title, href, img }) => (
        <div className="relative">
            <a href={href} className="about-card relative block overflow-hidden hover:cursor-pointer">

                {/* Background image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${img})` }}
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/50" />

                {/* Text */}
                <div className="relative z-10 size-full flex items-center justify-center">
                    <p className="text-white text-center font-medium">{title}</p>
                </div>
            </a>

            {/* Hover border */}
            <div className="about-card-border z-4 absolute top-0 left-0"></div>
        </div>
    );

    return (
        <div className="bg-secondary-dark py-12 px-10 lg:px-40">
            <h2 className="text-center mb-8! text-white!">
                What We Do
            </h2>

            {/* Desktop: 3 cols × 2 rows, middle spans rows */}
            <div id="what-we-do-cards-grid" className="gap-10 items-center justify-center">
                {/* Top Left */}
                <div className="lg:row-start-1 lg:col-start-1">
                    <Card {...cards[0]} />
                </div>

                {/* Bottom Left */}
                <div className="lg:row-start-2 lg:col-start-1">
                    <Card {...cards[1]} />
                </div>

                {/* Middle (spans both rows) */}
                <div className="what-we-do-center lg:row-span-2 lg:col-start-2">
                    <Card {...cards[2]} />
                </div>

                {/* Top Right */}
                <div className="lg:row-start-1 lg:col-start-3">
                    <Card {...cards[3]} />
                </div>

                {/* Bottom Right */}
                <div className="lg:row-start-2 lg:col-start-3">
                    <Card {...cards[4]} />
                </div>
            </div>

        </div>
    );
}

// Section 3: Three Column Section
function ThreeColumnSection() {
    return (
        <div className="lg:px-40 px-10 py-20">
            <div className="grid lg:grid-cols-8 md:grid-cols-1 gap-10">
                <div className="lg:col-span-3">
                    <h3>Our Mission</h3>
                    <img src="../assets/landing-disc-2a.svg" alt="Mission" className="w-full h-48 object-cover rounded-md my-6" />
                    <p>
                        To join the engineering schools in Jesuit Universities worldwide, in order to promote the development and growth of our society through academic activities, research and social action.
                        <br /><br />
                        To seek a more humane and just world through the use of technology and innovation under the guiding principles of the Society of Jesus.
                    </p>
                </div>

                <div className="lg:col-span-3">
                    <h3>Our Objectives</h3>
                    <ul className="text-left space-y-3 mt-6">
                        <li className="flex items-start"><span className="text-primary-dark mr-3">•</span><span>To know, to share and to learn from positive experiences in education, research, innovation, and service within our universities, for the purpose of forming engineers inspired by the Jesuit tradition.</span></li>
                        <li className="flex items-start"><span className="text-primary-dark mr-3">•</span><span>To promote the care of the whole person in all our interactions and experiences.</span></li>
                        <li className="flex items-start"><span className="text-primary-dark mr-3">•</span><span>To propose and work on interdisciplinary and multi-campus projects addressing the needs of marginalized individuals and communities, using the knowledge of science and engineering.</span></li>
                        <li className="flex items-start"><span className="text-primary-dark mr-3">•</span><span>To sustain a worldwide community of engineering educators, which is driven by a living sense of fellowship, belonging and solidarity.</span></li>
                    </ul>
                </div>

                <div className="lg:col-span-2">
                    <h3>Our Vision</h3>
                    <img src="../assets/landing-disc-4b.svg" alt="Vision" className="w-full h-48 object-cover rounded-md my-6" />
                    <p>
                        Make IAJES a worldwide leader and reference organization in the promotion of a new generation of engineers, scientists, and researchers deeply rooted and trained in the spirit of the Jesuit mission and Universal Apostolic Preferences.
                    </p>
                </div>
            </div>
        </div>
    );
}

// Section 4: Quote and Map Section
function QuoteAndMapSection() {
    return (
        <div className="bg-secondary-light py-20 px-10 lg:px-40">
            <div className="text-center mb-16">
                <blockquote className="text-xl text-white italic mb-6">
                    "Among the <strong>200</strong> Jesuit universities in the world, around <strong>67</strong> have an engineering or science faculty."
                </blockquote>
            </div>

            {/* Google MyMaps Embed */}
            <div className="rounded-lg overflow-hidden">
                <div className="w-full">
                    <iframe src="https://www.google.com/maps/d/embed?mid=10WMSaIkegY3WEWSkuEVXd8kfRII&ehbc=2E312F" width="100%" height="480" style={{ border: "none", minHeight: 300, }}></iframe>
                </div>
            </div>
        </div>
    );
}

// Section 5: Speaker Highlight
function SpeakerHighlightSection() {
    return (
        <div className="py-20 px-10 lg:px-40">
            <div className="text-center mb-6">
                <p className="text-sm text-gray-dark mb-6">
                    General, Arturo Sosa SJ, at the assembly in Boston, August 2022
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
                {/* Middle: Speaker Image (thinner) */}
                <div className="flex justify-center lg:col-span-2 order-1 lg:order-1">
                    <div className="w-45 h-60 bg-gray-light rounded-lg overflow-hidden flex items-center justify-center">
                        <img src="../assets/landing-disc-2a.svg" alt="General Arturo Sosa SJ" className="w-full h-full object-cover" />
                    </div>
                </div>

                {/* Right: English Quote */}
                <div className="flex flex-col items-stretch lg:col-span-3 order-2 lg:order-2">
                    <blockquote className="italic text-sm lg:text-base text-gray-dark mb-4 leading-relaxed wrap-break-word text-pretty">
                        “The International Association of Jesuit Universities finds its purpose and gives meaning to what it does by living and promoting collaboration and solidarity within and from the university institutions that make it up. It is a matter of making the best possible use of the enormous potential for collaboration and solidarity that exists in the universities that make up this network. Little by little we have been embarking on this path. As we move forward we recognize the advantages of collaboration and solidarity. We are learning better ways to take advantage of the resources we have, which are always scarce for the magnitude of the task...”
                    </blockquote>
                    <button className="button w-full mt-2">
                        View Fr. Sosa's Full Speech
                    </button>
                </div>
            </div>
        </div>
    );
}

// Section 6: Origin Timeline
function OriginTimelineSection() {
    return (
        <div className="py-24 px-10 lg:px-40 bg-teal-50">
            <div className="max-w-2xl mx-auto text-center mb-6">
                <p className="text-gray-dark mb-6">
                    As agreed, the Governing Board, elected at the Bhubaneswar Summit in July 2024, wrote a roadmap for the development of IAJES. This road map had to find the right balance to allow the development of the association, the realization of the actions, the right rhythm of the events, the necessary involvement of the members, and the close relationship with IAJU. It had been validated with the Governing Board on December, 2024.
                </p>
                <button className="button mt-6 w-full md:w-auto text-lg font-semibold inline-flex items-center px-4 py-3">
                    <span className="mx-auto">
                        <span>View the IAJES 2025-2026 Roadmap</span><span className="ml-2"><i className="bi bi-arrow-up-right"></i></span>
                    </span>
                </button>
            </div>

            <Break dark />

            <h2 className="text-center mb-8!">The Origin of IAJES</h2>

            <div className="flex flex-col lg:flex-row items-stretch gap-8 max-w-5xl mx-auto">
                <div className="flex-1 bg-white rounded-lg p-6 flex flex-col justify-between shadow-sm">
                    <div>
                        <div className="text-primary-dark font-bold mb-4">2015</div>
                        <img src="../assets/landing-disc-4b.svg" alt="2015" className="w-full h-60 object-cover rounded-md mb-4" />
                        <p className="text-gray-dark">Our initiative is both a response to a call from Pope Franciscus and Society of Jesus, especially through his secretary for higher education, Fr. Michael Garanzini and the expression of a strong shared desire to foster fruitful links of communion and cooperation among our Jesuit engineering schools.
                            <br /><br />
                            The concept was launched in July 2015 in Melbourne during the Assembly of Presidents and Rectors of Jesuit universities.</p>
                    </div>
                </div>

                <div className="flex items-center justify-center text-primary-dark">
                    <svg className="transform lg:rotate-0 rotate-90" width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M8 20L32 20M25 13L32 20L25 27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>

                <div className="flex-1 bg-white rounded-lg p-6 flex flex-col justify-between shadow-sm">
                    <div>
                        <div className="text-primary-dark font-bold mb-4">2017 / 2018</div>
                        <img src="../assets/landing-disc-2a.svg" alt="2017/2018" className="w-full h-60 object-cover rounded-md mb-4" />
                        <p className="text-gray-dark">A brief prospection in the fall 2017 led to the constitution of the first task force with worldwide representatives. Its main task was to prepare and promote a first founding conference for the IAJES International Association of Jesuit Engineering Schools.
                            <br /><br />
                            Foreseen in <strong>DEUSTO BILBAO in July 2018</strong>, this event would find a meaningful place just before the Assembly of Presidents and Rectors of Jesuit Universities where the IAJU (International Association of Jesuit Universities) would solemnly be founded.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function About() {
    return (
        <>
            <Menu />
            <div className="w-full duration-200">
                <TitleSection />
                <WhatWeDoSection />
                <ThreeColumnSection />
                <QuoteAndMapSection />
                <SpeakerHighlightSection />
                <OriginTimelineSection />
            </div>
            <Footer />
        </>
    );
}
