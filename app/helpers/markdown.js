import { marked } from 'marked';

export function mdParseCustom(rawMarkdown) {
    let markdownParsed = marked.parse(rawMarkdown);
    markdownParsed = markdownParsed.replaceAll("<h1>", "<h4>");
    markdownParsed = markdownParsed.replaceAll("</h1>", "</h4>");
    markdownParsed = markdownParsed.replaceAll("<h2>", "<h5>");
    markdownParsed = markdownParsed.replaceAll("</h2>", "</h5>");
    return markdownParsed;
}