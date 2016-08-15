(function () {

    // output information
    function appendToResult(msg, result) {
        var m = document.getElementById(result);
        m.innerHTML = m.innerHTML + msg;
    }


    // file drag hover
    function fileDragHover(e) {
        e.stopPropagation();
        e.preventDefault();
        e.target.className = (e.type == "dragover" ? "hover" : "");
    }



    // output file information
    function parseFile(file, resultpane) {
        var res = "<p>File name: <strong>" + file.name + "</strong><br> type: <strong>" + file.type + "</strong><br> size: <strong>" + file.size + "</strong> bytes</p>";
        appendToResult(res, resultpane);

        // display an image
        if (file.type.indexOf("image") == 0) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var resimg = "<p><strong>" + file.name + ":</strong><br />" + '<img src="' + e.target.result + '" /></p>';
                appendToResult(resimg, resultpane);
            }
            reader.readAsDataURL(file);
        }

        // display text
        if (file.type.indexOf("text") == 0) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var restxt = "<p><strong>File content:</strong></p><pre>" + e.target.result.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</pre>";
                appendToResult(restxt, resultpane);
            }
            reader.readAsText(file);
        }

    }

    // file selection
    function fileSelectHandler(e, result) {

        // cancel event and hover styling
        fileDragHover(e);

        // fetch FileList object
        var files = e.target.files || e.dataTransfer.files;

        // process all File objects
        parseFile(files[0], result);

    }

    // initialize
    function init(select, drag, result) {

        var fileselect = document.getElementById(select);
        var filedrag = document.getElementById(drag);

        // file select
        fileselect.addEventListener("change", function (e) {
            fileSelectHandler(e, result)
        }, false);

        // is XHR2 available?
        var xhr = new XMLHttpRequest();
        if (xhr.upload) {

            // file drop
            filedrag.addEventListener("dragover", fileDragHover, false);
            filedrag.addEventListener("dragleave", fileDragHover, false);
            filedrag.addEventListener("drop", function (e) {
                fileSelectHandler(e, result)
            }, false);
            filedrag.style.display = "block";

        }

    }

    // call initialization file
    if (window.File && window.FileList && window.FileReader) {
        init("input-file-select", "input-file-drag", "input-file-content");
        init("output-file-select", "output-file-drag", "output-file-content");
    }

})();