import { useState, type FormEvent } from "react";
import Navbar from "../../components/Navbar";
import FileUploader from "../../components/FileUploader";
import { usePuterStore } from "../../lib/puter";
import { convertPdfToImage } from "../../lib/pdf2img";
import { generateUUID } from "../../lib/utils";
import { prepareInstructions } from "../../constants";
import { useNavigate } from "react-router-dom";

const UploadPage = () => {
    const navigate = useNavigate();
    const {auth, isLoading, fs, ai, kv} = usePuterStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File|null>(null); 

    const handleFileSubmit = (file: File|null) => {
        setFile(file);
    }

    const handleAnalyze = async ({companyName, jobTitle, jobDescription, file}:{companyName:string, jobTitle:string, jobDescription:string, file:File}) =>{
        setIsProcessing(true);
        
        setStatusText('Uploading file...');
        const uploadedFile = await fs.upload([file]);
        if(!uploadedFile) return setStatusText('ERROR: Failed to Upload file');
        
        setStatusText('Converting to image...');
        const imageFile = await convertPdfToImage(file);
        if(!imageFile) return setStatusText('ERROR: Failed to Convert to image');

        setStatusText('Uploading to image...');
        const uploadedImage = await fs.upload([imageFile.file]);
        if(!uploadedImage) return setStatusText('ERROR: Failed to Upload image');
        
        setStatusText('Preparing data...');
        
        const uuid = generateUUID();
        
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName: companyName,
            jobTitle:jobTitle,
            jobDescription:jobDescription,
            feedback: ''
        }
        
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText(`Analyzing...`);
        
        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({jobTitle, jobDescription})
        );
        
        if(!feedback) return setStatusText('ERROR: No feedback from api');
        const feedbackText = typeof(feedback.message.content)==='string'?feedback.message.content:feedback.message.content[0];

        data.feedback = JSON.parse(feedbackText.text);
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText('Analysis Complete');
        navigate(`/resume/review/${uuid}`)
    }

    const handleSubmit = (event:FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);
        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;
        if(!file) return;
        handleAnalyze({companyName, jobTitle, jobDescription, file});
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