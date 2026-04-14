import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase";
import { Menu } from "../components/menu";
import { Banner } from "../components/graphics"
import { Footer } from "../components/footer";
import { Popup } from "../components/popup";
import "../styles/video-resources.css";

export function meta() {
  return [
    { title: "Video Resource" },
    // { name: "description", content: "Welcome to React Router!" },
  ];
}

async function getVideoResource(resourceId) {
    const { data, error } = await supabase
        .from('video resources')
        .select()
        .eq('id', resourceId)
    return data[0] || error;
}

async function deleteVideoResource(resourceId) {
    const response = await supabase
        .from('video resources')
        .delete()
        .eq('id', resourceId)
    return response;
}

export async function loader({ params }) {
  const vid = await getVideoResource(params.vidId);
  // Ensure expected arrays/fields exist to avoid runtime errors when mapping
  vid.title = vid.title || "";
  vid.date = new Date(vid.date) || "";
  vid.speaker = vid.speaker || "";
  vid.speaker_university = vid.speaker_university || "";
  vid.speaker_details = vid.speaker_details || "";
  vid.speaker_image = (vid.speaker_image == "{}") ? null : vid.speaker_image;
  vid.video_url = vid.video_url || null;
  vid.video_thumbnail = (vid.video_thumbnail == "{}") ? null : vid.video_thumbnail;
  vid.video_description = vid.video_description || "";
  return vid;
}

export default function VideoResource({ loaderData }) {
    const navigate = useNavigate();
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const getIsAdmin = async (userId) => {
            try {
                const { data, error } = await supabase
                .from('users')
                .select('role')
                .eq("id", userId);
                if (data[0]) {
                    setIsAdmin(data[0].role == "admin");
                }
                else { console.log("error"); }
                
            } catch (error) {
                console.log("error");
            }
        }

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user.id) {
            getIsAdmin(session?.user.id);
            }
        });
    
        // Check current session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user.id) {
            getIsAdmin(session?.user.id);
            }
        });

    
        return () => subscription.unsubscribe();
    }, []);

    function handleDelete() {
        try {
            deleteVideoResource(loaderData.id);
            navigate({pathname: "/video-resources"});
        }
        catch (error) {
            console.log("Error");
        }
    }

    return (
        <>
            <Popup id="delete-vidr" show={showDeletePopup} setShow={setShowDeletePopup} 
                buttons={[{text:"Delete", onclick:handleDelete}]}>
                <div className="text-center mt-6">Delete this video resource?</div>
            </Popup>
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
                { isAdmin ? <div className="text-right mb-4"><button className="button button-light button-red" onClick={() => setShowDeletePopup(true)}>Delete Video Resource</button></div> : <></>}
                <div className="mb-5 w-full lg:h-[40vw] h-[50vw]">
                        <iframe src={loaderData.video_url} width="100%" height="100%"></iframe>
                </div>
                <p>{loaderData.video_description}</p>

                <div className="relative mt-5 rounded-md border-2 border-gray-light p-5 flex flex-col md:flex-row place-items-center">
                    { loaderData.speaker_image && <img className="mx-auto w-50 shrink-0 grow-0" src={loaderData.speaker_image} alt="" /> }
                    <div className="w-full md:w-70 shrink-0 grow-0 m-3">
                        <p className="font-semibold mr-2"><i>{loaderData.speaker}</i></p>
                        <p className="text-disabled-light">{loaderData.speaker_university}</p>
                    </div>
                    <p>{loaderData.speaker_details}</p>
                </div>
                
            </div>
            
            <Footer />
        </>
    )
}