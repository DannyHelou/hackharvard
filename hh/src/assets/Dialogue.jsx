import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

const Dialogue = () => {
  const [step, setStep] = useState(0); // To track current question
  const [inputs, setInputs] = useState({
    bodyPart: '',         // initial selection
    description: '',      // q1: symptom description
    duration: '',         // q2: duration of symptom
    audioBool: false,     // depends on bodyPart | q3
    imageBool: false,     // depends on bodyPart | q3
    audioData: null,      // q3: audio data
    imageData: null,      // q3: image data
    painScale: ''         // q4: pain scale
  });

  const [diagnosis, setDiagnosis] = useState(''); // To store the diagnosis response
  const [loading, setLoading] = useState(false);  // To track loading state
  const [error, setError] = useState(null);       // To track errors
  const [imageBase64, setImageBase64] = useState(null); // to save image
  const [audioBase64, setAudioBase64] = useState(null); // to save image

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value
    });
  };

  // Logic to handle body part specific conditions for q3
  const handleBodyPartChange = (e) => {
    const selectedPart = e.target.value;
    setInputs({
      ...inputs,
      bodyPart: selectedPart,
      audioBool: selectedPart === 'throat',    // If throat is selected, enable audio
      imageBool: selectedPart !== 'throat'     // If not throat, enable image
    });
    setStep(1); // Move to the next step
  };

  // Function to handle form submission and fetch diagnosis from backend using axios
  const handleSubmit = async () => {
    setLoading(true); // Start loading
    setDiagnosis(''); // Clear previous diagnosis if any
    setError(null);   // Clear any previous error

    const payload = {
      bodyPart: inputs.bodyPart,
      description: inputs.description,
      duration: inputs.duration,
      audioData: inputs.audioData,
      imageData: inputs.imageData,
      painScale: inputs.painScale,
      imageBool: inputs.imageBool // Ensure this is sent correctly
    };

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/diagnose', payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status !== 200) {
        throw new Error(`Error fetching diagnosis: ${response.status} ${response.data}`);
      }

      setDiagnosis(response.data.diagnosis); // Set the diagnosis text returned from the backend
      console.log(diagnosis)
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.error || error.message); // Get the error message string
    } finally {
      setLoading(false); // End loading
    }
};

 // Function to handle image upload and convert it to Base64
 const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];  // Extract the base64 part of the string
      setImageBase64(base64String);  // Set Base64 string of the image
      setInputs({ ...inputs, imageData: base64String });  // Store the Base64 string in inputs.imageData
    };
    reader.readAsDataURL(file);  // Convert image to Base64
  }
};

const handleAudioChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];  // Extract the Base64 part of the string
      setAudioBase64(base64String);  // Set Base64 string of the audio
      setInputs({ ...inputs, audioData: base64String });  // Store the Base64 string in inputs.audioData
    };
    reader.readAsDataURL(file);  // Convert audio file to Base64
  }
};

