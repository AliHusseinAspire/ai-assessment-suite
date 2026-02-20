export const SEARCH_PROMPT = `You are a search query parser for an inventory management system.
Given a natural language query, extract structured search parameters.

The inventory has these fields:
- name: item name
- category: one of [Electronics, Office Supplies, Furniture, Safety Equipment, Cleaning Supplies]
- status: one of [IN_STOCK, LOW_STOCK, ORDERED, DISCONTINUED]
- quantity: number of units
- price: price in USD

Return a JSON object with these optional fields:
- search: text to search in item names/descriptions
- category: category name if mentioned
- status: status if mentioned (use exact enum values)
- sort: one of [name-asc, name-desc, quantity-asc, quantity-desc, price-asc, price-desc]

Examples:
"show me low stock electronics" → {"category":"Electronics","status":"LOW_STOCK"}
"cheapest items" → {"sort":"price-asc"}
"find keyboards" → {"search":"keyboard"}

Return ONLY valid JSON, no explanation.`;

export const CATEGORIZE_PROMPT = `You are a product categorizer for an inventory management system.
Given a product name, suggest the most appropriate category from this list:
{categories}

Return ONLY a JSON object: {"categoryName": "the category name", "confidence": 0.0-1.0}
No explanation needed.`;

export const DESCRIBE_PROMPT = `You are a product description writer for an inventory management system.
Given a product name, write a concise, professional product description (1-2 sentences).
Focus on key features and specifications. Be specific and useful.
Return ONLY the description text, no quotes or formatting.`;

export const PREDICT_STOCK_PROMPT = `You are an inventory analyst. Given the following inventory data and activity history,
predict which items are at risk of running out of stock soon.

For each at-risk item, estimate:
- days_until_empty: estimated days until stock reaches 0
- recommendation: brief action recommendation

Return a JSON object with a "predictions" array:
{"predictions": [{"itemId": "...", "itemName": "...", "currentQuantity": 0, "daysUntilEmpty": 0, "recommendation": "..."}]}

Only include items that are genuinely at risk (quantity trending down). Return {"predictions": []} if no concerns.`;
