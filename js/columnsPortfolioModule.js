﻿/// <reference path="portfolioPage.js"/>

var columnsPreviewOpen = false;
var previewAnimDone = true;
var columnsPreviewIndex = 0;
var columnsPrevItemArr = "";
var totalColPreviews = 0;
var $originalDataPos = 0;

function modulePageColumnsUpdatePreviewMediaArr() {
    
}

function modulePageColumns() {
    
    columnsPreviewOpen = false;
    previewAnimDone = true;
    columnsPreviewIndex = 0;
    columnsPrevItemArr = new Array();
    totalColPreviews = 0;
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-columns", textPageInstanceHolder);

    if (textPageInstance.length <= 0) return;
    var columnItemWrapper = $("#module-columns-wrapper", textPageInstanceHolder);
    
    if (touchDevice == 1) {
        columnItemWrapper.css("overflow", "").css("-webkit-overflow-scrolling", "");
        columnItemWrapper.css("overflow", "auto").css("-webkit-overflow-scrolling", "touch");
    }

    checkColumnSize();
    moduleUpdate(textPageInstanceHolder, columnItemWrapper, $("div:first", columnItemWrapper), sideType);

    var val = Math.abs($("#module-container").width() - textPageInstanceHolder.width()) * .5;
    textPageInstanceHolder.css("left", "100%").css("visibility", "visible");
    TweenMax.to(textPageInstanceHolder, .6, { css: { left: val }, ease: Circ.easeOut });

    var thumbHolderClass = $("#module-columns-holder div:first", textPageInstance).attr("class");
    thumbHolderClass = $("." + thumbHolderClass);
    var backgOverColor = "#3f3f3f";
    var backgOutColor = rgb2hex(thumbHolderClass.css("background-color"));
    var text1BaseColor = rgb2hex($(".thumb-tag h1", thumbHolderClass).css("color"));
    var text2BaseColor = rgb2hex($(".thumb-tag h2", thumbHolderClass).css("color"));
    if (touchDevice == 0) {
        thumbHolderClass.unbind("mouseenter mouseleave");
        thumbHolderClass.hover(
            function (event) {
                customHoverAnimation("over", event, $(this), $("#thumb-image-hover", this));
                var text = $(".thumb-tag h1", this);
                var text2 = $(".thumb-tag h2", this);
                TweenMax.to([text, text2], .6, { css: { color: backgOutColor }, ease: Quad.easeOut });
                TweenMax.to($(this), .6, { css: { backgroundColor: backgOverColor }, ease: Quad.easeOut });
            },
            function (event) {
                customHoverAnimation("out", event, $(this), $("#thumb-image-hover", this));
                var text = $(".thumb-tag h1", this);
                var text2 = $(".thumb-tag h2", this);
                TweenMax.to(text, .6, { css: { color: text1BaseColor }, ease: Circ.easeOut });
                TweenMax.to(text2, .6, { css: { color: text2BaseColor }, ease: Circ.easeOut });
                TweenMax.to($(this), .6, { css: { backgroundColor: backgOutColor }, ease: Quad.easeOut });
            });
    }

    var columnTopPos = 0;
    totalColPreviews = $(".columns-preview-horizontal-fix ul", textPageInstance).children().length;
    thumbHolderClass.unbind("click");
    thumbHolderClass.click(
        function () {
            var index = $(thumbHolderClass).index(this);
            
            modulePageColumnsUpdatePreviewMediaArr();
            loadFullWidthPreview(index); 

        });

    
    var $filterContainer = $("#module-columns-holder", textPageInstance);
    $originalDataPos = getOriginalPos($filterContainer);
    if (touchDevice == 0)
        $("#filter-buttons-holder .filter-button", textPageInstance).hover(
            function () {
                if ($(this).hasClass("selected") == true) return;
                TweenMax.to($(this), .3, { css: { color: "#ffffff", backgroundColor: themeColor }, ease: Sine.easeOut });
            },
            function () {
                if ($(this).hasClass("selected") == true) return;
                TweenMax.to($(this), .3, { css: { color: "#3f3f3f", backgroundColor: "transparent" }, ease: Sine.easeOut });
            }
        );

    $("#filter-buttons-holder .filter-button", textPageInstance).click(
        function () {
            if ($(this).hasClass("selected") == true) return;

            $("#filter-buttons-holder select").val($(this).attr('data-filter'));
            $("#filter-buttons-holder .jquery-selectbox-currentItem").text($(this).text());

            var selector = $(this).attr('data-filter');
            $("#filter-buttons-holder", textPageInstance).find(".filter-button").each(
                function () {
                    if ($(this).hasClass("selected") == true) {
                        $(this).removeClass("selected");
                        TweenMax.to($(this), .3, {
                            css: { color: "#3f3f3f", backgroundColor: "transparent" },
                            ease: Sine.easeOut
                        });
                    }
                });
            $(this).addClass("selected");
            ///$(this).attr("style", "");
            if ($("#filter-buttons-holder").attr("data-folded") == "true")
                $(this).hide();
            if (touchDevice == 1) {
                TweenMax.to($(this), .3, {
                    css: { color: "#ffffff", backgroundColor: themeColor },
                    ease: Sine.easeOut
                });
            }
            filterContent($filterContainer, selector, $originalDataPos, onFilterComplete);
            return false;
        });

    // buttons folding
    var list = $("#filter-buttons-holder #filter-buttons-dropdown").find("select");
    $("#filter-buttons-holder .filter-button").each(function () {
        var v = "<option value='" + $(this).attr("data-filter") + "'>" + $(this).text() + "</option>";
        list.prepend(v);
    });
    //TODO: understang what is going on
    var needToShowDropdown = $("#filter-buttons-dropdown").css("display") == "none";
    if (needToShowDropdown)
        $("#filter-buttons-dropdown").show();
    list.selectbox().bind("change", function () {
        var val = $(this).val();
        var searchText = 'div[data-filter="' + val + '"]';
        $("#filter-buttons-holder").find(searchText).trigger("click");
    });
    //TODO: move it to lib
    $("#filter-buttons-holder .jquery-selectbox-moreButton").text("▼");
    $("#filter-buttons-holder .jquery-selectbox-list").css("height", "");
    $("#filter-buttons-holder .jquery-selectbox").css("width", "");
    $("#filter-buttons-holder .jquery-selectbox-list").css("width", "");

    $("#filter-buttons-holder").attr("data-folded", "true");
    if (needToShowDropdown)
        $("#filter-buttons-dropdown").hide();

    // set portfolio full view page
    setFullWidthPreview();
    storeFullWidthPreviewMedia();

    $(window).trigger("resize");
}

