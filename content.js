/**
 * The constant username for the extension user.
 * @type {string}
 */
const extensionUserName = "Mike Camara";

const getParticipants = () => {
  // Query all DOM elements with the attribute 'data-self-name'
  const participantElements = document.querySelectorAll('[data-self-name]');

  // Map the elements to their direct child's text content (names) and replace "You" with the extension user's name
  const participants = Array.from(participantElements).map((element) => {
    // If the childNode exists and is of type TEXT_NODE (Node.TEXT_NODE is 3)
    const name = (element.firstChild && element.firstChild.nodeType === Node.TEXT_NODE)
                   ? element.firstChild.nodeValue
                   : element.textContent;
    return name.trim() === "You" ? extensionUserName : name.split(" ")[0].trim() + " " + name.split(" ")[1][0].trim();
  });

  return participants;
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

module.exports = { getParticipants };
