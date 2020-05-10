console.log('starting colorify');

//get window info
var url = window.location.hostname.split('.');
var subdomain = url[ 0 ];
console.log( subdomain );
var subdomainPieces = subdomain.split('--');
var environment = subdomainPieces.length > 1 ? subdomainPieces[1] : 'prod';
console.log( environment );
updatePageTitle();
var currentTitle = document.title;

//some utilities
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

/*

set initial values

console.log('setting local storage');
browser.storage.local.set( { 'prod': '88ffaa',
							 'qa' : 'ff0000' });
*/

//listen to title changes
new MutationObserver(function(mutations) {
	updatePageTitle();
}).observe(
    document.querySelector('title'),
    { subtree: true, characterData: true, childList: true }
);




function updatePageTitle(){
	console.log('Title Change');
	console.log( document.title );
	console.log( currentTitle );	
	if ( subdomain !== 'login' && subdomain != 'test' && document.title !== currentTitle ){
		console.log('updating title');
		currentTitle = '[' + environment.toUpperCase() + '] ' + document.title;
		document.title = currentTitle;
	}
}

console.log( 'clear favicon' );
document.querySelectorAll("link[rel~='icon']").remove();
var link;

console.log( 'add favicon placeholder' );
if (!link) {
  link = document.createElement('link');
  link.setAttribute('rel', 'icon');
  document.head.appendChild(link);
}
var canvas = document.createElement('canvas');
var img = document.createElement('img');
function onImageLoaded() {
	
	console.log('create canvas');
	canvas.width = 16;
	canvas.height = 16;
	
	var context = canvas.getContext('2d');
	
	context.drawImage(img, 0, 0);
	context.globalCompositeOperation = 'source-in';
	
	//console.log( 'before fill ');
	//console.log( canvas.toDataURL('image/png') );

	context.fillStyle = '#88ffaa';
	context.fillRect(0, 0, 16, 16);
	
	//console.log( 'after fill ');
	//console.log( canvas.toDataURL('image/png') );
	link.href = canvas.toDataURL('image/png');
}

/* generic error handler */
function onError(error) {
	console.log(error);
  }

//console.log( 'umm load favicon?' );

img.addEventListener('load', onImageLoaded);
img.src = browser.runtime.getURL('favicon.ico');

link.type = 'image/png';

console.log('testing storage');
console.log( 'the environment is ' )
console.log( environment );

var envPreference = browser.storage.local.get( environment )
.then(  (results) => {
	console.log( 'in the promise' );
	console.log( results );
	console.log( results[ environment ] );
}, onError
);

console.log( 'ending colorify');

