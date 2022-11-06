class ApiService {
  get(url: string): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => {
          if (response.status !== 200) {
            throw new Error('Invalid response status: ' + response.statusText);
          }
          return response.json();
        })
        .then((response) => {
          return resolve(response);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }
}

export default ApiService;
