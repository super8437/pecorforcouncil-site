const { JSDOM } = require('jsdom');

describe('priorities hash handling', () => {
  const loadWithHash = (hash) => {
    const dom = new JSDOM('<details id="safe"></details>', { url: 'https://example.org/' });
    const { window } = dom;
    window.location.hash = hash;

    global.window = window;
    global.document = window.document;
    global.location = window.location;
    window.requestAnimationFrame = (fn) => fn();
    window.scrollBy = jest.fn();
    global.requestAnimationFrame = window.requestAnimationFrame;
    global.getComputedStyle = () => ({ getPropertyValue: () => '0' });
    document.querySelector = jest.fn(() => ({ nodeName: 'details' }));

    jest.isolateModules(() => {
      require('../js/priorities');
    });

    return { query: document.querySelector, window };
  };

  afterEach(() => {
    if (global.window) {
      global.window.close();
    }
    delete global.window;
    delete global.document;
    delete global.location;
    delete global.getComputedStyle;
    delete global.requestAnimationFrame;
  });

  test('ignores malicious hashes', () => {
    const { query } = loadWithHash('#<img src=x>');
    expect(query).not.toHaveBeenCalled();
  });

  test('processes safe hashes', () => {
    const { query } = loadWithHash('#safe');
    expect(query).toHaveBeenCalledWith('#safe');
  });
});
