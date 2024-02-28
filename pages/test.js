import React, { useState } from 'react';
import nlp from 'compromise';

export default function KeywordExtraction() {
    const [question, setQuestion] = useState('');

    const extractKeywords = (text) => {
        // Define a regex to match common punctuation marks
        const punctuationRegex = /[.,\/#!$%\^&?\*;:{}=\-_`~()]/g;
        
        let doc = nlp(text.replace(punctuationRegex, '')); // Remove punctuation from text before processing
        const stopwords = ['you', 'me', 'some', 'of', 'can', 'give', 'is', 'what', 'the', 'a', 'an'];
        let keywords = doc.nouns().out('array');

        // Filter out stopwords from the keywords and remove punctuation
        keywords = keywords.filter(keyword => !stopwords.includes(keyword.toLowerCase()))
                           .map(keyword => keyword.replace(punctuationRegex, ''));

        if (keywords.length === 0) {
            const match = text.match(/what is\s+(.*)/i);
            if (match) {
                // Apply punctuation removal and filter out stopwords
                let filteredMatch = match[1].split(' ')
                                            .filter(word => !stopwords.includes(word.toLowerCase()))
                                            .map(word => word.replace(punctuationRegex, ''))
                                            .join(' ');
                return [filteredMatch];
            } else {
                // Apply the fallback strategy with punctuation removal and stopwords consideration
                let fallbackKeywords = text.split(/\s+/)
                                           .filter(word => !stopwords.includes(word.toLowerCase()))
                                           .map(word => word.replace(punctuationRegex, ''))
                                           .slice(0, 5)
                                           .join(' ');
                return [fallbackKeywords];
            }
        }
        return keywords.join(' '); // Combine keywords into a single string
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent form submission from reloading the page
        console.log("Extracted Keywords:", extractKeywords(question));
    };

    return (
        <div>
            <h2>Keyword Extraction Test</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Enter your question here"
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
