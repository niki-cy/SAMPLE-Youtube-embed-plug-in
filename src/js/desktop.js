(function(PLUGIN_ID) {
    'use strict';
    // Record details event
    kintone.events.on('app.record.detail.show', function(event) {

        var body = {
            "app": kintone.app.getId(),
            "id": kintone.app.record.getId()
        };

        kintone.api(kintone.api.url('/k/v1/record', true), 'GET', body, function(resp){
            var config = kintone.plugin.app.getConfig(PLUGIN_ID); // Get plug-in setting configuration
            var VIDEO_LINK = config.select_link_field;
            var VIDEO_WIDTH = config.insert_width;
            var VIDEO_HEIGHT = config.insert_height;
            var VIDEO_BLANK_SPACE = config.select_space_field;

            var fullUrl = resp.record[VIDEO_LINK].value;
            if (fullUrl.slice(0,32) === 'https://www.youtube.com/watch?v=') {
                var videoId = fullUrl.slice(32);
            } else if (fullUrl.slice(0,17) === 'https://youtu.be/') {
                var videoId = fullUrl.slice(17);
            } else {
                alert('The Youtube URL could not be read.\nInsert the URL either as https://www.youtube.com/watch?v=OOOOOOOOOOO\nor https://youtu.be/OOOOOOOOOOO.')
            }

            // Create iFrame HTML element
            var ytiframe = document.createElement('iframe');
            ytiframe.setAttribute('width', VIDEO_WIDTH);
            ytiframe.setAttribute('height', VIDEO_HEIGHT);
            ytiframe.setAttribute('src', 'https://www.youtube.com/embed/' + videoId);
            ytiframe.setAttribute('frameborder', '0');
            ytiframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
            ytiframe.setAttribute('allowfullscreen', 'allowfullscreen');

            kintone.app.record.getSpaceElement(VIDEO_BLANK_SPACE).appendChild(ytiframe);

        }, function(error) {
            console.log(error);
        });
    });
})(kintone.$PLUGIN_ID);
