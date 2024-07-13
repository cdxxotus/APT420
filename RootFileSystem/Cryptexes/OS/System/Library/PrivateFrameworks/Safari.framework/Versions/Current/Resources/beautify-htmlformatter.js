/*
 * Copyright (C) 2019-2023 Apple Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. AND ITS CONTRIBUTORS ``AS IS''
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL APPLE INC. OR ITS CONTRIBUTORS
 * BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
 * THE POSSIBILITY OF SUCH DAMAGE.
 */

window.beautify = function(sourceText) {
    let formatter = new HTMLFormatter(sourceText, HTMLFormatter.SourceType.HTML);
    if (!formatter.success)
        console.error("Unable to format provided sourceText")

    return formatter.formattedText;
};

Object.defineProperty(Array.prototype, "lastValue",
{
    get()
    {
        if (!this.length)
            return undefined;
        return this[this.length - 1];
    }
});

Object.defineProperty(String.prototype, "lineEndings",
{
    value()
    {
        let lineEndings = [];
        let pattern = /\r\n?|\n/g;
        let match = pattern.exec(this);
        while (match) {
            lineEndings.push(match.index);
            match = pattern.exec(this);
        }

        lineEndings.push(this.length);
        return lineEndings;
    }
});

FormatterContentBuilder = class FormatterContentBuilder
{
    constructor(indentString)
    {
        this._originalContent = null;
        this._formattedContent = [];
        this._formattedContentLength = 0;

        this._startOfLine = true;
        this._currentLine = null;
        this.lastTokenWasNewline = false;
        this.lastTokenWasWhitespace = false;
        this.lastNewlineAppendWasMultiple = false;

        this._indent = 0;
        this._indentString = indentString;
        this._indentCache = ["", this._indentString];

        this._mapping = {original: [0], formatted: [0]};
        this._originalLineEndings = [];
        this._formattedLineEndings = [];
        this._originalOffset = 0;
        this._formattedOffset = 0;

        this._lastOriginalPosition = 0;
        this._lastFormattedPosition = 0;
    }

    // Public

    get indentString() { return this._indentString; }
    get originalContent() { return this._originalContent; }

    get formattedContent()
    {
        let formatted = this._formattedContent.join("");
        console.assert(formatted.length === this._formattedContentLength);
        return formatted;
    }

    get sourceMapData()
    {
        return {
            mapping: this._mapping,
            originalLineEndings: this._originalLineEndings,
            formattedLineEndings: this._formattedLineEndings,
        };
    }

    get lastToken()
    {
        return this._formattedContent.lastValue;
    }

    get currentLine()
    {
        if (!this._currentLine)
            this._currentLine = this._formattedContent.slice(this._formattedContent.lastIndexOf("\n") + 1).join("");
        return this._currentLine;
    }

    get indentLevel()
    {
        return this._indent;
    }

    get indented()
    {
        return this._indent > 0;
    }

    get originalOffset()
    {
        return this._originalOffset;
    }

    set originalOffset(offset)
    {
        this._originalOffset = offset;
    }

    setOriginalContent(originalContent)
    {
        console.assert(!this._originalContent);
        this._originalContent = originalContent;
    }

    setOriginalLineEndings(originalLineEndings)
    {
        console.assert(!this._originalLineEndings.length);
        this._originalLineEndings = originalLineEndings;
    }

    appendNonToken(string)
    {
        if (!string)
            return;

        if (this._startOfLine)
            this._appendIndent();

        console.assert(!string.includes("\n"), "Appended a string with newlines. This breaks the source map.");

        this._append(string);
        this._startOfLine = false;
        this.lastTokenWasNewline = false;
        this.lastTokenWasWhitespace = false;
    }

    appendToken(string, originalPosition)
    {
        if (this._startOfLine)
            this._appendIndent();

        this._addMappingIfNeeded(originalPosition);

        console.assert(!string.includes("\n"), "Appended a string with newlines. This breaks the source map.");

        this._append(string);
        this._startOfLine = false;
        this.lastTokenWasNewline = false;
        this.lastTokenWasWhitespace = false;
    }

    appendStringWithPossibleNewlines(string, originalPosition)
    {
        let currentPosition = originalPosition;
        let lines = string.split("\n");
        for (let i = 0; i < lines.length; ++i) {
            let line = lines[i];
            if (line) {
                this.appendToken(line, currentPosition);
                currentPosition += line.length;
            }

            if (i < lines.length - 1) {
                this.appendNewline(true);
                currentPosition += 1;
            }
        }
    }

    appendMapping(originalPosition)
    {
        if (this._startOfLine)
            this._appendIndent();

        this._addMappingIfNeeded(originalPosition);

        this._startOfLine = false;
        this.lastTokenWasNewline = false;
        this.lastTokenWasWhitespace = false;
    }

    appendSpace()
    {
        if (!this._startOfLine) {
            this._append(" ");
            this.lastTokenWasNewline = false;
            this.lastTokenWasWhitespace = true;
        }
    }

    appendNewline(force)
    {
        if ((!this.lastTokenWasNewline && !this._startOfLine) || force) {
            if (this.lastTokenWasWhitespace)
                this._popFormattedContent();
            this._append("\n");
            this._addFormattedLineEnding();
            this._startOfLine = true;
            this.lastTokenWasNewline = true;
            this.lastTokenWasWhitespace = false;
            this.lastNewlineAppendWasMultiple = false;
        }
    }

    appendMultipleNewlines(newlines)
    {
        console.assert(newlines > 0);

        let wasMultiple = newlines > 1;

        while (newlines-- > 0)
            this.appendNewline(true);

        if (wasMultiple)
            this.lastNewlineAppendWasMultiple = true;
    }

    removeLastNewline()
    {
        console.assert(this.lastTokenWasNewline);
        console.assert(this.lastToken === "\n");
        if (this.lastTokenWasNewline) {
            this._popFormattedContent();
            this._formattedLineEndings.pop();
            this.lastTokenWasNewline = this.lastToken === "\n";
            this.lastTokenWasWhitespace = this.lastToken === " ";
            this._startOfLine = this.lastTokenWasNewline;
        }
    }

    tryRemoveLastWhitespace()
    {
        if (this.lastTokenWasWhitespace) {
            console.assert(this.lastToken === " ");
            this._popFormattedContent();
            // No need to worry about `_startOfLine` and `lastTokenWasNewline`
            // because `appendSpace` takes care of not adding whitespace
            // to the beginning of a line.
            this.lastTokenWasNewline = this.lastToken === "\n";
            this.lastTokenWasWhitespace = this.lastToken === " ";
        }
    }

    indent()
    {
        ++this._indent;
    }

    dedent()
    {
        --this._indent;

        console.assert(this._indent >= 0);
        if (this._indent < 0)
            this._indent = 0;
    }

    indentToLevel(level)
    {
        if (this._indent === level)
            return;

        while (this._indent < level)
            this.indent();
        while (this._indent > level)
            this.dedent();
    }

    addOriginalLineEnding(originalPosition)
    {
        this._originalLineEndings.push(originalPosition);
    }

    finish()
    {
        while (this.lastTokenWasNewline)
            this.removeLastNewline();
        this.appendNewline();
    }

    // Private

    _popFormattedContent()
    {
        let removed = this._formattedContent.pop();
        this._formattedContentLength -= removed.length;
        this._currentLine = null;
    }

    _append(str)
    {
        console.assert(str, "Should not append an empty string");
        this._formattedContent.push(str);
        this._formattedContentLength += str.length;
        this._currentLine = null;
    }

    _appendIndent()
    {
        // Indent is already in the cache.
        if (this._indent < this._indentCache.length) {
            let indent = this._indentCache[this._indent];
            if (indent)
                this._append(indent);
            return;
        }

        // Indent was not in the cache, fill up the cache up with what was needed.
        let maxCacheIndent = 20;
        let max = Math.min(this._indent, maxCacheIndent);
        for (let i = this._indentCache.length; i <= max; ++i)
            this._indentCache[i] = this._indentCache[i - 1] + this._indentString;

        // Append indents as needed.
        let indent = this._indent;
        do {
            if (indent >= maxCacheIndent)
                this._append(this._indentCache[maxCacheIndent]);
            else
                this._append(this._indentCache[indent]);
            indent -= maxCacheIndent;
        } while (indent > 0);
    }

    _addMappingIfNeeded(originalPosition)
    {
        if (originalPosition - this._lastOriginalPosition === this._formattedContentLength - this._lastFormattedPosition)
            return;

        this._mapping.original.push(this._originalOffset + originalPosition);
        this._mapping.formatted.push(this._formattedOffset + this._formattedContentLength);

        this._lastOriginalPosition = originalPosition;
        this._lastFormattedPosition = this._formattedContentLength;
    }

    _addFormattedLineEnding()
    {
        console.assert(this._formattedContent.lastValue === "\n");
        this._formattedLineEndings.push(this._formattedContentLength - 1);
    }
};


