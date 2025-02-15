---
sidebar_position: 1
title: Simple Viewer
---

# Building a Simple Viewer

import { GitHubDiscussion } from "../../GitHubDiscussion.js";

This is a very minimal IIIF viewer that can load a manifest, display thumbnails, and load canvases in response to user navigation through the thumbnails.

You can see it running at /demos/simplest-viewer.html <!--<a href="../../demos/simplest-viewer.html" target="_blank">Simplest Viewer</a>.-->

_The code below shows how CP plus a few other UI components, combined with vault, can load manifests, render thumbnails, and show the canvases. The code is simple against a vault-normalised Presentation 3 representation._

_This viewer is then extended by [Content State Selector](./content-state-selector) and [Text-centric Viewer](./text-centric)._

<!-- Can we use an include here? -->
```html
<html>
<head>
    <title>Canvas Panel - simple</title>
    <style>
        #manifest { width: 50vw; }
        #th { width:12vw; border-right: 1px solid #999; margin: 5px; float:left; height:90%; overflow-y:scroll; }        
        #main { width:84vw; margin-top:30px; margin-left:10px; float:left; height:90%;} 
        .tc { display: inline-block; padding:5px; cursor: pointer; }
        #cp { height:100% }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/@digirati/canvas-panel-web-components@latest"></script>
    <script src="https://cdn.jsdelivr.net/npm/@iiif/vault-helpers@latest/dist/index.umd.js"></script>
</head>
<body>
    <h1>A simple viewer using Canvas Panel</h1>
    <h2 id="manifestLabel"></h2>
    <div>    
        <input id="manifest" type="text" value="https://iiif.wellcomecollection.org/presentation/b18035723" />
        <input id="go" type="button" value="Go" />
    </div>    
    <div>    
        <div id="th"></div>
        <div id="main">
            <canvas-panel id="cp" height="600"></canvas-panel> <!--height="95%" -->
            <p id="cvLabel"></p>
        </div>
    </div>
    <script>    
        function $(id) { return document.getElementById(id); }

        async function loadManifest(){
            const manifestUri = $("manifest").value;
            if(manifestUri){
                const manifest = await cp.vault.loadManifest(manifestUri);       
                $("manifestLabel").innerText = IIIFVaultHelpers.getValue(manifest.label);      
                let thumbsHtml = "";
                for(const canvas of cp.vault.allFromRef(manifest.items)){              
                    const label = IIIFVaultHelpers.getValue(canvas.label);
                    const cvThumb = await cp.getThumbnail(canvas, {maxWidth:100, maxHeight:200})
                    thumbsHtml += '<div class="tc">' + label + '<br/>';
                    thumbsHtml += '<img data-uri="' + canvas.id + '" data-label="' + label + '" src="' + cvThumb.best.id + '" />';
                    thumbsHtml += '</div>';   
                }
                $('th').innerHTML = thumbsHtml;    
                const thumbs = document.querySelectorAll('#th img');      
                for(const thumb of thumbs){
                    thumb.addEventListener('click', selectCanvas);
                }  
                thumbs[0].click();
            }
        }

        $("go").addEventListener('click', loadManifest);
        loadManifest();

        function selectCanvas(){
            const cvId = this.getAttribute("data-uri");
            cp.setCanvas(cvId);
            $("cvLabel").innerText = this.getAttribute("data-label");
        }

     </script>
</body>
</html>
```

<GitHubDiscussion ghid="20" />