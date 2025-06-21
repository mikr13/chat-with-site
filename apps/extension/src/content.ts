import type { ContentRequest, ContentResponse } from './types.js';

// Enhanced content extraction that gets cleaner text from the page
function extractPageContent(): string {
  // Try to get the main content area first
  const contentSelectors = [
    'main',
    'article',
    '[role="main"]',
    '.content',
    '#content',
    '.post-content',
    '.entry-content',
    '.article-content'
  ];

  let contentElement: Element | null = null;

  for (const selector of contentSelectors) {
    contentElement = document.querySelector(selector);
    if (contentElement) break;
  }

  // If no main content area found, fall back to body but exclude common non-content areas
  if (!contentElement) {
    const body = document.body.cloneNode(true) as HTMLElement;

    // Remove common non-content elements
    const elementsToRemove = [
      'header',
      'nav',
      'footer',
      '.header',
      '.navigation',
      '.nav',
      '.footer',
      '.sidebar',
      '.menu',
      '.ads',
      '.advertisement',
      'script',
      'style',
      'noscript'
    ];

    elementsToRemove.forEach(selector => {
      const elements = body.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });

    contentElement = body;
  }

  // Clean up the text
  const text = (contentElement as HTMLElement).innerText || contentElement.textContent || '';

  // Remove excessive whitespace and normalize
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim();
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(
  (request: ContentRequest, sender: any, sendResponse: (response: ContentResponse) => void) => {
    if (request.action === "extract_content") {
      try {
        const content = extractPageContent();
        sendResponse({ content });
      } catch (error) {
        console.error('Content extraction error:', error);
        sendResponse({
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
      }
      return true; // Keep the message channel open for async response
    }

    return false;
  }
);

export { }; // Make this a module
