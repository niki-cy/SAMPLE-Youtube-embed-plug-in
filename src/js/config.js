jQuery.noConflict();

(function($, PLUGIN_ID) {
    'use strict';

    // Get configuration settings
    var config = kintone.plugin.app.getConfig(PLUGIN_ID);
    var $link = $('#select_link_field'); // Drop-down with ID 'select_link_field'
    var $space = $('#select_space_field'); // Drop-down with ID 'select_space_field'
    var $width = $('#insert_width'); // Drop-down with ID 'select_link_field'
    var $height = $('#insert_height'); // Drop-down with ID 'select_link_field'
    var appId = kintone.app.getId(); // Variable with the App ID

    // Retrieve URL to App Settings page
    function getSettingsUrl() {
        return '/k/admin/app/flow?app=' + appId;
    };

    // Set body for API requests
    var body = { 
        "app": appId
    };

    // Retrieve Link field information, then set drop-down
    function setLinkDropdown() {

        return kintone.api(kintone.api.url('/k/v1/preview/app/form/fields', true), 'GET', body, function(resp) {
        // Success
            var props = resp.properties;

            for (var linkField in props) {
                var field = props[linkField];

                // Allow both Link fields set as URL and Text fields
                if (field.protocol === 'WEB' || field.type === 'SINGLE_LINE_TEXT') {
                    var $optionLink = $('<option>');
                    $optionLink.attr('value', field.code);
                    $optionLink.text(field.label);
                    $link.append($optionLink);
                };
            };
            
            if (config.select_link_field) {
                $link.val(config.select_link_field);
            };
            
        }, function(error) {
            // Error
            console.log(error);
            alert('There was an error retrieving the Link field information.');
        });
    };

    // Retrieve Blank Space field information, then set drop-down
    function setSpaceDropdown() {

        return kintone.api(kintone.api.url('/k/v1/preview/app/form/layout', true), 'GET', body, function(resp) {
        // Success
            for (var i = 0; i < resp.layout.length; i++) {
                var rowFields = resp.layout[i].fields;

                for (var j = 0; j < rowFields.length; j++) {
                    var fieldType = rowFields[j].type;
                    if (fieldType === 'SPACER') {
                        var spaceId = rowFields[j].elementId;
                        var $optionSpace = $('<option>');
                        $optionSpace.attr('value', spaceId);
                        $optionSpace.text(spaceId);
                        $space.append($optionSpace);
                    }
                };

                if (config.select_space_field) {
                    $space.val(config.select_space_field);
                };
            };
            
        }, function(error) {
            // Error
            console.log(error);
            alert('There was an error retrieving the Blank Space field information.');
        });
    };

    // Set saved width and height values
    if (config.insert_width) {
        $width.val(config.insert_width);
    };    
    
    if (config.insert_height) {
        $height.val(config.insert_height);
    };  

    // Run setting functions
    setLinkDropdown();
    setSpaceDropdown();

    // Go back a page when cancel button is clicked
    $('#settings-cancel').click(function() {
        history.back();
    });

    // Set input values when save button is clicked
    $('#settings-save').click(function(e) {
        e.preventDefault();
        kintone.plugin.app.setConfig({select_link_field: $link.val(), select_space_field: $space.val(), insert_width: $width.val(), insert_height: $height.val()}, function() {
            // Redirect to App Settings
            alert('Plug-in settings have been saved. Please update the app!');
            window.location.href = getSettingsUrl();
        });
    });
})(jQuery, kintone.$PLUGIN_ID);
