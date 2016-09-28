/******************************************************************************

Copyright (c) 2016, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

******************************************************************************/

(function () {
    if (typeof window['CKEDITOR'] === 'undefined') {
        return;
    }

    CKEDITOR.plugins.add('highcharts', {
        init: function (editor) {

            var modal = highed.ModalEditor(false, {
                    features: 'import templates customize welcome',
                    allowDone: true
                }, function (html) {
                   editor.insertHtml('<div contenteditable="false">' + html + '</div><p></p>');                
                })
            ;        

            editor.addCommand('insertHighcharts', {               
                allowedContent: 'script[type,src];div[id,style]a[*];altGlyph[*];altGlyphDef[*];altGlyphItem[*];animate[*];animateColor[*];animateMotion[*];animateTransform[*];circle[*];clipPath[*];color-profile[*];cursor[*];defs[*];desc[*];ellipse[*];feBlend[*];feColorMatrix[*];feComponentTransfer[*];feComposite[*];feConvolveMatrix[*];feDiffuseLighting[*];feDisplacementMap[*];feDistantLight[*];feFlood[*];feFuncA[*];feFuncB[*];feFuncG[*];feFuncR[*];feGaussianBlur[*];feImage[*];feMerge[*];feMergeNode[*];feMorphology[*];feOffset[*];fePointLight[*];feSpecularLighting[*];feSpotLight[*];feTile[*];feTurbulence[*];filter[*];font[*];font-face[*];font-face-format[*];font-face-name[*];font-face-src[*];font-face-uri[*];foreignObject[*];g[*];glyph[*];glyphRef[*];hkern[*];image[*];line[*];linearGradient[*];marker[*];mask[*];metadata[*];missing-glyph[*];mpath[*];path[*];pattern[*];polygon[*];polyline[*];radialGradient[*];rect[*];script[*];set[*];stop[*];style[*];svg[*];switch[*];symbol[*];text[*];textPath[*];title[*];tref[*];tspan[*];use[*];view[*];vkern[*]',
                requiredContent: 'div[id,style]a[*];altGlyph[*];altGlyphDef[*];altGlyphItem[*];animate[*];animateColor[*];animateMotion[*];animateTransform[*];circle[*];clipPath[*];color-profile[*];cursor[*];defs[*];desc[*];ellipse[*];feBlend[*];feColorMatrix[*];feComponentTransfer[*];feComposite[*];feConvolveMatrix[*];feDiffuseLighting[*];feDisplacementMap[*];feDistantLight[*];feFlood[*];feFuncA[*];feFuncB[*];feFuncG[*];feFuncR[*];feGaussianBlur[*];feImage[*];feMerge[*];feMergeNode[*];feMorphology[*];feOffset[*];fePointLight[*];feSpecularLighting[*];feSpotLight[*];feTile[*];feTurbulence[*];filter[*];font[*];font-face[*];font-face-format[*];font-face-name[*];font-face-src[*];font-face-uri[*];foreignObject[*];g[*];glyph[*];glyphRef[*];hkern[*];image[*];line[*];linearGradient[*];marker[*];mask[*];metadata[*];missing-glyph[*];mpath[*];path[*];pattern[*];polygon[*];polyline[*];radialGradient[*];rect[*];script[*];set[*];stop[*];style[*];svg[*];switch[*];symbol[*];text[*];textPath[*];title[*];tref[*];tspan[*];use[*];view[*];vkern[*]',
                exec: function (editor) {
                    modal.show();                    
                }
            });

            editor.ui.addButton('Highcharts', {
                label: 'Highcharts',
                command: 'insertHighcharts',
                icon: ''
            });
        }
    });
})();