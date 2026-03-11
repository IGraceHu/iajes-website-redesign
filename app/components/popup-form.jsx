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

export function PopupForm({id, show, setShow, validate, children}) {
    // const [state, formAction] = useActionState(saveForm, {});

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

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        validate(formData)
    }

    function closePopup() {
        setShow(false);
        show = false;
    }

    return (
        <div id={popupId} className="fixed top-0 left-0 size-full flex items-center justify-center duration-200 z-999 invisible opacity-0">
            <div className="z-1">
                <form onSubmit={handleSubmit} className="mt-10 min-w-lg min-h-50 p-4 bg-white rounded-md shadow-md duration-200 flex flex-col justify-between">
                    <div>
                        {children}
                    </div>
                    <div className="bottom-0 mt-4 flex justify-center shrink-0 grow-0">
                        <input id="popup-form-submit" type="submit" className="button button-light mx-2" value="Save" />
                        <button key="popup-close-default" className="button mx-2" onClick={closePopup}>Cancel</button>
                    </div>
                </form>
            </div>

            <div className="absolute size-full bg-black opacity-40 z-0"></div>
        </div>
    )
}
