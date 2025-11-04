export interface StoryTemplate {
  id: string;
  name: string;
  description: string;
  genre: string;
  style: string;
  tone: string;
  setting: string;
  promptTemplate: string;
  characterSuggestions: string[];
  plotPoints: string[];
  estimatedChapters: number;
  thumbnail?: string;
}

export const STORY_TEMPLATES: StoryTemplate[] = [
  {
    id: "epic-fantasy-quest",
    name: "Epic Fantasy Quest",
    description: "A hero's journey through magical realms to save the world",
    genre: "fantasy",
    style: "descriptive",
    tone: "inspiring",
    setting: "A vast magical kingdom threatened by ancient evil",
    promptTemplate: "A young {hero} discovers they possess {magical ability} and must embark on a quest to {save the world/defeat the dark lord/find the ancient artifact} before it's too late.",
    characterSuggestions: [
      "Reluctant hero with hidden power",
      "Wise mentor figure",
      "Loyal companion",
      "Mysterious antagonist",
    ],
    plotPoints: [
      "Discovery of special ability",
      "Meeting the mentor",
      "First major challenge",
      "Gathering allies",
      "Dark revelation",
      "Final confrontation",
    ],
    estimatedChapters: 10,
  },
  {
    id: "space-adventure",
    name: "Space Adventure",
    description: "Explore the cosmos in an interstellar adventure",
    genre: "sci-fi",
    style: "action-packed",
    tone: "balanced",
    setting: "Distant future among the stars",
    promptTemplate: "In the year {year}, humanity has spread across the galaxy. {Protagonist}, a {occupation}, discovers {mysterious object/signal/phenomenon} that could change everything.",
    characterSuggestions: [
      "Skilled starship captain",
      "Brilliant scientist",
      "Alien ally",
      "Corporate antagonist",
    ],
    plotPoints: [
      "Discovery of the anomaly",
      "First contact situation",
      "Space battle",
      "Betrayal",
      "Scientific breakthrough",
      "Epic space confrontation",
    ],
    estimatedChapters: 8,
  },
  {
    id: "mystery-thriller",
    name: "Mystery Thriller",
    description: "Unravel a complex mystery filled with twists",
    genre: "mystery",
    style: "dialogue-heavy",
    tone: "dark",
    setting: "Modern city with dark secrets",
    promptTemplate: "Detective {name} is called to investigate {mysterious event/crime} that seems impossible. As they dig deeper, they uncover a conspiracy that goes deeper than anyone imagined.",
    characterSuggestions: [
      "Sharp detective",
      "Unreliable witness",
      "Hidden mastermind",
      "Surprising ally",
    ],
    plotPoints: [
      "The impossible crime",
      "First lead",
      "Red herring",
      "Major revelation",
      "Danger strikes close",
      "Truth revealed",
    ],
    estimatedChapters: 7,
  },
  {
    id: "romantic-drama",
    name: "Romantic Drama",
    description: "A heartwarming tale of love and personal growth",
    genre: "romance",
    style: "poetic",
    tone: "light",
    setting: "Contemporary setting with romantic locations",
    promptTemplate: "{Protagonist} never believed in {love/second chances/fate} until they met {love interest} under {unusual circumstances}. Together they must overcome {obstacle} to find happiness.",
    characterSuggestions: [
      "Guarded protagonist",
      "Charming love interest",
      "Interfering family member",
      "Supportive best friend",
    ],
    plotPoints: [
      "Meet-cute",
      "Growing connection",
      "Misunderstanding",
      "Personal growth",
      "Grand gesture",
      "Happy ending",
    ],
    estimatedChapters: 6,
  },
  {
    id: "horror-survival",
    name: "Horror Survival",
    description: "A terrifying fight for survival against the unknown",
    genre: "horror",
    style: "descriptive",
    tone: "dark",
    setting: "Isolated location cut off from help",
    promptTemplate: "A group of {people} find themselves trapped in {location} where {supernatural/creature/killer} hunts them one by one. They must survive until {dawn/rescue/escape}.",
    characterSuggestions: [
      "Resourceful survivor",
      "Skeptic turned believer",
      "First victim",
      "The entity/killer",
    ],
    plotPoints: [
      "Arrival and setup",
      "First encounter",
      "Growing paranoia",
      "Deaths begin",
      "Truth revealed",
      "Final confrontation",
    ],
    estimatedChapters: 8,
  },
  {
    id: "historical-epic",
    name: "Historical Epic",
    description: "Journey through a pivotal moment in history",
    genre: "historical",
    style: "descriptive",
    tone: "balanced",
    setting: "A significant historical period and location",
    promptTemplate: "In {historical period}, {protagonist} witnesses {historical event} that will change the course of history. Caught between {conflicting forces}, they must {make a choice/survive/protect someone}.",
    characterSuggestions: [
      "Common person in extraordinary times",
      "Historical figure",
      "Revolutionary",
      "Opposing force leader",
    ],
    plotPoints: [
      "Ordinary life disrupted",
      "Historical event begins",
      "Personal stakes raised",
      "Major battle/conflict",
      "Sacrifice made",
      "Resolution and legacy",
    ],
    estimatedChapters: 9,
  },
  {
    id: "cyberpunk-noir",
    name: "Cyberpunk Noir",
    description: "High-tech, low-life in a neon-soaked future",
    genre: "sci-fi",
    style: "action-packed",
    tone: "dark",
    setting: "Dystopian megacity of the near future",
    promptTemplate: "In the neon-lit streets of {city}, {hacker/detective/mercenary} {name} takes on a job that seems routine. But when {corporation/AI/conspiracy} gets involved, staying alive becomes the only mission that matters.",
    characterSuggestions: [
      "Cynical protagonist",
      "AI companion",
      "Corporate villain",
      "Street-smart informant",
    ],
    plotPoints: [
      "The job offer",
      "Digital infiltration",
      "Corporate conspiracy revealed",
      "Betrayal",
      "Cybernetic showdown",
      "System crash finale",
    ],
    estimatedChapters: 7,
  },
  {
    id: "coming-of-age",
    name: "Coming of Age",
    description: "A young person's journey to find themselves",
    genre: "adventure",
    style: "dialogue-heavy",
    tone: "inspiring",
    setting: "Relatable modern or historical setting",
    promptTemplate: "{Young protagonist} feels lost and out of place until {event/meeting/discovery} sets them on a path of self-discovery. Through {challenges}, they learn what truly matters.",
    characterSuggestions: [
      "Uncertain teenager",
      "Mentor figure",
      "New friend group",
      "Personal rival",
    ],
    plotPoints: [
      "Feeling lost",
      "Catalyst for change",
      "New experiences",
      "Personal failure",
      "Support from others",
      "Finding their path",
    ],
    estimatedChapters: 6,
  },
];

export function getTemplateById(id: string): StoryTemplate | undefined {
  return STORY_TEMPLATES.find(template => template.id === id);
}

export function getTemplatesByGenre(genre: string): StoryTemplate[] {
  return STORY_TEMPLATES.filter(template => template.genre === genre);
}

export function fillTemplate(template: StoryTemplate, values: Record<string, string>): string {
  let filledPrompt = template.promptTemplate;

  Object.entries(values).forEach(([key, value]) => {
    const regex = new RegExp(`{${key}}`, 'g');
    filledPrompt = filledPrompt.replace(regex, value);
  });

  // Remove any unfilled placeholders
  filledPrompt = filledPrompt.replace(/\{[^}]+\}/g, '___');

  return filledPrompt;
}