HTMLFormatter = class HTMLFormatter
{
    constructor(sourceText, sourceType, builder, indentString = "    ")
    {
        console.assert(typeof sourceText === "string");
        console.assert(Object.values(HTMLFormatter.SourceType).includes(sourceType));

        this._sourceType = sourceType;

        this._success = false;

        let dom = (function() {
            try {
                let options = {
                    isXML: sourceType === HTMLFormatter.SourceType.XML,
                };
                let parser = new HTMLParser;
                let treeBuilder = new HTMLTreeBuilderFormatter(options);
                parser.parseDocument(sourceText, treeBuilder, options);
                return treeBuilder.dom;
            } catch (e) {
                console.error("Unexpected HTMLFormatter Error", e);
                return null;
            }
        })();

        if (!dom)
            return;

        this._sourceText = sourceText;

        this._builder = builder;
        if (!this._builder) {
            this._builder = new FormatterContentBuilder(indentString);
            this._builder.setOriginalLineEndings(this._sourceText.lineEndings());
        }

        this._walkArray(dom, null);

        this._builder.appendNewline();
        this._builder.appendMapping(this._sourceText.length);

        this._success = true;
    }

    // Public

    get success() { return this._success; }

    get formattedText()
    {
        if (!this._success)
            return null;
        return this._builder.formattedContent;
    }

    get sourceMapData()
    {
        if (!this._success)
            return null;
        return this._builder.sourceMapData;
    }

    // Private

    _walk(node, parent)
    {
        if (!node)
            return;

        this._before(node, parent);
        this._walkArray(node.children, node);
        this._after(node, parent);
    }

    _walkArray(children, parent)
    {
        if (!children)
            return;

        this._previousSiblingNode = null;

        for (let child of children) {
            this._walk(child, parent);
            this._previousSiblingNode = child;
        }
    }

    _shouldHaveNoChildren(node)
    {
        switch (this._sourceType) {
        case HTMLFormatter.SourceType.HTML:
            return HTMLTreeBuilderFormatter.TagNamesWithoutChildren.has(node.lowercaseName);
        case HTMLFormatter.SourceType.XML:
            return false;
        }

        console.assert(false, "Unknown source type", this._sourceType);
        return false;
    }

    _shouldHaveInlineContent(node)
    {
        if (node.__shouldHaveNoChildren)
            return true;

        let children = node.children;
        if (!children)
            return true;
        if (!children.length)
            return true;
        if (children.length === 1 && node.children[0].type === HTMLTreeBuilderFormatter.NodeType.Text)
            return true;

        return false;
    }

    _hasMultipleNewLines(text)
    {
        let firstIndex = text.indexOf("\n");
        if (firstIndex === -1)
            return false;

        let secondIndex = text.indexOf("\n", firstIndex + 1);
        if (secondIndex === -1)
            return false;

        return true;
    }

    _buildAttributeString(attr)
    {
        this._builder.appendSpace();

        let {name, value, quote, namePos, valuePos} = attr;

        if (value !== undefined) {
            let q;
            switch (quote) {
            case HTMLParser.AttrQuoteType.None:
                q = ``;
                break;
            case HTMLParser.AttrQuoteType.Single:
                q = `'`;
                break;
            case HTMLParser.AttrQuoteType.Double:
                q = `"`;
                break;
            default:
                console.assert(false, "Unexpected quote type", quote);
                q = ``;
                break;
            }

            this._builder.appendToken(name, namePos);
            this._builder.appendNonToken("=");
            if (q)
                this._builder.appendStringWithPossibleNewlines(q + value + q, valuePos);
            else
                this._builder.appendToken(value, valuePos);
            return;
        }

        console.assert(quote === HTMLParser.AttrQuoteType.None);
        this._builder.appendToken(name, namePos);
    }

    _before(node, parent)
    {
        if (node.type === HTMLTreeBuilderFormatter.NodeType.Node) {
            node.__shouldHaveNoChildren = this._shouldHaveNoChildren(node);
            node.__inlineContent = this._shouldHaveInlineContent(node);

            if (this._previousSiblingNode && this._previousSiblingNode.type === HTMLTreeBuilderFormatter.NodeType.Text)
                this._builder.appendNewline();

            this._builder.appendToken("<" + node.name, node.pos);
            if (node.attributes) {
                for (let attr of node.attributes)
                    this._buildAttributeString(attr);
            }
            if (node.selfClose)
                this._builder.appendNonToken("/");
            this._builder.appendNonToken(">");

            if (node.selfClose || node.__shouldHaveNoChildren)
                this._builder.appendNewline();

            if (!node.__inlineContent) {
                if (node.lowercaseName !== "html" || this._sourceType === HTMLFormatter.SourceType.XML)
                    this._builder.indent();
                this._builder.appendNewline();
            }
            return;
        }

        if (node.type === HTMLTreeBuilderFormatter.NodeType.Text) {
            // <script> and <style> inline content.
            if (parent && parent.type === HTMLTreeBuilderFormatter.NodeType.Node) {
                switch (parent.lowercaseName) {
                case "script":
                    this._builder.appendStringWithPossibleNewlines(node.data, node.pos);
                    break;
                case "style":
                    this._builder.appendStringWithPossibleNewlines(node.data, node.pos);
                    break;
                }
            }

            // Whitespace only text nodes.
            let textString = node.data;
            if (/^\s*$/.test(textString)) {
                // Collapse multiple blank lines to a single blank line.
                if (this._hasMultipleNewLines(textString))
                    this._builder.appendNewline(true);
                return;
            }

            this._builder.appendStringWithPossibleNewlines(textString, node.pos);
            return;
        }

        if (node.type === HTMLTreeBuilderFormatter.NodeType.Comment) {
            let openerString = node.opener ? node.opener : "<!--";
            let commentString = openerString + node.data;
            this._builder.appendStringWithPossibleNewlines(commentString, node.pos);
            return;
        }

        if (node.type === HTMLTreeBuilderFormatter.NodeType.Doctype) {
            let doctypeString = "<" + node.raw + node.data;
            this._builder.appendStringWithPossibleNewlines(doctypeString, node.pos);
            return;
        }

        if (node.type === HTMLTreeBuilderFormatter.NodeType.CData) {
            let cdataString = "<![CDATA[" + node.data;
            this._builder.appendStringWithPossibleNewlines(cdataString, node.pos);
            return;
        }

        if (node.type === HTMLTreeBuilderFormatter.NodeType.Error) {
            let rawText = node.raw;
            this._builder.appendStringWithPossibleNewlines(rawText, node.pos);
            this._builder.appendNewline();
            return;
        }

        console.assert(false, "Unhandled node type", node.type, node);
    }

    _after(node, parent)
    {
        if (node.type === HTMLTreeBuilderFormatter.NodeType.Node) {
            if (node.selfClose)
                return;
            if (node.__shouldHaveNoChildren)
                return;
            if (!node.__inlineContent) {
                if (node.lowercaseName !== "html" || this._sourceType === HTMLFormatter.SourceType.XML)
                    this._builder.dedent();
                this._builder.appendNewline();
            }
            if (!node.implicitClose) {
                console.assert(node.closeTagName);
                console.assert(node.closeTagPos);
                this._builder.appendToken("</" + node.closeTagName + ">", node.closeTagPos);
            }
            this._builder.appendNewline();
            return;
        }

        if (node.type === HTMLTreeBuilderFormatter.NodeType.Text)
            return;

        if (node.type === HTMLTreeBuilderFormatter.NodeType.Comment) {
            let closingCommentString = node.opener ? ">" : "-->";
            this._builder.appendToken(closingCommentString, node.closePos);
            this._builder.appendNewline();
            return;
        }

        if (node.type === HTMLTreeBuilderFormatter.NodeType.Doctype) {
            let closingDoctypeString = ">";
            this._builder.appendToken(closingDoctypeString, node.closePos);
            this._builder.appendNewline();
            return;
        }

        if (node.type === HTMLTreeBuilderFormatter.NodeType.CData) {
            let closingCDataString = "]]>";
            this._builder.appendToken(closingCDataString, node.closePos);
            return;
        }

        if (node.type === HTMLTreeBuilderFormatter.NodeType.Error)
            return;

        console.assert(false, "Unhandled node type", node.type, node);
    }

    _formatWithNestedFormatter(sourceText, parentNode, textNode, formatterCallback)
    {
        this._builder.appendNewline();

        let originalIndentLevel = this._builder.indentLevel;
        this._builder.originalOffset = textNode.pos;

        let formatter = formatterCallback();
        if (!formatter.success) {
            this._builder.removeLastNewline();
            this._builder.originalOffset = 0;
            return false;
        }

        this._builder.appendMapping(sourceText.length);
        this._builder.indentToLevel(originalIndentLevel);
        this._builder.originalOffset = 0;

        return true;
    }
};

