//Title: Custom DropDown plugin by PC
//Documentation: http://designwithpc.com/Plugins/ddslick
//Author: PC 
//Website: http://designwithpc.com
//Twitter: http://twitter.com/chaudharyp

(function ($) {

    $.fn.ddslick = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exists.');
        }
    };

    //Public methods available to plugin. So far we only have one method 'Init' and that's default as well.
    var methods = {
        
        //#region Public Methods
        init: function (options) {

            //Set defauls for the control
            var defaults = {
                data: [],
                width: 260,
                height: null,
                background: "#eee",
                selectText: "",
                defaultSelectedIndex: null,
                truncateDescription: true,
                imagePosition: "left",
                showSelectedHTML: true,
                clickOffToClose: true,
                onSelected: function () { }
            };
            //Update unset options with defaults if needed
            var options = $.extend(defaults, options);

            //CSS for DD Cool. Change per your need, and move these styles to your stylesheet (recommended).
            if ($('#css-ddslick').length <= 0) {
                var ddslickCSS = '<style id="css-ddslick" type="text/css">' +
                                        '.dd-select{ border-radius:2px; border:solid 1px #ccc; position:relative; cursor:pointer;}' +
                                        '.dd-desc { color:#aaa; display:block; overflow: hidden; font-weight:normal; line-height: 1.4em; }' +
                                        '.dd-selected{ overflow:hidden; display:block; padding:10px; font-weight:bold;}' +
                                        '.dd-pointer{ width:0; height:0; position:absolute; right:10px; top:50%; margin-top:-3px;}' +
                                        '.dd-pointer-down{ border:solid 5px transparent; border-top:solid 5px #000; }' +
                                        '.dd-pointer-up{border:solid 5px transparent !important; border-bottom:solid 5px #000 !important; margin-top:-8px;}' +
                                        '.dd-options{ border:solid 1px #ccc; border-top:none; list-style:none; box-shadow:0px 1px 5px #ddd; display:none; position:absolute; z-index:2000; margin:0; padding:0;background:#fff; overflow:auto;}' +
                                        '.dd-option{ padding:10px; display:block; border-bottom:solid 1px #ddd; overflow:hidden; text-decoration:none; color:#333; cursor:pointer;-webkit-transition: all 0.25s ease-in-out; -moz-transition: all 0.25s ease-in-out;-o-transition: all 0.25s ease-in-out;-ms-transition: all 0.25s ease-in-out; }' +
                                        '.dd-options > li:last-child > .dd-option{ border-bottom:none;}' +
                                        '.dd-option:hover{ background:#f3f3f3; color:#000;}' +
                                        '.dd-selected-description-truncated { text-overflow: ellipsis; white-space:nowrap; }' +
                                        '.dd-option-selected { background:#f6f6f6; }' +
                                        '.dd-option-image, .dd-selected-image { vertical-align:middle; float:left; margin-right:5px; max-width:64px;}' +
                                        '.dd-image-right { float:right; margin-right:15px; margin-left:5px;}' +
                                        '.dd-container{ position:relative;}​ .dd-selected-text { font-weight:bold}​</style>';
                $(ddslickCSS).appendTo('head');
            }

            //Executing functionality on all selected elements
            return this.each(function () {

                var obj = $(this);
                var data = obj.data('ddslick');

                //If the plugin has not been initialized yet
                if (!data) {

                    var ddSelectHtml = '<div class="dd-select">' +
                                            '<input class="dd-selected-value" type="hidden" value="" />' +
                                            '<a class="dd-selected"></a>' +
                                            '<span class="dd-pointer dd-pointer-down"></span>' +
                                        '</div>';

                    //Add classes and append ddselect to the container
                    obj.addClass('dd-container').append(ddSelectHtml).append('<ul class="dd-options"></ul>');

                    //Get newly created ddOptions and ddSelect to manipulate
                    var ddSelect = obj.find('.dd-select');
                    var ddOptions = obj.find('.dd-options');

                    //Set widths
                    ddOptions.css({ width: options.width });
                    ddSelect.css({ width: options.width, background: options.background });
                    obj.css({ width: options.width });

                    if (options.height != null) {
                        ddOptions.css({ height: options.height, overflow: 'auto' });
                    }


                    //Add ddOptions to the container. Replace with template engine later.
                    $.each(options.data, function (index, item) {

                        var htmlToAppend = '<li>' +
                                        '<a class="dd-option">' +
                                            (item.value ? ' <input class="dd-option-value" type="hidden" value="' + item.value + '" />' : '') +
                                            (item.imageSrc ? ' <img class="dd-option-image' + (options.imagePosition == "right" ? ' dd-image-right' : '') + '" src="' + item.imageSrc + '" />' : '') +
                                            (item.text ? ' <label class="dd-option-text">' + item.text + '</label>' : '') +
                                            (item.description ? ' <small class="dd-option-description dd-desc">' + item.description + '</small>' : '') +
                                        '</a>' +
                                       '</li>';
                        ddOptions.append(htmlToAppend);
                    });

                    //Check if needs to show the select text
                    var showSelection = false;
                    if (options.selectText.length > 0 && options.defaultSelectedIndex == null) {
                        obj.find('.dd-selected').html(options.selectText);
                    } else {
                        showSelection = true;
                    }

                    //show default selected option if no select text was provided, or if defaultSelectedIndex is passed, this will be preferred.
                    if (showSelection) {
                        var index = (options.defaultSelectedIndex != null && options.defaultSelectedIndex >= 0 && options.defaultSelectedIndex < options.data.length) ? options.defaultSelectedIndex : 0;
                        var pluginData = {};
                        pluginData.selectedIndex = index;
                        pluginData.selectedItem = obj.find('.dd-option').eq(index).closest('li');
                        pluginData.selectedData = options.data[index];
                        setSelection(obj, options, pluginData.selectedData);
                    } else {
                        //Setup default data for no selection
                        var pluginData = {};
                        pluginData.selectedIndex = -1;
                        pluginData.selectedItem = null;
                        pluginData.selectedData = null;
                    }

                    pluginData.settings = options;
                    obj.data('ddslick', pluginData);

                    //Displaying options
                    obj.find('.dd-select').on('click', function () {
                        var $this = $(this);
                        var ddOptions = $this.siblings('.dd-options');
                        var wasOpen = ddOptions.is(':visible');

                        //Toggle dropdown options
                        $('.dd-click-off-close').not(ddOptions).slideUp(50);
                        $('.dd-pointer').removeClass('dd-pointer-up');

                        if (wasOpen) {
                            ddOptions.slideUp('fast');
                            $this.find('.dd-pointer').removeClass('dd-pointer-up');
                        }
                        else {
                            ddOptions.slideDown('fast');
                            $this.find('.dd-pointer').addClass('dd-pointer-up');
                        }

                        //Fix text height (i.e. display title in center), if there is no description
                        adjustOptionsHeight();
                    });

                    //Selecting an option
                    obj.find('.dd-option').on('click', function () {
                        var $this = $(this);

                        //Highlight selected option
                        $('.dd-option').removeClass('dd-option-selected');
                        $this.addClass('dd-option-selected');

                        var ddSelected = obj.find('.dd-selected');
                        var parentLi = $this.closest('li');
                        var liIndex = parentLi.index();

                        //Get selected data
                        var pluginData = {}
                        pluginData.selectedIndex = liIndex;
                        pluginData.selectedItem = parentLi;
                        pluginData.selectedData = options.data[liIndex];
                        pluginData.settings = options;
                        obj.data('ddslick', pluginData);

                        //Update the selected text/html                
                        setSelection(obj, options, pluginData.selectedData);

                        //Updating selected option value
                        ddSelected.siblings('.dd-selected-value').val(pluginData.selectedData.value);

                        //Toggle pointer direction
                        var pointer = ddSelected.siblings('.dd-pointer').toggleClass('dd-pointer-up');

                        //Close drop down
                        $this.closest('.dd-options').slideToggle(50);

                        //Adjust the selected text line height/positioning in middle
                        adjustSelectedHeight();

                        //Callback function on selection
                        if (typeof options.onSelected == 'function') {
                            options.onSelected.call(this, pluginData);
                        }
                    });

                    //Click anywhere to close
                    if (options.clickOffToClose) {
                        ddOptions.addClass('dd-click-off-close');
                        obj.on('click', function (e) { e.stopPropagation(); });
                        $('body').on('click', function () { $('.dd-click-off-close').slideUp(50); });
                    }
                }

                //Private: Adjust appearence for drop down options (move title to middle), when no desripction
                function adjustOptionsHeight() {

                    obj.find('.dd-option').each(function () {
                        var $this = $(this);
                        var lOHeight = $this.css('height');
                        var descriptionOption = $this.find('.dd-option-description');
                        var imgOption = obj.find('.dd-option-image');
                        if (descriptionOption.length <= 0 && imgOption.length > 0) {
                            $this.find('.dd-option-text').css('lineHeight', lOHeight);
                        }
                    });
                }

                //Private: Adjust appearence for selected option (move title to middle), when no desripction
                function adjustSelectedHeight() {

                    //Get height of dd-selected
                    var lSHeight = obj.find('.dd-select').css('height');

                    //Check if there is selected description
                    var descriptionSelected = obj.find('.dd-selected-description');
                    var imgSelected = obj.find('.dd-selected-image');
                    if (descriptionSelected.length <= 0 && imgSelected.length > 0) {
                        obj.find('.dd-selected-text').css('lineHeight', lSHeight);
                    }
                }

            });

        },

        //Method to select an item with provided index.
        select: function (options) {
            return this.each(function () {
                var obj = $(this);
                if (options.index) {
                    var pluginData = obj.data('ddslick');
                    pluginData.selectedIndex = options.index;
                    pluginData.selectedItem = obj.find('.dd-option').eq(options.index).closest('li');
                    pluginData.selectedData = pluginData.settings.data[options.index];
                    pluginData.settings = pluginData.settings;
                    obj.data('ddslick', pluginData);

                    setSelection(obj, pluginData.settings, pluginData.selectedData);
                }
            });

        }
        //#endregion
    };

    //Private Class Methods
    function setSelection(obj, options, selectedData) {

        var ddSelected = obj.find('.dd-selected');
        if (options.showSelectedHTML) {
            ddSelected.html(
                    (selectedData.imageSrc ? '<img class="dd-selected-image' + (options.imagePosition == "right" ? ' dd-image-right' : '') + '" src="' + selectedData.imageSrc + '" />' : '') +
                    (selectedData.text ? '<label class="dd-selected-text">' + selectedData.text + '</label>' : '') +
                    (selectedData.description ? '<small class="dd-selected-description dd-desc' + (options.truncateDescription ? ' dd-selected-description-truncated' : '') + '" >' + selectedData.description + '</small>' : '')
                );

        } else {
            ddSelected.html(selectedData.text);
        }
    }

})(jQuery);
