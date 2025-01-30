window.function = async function(api_key, messages, metadata, tool_resources) {
    // Validate API Key
    if (!api_key.value) {
        return "Error: OpenAI API Key is required.";
    }

    // Parse messages if provided
    let messagesValue = undefined;
    if (messages.value) {
        try {
            messagesValue = JSON.parse(messages.value);
            if (!Array.isArray(messagesValue)) {
                return "Error: Messages should be an array of objects.";
            }
        } catch (e) {
            return "Error: Invalid JSON format for messages.";
        }
    }

    // Parse metadata if provided
    let metadataValue = undefined;
    if (metadata.value) {
        try {
            metadataValue = JSON.parse(metadata.value);
        } catch (e) {
            return "Error: Invalid JSON format for metadata.";
        }
    }

    // Parse tool resources if provided
    let toolResourcesValue = undefined;
    if (tool_resources.value) {
        try {
            toolResourcesValue = JSON.parse(tool_resources.value);
        } catch (e) {
            return "Error: Invalid JSON format for tool resources.";
        }
    }

    // Construct request payload (only include fields if they have valid values)
    const payload = {};
    if (messagesValue) payload.messages = messagesValue;
    if (metadataValue) payload.metadata = metadataValue;
    if (toolResourcesValue) payload.tool_resources = toolResourcesValue;

    // API endpoint URL
    const apiUrl = "https://api.openai.com/v1/threads";

    // Make API request
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${api_key.value}`,
                "OpenAI-Beta": "assistants=v2"
            },
            body: Object.keys(payload).length > 0 ? JSON.stringify(payload) : "" // Send empty body if no fields are included
        });

        if (!response.ok) {
            const errorData = await response.json();
            return `Error ${response.status}: ${errorData.error?.message || "Unknown error"}`;
        }

        // Parse and return response
        const responseData = await response.json();
        return JSON.stringify(responseData, null, 2);

    } catch (error) {
        return `Error: Request failed - ${error.message}`;
    }
};