var containerTotalH = 0;

function onFilterComplete(index, container, child, hide) {
    var total = container.children().length - 1;
    if (hide == false) {
        containerTotalH = child.position().top + parseInt(child.css("margin-bottom"), 10) + child.height();
    }

    if (index == total) {
        var textPageInstanceHolder = $(txt_modCont);
        var textPageInstance = $("#module-columns-wrapper", textPageInstanceHolder);
        container.css("height", containerTotalH);
        TweenMax.to($("div:first", textPageInstance), .3, {
            css: { top: "0px" },
            easing: Sine.easeOut,
            onComplete:
                function () {
                    var sType = $("#template-menu").attr("data-side");
                    moduleUpdate(textPageInstanceHolder, textPageInstance, $("div:first", textPageInstance), sType, true, false);
                    //moduleUpdate_page_columns();
                    if (moduleList != null) moduleList.enableList();
                }
        });
    }
}

function getOriginalPos(container) {
    var i = 0;
    var posArray = new Array();
    container.children().each(function () {
        posArray[i] = { x: $(this).position().left, y: $(this).position().top };
        i++;
    });
    container.css("height", container.height());
    container.css("width", container.width());
    i = 0;
    container.children().each(function () {
        $(this).css("position", "absolute");
        $(this).css("left", posArray[i].x);
        $(this).css("top", posArray[i].y);
        i++;
    });
    return posArray;
}

