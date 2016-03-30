/*
 * Image Upload script
 * https://github.com/Garik-/ImageUpload.js
 *
 * Copyright 2016, Gar|k
 * http://c0dedgarik.blogspot.ru/
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

function ImageUpload(form, settings) {

	if(!(
		'FormData' in window &&
		'FileReader' in window &&
		'Blob' in window &&
		'XMLHttpRequest' in window &&
		'Image' in window))
	{
		alert('Not support features');
		return false;
	}

    var defaults = {
            fileTypes: /^image\/(gif|jpeg|png|svg\+xml)$/,
            maxFileSize: 10000000, // 10MB,
            imageMaxWidth: 1920,
            imageMaxHeight: 1080,
            disableImageResize: false,
        },
        data,
        options = extend({}, defaults, settings);

    function Data(input) {
        var name = input.name,
            length = 0,
            maxLength = input.files.length,
            formData = new FormData();

        if (maxLength > 1) {
            name += "[]";
        }

        this.append = function(file) {
            formData.append(name, file, file.name);
            ++length;
        }

        this.full = function() {
            return maxLength > 0 && length === maxLength;
        }

        this.get = function() {
            return formData;
        }

        this.errorFile = function() {
            --maxLength;
        }

    }

    function extend() {
        for (var i = 1; i < arguments.length; i++)
            for (var key in arguments[i])
                if (arguments[i].hasOwnProperty(key))
                    arguments[0][key] = arguments[i][key];
        return arguments[0];
    }

    function dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {
            type: mimeString
        });
    }

    function checkExtensions(file) {

        if (options.fileTypes &&
            !options.fileTypes.test(file.type)) {

            alert("Sorry, " + file.name + " is invalid, allowed extensions");
            return false;
        }

        return true;
    }

    function checkMaxSize(file) {

        if (typeof options.maxFileSize === 'number' &&
            file.size > options.maxFileSize) {
            alert("The file " + file.name + " must be less than " + (options.maxFileSize / 1024 / 1024) + "MB");
            return false;
        }

        return true;
    }

    function upload(file) {

        data.append(file);

        if (data.full()) { // start upload

            xhr = new XMLHttpRequest();

            xhr.open('POST', form.action, true);
            xhr.onload = function(e) { 
            	if (this.status == 200) {
      				alert(this.responseText);
    			}
             };

            xhr.send(data.get()); // multipart/form-data
        }

    }

    function processImage(file) {

        var img = new Image(),
            reader = new FileReader();

        img.onload = function() {

            if (img.width == 0 || img.height == 0)
                return false;

            var width = img.width,
                height = img.height,
                change = false,
                newFile = file;


            if (width > height) {
                if (width > options.imageMaxWidth) {
                    height *= options.imageMaxWidth / width;
                    width = options.imageMaxWidth;
                    change = true;
                }
            } else {
                if (height > options.imageMaxHeight) {
                    width *= options.imageMaxHeight / height;
                    height = options.imageMaxHeight;
                    change = true;
                }
            }

            if (change) {
                var canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);


                var dataURL = canvas.toDataURL(file.type),
                    newFile = dataURItoBlob(dataURL);
                newFile.lastModifiedDate = file.lastModifiedDate;
                newFile.name = file.name;
            }

            upload(newFile);
        }

        reader.onload = function(e) { img.src = e.target.result; }
        reader.readAsDataURL(file);
    }



    form.onsubmit = function() {
        var inputs = form.querySelectorAll("input[type='file']");

        for (var i = 0; i < inputs.length; i++) {

            data = new Data(inputs[i]);

            for (var j = 0; j < inputs[i].files.length; j++) {

                var file = inputs[i].files[j];

                if(checkExtensions(file) && checkMaxSize(file)) {
                    if (options.disableImageResize) {
                        upload(file);
                    } else {
                        processImage(file);
                    }
                } else {
                    data.errorFile();
                }
            }

        }

        return false;
    };
}
