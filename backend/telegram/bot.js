const TelegramBot = require("node-telegram-bot-api");
const Link = require("../models/Link");

const NUMBER_EMOJIS = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

// In-memory conversation state per chat
// States: null | { step: "awaiting_category", url } | { step: "awaiting_title", url, category }
const sessions = new Map();

/**
 * Detect if text is a URL.
 */
const isUrl = (text) => {
  try {
    const u = new URL(text);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

/**
 * Get all existing categories from the database.
 */
const getCategories = async () => {
  const cats = await Link.distinct("category");
  return cats.sort();
};

/**
 * Start the Telegram bot.
 */
const startTelegramBot = () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    console.error("❌ TELEGRAM_BOT_TOKEN not set in .env — bot disabled.");
    return;
  }

  const bot = new TelegramBot(token, { polling: true });

  console.log("🤖 Telegram bot started — polling for messages...");

  // /start command
  bot.onText(/\/start/, async (msg) => {
    sessions.delete(msg.chat.id);
    const cats = await getCategories();
    const catList = cats.length > 0 ? cats.join(", ") : "No categories yet";
    bot.sendMessage(
      msg.chat.id,
      `🔗 *LinkNest Bot*\n\n` +
        `*To save a link:* Just send a URL\n` +
        `I'll ask you for category and title.\n\n` +
        `*To search:* \`search | keyword\`\n` +
        `*To filter by category:* \`category | name\`\n\n` +
        `*Existing categories:* ${catList}\n\n` +
        `Type /cancel to cancel any operation.`,
      { parse_mode: "Markdown" }
    );
  });

  // /help command
  bot.onText(/\/help/, async (msg) => {
    sessions.delete(msg.chat.id);
    const cats = await getCategories();
    const catList = cats.length > 0 ? cats.join(", ") : "No categories yet";
    bot.sendMessage(
      msg.chat.id,
      `🔗 *LinkNest Bot — Help*\n\n` +
        `*1. Save a link:* Send any URL\n` +
        `   → Bot asks for category\n` +
        `   → Bot asks for title\n` +
        `   → Link saved!\n\n` +
        `*2. Search:* \`search | google\`\n\n` +
        `*3. Filter:* \`category | Courses\`\n\n` +
        `*4. Cancel:* /cancel\n\n` +
        `*Existing categories:* ${catList}`,
      { parse_mode: "Markdown" }
    );
  });

  // /cancel command
  bot.onText(/\/cancel/, (msg) => {
    sessions.delete(msg.chat.id);
    bot.sendMessage(msg.chat.id, "Cancelled ✅");
  });

  // Handle all text messages
  bot.on("message", async (msg) => {
    if (!msg.text || msg.text.startsWith("/")) return;

    const chatId = msg.chat.id;
    const text = msg.text.trim();
    const session = sessions.get(chatId);

    try {
      // --- Conversation flow: awaiting category ---
      if (session && session.step === "awaiting_category") {
        const category = text;
        sessions.set(chatId, { step: "awaiting_title", url: session.url, category });
        await bot.sendMessage(chatId, `📝 Got it! Category: *${category}*\n\nNow send me the *title* for this link:`, {
          parse_mode: "Markdown",
        });
        return;
      }

      // --- Conversation flow: awaiting title ---
      if (session && session.step === "awaiting_title") {
        const title = text;
        const { url, category } = session;
        sessions.delete(chatId);

        const link = await Link.create({
          title: title.trim(),
          url: url.trim(),
          category: category.trim(),
          tags: [],
        });

        await bot.sendMessage(
          chatId,
          `Link Saved ✅\n\n*Title:* ${link.title}\n*Category:* ${link.category}\n*URL:* ${link.url}`,
          { parse_mode: "Markdown", disable_web_page_preview: true }
        );
        return;
      }

      // --- User sent a URL: start add flow ---
      if (isUrl(text)) {
        sessions.set(chatId, { step: "awaiting_category", url: text });

        const cats = await getCategories();
        let catMsg = "📂 What *category* should this link go under?\n\n";
        if (cats.length > 0) {
          catMsg += `Existing categories:\n${cats.map((c) => `• ${c}`).join("\n")}\n\n`;
        }
        catMsg += "_Type an existing category or a new one:_";

        await bot.sendMessage(chatId, catMsg, { parse_mode: "Markdown" });
        return;
      }

      // --- Pipe commands: search | keyword ---
      const parts = text.split("|").map((p) => p.trim());
      const command = parts[0]?.toLowerCase();

      if (command === "search") {
        const reply = await handleSearch(parts);
        await bot.sendMessage(chatId, reply, { parse_mode: "Markdown", disable_web_page_preview: true });
        return;
      }

      if (command === "category") {
        const reply = await handleCategory(parts);
        await bot.sendMessage(chatId, reply, { parse_mode: "Markdown", disable_web_page_preview: true });
        return;
      }

      // --- Unknown input ---
      await bot.sendMessage(
        chatId,
        `🔗 I didn't understand that.\n\n` +
          `• Send a *URL* to save a link\n` +
          `• \`search | keyword\` to search\n` +
          `• \`category | name\` to filter\n` +
          `• /help for details`,
        { parse_mode: "Markdown" }
      );
    } catch (error) {
      console.error("Telegram bot error:", error.message);
      sessions.delete(chatId);
      await bot.sendMessage(chatId, "❌ An error occurred. Please try again.");
    }
  });

  // Log polling errors
  bot.on("polling_error", (error) => {
    console.error("Telegram polling error:", error.code, error.message);
  });
};

/**
 * Handle: search | keyword
 */
const handleSearch = async (parts) => {
  if (parts.length < 2 || !parts[1]) {
    return "❌ Format: `search | keyword`";
  }

  const keyword = parts[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const links = await Link.find({
    title: { $regex: keyword, $options: "i" },
  })
    .sort({ createdAt: -1 })
    .limit(10);

  if (links.length === 0) {
    return `No results found for "${parts[1]}" 🔍`;
  }

  let response = "Results 🔎\n\n";
  links.forEach((link, i) => {
    response += `${NUMBER_EMOJIS[i] || `${i + 1}.`} *${link.title}*\n${link.url}\n\n`;
  });

  return response.trim();
};

/**
 * Handle: category | CategoryName
 */
const handleCategory = async (parts) => {
  if (parts.length < 2 || !parts[1]) {
    const cats = await getCategories();
    const catList = cats.length > 0 ? cats.join(", ") : "No categories yet";
    return `❌ Format: \`category | name\`\n\nExisting categories: ${catList}`;
  }

  const category = parts[1];
  const links = await Link.find({
    category: { $regex: `^${category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
  })
    .sort({ createdAt: -1 })
    .limit(10);

  if (links.length === 0) {
    return `No links found in "${category}" 📂`;
  }

  let response = `📂 ${links[0].category}\n\n`;
  links.forEach((link, i) => {
    response += `${NUMBER_EMOJIS[i] || `${i + 1}.`} *${link.title}*\n${link.url}\n\n`;
  });

  return response.trim();
};

module.exports = { startTelegramBot };
