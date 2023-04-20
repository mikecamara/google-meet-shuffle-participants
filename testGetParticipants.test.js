
const parseAdditionalNames = require('./popup');
const getParticipants = require('./content');

// Mock the Chrome API
global.chrome = {
    tabs: {
      query: jest.fn(),
      sendMessage: jest.fn(),
    },
    runtime: {
      onMessage: {
        addListener: jest.fn(),
      },
    },
    clipboard: {
      writeText: jest.fn(),
    },
  };
  
// Include the TextEncoder and TextDecoder polyfills
global.TextEncoder = require('text-encoding').TextEncoder;
global.TextDecoder = require('text-encoding').TextDecoder;

// Include JSDOM to emulate a browser-like environment
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><html><body></body></html>');
global.document = dom.window.document;

// Load the popup.html file into the JSDOM environment
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, 'popup.html'), 'utf8');
global.document.body.innerHTML = html;

  
  describe('getParticipants', () => {
    it('returns an array of participant names', () => {
      // Mock the DOM elements for testing
      document.body.innerHTML = `
        <div>
          <span data-self-name="Alice">Alice</span>
          <span data-self-name="You">You</span>
          <span data-self-name="Bob">Bob</span>
        </div>
      `;
      const expectedOutput = ['Alice', 'Mike Camara', 'Bob'];
      const output = getParticipants();
      expect(output).toEqual(expectedOutput);
    });
  });
  