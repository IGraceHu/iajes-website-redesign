import { useState } from "react";
import { useParams, useLocation } from "react-router";
import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { Popup } from "../components/popup";
import { Break } from "../components/graphics";
import "../styles/regional-meetings.css";
import "../styles/video-resources.css";

export function meta() {
    return [{ title: "Meeting Detail" }];
}

export default function RegionalMeetingDetail() {
    const { regionName, meetingDate } = useParams();
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const passedTitle = query.get("title");
    const [showPopup, setShowPopup] = useState(false);

    // placeholder meeting information
    const meetingTitle = passedTitle || `Meeting ${meetingDate}`;
    const description = "This is a placeholder meeting description that will appear under the title. It can span the full width of the page and provide details about the meeting.";

    // placeholder carousels and videos state
    const [carousels, setCarousels] = useState([[]]);
    const [videos, setVideos] = useState([]);

    function addCarouselSlide(carIdx, file) {
        if (!file) return;
        const url = URL.createObjectURL(file);
        setCarousels((c) => {
            const copy = [...c];
            copy[carIdx] = [...copy[carIdx], { id: `c${Math.random().toString(36).slice(2)}`, url }];
            return copy;
        });
    }

    function removeCarouselSlide(carIdx, slideId) {
        setCarousels((c) => {
            const copy = [...c];
            copy[carIdx] = copy[carIdx].filter((s) => s.id !== slideId);
            return copy;
        });
    }

    function addVideo(file) {
        if (!file) return;
        const url = URL.createObjectURL(file);
        setVideos((v) => [...v, { id: `v${Math.random().toString(36).slice(2)}`, url }]);
    }

    function removeVideo(id) {
        setVideos((v) => v.filter((x) => x.id !== id));
    }

    const popupDetails = {
        content: (
            <div className="relative md:w-[70vw] h-[80vh] bg-white p-4 overflow-y-auto">
                <h4 className="sticky top-0 left-0 bg-white">Add or Remove Media</h4>
                <div className="space-y-6 mt-4">
                    {carousels.map((car, idx) => (
                        <div key={idx} className="space-y-2 relative">
                            <p className="font-semibold">Carousel {idx + 1}</p>
                            <button
                                className="absolute top-0 right-0 text-red-600"
                                onClick={() => setCarousels((c) => c.filter((_, i) => i !== idx))}
                            >
                                <i className="bi bi-trash"></i>
                            </button>
                            <div className="flex gap-2 flex-wrap">
                                {car.map((slide) => (
                                    <div key={slide.id} className="relative border-2 border-gray-light rounded p-2">
                                        <img src={slide.url} className="w-48 h-32 object-cover" />
                                        <button
                                            className="absolute bottom-1 right-1 text-red-600"
                                            onClick={() => removeCarouselSlide(idx, slide.id)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                ))}
                                <div>
                                    <input
                                        type="file"
                                        onChange={(e) => addCarouselSlide(idx, e.target.files[0])}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button
                        className="button button-light"
                        onClick={() => setCarousels((c) => [...c, []])}
                    >
                        Add Carousel
                    </button>

                    <div className="space-y-2">
                        <p className="font-semibold">Videos</p>
                        <div className="flex gap-2 flex-wrap">
                            {videos.map((vid) => (
                                <div key={vid.id} className="relative border-2 border-gray-light rounded p-2">
                                    <video src={vid.url} className="w-48 h-32" controls />
                                    <button
                                        className="absolute bottom-1 right-1 text-red-600"
                                        onClick={() => removeVideo(vid.id)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            ))}
                            <div>
                                <input
                                    type="file"
                                    onChange={(e) => addVideo(e.target.files[0])}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ),
        buttons: [
            { text: "Cancel", onclick: () => setShowPopup(false) },
            { text: "Save", onclick: () => setShowPopup(false) },
        ],
        defaultButton: { text: "", onclick: () => { } },
        closeOnBlur: false,
    };

    return (
        <>
            <Popup id="media" show={showPopup} setShow={setShowPopup} details={popupDetails} />
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
                    <div className="-ml-4 flex w-fit duration-200 hover:-ml-5 hover:text-primary-light mt-2">
                        <i className="bi bi-caret-left-fill"></i>
                        <a href={`/regional-meetings/${regionName}`} className="link-back border-b-2 border-transparent hover:border-primary-light ml-1 hover:ml-2">
                            <strong>{regionName}</strong>
                        </a>
                    </div>
                    <h1 style={{ color: "white", textTransform: "none !important" }}>{meetingTitle}</h1>
                </div>
            </div>

            <div className="py-20 px-10 lg:px-40">
                <p>{description}</p>
                <Break />
                <div className="mt-10 flex gap-4">
                    <div className="w-full md:w-1/2">
                        <h2 className="text-center">Meeting Report</h2>
                        <div className="pdf-placeholder h-128 bg-gray-light"></div>
                    </div>
                    <div className="w-full md:w-1/2">
                        <h2 className="text-center">Meeting Agenda</h2>
                        <div className="pdf-placeholder h-128 bg-gray-light"></div>
                    </div>
                </div>

                <div className="mt-10 flex justify-between items-center">
                    <h1>Gallery</h1>
                    <div>
                        <button className="button button-light mr-2" onClick={() => setShowPopup(true)}>
                            Upload Media <i className="bi bi-plus ml-1"></i>
                        </button>
                    </div>
                </div>

                <div className="mt-6 flex gap-4">
                    {/* placeholder carousel flexbox */}
                    <div className="w-full md:w-1/2 h-64 bg-gray-light"></div>
                    <div className="w-full md:w-1/2 h-64 bg-gray-light"></div>
                </div>

                <div className="mt-6 flex gap-4">
                    {/* placeholder video flexbox */}
                    <div className="w-full md:w-1/2 h-64 bg-gray-light"></div>
                    <div className="w-full md:w-1/2 h-64 bg-gray-light"></div>
                </div>
            </div>
            <Footer />
        </>
    );
}