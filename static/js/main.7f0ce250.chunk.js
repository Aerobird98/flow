(this.webpackJsonpflow=this.webpackJsonpflow||[]).push([[0],{15:function(e,t,a){e.exports=a(25)},20:function(e,t,a){},25:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a(2),l=a.n(r),c=a(8),o=a.n(c),i=a(1),u=a(7),s=a(14);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a(20);var m=function(e){var t=e.attributes,a=e.children,n=e.leaf;return n.bold&&(a=l.a.createElement("strong",null,a)),n.code&&(a=l.a.createElement("code",null,a)),n.italic&&(a=l.a.createElement("em",null,a)),n.underline&&(a=l.a.createElement("u",null,a)),n.strike&&(a=l.a.createElement("s",null,a)),l.a.createElement("span",t,a)},d=function(e){var t=e.attributes,a=e.children;switch(e.element.type){case"heading-one":return l.a.createElement("h1",t,a);case"heading-two":return l.a.createElement("h2",t,a);case"heading-three":return l.a.createElement("h3",t,a);case"heading-four":return l.a.createElement("h4",t,a);case"heading-five":return l.a.createElement("h5",t,a);case"heading-six":return l.a.createElement("h6",t,a);case"block-quote":return l.a.createElement("blockquote",t,a);case"list-item":return l.a.createElement("li",t,a);case"unordered-list":return l.a.createElement("ul",t,a);case"ordered-list":return l.a.createElement("ol",t,a);default:return l.a.createElement("p",t,a)}},f={isMarkActive:function(e,t){var a=i.a.marks(e);return!!a&&!0===a[t]},isBlockActive:function(e,t){var a=i.a.nodes(e,{match:function(e){return e.type===t}});return!!Object(n.a)(a,1)[0]},toggleMark:function(e,t){f.isMarkActive(e,t)?i.a.removeMark(e,t):i.a.addMark(e,t,!0)},toggleBlock:function(e,t){if("list-item"!==t){var a=f.isBlockActive(e,t),n=["ordered-list","unordered-list"],r=n.includes(t);if(i.h.unwrapNodes(e,{match:function(e){return n.includes(e.type)},split:!0}),i.h.setNodes(e,{type:a?null:r?"list-item":t},{match:function(t){return i.a.isBlock(e,t)}}),!a&&r){var l={type:t,children:[]};i.h.wrapNodes(e,l)}}}},h={type:"paragraph",children:[{text:"A line of text in a paragraph."}]},b=function(e){var t=e.format,a=e.label,n=Object(u.c)();return l.a.createElement("span",{className:"btn"+(f.isBlockActive(n,t)?" active":" disabled"),onMouseDown:function(e){e.preventDefault(),f.toggleBlock(n,t)}},a)},g=function(e){var t=e.format,a=e.label,n=Object(u.c)();return l.a.createElement("span",{className:"btn"+(f.isMarkActive(n,t)?" active":" disabled"),onMouseDown:function(e){e.preventDefault(),f.toggleMark(n,t)}},a)};o.a.render(l.a.createElement((function(){var e=Object(r.useMemo)((function(){return Object(s.a)(Object(u.d)(Object(i.i)()))}),[]),t=Object(r.useState)(JSON.parse(localStorage.getItem("content"))||[h]),a=Object(n.a)(t,2),c=a[0],o=a[1],E=Object(r.useCallback)((function(e){return l.a.createElement(m,e)}),[]),v=Object(r.useCallback)((function(e){return l.a.createElement(d,e)}),[]);return l.a.createElement(u.b,{editor:e,value:c,onChange:function(e){o(e);var t=JSON.stringify(e);localStorage.setItem("content",t)}},l.a.createElement("div",{className:"tools"},l.a.createElement(b,{format:"heading-one",label:"H1"}),l.a.createElement(b,{format:"heading-two",label:"H2"}),l.a.createElement(b,{format:"heading-three",label:"H3"}),l.a.createElement(b,{format:"heading-four",label:"H4"}),l.a.createElement(b,{format:"heading-five",label:"H5"}),l.a.createElement(b,{format:"heading-six",label:"H6"}),l.a.createElement(b,{format:"block-quote",label:"Blockquote"}),l.a.createElement(b,{format:"ordered-list",label:"OL"}),l.a.createElement(b,{format:"unordered-list",label:"UL"})),l.a.createElement("div",{className:"tools"},l.a.createElement(g,{format:"bold",label:"Bold"}),l.a.createElement(g,{format:"italic",label:"Italic"}),l.a.createElement(g,{format:"underline",label:"Underline"}),l.a.createElement(g,{format:"strike",label:"Strikethrough"}),l.a.createElement(g,{format:"code",label:"Code"})),l.a.createElement(u.a,{renderLeaf:E,renderElement:v,placeholder:"Compose something epic...",onKeyDown:function(t){if(t.ctrlKey)switch(t.key){case"b":t.preventDefault(),f.toggleMark(e,"bold");break;case"i":t.preventDefault(),f.toggleMark(e,"italic");break;case"u":t.preventDefault(),f.toggleMark(e,"underline");break;case"`":t.preventDefault(),f.toggleMark(e,"code")}},autoFocus:!0}))}),null),document.getElementById("editor")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[15,1,2]]]);
//# sourceMappingURL=main.7f0ce250.chunk.js.map