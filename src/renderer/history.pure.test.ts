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