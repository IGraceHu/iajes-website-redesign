import { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';

export function MDText({ parentDefinedCurrentView = 0, setParentDefinedCurrentView = null, 
    name, defaultValue = null, placeholder = "", preview = false
}) {

    const contentRef = useRef(null);
    const [childDefinedCurrentView, setChildDefinedCurrentView] = useState(0);

    function setCurrentView(newVal) {
        if (setParentDefinedCurrentView) {
            setParentDefinedCurrentView(newVal);
        } else {
            setChildDefinedCurrentView(newVal);
        }
    }

    const currentView = () => {
        if (setParentDefinedCurrentView) {
            return parentDefinedCurrentView;
        } else {
            return childDefinedCurrentView;
        }
    }

    const [markdownResult, setMarkdownResult] = useState("");
    
    function parseMarkdown(e) {
        setCurrentView(e.target.value)

        const markdownContent = contentRef.current.value;
        setMarkdownResult(marked.parse(markdownContent));
    }

    function toggleHelp(e) {
        e.preventDefault();
        currentView() != 2 ? setCurrentView(2) : setCurrentView(0);
    }

    return (
        <div>
            <div className="flex">
                { preview && 
                    <div className="mt-1">
                        <label htmlFor={name + "-view-raw"} className="radio-button">
                            <input id={name + "-view-raw"} type="radio" name={name + "-toggle"} value="0" checked={currentView() == 0} onChange={(e) => setCurrentView(e.target.value)} /><p>Raw</p>
                        </label>
                        <label htmlFor={name + "-view-parse"} className="radio-button">
                            <input id={name + "-view-parse"} type="radio" name={name + "-toggle"} value="1" checked={currentView() == 1} onChange={parseMarkdown}/><p>Parsed</p>
                        </label>
                    </div>
                }
                <div className="mt-1 ml-auto">
                    <button className={"button " + (currentView() != 2 && "button-light")} onClick={toggleHelp}>Help<i className="bi bi-question-circle ml-1.5"></i></button>
                </div>
            </div>

            <textarea ref={contentRef} name={name} defaultValue={defaultValue} placeholder={placeholder}
                className={"input input-text markdown w-full h-100 " + (currentView() != 0 && "hidden")} ></textarea> 
            
            { preview && 
            <div className={"my-1 py-4 border-y-2 border-primary-dark "+ (currentView() != 1 && "hidden")}
                dangerouslySetInnerHTML={{__html: markdownResult}}></div>
            }

            <div className={"my-1 py-4 border-y-2 border-primary-dark "+ (currentView() != 2 && "hidden")}>
                <h4>Markdown Help</h4>
                <table className="w-full" >
                    <thead>
                        <tr>
                            <th>Element</th>
                            <th>Raw</th>
                            <th>Parsed</th>
                        </tr>
                    </thead>
                    <tbody className="markdown-example">
                        <tr>
                            <td>Paragraph</td>
                            <td>This is a paragraph.<br/><br/>Double-space lines for a paragraph break.</td>
                            <td>This is a paragraph.<br/>Double-space lines for a paragraph break.</td>
                        </tr>
                        <tr>
                            <td>Headings</td>
                            <td># Heading 1<br/>## Heading 2<br/>### Heading 3<br/>#### Heading 4<br/>##### Heading 5<br/>###### Heading 6<br/></td>
                            <td><h1>Heading 1</h1>
                                <h2>Heading 2</h2>
                                <h3>Heading 3</h3>
                                <h4>Heading 4</h4>
                                <h5>Heading 5</h5>
                                <h6>Heading 6</h6></td>
                        </tr>
                        <tr>
                            <td>Ordered List</td>
                            <td>1. Item 1<br/>2. Item 2<br/>3. Item 3</td>
                            <td><ol>
                                <li>Item 1</li>
                                <li>Item 2</li>
                                <li>Item 3</li>
                            </ol></td>
                        </tr>
                        <tr>
                            <td>Unordered List</td>
                            <td>- Item 1<br/>- Item 2<br/>- Item 3</td>
                            <td><ul>
                                <li>Item 1</li>
                                <li>Item 2</li>
                                <li>Item 3</li>
                            </ul></td>
                        </tr>
                        <tr>
                            <td>Blockquote</td>
                            <td>{">"} This text is in a blockquote.</td>
                            <td><blockquote>This text is in a blockquote.</blockquote></td>
                        </tr>
                        <tr>
                            <td>Italics</td>
                            <td>This word is *italic*.</td>
                            <td>This word is <i>italic</i>.</td>
                        </tr>
                        <tr>
                            <td>Bold</td>
                            <td>This word is **bold**.</td>
                            <td>This word is <strong>bold</strong>.</td>
                        </tr>
                        <tr>
                            <td>Link</td>
                            <td>[Markdown] links should be defined at the bottom of raw markdown content.
                                <br />
                                <br />[Markdown]: http://daringfireball.net/projects/markdown/
                            </td>
                            <td><p><a href="http://daringfireball.net/projects/markdown/">Markdown</a> links should be defined at the bottom of raw markdown content.</p></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            

            
        </div>
    );
}