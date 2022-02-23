import path from 'path';
import MutationObserver from '@sheerun/mutationobserver-shim';
import { config } from 'dotenv';
import { JSDOM } from 'jsdom';

const dotEnvPath = path.resolve('.env');

config({
  path: dotEnvPath,
});

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

function copyProps(src: any, target: any) {
  const props = Object.getOwnPropertyNames(src)
    .filter((prop) => typeof target[prop] === 'undefined')
    .map((prop) => Object.getOwnPropertyDescriptor(src, prop));

  const propsAsUnknown = props as unknown;
  const propsAsPropertyDescriptorMap = propsAsUnknown as PropertyDescriptorMap;
  Object.defineProperties(target, propsAsPropertyDescriptorMap);
}

let temp: any = null;
const localS = {
  getItem() {
    return temp;
  },
  setItem(key: any, value: any) {
    temp = value;
  },
};

(global as any).HTMLElement = window.HTMLElement;
(global as any).localStorage = localS;
(global as any).XMLHttpRequest = window.XMLHttpRequest;

(global as any).window = window;
(global as any).document = window.document;
(global as any).navigator = {
  userAgent: 'node.js',
};
(global as any).window.APP_SETTINGS = {
  APP_ROOT: '/syfooversikt',
};
window.MutationObserver = MutationObserver;
copyProps(window, global);
