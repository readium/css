document.addEventListener("DOMContentLoaded", function() {
  const frame = document.getElementById("page");
  
  const input = document.createElement("input");
  const label = document.createElement("label");

  label.className = "rcss-input";
  label.textContent = "Add ReadiumCSS flags and prefs: ";
  input.type = "text";
  input.name = "rcss";
  label.appendChild(input);
  document.documentElement.appendChild(label);

  const scrollLeft = () => {
    const gap = parseInt(window.getComputedStyle(frame.contentWindow.document.documentElement).getPropertyValue("column-gap"));
    frame.contentWindow.scrollTo(frame.contentWindow.scrollX - frame.contentWindow.innerWidth - gap, 0);
  };

  const scrollRight = () => {
    const gap = parseInt(window.getComputedStyle(frame.contentWindow.document.documentElement).getPropertyValue("column-gap"));
    frame.contentWindow.scrollTo(frame.contentWindow.scrollX + frame.contentWindow.innerWidth + gap, 0);
  };

  document.body.addEventListener("click", function(e) {
    e.preventDefault();
    if (e.clientX > (window.innerWidth / 2)) {
      scrollRight();
    } else {
      scrollLeft();
    }
  });

  document.body.addEventListener("keydown", function(e) {
    if (e.keyCode == "39") {
      scrollRight();
    } else if (e.keyCode == "37") {
      scrollLeft();
    }
  });

  input.addEventListener("change", (e) => {
    frame.contentWindow.document.documentElement.setAttribute("style", e.target.value);
  });
});