HTMLFormatter.SourceType = {
    HTML: "html",
    XML: "xml",
};

// This tree builder attempts to match input text to output DOM node.
// This therefore doesn't do HTML5 tree construction like implicitly-closing
// specific HTML parent nodes depending on being in a particular node,
// it only does basic implicitly-closing. In general this tries to be a
// whitespace reformatter for input text and not generate the ultimate
// html tree that a browser would generate.
//
// When run with the XML option, all HTML specific cases are disabled.

HTMLTreeBuilderFormatter = class HTMLTreeBuilderFormatter
{
    constructor({isXML} = {})
    {
        this._isXML = !!isXML;
    }

    // Public

    get dom() { return this._dom; }

    begin()
    {
        this._dom = [];
        this._stackOfOpenElements = [];
    }

    pushParserNode(parserNode)
    {
        let containerNode = this._stackOfOpenElements.lastValue;
        if (!containerNode)
            this._pushParserNodeTopLevel(parserNode);
        else
            this._pushParserNodeStack(parserNode, containerNode);
    }

    end()
    {
        for (let node of this._stackOfOpenElements)
            node.implicitClose = true;
    }

    // Private

    _pushParserNodeTopLevel(parserNode)
    {
        if (parserNode.type === HTMLParser.NodeType.OpenTag) {
            let node = this._buildDOMNodeFromOpenTag(parserNode);
            this._dom.push(node);
            if (!this._isEmptyNode(parserNode, node))
                this._stackOfOpenElements.push(node);
            return;
        }

        if (parserNode.type === HTMLParser.NodeType.CloseTag) {
            let errorNode = this._buildErrorNodeFromCloseTag(parserNode);
            this._dom.push(errorNode);
            return;
        }

        let node = this._buildSimpleNodeFromParserNode(parserNode);
        this._dom.push(node);
    }

    _pushParserNodeStack(parserNode, containerNode)
    {
        if (parserNode.type === HTMLParser.NodeType.OpenTag) {
            let node = this._buildDOMNodeFromOpenTag(parserNode);
            let childrenArray = containerNode.children;
            if (!this._isXML) {
                this._implicitlyCloseHTMLNodesForOpenTag(parserNode, node);
                containerNode = this._stackOfOpenElements.lastValue;
                childrenArray = containerNode ? containerNode.children : this._dom;
            }
            childrenArray.push(node);
            if (!this._isEmptyNode(parserNode, node))
                this._stackOfOpenElements.push(node);
            return;
        }

        if (parserNode.type === HTMLParser.NodeType.CloseTag) {
            let tagName = this._isXML ? parserNode.name : parserNode.name.toLowerCase();
            let matchingOpenTagIndex = this._indexOfStackNodeMatchingTagNames([tagName]);

            // Found a matching tag, implicitly-close nodes.
            if (matchingOpenTagIndex !== -1) {
                let nodesToPop = this._stackOfOpenElements.length - matchingOpenTagIndex;
                for (let i = 0; i < nodesToPop - 1; ++i) {
                    let implicitlyClosingNode = this._stackOfOpenElements.pop();
                    implicitlyClosingNode.implicitClose = true;
                }
                let implicitlyClosingNode = this._stackOfOpenElements.pop();
                if (parserNode.pos) {
                    implicitlyClosingNode.closeTagPos = parserNode.pos;
                    implicitlyClosingNode.closeTagName = parserNode.name;
                }
                return;
            }

            // Did not find a matching tag to close.
            // Treat this as an error text node.
            let errorNode = this._buildErrorNodeFromCloseTag(parserNode);
            containerNode.children.push(errorNode);
            return;
        }

        let node = this._buildSimpleNodeFromParserNode(parserNode);
        containerNode.children.push(node);
    }

    _implicitlyCloseHTMLNodesForOpenTag(parserNode, node)
    {
        if (parserNode.closed)
            return;

        switch (node.lowercaseName) {
        // <body> closes <head>.
        case "body":
            this._implicitlyCloseTagNamesInsideParentTagNames(["head"]);
            break;

        // Inside <select>.
        case "option":
            this._implicitlyCloseTagNamesInsideParentTagNames(["option"], ["select"]);
            break;
        case "optgroup": {
            let didClose = this._implicitlyCloseTagNamesInsideParentTagNames(["optgroup"], ["select"]);;
            if (!didClose)
                this._implicitlyCloseTagNamesInsideParentTagNames(["option"], ["select"]);
            break;
        }

        // Inside <ol>/<ul>.
        case "li":
            this._implicitlyCloseTagNamesInsideParentTagNames(["li"], ["ol", "ul"]);
            break;

        // Inside <dl>.
        case "dd":
        case "dt":
            this._implicitlyCloseTagNamesInsideParentTagNames(["dd", "dt"], ["dl"]);
            break;

        // Inside <table>.
        case "tr": {
            let didClose = this._implicitlyCloseTagNamesInsideParentTagNames(["tr"], ["table"]);
            if (!didClose)
                this._implicitlyCloseTagNamesInsideParentTagNames(["td", "th"], ["table"]);
            break;
        }
        case "td":
        case "th":
            this._implicitlyCloseTagNamesInsideParentTagNames(["td", "th"], ["table"]);
            break;
        case "tbody": {
            let didClose = this._implicitlyCloseTagNamesInsideParentTagNames(["thead"], ["table"]);
            if (!didClose)
                didClose = this._implicitlyCloseTagNamesInsideParentTagNames(["tr"], ["table"]);
            break;
        }
        case "tfoot": {
            let didClose = this._implicitlyCloseTagNamesInsideParentTagNames(["tbody"], ["table"]);
            if (!didClose)
                didClose = this._implicitlyCloseTagNamesInsideParentTagNames(["tr"], ["table"]);
            break;
        }
        case "colgroup":
            this._implicitlyCloseTagNamesInsideParentTagNames(["colgroup"], ["table"]);
            break;

        // Nodes that implicitly close a <p>. Normally this is only in <body> but we simplify to always.
        // https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inbody
        case "address":
        case "article":
        case "aside":
        case "blockquote":
        case "center":
        case "details":
        case "dialog":
        case "dir":
        case "div":
        case "dl":
        case "fieldset":
        case "figcaption":
        case "figure":
        case "footer":
        case "form":
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
        case "header":
        case "hgroup":
        case "hr":
        case "listing":
        case "main":
        case "menu":
        case "nav":
        case "ol":
        case "p":
        case "plaintext":
        case "pre":
        case "section":
        case "summary":
        case "table":
        case "ul":
        case "xmp":
            this._implicitlyCloseTagNamesInsideParentTagNames(["p"]);
            break;
        }
    }

    _implicitlyCloseTagNamesInsideParentTagNames(tagNames, containerScopeTagNames)
    {
        console.assert(!this._isXML, "Implicitly closing only happens in HTML. Also, names are compared case insensitively which would be invalid for XML.");

        let existingOpenTagIndex = this._indexOfStackNodeMatchingTagNames(tagNames);
        if (existingOpenTagIndex === -1)
            return false;

        // Disallow impliticly closing beyond the container tag boundary.
        if (containerScopeTagNames) {
            for (let i = existingOpenTagIndex + 1; i < this._stackOfOpenElements.length; ++i) {
                let stackNode = this._stackOfOpenElements[i];
                let name = stackNode.lowercaseName;
                if (containerScopeTagNames.includes(name))
                    return false;
            }
        }

        // Implicitly close tags.
        let nodesToPop = this._stackOfOpenElements.length - existingOpenTagIndex;
        for (let i = 0; i < nodesToPop; ++i) {
            let implicitlyClosingNode = this._stackOfOpenElements.pop();
            implicitlyClosingNode.implicitClose = true;
        }

        return true;
    }

    _indexOfStackNodeMatchingTagNames(tagNames)
    {
        for (let i = this._stackOfOpenElements.length - 1; i >= 0; --i) {
            let stackNode = this._stackOfOpenElements[i];
            let name = this._isXML ? stackNode.name : stackNode.lowercaseName;
            if (tagNames.includes(name))
                return i;
        }

        return -1;
    }

    _isEmptyNode(parserNode, node)
    {
        if (parserNode.closed)
            return true;

        if (!this._isXML && HTMLTreeBuilderFormatter.TagNamesWithoutChildren.has(node.lowercaseName))
            return true;

        return false;
    }

    _buildDOMNodeFromOpenTag(parserNode)
    {
        console.assert(parserNode.type === HTMLParser.NodeType.OpenTag);

        return {
            type: HTMLTreeBuilderFormatter.NodeType.Node,
            name: parserNode.name,
            lowercaseName: parserNode.name.toLowerCase(),
            children: [],
            attributes: parserNode.attributes,
            pos: parserNode.pos,
            selfClose: parserNode.closed,
            implicitClose: false,
        };
    }

    _buildErrorNodeFromCloseTag(parserNode)
    {
        console.assert(parserNode.type === HTMLParser.NodeType.CloseTag);

        return {
            type: HTMLTreeBuilderFormatter.NodeType.Error,
            raw: "</" + parserNode.name + ">",
            pos: parserNode.pos,
        };
    }

    _buildSimpleNodeFromParserNode(parserNode)
    {
        // Pass ErrorText through as Text.
        if (parserNode.type === HTMLParser.NodeType.ErrorText)
            parserNode.type = HTMLParser.NodeType.Text;

        // Pass these nodes right through: Text, Comment, Doctype, CData
        console.assert(parserNode.type === HTMLTreeBuilderFormatter.NodeType.Text || parserNode.type === HTMLTreeBuilderFormatter.NodeType.Comment || parserNode.type === HTMLTreeBuilderFormatter.NodeType.Doctype || parserNode.type === HTMLTreeBuilderFormatter.NodeType.CData);
        console.assert("data" in parserNode);

        return parserNode;
    }
};

