import { useLocation, useNavigate } from "react-router-dom";
import { usePuterStore } from "../../lib/puter";
import { useEffect } from "react";

const Auth = () => {
    const {isLoading, auth} = usePuterStore();
    const location = useLocation();
    const nextLocation = location.search.split('next=')[1];
    const navigate = useNavigate();

    useEffect(() => {
        if(!auth.isAuthenticated){
            navigate(`/auth?next=/`);
        } 
        
    }, [auth.isAuthenticated, nextLocation]);

    return <main className="bg-cover min-h-screen flex items-center justify-center bg-[url('/images/bg-auth.svg')]">
        <div className="gradient-border shadow-lg">
            <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
                <div className="flex flex-col items-center text-center">
                    <h1>Welcome</h1>
                    <h2>Login in to continue</h2>
                </div>
                <div>
                    {isLoading?(<button className="auth-button animate-pulse"><p>Logging you in ...</p></button>):(
                        <>
                            {auth.isAuthenticated?(
                                <button className="auth-button" onClick={auth.signOut}><p>Log out</p></button>
                            ): (
                                <button className="auth-button" onClick={auth.signIn}><p>Log in</p></button>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    </main>
}

export default Auth;