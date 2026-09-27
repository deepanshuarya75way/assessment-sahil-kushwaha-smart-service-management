/**
 * AI Ticket Classification Service
 * Automatically analyzes ticket title and description to predict category and priority.
 */

const CATEGORY_PATTERNS = {
  Electrical: ['electrical', 'electricity', 'meter', 'voltage', 'power', 'wiring', 'breaker', 'outage', 'light', 'short circuit'],
  Plumbing: ['plumbing', 'pipe', 'leak', 'water', 'drain', 'toilet', 'faucet', 'sink', 'flood', 'sewer'],
  Maintenance: ['maintenance', 'door', 'window', 'wall', 'paint', 'furniture', 'lock', 'desk', 'chair', 'hvac', 'ac', 'air conditioning'],
  'IT Support': ['it support', 'helpdesk', 'system', 'pc', 'account', 'login', 'permission'],
  Billing: ['payment', 'invoice', 'charge', 'credit card', 'refund', 'subscription', 'billing', 'price', 'plan', 'receipt', 'tax'],
  Hardware: ['laptop', 'monitor', 'keyboard', 'mouse', 'printer', 'screen', 'cpu', 'battery', 'cable', 'dock'],
  Software: ['app', 'application', 'install', 'update', 'bug', 'crash', 'freeze', 'plugin', 'version', 'patch'],
  Technical: ['database', 'server', 'api', '500 error', '404', 'timeout', 'dns', 'ssl', 'latency', 'code'],
  Network: ['wifi', 'ethernet', 'router', 'switch', 'vpn', 'ip', 'bandwidth', 'internet', 'lan'],
  Account: ['password', 'login', '2fa', 'reset', 'access', 'profile', 'permission', 'username', 'sso', 'auth', 'email change']
};

const PRIORITY_PATTERNS = {
  URGENT: ['down', 'outage', 'critical', 'emergency', 'blocker', 'production error', 'system crash', 'security breach', 'data loss'],
  HIGH: ['cannot login', 'failing', 'error 500', 'urgent', 'broken', 'immediate', 'asap', 'payment error'],
  MEDIUM: ['issue', 'problem', 'slow', 'warning', 'not working', 'assistance'],
  LOW: ['question', 'how to', 'inquiry', 'feature request', 'suggestion', 'minor', 'documentation']
};

/**
 * Predict category and priority using text analysis with 1.5s timeout safeguard
 */
const classifyTicket = async (title = '', description = '') => {
  const timeoutPromise = new Promise((resolve) =>
    setTimeout(() => resolve({ category: 'General', priority: 'MEDIUM', confidence: 0 }), 1500)
  );

  const classificationPromise = (async () => {
    const combinedText = `${title} ${description}`.toLowerCase();

    // 1. Predict Category
    let predictedCategory = 'General';
    let highestCategoryScore = 0;

    for (const [category, keywords] of Object.entries(CATEGORY_PATTERNS)) {
      let score = 0;
      for (const kw of keywords) {
        if (combinedText.includes(kw)) {
          score += title.toLowerCase().includes(kw) ? 2 : 1;
        }
      }
      if (score > highestCategoryScore) {
        highestCategoryScore = score;
        predictedCategory = category;
      }
    }

    // 2. Predict Priority
    let predictedPriority = 'MEDIUM';
    for (const [priority, keywords] of Object.entries(PRIORITY_PATTERNS)) {
      for (const kw of keywords) {
        if (combinedText.includes(kw)) {
          predictedPriority = priority;
          break;
        }
      }
      if (predictedPriority !== 'MEDIUM') break;
    }

    return {
      category: predictedCategory,
      priority: predictedPriority,
      confidence: highestCategoryScore > 0 ? Math.min(0.65 + highestCategoryScore * 0.1, 0.98) : 0.5
    };
  })();

  try {
    return await Promise.race([classificationPromise, timeoutPromise]);
  } catch (err) {
    console.error('[AI Service Warning] Classification fallback executed:', err.message);
    return { category: 'General', priority: 'MEDIUM', confidence: 0 };
  }
};

module.exports = {
  classifyTicket
};
