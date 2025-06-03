// Full mock for the Response object
export const createMockFetchResponse = (
  data: unknown,
  status: number = 200,
  statusText: string = 'OK'
): Response => ({
  ok: status >= 200 && status < 300,
  status,
  statusText,
  json: () => Promise.resolve(data),
  text: () => Promise.resolve(typeof data === 'string' ? data : JSON.stringify(data)),
  headers: new Headers(),
  redirected: false,
  type: 'basic',
  url: '',
  clone: () => { throw new Error('Not implemented') },
  body: null,
  bodyUsed: false,
  arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
  blob: () => Promise.resolve(new Blob()),
  formData: () => Promise.resolve(new FormData()),
} as unknown as Response);

// Default export is a jest mock function
const mockFetch = jest.fn();

global.fetch = mockFetch;

export default mockFetch;