import type { Post } from "../models/Post";

function postComponent({ post }: { post: Post }) {
    const sliceSize = 60;
    const slicedContent:string  = post.content.length>sliceSize?`${post.content.slice(0,sliceSize).trim()}...`:post.content;
    return (
        <div>
            <h3 className={`title-${post.id}`} key={`title-${post.id}`}><a href={`/post/${post.id}`}>{post.title}</a></h3>
            <p className={`poster-${post.id}`} key={`poster-${post.id}`}>by <a href={`/profile/${post.author.id}`}>{post.author.name}</a></p>
            <p className={`txtArea-${post.id}`} key={`txtArea-${post.id}`}>{slicedContent}</p>
            {post.categories.map(cat => <p className={`cat-${cat.id}-post-${post.id}`} key={`cat-${cat.id}-post-${post.id}`}>{cat.name}</p>)}
        </div>
    );
}

export default postComponent;