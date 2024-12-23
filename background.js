chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "quickAnswer",
    title: "Get Quick Answer",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "quickAnswer") {
    getQuickAnswer(info.selectionText);
  }
});

async function getQuickAnswer(selectedText) {
  try {
    // Get API key from storage
    const result = await chrome.storage.sync.get(['apiKey']);
    const apiKey = result.apiKey;

    if (!apiKey) {
      throw new Error('Please set your Gemini API key in the extension settings');
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Please provide a brief, direct answer to this question: ${selectedText}`
          }]
        }]
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0].content) {
      const answer = data.candidates[0].content.parts[0].text;
      
      // Show the answer in a popup
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "showAnswer",
          answer: answer
        });
      });
    } else {
      throw new Error('Invalid response from Gemini API');
    }
  } catch (error) {
    console.error('Error:', error);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "showAnswer",
        answer: `Error: ${error.message}`
      });
    });
  }
}