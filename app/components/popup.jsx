import { useEffect } from 'react';

// POPUP -----------------------------------------------------------------------
    // PARAMETERS
    // id - Unique ID for the popup. Ensures that popups from different components do not overlap
    //      There should only be one Popup component used in a component. 
    //
    // show - Determines if the popup is visible or not
    //
    // setShow - set function for show
    //
    // details - an object with properties
    //    content - Required. An element node with the contents of the popup
    //    buttons - Optional. An array of objects with properties 'text' and 'onclick'
    //        text - Required. A string with the button text
    //        onclick - Required. A function that clicking the button will execute
    //    defaultButton - Optional. Changes the default values of the 'Close' button. An object with properties 'text' and 'onclick'
    //        text - Required.
    //        onclick - Optional.
    //    closeOnBlur - Optional. Defaults to true. Determines if clicking outside the popup will close the popup or not


export function Popup({id, show, setShow, details}) {

    const popupId = "popup-" + id;
    useEffect(() => {
        if (show) {
            const popupContEl = document.getElementById(popupId);
            const popupEl = popupContEl.children[0].children[0];
            popupContEl.classList.remove("invisible");
            popupContEl.classList.remove("opacity-0");
            popupEl.classList.remove("mt-10");

            document.body.style.overflow = "hidden";
            // document.body.style.setProperty('--position-top', -(document.documentElement.scrollTop) + "px");
            // document.body.classList.add('noscroll');
        } else {
            const popupContEl = document.getElementById(popupId);
            const popupEl = popupContEl.children[0].children[0];
            popupContEl.classList.add("opacity-0");
            popupContEl.classList.add("invisible");
            popupEl.classList.add("mt-10");

            document.body.style.overflow = "auto";
            // const posTopVal = document.body.style.getPropertyValue('--position-top');
            // const pos = Number(posTopVal.substring(1, posTopVal.length-2));
            // document.body.classList.remove('noscroll');
            // document.documentElement.scrollTop = pos;

            // console.log(document.documentElement.scrollTop);
        }
    }, [show])

    function closePopup() {
        setShow(false);
        show = false;
    }

    if (details.defaultButton == null) {
        details.defaultButton = {text: "Close", onclick: closePopup}
    } else if (details.defaultButton.onclick == null) {
        details.defaultButton.onclick = closePopup;
    }
    
    const buttonsEl = [];
    let i = 0;
    if (details.buttons) {
        details.buttons.map((button) => {
            let btnId = "popup-" + id + "-button-" + i;
            buttonsEl.push(<button key={btnId} id={btnId} className="button button-light mx-2" onClick={button.onclick}>{button.text}</button>);
            i++;
        })
    }
    buttonsEl.push(<button key="popup-close-default" className="button mx-2" onClick={details.defaultButton.onclick}>{details.defaultButton.text}</button>)

    if (details.closeOnBlur == null) {
        details.closeOnBlur = true;
    }

    return (
        <div id={popupId} className="fixed top-0 left-0 size-full flex items-center justify-center duration-200 z-999 invisible opacity-0">
            <div className="z-1">
                <div className="mt-10 min-w-lg min-h-50 p-4 bg-white rounded-md shadow-md duration-200 flex flex-col justify-between">
                    {details.content}
                    <div className="bottom-0 mt-4 flex justify-center shrink-0 grow-0">
                        {buttonsEl}
                    </div>
                </div>
            </div>

            <div className="absolute size-full bg-black opacity-40 z-0" onClick={() => {if(details.closeOnBlur) {closePopup}} } ></div>
        </div>
    )
}
