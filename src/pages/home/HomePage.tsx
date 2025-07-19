import Navbar from "../../components/Navbar";
import ResumeCard from "../../components/ResumeCard";
import { resumes } from "../../constants";

const HomePage = () => {
    return <main className="bg-cover bg-[url('/images/bg-main.svg')]">
        <Navbar/>
        <section className="main-section">
            <div className="page-heading py-16">
                <h1>Track your Application & resume rating</h1>
                <h2>Review your submission and check AI-powered feedback.</h2>
            </div>
            {resumes.length > 0 && 
            <div className="resumes-section">
                {resumes.map((resume) => (
                    <ResumeCard key={resume.id} resume={resume} />
                ))}
            </div>};
        </section>
        
    </main>
}

export default HomePage;