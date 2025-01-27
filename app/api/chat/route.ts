import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request): Promise<Response> {
  try {
    const { message }: { message: string } = await req.json();
    
    // Log the incoming message and API key to check if they are available
    console.log('Received message:', message);
    console.log('API Key:', process.env.OPENAI_API_KEY);

    if (!message) {
      return new Response(JSON.stringify({ error: 'No message provided' }), { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    });

    return new Response(JSON.stringify({ message: response.choices[0].message.content }), { status: 200 });
  } catch (error: any) {
    console.error('OpenAI API error:', error.response ? error.response : error);
    return new Response(
      JSON.stringify({ error: 'Something went wrong with the OpenAI request.' }),
      { status: 500 }
    );
  }
}
