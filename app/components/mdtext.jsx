import { useState, useRef } from 'react';
import { mdParseCustom } from '../helpers/markdown';

export function MDText({name = null, defaultValue = null, preview = false}) {
    const contentRef = useRef(null);
    const [currentView, setcurrentView] = useState(0);

    const [markdownResult, setMarkdownResult] = useState("");
    
    function parseMarkdown(e) {
        setcurrentView(e.target.value)

        const markdownContent = contentRef.current.value;
        setMarkdownResult(mdParseCustom(markdownContent));
    }

    return (
        <div>
            <div className="flex">
                { preview && 
                    <div className="mt-1">
                        <label htmlFor="view-raw" className="radio-button">
                            <input id="view-raw" type="radio" name="view" value="0" defaultChecked onChange={(e) => setcurrentView(e.target.value)} /><p>Raw</p>
                        </label>
                        <label htmlFor="view-parse" className="radio-button">
                            <input id="view-parse" type="radio" name="view" value="1" onChange={parseMarkdown}/><p>Parsed</p>
                        </label>
                    </div>
                }
                <div className="mt-1 ml-auto">
                    <button className="button button-light">Help</button>
                </div>
            </div>

            <textarea ref={contentRef} name={name} defaultValue={defaultValue}
                className={"input input-text markdown w-full h-100 " + (currentView != 0 && "hidden")} ></textarea> 
            
            { preview && 
            <div className={"my-1 py-4 border-y-2 border-primary-dark "+ (currentView != 1 && "hidden")}
                dangerouslySetInnerHTML={{__html: markdownResult}}></div>
            }
            
            

            
        </div>
    );
}