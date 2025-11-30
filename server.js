require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Email configuration
const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.in',
    port: 587,
    secure: false, // Use TLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

app.post('/api/service-details', async (req, res) => {
    try {
        const { serviceName } = req.body;

        if (!serviceName) {
            return res.status(400).json({ error: 'Service name is required' });
        }

        // Check for missing API key
        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({ error: 'Server configuration error: Missing API Key.' });
        }

        const prompt = `
        You are an expert business consultant and technology strategist. 
        Provide a comprehensive, detailed analysis for the service: "${serviceName}".
        
        Structure your response with the following sections using HTML formatting:
        
        1. <h3>📊 Market Overview</h3>
           <p>Provide 2-3 paragraphs about the current state of this industry in 2025. Include specific statistics and market size if relevant.</p>
        
        2. <h3>📈 Key Trends</h3>
           <p>Describe 4-5 emerging trends in detail. For each trend, include:</p>
           <ul>
               <li><strong>Trend Name:</strong> Detailed explanation with real-world examples</li>
           </ul>
        
        3. <h3>💡 Why It Matters</h3>
           <p>Write 2 paragraphs explaining the business value and ROI potential. Include specific benefits and competitive advantages.</p>
        
        4. <h3>🎯 Industry Adoption</h3>
           <p>Create a visual representation using HTML/CSS showing adoption rates. Use this format:</p>
           <div style="margin: 20px 0;">
               <div style="margin-bottom: 15px;">
                   <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                       <span>Enterprise (Large Companies)</span>
                       <span>XX%</span>
                   </div>
                   <div style="background: #222; border-radius: 10px; overflow: hidden; height: 12px;">
                       <div style="background: linear-gradient(90deg, #00aaff, #0088cc); width: XX%; height: 100%;"></div>
                   </div>
               </div>
               <!-- Repeat for SMBs and Startups -->
           </div>
        
        5. <h3>🔮 Future Outlook (2025-2030)</h3>
           <p>Provide 2 paragraphs on expected developments, innovations, and market projections.</p>
        
        Keep the tone professional, data-driven, and forward-looking. Use specific numbers and percentages where possible. Make it visually appealing with proper spacing and formatting.
        `;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
        });

        const text = completion.choices[0]?.message?.content || "";

        res.json({ content: text });

    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).json({ error: 'Failed to generate content. Please check your API key or try again later.' });
    }
});

app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, service, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required' });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'devspheresoln@zohomail.in',
            subject: `New Contact Form Submission from ${name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                <p><strong>Interested In:</strong> ${service || 'Not specified'}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
                <hr>
                <p><small>This email was sent from the Devsphere contact form.</small></p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Email sent successfully' });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email. Please try again later.' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
