// OpenSearch description document can be specified via the <link> tag with rel="search".
// See http://blog.whatwg.org/the-road-to-html-5-link-relations#rel-search.
// It should have the type "application/opensearchdescription+xml".
// See https://github.com/dewitt/opensearch/blob/master/opensearch-1-1-draft-6.md#mime-type-applicationopensearchdescriptionxml.
(function() {
    if (!document.head)
        return null;

    var linkTags = document.head.getElementsByTagName("link");
    var numberOfLinkTags = linkTags.length;

    for (var i = 0; i < numberOfLinkTags; ++i) {
        var linkTag = linkTags[i];
        if (linkTag.getAttribute("rel") === "search" && linkTag.getAttribute("type") === "application/opensearchdescription+xml")
            return linkTag.href;
    }

    return null;
})();
