# image-upload.js

## Description

Image Upload script with multiple file selection and validation for [Vanilla.js](http://vanilla-js.com/) framework.
Support client-side image resizing.

## Browsers

### Desktop browsers
The Image Upload script is regularly tested with the latest browser versions and supports the following minimal versions:

* Google Chrome
* Apple Safari 5.1+
* Mozilla Firefox 3.5+
* Microsoft Internet Explorer 10+
* Opera 12.1+

### Mobile browsers
The File Upload plugin has been tested with and supports the following mobile browsers:

* Apple Safari on iOS 6.0+
* Google Chrome on iOS 6.0+
* Google Chrome on Android 4.0+
* Default Browser on Android 3+
* Opera Mobile 12.0+

## License
Released under the [MIT license](http://www.opensource.org/licenses/MIT).

# ImageUpload.js

## Описание

Это вспомогательный класс на основе image-upload.js, написан по стандартам ES-2015

### Пример использования
```js
'use strict';
import resize from 'image-resize';

let data = new FormData(),
    input = document.querySelector(".upload"),
    previews = document.querySelector(".previews");

input.onchange = event => {
    let files = event.files;
    files.forEach(file => {

        resize(file, {
            maxWidth: 500,
            maxHeight: 500
        }).then(img => {
            let preview = document.createElement("img");
            preview.src = img.toDataURL();
            previews.appendChild(preview);

            data.append('images[]', img);
        }, error => {
            console.error(error);
        });

    });
};
                  
```
