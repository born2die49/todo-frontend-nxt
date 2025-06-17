const apiService = {
  get: async function(url: string, params?: Record<string, any>): Promise<any> {
    const headers = await this.prepareHeaders();
    let queryString = '';
    if (params) {
      queryString = '?' + new URLSearchParams(params).toString();
    }
    console.log('GET Request:', `${url}${queryString}`);
    return fetch(`${url}${queryString}`, {
      method: 'GET',
      headers: headers,
    })
    .then(this.handleResponse)
    .catch(this.handleError);
  },

  post: async function(url: string, data: any, isFormData: boolean = false): Promise<any> {
    const headers = await this.prepareHeaders(isFormData);
    console.log('POST Request:', url, data);
    return fetch(url, {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
      headers: headers,
    })
    .then(this.handleResponse)
    .catch(this.handleError);
  },

  postFormData: async function(url: string, formData: FormData): Promise<any> {
    const headers = await this.prepareHeaders(true);
    console.log('POST Request:', url, formData);
    return fetch(url, {
      method: 'POST',
      body: formData,
      headers: headers,
    })
    .then(this.handleResponse)
    .catch(this.handleError);
  },

  put: async function(url: string, data: any, isFormData: boolean = false): Promise<any> {
    const headers = await this.prepareHeaders(isFormData);
    console.log('PUT Request:', url, data);
    return fetch(url, {
      method: 'PUT',
      body: isFormData ? data : JSON.stringify(data),
      headers: headers,
    })
    .then(this.handleResponse)
    .catch(this.handleError);
  },

  patch: async function(url: string, data: any, isFormData: boolean = false): Promise<any> {
  const headers = await this.prepareHeaders(isFormData);
  console.log('PATCH Request:', url, data);
  return fetch(url, {
    method: 'PATCH',
    body: isFormData ? data : JSON.stringify(data),
    headers: headers,
  })
  .then(this.handleResponse)
  .catch(this.handleError);
},

  delete: async function(url: string): Promise<any> {
    const headers = await this.prepareHeaders();
    console.log('DELETE Request:', url);
    return fetch(url, {
      method: 'DELETE',
      headers: headers,
    })
    .then(this.handleResponse)
    .catch(this.handleError);
  },

  prepareHeaders: async function(isFormData: boolean = false): Promise<HeadersInit> {
    const headers: HeadersInit = {
      'Accept': 'application/json',
    };
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  },

  handleResponse: async function(response: Response) {
    if (response.status === 204) { // No Content
      return null;
    }
    const responseData = await response.json();
    if (!response.ok) {
      console.error('API Error Response:', response.status, responseData);
      const error: any = new Error(responseData.detail || responseData.message || response.statusText || 'API request failed');
      error.response = response;
      error.data = responseData; // Attach full response data
      error.status = response.status;
      return Promise.reject(error);
    }
    return responseData;
  },

  handleError: function(error: any) {
    console.error('API Service Error:', error);
    
    return Promise.reject(error.data || error);
  }
}

export default apiService;