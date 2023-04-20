/**
 * The constant username for the extension user.
 * @type {string}
 */
const extensionUserName = "Mike Camara";

/**
 * Retrieves the list of participants from the DOM.
 * @returns {string[]} An array of participant names.
 */
const getParticipants = () => {
  // Query all DOM elements with the attribute 'data-self-name'
  const participantElements = document.querySelectorAll('[data-self-name]');

  // Map the elements to their text content (names) and replace "You" with the extension user's name
  return Array.from(participantElements).map((element) => {
    const name = element.textContent;
    return name === "You" ? extensionUserName : name;
  });
};

/**
 * Handles incoming messages from the background script.
 * @param {Object} request - The message payload.
 * @param {Object} sender - The sender's information.
 * @param {Function} sendResponse - A function to send a response back to the sender.
 */
const handleMessage = (request, sender, sendResponse) => {
  if (request.action === "shuffleParticipants") {
    const participants = getParticipants();
    sendResponse({ participants });
  }
};

// Add a listener for incoming messages from the background script
chrome.runtime.onMessage.addListener(handleMessage);
