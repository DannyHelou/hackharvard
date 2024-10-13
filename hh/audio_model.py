import base64
import librosa
import numpy as np
from pydub import AudioSegment
import io

def predict_audio_base64(audio_base64):

    audio_data = base64.b64decode(audio_base64) 
    audio_io = io.BytesIO(audio_data)

    audio = AudioSegment.from_mp3(audio_io)

    y = np.array(audio.get_array_of_samples(), dtype=np.float32)

    # Normalize the audio based on sample width
    if audio.sample_width == 2:  # 16-bit audio
        y /= 32768.0
    elif audio.sample_width == 4:  # 32-bit audio
        y /= 2147483648.0

    # Convert stereo to mono if necessary
    if audio.channels > 1:
        y = librosa.to_mono(y)

    # Step 4: Process the audio signal (e.g., using librosa for decibel levels)
    sr = audio.frame_rate
    stft = np.abs(librosa.stft(y))
    decibels = librosa.amplitude_to_db(stft, ref=np.max)

    # For simplicity, we can compute the average decibel level as an example confidence metric
    average_decibel = np.mean(decibels)

    # Step 6: Calculate confidence values
    # You can adjust these thresholds based on your needs
    decibel_threshold = -85  # Threshold for general loudness

    decibel_confidence = min(average_decibel / decibel_threshold, 1.0)

    return decibel_confidence