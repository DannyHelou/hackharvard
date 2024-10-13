from flask import Flask, jsonify, request
import openai
from flask_cors import CORS
import test_model as model
import json
from datetime import datetime
import audio_model as model_audio

# Dummy user data for login (in real applications, store this in a database)
users = {
    "user@example.com": {
        "password": "password123"
    },
    "user@gmail.com": {
        "password": "password123"
    },
    "johnharvard@gmail.com": {
        "password": "letmeinplease123"
    }
}

medications_by_issue = {
    "respiratory": {
        "Albuterol": "Albuterol is a bronchodilator that relaxes muscles in the airways and increases air flow to the lungs. Used for conditions like asthma or COPD.",
        "Fluticasone": "Fluticasone is a corticosteroid that helps reduce inflammation in the airways, commonly used in asthma and allergic rhinitis.",
        "Montelukast": "Montelukast is used to prevent asthma attacks and to treat allergies like allergic rhinitis.",
        "Budesonide": "Budesonide is an inhaled corticosteroid used for long-term management of asthma and COPD.",
        "Pseudoephedrine": "Pseudoephedrine is a decongestant that shrinks blood vessels in the nasal passages, helping alleviate congestion caused by colds or allergies."
    },
    "dermatological": {
        "Hydrocortisone": "Hydrocortisone is a corticosteroid used to treat redness, swelling, itching, and discomfort of various skin conditions.",
        "Neosporin": "Neosporin is a topical antibiotic used to prevent infections in minor cuts, scrapes, and burns.",
        "Mupirocin": "Mupirocin is an antibiotic used to treat skin infections such as impetigo and infections caused by bacteria.",
        "Ketoconazole": "Ketoconazole is an antifungal used to treat fungal skin infections, such as ringworm, athlete's foot, and seborrheic dermatitis.",
        "Ciprofloxacin Ophthalmic": "Ciprofloxacin Ophthalmic is an antibiotic used to treat bacterial infections of the eye, including conjunctivitis."
    },
    "gastrointestinal": {
        "Omeprazole": "Omeprazole is a proton pump inhibitor used to reduce stomach acid production, helping treat conditions like GERD, ulcers, and acid reflux.",
        "Loperamide": "Loperamide is used to treat sudden diarrhea by slowing down the movement of the gut, helping the body absorb more fluids.",
        "Ondansetron": "Ondansetron is used to prevent nausea and vomiting caused by surgery, chemotherapy, or radiation therapy.",
        "Ranitidine": "Ranitidine (now discontinued in some markets) was used to reduce the production of stomach acid and treat conditions such as ulcers and acid reflux.",
        "Metoclopramide": "Metoclopramide is used to treat nausea, vomiting, and delayed stomach emptying in people with certain conditions like diabetes."
    },
    "musculoskeletal": {
        "Ibuprofen": "Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) used to treat pain, inflammation, and swelling, often for arthritis or injuries.",
        "Naproxen": "Naproxen is an NSAID used to treat pain and inflammation, especially for conditions such as arthritis, tendinitis, and gout.",
        "Cyclobenzaprine": "Cyclobenzaprine is a muscle relaxant used to relieve muscle spasms and pain associated with musculoskeletal conditions.",
        "Meloxicam": "Meloxicam is an NSAID used to treat pain and inflammation caused by conditions such as osteoarthritis and rheumatoid arthritis.",
        "Prednisone": "Prednisone is a corticosteroid used to reduce inflammation and treat a wide range of conditions, including arthritis, severe allergies, and immune system disorders."
    },
    "neurological": {
        "Acetaminophen": "Acetaminophen is used to treat headaches, muscle aches, arthritis, backaches, toothaches, colds, and fevers. It is a common pain reliever and fever reducer.",
        "Sumatriptan": "Sumatriptan is used to treat migraines and cluster headaches by narrowing blood vessels around the brain.",
        "Gabapentin": "Gabapentin is used to treat nerve pain caused by shingles or seizures in adults and children.",
        "Topiramate": "Topiramate is used to prevent seizures and migraines, and can also help with nerve pain.",
        "Divalproex": "Divalproex is used to treat seizures, prevent migraines, and help manage bipolar disorder."
    }
}

ISSUE_TYPES = {
    "respiratory": ["cough", "cold", "shortness of breath", "wheezing", "chest pain"],
    "dermatological": ["rash", "swelling", "blisters", "abrasions", "eye infection"],
    "gastrointestinal": ["stomach ache", "nausea", "vomiting", "diarrhoea"],
    "musculoskeletal": ["joint pain", "muscle ache", "swelling", "stiffness"],
    "neurological": ["headache", "dizziness", "confusion", "seizures"]
}

'''def classify_issue(symptoms: str) -> str:
    """
    Classify the issue type based on symptoms provided.
    """
    symptoms = symptoms.lower()
    for issue_type, keywords in ISSUE_TYPES.items():
        if any(keyword in symptoms for keyword in keywords):
            return issue_type
    return "general" '''

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

def get_image_confidence(image_data):
    x = model.predict_image_base64(image_data)
    return x # Placeholder confidence value (you can replace this with real logic)


# Assume this function gives you a confidence value for audio
def get_audio_confidence(image_data):
    x = model_audio.predict_audio_base64(image_data)
    return x # Placeholder confidence value (you can replace this with real logic)