HTMLTreeBuilderFormatter.TagNamesWithoutChildren = new Set([
    "area",
    "base",
    "basefont",
    "br",
    "canvas",
    "col",
    "command",
    "embed",
    "frame",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "menuitem",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
]);

HTMLTreeBuilderFormatter.NodeType = {
    Text: "text",
    Node: "node",
    Comment: "comment",
    Doctype: "doctype",
    CData: "cdata",
    Error: "error",
};

HTMLParser = class HTMLParser {

    // Public

    parseDocument(sourceText, treeBuilder, {isXML} = {})
    {
        console.assert(typeof sourceText === "string");
        console.assert(treeBuilder);
        console.assert(treeBuilder.pushParserNode);

        this._treeBuilder = treeBuilder;

        this._pos = 0;
        this._mode = HTMLParser.Mode.Data;
        this._data = sourceText;
        this._bogusCommentOpener = null;
        this._isXML = !!isXML;

        if (this._treeBuilder.begin)
            this._treeBuilder.begin();

        while (this._pos < this._data.length)
            this._parse();

        if (this._treeBuilder.end)
            this._treeBuilder.end();
    }

    // Private

    _isEOF()
    {
        return this._pos === this._data.length;
    }

    _peek(n = 1)
    {
        return this._data.substring(this._pos, this._pos + n);
    }

    _peekCharacterRegex(regex)
    {
        return regex.test(this._data.charAt(this._pos));
    }

    _peekString(str)
    {
        for (let i = 0; i < str.length; ++i) {
            let c = str[i];
            if (this._data.charAt(this._pos + i) !== c)
                return false;
        }

        return true;
    }

    _peekCaseInsensitiveString(str)
    {
        console.assert(str.toLowerCase() === str, "String should be passed in as lowercase.");

        for (let i = 0; i < str.length; ++i) {
            let d = this._data.charAt(this._pos + i);
            if (!d)
                return false;
            let c = str[i];
            if (d.toLowerCase() !== c)
                return false;
        }

        return true;
    }

    _consumeRegex(regex)
    {
        let startIndex = this._pos;
        while (regex.test(this._data.charAt(this._pos)))
            this._pos++;

        return this._data.substring(startIndex, this._pos);
    }

    _consumeWhitespace()
    {
        return this._consumeRegex(/\s/);
    }

    _consumeUntilString(str, newMode)
    {
        let index = this._data.indexOf(str, this._pos);
        if (index === -1) {
            let startIndex = this._pos;
            this._pos = this._data.length;
            if (newMode)
                this._mode = newMode;
            return this._data.substring(startIndex, this._data.length);
        }

        let startIndex = this._pos;
        this._pos = index + str.length;
        if (newMode)
            this._mode = newMode;
        return this._data.substring(startIndex, index);
    }

    _consumeDoubleQuotedString()
    {
        console.assert(this._peekString(`"`));
        this._pos++;
        let string = this._consumeUntilString(`"`);
        return string;
    }

    _consumeSingleQuotedString()
    {
        console.assert(this._peekString(`'`));
        this._pos++;
        let string = this._consumeUntilString(`'`);
        return string;
    }

    // Parser
    // This is a crude implementation of HTML tokenization:
    // https://html.spec.whatwg.org/multipage/parsing.html

    _parse()
    {
        switch (this._mode) {
        case HTMLParser.Mode.Data:
            return this._parseData();
        case HTMLParser.Mode.ScriptData:
            return this._parseScriptData();
        case HTMLParser.Mode.TagOpen:
            return this._parseTagOpen();
        case HTMLParser.Mode.Attr:
            return this._parseAttr();
        case HTMLParser.Mode.CData:
            return this._parseCData();
        case HTMLParser.Mode.Doctype:
            return this._parseDoctype();
        case HTMLParser.Mode.Comment:
            return this._parseComment();
        case HTMLParser.Mode.BogusComment:
            return this._parseBogusComment();
        }

        console.assert();
        throw "Missing parser mode";
    }

    _parseData()
    {
        let startPos = this._pos;
        let text = this._consumeUntilString("<", HTMLParser.Mode.TagOpen);
        if (text)
            this._push({type: HTMLParser.NodeType.Text, data: text, pos: startPos});

        if (this._isEOF() && this._data.endsWith("<"))
            this._handleEOF(this._pos - 1);
    }

    _parseScriptData()
    {
        let startPos = this._pos;
        let scriptText = "";

        // Parse as text until </script>.
        while (true) {
            scriptText += this._consumeUntilString("<");
            if (this._peekCaseInsensitiveString("/script>")) {
                this._pos += "/script>".length;
                this._mode = HTMLParser.Mode.Data;
                break;
            }
            if (this._handleEOF(startPos))
                return;
            scriptText += "<";
        }

        if (scriptText)
            this._push({type: HTMLParser.NodeType.Text, data: scriptText, pos: startPos});
        this._push({type: HTMLParser.NodeType.CloseTag, name: "script", pos: startPos + scriptText.length});
    }

    _parseTagOpen()
    {
        // |<tag
        this._currentTagStartPos = this._pos - 1;

        if (this._peekString("!")) {
            // Comment.
            if (this._peekString("!--")) {
                this._pos += "!--".length;
                this._mode = HTMLParser.Mode.Comment;
                this._handleEOF(this._currentTagStartPos);
                return;
            }

            // DOCTYPE.
            if (this._peekCaseInsensitiveString("!doctype")) {
                let startPos = this._pos;
                this._pos += "!DOCTYPE".length;
                this._doctypeRaw = this._data.substring(startPos, this._pos);
                this._mode = HTMLParser.Mode.Doctype;
                this._handleEOF(this._currentTagStartPos);
                return;
            }

            // CDATA.
            if (this._peekString("![CDATA[")) {
                this._pos += "![CDATA[".length;
                this._mode = HTMLParser.Mode.CData;
                this._handleEOF(this._currentTagStartPos);
                return;
            }

            // Bogus Comment.
            this._pos++;
            this._mode = HTMLParser.Mode.BogusComment;
            this._handleEOF(this._currentTagStartPos);
            return;
        }

        if (this._peekString("?")) {
            // Bogus Comment.
            this._pos++;
            this._mode = HTMLParser.Mode.BogusComment;
            this._bogusCommentOpener = "<?";
            this._handleEOF(this._currentTagStartPos);
            return;
        }

        if (this._peekString("/")) {
            // End Tag.
            this._pos++;
            let text = this._consumeUntilString(">", HTMLParser.Mode.Data);
            this._push({type: HTMLParser.NodeType.CloseTag, name: text, pos: this._currentTagStartPos});
            return;
        }

        // ASCII - Open Tag
        if (this._peekCharacterRegex(/[a-z]/i)) {
            let text = this._consumeRegex(/[^\s/>]+/);
            if (text) {
                if (this._peekCharacterRegex(/\s/)) {
                    this._currentTagName = text;
                    this._currentTagAttributes = [];
                    this._mode = HTMLParser.Mode.Attr;
                    return;
                }

                if (this._peekString("/>")) {
                    this._pos += "/>".length;
                    this._mode = HTMLParser.Mode.Data;
                    this._push({type: HTMLParser.NodeType.OpenTag, name: text, closed: true, pos: this._currentTagStartPos});
                    return;
                }

                if (this._peekString(">")) {
                    this._pos++;
                    this._mode = HTMLParser.Mode.Data;
                    this._push({type: HTMLParser.NodeType.OpenTag, name: text, closed: false, pos: this._currentTagStartPos});
                    return;
                }

                // End of document. Output any remaining data as error text.
                console.assert(this._isEOF());
                this._push({type: HTMLParser.NodeType.ErrorText, data: "<" + text, pos: this._currentTagStartPos});
                return;
            }
        }

        // Anything else, treat as text.
        this._push({type: HTMLParser.NodeType.Text, data: "<", pos: this._currentTagStartPos});
        this._mode = HTMLParser.Mode.Data;
    }

    _parseAttr()
    {
        this._consumeWhitespace();

        if (this._peekString("/>")) {
            this._pos += "/>".length;
            this._mode = HTMLParser.Mode.Data;
            this._push({type: HTMLParser.NodeType.OpenTag, name: this._currentTagName, closed: true, attributes: this._currentTagAttributes, pos: this._currentTagStartPos});
            return;
        }

        if (this._peekString(">")) {
            this._pos++;
            this._mode = HTMLParser.Mode.Data;
            this._push({type: HTMLParser.NodeType.OpenTag, name: this._currentTagName, closed: false, attributes: this._currentTagAttributes, pos: this._currentTagStartPos});
            return;
        }

        // <tag |attr
        let attributeNameStartPos = this._pos;

        let attributeName = this._consumeRegex(/[^\s=/>]+/);
        // console.assert(attributeName.length > 0, "Unexpected empty attribute name");
        if (this._peekString("/") || this._peekString(">")) {
            if (attributeName)
                this._pushAttribute({name: attributeName, value: undefined, namePos: attributeNameStartPos});
            return;
        }

        this._consumeWhitespace();

        if (this._peekString("=")) {
            this._pos++;

            // <tag attr=|value
            let attributeValueStartPos = this._pos;

            this._consumeWhitespace();

            if (this._peekString(`"`)) {
                let attributeValue = this._consumeDoubleQuotedString();
                this._pushAttribute({name: attributeName, value: attributeValue, quote: HTMLParser.AttrQuoteType.Double, namePos: attributeNameStartPos, valuePos: attributeValueStartPos});
                return;
            }

            if (this._peekString(`'`)) {
                let attributeValue = this._consumeSingleQuotedString();
                this._pushAttribute({name: attributeName, value: attributeValue, quote: HTMLParser.AttrQuoteType.Single, namePos: attributeNameStartPos, valuePos: attributeValueStartPos});
                return;
            }

            if (this._peekString(">")) {
                this._pos++;
                this._mode = HTMLParser.Mode.Data;
                this._push({type: HTMLParser.NodeType.OpenTag, name: this._currentTagName, closed: false, attributes: this._currentTagAttributes, pos: this._currentTagStartPos});
                return;
            }

            let whitespace = this._consumeWhitespace();
            if (whitespace) {
                this._pushAttribute({name: attributeName, value: undefined, quote: HTMLParser.AttrQuoteType.None, namePos: attributeNameStartPos});
                return;
            }

            let attributeValue = this._consumeRegex(/[^\s=>]+/);
            this._pushAttribute({name: attributeName, value: attributeValue, quote: HTMLParser.AttrQuoteType.None, namePos: attributeNameStartPos, valuePos: attributeValueStartPos});
            return;
        }

        if (!this._isEOF()) {
            this._pushAttribute({name: attributeName, value: undefined, quote: HTMLParser.AttrQuoteType.None, namePos: attributeNameStartPos});
            return;
        }

        // End of document. Treat everything up to now as error text.
        console.assert(this._isEOF());
        this._push({type: HTMLParser.NodeType.ErrorText, data: this._data.substring(this._currentTagStartPos), pos: this._currentTagStartPos});
        return;
    }

    _parseComment()
    {
        let text = this._consumeUntilString("-->", HTMLParser.Mode.Data);
        if (this._isEOF() && !this._data.endsWith("-->")) {
            this._push({type: HTMLParser.NodeType.ErrorText, data: this._data.substring(this._currentTagStartPos), pos: this._currentTagStartPos});
            return;
        }

        let closePos = this._pos - "-->".length;
        this._push({type: HTMLParser.NodeType.Comment, data: text, pos: this._currentTagStartPos, closePos});
    }

    _parseBogusComment()
    {
        let text = this._consumeUntilString(">", HTMLParser.Mode.Data);
        if (this._isEOF() && !this._data.endsWith(">")) {
            this._push({type: HTMLParser.NodeType.ErrorText, data: this._data.substring(this._currentTagStartPos), pos: this._currentTagStartPos});
            return;
        }

        let closePos = this._pos - ">".length;
        this._push({type: HTMLParser.NodeType.Comment, data: text, opener: this._bogusCommentOpener || "", pos: this._currentTagStartPos, closePos});
        this._bogusCommentOpener = null;
    }

    _parseDoctype()
    {
        let text = this._consumeUntilString(">", HTMLParser.Mode.Data);
        if (this._isEOF() && !this._data.endsWith(">")) {
            this._push({type: HTMLParser.NodeType.ErrorText, data: this._data.substring(this._currentTagStartPos), pos: this._currentTagStartPos});
            return;
        }

        let closePos = this._pos - ">".length;
        this._push({type: HTMLParser.NodeType.Doctype, data: text, raw: this._doctypeRaw, pos: this._currentTagStartPos, closePos});
        this._doctypeRaw = null;
    }

    _parseCData()
    {
        let text = this._consumeUntilString("]]>", HTMLParser.Mode.Data);
        if (this._isEOF() && !this._data.endsWith("]]>")) {
            this._push({type: HTMLParser.NodeType.ErrorText, data: this._data.substring(this._currentTagStartPos), pos: this._currentTagStartPos});
            return;
        }

        let closePos = this._pos - "]]>".length;
        this._push({type: HTMLParser.NodeType.CData, data: text, pos: this._currentTagStartPos, closePos});
    }

    _pushAttribute(attr)
    {
        this._currentTagAttributes.push(attr);
        this._handleEOF(this._currentTagStartPos);
    }

    _handleEOF(lastPosition)
    {
        if (!this._isEOF())
            return false;

        // End of document. Treat everything from the last position as error text.
        this._push({type: HTMLParser.NodeType.ErrorText, data: this._data.substring(lastPosition), pos: lastPosition});
        return true;
    }

    _push(node)
    {
        // Custom mode for some elements.
        if (node.type === HTMLParser.NodeType.OpenTag) {
            if (!this._isXML && node.name.toLowerCase() === "script")
                this._mode = HTMLParser.Mode.ScriptData;
        }

        this._treeBuilder.pushParserNode(node);
    }
};

HTMLParser.Mode = {
    Data: "data",
    TagOpen: "tag-open",
    ScriptData: "script-data",
    Attr: "attr",
    CData: "cdata",
    Doctype: "doctype",
    Comment: "comment",
    BogusComment: "bogus-comment",
};

HTMLParser.NodeType = {
    Text: "text",
    ErrorText: "error-text",
    OpenTag: "open-tag",
    CloseTag: "close-tag",
    Comment: "comment",
    Doctype: "doctype",
    CData: "cdata",
};

HTMLParser.AttrQuoteType = {
    None: "none",
    Double: "double",
    Single: "single",
};
