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
  
  describe('parseAdditionalNames', () => {
    it('parses a string of comma-separated names', () => {
      const input = 'Alice, Bob, Carol';
      const expectedOutput = ['Alice', 'Bob', 'Carol'];
      const output = parseAdditionalNames(input);
      expect(output).toEqual(expectedOutput);
    });
  
    it('parses a string of space-separated names', () => {
      const input = 'Alice Bob Carol';
      const expectedOutput = ['Alice', 'Bob', 'Carol'];
      const output = parseAdditionalNames(input);
      expect(output).toEqual(expectedOutput);
    });
  
    it('parses a string of mixed separators', () => {
      const input = 'Alice, Bob Carol, Dave';
      const expectedOutput = ['Alice', 'Bob', 'Carol', 'Dave'];
      const output = parseAdditionalNames(input);
      expect(output).toEqual(expectedOutput);
    });
  
    it('ignores empty strings', () => {
      const input = 'Alice, Bob, , Dave';
      const expectedOutput = ['Alice', 'Bob', 'Dave'];
      const output = parseAdditionalNames(input);
      expect(output).toEqual(expectedOutput);
    });
  });
  