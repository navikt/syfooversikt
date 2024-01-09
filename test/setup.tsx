import path from 'path';
// @ts-ignore
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

function localStorage() {
  let storage = {};
  return {
    getItem: function (key: string) {
      return key in storage ? (storage as any)[key] : null;
    },
    setItem: function (key: string, value: any) {
      (storage as any)[key] = value || '';
    },
  };
}

(global as any).HTMLElement = window.HTMLElement;
(global as any).localStorage = localStorage();
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
