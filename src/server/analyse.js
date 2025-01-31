const meaningCloud = "https://api.meaningcloud.com/sentiment-2.1";
const axios = require("axios");

const analyze = async (url, key) => {
    // Construct the API URL
    const apiUrl = `${meaningCloud}?key=${key}&url=${url}&lang=en`;

    // Fetch data from the API
    const analysis = await axios.get(apiUrl)
        .then(function (response) {
            const { code } = response.data.status;

            // Handle errors
            if (code == 100) {
                return handleError(code, "please enter a valid URL");
            } else if (code == 212) {
                return handleError(code, response.data.status.msg);
            }

            // Return success response
            return successResponse(response.data, code);
        });

    return analysis;
};

const handleError = (code, msg) => {
    return {
        code: code,
        msg: msg
    };
};

// Process the data and send it to the client
const successResponse = (data, code) => {
    const { score_tag, agreement, subjectivity, confidence, irony } = data;
    const sample = {
        score_tag: score_tag,
        agreement: agreement,
        subjectivity: subjectivity,
        confidence: confidence,
        irony: irony
    };
    return { sample, status: code };
};

module.exports = { analyze };