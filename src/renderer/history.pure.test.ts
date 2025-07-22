interface ApiRequest {
  id: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: string;
  date: string;
  status?: number;
}

function deleteRequest(history: ApiRequest[], id: string) {
  return history.filter(r => r.id !== id);
}

function addRequest(history: ApiRequest[], req: ApiRequest) {
  return [req, ...history].slice(0, 50);
}

describe('deleteRequest', () => {
  it('removes a request by id', () => {
    const reqs: ApiRequest[] = [
      { id: '1', url: 'a', method: 'GET', date: '2024-01-01' },
      { id: '2', url: 'b', method: 'POST', date: '2024-01-02' },
    ];
    const newHistory = deleteRequest(reqs, '1');
    expect(newHistory).toHaveLength(1);
    expect(newHistory[0].id).toBe('2');
  });
});

describe('addRequest', () => {
  it('adds a new request to the start of the history', () => {
    const reqs: ApiRequest[] = [
      { id: '1', url: 'a', method: 'GET', date: '2024-01-01' },
      { id: '2', url: 'b', method: 'POST', date: '2024-01-02' },
    ];
    const newReq: ApiRequest = { id: '3', url: 'c', method: 'PUT', date: '2024-01-03' };
    const newHistory = addRequest(reqs, newReq);
    expect(newHistory).toHaveLength(3);
    expect(newHistory[0]).toEqual(newReq);
  });

  it('keeps only the latest 50 requests', () => {
    const reqs: ApiRequest[] = Array.from({ length: 50 }, (_, i) => ({
      id: String(i + 1), url: 'x', method: 'GET', date: '2024-01-01'
    }));
    const newReq: ApiRequest = { id: '51', url: 'y', method: 'POST', date: '2024-01-02' };
    const newHistory = addRequest(reqs, newReq);
    expect(newHistory).toHaveLength(50);
    expect(newHistory[0]).toEqual(newReq);
    expect(newHistory[49].id).toBe('49');
  });
}); 