import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import type { Post } from '../models/Post'
import HeaderComponent from '../components/HeaderComponent'
import PostComponent from '../components/PostComponent'
import { useAuth } from '../context/AuthContext'
import type { Author } from '../models/Author'

function PostPage() {
  const { author } = useAuth();
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null);

  const { postId } = useParams<{ postId: string }>()

  useEffect(() => {
    if (!postId) return console.log("error on postId");
    const id = parseInt(postId)
    if (!id) return console.log("error on postId");

    async function fetchPost() {
      try {
        setLoading(true)
        const apiUrl = import.meta.env.VITE_API
        const url = `${apiUrl}/post/${id}`
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`)
        const data = await res.json()
        setPost(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch post')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [postId])

  if (!postId) return null
  if (loading) return <div>Loading...</div>
  if (error || !post)
    return (
      <div>
        <h3>Post not found</h3>
      </div>
    );

  return (
    <>
      <HeaderComponent key={"header"}/>
      <div>
        <div>
            <h3 className={`title-${post.id}`} key={`title-${post.id}`}>{post.title}</h3>
            <p className={`txtArea-${post.id}`} key={`txtArea-${post.id}`}>{post.content}</p>
            {post.categories.map(cat => <p className={`cat-${cat.id}-post-${post.id}`} key={`cat-${cat.id}-post-${post.id}`}>{cat.name}</p>)}
        </div>
      </div>
    </>
  )
}

export default PostPage