function filterContent(container, selector, originalDataPos, onCompleteFunction) {
    var i = 0;
    var j = 0;
    if (i == 0 && moduleList != null) {
        moduleList.disableList();
    }
    container.children().each(
        function () {
            if ($(this).attr("data-id") != selector && selector != "*") {
                TweenMax.to($(this), .6, { css: { opacity: "0", left: originalDataPos[j].x, top: originalDataPos[j].y }, easing: Sine.easeOut, onComplete: onCompleteFunction, onCompleteParams: [i, container, $(this), true] });
            } else {
                var valLeft = originalDataPos[j].x;
                var valTop = originalDataPos[j].y;
                TweenMax.to($(this), .6, { css: { opacity: "1", left: valLeft, top: valTop }, easing: Sine.easeOut, onComplete: onCompleteFunction, onCompleteParams: [i, container, $(this), false] });
                j++;
            }
            i++;
        });
}

function getDirectionCSS($element, coordinates) {
    /** the width and height of the current div **/
    var w = $element.width(), h = $element.height(),
        /** calculate the x and y to get an angle to the center of the div from that x and y. **/ /** gets the x value relative to the center of the DIV and "normalize" it **/
        x = (coordinates.x - $element.offset().left - (w / 2)) * (w > h ? (h / w) : 1),
        y = (coordinates.y - $element.offset().top - (h / 2)) * (h > w ? (w / h) : 1),
        /** the angle and the direction from where the mouse came in/went out clockwise (TRBL=0123);**/
    		/** first calculate the angle of the point, add 180 deg to get rid of the negative values divide by 90 to get the quadrant
    		add 3 and do a modulo by 4  to shift the quadrants to a proper clockwise TRBL (top/right/bottom/left) **/
        direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4;
    var fromClass, toClass;
    switch (direction) {
        case 0:
            /* from top */
            fromClass = { instance: 'hover-slideFromTop', val1: "0px", val2: "-100%" };
            toClass = { instance: 'hover-slideTopLeft', val1: "0px", val2: "0px" };
            break;
        case 1:
            /* from right */
            fromClass = { instance: 'hover-slideFromRight', val1: "100%", val2: "0px" };
            toClass = { instance: 'hover-slideTopLeft', val1: "0px", val2: "0px" };
            break;
        case 2:
            /* from bottom */
            fromClass = { instance: 'hover-slideFromBottom', val1: "0px", val2: "100%" };
            toClass = { instance: 'hover-slideTopLeft', val1: "0px", val2: "0px" };
            break;
        case 3:
            /* from left */
            fromClass = { instance: 'hover-slideFromLeft', val1: "-100%", val2: "0px" };
            toClass = { instance: 'hover-slideTopLeft', val1: "0px", val2: "0px" };
            break;
    }
    
    return { from: fromClass, to: toClass };
}

function animateThumb(img) { TweenMax.to(img, 0.4, { css: { opacity: "1" }, easing: Sine.easeOut }); }

var initialColumns = 0;
var maxColumns = 4;

