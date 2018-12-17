jQuery.noConflict();

(function($, PLUGIN_ID) {
    'use strict';

    // Get configuration settings
    var config = kintone.plugin.app.getConfig(PLUGIN_ID);
    var $link = $('#select_link_field'); // Drop-down with ID 'select_link_field'
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

                if (field.type === 'LINK') {
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

    // Set saved width value
    if (config.insert_width) {
        $width.val(config.insert_width);
    };    

    // Set saved height value
    if (config.insert_height) {
        $height.val(config.insert_height);
    };  

    // Run setting functions
    setLinkDropdown();

    // Go back a page when cancel button is clicked
    $('#settings-cancel').click(function() {
        history.back();
    });

    // Set input values when save button is clicked
    $('#settings-save').click(function(e) {
        e.preventDefault();
        kintone.plugin.app.setConfig({select_link_field: $link.val(), insert_width: $width.val(), insert_height: $height.val()}, function() {
            // Redirect to App Settings
            alert('Plug-in settings have been saved. Please update the app!');
            window.location.href = getSettingsUrl();
        });
    });
})(jQuery, kintone.$PLUGIN_ID);
