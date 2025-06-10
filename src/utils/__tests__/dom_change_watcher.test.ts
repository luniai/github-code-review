import { describe, it, expect, vi, afterEach } from 'vitest';
import { parseHTML } from 'linkedom';
import { domChangeWatcher } from '../dom_change_watcher';

afterEach(() => {
  // cleanup globals after each test
  delete (global as any).document;
  delete (global as any).MutationObserver;
});

describe('domChangeWatcher', () => {
  it('invokes callback when matching elements change', async () => {
    const { window } = parseHTML('<html><body><div class="item"></div></body></html>');
    (global as any).document = window.document;
    class MockObserver {
      cb: MutationCallback;
      static instance: MockObserver | null = null;
      disconnected = false;
      constructor(cb: MutationCallback) {
        this.cb = cb;
        MockObserver.instance = this;
      }
      observe() {}
      disconnect() { this.disconnected = true; }
      trigger() { if (!this.disconnected) this.cb([], this as unknown as MutationObserver); }
    }
    (global as any).MutationObserver = MockObserver;

    const callback = vi.fn();
    domChangeWatcher('.item', callback);

    const div = window.document.createElement('div');
    div.className = 'item';
    window.document.body.appendChild(div);
    (global as any).MutationObserver.instance.trigger();
    await new Promise((r) => setTimeout(r, 0));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('stops observing after disconnect', async () => {
    const { window } = parseHTML('<html><body></body></html>');
    (global as any).document = window.document;
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

    const callback = vi.fn();
    const disconnect = domChangeWatcher('.item', callback);

    disconnect();

    const div = window.document.createElement('div');
    div.className = 'item';
    window.document.body.appendChild(div);
    if (MockObserver.instance) MockObserver.instance.trigger();
    await new Promise((r) => setTimeout(r, 0));
    expect(callback).not.toHaveBeenCalled();
  });
});
