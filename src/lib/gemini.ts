import { GoogleGenAI, Type } from '@google/genai';

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface DetectionResult {
  bbox: [number, number, number, number]; // [ymin, xmin, ymax, xmax] normalized
  label: string;
  vegetable: string;
  confidence: number;
  preventiveTips: string;
}

export async function detectDiseases(base64Image: string, mimeType: string): Promise<DetectionResult[]> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview', // High reasoning capability, good for object detection bounding boxes
      contents: {
        parts: [
          {
            text: `Analyze this image of greenhouse vegetables (e.g. tomatoes, cucumbers, peppers) mimicking a high-performance YOLOv11 object detection model trained for agricultural disease detection.

Detect any visible diseases, pests, or anomalies, as well as healthy vegetables.
Return the result strictly as a JSON array of objects representing bounding boxes.
Each object must have:
- "bbox": an array of 4 numbers [ymin, xmin, ymax, xmax], each normalized between 0.0 and 1.0, representing the bounding box.
- "label": a string representing the class of the disease or anomaly (e.g., 'Early Blight', 'Healthy', 'Leaf Mold', 'Powdery Mildew'). Use standard classes.
- "vegetable": a string representing the vegetable being analyzed (e.g., 'Tomato', 'Cucumber', 'Pepper', 'Leaf').
- "confidence": a float between 0.0 and 1.0 representing the detection confidence (make it realistic, e.g., 0.85, 0.92, 0.99).
- "preventiveTips": a short 1-2 sentence recommendation for preventing or treating the detected disease, or a quick maintenance tip if healthy.

If no plants or diseases are found, return an empty array. Do not include markdown blocks.`
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image.split(',')[1] // Remove the 'data:image/...;base64,' prefix
            }
          }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              bbox: {
                type: Type.ARRAY,
                items: { type: Type.NUMBER },
                description: '[ymin, xmin, ymax, xmax] normalized between 0.0 and 1.0'
              },
              label: {
                type: Type.STRING
              },
              vegetable: {
                type: Type.STRING,
                description: 'The vegetable/crop detected (e.g., Tomato, Cucumber)'
              },
              confidence: {
                type: Type.NUMBER
              },
              preventiveTips: {
                type: Type.STRING,
                description: 'Short 1-2 sentence recommendation for treatment or prevention'
              }
            },
            required: ['bbox', 'label', 'vegetable', 'confidence', 'preventiveTips']
          }
        }
      }
    });

    const output = response.text;
    if (!output) return [];

    let cleanOutput = output.trim();
    if (cleanOutput.startsWith('```')) {
       cleanOutput = cleanOutput.replace(/```(?:\w+)?/g, '').trim();
    }

    const parsed = JSON.parse(cleanOutput);
    return parsed as DetectionResult[];
  } catch (error: any) {
    console.error('YOLOv11 Inference Simulation Error:', error);
    throw new Error(error?.message || 'Unknown inference error');
  }
}
