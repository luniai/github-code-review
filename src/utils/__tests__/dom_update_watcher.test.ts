import { describe, it, expect, vi, afterEach } from 'vitest';
import { parseHTML } from 'linkedom';
import { domUpdateWatcher } from '../dom_update_watcher';

afterEach(() => {
  delete (global as any).document;
  delete (global as any).MutationObserver;
});

describe('domUpdateWatcher', () => {
  it('invokes callback when location changes and DOM updates', async () => {
    const { window } = parseHTML('<html><body></body></html>');
    const doc = window.document;
    (global as any).document = doc;
    class MockObserver {
      cb: MutationCallback;
      static instance: MockObserver | null = null;
      disconnected = false;
      constructor(cb: MutationCallback) { this.cb = cb; MockObserver.instance = this; }
      observe() {}
      disconnect() { this.disconnected = true; }
      trigger() { if (!this.disconnected) this.cb([], this as unknown as MutationObserver); }
    }
    (global as any).MutationObserver = MockObserver;

    Object.defineProperty(doc, 'readyState', { value: 'complete', configurable: true });
    Object.defineProperty(doc, 'location', { value: { href: 'https://example.com/a' }, writable: true, configurable: true });

    const callback = vi.fn();
    domUpdateWatcher(callback);

    doc.location.href = 'https://example.com/b';
    doc.body.appendChild(doc.createElement('div'));
    (global as any).MutationObserver.instance.trigger();
    await new Promise((r) => setTimeout(r, 0));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not invoke callback when location does not change', async () => {
    const { window } = parseHTML('<html><body></body></html>');
    const doc = window.document;
    (global as any).document = doc;
    class MockObserver {
      cb: MutationCallback;
      static instance: MockObserver | null = null;
      disconnected = false;
      constructor(cb: MutationCallback) { this.cb = cb; MockObserver.instance = this; }
      observe() {}
      disconnect() { this.disconnected = true; }
      trigger() { if (!this.disconnected) this.cb([], this as unknown as MutationObserver); }
    }
    (global as any).MutationObserver = MockObserver;

    Object.defineProperty(doc, 'readyState', { value: 'complete', configurable: true });
    Object.defineProperty(doc, 'location', { value: { href: 'https://example.com/a' }, writable: true, configurable: true });

    const callback = vi.fn();
    domUpdateWatcher(callback);

    doc.body.appendChild(doc.createElement('div'));
    if (MockObserver.instance) MockObserver.instance.trigger();
    await new Promise((r) => setTimeout(r, 0));
    expect(callback).not.toHaveBeenCalled();
  });
});
