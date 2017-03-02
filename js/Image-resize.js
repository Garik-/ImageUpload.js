'use strict';

/*
 * Измененный https://github.com/Garik-/ImageUpload.js
 *
 * Copyright 2017, Gar|k
 * http://c0dedgarik.blogspot.ru/
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/**
 * @param {File} file 
 * @param {Object} settings
 * @return {Promise}  <File>file with support file.toDataURL(), <Event>error
 */
export default function resize(file, settings) {

    if (!(
            'FileReader' in window &&
            'File' in window &&
            'Image' in window))
    {
        throw new Error('Not support features');
    }

    function extend() {
        for (var i = 1; i < arguments.length; i++)
            for (var key in arguments[i])
                if (arguments[i].hasOwnProperty(key))
                    arguments[0][key] = arguments[i][key];
        return arguments[0];
    }

    function dataURItoByte(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return ia;
    }

    var defaults = {
        maxWidth: 1920,
        maxHeight: 1080
    }, options = extend({}, defaults, settings), newFile = file, dataURL;


    return new Promise(function (resolve, reject) {

        var img = new Image(),
                reader = new FileReader();

        img.onerror = reject;
        reader.onerror = reject;

        img.onload = function () {

            if (img.width == 0 || img.height == 0)
                return false;

            var width = img.width,
                    height = img.height,
                    change = false;

            if (width > height) {
                if (width > options.maxWidth) {
                    height *= options.maxWidth / width;
                    width = options.maxWidth;
                    change = true;
                }
            } else {
                if (height > options.maxHeight) {
                    width *= options.maxHeight / height;
                    height = options.maxHeight;
                    change = true;
                }
            }

            if (change) {
                var canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                dataURL = canvas.toDataURL(file.type);
                newFile = new File([dataURItoByte(dataURL)], file.name, {type: file.type, lastModified: file.lastModified});
            }

            // Добавляем стандартному объекту File метод toDataURL
            Object.defineProperty(newFile, 'toDataURL', {
                value: function () {
                    return dataURL;
                },
                enumerable: false
            });

            resolve(newFile);
        }

        reader.onload = function(e) {
            img.src = dataURL = e.target.result;
        }

        reader.readAsDataURL(file);
    });
};
