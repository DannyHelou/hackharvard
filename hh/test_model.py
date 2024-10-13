import base64
from io import BytesIO
import torch
from torchvision import models, transforms
from PIL import Image

# Define the transformation (same as used during training)
transform = transforms.Compose([
    transforms.Resize((224, 224)),  # Resize the image to 224x224
    transforms.ToTensor(),  # Convert the image to a tensor
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])  # Normalize based on training stats
])

# Load the saved model
def load_model():
    model = models.resnet50(pretrained=False)
    model.fc = torch.nn.Linear(model.fc.in_features, 7)  # Modify for 7 classes
    model.load_state_dict(torch.load('external_injury_model.pth'))  # Load your trained model
    model.eval()  # Set model to evaluation mode
    return model

# Predict the class of a new image
def predict_image_base64(image_base64):
    # Decode the Base64 string to an image
    image_data = base64.b64decode(image_base64)
    image = Image.open(BytesIO(image_data))

    # Preprocess the image
    image = transform(image).unsqueeze(0)  # Add batch dimension

    # Load the model
    model = load_model()
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = model.to(device)
    image = image.to(device)

    # Perform inference
    with torch.no_grad():
        outputs = model(image)
        _, predicted = torch.max(outputs, 1)
        print(outputs)

    # Class names (based on your dataset)
    class_names = [
        'Abrasions', 'Bruises', 'Burns', 'Cut', 'Ingrown_nails', 'Laceration', 'Stab_wound'
    ]

    return (class_names[predicted.item()], (_.item()/10))

# # Example use case
# if __name__ == '__main__':
#     # Example Base64 string (replace with the actual Base64 image string from your React app)
#     image_base64 = '<your_base64_string_here>'
#     result = predict_image_base64(image_base64)
#     print(f'The model predicts: {result}')
