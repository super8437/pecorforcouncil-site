const { JSDOM } = require('jsdom');

describe('priorities hash handling', () => {
  const loadWithHash = (
    hash,
    { top = 100, scrollY = 10, headerH = '20' } = {}
  ) => {
    const dom = new JSDOM('<details id="safe"></details>', {
      url: 'https://example.org/',
    });
    const { window } = dom;
    window.location.hash = hash;

    global.window = window;
    global.document = window.document;
    global.location = window.location;
    window.scrollTo = jest.fn();
    Object.defineProperty(window, 'scrollY', { value: scrollY, configurable: true });
    global.getComputedStyle = () => ({ getPropertyValue: () => headerH });
    document.querySelector = jest.fn(() => ({
      nodeName: 'details',
      getBoundingClientRect: () => ({ top }),
    }));

    jest.isolateModules(() => {
      require('../js/priorities');
    });

    return { query: document.querySelector, scrollTo: window.scrollTo };
  };

  afterEach(() => {
    if (global.window) {
      global.window.close();
    }
    delete global.window;
    delete global.document;
    delete global.location;
    delete global.getComputedStyle;
  });

  test('ignores malicious hashes', () => {
    const { query, scrollTo } = loadWithHash('#<img src=x>');
    expect(query).not.toHaveBeenCalled();
    expect(scrollTo).not.toHaveBeenCalled();
  });

  test('processes safe hashes and scrolls to offset', () => {
    const { query, scrollTo } = loadWithHash('#safe');
    expect(query).toHaveBeenCalledWith('#safe');
    expect(scrollTo).toHaveBeenCalledWith({ top: 90, behavior: 'smooth' });
  });
});