@app.route('/api/diagnose', methods=['POST'])
def diagnose():
    try:
        data = request.json  # Use request to get the JSON body of the POST request
        print(data)  # Print the data to debug the request payload

        # Extract and process the data
        body_part = data.get('bodyPart')
        description = data.get('description')
        duration = data.get('duration')
        image_data = data.get('imageData')
        audio_data = data.get('audioData')
        pain_scale = int(data.get('painScale'))
        imageBool = data.get('imageBool')
        allergies = ['peanut'] #data.get('allergies')
        height = 185 #data.get('height')
        weight = 80 #data.get('weight')
        prev_ill = ['diabetes'] #data.get('prev_ill')

        # Confidence logic and OpenAI API call...
        confidence = get_image_confidence(image_data) if imageBool else get_audio_confidence(audio_data)
        openai.api_key = "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"
        prompt = f"""
        Role:
        You are an objective AI doctor and will be needing to give a diagnoses to a patient. You need to respond to this as if you are
        an empathetic doctor and must give a sort of report like feedback.

        Patient Information:
        - Height: {height} cm
        - Weight: {weight} kg
        - Previous Illness: {prev_ill}
        - Allergies: {allergies}

        Imagine you are the pre-screening that a patient must take before going to an actual doctor.
        The patient has a {body_part} injury and this is the description they have given: {description}. 
        They have been experiencing symptoms for {duration}.
        They rated their pain at {pain_scale}/10. The confidence of injury severity based on the values from an ML model is {confidence}.
        Do NOT ever use this confidence value to justify your response.

        I need you to provide a Diagnosis in a an easy to read format that addresses all of the following, each on a new line:
        1) Severity: You must tell the patient how severe their damage based on the confidence value. 
        It should be something along the lines of: Low, Low to Medium, Medium, Medium to High, High. You should also address any possible link with previous illnesses.
        If the confidence value is around 0.25 or below, then the severity should be low;
        if the confidence value is between 0.25 to 0.4, then the severity should be low to medium;
        if the confidence value is between 0.4 to 0.6, then the severity should be medium;
        if the confidence value is between 0.6 to 0.75, then the severity should be medium to high;
        if the confidence value is between 0.75 to 1, then severity should be high.
        
        2) Medical Issue: You must give possible plausible problems/assessments that the patient might be facing based on the severity, body parts, duration and pain level they feel.
        This must be given for each assessment in the format of:
        [Disease/Assessment name] [likelihood that it is the issue in percentage]

        3) Possible Remedies: You must give them any possible medications that would help relieve them.
        This maybe ointments or tablets followed by a prescription that they must take based on their weight, height, etc. This must be given for each medicine in the format of:
        [Medicine Name] [grams to take based on height and weight] [how many times per day]
        Be specific with the names of the medicines and the rest with each on a new line. Make sure to include 2-3 medicines. An example of the above format is:
        Panadol 50g (2x per day)
        Choose the medications from your own knowledge and from {medications_by_issue}
        
        4) Doctor Recommendation: Based on the location of the patient, the severity and type of injury, you must recommend a hospital and doctor that is closest the patient. 
        Note: if the severity is low, doctor is not required, if it is medium the doctor is recommended but if it is high the doctor is a must or emergency call"

        """
        user_message = "so what is my diagnosis?"
        conversation_history = [{"role": "system", "content": prompt}]
        conversation_history.append({"role": "user", "content": user_message})

        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages = conversation_history,
            max_tokens=300
        )

        gpt_response = response.choices[0].message.content
        print(gpt_response)
        # Dump to JSON file
        import json
        from datetime import datetime

        diagnosis_data = {
            "date": str(datetime.now()).split(" ")[0],
            "diagnosis": description
        }

        try:
            with open('appointments.json', 'r') as json_file:
                diagnosis_log = json.load(json_file)
        except FileNotFoundError:
            diagnosis_log = []

        # Append new data
        diagnosis_log.append(diagnosis_data)

        # Write updated data back to file
        with open('appointments.json', 'w') as json_file:
            json.dump(diagnosis_log, json_file, indent=4)

        return jsonify({'diagnosis': gpt_response})

    except Exception as e:
        return jsonify({'error': str(e)}), 400
    
#LOGIN PAGE
    
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    # Check if the email exists in users and the password matches
    if email in users and users[email]['password'] == password:
        return jsonify({"success": True, "message": "Login successful!"})
    else:
        return jsonify({"success": False, "message": "Invalid email or password."}), 401

#USER SELECT SCREEN

user_info = [
    {"id": 1, "name": "John Harvard", "profilePic": "you_icon.png", "user_metrics": {"height": 167, "weight": 168, "allergies": []}, "appointments": []}
]

@app.route('/users', methods=['GET'])
def get_users():
    return jsonify(user_info)

@app.route('/user/1', methods=['POST'])
def get_user():
    user = user_info[0]
    return jsonify(user)

#USER PROFILE SCREEN

@app.route('/user/1/appointments', methods=['POST'])
def get_appointments():
    try:
        with open('appointments.json', 'r') as json_file:
            appointments = json.load(json_file)
        return jsonify(appointments)
    except (FileNotFoundError, json.JSONDecodeError):
        return jsonify([])

if __name__ == '__main__':
    app.run(debug=True)


# @app.route('/test', methods=['GET'])
# def test():
#     return jsonify(message="Hello from Flask!")