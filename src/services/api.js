import axios from 'axios'

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 5000,
})

export async function fetchProducts() {
  const { data } = await api.get('/posts', {
    params: { _limit: 6 },
  })

  return data.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.body,
  }))
}
