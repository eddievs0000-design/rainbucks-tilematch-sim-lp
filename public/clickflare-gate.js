/* ClickFlare tag gate — "skip consent regions" route.
 *
 * The tag is loaded only for visitors in regions that do NOT require
 * ad/cookie consent (EU/EEA, UK, Switzerland are excluded). The visitor's
 * country comes from same-origin /cdn-cgi/trace (loc=, 2s timeout).
 * On lookup failure, non-OK response, unknown location (XX) or Tor exit
 * (T1) the tag stays blocked. No banner is shown; no consent records
 * exist, so no identifiers are stored on this site.
 */
(function () {
  var CONSENT = [
    "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT",
    "LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE",
    "IS","LI","NO","GB","UK","CH"
  ];

  function allowed(loc) {
    return !!loc && loc !== "XX" && loc !== "T1" && CONSENT.indexOf(loc) === -1;
  }

  var ctrl = new AbortController();
  var timer = setTimeout(function () { ctrl.abort(); }, 2000);
  fetch("/cdn-cgi/trace", { signal: ctrl.signal, cache: "no-store" })
    .then(function (r) {
      if (!r.ok) throw new Error("trace " + r.status);
      return r.text();
    })
    .then(function (txt) {
      var m = /(?:^|\n)loc=([^\n]*)/.exec(txt);
      if (allowed(m ? m[1].trim() : "")) run();
    })
    .catch(function () {
      /* unresolved or failed lookup — tag stays blocked */
    })
    .finally(function () {
      clearTimeout(timer);
    });

  function run() {
    /* ==== ClickFlare universal tag (verbatim) ==== */
    !function(){"use strict";var t="lp_ref",n="cpid",e="lpurl",c="https://trk.join.mobilerwrds.com",r="(?<domain>http(?:s?)://[^/]*)".concat("/cf/click"),a="(?:(?:/(?<cta>[a-zA-Z0-9_-]+)/?)|(?:/))?",i="^".concat(r).concat(a).concat("(?:$|(\\?.*))"),o='javascript:window.clickflare.l="(?<original_link>'.concat(r).concat(a,'("|(\\?[^"]*"))).*'),s=function(){return new RegExp(i,"")},u=function(){return new RegExp(o,"")};function l(t){var n=function(t){return t.replace(s(),(function(t){for(var n=[],e=1;e<arguments.length;e++)n[e-1]=arguments[e];var r=n[n.length-1].domain;return t.replace(r,c)}))}(t);return'javascript:window.clickflare.l="'.concat(n,'"; void 0;')}function d(t,n){if(n&&t&&n.apply(document,[t]),/loaded|interactive|complete/.test(document.readyState))for(var e=0,c=document.links.length;e<c;e++)if(s().test(document.links[e].href)){var r=document.links[e];window.clickflare.links_replaced.has(r)||(r.href=l(r.href),window.clickflare.links_replaced.add(r))}}var f,h,m,p;!function(r,a){var i=document.onreadystatechange;window.clickflare||(window.clickflare={listeners:{},customParams:{},links_replaced:new Set,addEventListener:function(t,n){var e=this.listeners[t]||[];e.includes(n)||e.push(n),this.listeners[t]=e},dispatchEvent:function(t,n){n&&(this.customParams[t]=n),(this.listeners[t]||[]).forEach((function(t){return t(n)}))},push:function(t,n){n&&(this.customParams[t]=n),(this.listeners[t]||[]).forEach((function(t){return t(n)}))}},document.onreadystatechange=function(t){return d(t,i)},d(null,i),setTimeout((function(){!function(r,a){var i,o=function(r,a){var i=new URL("".concat(c).concat(r));o=a,s="{",u=s+s,l="_",d=l+l,o.startsWith(u)||o.startsWith(d)||i.searchParams.set(n,a);var o,s,u,l,d;return i.searchParams.append(t,document.referrer),i.searchParams.append(e,location.href),i.searchParams.append("lpt",document.title),i.searchParams.append("t",(new Date).getTime().toString()),i.toString()}(r,a),s=document.createElement("script"),l=document.scripts[0];s.async=1,s.src=o,s.onerror=function(){!function(){for(var t=function(t,n){var e=document.links[t];u().test(decodeURI(e.href))&&setTimeout((function(){e&&e.setAttribute("href",function(t){var n=t.match(u());if(n){var e=(n.groups||{}).original_link;return e?e.slice(0,-1):t}return t}(decodeURI(e.href)))}))},n=0,e=document.links.length;n<e;n++)t(n)}()},null===(i=l.parentNode)||void 0===i||i.insertBefore(s,l)}(r,a)})))}("".concat("/cf/tags","/").concat(new URL(window.location.href).searchParams.get("cftmid")||"__CONTAINER_ID__"),(m=new URL(window.location.href).searchParams.get(n),f=new RegExp("(^| )".concat("cf_cpid","=([^;]+)")),p=(h=document.cookie.match(f))&&h.pop()||null,m||p||"__CAMPAIGN_ID__"))}();
  }
})();
