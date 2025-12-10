import type { Post } from "../models/Post";

function postComponent({post}: {post:Post})  {
    return (
        <div>
            <h3>{post.title}</h3>
            <textarea>{post.content}</textarea>
            {
                post.categories.map(cat => <p>{cat.name}</p>)
            }
        </div>
    );
}

export default postComponent;