// /data/toolkitData.ts
// Last updated: June 2024

export interface ToolkitItem {
  id: string; // Using simple numerical strings
  name: string;
  description: string;
  link: string;
  type: 'Model' | 'Tool' | 'Platform';
  tags: string[];
  developer?: string;
  keyFeatures?: string[];
}

export const toolkitItems: ToolkitItem[] = [
  // --- Models ---
  {
    id: "m1",
    name: "Google Gemini 2.5 Pro",
    description: "Google's leading AI model, launched in late March 2025. Designed as a \"thinking model,\" it excels in advanced reasoning tasks and features native multimodality, processing text, code, images, and videos within a large context window of up to 1 million tokens. It demonstrates state-of-the-art performance on various benchmarks, including scientific and mathematical reasoning.",
    link: "https://deepmind.google/technologies/gemini/", // Assumed link
    type: "Model",
    tags: ["LLM", "Multimodal"],
    developer: "Google",
    keyFeatures: ["Reasoning", "Long Context", "Thinking Model", "Multimodal"],
  },
  {
    id: "m2",
    name: "Llama 4",
    description: "Meta's latest generation of open-access large language models, released starting in April 2025. Succeeding the Llama 3 series, Llama 4 introduces a mixture-of-experts architecture and enhanced capabilities, including multimodality (text and image input, text output) and support for multiple languages. Various parameter sizes are available.",
    link: "https://ai.meta.com/llama/", // Assumed link
    type: "Model",
    tags: ["LLM", "Open Source", "Multimodal"],
    developer: "Meta",
    keyFeatures: ["Multimodal", "Multilingual", "Mixture-of-Experts", "Instruction Following"],
  },
  {
    id: "m3",
    name: "Claude 3.7 Sonnet",
    description: "Anthropic's advanced model released in February 2025. It is presented as a hybrid reasoning model offering both standard, fast responses and an extended thinking mode for complex tasks. It features improved reasoning, enhanced instruction following, and superior tool usage, with breakthrough performance and strong safety alignment.",
    link: "https://www.anthropic.com/news/claude-3-7-sonnet", // Found link
    type: "Model",
    tags: ["LLM"],
    developer: "Anthropic",
    keyFeatures: ["Reasoning", "Safety Alignment", "Advanced Reasoning", "Hybrid Reasoning"],
  },
  {
    id: "m4",
    name: "GPT-4.1 / mini / nano",
    description: "New models released by OpenAI in April 2025, offering improved performance over previous generations like GPT-4o and the GPT-4.5 Preview (which is slated for deprecation in July 2025). These models show significant gains in coding and instruction following, with larger context windows available.",
    link: "https://openai.com/", // Assumed base link
    type: "Model",
    tags: ["LLM"],
    developer: "OpenAI",
    keyFeatures: ["Text Generation", "Reasoning", "Instruction Following", "Larger Context Window"],
  },
  {
    id: "m5",
    name: "Mistral Large 24.11 / Small 25.03",
    description: "Following the deprecation of the original Mistral Large in April 2025, Mistral AI's current flagship models for complex reasoning and instruction following include Mistral Large 24.11 (released November 2024) and newer iterations like Mistral Small 25.03 (March 2025). These models continue to focus on efficiency and performance.",
    link: "https://mistral.ai/models/", // Found link
    type: "Model",
    tags: ["LLM"],
    developer: "Mistral AI",
    keyFeatures: ["Reasoning", "Efficiency", "Instruction Following"],
  },
  {
    id: "m6",
    name: "Claude 3 Opus",
    description: "Anthropic's highest-capability model within the Claude 3 family, released in March 2024. It remains a powerful model for highly complex tasks requiring deep expertise and nuanced understanding, offering a large context window. Newer Sonnet versions (3.5 and 3.7) provide alternative capability and speed profiles.",
    link: "https://www.anthropic.com/claude", // Found link
    type: "Model",
    tags: ["LLM"],
    developer: "Anthropic",
    keyFeatures: ["Reasoning", "Expert-level", "Long Context"],
  },
  {
    id: "m7",
    name: "Cohere Command A",
    description: "Released in March 2025, Command A is Cohere's latest enterprise LLM, offering improved inference-time efficiency and strong performance on reasoning-intensive tasks. It is designed to power production applications and succeeds Command R+.",
    link: "https://cohere.com/models", // Assumed base link
    type: "Model",
    tags: ["LLM"],
    developer: "Cohere",
    keyFeatures: ["Enterprise", "Retrieval", "Reasoning", "Efficiency"],
  },
  {
    id: "m8",
    name: "NVIDIA Llama Nemotron Family",
    description: "Announced in March 2025, this family of open NVIDIA models is designed to deliver exceptional reasoning capabilities for enterprise AI agents. It focuses on compute efficiency and provides leading accuracy on various reasoning and agentic benchmarks. Nemotron-4 340B is associated with this family.",
    link: "https://developer.nvidia.com/nemotron", // Assumed developer link
    type: "Model",
    tags: ["LLM", "Open Source"],
    developer: "NVIDIA",
    keyFeatures: ["Reasoning", "Enterprise AI Agents", "Compute Efficiency"],
  },
  {
    id: "m9",
    name: "Stable Diffusion 3.5",
    description: "An updated version of Stable Diffusion 3, released in October 2024 (with SD3 first previewed in Feb 2024). Developed by Stability AI, it offers significant improvements in image quality, composition, coherence, and text rendering compared to previous iterations. Various parameter sizes are available.",
    link: "https://stability.ai/stable-diffusion", // Assumed link
    type: "Model",
    tags: ["Image Generation", "Open Source"],
    developer: "Stability AI",
    keyFeatures: ["Text-to-Image", "Improved Composition", "Enhanced Detail", "Text Rendering"],
  },
  {
    id: "m10",
    name: "DALL-E 3",
    description: "OpenAI's advanced text-to-image model remains a key offering for generating highly detailed images from text prompts, integrated with ChatGPT and available via API (confirmed operational as of April 2025). OpenAI's GPT-4o also offers image generation capabilities.",
    link: "https://openai.com/dall-e-3", // Found link
    type: "Model",
    tags: ["Image Generation"],
    developer: "OpenAI",
    keyFeatures: ["Text-to-Image", "Creative", "Detailed Imagery"],
  },
  {
    id: "m11",
    name: "Imagen 2",
    description: "Google's advanced text-to-image model, confirmed as current (April 2025). It focuses on photorealistic image generation with precise control, accurate text rendering, and high aesthetic quality. Often mentioned alongside Google's Veo model for video generation.",
    link: "https://imagen.research.google/", // Found link
    type: "Model",
    tags: ["Image Generation"],
    developer: "Google",
    keyFeatures: ["Text-to-Image", "Photorealistic", "Precise Control", "Text Rendering"],
  },
  {
    id: "m12",
    name: "Whisper Large v3 Turbo",
    description: "An optimized version of OpenAI's Whisper speech recognition model, available on platforms like Groq as of February 2025. It offers improved speed and efficiency while maintaining high accuracy across multiple languages compared to the standard Whisper Large v3.",
    link: "https://openai.com/research/whisper", // Base model link
    type: "Model",
    tags: ["Speech Recognition"],
    developer: "OpenAI (optimized by others like Groq)",
    keyFeatures: ["Transcription", "Multilingual", "Accuracy", "Speed"],
  },
   {
    id: "m13",
    name: "OpenAI Sora",
    description: "OpenAI's text-to-video model, capable of generating realistic and imaginative videos. While not yet broadly available to the public (as of April 2025), it remains a highly anticipated model for video generation research and potential future applications.",
    link: "https://openai.com/sora", // Found link
    type: "Model",
    tags: ["Video Generation", "Multimodal"],
    developer: "OpenAI",
    keyFeatures: ["Text-to-Video", "Photorealistic Video"],
  },
  {
    id: "m14",
    name: "AudioCraft (Meta)",
    description: "Meta's open-source suite for audio generation, including MusicGen for music and AudioGen for sound effects. It continues to be a prominent tool for researchers and developers in the generative audio space.",
    link: "https://ai.meta.com/blog/audiocraft-music-generation-text-to-music/", // Found link
    type: "Model",
    tags: ["Audio Generation", "Open Source"],
    developer: "Meta",
    keyFeatures: ["Music Generation", "Sound Effects", "Open Source"],
  },
  {
    id: "m15",
    name: "Falcon 180B",
    description: "Released by TII in 2023, this large 180-billion-parameter open-access model remains a notable entry in the LLM landscape as of early 2025, recognized for its capabilities among open models from that period.",
    link: "https://falconllm.tii.ae/", // Found link
    type: "Model",
    tags: ["LLM", "Open Source"],
    developer: "TII (Technology Innovation Institute)",
    keyFeatures: ["Large Scale", "Research"],
  },
  {
    id: "m16",
    name: "GPT-4o",
    description: "OpenAI's multimodal flagship model released in May 2024, seamlessly integrating text, audio, and vision capabilities at high speed. Offers enhanced creative and collaborative interactions and is widely available through ChatGPT and the OpenAI API.",
    link: "https://openai.com/gpt-4o", // Or https://openai.com/models/gpt-4o
    type: "Model",
    tags: ["LLM", "Multimodal"],
    developer: "OpenAI",
    keyFeatures: ["Multimodal", "Fast", "Text Generation", "Image Generation", "Audio Processing"],
  },
  {
    id: "m17",
    name: "Google Veo",
    description: "Google's advanced generative AI model for creating high-quality, high-definition videos from text and visual prompts. Announced and actively being integrated into Google platforms (like Vertex AI), it stands as a key offering in the competitive text-to-video landscape as of April 2025.",
    link: "https://deepmind.google/technologies/veo/", // Or Vertex AI page
    type: "Model",
    tags: ["Video Generation", "Multimodal"],
    developer: "Google",
    keyFeatures: ["Text-to-Video", "High Quality Video", "Multimodal Input"],
  },
  {
    id: "m18",
    name: "DeepSeek (V3, R1, etc.)",
    description: "A family of performant AI models from DeepSeek AI that have gained significant traction, particularly among the open-source community for certain versions. Recent iterations like DeepSeek V3 and R1 demonstrate strong capabilities in reasoning and coding benchmarks and are increasingly available across various platforms for inference (current as of April 2025).",
    link: "https://www.deepseek.com/", // Or Hugging Face repos
    type: "Model",
    tags: ["LLM", "Open Source (some)"],
    developer: "DeepSeek AI",
    keyFeatures: ["Reasoning", "Coding", "Performance", "Open Source (some)"],
  },
  {
    id: "m19",
    name: "Grok",
    description: "xAI's conversational AI model, known for its unique personality and access to real-time information through integration with the X platform (formerly Twitter). Continues to evolve with newer versions like Grok 3 and Grok 3 Mini becoming accessible on various inference platforms as of April 2025.",
    link: "https://grok.x.ai/", // Or https://x.ai/
    type: "Model",
    tags: ["LLM", "Conversational AI"],
    developer: "xAI",
    keyFeatures: ["Real-time Information", "Conversational", "Integrated with X"],
  },

  // --- Tools ---
  {
    id: "t1",
    name: "Midjourney v7",
    description: "The latest version of the popular image generation system, released in April 2025. Version 7 offers enhanced prompt understanding, improved photorealism, richer textures, and more coherent details, along with new features like Draft Mode. It succeeds v6.1 and v6.",
    link: "https://www.midjourney.com/", // Found link
    type: "Tool",
    tags: ["Image Generation"],
    developer: "Midjourney",
    keyFeatures: ["Artistic", "Photorealistic", "Improved Prompt Understanding", "Video Features"],
  },
  {
    id: "t2",
    name: "Runway Gen-4 / Gen-4 Turbo",
    description: "Runway's newest video generation models, released in April 2025, offering faster and more efficient video creation with enhanced control and production-ready output. These models succeed the Gen-3 series.",
    link: "https://runwayml.com/", // Found link
    type: "Tool",
    tags: ["Video Generation"],
    developer: "Runway",
    keyFeatures: ["Creative", "Professional", "Motion Control", "Faster Generation"],
  },
  {
    id: "t3",
    name: "Perplexity AI",
    description: "A conversational AI search engine known for providing well-cited answers by synthesizing web information. As of April 2025, it continues to evolve with new features like image uploads, date range filtering, and improved Sonar models, offering a Pro model for enhanced capabilities.",
    link: "https://www.perplexity.ai/", // Found link
    type: "Tool",
    tags: ["Search", "Research"],
    developer: "Perplexity AI",
    keyFeatures: ["Citations", "Real-time Information", "Conversational Search", "Image Uploads"],
  },
  {
    id: "t4",
    name: "ElevenLabs Multilingual v2 / Flash v2.5",
    description: "ElevenLabs offers state-of-the-art voice synthesis with models like Multilingual v2 (known for lifelike, emotional speech) and Flash v2.5 (optimized for speed and low latency). Both support a wide range of languages and are current offerings as of April 2025.",
    link: "https://elevenlabs.io/", // Found link
    type: "Tool",
    tags: ["Audio"],
    developer: "ElevenLabs",
    keyFeatures: ["Voice Generation", "Speech Synthesis", "Multilingual", "Emotion Control"],
  },
  {
    id: "t5",
    name: "GitHub Copilot Enterprise",
    description: "The enterprise-grade AI pair programmer from GitHub, offering features for teams including chat within the IDE, security scanning, and integration with organization-specific knowledge bases. It utilizes advanced models, including recent OpenAI and other offerings (confirmed as current in April 2025).",
    link: "https://github.com/features/copilot", // Found link
    type: "Tool",
    tags: ["Code", "Development"],
    developer: "GitHub (Microsoft)",
    keyFeatures: ["AI Assistant", "Code Generation", "Enterprise", "Security Scanning"],
  },
  {
    id: "t6",
    name: "Cursor",
    description: "An AI-first code editor built on VSCode, providing powerful features for code generation, editing, and explanation with AI. As of April 2025, its changelog indicates support for a variety of recent frontier models, including those from Google, OpenAI, and Mistral, and the ability to run models locally.",
    link: "https://cursor.sh/", // Found link
    type: "Tool",
    tags: ["Code", "Development"],
    developer: "Cursor",
    keyFeatures: ["IDE", "AI Assistant", "Code Understanding", "Local Models"],
  },
  {
    id: "t7",
    name: "Pika Labs 2.2",
    description: "Pika Labs' updated AI video generation platform, with version 2.2 launched in February/March 2025. It offers capabilities for text-to-video, image-to-video, and editing, featuring longer generation times, higher resolution (1080p), and innovative keyframe transition technology (\"Pikaframes\").",
    link: "https://pika.art/", // Found link
    type: "Tool",
    tags: ["Video Generation"],
    developer: "Pika Labs",
    keyFeatures: ["Editing", "Animation", "Creative", "Text-to-Video", "Image-to-Video"],
  },
  {
    id: "t8",
    name: "Anthropic Claude Pro / Max Plan",
    description: "Anthropic's subscription services offering enhanced access to their Claude models. As of April 2025, in addition to the Pro plan, a new Max plan is available, providing significantly higher usage limits for demanding users and priority access to the latest features and models.",
    link: "https://www.anthropic.com/claude", // Found link
    type: "Tool",
    tags: ["AI Assistant", "Subscription"],
    developer: "Anthropic",
    keyFeatures: ["Document Analysis", "Increased Usage Limits", "Priority Access"],
  },
  {
    id: "t9",
    name: "Ollama",
    description: "An open-source tool that simplifies running large language models locally on your own hardware. As of April 2025, it actively supports a growing list of recent open and closed models, including versions of Llama, Mistral, Gemma, and DeepSeek, making local development and experimentation more accessible.",
    link: "https://ollama.ai/", // Found link
    type: "Tool",
    tags: ["Local Models", "Development"],
    developer: "Ollama",
    keyFeatures: ["Privacy", "Open Source", "Self-hosting", "Easy Setup"],
  },
  {
    id: "t10",
    name: "ChatGPT Plus",
    description: "OpenAI's premium subscription service providing users with priority access to the latest GPT models (including GPT-4.1 and GPT-4o), as well as features like Advanced Data Analysis, DALL-E 3 for image generation, and access to custom GPTs (confirmed as current in April 2025). A higher-tier Pro plan also exists.",
    link: "https://chat.openai.com/", // Found link
    type: "Tool",
    tags: ["Subscription", "Conversational AI"],
    developer: "OpenAI",
    keyFeatures: ["Advanced Features", "Priority Access", "Model Access", "Image Generation"],
  },
  {
    id: "t11",
    name: "Adobe Firefly",
    description: "Adobe's family of creative generative AI models, trained on licensed content for commercial safety. Firefly continues to be integrated into Adobe's Creative Cloud applications, specializing in image generation, vector graphics, and text effects (confirmed operational as of April 2025).",
    link: "https://www.adobe.com/products/firefly.html", // Found link
    type: "Tool",
    tags: ["Image Generation", "Creative"],
    developer: "Adobe",
    keyFeatures: ["Commercial Use", "Design Integration", "Text-to-Image", "Vector Graphics"],
  },
  {
    id: "t12",
    name: "Cody by Sourcegraph",
    description: "An AI coding assistant that understands your entire codebase to provide context-aware code generation, debugging help, and other development workflow assistance across multiple IDEs (confirmed operational as of April 2025).",
    link: "https://sourcegraph.com/cody", // Found link
    type: "Tool",
    tags: ["Code", "Development"],
    developer: "Sourcegraph",
    keyFeatures: ["Multi-IDE", "Code Understanding", "AI Assistant"],
  },
  {
    id: "t13",
    name: "Rewind",
    description: "An AI-powered tool that captures and makes searchable everything you've seen, heard, or done on your computer, acting as a personal memory assistant. It remains a relevant tool for productivity and information retrieval as of April 2025.",
    link: "https://www.rewind.ai/", // Found link
    type: "Tool",
    tags: ["Productivity", "Personal AI"],
    developer: "Rewind AI",
    keyFeatures: ["Memory", "Search", "Digital History"],
  },
  {
    id: "t14",
    name: "Notion AI",
    description: "An integrated AI writing assistant within Notion workspaces. It helps users with content generation, summarization, translation, and other writing tasks with deep context awareness of their notes and documents. Recent updates continue to enhance its capabilities (confirmed as current in April 2025).",
    link: "https://www.notion.so/product/ai", // Found link
    type: "Tool",
    tags: ["Writing", "Productivity"],
    developer: "Notion",
    keyFeatures: ["Workspace Integration", "Content Generation", "Summarization", "Context Awareness"],
  },
  {
    id: "t15",
    name: "Jasper",
    description: "An enterprise AI content platform primarily for marketing and content creation teams. It assists with generating various forms of marketing copy, maintaining brand voice, and streamlining content workflows (confirmed as current in 2025).",
    link: "https://www.jasper.ai/", // Found link
    type: "Tool",
    tags: ["Marketing", "Content Creation"],
    developer: "Jasper",
    keyFeatures: ["Enterprise", "Brand Voice", "Content Generation"],
  },
  {
    id: "t16",
    name: "Synthesia",
    description: "An AI video generation platform that allows users to create professional videos with AI avatars speaking in multiple languages from text input. It remains a popular tool for quickly generating video content for various purposes (mentioned as top-ranked in a Jan 2025 article).",
    link: "https://www.synthesia.io/", // Found link
    type: "Tool",
    tags: ["Video Generation"],
    developer: "Synthesia",
    keyFeatures: ["Virtual Presenters", "Multilingual", "Marketing"],
  },
  {
    id: "t17",
    name: "Descript",
    description: "A comprehensive audio and video editing platform that integrates AI features like transcription, voice cloning, filler word removal, and studio sound enhancement. It continues to be a widely used tool for media creation and editing (confirmed operational as of April 2025).",
    link: "https://www.descript.com/", // Found link
    type: "Tool",
    tags: ["Audio Editing", "Video Editing"],
    developer: "Descript",
    keyFeatures: ["Transcription", "Voice Clone", "AI Audio/Video Enhancement"],
  },

  // --- Platforms ---
  {
    id: "p1",
    name: "Hugging Face",
    description: "A central hub for the open-source AI community, providing access to a vast repository of models, datasets, and tools. It continues to evolve with features like model evaluation leaderboards and Spaces for demos, remaining a crucial platform for AI research and development (confirmed operational as of April 2025).",
    link: "https://huggingface.co/", // Found link
    type: "Platform",
    tags: ["Models", "Datasets", "Community"],
    developer: "Hugging Face",
    keyFeatures: ["Open Source", "Deployment", "Research"],
  },
  {
    id: "p2",
    name: "LangChain",
    description: "A popular framework for developing applications powered by language models. It provides tools for chaining together different components, including models, APIs, and data sources, to build more complex AI applications and agents. It sees continuous development and updates (confirmed active in 2025).",
    link: "https://www.langchain.com/", // Found link
    type: "Platform",
    tags: ["Development Framework"],
    developer: "LangChain",
    keyFeatures: ["LLM Applications", "Agents", "Context Augmentation"],
  },
  {
    id: "p3",
    name: "OpenAI Platform",
    description: "OpenAI's developer platform offering API access to their models (including the latest GPT-4.1 series, GPT-4o, DALL-E 3, and Whisper), as well as tools for fine-tuning and embeddings. It is actively updated with new model releases and features (confirmed active in 2025).",
    link: "https://platform.openai.com/", // Found link
    type: "Platform",
    tags: ["API", "Developer", "Enterprise"],
    developer: "OpenAI",
    keyFeatures: ["Models", "Integration", "Fine-tuning"],
  },
  {
    id: "p4",
    name: "Azure AI Studio",
    description: "Microsoft's integrated platform on Azure for building, deploying, and managing enterprise-grade AI applications. It offers a range of tools and services with a focus on security, compliance, and scalability (confirmed operational as of April 2025).",
    link: "https://azure.microsoft.com/en-us/products/ai-studio", // Found link
    type: "Platform",
    tags: ["Enterprise", "Cloud", "Deployment"],
    developer: "Microsoft",
    keyFeatures: ["Security", "Compliance", "Scalability"],
  },
  {
    id: "p5",
    name: "AWS Bedrock",
    description: "Amazon's fully managed service providing access to a selection of high-performing foundation models from leading AI companies. It allows enterprises to easily build and scale generative AI applications with AWS's security and privacy features (confirmed operational as of April 2025).",
    link: "https://aws.amazon.com/bedrock/", // Found link
    type: "Platform",
    tags: ["Enterprise", "Cloud", "Multimodel"],
    developer: "Amazon Web Services (AWS)",
    keyFeatures: ["Deployment", "Integration", "Security", "Privacy"],
  },
  {
    id: "p6",
    name: "Google AI Studio",
    description: "Google's developer platform designed for building with Gemini models. It offers tools for prompt design, model customization, and integration into applications, providing a streamlined experience for leveraging Google's latest models (confirmed operational as of April 2025).",
    link: "https://ai.google.dev/", // Found link
    type: "Platform",
    tags: ["Developer", "Cloud"],
    developer: "Google",
    keyFeatures: ["Gemini Models", "Prompt Design", "Integration"],
  },
  {
    id: "p7",
    name: "Nvidia AI Enterprise",
    description: "NVIDIA's end-to-end software platform for accelerating AI development and deployment in the enterprise. It provides tools and frameworks for building and managing AI workflows on NVIDIA's infrastructure (confirmed current with announcements in March 2025).",
    link: "https://www.nvidia.com/en-us/data-center/products/ai-enterprise/", // Found link
    type: "Platform",
    tags: ["Enterprise", "Development", "Deployment"],
    developer: "NVIDIA",
    keyFeatures: ["Hardware Acceleration", "Software Platform", "MLOps"],
  },
  {
    id: "p8",
    name: "Together AI",
    description: "A platform offering serverless inference and fine-tuning for a wide range of open-source models at competitive prices. As of April 2025, it continues to update its platform with features like preference optimization and continued training capabilities, catering to developers and enterprises working with open models.",
    link: "https://www.together.ai/", // Found link
    type: "Platform",
    tags: ["Inference", "Fine-tuning"],
    developer: "Together AI",
    keyFeatures: ["Open Source Models", "Serverless", "Competitive Pricing"],
  },
]; 