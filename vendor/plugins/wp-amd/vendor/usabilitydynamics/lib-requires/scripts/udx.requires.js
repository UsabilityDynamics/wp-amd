var requirejs,require,define;!function(global){function stringifyObject(a){var b=[],c=arguments[1]?arguments[1]:null;for(var d in a){var e=c?c+"["+d+"]":d,f=a[d];b.push("object"==typeof f?stringifyObject(f,e):encodeURIComponent(e)+"="+encodeURIComponent(f))}return b.join("&")}function getAllElementsWithAttribute(a,b){for(var c=[],d=document.getElementsByTagName(b||"*"),e=0;e<d.length;e++)d[e].getAttribute(a)&&c.push(d[e]);return c.each=each.bind(this,c),c}function loadStyle(a){console.debug("loadStyle",a),a&&window.setTimeout(function(){var b=document.createElement("link");b.type="text/css",b.rel="stylesheet",b.href=a,document.getElementsByTagName("head")[0].appendChild(b)},0)}function extend(a,b){if(b)for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return a}function parseOptions(a){var b,c,d,e={},f=(a||"").split(",");for(var g in f||[])b=f[g].split(":"),c=b[0]?b[0].trim():null,d=b[1]?b[1].trim():null,"string"==typeof d&&"true"===d&&(d=!0),"string"==typeof d&&"false"===d&&(d=!1),c&&d&&(e[c]=d);return e}function doesGetOwnPropertyDescriptorWork(a){try{return a.sentinel=0,0===Object.getOwnPropertyDescriptor(a,"sentinel").value}catch(b){}}function doesDefinePropertyWork(a){try{return Object.defineProperty(a,"sentinel",{}),"sentinel"in a}catch(b){}}function isFunction(a){return"[object Function]"===ostring.call(a)}function isArray(a){return"[object Array]"===ostring.call(a)}function each(a,b){if(a){var c;for(c=0;c<a.length&&(!a[c]||!b(a[c],c,a));c+=1);}}function eachReverse(a,b){if(a){var c;for(c=a.length-1;c>-1&&(!a[c]||!b(a[c],c,a));c-=1);}}function hasProp(a,b){return a&&hasOwn&&"function"==typeof hasOwn.call?hasOwn.call(a,b):void 0}function getOwn(a,b){return hasProp(a,b)&&a[b]}function eachProp(a,b){var c;for(c in a)if(hasProp(a,c)&&b(a[c],c))break}function mixin(a,b,c,d){return b&&eachProp(b,function(b,e){(c||!hasProp(a,e))&&(!d||"object"!=typeof b||!b||isArray(b)||isFunction(b)||b instanceof RegExp?a[e]=b:(a[e]||(a[e]={}),mixin(a[e],b,c,d)))}),a}function bind(a,b){return function(){return b.apply(a,arguments)}}function scripts(){return document.getElementsByTagName("script")}function defaultOnError(a){throw a}function getGlobal(a){if(!a)return a;var b=global;return each(a.split("."),function(a){b=b[a]}),b}function makeError(a,b,c,d){var e=new Error(b+"\nhttp://requirejs.org/docs/errors.html#"+a);return e.requireType=a,e.requireModules=d,c&&(e.originalError=c),e}function newContext(a){function b(a){var b,c;for(b=0;a[b];b+=1)if(c=a[b],"."===c)a.splice(b,1),b-=1;else if(".."===c){if(1===b&&(".."===a[2]||".."===a[0]))break;b>0&&(a.splice(b-1,2),b-=2)}}function c(a,c,d){var e,f,g,h,i,j,k,l,m,n,o,p=c&&c.split("/"),q=p,r=x.map,s=r&&r["*"];if(a&&"."===a.charAt(0)&&(c?(q=getOwn(x.pkgs,c)?p=[c]:p.slice(0,p.length-1),a=q.concat(a.split("/")),b(a),f=getOwn(x.pkgs,e=a[0]),a=a.join("/"),f&&a===e+"/"+f.main&&(a=e)):0===a.indexOf("./")&&(a=a.substring(2))),d&&r&&(p||s)){for(h=a.split("/"),i=h.length;i>0;i-=1){if(k=h.slice(0,i).join("/"),p)for(j=p.length;j>0;j-=1)if(g=getOwn(r,p.slice(0,j).join("/")),g&&(g=getOwn(g,k))){l=g,m=i;break}if(l)break;!n&&s&&getOwn(s,k)&&(n=getOwn(s,k),o=i)}!l&&n&&(l=n,m=o),l&&(h.splice(0,m,l),a=h.join("/"))}return a}function d(a){isBrowser&&each(scripts(),function(b){return b.getAttribute("data-requiremodule")===a&&b.getAttribute("data-requirecontext")===u.contextName?(b.parentNode.removeChild(b),!0):void 0})}function e(a){var b=getOwn(x.paths,a);return b&&isArray(b)&&b.length>1?(b.shift(),u.require.undef(a),u.require([a]),!0):void 0}function f(a){var b,c=a?a.indexOf("!"):-1;return c>-1&&(b=a.substring(0,c),a=a.substring(c+1,a.length)),[b,a]}function g(a,b,d,e){var g,h,i,j,k=null,l=b?b.name:null,m=a,n=!0,o="";a||(n=!1,a="_@r"+(E+=1)),j=f(a),k=j[0],a=j[1],k&&(k=c(k,l,e),h=getOwn(C,k)),a&&(k?o=h&&h.normalize?h.normalize(a,function(a){return c(a,l,e)}):c(a,l,e):(o=c(a,l,e),j=f(o),k=j[0],o=j[1],d=!0,g=u.nameToUrl(o))),i=!k||h||d?"":"_unnormalized"+(F+=1);var p={prefix:k,name:o,parentMap:b,unnormalized:!!i,url:g,originalName:m,isDefine:n,id:(k?k+"!"+o:o)+i};return u.log("makeModuleMap",a,p),p}function h(a){u.log("getModule",a);var b=a.id,c=getOwn(y,b);if(c||(c=y[b]=new u.Module(a)),u.config.shim[b]&&u.config.shim[b].exports){var d=u.config.shim[b].exports;window[d]&&(c.inWindow=!0)}return c}function i(a,b,c){var d=a.id,e=getOwn(y,d);!hasProp(C,d)||e&&!e.defineEmitComplete?(e=h(a),e.error&&"error"===b?c(e.error):e.on(b,c)):"defined"===b&&c(C[d])}function j(a,b){var c=a.requireModules,d=!1;b?b(a):(each(c,function(b){var c=getOwn(y,b);c&&(c.error=a,c.events.error&&(d=!0,c.emit("error",a)))}),d||req.onError(a))}function k(){globalDefQueue.length&&(apsp.apply(B,[B.length,0].concat(globalDefQueue)),globalDefQueue=[])}function l(a){delete y[a],delete z[a]}function m(a,b,c){var d=a.map.id;a.error?a.emit("error",a.error):(b[d]=!0,each(a.depMaps,function(d,e){var f=d.id,g=getOwn(y,f);!g||a.depMatched[e]||c[f]||(getOwn(b,f)?(a.defineDep(e,C[f]),a.check()):m(g,b,c))}),c[d]=!0)}function n(){var a,b,c=1e3*x.waitSeconds,f=c&&u.startTime+c<(new Date).getTime(),g=[],h=[],i=!1,k=!0;if(!s){if(s=!0,eachProp(z,function(a){var c=a.map,j=c.id;if(a.enabled&&(c.isDefine||h.push(a),!a.error))if(!a.inited&&f)e(j)?(b=!0,i=!0):(g.push(j),d(j));else if(!a.inited&&a.fetched&&c.isDefine&&(i=!0,!c.prefix))return k=!1}),f&&g.length)return a=makeError("timeout","Load timeout for modules: "+g,null,g),a.contextName=u.contextName,j(a);k&&each(h,function(a){m(a,{},{})}),f&&!b||!i||!isBrowser&&!isWebWorker||w||(w=setTimeout(function(){w=0,n()},50)),s=!1}}function o(a){u.log("callGetModule",a),hasProp(C,a[0])||h(g(a[0],null,!0)).init(a[1],a[2])}function p(a,b,c,d){a.detachEvent&&!isOpera?d&&a.detachEvent(d,b):a.removeEventListener(c,b,!1)}function q(a){u.log("getScriptData",a);var b=a.currentTarget||a.srcElement;return p(b,u.onScriptLoad,"load","onreadystatechange"),p(b,u.onScriptError,"error"),{node:b,id:b&&b.getAttribute("data-requiremodule")}}function r(){var a;for(k();B.length;){if(a=B.shift(),null===a[0])return j(makeError("mismatch","Mismatched anonymous define() module: "+a[a.length-1]));o(a)}}var s,t,u,v,w,x={waitSeconds:7,baseUrl:"./",paths:{},pkgs:{},shim:{},config:{}},y={},z={},A={},B=[],C={},D={},E=1,F=1;return x.shim={knockout:{},"knockout.mapping":{exports:"knockout.mapping",deps:["knockout"]},"twitter.bootstrap":{exports:"jQuery.fn.popover",deps:["jquery"]},jquery:{exports:"jQuery",deps:[]},"jquery.ui":{exports:"jQuery.ui",deps:["jquery"]},"jquery.spin":{exports:"jQuery.fn.spin",deps:["jquery"]},"jquery.fancybox":{exports:"jQuery.fn.fancybox",deps:["jquery"]},"jquery.isotope":{exports:"jQuery.fn.isotope",deps:["jquery"]},"jquery.scrollto":{exports:"jQuery.fn.scrollto",deps:["jquery"]},sammy:{exports:"sammy",deps:["jquery"]},spin:{exports:"spin"},swiper:{exports:"Swiper",deps:["jquery"]},"jquery.validation":{exports:"jQuery.validation",deps:["jquery"]},datatables:{deps:["jquery"]},backbone:{deps:["underscore","jquery"],exports:"Backbone"}},x.paths.async="//cdnjs.cloudflare.com/ajax/libs/async/0.2.7/async.min",x.paths.datatables="//cdnjs.cloudflare.com/ajax/libs/datatables/1.9.4/jquery.dataTables.min",x.paths["jquery.ui"]="//code.jquery.com/ui/1.10.3/jquery-ui",x.paths["jquery.validation"]="//cdnjs.cloudflare.com/ajax/libs/datatables/1.9.4/jquery.dataTables.min",x.paths.knockout="//ajax.aspnetcdn.com/ajax/knockout/knockout-2.2.1",x.paths["knockout.mapping"]="//cdnjs.cloudflare.com/ajax/libs/knockout.mapping/2.4.1/knockout.mapping.min",x.paths["twitter.bootstrap"]="//netdna.bootstrapcdn.com/bootstrap/3.0.3/js/bootstrap.min",x.paths.imagesloaded="//cdn.udx.io/vendor/imagesloaded",x.paths.skrollr="//cdn.udx.io/vendor/skrollr",x.paths.swiper="//cdn.udx.io/vendor/swiper",x.paths["swiper.scrollbar"]="//cdn.udx.io/vendor/swiper.scrollbar",x.paths["elastic.client"]="//cdn.udx.io/vendor/elastic.client",x.paths.parallax="//cdn.udx.io/vendor/parallax",x.paths.pace="//cdn.udx.io/vendor/pace",x.paths.history="//cdn.udx.io/vendor/history",x.paths.sammy="//cdn.udx.io/vendor/sammy",x.paths.emitter="//cdn.udx.io/vendor/emitter",x.paths.jquery="//cdn.udx.io/vendor/jquery",x.paths["jquery.scrollto"]="//cdn.udx.io/vendor/jquery.scrollto",x.paths["jquery.parallax"]="//cdn.udx.io/vendor/jquery.parallax",x.paths["jquery.fancybox"]="//cdn.udx.io/vendor/jquery.fancybox",x.paths["jquery.isotope"]="//cdn.udx.io/vendor/jquery.isotope",x.paths["udx.ui.jquery.tabs"]="//cdn.udx.io/lib/udx.ui.jquery.tabs",x.paths["udx.ui.sticky-header"]="//cdn.udx.io/lib/udx.ui.sticky-header",x.paths["udx.ui.dynamic-table"]="//cdn.udx.io/lib/udx.ui.dynamic-table",x.paths["udx.ui.parallax"]="//cdn.udx.io/lib/udx.ui.parallax",x.paths["udx.ui.scrollr"]="//cdn.udx.io/lib/udx.ui.scrollr",x.paths["udx.ui.swiper"]="//cdn.udx.io/lib/udx.ui.swiper",x.paths["udx.ui.slider"]="//cdn.udx.io/lib/udx.ui.slider",x.paths["udx.ui.gallery"]="//cdn.udx.io/lib/udx.ui.gallery",x.paths["udx.ui.stream"]="//cdn.udx.io/lib/udx.ui.stream",x.paths["udx.ui.video"]="//cdn.udx.io/lib/udx.ui.video",x.paths["udx.ui.wp.editor.script"]="//cdn.udx.io/lib/udx.ui.wp.editor.script",x.paths["udx.ui.wp.editor.style"]="//cdn.udx.io/lib/udx.ui.wp.editor.style",x.paths["udx.ui.wp.customizer.style"]="//cdn.udx.io/lib/udx.ui.wp.customizer.style",x.paths["udx.ui.wp.customizer.script"]="//cdn.udx.io/lib/udx.ui.wp.customizer.script",x.paths["udx.utility"]="//cdn.udx.io/lib/udx.utility",x.paths["udx.utility.md5"]="//cdn.udx.io/lib/udx.utility.md5",x.paths["udx.utility.device"]="//cdn.udx.io/lib/udx.utility.device",x.paths["udx.utility.facebook.like"]="//cdn.udx.io/lib/udx.facebook.like",x.paths["udx.utility.process"]="//cdn.udx.io/lib/udx.utility.process",x.paths["udx.utility.activity"]="//cdn.udx.io/lib/udx.utility.activity",x.paths["udx.utility.video"]="//cdn.udx.io/lib/udx.utility.video",x.paths["udx.utility.bus"]="//cdn.udx.io/lib/udx.utility.bux",x.paths["udx.utility.job"]="//cdn.udx.io/lib/udx.utility.job",x.paths["udx.model"]="//cdn.udx.io/lib/udx.model",x.paths["udx.model.validation"]="//cdn.udx.io/lib/udx.model.validation",x.paths["udx.saas.elastic"]="//cdn.udx.io/lib/udx.saas.elastic",x.paths["udx.settings"]="//cdn.udx.io/lib/udx.settings",x.paths["udx.storage"]="//cdn.udx.io/lib/udx.storage",x.paths["udx.wp.spa"]="//cdn.udx.io/lib/udx.wp.spa",x.paths["udx.wp.editor"]="//cdn.udx.io/lib/udx.wp.editor",x.paths["udx.wp.theme"]="//cdn.udx.io/lib/udx.wp.theme",x.paths["udx.wp.posts"]="//cdn.udx.io/lib/udx.wp.posts",x.paths["wpp.importer.overview"]="//cdn.udx.io/lib/wpp.importer.overview",x.paths["wpp.importer.editor"]="//cdn.udx.io/lib/wpp.importer.editor",x.paths["wpp.importer.rets"]="//cdn.udx.io/lib/wpp.importer.rets",v={require:function(a){return a.require?a.require:a.require=u.makeRequire(a.map)},exports:function(a){return a.usingExports=!0,a.map.isDefine?a.exports?a.exports:a.exports=C[a.map.id]={}:void 0},module:function(a){return a.module?a.module:a.module={id:a.map.id,uri:a.map.url,config:function(){var b,c=getOwn(x.pkgs,a.map.id);return b=c?getOwn(x.config,a.map.id+"/"+c.main):getOwn(x.config,a.map.id),b||{}},exports:C[a.map.id],log:function(){return console.info.call(console,this.id,arguments),arguments[0]},error:function(){return console.error.call(console,this.id,arguments),arguments[0]},debug:function(){return console.debug.call(console,this.id,arguments),arguments[0]}}}},t=function(a){this.events=getOwn(A,a.id)||{},this.map=a,this.shim=getOwn(x.shim,a.id),this.depExports=[],this.depMaps=[],this.depMatched=[],this.pluginMaps={},this.depCount=0},t.prototype={init:function(a,b,c,d){u.log("Module.init",this.map.id,this.map.url),d=d||{},this.inited||(this.factory=b,c?this.on("error",c):this.events.error&&(c=bind(this,function(a){this.emit("error",a)})),a&&"object"==typeof a&&"function"!=typeof a.slice&&(a=[a[0]]),this.depMaps=a&&a.slice(0),this.errback=c,this.inited=!0,this.ignore=d.ignore,d.enabled||this.enabled?this.enable():this.check())},defineDep:function(a,b){u.log("Module.defineDep",this.map.id,this.map.url),this.depMatched[a]||(this.depMatched[a]=!0,this.depCount-=1,this.depExports[a]=b)},fetch:function(){if(u.log("Module.fetch",this.map.id,this.map.url,this.map.prefix,this.shim),!this.fetched){this.fetched=!0,u.startTime=(new Date).getTime();var a=this.map;return this.shim?(this.inWindow,void u.makeRequire(this.map,{enableBuildCallback:!0})(this.shim.deps||[],bind(this,function(){return a.prefix?this.callPlugin():this.load()}))):a.prefix?this.callPlugin():this.load()}},load:function(){u.log("Module.load",this.map.id,this.map.url);var a=this.map.url;this.inWindow&&console.debug("Module.load",this.map.id,"inWindow",u),D[a]||(D[a]=!0,u.load(this.map.id,a))},check:function(){if(u.log("Module.check",this.map.id,this.map.url,this.inWindow,this.depExports),this.enabled&&!this.enabling){var a,b,c=this.map.id,d=this.depExports,e=this.exports,f=this.factory;if(this.inWindow,this.inited){if(this.error)this.emit("error",this.error);else if(!this.defining){if(this.defining=!0,this.depCount<1&&!this.defined){if(isFunction(f)){if(this.events.error&&this.map.isDefine||req.onError!==defaultOnError)try{e=u.execCb(c,f,d,e)}catch(g){a=g}else e=u.execCb(c,f,d,e);if(this.map.isDefine&&(b=this.module,b&&void 0!==b.exports&&b.exports!==this.exports?e=b.exports:void 0===e&&this.usingExports&&(e=this.exports)),a)return a.requireMap=this.map,a.requireModules=this.map.isDefine?[this.map.id]:null,a.requireType=this.map.isDefine?"define":"require",j(this.error=a)}else e=f;this.exports=e,this.map.isDefine&&!this.ignore&&(C[c]=e,req.onResourceLoad&&req.onResourceLoad(u,this.map,this.depMaps)),l(c),this.defined=!0}this.defining=!1,this.defined&&!this.defineEmitted&&(this.defineEmitted=!0,this.emit("defined",this.exports),this.defineEmitComplete=!0)}}else this.fetch()}},callPlugin:function(){u.log("Module.callPlugin",this.map.id,this.map.url);var a=this.map,b=a.id,d=g(a.prefix);this.depMaps.push(d),i(d,"defined",bind(this,function(d){var e,f,k,m=this.map.name,n=this.map.parentMap?this.map.parentMap.name:null,o=u.makeRequire(a.parentMap,{enableBuildCallback:!0});return this.map.unnormalized?(d.normalize&&(m=d.normalize(m,function(a){return c(a,n,!0)})||""),f=g(a.prefix+"!"+m,this.map.parentMap),i(f,"defined",bind(this,function(a){this.init([],function(){return a},null,{enabled:!0,ignore:!0})})),k=getOwn(y,f.id),void(k&&(this.depMaps.push(f),this.events.error&&k.on("error",bind(this,function(a){this.emit("error",a)})),k.enable()))):(e=bind(this,function(a){this.init([],function(){return a},null,{enabled:!0})}),e.error=bind(this,function(a){this.inited=!0,this.error=a,a.requireModules=[b],eachProp(y,function(a){0===a.map.id.indexOf(b+"_unnormalized")&&l(a.map.id)}),j(a)}),e.fromText=bind(this,function(c,d){var f=a.name,i=g(f),k=useInteractive;d&&(c=d),k&&(useInteractive=!1),h(i),hasProp(x.config,b)&&(x.config[f]=x.config[b]);try{req.exec(c)}catch(l){return j(makeError("fromtexteval","fromText eval for "+b+" failed: "+l,l,[b]))}k&&(useInteractive=!0),this.depMaps.push(i),u.completeLoad(f),o([f],e)}),void d.load(a.name,o,e,x))})),u.enable(d,this),this.pluginMaps[d.id]=d},enable:function(){u.log("Module.enable",this.map.id,this.map.url),z[this.map.id]=this,this.enabled=!0,this.enabling=!0,each(this.depMaps,bind(this,function(a,b){var c,d,e;if("string"==typeof a){if(a=g(a,this.map.isDefine?this.map:this.map.parentMap,!1,!this.skipMap),this.depMaps[b]=a,e=getOwn(v,a.id))return void(this.depExports[b]=e(this));this.depCount+=1,i(a,"defined",bind(this,function(a){this.defineDep(b,a),this.check()})),this.errback&&i(a,"error",bind(this,this.errback))}c=a.id,d=y[c],hasProp(v,c)||!d||d.enabled||u.enable(a,this)})),eachProp(this.pluginMaps,bind(this,function(a){var b=getOwn(y,a.id);b&&!b.enabled&&u.enable(a,this)})),this.enabling=!1,this.check()},on:function(a,b){var c=this.events[a];c||(c=this.events[a]=[]),c.push(b)},emit:function(a,b){each(this.events[a],function(a){a(b)}),"error"===a&&delete this.events[a]}},u={config:x,contextName:a,registry:y,defined:C,urlFetched:D,defQueue:B,Module:t,makeModuleMap:g,nextTick:req.nextTick,onError:j,log:function(){x.debug&&console.log.apply(console,arguments)},info:function(){console.info.apply(console,arguments)},configure:function(a){a.baseUrl&&"/"!==a.baseUrl.charAt(a.baseUrl.length-1)&&(a.baseUrl+="/");var b=x.pkgs,c=x.shim,d={paths:!0,config:!0,map:!0};a.packages=udx.setDefaultPackages(a.packages),eachProp(a,function(a,b){d[b]?(x[b]||(x[b]={}),mixin(x[b],a,!0,!0)):x[b]=a}),a.shim&&(eachProp(a.shim,function(a,b){isArray(a)&&(a={deps:a}),!a.exports&&!a.init||a.exportsFn||(a.exportsFn=u.makeShimExports(a)),c[b]=a}),x.shim=c),a.packages&&(each(a.packages,function(a){var c;a="string"==typeof a?{name:a}:a,c=a.location,b[a.name]={name:a.name,location:c||a.name,main:(a.main||"main").replace(currDirRegExp,"").replace(jsSuffixRegExp,"")}}),x.pkgs=b),eachProp(y,function(a,b){a.inited||a.map.unnormalized||(a.map=g(b))}),(a.deps||a.callback)&&u.require(a.deps||[],a.callback)},makeShimExports:function(a){function b(){var b;return a.init&&(b=a.init.apply(global,arguments)),b||a.exports&&getGlobal(a.exports)}return b},makeRequire:function(b,e){function f(c,d,i){u.log("localRequire",this);var k,l,m;return e.enableBuildCallback&&d&&isFunction(d)&&(d.__requireJsBuild=!0),"string"==typeof c?(u.log("localRequire",c),isFunction(d)?j(makeError("requireargs","Invalid require call"),i):b&&hasProp(v,c)?v[c](y[b.id]):req.get?req.get(u,c,b,f):(l=g(c,b,!1,!0),k=l.id,hasProp(C,k)?hasProp(C[k],"data")&&hasProp(C[k],"type")?udx.contextModel(u,k,C[k]):C[k]:j(makeError("notloaded",'Module name "'+k+'" has not been loaded yet for context: '+a+(b?"":". Use require([])"))))):(r(),u.nextTick(function(){u.log("localRequire:nextTick",c),r(),m=h(g(null,b)),m.skipMap=e.skipMap,m.init(c,d,i,{enabled:!0}),n()}),f)}return u.log("makeRequire",C),e=e||{},mixin(f,{isBrowser:isBrowser,toUrl:function(a){var d,e=a.lastIndexOf("."),f=a.split("/")[0],g="."===f||".."===f;-1!==e&&(!g||e>1)&&(d=a.substring(e,a.length),a=a.substring(0,e));var h=u.nameToUrl(c(a,b&&b.id,!0),d,!0);return h},defined:function(a){return hasProp(C,g(a,b,!1,!0).id)},specified:function(a){return a=g(a,b,!1,!0).id,hasProp(C,a)||hasProp(y,a)}}),b||(f.undef=function(a){k();var c=g(a,b,!0),e=getOwn(y,a);d(a),delete C[a],delete D[c.url],delete A[a],eachReverse(B,function(b,c){b[0]===a&&B.splice(c,1)}),e&&(e.events.defined&&(A[a]=e.events),l(a))}),f},enable:function(a){var b=getOwn(y,a.id);b&&h(a).enable()},completeLoad:function(a){u.log("completeLoad",a);var b,c,d,f=getOwn(x.shim,a)||{},g=f.exports;for(k();B.length;){if(c=B.shift(),null===c[0]){if(c[0]=a,b)break;b=!0}else c[0]===a&&(b=!0);o(c)}if(d=getOwn(y,a),!b&&!hasProp(C,a)&&d&&!d.inited){if(!(!x.enforceDefine||g&&getGlobal(g)))return e(a)?void 0:j(makeError("nodefine","No define call for "+a,null,[a]));o([a,f.deps||[],f.exportsFn])}n()},nameToUrl:function(a,b,c){u.log("nameToUrl",a);var d,e,f,g,h,i,j,k,l;if(req.jsExtRegExp.test(a))k=a+(b||"");else{for(d=x.paths,e=x.pkgs,h=a.split("/"),i=h.length;i>0;i-=1){if(j=h.slice(0,i).join("/"),f=getOwn(e,j),l=getOwn(d,j)){isArray(l)&&(l=l[0]),h.splice(0,i,l);break}if(f){g=a===f.name?f.location+"/"+f.main:f.location,h.splice(0,i,g);break}}k=h.join("/"),-1===k.indexOf(".json")&&(k+=b||(/^data\:|\?/.test(k)||c?"":".js")),k=("/"===k.charAt(0)||k.match(/^[\w\+\.\-]+:/)?"":x.baseUrl)+k}if(x.urlArgs){var m=Object.keys(x.urlArgs).length?stringifyObject(x.urlArgs):x.urlArgs;k=x.urlArgs?k+((-1===k.indexOf("?")?"?":"&")+m):k}return k},load:function(a,b){req.load(u,a,b)},execCb:function(a,b,c,d){return b.apply(d,c)},onScriptLoad:function(a){if(u.log("onScriptLoad",a),"load"===a.type||readyRegExp.test((a.currentTarget||a.srcElement).readyState)){interactiveScript=null;var b=q(a);u.completeLoad(b.id)}},onScriptError:function(a){var b=q(a);return e(b.id)?void 0:j(makeError("scripterror","Script error for: "+b.id,a,[b.id]))}},u.require=u.makeRequire(),u}function getInteractiveScript(){return interactiveScript&&"interactive"===interactiveScript.readyState?interactiveScript:(eachReverse(scripts(),function(a){return"interactive"===a.readyState?interactiveScript=a:void 0}),interactiveScript)}var version="3.0.5",req,s,head,baseElement,dataMain,src,interactiveScript,currentlyAddingScript,mainScript,subPath,commentRegExp=/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm,cjsRequireRegExp=/[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,jsSuffixRegExp=/\.js$/,currDirRegExp=/^\.\//,op=Object.prototype,ostring=op.toString,hasOwn=op.hasOwnProperty,ap=Array.prototype,apsp=ap.splice,isBrowser=!("undefined"==typeof window||"undefined"==typeof navigator||!window.document),isWebWorker=!isBrowser&&"undefined"!=typeof importScripts,readyRegExp=isBrowser&&"PLAYSTATION 3"===navigator.platform?/^complete$/:/^(complete|loaded)$/,defContextName="_",isOpera="undefined"!=typeof opera&&"[object Opera]"===opera.toString(),contexts={},cfg={},globalDefQueue=[],useInteractive=!1,debugBuild=!1;void 0==window.domReady?(window.domReady={},window.domReady=null):window.domReady=window.domReady,void 0==document.domReady?(document.domReady={},document.domReady=null):document.domReady=document.domReady;var winonload=window.onload,oldonload=document.onload,isLaunched=2;document.onload=function(){null!==oldonload&&oldonload.call()},window.onload=function(){null!==winonload&&winonload.call()},document.addEventListener("DOMContentLoaded",function(){var a=window.domReady,b=document.domReady;if(document.domReady||window.domReady)if(isLaunched>0){var c=document.createEvent("Event");c.initEvent("onDomReady",!0,!1),document.dispatchEvent(c),window.domReady&&2==isLaunched&&a.call(this,c),isLaunched-=1,document.domReady&&1==isLaunched&&b.call(this,c),isLaunched-=1,isLaunched=0,console&&0!=debugBuild&&context.log("Event onDomReady has been called by DomContentLoaded.")}else console&&0!=debugBuild&&(context.log("isLaunched="+isLaunched),context.log("Dom ready="+document.domReady),context.log("Old dom ready="+b));else console&&0!=debugBuild&&context.log("No hooks for domReady.")},!1);var udx={config:{loading_class:"udx-module-loading"},setDefaultPackages:function(a){return a=a||[],"function"!=typeof a.push,a.push({location:"http://cdn.udx.io/ace",main:"ace",name:"ace"}),a},dynamicLoading:function(){function a(){function a(a){var c=window.getComputedStyle(a);c.getPropertyValue("opacity")<1&&b.nextTick(function(){a.style.opacity=1})}function c(c){c.getAttribute("data-status")||(c.setAttribute("data-status","loading"),c.options=parseOptions(c.getAttribute("data-options")),b.require([c.getAttribute("data-requires")],function(d){if(b.log("moduleLoaded",typeof d),c.setAttribute("data-status","ready"),"function"==typeof d){var e=d.call(c,b);e&&"function"==typeof e.emit&&e.emit.call(e,"loaded",c),e&&"function"==typeof e.on?e.on("loaded",a.bind(e,c)):a.call(e,c)}},function(a){b.log(c.getAttribute("data-requires"),"not found.",a)}))}getAllElementsWithAttribute("data-requires",null).each(c),getAllElementsWithAttribute("data-require",null).each(c),getAllElementsWithAttribute("data-enqueue",null).each(c)}var b=this;document.domReady=function(){window.setTimeout(function(){a()},100)}},fetch_json_file:function(a,b){window.XMLHttpRequest?http_request=new XMLHttpRequest:window.ActiveXObject&&(http_request=new ActiveXObject("Microsoft.XMLHTTP")),http_request.open("GET",a,!0),http_request.send(null),http_request.onreadystatechange=function(){4==http_request.readyState&&(200==http_request.status?b(null,http_request.responseText):b(new Error("Could not load JSON file.")))}},parse_json_string:function(a){return JSON.parse(a)},deepExtend:function(a,b){for(var c in b)b[c]&&b[c].constructor&&b[c].constructor===Object?(a[c]=a[c]||{},arguments.callee(a[c],b[c])):a[c]=b[c];return a},contextModel:function(a,b,c){return udx.deepExtend(a.config,{paths:c.paths||{},shim:c.shim||{},urlArgs:c.urlArgs||null,config:c.config||{}}),each(c.deps||[],function(b){a.config.deps.push(b)}),c.data||{}}},call=Function.prototype.call,prototypeOfObject=Object.prototype,owns=call.bind(prototypeOfObject.hasOwnProperty),defineGetter,defineSetter,lookupGetter,lookupSetter,supportsAccessors;if((supportsAccessors=owns(prototypeOfObject,"__defineGetter__"))&&(defineGetter=call.bind(prototypeOfObject.__defineGetter__),defineSetter=call.bind(prototypeOfObject.__defineSetter__),lookupGetter=call.bind(prototypeOfObject.__lookupGetter__),lookupSetter=call.bind(prototypeOfObject.__lookupSetter__)),window.console||(window.console={}),console.debug||(console.debug=function(){}),Object.extend||(Object.extend=function(a,b){a=a||{};for(var c in b)a[c]="object"==typeof b[c]?Object.extend(a,b[c]):b[c];return a}),Object.getPrototypeOf||(Object.getPrototypeOf=function(a){return a.__proto__||(a.constructor?a.constructor.prototype:prototypeOfObject)}),Object.defineProperty){var getOwnPropertyDescriptorWorksOnObject=doesGetOwnPropertyDescriptorWork({}),getOwnPropertyDescriptorWorksOnDom="undefined"==typeof document||doesGetOwnPropertyDescriptorWork(document.createElement("div"));if(!getOwnPropertyDescriptorWorksOnDom||!getOwnPropertyDescriptorWorksOnObject)var getOwnPropertyDescriptorFallback=Object.getOwnPropertyDescriptor}if(!Object.getOwnPropertyDescriptor||getOwnPropertyDescriptorFallback){var ERR_NON_OBJECT="Object.getOwnPropertyDescriptor called on a non-object: ";Object.getOwnPropertyDescriptor=function(a,b){if("object"!=typeof a&&"function"!=typeof a||null===a)throw new TypeError(ERR_NON_OBJECT+a);if(getOwnPropertyDescriptorFallback)try{return getOwnPropertyDescriptorFallback.call(Object,a,b)}catch(c){}if(owns(a,b)){var d={enumerable:!0,configurable:!0};if(supportsAccessors){var e=a.__proto__;a.__proto__=prototypeOfObject;var f=lookupGetter(a,b),g=lookupSetter(a,b);if(a.__proto__=e,f||g)return f&&(d.get=f),g&&(d.set=g),d}return d.value=a[b],d.writable=!0,d}}}if(Object.getOwnPropertyNames||(Object.getOwnPropertyNames=function(a){return Object.keys(a)}),!Object.create){var createEmpty,supportsProto=null===Object.prototype.__proto__;createEmpty=supportsProto||"undefined"==typeof document?function(){return{__proto__:null}}:function(){function a(){}var b=document.createElement("iframe"),c=document.body||document.documentElement;b.style.display="none",c.appendChild(b),b.src="javascript:";var d=b.contentWindow.Object.prototype;return c.removeChild(b),b=null,delete d.constructor,delete d.hasOwnProperty,delete d.propertyIsEnumerable,delete d.isPrototypeOf,delete d.toLocaleString,delete d.toString,delete d.valueOf,d.__proto__=null,a.prototype=d,createEmpty=function(){return new a},new a},Object.create=function(a,b){function c(){}var d;if(null===a)d=createEmpty();else{if("object"!=typeof a&&"function"!=typeof a)throw new TypeError("Object prototype may only be an Object or null");c.prototype=a,d=new c,d.__proto__=a}return void 0!==b&&Object.defineProperties(d,b),d}}if(Object.defineProperty){var definePropertyWorksOnObject=doesDefinePropertyWork({}),definePropertyWorksOnDom="undefined"==typeof document||doesDefinePropertyWork(document.createElement("div"));if(!definePropertyWorksOnObject||!definePropertyWorksOnDom)var definePropertyFallback=Object.defineProperty,definePropertiesFallback=Object.defineProperties}if(!Object.defineProperty||definePropertyFallback){var ERR_NON_OBJECT_DESCRIPTOR="Property description must be an object: ",ERR_NON_OBJECT_TARGET="Object.defineProperty called on non-object: ",ERR_ACCESSORS_NOT_SUPPORTED="getters & setters can not be defined on this javascript engine";Object.defineProperty=function(a,b,c){if("object"!=typeof a&&"function"!=typeof a||null===a)throw new TypeError(ERR_NON_OBJECT_TARGET+a);if("object"!=typeof c&&"function"!=typeof c||null===c)throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR+c);if(definePropertyFallback)try{return definePropertyFallback.call(Object,a,b,c)}catch(d){}if(owns(c,"value"))if(supportsAccessors&&(lookupGetter(a,b)||lookupSetter(a,b))){var e=a.__proto__;a.__proto__=prototypeOfObject,delete a[b],a[b]=c.value,a.__proto__=e}else a[b]=c.value;else{if(!supportsAccessors)throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);owns(c,"get")&&defineGetter(a,b,c.get),owns(c,"set")&&defineSetter(a,b,c.set)}return a}}(!Object.defineProperties||definePropertiesFallback)&&(Object.defineProperties=function(a,b){if(definePropertiesFallback)try{return definePropertiesFallback.call(Object,a,b)}catch(c){}for(var d in b)owns(b,d)&&"__proto__"!=d&&Object.defineProperty(a,d,b[d]);return a}),Object.seal||(Object.seal=function(a){return a}),Object.freeze||(Object.freeze=function(a){return a});try{Object.freeze(function(){})}catch(exception){Object.freeze=function(a){return function(b){return"function"==typeof b?b:a(b)}}(Object.freeze)}if(Object.preventExtensions||(Object.preventExtensions=function(a){return a}),Object.isSealed||(Object.isSealed=function(){return!1}),Object.isFrozen||(Object.isFrozen=function(){return!1}),Object.isExtensible||(Object.isExtensible=function(a){if(Object(a)!==a)throw new TypeError;for(var b="";owns(a,b);)b+="?";a[b]=!0;var c=owns(a,b);return delete a[b],c}),Object.defineSchema||(Object.defineSchema=function(){console.log("not implemented")}),Object.validateSchema||(Object.validateSchema=function(){console.log("not implemented")}),"undefined"==typeof define){if("undefined"!=typeof requirejs){if(isFunction(requirejs))return;cfg=requirejs,requirejs=void 0}if("undefined"==typeof require||isFunction(require)||(cfg=require,require=void 0),req=requirejs=function(a,b,c,d){var e,f,g=defContextName;return isArray(a)||"string"==typeof a||(f=a,isArray(b)?(a=b,b=c,c=d):a=[]),f&&f.context&&(g=f.context),e=getOwn(contexts,g),e||(e=contexts[g]=req.s.newContext(g)),f&&e.configure(f),udx.dynamicLoading.call(e,a,b,c),e.log("requirejs",a),e.require(a,b,c)},req.loadStyle=loadStyle,req.config=function(a){return req(a)},req.nextTick="undefined"!=typeof setTimeout?function(a){setTimeout(a,4)}:function(a){a()},require||(require=req),req.version=version,req.jsExtRegExp=/^\/|:|\?|\.js$/,req.isBrowser=isBrowser,s=req.s={contexts:contexts,newContext:newContext},req({}),each(["toUrl","undef","defined","specified"],function(a){req[a]=function(){var b=contexts[defContextName];return b.require[a].apply(b,arguments)}}),isBrowser&&(head=s.head=document.getElementsByTagName("head")[0],baseElement=document.getElementsByTagName("base")[0],baseElement&&(head=s.head=baseElement.parentNode)),req.onError=defaultOnError,req.createNode=function(a){var b=a.xhtml?document.createElementNS("http://www.w3.org/1999/xhtml","html:script"):document.createElement("script");return b.type=a.scriptType||"text/javascript",b.charset="utf-8",b.async=!0,b},req.load=function(a,b,c){a.log("req.load",b,c);var d,e=a&&a.config||{};if(c.indexOf(".json")>1)return udx.fetch_json_file(c,function(c,d){a.log("have json!");try{var e=udx.parse_json_string(d);a.log("json parsed",e),a.log("context.registry",a.registry),a.completeLoad(b),currentlyAddingScript=null,a.define(e.name,function(){return a.log("alsdfjksalkfj "),e.data})}catch(c){console.error(c)}});if(isBrowser)return d=req.createNode(e,b,c),d.setAttribute("data-requirecontext",a.contextName),d.setAttribute("data-requiremodule",b),!d.attachEvent||d.attachEvent.toString&&d.attachEvent.toString().indexOf("[native code")<0||isOpera?(d.addEventListener("load",a.onScriptLoad,!1),d.addEventListener("error",a.onScriptError,!1)):(useInteractive=!0,d.attachEvent("onreadystatechange",a.onScriptLoad)),d.src=c,currentlyAddingScript=d,baseElement?head.insertBefore(d,baseElement):head.appendChild(d),currentlyAddingScript=null,d;if(isWebWorker)try{importScripts(c),a.completeLoad(b)}catch(f){a.onError(makeError("importscripts","importScripts failed for "+b+" at "+c,f,[b]))}},isBrowser&&!cfg.skipDataMain){var _last_script;eachReverse(scripts(),function(a){return head||(head=a.parentNode),udx.dataBaseURL=a.getAttribute("data-base-url"),udx.dataModel=a.getAttribute("data-model"),udx.dataBaseURL&&(cfg.baseUrl=udx.dataBaseURL),udx.dataModel&&(cfg.deps=cfg.deps?cfg.deps.concat(udx.dataModel):[udx.dataModel]),dataMain=a.getAttribute("data-main"),""!=a.getAttribute("data-version")&&(cfg.urlArgs={ver:a.getAttribute("data-version")}),dataMain?(_last_script=a,mainScript=dataMain,cfg.baseUrl||(src=mainScript.split("/"),mainScript=src.pop(),subPath=src.length?src.join("/")+"/":"./",cfg.baseUrl=subPath),mainScript=mainScript.replace(jsSuffixRegExp,""),req.jsExtRegExp.test(mainScript)&&(mainScript=dataMain),cfg.deps=cfg.deps?cfg.deps.concat(mainScript):[mainScript],!0):void 0
}),req.nextTick(function(){getAllElementsWithAttribute("data-main","script").each(function(a){if(!a.getAttribute("data-loading")&&a.src==_last_script.src){{a.getAttribute("data-id"),a.getAttribute("data-version"),a.getAttribute("data-name"),a.getAttribute("data-main")}a.setAttribute("data-status","loading"),getOwn(contexts,"_").config.paths[a.getAttribute("data-id")]=a.getAttribute("data-main"),getOwn(contexts,"_").config.deps.push(a.getAttribute("data-id"))}})})}define=function(a,b,c){var d,e;"string"!=typeof a&&(c=b,b=a,a=null),isArray(b)||(c=b,b=null),!b&&isFunction(c)&&(b=[],c.length&&(c.toString().replace(commentRegExp,"").replace(cjsRequireRegExp,function(a,c){b.push(c)}),b=(1===c.length?["require"]:["require","exports","module"]).concat(b))),useInteractive&&(d=currentlyAddingScript||getInteractiveScript(),d&&(a||(a=d.getAttribute("data-requiremodule")),e=contexts[d.getAttribute("data-requirecontext")])),(e?e.defQueue:globalDefQueue).push([a,b,c])},define.amd={jQuery:!0},req.exec=function(text){return eval(text)},req(cfg)}}(this),"function"==typeof define&&define("udx.test",function(){return console.debug("udx.test","works"),{ok:!0,version:require.version}});