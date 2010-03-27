$.fn.selectRange = function(start, end) {
        return this.each(function() {
            if(this.setSelectionRange) {
                this.focus();
                this.setSelectionRange(start, end);
            } else if(this.createTextRange) {
                var range = this.createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', start);
                range.select();
            }
        }
    );
};


function load_track_bars(track) {
    $("#track").html(track);
    $.ajax({
        async:   false,
        type: "GET",
        url: "ls",
        data: "dir=/Users/dan/code/ruby/pick_n_mixer/public/music",
        success: function(dirs){
            var folders = eval('(' + dirs + ')');
            for (var i = 0; i < folders.length; i++ ) {
                json = folders[i].split("-")
                jsonName = json[0];
                bpm = json[1];
                trackElement = "#track" + $("#track").html();
                
                filePath = $(trackElement, document).val().split("/");
                aName = filePath[filePath.length-1].split(".")[0];
                $("#song").html(aName);
                
//                    $("#container-" + $("#track").html()).html(
//                        '<h2>' + $("#song").html() + '</h2><div>Preview tempo: ' + bpm + '</div>'
//                    );
                        
                if (aName == jsonName) {
                    $.ajax({
                        async:   false,
                        type: "GET",
                        url: "ls",
                        data: "sort=yes&dir=/Users/dan/code/ruby/pick_n_mixer/public/music/" + $("#song").html() + "-" + $("#bpm").val() + "/",
                        success: function(msg){
                            var bars = eval('(' + msg + ')');
                            barsHtml = '<div id="' + $("#track").html() + '"><h2>' + $("#song").html() + '</h2>';
                            for (var b = 0; b < 30; b++) {
                                bar = bars[b].split("-")[1].split(".")[0];
                                mp3Filler = $("#song").html() + '-' + $("#bpm").val() + '/b-' + bar;
                                
                                bar_id = $("#track").html() + "-" + bar
                                barsHtml += '<div id="' + bar_id + '" class="bar add-button"><object id="mix-play" width="25" height="20" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"><param value="singlemp3player.swf?showDownload=true&amp;file=music/' + mp3Filler + '.mp3&amp;autoStart=false&amp;backColor=&amp;frontColor=ffffff&amp;repeatPlay=no&amp;songVolume=50" name="movie"/><param value="transparent" name="wmode"/><embed width="25" height="20" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" src="singlemp3player.swf?showDownload=true&amp;file=music/' + mp3Filler + '.mp3&amp;autoStart=false&amp;backColor=&amp;frontColor=ffffff&amp;repeatPlay=no&amp;songVolume=50" wmode="transparent"/></object>' + bar_id + '</div>';
                            }
                            barsHtml += "</div>";
                            contents = $("#container-" + $("#track").html(), document).html(barsHtml);
                        }
                    }, document);                    
                }
            }
        },
        error: function(msg){
            alert("beatmatch bars for " + msg);
        }
        
    });    
}

function activate_add_buttons() {
    $(".add-button").click(function(event) {
        data = $("#data");
        old_data = data.val();
        new_data = data.val();

        add_this = old_data;
        if (data.val()) {
            add_this += ",";
        }
        add_this += $(this).attr("id");
        data.val(add_this);

        data.focus().val(data.val());      
    });
}

$(document).ready(function () {
    $("#mix-play").hide();

    load_track_bars("a");
    load_track_bars("b");
    load_track_bars("c");
    activate_add_buttons();
    

//    activate_add_buttons();

    $("#render-button").click(function(event) {
        dataString = "bpm=" + $("#bpm").val() + "&tracka=" + $("#tracka").val() + "&trackb=" + $("#trackb").val()  + "&trackc=" + $("#trackc").val() + "&data=" + $("#data").val().replace(/-/g, ":");
        $("#mix-play").hide();
        $("#mix-play object").remove();
        
        $.ajax({
            type: "GET",
            url: "mix",
            data: dataString,
            success: function(msg){
                $("#mix-play").html('<object id="mix-play" width="150" height="20" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"><param value="singlemp3player.swf?showDownload=true&amp;file=music/mix-' + msg + '.mp3&amp;autoStart=true&amp;backColor=&amp;frontColor=ffffff&amp;repeatPlay=no&amp;songVolume=50" name="movie"/><param value="transparent" name="wmode"/><embed width="150" height="20" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" src="singlemp3player.swf?showDownload=true&amp;file=music/mix-' + msg + '.mp3&amp;autoStart=true&amp;backColor=&amp;frontColor=ffffff&amp;repeatPlay=no&amp;songVolume=50" wmode="transparent"/></object>');
                $("#mix-play").show();
            }
        });
    });
});
