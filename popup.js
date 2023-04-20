/**
 * Parses additional names from a given input string.
 * @param {string} input - The input string containing additional names.
 * @returns {string[]} An array of parsed names.
 */
const parseAdditionalNames = (input) => {
  const separators = /[,\s]+/;
  return input.split(separators).filter((name) => name.length > 0);
};

/**
 * Shuffles an array using the Fisher-Yates algorithm.
 * @param {any[]} array - The array to be shuffled.
 * @returns {any[]} A new shuffled array.
 */
const shuffle = (array) => {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

/**
 * Appends names to the given participant list element.
 * @param {string[]} names - The array of names to be appended.
 * @param {HTMLElement} participantList - The participant list element to append names to.
 */
const addNamesToList = (names, participantList) => {
  names.forEach((name) => {
    const listItem = document.createElement("li");
    listItem.textContent = name;
    participantList.appendChild(listItem);
  });
};

/**
 * Creates a copy button and handles its click event.
 * @param {HTMLElement} shuffleButton - The shuffle button element.
 * @returns {HTMLElement} The created copy button element.
 */
const createCopyButton = (shuffleButton) => {
  const copyButton = document.createElement("button");
  copyButton.textContent = "Copy List";
  copyButton.classList.add("copy-button");
  copyButton.addEventListener("click", () => {
    const participantList = document.getElementById("participantList");
    const participantNames = Array.from(participantList.children).map((li) => li.textContent);
    const textToCopy = participantNames.join("\n");
    navigator.clipboard.writeText(textToCopy);
    copyButton.textContent = "Copied!";
    setTimeout(() => {
      copyButton.textContent = "Copy List";
    }, 2000);
  });
  return copyButton;
};

/**
 * Handles the shuffle button click event.
 */
const onShuffleButtonClick = () => {
  // Get the input element containing additional names
  const participantElements = document.getElementById("additionalNames");
  // Get the input value (names entered by the user)
  const namesFromInput = participantElements.value;

  // Query the active tab in the current window
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // Send a message to the active tab to request the list of participants
    chrome.tabs.sendMessage(tabs[0].id, { action: "shuffleParticipants" }, (response) => {
      // Get the participant list element
      const participantList = document.getElementById("participantList");
      // Clear the current participant list
      participantList.innerHTML = "";

      // Shuffle the combined list of participants from the response and the additional names
      const shuffledNames = shuffle([...response.participants, ...parseAdditionalNames(namesFromInput)]);
      // Add the shuffled names to the participant list
      addNamesToList(shuffledNames, participantList);

      // Check if there's an existing copy button and remove it if it exists
      const existingCopyButton = document.querySelector(".copy-button");
      if (existingCopyButton) {
        existingCopyButton.remove();
      }

      // Create a new copy button and insert it after the shuffle button
      const copyButton = createCopyButton();
      shuffleButton.after(copyButton);
    });
  });
};


const shuffleButton = document.getElementById("shuffleButton");
shuffleButton.addEventListener("click", onShuffleButtonClick);
