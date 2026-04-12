import { useState } from 'react';
import { redirect } from "react-router";
import { Menu } from "../components/menu";
import { Footer } from "../components/footer";
import { Popup } from "../components/popup";
import { Pagination } from "../components/pagination";
import { Break, H1Middle, H1Left, H2Middle, H2Left, Banner } from "../components/graphics";

export function meta() {
    return [
        { title: "Style Guide" },
        { name: "", content: "" },
    ];
}

export function action({ url }) {
    return redirect(`${url}`);
}

export default function StyleGuide() {

    // POPUP -------------------------------------------------------------------
    // The Popup component takes three parameters:
    // id - Unique ID for the popup. Ensures that popups from different components do not overlap
    //      There should only be one Popup component used in a component. 
    // show - Determines if the popup is visible or not
    // setShow - set function for show
    // details - an object with properties
    //    content - Required. An element node with the contents of the popup
    //    buttons - Optional. An array of objects with properties 'text' and 'onclick'
    //        text - Required. A string with the button text
    //        onclick - Required. A function that clicking the button will execute
    //    defaultButton - Optional. Changes the default values of the 'Close' button. An object with properties 'text' and 'onclick'
    //        text - Required.
    //        onclick - Optional.
    //    closeOnBlur - Optional. Defaults to true. Determines if clicking outside the popup will close the popup or not

    const [showPopup, setShowPopup] = useState(false);
    const [currentPopup, setCurrentPopup] = useState({}); // This is only needed if you have multiple popups in a component

    const popupDetails1 = {
        content: <p>This is a basic popup.</p>,
    };

    const popupDetails2 = {
        content: <p>This is a popup with extra buttons. Clicking outside the popup will not close the popup.</p>,
        buttons: [{ text: "Save", onclick: () => { console.log("saved") } }, { text: "Delete", onclick: () => { console.log("deleted") } }],
        closeOnBlur: false,
    };

    const popupDetails3 = {
        content: <p>This is a popup with a custom default button.</p>,
        buttons: [{ text: "Save", onclick: () => { console.log("saved") } }],
        defaultButton: { text: "Exit", onclick: () => { setShowPopup(false); } }
    };

    // PAGINATION --------------------------------------------------------------
    const [pg1, setPg1] = useState(0);
    const [pg2, setPg2] = useState(0);

    const [formMode, setFormMode] = useState("");

    return (
        <>
            <Popup id="style" show={showPopup} setShow={setShowPopup} details={currentPopup} />

            <Menu />
            <div className="lg:px-40 px-10 py-20 duration-200">
                <h1>Style Guide</h1>
                <p>Note that we are using TailwindCSS, so unless needed, sizing and layout will be done with TailwindCSS variables and presets.</p>
                <div className="mt-10">
                    <h2>Fonts</h2>
                    <h1>Heading 1</h1>
                    <h2>Heading 2</h2>
                    <h3>Heading 3</h3>
                    <h4>Heading 4</h4>
                    <h5>Heading 5</h5>
                    <h6>Heading 6</h6>
                    <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc in nisi venenatis, faucibus lorem eu, lobortis magna. Donec at ante vel arcu mattis sagittis. Curabitur efficitur ex aliquam sapien dictum fringilla. Vestibulum sagittis sit amet quam in congue. Cras consequat, nibh auctor dapibus ultrices, arcu ex lobortis mi, eu pharetra sem metus eget mi. Sed eget bibendum ipsum. Vivamus bibendum nulla hendrerit ligula facilisis, non euismod mi cursus. Proin nec risus vel elit ullamcorper venenatis. Donec lacinia mi eu nunc vehicula, quis ullamcorper ipsum suscipit. </p>
                    <p>Example for <a href="">inline links</a></p>
                    <ul>
                        <li>Unordered list item 1</li>
                        <li>Unordered list item 2</li>
                        <li>Unordered list item 3</li>
                    </ul>
                    <ol>
                        <li>Ordered list item 1</li>
                        <li>Ordered list item 2</li>
                        <li>Ordered list item 3</li>
                    </ol>
                </div>

                <div className="mt-10">
                    <h2>Colors</h2>
                    <p>Custom colors have been defined in the theme, so they can be used like TailwindCSS colors. For example, having a primary light background can be done using the class <span className="text-primary-dark">bg-primary-light</span>.</p>
                    <div className="grid lg:grid-cols-4 grid-cols-2 gap-5 my-4">
                        <div className="px-5 py-7 rounded-md text-center bg-primary-light">
                            <p>
                                #74C9B5
                                <br />
                                color-primary-light
                            </p>
                        </div>
                        <div className="px-5 py-7 rounded-md text-center bg-primary-dark text-white">
                            <p>
                                #1EA493
                                <br />
                                color-primary-dark
                            </p>
                        </div>
                        <div className="px-5 py-7 rounded-md text-center bg-secondary-light text-white">
                            <p>
                                #136E8D
                                <br />
                                color-secondary-light
                            </p>
                        </div>
                        <div className="px-5 py-7 rounded-md text-center bg-secondary-dark text-white">
                            <p>
                                #063751
                                <br />
                                color-secondary-dark
                            </p>
                        </div>
                        <div className="px-5 py-7 rounded-md text-center bg-white border-2 border-gray-light">
                            <p>
                                #FFFFFF
                                <br />
                                White
                                <br />
                                color-white
                            </p>
                        </div>
                        <div className="px-5 py-7 rounded-md text-center bg-gray-light">
                            <p>
                                #D1D5DC
                                <br />
                                Light Gray (Gray 300)
                                <br />
                                color-gray-light
                            </p>
                        </div>
                        <div className="px-5 py-7 rounded-md text-center bg-gray-dark text-white">
                            <p>
                                #27272A
                                <br />
                                Dark Gray (Zinc 800)
                                <br />
                                color-gray-dark
                            </p>
                        </div>
                        <div className="px-5 py-7 rounded-md text-center bg-black text-white">
                            <p>
                                #000000
                                <br />
                                Black
                                <br />
                                color-black
                            </p>
                        </div>
                        <div className="px-5 py-7 rounded-md text-center bg-primary-extralight">
                            <p>
                                #ECFDF5
                                <br />
                                Primary Extra Light
                                <br />
                                color-primary-extralight
                                <br />
                                <span className="text-xs">(Applied automatically to checkbox and radio buttons on hover)</span>
                            </p>
                        </div>
                        <div className="px-5 py-7 rounded-md text-center bg-disabled-light text-white">
                            <p>
                                #8B9D9B
                                <br />
                                Disabled Light
                                <br />
                                color-disabled-light
                                <br />
                                <span className="text-xs">(Applied automatically to disabled buttons)</span>
                            </p>
                        </div>
                        <div className="px-5 py-7 rounded-md text-center bg-disabled-dark text-white">
                            <p>
                                #404547
                                <br />
                                Disabled Dark
                                <br />
                                color-disabled-dark
                                <br />
                                <span className="text-xs">(Meant for disabled buttons in a future dark mode)</span>
                            </p>
                        </div>
                        <div className="px-5 py-7 rounded-md text-center bg-selection-highlight text-white">
                            <p>
                                #4388A1
                                <br />
                                Selection Highlight
                                <br />
                                color-selection-highlight
                                <br />
                                <span className="text-xs">(Applied automatically to text selection)</span>
                            </p>
                        </div>
                        <div className="px-5 py-7 rounded-md text-center bg-error text-white">
                            <p>
                                #c2162d
                                <br />
                                Error
                                <br />
                                color-error
                                <br />
                            </p>
                        </div>
                        <div className="px-5 py-7 rounded-md text-center bg-error-dark text-white">
                            <p>
                                #a01225
                                <br />
                                Error Dark
                                <br />
                                color-error-dark
                                <br />
                                <span className="text-xs">(Applied to delete buttons on hover)</span>
                            </p>
                        </div>
                        <div className="px-5 py-7 rounded-md text-center bg-error-extradark text-white">
                            <p>
                                #7a0e1d
                                <br />
                                Error Extra Dark
                                <br />
                                color-error-extradark
                                <br />
                                <span className="text-xs">(Applied to delete buttons on click)</span>
                            </p>
                        </div>

                    </div>
                </div>

                <div className="mt-10">
                    <h2>Buttons</h2>
                    <div>
                        <button className="button mr-5 mb-5">.button</button>
                        <button className="button button-light mr-5 mb-5">.button .button-light</button>
                        <br />
                        <button className="button button-delete mr-5 mb-5">.button .button-delete</button>
                        <button className="button button-light button-delete mr-5 mb-5">.button .button-light .button-delete</button>
                        <br />
                        <button className="button button-disabled mr-5 mb-5">.button .button-disabled</button>
                        <button className="button button-light button-disabled mr-5 mb-5">.button .button-light .button-disabled</button>
                        <br />
                        <button className="button mr-5 mb-5" disabled>.button disabled</button>
                        <button className="button button-light mr-5 mb-5" disabled>.button .button-light disabled</button>
                    </div>
                    <p>Using either <span className="text-primary-dark">.button-disabled</span> or the <span className="text-primary-dark">disabled</span> attribute will have the same result.</p>
                </div>

                <div className="mt-10">
                    <h2>Spacing</h2>
                    <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
                        <div>
                            <h3>Margin & Gap</h3>
                            <p>Margin between buttons: <span className="text-primary-dark">.m-5</span></p>
                            <p>Grid gap: <span className="text-primary-dark">.gap-5</span> or <span className="text-primary-dark">.gap-10</span></p>
                        </div>
                        <div>
                            <h3>Padding</h3>
                            <p>Page Content: <span className="text-primary-dark">lg:px-40 px-10 .py-20 .duration-200</span></p>
                            <p>Cards and Buttons: <span className="text-primary-dark">.p-4</span></p>
                        </div>
                        <div>
                            <h3>Border</h3>
                            <p>Border Radius: <span className="text-primary-dark">.rounded-md</span></p>
                            <p>Border Width: <span className="text-primary-dark">.border-2</span> (2px)</p>
                        </div>
                    </div>
                </div>

                <div className="mt-10">
                    <h2>Forms</h2>
                    <p>Checkboxes and radios require more structural attention compared to textboxes, so please refer to the source code to implement them properly.</p>
                    <div className="flex space-x-5">
                        <button className={"button " + (formMode == "" && "button-light")} onClick={() => setFormMode("")}>Default</button>
                        <button className={"button " + (formMode == "input-disabled" && "button-light")} onClick={() => setFormMode("input-disabled")}>Disabled</button>
                        <button className={"button " + (formMode == "input-required" && "button-light")} onClick={() => setFormMode("input-required")}>Required</button>
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-10 gap-y-15 my-5">
                        <div className="w-full">
                            <label htmlFor="form-text">Text Input:</label><br />
                            <input id="form-text" type="text" className={"input input-text w-full " + formMode} placeholder="Enter text here..." />
                            <div className="input-error">This field is required.</div>
                            <br /><br />
                            <label htmlFor="form-textarea">Textarea Input:</label><br />
                            <textarea id="form-textarea" className={"input input-text w-full " + formMode} placeholder="Enter text here..." />
                            <div className="input-error">Error messages must come after the input.</div>
                            <br /><br />
                            <label htmlFor="form-select">Select:</label><br />
                            <select id="form-select" className={"input input-text w-full " + formMode}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                            </select>
                            <div className="input-error">They are set to position: absolute to avoid changing page layout.</div>
                        </div>

                        <div>
                            <p>Checkbox</p>
                            <label htmlFor="checkbox1" className="checkbox">
                                <input id="checkbox1" type="checkbox" className={formMode} /><p>Checkbox 1</p>
                                <div className="input-error">This field is required.</div>
                            </label>
                            <label htmlFor="checkbox2" className="checkbox">
                                <input id="checkbox2" type="checkbox" className={formMode} /><p>Checkbox 2</p>
                            </label>
                            <label htmlFor="checkbox3" className="checkbox">
                                <input id="checkbox3" type="checkbox" className={formMode} /><p>Checkbox 3</p>
                            </label>
                            <br /><br />

                            <p>Radio</p>
                            <label htmlFor="radio1" className="radio">
                                <input id="radio1" type="radio" name="radio" className={formMode} /><p>Radio 1</p>
                                <div className="input-error">This field is required.</div>
                            </label>
                            <label htmlFor="radio2" className="radio">
                                <input id="radio2" type="radio" name="radio" className={formMode} /><p>Radio 2</p>
                            </label>
                            <label htmlFor="radio3" className="radio">
                                <input id="radio3" type="radio" name="radio" className={formMode} /><p>Radio 3</p>
                            </label>
                            <br /><br />

                            <p>File</p>
                            <label>
                                <input id="upload" type="file" className={formMode} />
                                <div className="input-error">This field is required.</div>
                            </label>
                        </div>

                    </div>
                    <br />
                    <p>Disabled inputs use the <span className="text-primary-dark">disabled</span> attribute or <span className="text-primary-dark">.input-disabled</span>. Inputs still need the <span className="text-primary-dark">disabled</span> attribute to be functionally disabled.</p>
                    <p>Required inputs use <span className="text-primary-dark">.input-required</span>, though the class should only be added if the error is active.</p>
                </div>

                <div className="mt-10">
                    <h2>Pagination</h2>
                    <Pagination currentPage={pg1} setCurrentPage={setPg1} totalItems={10} itemsPerPage={1} pageRange={5} />
                    <Pagination currentPage={pg2} setCurrentPage={setPg2} totalItems={20} itemsPerPage={1} pageRange={9} />
                </div>

                <div className="mt-10">
                    <h2>Popup</h2>
                    <p>Please refer to the Popup component for popup usage</p>
                    <br />
                    <button className="button mr-5 mb-5" onClick={() => { setCurrentPopup(popupDetails1); setShowPopup(true) }}>Popup Example 1</button>
                    <button className="button mr-5 mb-5" onClick={() => { setCurrentPopup(popupDetails2); setShowPopup(true) }}>Popup Example 2</button>
                    <button className="button mr-5 mb-5" onClick={() => { setCurrentPopup(popupDetails3); setShowPopup(true) }}>Popup Example 3</button>
                </div>

                <div className="mt-10">
                    <h2>Icons</h2>
                    <p>Icons from <a href="https://icons.getbootstrap.com/">Bootstrap Icons</a>. Use icon font mode for including them in HTML.</p>
                </div>

                <div className="mt-10">
                    <h2>Breaks</h2>
                    <p>Breaks and Heading Breaks are in the graphics.jsx component. Left headings can stretch across the screen or stretch 60% of the way.</p>
                    <Break />
                    <H1Middle>Heading 1 Middle</H1Middle>
                    <H1Left>Heading 1 Left</H1Left>
                    <H1Left stretch>Heading 1 Left</H1Left>
                    <H2Middle>Heading 2 Middle</H2Middle>
                    <H2Left>Heading 2 Left</H2Left>
                    <H2Left stretch>Heading 2 Left</H2Left>
                </div>

            </div>
            <div className="my-10">
                <div className="lg:px-40 px-10 duration-200">
                    <h2>Banners</h2>
                    <p>Banner content is customizable. Default banner type is 'green', 'blue' and 'dark' need to be specificed using the 'type' prop.</p>
                </div>
                <br />
                <Banner>
                    <h1>Banner</h1>
                </Banner>
                <br />
                <Banner type="blue">
                    <h1>Banner</h1>
                    <p>But blue this time.</p>
                </Banner>
                <br />
                <Banner type="dark">
                    <h1>Banner</h1>
                    <p>But dark this time.</p>
                </Banner>
            </div>
            <Footer />
        </>
    );
}