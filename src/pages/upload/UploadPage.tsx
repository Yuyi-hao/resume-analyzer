import { useState, type FormEvent } from "react";
import Navbar from "../../components/Navbar";
import FileUploader from "../../components/FileUploader";

const UploadPage = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File|null>(null); 

    const handleFileSubmit = (file: File|null) => {
        setFile(file);
    }

    const handleSubmit = (event:FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);
        const companyName = formData.get('company-name');
        const jobTitle = formData.get('job-title');
        const jobDescription = formData.get('job-description');
        console.log(companyName)
        return true;
    }

    return <main className="bg-cover bg-[url('/images/bg-main.svg')]">
        <Navbar/>
        <section className="main-section">
            <div className="page-heading">
                <h1>Smart feedback for your job</h1>
                {isProcessing?(<>
                    {statusText}
                    <img src="/images/resume-scan.gif" alt="scan gif" className="w-full" />
                </>):(
                    <h2>Drop your resume for review</h2>
                )}
                {!isProcessing && (
                    <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                        <div className="form-div">
                            <label htmlFor="company-name">Company Name</label>
                            <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
                        </div>
                        <div className="form-div">
                            <label htmlFor="job-title">Job Title</label>
                            <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
                        </div>
                        <div className="form-div">
                            <label htmlFor="job-description">Job Description</label>
                            <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description"></textarea>
                        </div>
                        
                        <div className="form-div">
                            <label htmlFor="file-uploader">Upload Resume</label>
                            <FileUploader onFileSelect={handleFileSubmit}/>
                        </div>

                        <button className="primary-button" type="submit">Analyze</button>

                    </form>
                )}
            </div>
        </section>
    </main>
}

export default UploadPage;