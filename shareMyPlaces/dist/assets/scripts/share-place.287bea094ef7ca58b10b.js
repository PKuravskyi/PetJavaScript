(()=>{"use strict";class e{constructor(e,t){this.fallbackText=t,this.contentTemplateEl=document.getElementById(e),this.modalTemplateEl=document.getElementById("modal-template")}show(){if("content"in document.createElement("template")){const e=document.importNode(this.modalTemplateEl.content,!0);this.modalElement=e.querySelector(".modal"),this.backdropElement=e.querySelector(".backdrop");const t=document.importNode(this.contentTemplateEl.content,!0);this.modalElement.appendChild(t),document.body.insertAdjacentElement("afterbegin",this.backdropElement),document.body.insertAdjacentElement("afterbegin",this.modalElement)}else alert(this.fallbackText)}hide(){document.body.removeChild(this.modalElement),document.body.removeChild(this.backdropElement),this.modalElement=null,this.backdropElement=null}}class t{constructor(e){this.render(e)}async render(e){if(!google)return void alert("Could not load Google Maps - please try again later!");const{Map:t}=await google.maps.importLibrary("maps"),n=new t(document.getElementById("map"),{center:e,zoom:15});new google.maps.Marker({position:e,map:n})}}const n="AIzaSyDF3JHjABtB-EwbfXZM5Fz5CsTwdEN1quE";new class{constructor(){const e=document.getElementById("address-form"),t=document.getElementById("locate-btn");this.shareLinkInputEl=document.getElementById("share-link"),this.shareBtn=document.getElementById("share-btn"),this.shareBtn.addEventListener("click",this.sharePlaceHandler.bind(this)),e.addEventListener("submit",this.findAddressHandler.bind(this)),t.addEventListener("click",this.locateUserHandler.bind(this))}sharePlaceHandler(){const e=this.shareLinkInputEl.value;if(""===e.trim())throw new Error("Empty link. Cannot redirect.");window.location.href=e}selectPlace(e,n){this.map?this.map.render(e):this.map=new t(e),fetch("https://petjs-sharemyplaces.onrender.com/add-location",{method:"POST",body:JSON.stringify({address:n,lat:e.lat,lng:e.lng}),headers:{"Content-Type":"application/json"}}).then((e=>e.json())).then((e=>{const t=e.locationId;this.shareBtn.disabled=!1,this.shareLinkInputEl.value=`${location.origin}/my-place?location=${t}`})).catch((e=>{throw new Error(e.message)}))}locateUserHandler(){if(!navigator.geolocation)return void alert("Location feature is not available in your browser - please use a more modern browser or manually enter an address.");const t=new e("loading-modal-content","Getting location...");t.show(),navigator.geolocation.getCurrentPosition((async e=>{const a={lat:e.coords.latitude,lng:e.coords.longitude},o=await async function(e){return await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${e.lat},${e.lng}&key=${n}`).then((e=>{if(e.data.error_message)throw`Something went wrong with Google Maps API\nMessage: ${e.data.error_message}\nStatus: ${e.data.status}`;return e.data.results[0].formatted_address})).catch((e=>{throw new Error(e)}))}(a);t.hide(),this.selectPlace(a,o)}),(e=>{throw t.hide(),new Error(e)}))}async findAddressHandler(t){t.preventDefault();const a=t.target.querySelector("#address").value;if(!a||0===a.trim().length)return void alert("Invalid address - please try again!");const o=new e("loading-modal-content","Getting location...");o.show();const s=await async function(e){const t=encodeURI(e);return await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${t}&key=${n}`).then((e=>e.data.results[0].geometry.location)).catch((e=>{throw new Error(e)}))}(a);try{this.selectPlace(s,a)}catch(e){alert(e.message)}o.hide()}}})();