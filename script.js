
  var blocks = ['block1', 'block2', 'block3', 'block4', 'block5'];

  function toggleVisibility(id) {
  var x = document.getElementById(id);
  var msg = document.getElementById('message');
  if (x.style.display === "none") {
  x.style.display = "block";
  msg.style.display = "none";
} else {
  x.style.display = "none";
  var isAllHidden = blocks.every(function(blockId) {
  return document.getElementById(blockId).style.display === "none";
});
  if(isAllHidden) {
  msg.style.display = "block";
}
}
}

  fetch('https://georgeeliotarchive.org/middlemarch/html/Novel_1.html')
  .then(response => response.text())
  .then(data => {
  document.getElementById('notes_html').innerHTML = data;
})
  .catch(error => {
  console.error('Error loading page:', error);
});

  fetch('https://georgeeliotarchive.org/middlemarch/html/SS_2.html')
  .then(response => response.text())
  .then(data => {
  document.getElementById('ss_html').innerHTML = data;
})
  .catch(error => {
  console.error('Error loading page:', error);
});

  fetch('https://georgeeliotarchive.org/middlemarch/html/PP_3.html')
  .then(response => response.text())
  .then(data => {
  document.getElementById('pp_html').innerHTML = data;
})
  .catch(error => {
  console.error('Error loading page:', error);
});

  fetch('https://georgeeliotarchive.org/middlemarch/html/Notes_4.html')
  .then(response => response.text())
  .then(data => {
  document.getElementById('fn_html').innerHTML = data;
})
  .catch(error => {
  console.error('Error loading page:', error);
});

  fetch('https://georgeeliotarchive.org/middlemarch/html/Comments_5.html')
  .then(response => response.text())
  .then(data => {
  document.getElementById('co_html').innerHTML = data;
})
  .catch(error => {
  console.error('Error loading page:', error);
});

  // Preventing default anchor tag behavior
  document.addEventListener("DOMContentLoaded", function(event) {
  var anchorLinks = document.querySelectorAll('a[href^="#"]');

  for (var i = 0; i < anchorLinks.length; i++) {
  anchorLinks[i].addEventListener('click', function(e) {
  e.preventDefault(); // This prevents the default scroll behavior

  var hash = this.getAttribute('href');
  var target = document.querySelector(hash);
  if (target) {
  // Add any additional logic here if needed when a link is clicked
}
});
}
});
