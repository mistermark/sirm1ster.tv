var urlParams;
(function () {
  var match,
    pl = /\+/g, // Regex for replacing addition symbol with a space
    search = /([^&=]+)=?([^&]*)/g,
    decode = function (s) {
      return decodeURIComponent(s.replace(pl, " "));
    },
    query = window.location.search.substring(1);

  urlParams = {};
  while ((match = search.exec(query)))
    urlParams[decode(match[1])] = decode(match[2]);
})();

var output = document.getElementById("output");
var timeOffset = "";
var timezone = urlParams["timezone"];
if (urlParams["style"]) output.setAttribute("style", urlParams["style"]);
if (urlParams["bodyStyle"])
  document.body.setAttribute("style", urlParams["bodyStyle"]);
if (timezone) {
  if (timezone === "PST") timeOffset = "-0800";
  if (timezone === "MST") timeOffset = "-0700";
  if (timezone === "CST") timeOffset = "-0600";
  if (timezone === "EST") timeOffset = "-0500";
  if (timezone === "GMT") timeOffset = "+0000";
  if (timezone === "CET") timeOffset = "+0100";
  if (timezone === "EET") timeOffset = "+0300";
  if (timezone === "KST") timeOffset = "+0900";
  if (timezone === "JST") timeOffset = "+0900";
  if (timezone === "ACST") timeOffset = "+0930";
  if (timezone === "AEST") timeOffset = "+1000";
}


var c;
setInterval(
  (c = function () {
    output.innerText = moment()
      .zone(timeOffset)
      .format(urlParams["format"] || "") + " " + (timezone || "CET");
  }),
  1000
);
c();
