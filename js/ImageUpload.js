'use strict';

/*
 * Измененный https://github.com/Garik-/ImageUpload.js
 * в соотвествии ES-2015
 *
 * Copyright 2017, Gar|k
 * http://c0dedgarik.blogspot.ru/
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

export default class ImageUpload {
    constructor(settings) {
        if (!(
                'FileReader' in window &&
                'File' in window &&
                'Image' in window))
        {
            throw new Error('Not support features');
        }

        function extend() {
            for (let i = 1; i < arguments.length; i++)
                for (let key in arguments[i])
                    if (arguments[i].hasOwnProperty(key))
                        arguments[0][key] = arguments[i][key];
            return arguments[0];
        }

        let defaults = {
            imageMaxWidth: 1920,
            imageMaxHeight: 1080,
            disableImageResize: false,
        };

        this.options = extend({}, defaults, settings);
        this.dataURL = null;
        this.file = null;
    }

    resize(file) {

        function dataURItoByte(dataURI) {
            // convert base64/URLEncoded data component to raw binary data held in a string
            let byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else
                byteString = unescape(dataURI.split(',')[1]);

            // separate out the mime component
            let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to a typed array
            let ia = new Uint8Array(byteString.length);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            
            return ia;
        }

        let self = this, options = this.options;

        return new Promise((resolve, reject) => {

            let img = new Image(),
                    reader = new FileReader();

            img.onerror = reject;
            reader.onerror = reject;

            img.onload = function () {

                if (img.width == 0 || img.height == 0)
                    return false;

                let width = img.width,
                        height = img.height,
                        change = false;

                self.file = file;


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
                    let canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;
                    let ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);


                    self.dataURL = canvas.toDataURL(file.type);
                    self.file = new File([dataURItoByte(self.dataURL)], file.name, {type: file.type, lastModified: file.lastModified});
                }

                resolve(self);
            }

            reader.onload = function (e) {
                self.dataURL = e.target.result;
                img.src = e.target.result;
            }

            reader.readAsDataURL(file);
        });
    }

    toDataURL() {
        return this.dataURL;
    }

}
