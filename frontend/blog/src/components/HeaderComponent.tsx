import { useAuth } from '../context/AuthContext'

function HeaderComponent() {
    const { author } = useAuth();
    function signOut() {
        localStorage.removeItem("session_token");
        window.location.href = "/login";
    }
    const isAdmin = author && author.role!=undefined && author?.role.toLowerCase() === "administrator";
    return (
        <ul>
            <li><a href="/home">Home</a></li>
            {
                author ?
                    (<>
                        <li><a href="/profile">Profile</a></li>
                        {
                            isAdmin?
                            (<li><a href="/categories">Categories</a></li>):
                            (<></>)
                        }
                        <li><a href="/post">New Post</a></li>
                        <li><a onClick={signOut}>Sign out</a></li>
                    </>) :
                    (<>
                        <li><a href="/login">Sign in</a></li>
                        <li><a href="/register">Sign up</a></li>
                    </>)
            }
        </ul>
    );
}
export default HeaderComponent;