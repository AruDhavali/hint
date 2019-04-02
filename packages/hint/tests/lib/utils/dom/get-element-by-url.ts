import test from 'ava';

import createHTMLDocument from '../../../../src/lib/utils/dom/create-html-document';
import getElementByUrl from '../../../../src/lib/utils/dom/get-element-by-url';

test('Find by URL match (no match)', (t) => {
    const dom = createHTMLDocument(`
        <img src="test1.png">
    `);

    const element = getElementByUrl(dom, 'http://example.com/test2.png', 'http://example.com/index.html');

    t.is(element, null);
});

test('Find by URL match (no match, different origin)', (t) => {
    const dom = createHTMLDocument(`
        <img src="test.png">
    `);

    const element = getElementByUrl(dom, 'http://example2.com/test.png', 'http://example.com/index.html');

    t.is(element, null);
});

test('Find by URL match (relative src)', (t) => {
    const url = 'test.png';
    const dom = createHTMLDocument(`
        <img src="${url}">
    `);

    const element = getElementByUrl(dom, `http://example.com/${url}`, 'http://example.com/index.html');

    t.not(element, null);
    t.is(element!.getAttribute('src'), url);
});

test('Find by URL match (relative subdirectory src)', (t) => {
    const url = '../images/test.png';
    const dom = createHTMLDocument(`
        <img src="${url}">
    `);

    const element = getElementByUrl(dom, 'http://example.com/images/test.png', 'http://example.com/pages/test.html');

    t.not(element, null);
    t.is(element!.getAttribute('src'), url);
});

test('Find by URL match (root relative subdirectory src)', (t) => {
    const url = '/images/test.png';
    const dom = createHTMLDocument(`
        <img src="${url}">
    `);

    const element = getElementByUrl(dom, `http://example.com${url}`, 'http://example.com/pages/test.html');

    t.not(element, null);
    t.is(element!.getAttribute('src'), url);
});

test('Find by URL match (absolute src)', (t) => {
    const url = 'http://example2.com/images/test.png';
    const dom = createHTMLDocument(`
        <img src="${url}">
    `);

    const element = getElementByUrl(dom, url, 'http://example.com/index.html');

    t.not(element, null);
    t.is(element!.getAttribute('src'), url);
});

test('Find by URL match (data-uri src)', (t) => {
    // Red dot example data-uri from https://en.wikipedia.org/wiki/Data_URI_scheme
    const url = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
    const dom = createHTMLDocument(`
        <img src="test.png">
        <img src="${url}">
    `);

    const element = getElementByUrl(dom, url, 'http://example.com/index.html');

    t.not(element, null);
    t.is(element!.getAttribute('src'), url);
});