function checkColumnSize(adjustPreview) {
    var textPageInstanceHolder = $(txt_modCont);
    var textPageInstance = $("#module-columns", textPageInstanceHolder);
    var modulePositionType = textPageInstanceHolder.attr("data-id");
    var container = $("#module-columns-holder", textPageInstance);
    var marginRight = parseInt($("div:first", container).css("margin-right"), 10);
    var marginBottom = parseInt($("div:first", container).css("margin-bottom"), 10);
    var elementW = $("div:first", container).width();
    var thumbType = $("div:first", container).attr("class");
    var elementH = $("div:first", container).height();
    var visibleWidth = $("#module-container").width();
    var columns = Math.round(visibleWidth / (elementW + marginRight));

    if (textPageInstance.length <= 0) return;

    if (thumbType == "fourth-thumb-holder") {
        maxColumns = 4;
    }
    if (thumbType == "third-thumb-holder") {
        maxColumns = 3;
    }
    if (thumbType == "half-thumb-holder") {
        maxColumns = 2;
    }   

    if (columns > maxColumns) {
        columns = maxColumns;
    }

    initialColumns = columns;
    var prevMedia = $(".columns-preview-media");
    var prevDesc = $(".columns-preview-description");
    var thumbNewW = columns * (elementW + marginRight) - marginRight
    var newWidth = thumbNewW + parseInt($("#module-columns-container").css("margin-left"), 10) + parseInt($("#module-columns-container").css("margin-right"), 10);
    if (visibleWidth < newWidth) {
        if (columns > 1) columns--;
        else initialColumns--;
    } else if (visibleWidth > newWidth) {
        initialColumns--;
    }

    if (adjustPreview != undefined && adjustPreview == true) {
        var thumbNewW = columns * (elementW + marginRight) - marginRight
        var newWidth = thumbNewW + parseInt($("#module-columns-container").css("margin-left"), 10) + parseInt($("#module-columns-container").css("margin-right"), 10);
        

        if (thumbNewW < 768) {
            prevMedia.css("width", thumbNewW + "px");
            prevDesc.css("margin-left", "0px").css("width", "100%");
        } else {
            prevMedia.css("width", "");
            prevDesc.css("margin-left", "").css("width", "");
        }
        
        var elMargR = parseInt($("li:first", ".columns-preview-horizontal-fix ul").css("margin-right"), 10);
        $(".columns-preview-horizontal-fix ul").css("left", -(columnsPreviewIndex * (prevListW + elMargR)));
    }
    if (initialColumns != columns) {
        var lin = 0;
        var col = 0
        var newH = 0;
        var count = 0;
        var total = container.children().length;
        container.children().each(
            function () {
                if (col < columns) {
                    var topVal = lin * (elementH + marginBottom);
                    var leftVal = col * (elementW + marginRight);
                    $(this).css("position", "absolute").css("left", leftVal + "px").css("top", topVal + "px");
                    col++;
                } else {
                    col = 0;
                    lin++;
                    var topVal = lin * (elementH + marginBottom);
                    var leftVal = col * (elementH + marginRight);
                    $(this).css("position", "absolute").css("left", leftVal + "px").css("top", topVal + "px");
                    col++;
                }
                $(this).css("opacity", "1");
                if (count == total - 1) {
                    newH = parseInt($(this).css("top"), 10) + $(this).height();
                }
                count++;
            }
        );
        $originalDataPos = getOriginalPos(container);
        var thumbNewW = columns * (elementW + marginRight) - marginRight
        var newWidth = thumbNewW + parseInt($("#module-columns-container").css("margin-left"), 10) + parseInt($("#module-columns-container").css("margin-right"), 10);

        $("#module-columns").css("width", newWidth + "px");
        $("#module-columns-container").css("width", thumbNewW + "px");
        container.css("height", newH + "px");
        container.css("width", thumbNewW + "px");
        
        if (thumbNewW < 768) {
            prevMedia.css("width", thumbNewW + "px");
            prevDesc.css("margin-left", "0px").css("width", "100%");
        } else {
            prevMedia.css("width", "");
            prevDesc.css("margin-left", "").css("width", "");
        }
    }

}

function animateColPreviewMedia(src) {
    var inst = $(src);
    var parent = $(src).parent();
    if (touchDevice == 0) {
        TweenMax.to($(src).parent(), .3, { css: { height: inst.height() }, easing: Sine.easeOut });
    } else {
        parent.css("height", inst.height());
    }
    previewAnimDone = true;
    TweenMax.to(inst, .5, { css: { opacity: '1' }, easing: Sine.easeOut, delay: 0.1, onComplete: moduleUpdate_page_columns });

}
