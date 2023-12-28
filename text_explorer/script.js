function fetchTextFile(url) {
  return fetch(url).then(response => response.text());
}

function displayTextLineByLine(text, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  text.split('\n').forEach(line => {
    const div = document.createElement('div');
    div.textContent = line;
    container.appendChild(div);
  });
}
function countWords(text) {
  const words = text.match(/\w+/g) || [];
  const wordCounts = {};
  words.forEach(word => {
    word = word.toLowerCase();
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });
  return wordCounts;
}

function sortWordCounts(wordCounts) {
  return Object.entries(wordCounts).sort((a, b) => b[1] - a[1]);
}

function displayTopWords(wordCounts, containerId, count = 10) {
  const sortedWordCounts = sortWordCounts(wordCounts);
  const topWords = sortedWordCounts.slice(0, count);

  const container = document.getElementById(containerId);
  container.innerHTML = '<h3>Top Words</h3>';
  const list = document.createElement('ul');

  topWords.forEach(([word, freq]) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${word}`;
    list.appendChild(listItem);
  });

  container.appendChild(list);
}
function searchAndHighlight(text, containerId, searchTerm, exactMatch) {
  const container = document.getElementById(containerId);
  let regex;
  if (exactMatch) {
    regex = new RegExp(`\\b${searchTerm}\\b`, 'gi');
  } else {
    regex = new RegExp(searchTerm, 'gi');
  }
  container.innerHTML = text.replace(regex, match => `<span class="highlight">${match}</span>`);
  return (text.match(regex) || []).length;
}

function createFrequencyGraph(data, containerId) {
  const ctx = document.getElementById(containerId).getContext('2d');
  const sortedData = sortWordCounts(data);
  const labels = sortedData.map(item => item[0]).slice(0, 10);
  const freqData = sortedData.map(item => item[1]).slice(0, 10);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Word Frequency (Bar)',
        data: freqData,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        yAxisID: 'y-axis-1',
      }, {
        label: 'Word Frequency (Line)',
        data: freqData,
        type: 'line',
        borderColor: 'rgba(255, 99, 132, 1)',
        fill: false,
        tension: 0.4, // This adds the curve
        yAxisID: 'y-axis-1'
      }]
    },
    options: {
      scales: {
        'y-axis-1': {
          beginAtZero: true,
          position: 'left',
        }
      }
    }
  });
}


document.addEventListener('DOMContentLoaded', () => {
  const textFileUrl = 'middlemarch.txt'; // Replace with your text file URL
  let currentText = '';

  fetchTextFile(textFileUrl)
    .then(text => {
      currentText = text;
      displayTextLineByLine(text, 'content-box');
      const wordCounts = countWords(text);
      displayTopWords(wordCounts, 'top-words-container');
      createFrequencyGraph(wordCounts, 'word-frequency-graph');
    })
    .catch(error => console.error('Error fetching text file:', error));

  // Search functionality
  const searchBtn = document.getElementById('search-btn');
  searchBtn.addEventListener('click', () => {
    const searchTerm = document.getElementById('search-box').value;
    const exactMatch = document.getElementById('exact-match-checkbox').checked;
    const count = searchAndHighlight(currentText, 'content-box', searchTerm, exactMatch);
    document.getElementById('search-count').textContent = `Occurrences: ${count}`;
    document.getElementById('content-box').scrollTop = 0;
  });

  let searchResults = [];
  let currentResultIndex = -1;

  function highlightSearchResults(containerId, searchTerm, exactMatch) {
    const container = document.getElementById(containerId);
    let regex;
    if (exactMatch) {
      regex = new RegExp(`\\b${searchTerm}\\b`, 'gi');
    } else {
      regex = new RegExp(searchTerm, 'gi');
    }
    searchResults = [];
    currentResultIndex = -1;

    const lines = container.textContent.split('\n');
    container.innerHTML = '';

    lines.forEach((line, lineIndex) => {
      const lineDiv = document.createElement('div');
      lineDiv.innerHTML = line.replace(regex, (match, offset) => {
        const globalOffset = offset + line.split('\n', lineIndex).join('\n').length;
        searchResults.push(globalOffset);
        return `<span class="highlight">${match}</span>`;
      });
      container.appendChild(lineDiv);
    });

    return searchResults.length;
  }


  function scrollToCurrentResult(containerId) {
    if (currentResultIndex < 0 || currentResultIndex >= searchResults.length) return;

    const container = document.getElementById(containerId);
    const highlightedElements = container.querySelectorAll('.highlight');
    const currentElement = highlightedElements[currentResultIndex];

    if (currentElement) {
      currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      currentElement.classList.add('current-highlight');
    }
  }

  document.getElementById('prev-btn').addEventListener('click', () => {
    if (searchResults.length === 0) return;
    if (currentResultIndex > 0) {
      currentResultIndex--;
    } else {
      currentResultIndex = searchResults.length - 1;
    }
    scrollToCurrentResult('content-box');
  });

  document.getElementById('next-btn').addEventListener('click', () => {
    if (searchResults.length === 0) return;
    if (currentResultIndex < searchResults.length - 1) {
      currentResultIndex++;
    } else {
      currentResultIndex = 0;
    }
    scrollToCurrentResult('content-box');
  });

// Update the search button event listener
  searchBtn.addEventListener('click', () => {
    const searchTerm = document.getElementById('search-box').value;
    const exactMatch = document.getElementById('exact-match-checkbox').checked;
    const count = highlightSearchResults('content-box', searchTerm, exactMatch);
    document.getElementById('search-count').textContent = `Occurrences: ${count}`;
  });


});