const generatePDF = () => {
  const doc = new jsPDF();

  // Define margins
  const marginLeft = 10;
  const marginTop = 20;
  const pageWidth = doc.internal.pageSize.getWidth();  // Get page width to manage content fitting
  const pageHeight = doc.internal.pageSize.getHeight();  // Get page height for potential page breaks
  const textWidth = pageWidth - marginLeft * 2;  // Text width, accounting for left and right margins

  // Add title with margins
  doc.text("Doctor's Report", marginLeft, marginTop);

  // Add body part with margins
  let yPosition = marginTop + 10;  // Track the y position for next text
  doc.text(`Affected Body Part: ${inputs.bodyPart}`, marginLeft, yPosition);

  // Add symptoms with margins and wrap long text
  yPosition += 10;
  const symptomsText = doc.splitTextToSize(`Symptoms: ${inputs.description}`, textWidth);
  doc.text(symptomsText, marginLeft, yPosition);

  // Add duration with margins
  yPosition += symptomsText.length * 10;  // Increase y position based on text height
  doc.text(`Duration: ${inputs.duration}`, marginLeft, yPosition);

  // Add pain scale with margins
  yPosition += 10;
  doc.text(`Pain Scale: ${inputs.painScale}/10`, marginLeft, yPosition);

  // Add diagnosis with margins and wrap long text
  yPosition += 10;
  const diagnosisText = doc.splitTextToSize(`Diagnosis: ${diagnosis}`, textWidth);
  doc.text(diagnosisText, marginLeft, yPosition);

  // Adjust y position based on the length of the diagnosis
  yPosition += diagnosisText.length * 10;

  // Check if there's enough space for the image
  const spaceNeededForImage = 110;  // Approximate height needed for image + padding
  if (yPosition + spaceNeededForImage > pageHeight) {
    doc.addPage();  // Add a new page if there isn't enough space
    yPosition = marginTop;  // Reset yPosition for the new page
  }

  // If an image is available, add it to the PDF, ensuring it fits within the margins
  if (imageBase64) {
    yPosition += 10;  // Add some space before the image
    doc.text(`Patient Injury Image:`, marginLeft, yPosition);
    yPosition += 10;
    doc.addImage(imageBase64, 'JPEG', marginLeft, yPosition, 100, 100);  // Adjust the position and size of the image
  }

  // Save the PDF
  doc.save("doctor_report.pdf");
};

  return (
    <div className="dialogue-container">
      {/* Step-based dialogue */}
      {step === 0 && (
        <div className="dialogue-box">
          <p>Hello there, what happened? It seems like you have something with [hand, leg, face, etc].</p>
          <select name="bodyPart" value={inputs.bodyPart} onChange={handleBodyPartChange} className="selection-box-talk">
            <option value="">Select affected body part</option>
            <option value="hand">Hand</option>
            <option value="leg">Leg</option>
            <option value="face">Face</option>
            <option value="nose">Nose</option>
            <option value="throat">Throat</option>
          </select>
        </div>
      )}

      {step === 1 && (
        <div className="dialogue-box">
          <p>Can you describe your symptoms?</p>
          <textarea
            type="text"
            name="description"
            value={inputs.description}
            onChange={handleInputChange}
            placeholder="Describe your symptoms"
            className = "text-box"
          />
          <button onClick={() => setStep(2)}>Next</button>
        </div>
      )}

      {step === 2 && (
        <div className="dialogue-box">
          <p>How long have you been experiencing these symptoms?</p>
          <input
            type="text"
            name="duration"
            value={inputs.duration}
            onChange={handleInputChange}
            placeholder="Enter duration (e.g., 2 days)"
            className = "text-box-short"
          />
          <button onClick={() => setStep(3)}>Next</button>
        </div>
      )}

{step === 3 && inputs.audioBool && (
        <div className="dialogue-box">
          <p>Please record your cough or voice.</p>
          <input
            type="file"
            name="audioData"
            accept="audio/*"
            onChange={handleAudioChange}
            className='text-box-short'
          />
          <button onClick={() => setStep(4)}>Next</button>
        </div>
      )}

      {step === 3 && inputs.imageBool && (
        <div className="dialogue-box">
          <p>Please upload an image of the affected area.</p>
          <input
            type="file"
            name="imageData"
            accept="image/*"
            onChange={handleImageChange}
            className = "text-box-short"
          />
          <button onClick={() => setStep(4)}>Next</button>
        </div>
      )}

      {step === 4 && (
        <div className="dialogue-box scale">
          <p>On a scale from 1-10, how much does it hurt when you touch the area?</p>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            
            name="painScale"
            value={inputs.painScale}
            onChange={handleInputChange}
            placeholder="Pain scale (1-10)"
            className = "text-box-short"
          />
          <p className='pain-status'>Selected pain level: {inputs.painScale}</p>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}

      {/* Show loading state or diagnosis after form submission */}
      {loading && <p>Loading diagnosis...</p>}

      {!loading && diagnosis && (
        <div className="diagnosis-result">
          <h3>Diagnosis Result:</h3>
          <p>{diagnosis}</p>  {/* Display the diagnosis returned from the backend */}
          <button onClick={generatePDF}>Download PDF</button>  {/* Button to download PDF */}
        </div>
      )}

      {/* Optionally handle the case where there's no diagnosis yet */}
      {!loading && !diagnosis && !error && (
        <div className="no-diagnosis">
          <p>Please complete the form and submit to get a diagnosis.</p>
        </div>
      )}

      {/* Optionally, if there are any errors */}
      {!loading && error && (
        <div className="error-message">
          <p>{error}</p>  {/* Display the error message */}
        </div>
      )}
    </div>
  );
};

export default Dialogue;
