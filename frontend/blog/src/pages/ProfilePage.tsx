import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import HeaderComponent from '../components/HeaderComponent';
import PostComponent from '../components/PostComponent';
import { useAuth } from '../context/AuthContext';
import type { Author } from '../models/Author';
import type { Post } from '../models/Post';
import EditForm from '../components/EditForm';

export default function ProfilePage() {
    const { author } = useAuth();
    const [targetAuthor, setTargetAuthor] = useState<Author | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [canLoad, SetCanLoad] = useState<boolean>(false);
    const [posts, setPosts] = useState<Post[]>([]);

    const { authorId } = useParams<{ authorId: string }>();

    useEffect(() => {
        if (author === null) return;

        const apiUrl = import.meta.env.VITE_API;
        const id = authorId ? parseInt(authorId) : author.id;
        if (!id) return;

        async function fetchAuthor() {
            try {
                setLoading(true);

                const res = await fetch(`${apiUrl}/author/${id}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const data = await res.json();
                setTargetAuthor(data);

            } catch (err: any) {
                setError(err.message || "Failed to fetch author");
            } finally {
                setLoading(false);
            }
        }

        fetchAuthor();
    }, [author, authorId]);

    async function fetchUserPosts(author: any) {
        try {            
            setLoading(true);

            const apiUrl = import.meta.env.VITE_API;

            const id = parseInt(author.id);
            const url = `${apiUrl}/author/${id}/posts/`;

            const res = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    "page": "0",
                    "size": "20",
                }
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            
            setPosts(data);
            SetCanLoad(true);

        } catch (error) {
            setPosts([]);
            console.error('Error fetching posts:', error);
            setError(error instanceof Error ? error.message : 'Failed to fetch posts');
        } finally {
            setLoading(false);
        }
    }

    if (!author)
        return <div>Loading User...</div>;

    if (loading)
        return <div>Loading...</div>;

    if (error || !targetAuthor)
        return <h3>Author not found</h3>;

    const canEdit =
        author.id === targetAuthor.id ||
        author.role.toLowerCase() === "administrator";

    return (
        <>
            <HeaderComponent />

            <div style={{ padding: "20px" }}>
                <h2>Perfil de {targetAuthor.name}</h2>
                <p>Email: {targetAuthor.email}</p>
                <p>Nome: {targetAuthor.name}</p>
                <p>Role: {targetAuthor.role}</p>

                {canEdit && <EditForm targetAuthor={targetAuthor} />}
            </div>
            {
                canLoad ?
                    (
                        posts && posts.length > 0 ?
                            (<div>
                                {posts?.map((post) => (
                                    <PostComponent key={post.id} post={post} />
                                ))}
                            </div>) :
                            <div>No posts yet</div>
                    ) :
                    (
                        <button onClick={async () => { await fetchUserPosts(targetAuthor); }}>Load user posts</button>
                    )
            }
        </>
    );
}
