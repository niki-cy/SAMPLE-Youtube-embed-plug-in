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

  // Set body for API requests
  var body = {
    'app': appId
  };

  // Retrieve URL to App Settings page
  function getSettingsUrl() {
    return '/k/admin/app/flow?app=' + appId;
  }

  // Retrieve Link field information, then set drop-down
  function setLinkDropdown() {

    return kintone.api(kintone.api.url('/k/v1/preview/app/form/fields', true), 'GET', body, function(resp) {
      // Success
      var props = resp.properties;
      var field;
      var linkField;
      var $optionLink;

      for (linkField in props) {
        if (props.hasOwnProperty(linkField)) {
          field = props[linkField];
          // Allow both Link fields set as URL and Text fields
          if (field.protocol === 'WEB' || field.type === 'SINGLE_LINE_TEXT') {
            $optionLink = $('<option>');
            $optionLink.attr('value', field.code);
            $optionLink.text(field.label);
            $link.append($optionLink);
          }
        }
      }

      if (config.select_link_field) {
        $link.val(config.select_link_field);
      }

    }, function(error) {
      // Error
      alert('There was an error retrieving the Link field information.');
    });
  }

  // Retrieve Blank Space field information, then set drop-down
  function setSpaceDropdown() {

    return kintone.api(kintone.api.url('/k/v1/preview/app/form/layout', true), 'GET', body, function(resp) {
      // Success
      var i;
      var j;
      var rowFields;
      var fieldType;
      var spaceId;
      var $optionSpace;

      for (i = 0; i < resp.layout.length; i++) {
        rowFields = resp.layout[i].fields;

        for (j = 0; j < rowFields.length; j++) {
          fieldType = rowFields[j].type;
          if (fieldType === 'SPACER') {
            spaceId = rowFields[j].elementId;
            $optionSpace = $('<option>');
            $optionSpace.attr('value', spaceId);
            $optionSpace.text(spaceId);
            $space.append($optionSpace);
          }
        }

        if (config.select_space_field) {
          $space.val(config.select_space_field);
        }
      }

    }, function(error) {
      // Error
      alert('There was an error retrieving the Blank Space field information.');
    });
  }

  // Set saved width and height values
  if (config.insert_width) {
    $width.val(config.insert_width);
  }

  if (config.insert_height) {
    $height.val(config.insert_height);
  }

  // Run setting functions
  setLinkDropdown();
  setSpaceDropdown();

  // Go back a page when cancel button is clicked
  $('#settings-cancel').click(function() {
    history.back();
  });

  // Set input values when save button is clicked
  $('#settings-save').click(function(e) {
    var configSettings = {select_link_field: $link.val(), select_space_field: $space.val(), insert_width: $width.val(), insert_height: $height.val()};
    var widthNum = Number($width.val());
    var heightNum = Number($height.val());
    var maxDimension = 99999;
    e.preventDefault();

    if ($link.val() === 'not selected' || $space.val() === 'not selected') {
      // Check required fields are all filled
      alert('Please fill in all required fields.');
    } else if (!Number.isInteger(widthNum) || !Number.isInteger(heightNum) || widthNum > maxDimension || heightNum > maxDimension) {
      // Check that width and height are full numbers less than 5000
      alert('Please enter width and height as full numbers less than 99999px');
    } else {
      kintone.plugin.app.setConfig(configSettings, function() {
        // Redirect to App Settings
        alert('Plug-in settings have been saved. Please update the app!');
        window.location.href = getSettingsUrl();
      });
    }
  });
})(jQuery, kintone.$PLUGIN_ID);
