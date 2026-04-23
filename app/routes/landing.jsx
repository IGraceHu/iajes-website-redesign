import { useState, useEffect, useActionState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router";
import { Menu } from "../components/menu";
import { Popup, PopupForm } from "../components/popup";
import { Footer } from "../components/footer";
import { H1Middle, H1Left } from "../components/graphics";
import { updateRequired } from "../helpers/form";
import "../styles/landing.css";

export function meta() {
  return [
    { title: "IAJES Homepage" },
  ];
}

async function getHighlights() {
    const { data, error } = await supabase
      .from('highlights')
      .select();
    if (data) {
      data.sort((a, b) => { return a.id - b.id });
    }
    
    return data || error;
}

async function updateHighlight(highlightId, formData) {
  const { error } = await supabase
    .from('highlights')
    .update({
      title: formData.get("title"),
      details: formData.get("details"),
      url: formData.get("url"),
    })
    .eq('id', highlightId);
    return error;
}


export async function loader({ params }) {
  const highlightsList = await getHighlights();
  return highlightsList;
}

function Carousel() {
  const carouselContent = [
    {
      text: "Lorum ipsum 1"
    },
    {
      text: "Lorum ipsum 2"
    },
    {
      text: "Lorum ipsum 3"
    },
    {
      text: "Lorum ipsum 4"
    }
  ];
  const carouselEl = [];
  let i = 0;
  carouselContent.map((content) => {
    carouselEl.push(
      <div key={i} className="carousel-item absolute w-screen h-full bg-zinc-900 overflow-hidden">

        {content.imageURL != null && <img src={content.imageURL} className="absolute z-0 size-full object-cover" />}

        <div className="relative z-1 size-full box-border m-40">
          <p>{content.text}</p>
        </div>
      </div>
    )
    i++;
  })

  const carouselCount = carouselEl.length - 1;
  const [carouselCurrent, setCarouselCurrent] = useState(0);
  const [carouselStart, setCarouselStart] = useState(0);

  function carouselNext() {
    setCarouselStart(carouselCurrent);
    setCarouselCurrent((carouselCurrent < carouselCount) ? carouselCurrent + 1 : 0);
  }

  function carouselPrev() {
    setCarouselStart(carouselCurrent);
    setCarouselCurrent((carouselCurrent > 0) ? carouselCurrent - 1 : carouselCount);
  }

  useEffect(() => {
    const carouselChildrenEl = document.getElementById("carousel-container").children;
    carouselChildrenEl[carouselStart].classList.remove("active");
    carouselChildrenEl[carouselCurrent].classList.add("active");
  }, [carouselCurrent])


  return (
    <div className="relative h-120 flex justify-between text-white z-2">
      <button className="carousel-btn absolute h-full left-0 w-30 z-10 flex justify-center text-zinc-400 hover:text-zinc-50 hover:cursor-pointer" onClick={carouselPrev}>
        <svg height="70" width="35" className="carousel-arrow-prev fill-none stroke-current stroke-5">
          <polyline points="35,0 5,35 35,70" />
        </svg>
      </button>
      <button className="carousel-btn absolute h-full right-0 w-30 z-10 flex justify-center text-zinc-400 hover:text-zinc-50 hover:cursor-pointer" onClick={carouselNext}>
        <svg height="70" width="35" className="carousel-arrow-next fill-none stroke-current stroke-5">
          <polyline points="0,0 30,35 0,70" />
        </svg>
      </button>

      <div className="relative z-0 bg-zinc-900 size-full top-0 overflow-x-hidden">
        <div id="carousel-container" className="relative size-full">
          {carouselEl}
        </div>
      </div>

    </div>
  );
}

function AboutUs() {
  const cardsInfo = [
    {
      title: "card 1",
      url: "tes",
      imageURL: null
    },
    {
      title: "card 2"
    },
    {
      title: "card 3"
    },
    {
      title: "card 4"
    },
    {
      title: "card 5"
    },
    {
      title: "card 6"
    }
  ];

  const cardsEl = [];
  cardsInfo.map((content) => {
    const url = content.url || "";
    cardsEl.push(
      <div key={content.title} className="relative">
        <a href={url} className="about-card z-5 relative block bg-gray-dark hover:cursor-pointer hover:bg-primary-dark overflow-hidden">
          <div className="relative z-1 size-full flex items-center justify-center">
            <p className="text-white">{content.title}</p>
          </div>

          {content.imageURL != null && <img src={content.imageURL} className="absolute z-0 top-0 size-full object-cover" />}

        </a>
        <div className="about-card-border z-4 absolute top-0"></div>
      </div>
    )

  })

  return (
    <div id="about" className="flex pb-30">
      <div className="mr-10 mb-10">
        <H1Left stretch>About Us</H1Left>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris id bibendum tortor, vel volutpat risus. Praesent eu felis dapibus, sodales purus vel, pharetra dolor. Quisque venenatis ut nulla quis aliquet. Praesent at urna pharetra, volutpat justo quis, malesuada felis. Quisque in sapien felis. Aliquam egestas nulla nec eros elementum, vel auctor turpis scelerisque. Proin lacinia et enim eu tempor. Pellentesque et aliquam felis. Nam tempus varius enim, ac facilisis magna iaculis et.</p>
      </div>
      <div className="text-white flex justify-center">
        <div id="about-cards-grid">
          {cardsEl}
        </div>
      </div>
    </div>
  );
}

const highlights = [
  {
    id: 0,
    title: "highlight 0",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc in nisi venenatis, faucibus lorem eu, lobortis magna. Donec at ante vel arcu mattis sagittis."
  },
  {
    id: 1,
    title: "highlight 1",
    description: "Curabitur efficitur ex aliquam sapien dictum fringilla."
  },
  {
    id: 2,
    title: "highlight 2",
    description: "Vestibulum sagittis sit amet quam in congue.",
  },
  {
    id: 3,
    title: "highlight 3",
    description: "Cras consequat, nibh auctor dapibus ultrices, arcu ex lobortis mi, eu pharetra sem metus eget mi."
  },
  {
    id: 4,
    title: "highlight 4",
    description: "Sed eget bibendum ipsum."
  }
];


function EditHighlights({showPopup, setShowPopup, highlightList}) {
  const navigate = useNavigate();
  const [currentHighlights, setCurrentHighlights] = useState(highlightList);
  const [showHighlightPopup, setShowHighlightPopup] = useState(false);
  const [focusHighlight, setFocusHighlight] = useState({});
  const [formRequired, setFormRequired] = useState({ title: false, details: false, url: false });
  const [hasError, setHasError] = useState(false);

  function handleClosePopup() {
    setShowPopup(false);
    navigate(0);
  }

  function handleShowHighlightPopup(highlight) {
    setShowHighlightPopup(true);
    setFormRequired({ title: false, details: false, url: false });
    setFocusHighlight(highlight);
  }

  async function validate(formData) {
    let isValidated = true;
    const urlInput = formData.get("url");
    const isRequired = {
      title: formData.get('title') === (null || ""),
      details: formData.get('details') === (null || ""),
      url: (urlInput && !urlInput.match(/https:\/\//))
    }
    for (let value of Object.values(isRequired)) {
      if (value) {
        isValidated = false;
        break;
      }
    }
    if (!isValidated) {
      setFormRequired(isRequired);
      return false;
    }
    
    const updatedHighlight = await updateHighlight(focusHighlight.id, formData);
    if (updatedHighlight === null) {
      setHasError(false);
      const newHighlights = await getHighlights();
      setCurrentHighlights(newHighlights);
      setShowHighlightPopup(false);
    } else {
      setHasError(true);
      console.log(updatedHighlight);
    }
  }

  function checkEmpty(value, inputName) {
      const updatedFormRequired = updateRequired(value, inputName, formRequired);
      if (updatedFormRequired != formRequired) {
        setFormRequired(updatedFormRequired);
      }
  }

  function urlChange() {
    const updatedFormRequired = structuredClone(formRequired);
    updatedFormRequired.url = false;
    if (updatedFormRequired != formRequired) {
      setFormRequired(updatedFormRequired);
    }
  }
  
  return (
    <>
      <Popup id="edit-highlights" show={showPopup} setShow={setShowPopup} closePopup={handleClosePopup}>
        <h4>Edit Highlights</h4>
          <div className="grid grid-cols-1 gap-y-5 max-h-100 overflow-y-auto">
            {currentHighlights.map(highlight => 
              <div key={highlight.title} className="flex items-center hover:bg-teal-50 duration-200 px-5 rounded-sm">
                <button className="button-icon py-2 flex justify-between w-full h-[100%] items-center block" onClick={() => handleShowHighlightPopup(highlight)}>
                  <p className="pr-5 mr-auto" style={{ color: "black" }}>{highlight.title}</p>
                  <i className="bi bi-pencil-square"></i>
                </button>
              </div>
            )}
          </div>
      </Popup>

      <PopupForm id="edit-highlight" className="md:w-200" show={showHighlightPopup} setShow={setShowHighlightPopup} validate={validate} hasError={hasError} nested>
        <h4>Edit Highlight</h4>
        <div className="flex gap-5 w-full md:flex-row flex-col mb-5">
          <div>
            <label htmlFor="edit-highlight-title">Highlight title:</label><br />
            <input id="edit-highlight-title" name="title" type="text" 
                   className={"input input-text md:w-80 w-full " + (formRequired?.title && "input-required")}
                   placeholder="Title" onChange={(e) => checkEmpty(e.target.value, "title")}
                   defaultValue={focusHighlight.title} />
            <div className="input-error">This field is required.</div>
          </div>
          <label>
            Image:<br />
            <input id="edit-highlight-img" name="image-url" type="file" />
            <div className="input-error">This field is required.</div>
          </label>
        </div>
        <div>
          <label htmlFor="edit-highlight-url">Highlight URL:</label><br />
          <input id="edit-highlight-url" name="url" type="text" 
                  className={"input input-text w-full " + (formRequired?.url && "input-required")}
                  placeholder="https://..." onChange={urlChange}
                  defaultValue={focusHighlight.url} />
          <div className="input-error">Invalid link.</div>
        </div>
        <br/>
        <div className="">
          <label htmlFor="edit-highlight-desc">Highlight details:</label><br />
          <textarea id="edit-highlight-desc" name="details" 
                    className={"input input-text w-full h-60 " + (formRequired?.details && "input-required")}
                    placeholder="Highlight details..." onChange={(e) => checkEmpty(e.target.value, "details")}
                    defaultValue={focusHighlight.details} ></textarea>
          <div className="input-error">This field is required.</div>
        </div>
      </PopupForm>
    </>
  )
}


function HighlightContent({ content }) {
  return (
    <div className="size-full min-h-80 flex flex-col justify-stretch text-left">
      <div className="bg-gray-dark grow h-fit rounded-md mb-2">
        {content.image_url && <img src={content.image_url} className="size-full object-cover" />}
      </div>
      { content?.url ? 
        <a href={content?.url}><h2>{content.title}</h2></a>
        :
        <h2>{content.title}</h2>
      }
      <p>{content.details}</p>
    </div>
  )
}

function LandingSubscribe() {
  return (
    <div className="h-150 flex flex-col justify-center items-center text-center">
      <h4 className="text-glow">Subscribe to our Newsletter</h4>
      <form className="flex flex-col justify-center items-center">
        <input name="subscribe-email" type="email" className="box-glow input input-text md:w-md w-sm" placeholder="Enter email here..." />
        <input type="submit" className="box-glow button w-xs m-5" value="Subscribe" />
      </form>
    </div>
  );
}

export default function Landing({ loaderData }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [editHighlights, setEditHighlights] = useState(false);

  const hasHighlights = !loaderData?.code;
  const highlightList = hasHighlights ? loaderData : [];

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

  return (
    <>
      {isAdmin &&
        <EditHighlights showPopup={editHighlights} setShowPopup={setEditHighlights} highlightList={highlightList} />}
      <Menu />
      <Carousel />
      <div className="flex height-fit">
        <div id="content" className="items-center text-black lg:px-40 px-10 py-20 w-full h-fit duration-200 z-1">
          <AboutUs />
          
          { hasHighlights && 
            <div className="text-center relative">
              <H1Middle className="text-glow">Highlights</H1Middle>
              { isAdmin && <button className="button" onClick={() => setEditHighlights(true)}>Edit Highlights</button>}
              <div id="highlights" className="relative width-full py-5 grid md:grid-rows-6 gap-10" >
                <div className="md:row-start-1 md:row-end-4" ><HighlightContent content={highlightList[0]}/></div>
                <div className="md:row-start-4 md:row-end-7" ><HighlightContent content={highlightList[1]}/></div>
                <div className="md:row-span-2" ><HighlightContent content={highlightList[2]}/></div>
                <div className="md:row-span-2" ><HighlightContent content={highlightList[3]}/></div>
                <div className="md:row-span-2" ><HighlightContent content={highlightList[4]}/></div>
              </div>
            </div>
          }

          <LandingSubscribe />
          <div className="h-100">

          </div>
        </div>
        <div id="effects" className="w-full shrink-0 -ml-[100%] z-0">
          {/* Discs */}
          <div id="landing-discs" className="absolute w-full z-0 md:opacity-70 opacity-50 duration-200">
            <img id="landing-disc-1" src="assets/landing-disc-2a.svg" />
            <img id="landing-disc-2" src="assets/landing-disc-2b.svg" />
            <img id="landing-disc-3" src="assets/landing-disc-3.svg" />
            <img id="landing-disc-4" src="assets/landing-disc-4b.svg" />
            <img id="landing-disc-5" src="assets/landing-disc-4a.svg" />
          </div>

          {/* Background Lines */}
          <div className="size-full grid grid-cols-1 grid-rows-[auto_min-content] justify-center justify-items-center">
            <div className="flex space-x-4 justify-center">
              <div className="w-5 h-full bg-linear-to-b from-white to-primary-light"></div>
              <div className="w-5 h-full bg-linear-to-b from-white to-primary-light"></div>
              <div className="w-5 h-full bg-linear-to-b from-white to-primary-light"></div>
              <div className="w-5 h-full bg-linear-to-b from-white to-primary-light"></div>
            </div>
            <div className="md:w-[70%] w-full md:px-0 px-10 duration-200 h-125 grid grid-cols-[30%_20%_20%_30%] justify-items-stretch">
              <div className="relative">
                <div className="absolute right-0 top-5 w-full h-120 border-t-20 border-l-20 rounded-tl-[80px] border-primary-light"></div>
                <div className="absolute right-0 top-15 w-[50%] h-110 border-t-20 border-l-20 rounded-tl-[80px] border-primary-light"></div>
              </div>
              <div className="relative mr-2">
                <div className="absolute right-9 w-full h-10 border-b-20 border-r-20 rounded-br-[80px] border-primary-light"></div>
                <div className="absolute right-0 w-full h-20 border-b-20 border-r-20 rounded-br-[80px] border-primary-light"></div>
              </div>
              <div className="relative ml-2">
                <div className="absolute w-full h-20 border-b-20 border-l-20 rounded-bl-[80px] border-primary-light"></div>
                <div className="absolute left-9 w-full h-10 border-b-20 border-l-20 rounded-bl-[80px] border-primary-light"></div>
              </div>
              <div className="relative">
                <div className="absolute top-15 w-[50%] h-110 border-t-20 border-r-20 rounded-tr-[80px] border-primary-light"></div>
                <div className="absolute right-0 top-5 w-full h-120 border-t-20 border-r-20 rounded-tr-[80px] border-primary-light"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

    </>

  );
}
