import Groq from 'groq-sdk';
import { GROQ_API_KEY } from '$env/static/private';
import { json, error } from '@sveltejs/kit';
import { rateLimit } from '$lib/rate-limiter.js';



const MAX_MESSAGE_LENGTH = 2000;
const RATE_LIMIT_CONFIG = {
    requests: 10,
    windowMinutes: 1
};

export const POST = async ({ request, getClientAddress, locals:{supabase} }) => {
    try {
        // Rate limiting
        const clientIP = getClientAddress();
        if (!rateLimit(clientIP, RATE_LIMIT_CONFIG)) {
            throw error(429, 'Too many requests');
        }

        // Validate environment
        if (!GROQ_API_KEY) {
            throw error(500, 'Server configuration error');
        }

        // Parse and validate request
        let data;
        try {
            data = await request.json();
        } catch (e) {
            throw error(400, 'Invalid JSON payload');
        }

        const { message, model, responses } = data;
        
        // Validate inputs
        if (!message?.trim() || typeof message !== 'string') {
            throw error(400, 'Message is required');
        }
        
        if (message.length > MAX_MESSAGE_LENGTH) {
            throw error(400, `Message exceeds ${MAX_MESSAGE_LENGTH} characters`);
        }
        
        // Process request
        const groq = new Groq({ apiKey: GROQ_API_KEY });
        const completion = await groq.chat.completions.create({
            messages: [{
                role: 'user',
                content: message,
            }],
            model: model,
            temperature: 0.7,
            max_tokens: 1024,
        });

        // Validate response
        if (!completion?.choices?.[0]?.message?.content) {
            throw error(500, 'Invalid response from AI provider');
        }
        const {data: {user}} = await supabase.auth.getUser();
        if(user){
            responses.push({ message: message, response: completion.choices[0].message.content, model: model });
            const {data: Member, error} = await supabase.from("Member").update({ai_chat: JSON.stringify(responses)}).eq("id",user.id);
            
        }
        return json({
            success: true,
            response: completion.choices[0].message.content,
            usage: completion.usage,
            model: model
        });

    } catch (err) {
        console.error('API Error:', err);
        
        // Handle known error types
        if (err.status && err.body) {
            return json(
                { success: false, error: err.body },
                { status: err.status }
            );
        }
        
        // Generic server error
        return json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
};