import { CATEGORY_MESSAGES } from './constants';

const WHATSAPP_REGEX_STANDARD = /^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s+(\d{1,2}:\d{2}(?::\d{2})?\s?(?:[ap]m)?)\s+-\s+([^:]+):\s+(.*)$/i;
const WHATSAPP_REGEX_BRACKETS = /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),\s+(\d{1,2}:\d{2}(?::\d{2})?\s?(?:[ap]m)?)\]\s+([^:]+):\s+(.*)$/i;

const URL_REGEX = /(https?:\/\/[^\s,]+)/g;

const NOISE_WORDS = [
  "hi", "hey", "hello", "bye", "gn", "tc", "okay", "ok", "okey", "okeyy", 
  "sure", "yes", "yess", "yesss", "thanks", "thx", "coming", "bye bye", 
  "good night", "good morning", "see ya", "k", "kk", "got it", "nice", 
  "cool", "great", "sure..", "ok !", "tc!", "gn!", "gn", "oh ok", "??", "?", 
  "oey", "okayy😮💨", "gn", "tc"
];

const isTrivial = (text) => {
  const content = text.toLowerCase().trim().replace(/[^\w\s\?]/g, '');
  
  // Rule 1: Very short messages
  if (content.length <= 4 && !content.includes('?')) return true;
  
  // Rule 2: Message consists only of noise words
  const words = content.split(/\s+/);
  if (words.every(word => NOISE_WORDS.includes(word))) return true;
  
  return false;
};

/**
 * Parses a single line (or handles continuations) of the exported WhatsApp chat.
 * @param {string} rawText The content of the .txt file or pasted text.
 * @returns {Array<Object>} List of message objects.
 */
export const parseWhatsAppChat = (rawText) => {
  const lines = rawText.split('\n');
  const messages = [];
  let currentMessage = null;

  lines.forEach((line) => {
    line = line.trim();
    if (!line) return;

    // Try both regex variations
    const match = line.match(WHATSAPP_REGEX_STANDARD) || line.match(WHATSAPP_REGEX_BRACKETS);

    if (match) {
      const [_, date, time, sender, content] = match;
      const category = detectCategory(content);
      const isNoise = isTrivial(content);

      // Keep if it has a category OR is not trivial
      if (
        content.includes('Messages and calls are end-to-end encrypted') ||
        content.includes('<Media omitted>') ||
        (isNoise && category === 'other') // Filter if noise AND no category
      ) {
        return;
      }

      currentMessage = {
        date,
        sender,
        message: content,
        links: extractLinks(content),
        category: category,
      };
      messages.push(currentMessage);
    } else if (currentMessage) {
      // Continuation of previous message
      const cleanedLine = line.trim();
      if (cleanedLine === '<Media omitted>') return;

      currentMessage.message += ' ' + cleanedLine;
      // Re-run category detection and link extraction for multiline
      currentMessage.links = Array.from(new Set([...currentMessage.links, ...extractLinks(cleanedLine)]));
      currentMessage.category = detectCategory(currentMessage.message);
    }
  });

  // Post-processing according to user rules:
  // 1. Remove rows with less than five words in the task description
  // 2. Remove duplicate rows if date and message are the same (except if categories are different - though message usually implies category)
  const seen = new Set();
  const processedMessages = messages.filter((m) => {
    // Word count check: Only count items that contain at least one alphanumeric character
    const words = m.message.trim().split(/\s+/).filter(w => /[a-zA-Z0-9]/.test(w));
    if (words.length < 5) return false;

    // Duplicate check (Date + Category + Message)
    const key = `${m.date}|${m.category}|${m.message}`;
    if (seen.has(key)) return false;
    seen.add(key);

    return true;
  });

  return processedMessages;
};

const extractLinks = (text) => {
  const links = text.match(URL_REGEX) || [];
  return Array.from(new Set(links)); // Unique links
};

const detectCategory = (text) => {
  const content = text.toLowerCase();
  for (const [key, category] of Object.entries(CATEGORY_MESSAGES)) {
    if (key === 'other') continue;
    if (category.keywords.some((keyword) => content.includes(keyword))) {
      return key;
    }
  }
  return 'other';
};
