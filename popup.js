document.getElementById('submit').addEventListener('click', async () => {
  try {
    const question = document.getElementById('question').value;
    if (!question) return;

    console.log(`Question asked: ${question}`);

    // Example: scrape the current page and get the page title and URL
    const pageData = await scrapeCurrentPage();

    // Example: send the question and page data to ChatGPT API and get the answer
    const answer = await fetchChatGPTAnswer(question, pageData);

    // Display the answer in the popup
    document.getElementById('answer').innerHTML = answer;
  } catch (error) {
    // Handle the error here, e.g., display an error message in the popup
    document.getElementById('answer').innerHTML = `Error: ${error.message}`;
  }
});

async function fetchChatGPTAnswer(question, pageData) {
  // ... unchanged ...
}

async function scrapeCurrentPage() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const pageData = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      return {
        title: document.title,
        url: window.location.href
      };
    }
  });

  console.log('Page data:', pageData); // Update this line for better debugging

  if (!pageData || !pageData[0] || !pageData[0].result || !pageData[0].result.title || !pageData[0].result.url) {
    throw new Error('Unexpected page data format');
  }

  return pageData[0].result;
}
