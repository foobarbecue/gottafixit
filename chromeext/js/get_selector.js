// To record which element the user edited, we generate a sort-of-robust jquery selector using code from
// http://www.timvasil.com/blog14/post/2014/02/24/Build-a-unique-selector-for-any-DOM-element-using-jQuery.aspx
$.fn.getSelector = function() {
    var el = this[0];
    if (!el.tagName) {
        return '';
    }

    // If we have an ID, we're done; that uniquely identifies this element
    var el$ = $(el);
    var id = el$.attr('id');
    if (id) {
        return '#' + id;
    }

    var classNames = el$.attr('class');
    var classSelector;
    if (classNames) {
        classSelector = '.' + $.trim(classNames).replace(/\s/gi, '.');
    }

    var selector;
    var parent$ = el$.parent();
    var siblings$ = parent$.children();
    var needParent = false;
    if (classSelector && siblings$.filter(classSelector).length == 1) {
        // Classes are unique among siblings; use that
        selector = classSelector;
    } else if (siblings$.filter(el.tagName).length == 1) {
        // Tag name is unique among siblings; use that
        selector = el.tagName;
    } else {
        // Default to saying "nth child"
        selector = ':nth-child(' + ($(this).index() + 1)+')';
        needParent = true;
    }

    // Bypass ancestors that don't matter
    if (!needParent) {
        for (ancestor$ = parent$.parent();
             ancestor$.length == 1 && ancestor$.find(selector).length == 1;
             parent$ = ancestor$, ancestor$ = ancestor$.parent())
        if (ancestor$.length == 0) {
            return selector;
        }
    }

    return parent$.getSelector() + ' > ' + selector;
};