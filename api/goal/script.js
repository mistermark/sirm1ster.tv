let urlParams;
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

const elProgress = document.getElementsByClassName("progress-positive");
const elTotal = document.getElementsByClassName("progress-total");
const elUnits = document.getElementsByClassName("progress-unit");
const elFill = document.getElementById("progress-fill");

const totalNum = urlParams["total"];
const progressNum = urlParams["progress"];
const unitLabel = urlParams["unit"];

const barMaxWidth = 100; //Percent

const appendStylesOverride = () => {

  const fontsizeOverride = urlParams["font-size"];
  const inlineStyles = `body { font-size: ${fontsizeOverride}px; }`;
  const head = document.head;
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(inlineStyles));
  head.appendChild(style);
}

let setBarWidth = (maxWidth) => {
  const progressWidth = maxWidth / totalNum * progressNum;
  elFill.style.width = `${progressWidth}%`;
}

let setLabelText = (array, value) => {
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    element.innerText = value;
  }
}
setLabelText(elTotal, totalNum);
setLabelText(elProgress, progressNum);
setLabelText(elUnits, unitLabel);
setBarWidth(barMaxWidth);

if (urlParams["font-size"]) appendStylesOverride();