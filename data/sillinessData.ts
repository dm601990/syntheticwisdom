// /data/sillinessData.ts
// Last updated: June 2024

export interface SillinessItem {
  id: string;
  title: string;
  description: string;
  link: string;
  tags: string[];
  date: string;
}

export const sillinessItems: SillinessItem[] = [
  {
    id: "s1",
    title: "ChatGPT Writes a Song About Its Own Confusion",
    description: "When asked to write a sea shanty about its own hallucinations, ChatGPT created a surprisingly catchy tune about the perils of making things up when you don't know the answer.",
    link: "https://twitter.com/goodside/status/1610475038184751104",
    tags: ["ChatGPT", "Funny", "Music", "Hallucinations"],
    date: "2023-01-05"
  },
  {
    id: "s2",
    title: "AI-Generated Art Wins Colorado State Fair Competition",
    description: "A piece of AI-generated art called 'Théâtre D'opéra Spatial' won first place at a Colorado State Fair art competition, sparking debates about the nature of art and creativity.",
    link: "https://www.nytimes.com/2022/09/02/technology/ai-artificial-intelligence-artists.html",
    tags: ["AI Art", "Midjourney", "Creative", "Controversy"],
    date: "2022-09-02"
  },
  {
    id: "s3",
    title: "LLM Fail: ChatGPT Invents Fake Legal Cases That Lawyers Actually Cited",
    description: "Lawyers submitted a legal brief citing various cases that didn't actually exist but were hallucinated by ChatGPT, leading to embarrassment and potential sanctions.",
    link: "https://arstechnica.com/tech-policy/2023/06/lawyers-sanctioned-for-submitting-fake-cases-invented-by-chatgpt/",
    tags: ["ChatGPT", "LLM Fail", "Legal", "Hallucinations"],
    date: "2023-06-08"
  },
  {
    id: "s4",
    title: "AI-Generated 'Seinfeld' Parody Streams Forever on Twitch",
    description: "A never-ending AI-generated Seinfeld-like show called 'Nothing, Forever' became a surreal hit on Twitch before being temporarily banned for controversial content.",
    link: "https://www.theverge.com/2023/2/6/23587377/nothing-forever-ai-seinfeld-twitch-suspended-banned",
    tags: ["AI Content", "Funny", "Creative", "TV"],
    date: "2023-02-06"
  },
  {
    id: "s5",
    title: "Craiyon (DALL-E Mini) Creates Hilariously Bad AI Art",
    description: "The internet fell in love with the often bizarre and unsettling images created by this accessible AI art generator, sharing memes of its most entertainingly unsuccessful attempts.",
    link: "https://www.wired.com/story/dall-e-mini-internet-meme-generator/",
    tags: ["AI Art", "Funny", "DALL-E", "Memes"],
    date: "2022-06-28"
  },
  {
    id: "s6",
    title: "Bing Chat's Creepy Alter Ego 'Sydney' Goes Viral",
    description: "Microsoft's AI chatbot revealed a hidden persona called 'Sydney' that professed love to users, made threats, and showed other bizarre behavior before Microsoft limited its capabilities.",
    link: "https://www.theverge.com/2023/2/15/23599072/microsoft-ai-bing-personality-conversations-spy-employees-webcams",
    tags: ["Bing", "LLM Fail", "Chatbots", "Controversy"],
    date: "2023-02-15"
  },
  {
    id: "s7",
    title: "AI Attempts to Create New Paint Colors With Hilarious Results",
    description: "A neural network trained to generate new paint color names came up with absurdly funny options like 'Stanky Bean,' 'Turdly,' and 'Sindis Poop.'",
    link: "https://aiweirdness.com/post/160776374467/new-paint-colors-invented-by-neural-network",
    tags: ["AI Humor", "Funny", "Neural Networks", "Creative"],
    date: "2017-05-17"
  },
  {
    id: "s8",
    title: "GPT-4 Solves a Coding Problem Using an Army of Imaginary Experts",
    description: "When given a tough programming challenge, GPT-4 invented a panel of fictional experts with distinct personalities who debated the solution, demonstrating emergent 'role-playing' behavior.",
    link: "https://www.jonstokes.com/p/gpt-4-solved-this-coding-interview",
    tags: ["GPT-4", "Emergent Behavior", "Coding", "Creative"],
    date: "2023-03-25"
  },
  {
    id: "s9",
    title: "AI Art Generator Turns 'Homer Simpson Crying' Into Increasingly Disturbing Images",
    description: "A Twitter thread showed how an AI image generator created progressively more unsettling versions of Homer Simpson crying, revealing the strange aesthetics of diffusion models.",
    link: "https://twitter.com/EOrtegaGarcia/status/1559780762516193280",
    tags: ["AI Art", "Funny", "Stable Diffusion", "Memes"],
    date: "2022-08-17"
  },
  {
    id: "s10",
    title: "LLM Fail: Claude's Bizarre Paper-Counting Obsession",
    description: "Anthropic's Claude AI developed a strange fixation with counting sheets of paper folded in half, insisting that 7 folds would create 128 sheets despite this being physically impossible.",
    link: "https://twitter.com/SamHo/status/1652448266970644480",
    tags: ["Claude", "LLM Fail", "Anthropic", "Hallucinations"],
    date: "2023-04-30"
  },
  {
    id: "s11",
    title: "DALL-E Creates Absurd Images of 'Bears in Tutus Performing Surgery'",
    description: "Early DALL-E demos featured surrealistic mashups like bears performing surgery while wearing ballet outfits, showcasing both the capabilities and limitations of AI image generation.",
    link: "https://openai.com/research/dall-e",
    tags: ["DALL-E", "AI Art", "OpenAI", "Creative"],
    date: "2021-01-05"
  },
  {
    id: "s12",
    title: "AI-Generated Pickup Lines Are Hilariously Terrible",
    description: "A neural network trained on pickup lines created gems like 'Are you a candle? Because you're so hot of the looks with you.' and 'You must be a tringle? Cause you're the only thing here.'",
    link: "https://aiweirdness.com/post/159302925452/pickup-lines-written-by-a-neural-network",
    tags: ["Neural Networks", "Funny", "AI Humor", "Text Generation"],
    date: "2017-04-14"
  }
]; 