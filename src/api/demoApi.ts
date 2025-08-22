import { apiCall, silentApiCall } from './apiUtils';

/**
 * GET request (shows loading screen by default)
 * Example: Fetch posts by user ID
 */
export const getPosts = async () => {
  const response = await apiCall({
    method: 'GET',
    url: '/photos',
  });

  return response.data;
};

/**
 * Silent GET request (no loading screen)
 * Example: Fetch comments silently
 */
export const fetchCommentsSilently = async () => {
  const response = await silentApiCall({
    method: 'GET',
    url: '/comments',
    params: {
      postId: 1,
    },
  });

  return response.data;
};

/**
 * POST request with JSON body
 * Example: Create a new post
 */
export const createPost = async () => {
  const response = await apiCall({
    method: 'POST',
    url: '/posts',
    data: {
      title: 'My New Post',
      body: 'This is a fake post for testing.',
      userId: 1,
    },
  });

  return response.data;
};

/**
 * PUT request for full resource update
 * Example: Update a post
 */
export const updatePost = async () => {
  const response = await apiCall({
    method: 'PUT',
    url: '/posts/1',
    data: {
      id: 1,
      title: 'Updated Post Title',
      body: 'Updated post body content.',
      userId: 1,
    },
  });

  return response.data;
};

/**
 * PATCH request for partial update
 * Example: Update post title only
 */
export const patchPost = async () => {
  const response = await apiCall({
    method: 'PATCH',
    url: '/posts/1',
    data: {
      title: 'Patched Title',
    },
  });

  return response.data;
};

/**
 * DELETE request
 * Example: Delete a post
 */
export const deletePost = async () => {
  const response = await apiCall({
    method: 'DELETE',
    url: '/posts/1',
  });

  return response.data;
};

/**
 * POST request with FormData
 * Example: Upload a file (mock, replace with real backend)
 */
export const uploadProfileImage = async (file: any) => {
  const formData = new FormData();

  formData.append('file', {
    uri: file.uri,
    type: file.type,
    name: file.name,
  });

  const response = await apiCall({
    method: 'POST',
    url: '/upload', // Replace with your actual backend endpoint
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  console.log('response---==-=', response);

  return response.data;
};
