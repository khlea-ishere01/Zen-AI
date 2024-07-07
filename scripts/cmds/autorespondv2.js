module.exports = {
config: {
name: "autorespondv2",
version: "2.0.0",
author: "Haru",
cooldown: 5,
role: 0,
shortDescription: "Autoresponds with reactions and replies",
longDescription: "Autoresponds with reactions and replies based on specific words or triggers.",
category: "fun",
guide: "?autorespondv3",
},
onStart: async ({ api, event }) => {
// Blank onStart function as per the request
},
onChat: async ({ api, event }) => {
const { body, messageID, threadID } = event;

// Reactions based on words
const emojis = {
"🌸": ["Goddess", "Kaycee", "Zen", "Beautiful", "Pretty", "pretty", "maganda", "beautiful", "ganda", "yeppeo", "beauty", "Beauty", "Flower", "flower", "julianne", "Julianne", "yesha", "Yesha"],
"😆": ["haha", "hahaha", "hahahaha", "hahahahaha", "pfft", "pft", "pffft", "HAHA", "HAHAHA", "HAHAHAHA", "HAHAHAHAHA", "HAHAHAHAHAHA", "hshs", "HSHS", "hshshs", "HSHSHS"],
"😠": ["🤨", "nooo", "no", "talong", "galit", "noo", "nagagalit", "mad", "angry", "magalit", "ayoko", "ayoq", "ayaw"],
"😏": ["wtf", "fck", "haaays", "stfu", "ngi ", "ngek", "nge ", "luh", "lah", "hays", "wth", "fuck", "tangina", "putangina", "tanginamo", "putanginamo", "Tangina", "Putangina", "Tanginamo", "Putanginamo"],
"⏳": ["prodia", "sdxl", "bardv3", "tanongv2", "-imagine", "genimg", "Tanongv4", "kamla", "-shortcut"],
"👋": ["Hi", "hi", "Hii", "hii", "hello", "Hello", "hiii", "Hiii", "loe", "Loe", "loee", "Loee"],
"🌊": ["ok", "cool", "bien", "super", "d'accord", "génial", "merveille"],
};

// Replies to specific words
const replies = {
"Bye": "bye babe",
"muah": "💋🌷",
"teh": "ano?",
"leia, who is your mother?": "Kaycee, pinaka mamahal na nanay ko",
"mahal kita": "love you too, baby",
"mahal na mahal kita": "love you too, baby",
"bot": "I'm not a bot!",
"bots": "I'm not a bot!",
"ewan": "ano?",
"fuck": "bakit ka nagmumura?",
"tanginamo": "bakit ka nagmumura?",
"tangina": "bakit ka nagmumura?",
"putangina": "bakit ka nagmumura?",
"fck": "bakit ka nagmumura?",
"shit": "bakit ka nagmumura?",
"misskonasya": "hindi ka miss, duh",
"misskonasiya": "hindi ka miss, duh",
"miss ko na sya": "hindi ka miss, duh",
"miss ko na siya": "hindi ka miss, duh",
"julianne": "pagpahingahin mo po muna si nanay",
"thanks": "you're welcome!",
"thank you": "you're welcome!",
"thx": "you're welcome!",
"ty": "you're welcome!",
"tyy": "you're welcome!",
"thank youu": "you're welcome!",
"yesha": "pagpahingahin mo po muna si nanay",};

// React based on words
for (const [emoji, words] of Object.entries(emojis)) {
for (const word of words) {
if (body.toLowerCase().includes(word)) {
api.setMessageReaction(emoji, messageID, () => {}, true);
}
}
}

// Reply based on triggers
for (const [trigger, reply] of Object.entries(replies)) {
if (body.toLowerCase().includes(trigger)) {
api.sendMessage(reply, threadID, messageID);
}
}
},
};};
