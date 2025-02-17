import axios from "axios";

export const generateImage = async (prompt: string): Promise<string> => {
    const response = await axios.post("http://127.0.0.1:5123/generate-image",
        { "prompt": prompt },
        { responseType: "blob" } // Ensure the response is treated as a binary blob
    );

    // Convert blob to object URL
    return URL.createObjectURL(response.data);
};
