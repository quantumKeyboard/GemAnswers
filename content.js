chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showAnswer") {
    showPopup(request.answer);
  }
});

function showPopup(answer) {
  // Remove existing popup if any
  const existingPopup = document.getElementById('quick-answer-popup');
  if (existingPopup) {
    existingPopup.remove();
  }

  // Create and style the popup with forced styling
  const popup = document.createElement('div');
  popup.id = 'quick-answer-popup';
  popup.style.cssText = `
    position: fixed !important;
    top: 20px !important;
    right: 20px !important;
    max-width: 300px !important;
    padding: 15px !important;
    background: white !important;
    border: 1px solid #ccc !important;
    border-radius: 8px !important;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
    z-index: 2147483647 !important;
    font-family: Arial, sans-serif !important;
    color: #333 !important;
    pointer-events: auto !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    transform: none !important;
    clip: auto !important;
    clip-path: none !important;
    max-height: none !important;
    overflow: visible !important;
  `;

  // Add close button with forced styling
  const closeButton = document.createElement('button');
  closeButton.textContent = '×';
  closeButton.style.cssText = `
    position: absolute !important;
    top: 5px !important;
    right: 5px !important;
    border: none !important;
    background: none !important;
    cursor: pointer !important;
    font-size: 20px !important;
    color: #666 !important;
    padding: 5px !important;
    line-height: 1 !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    pointer-events: auto !important;
    z-index: 2147483647 !important;
  `;
  closeButton.onclick = () => popup.remove();

  // Add answer text with forced styling
  const answerText = document.createElement('p');
  answerText.textContent = answer;
  answerText.style.cssText = `
    margin: 0 !important;
    color: #333 !important;
    line-height: 1.4 !important;
    font-size: 14px !important;
    font-family: Arial, sans-serif !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    pointer-events: auto !important;
  `;

  popup.appendChild(closeButton);
  popup.appendChild(answerText);
  
  // Create a shadow DOM to further isolate our styles
  const container = document.createElement('div');
  const shadow = container.attachShadow({ mode: 'closed' });
  shadow.appendChild(popup);
  document.body.appendChild(container);

  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (container.parentNode) {
      container.remove();
    }
  }, 10000);
}