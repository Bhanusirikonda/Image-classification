Dropzone.autoDiscover = false;

function init() {
    let dz = new Dropzone("#dropzone", {
        url: "http://127.0.0.1:5000/classify_image",
        maxFiles: 1,
        addRemoveLinks: true,
        dictDefaultMessage: "Drop image to classify",
        autoProcessQueue: false
    });

    dz.on("addedfile", function () {
        if (dz.files[1] != null) {
            dz.removeFile(dz.files[0]);
        }
    });

    dz.on("complete", function (file) {
        let imageData = file.dataURL;
        let url = "http://127.0.0.1:5000/classify_image";  // Correct port

        $.post(url, {
            image_data: imageData
        }, function (data, status) {
            if (!data || data.length === 0) {
                $("#resultHolder").hide();
                $("#divClassTable").hide();
                $("#error").show();
                return;
            }

            let players = ["virat", "rohit", "bumrah", "hardik", "sachin"];
            let match = null;
            let bestScore = -1;

            data.forEach(result => {
                let maxScore = Math.max(...result.class_probability);
                if (maxScore > bestScore) {
                    match = result;
                    bestScore = maxScore;
                }
            });

            if (match) {
                $("#error").hide();
                $("#resultHolder").show();
                $("#divClassTable").show();
                $("#resultHolder").html($(`[data-player="${match.class}"]`).html());

                for (let name in match.class_dictionary) {
                    let index = match.class_dictionary[name];
                    $(`#score_${name}`).html(match.class_probability[index]);
                }
            }
        });
    });

    $("#submitBtn").on('click', function () {
        dz.processQueue();
    });
}

$(document).ready(function () {
    $("#error").hide();
    $("#resultHolder").hide();
    $("#divClassTable").hide();
    init();
});
