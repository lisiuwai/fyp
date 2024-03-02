import React, { useState } from 'react';
import nlp from 'compromise';

export default function KeywordExtraction() {
    const [question, setQuestion] = useState('');

    const extractKeywords = (text) => {
        const punctuationRegex = /[.,\/#!$%\^&?\*;:{}=\-_`~()]/g;
        
        let doc = nlp(text.replace(punctuationRegex, '')); 
        const stopwords = ['you', 'me', 'some', 'of', 'can', 'give', 'is', 'what', 'the', 'a', 'an'];
        let keywords = doc.nouns().out('array');

        keywords = keywords.filter(keyword => !stopwords.includes(keyword.toLowerCase()))
                           .map(keyword => keyword.replace(punctuationRegex, ''));

        if (keywords.length === 0) {
            const match = text.match(/what is\s+(.*)/i);
            if (match) {
                let filteredMatch = match[1].split(' ')
                                            .filter(word => !stopwords.includes(word.toLowerCase()))
                                            .map(word => word.replace(punctuationRegex, ''))
                                            .join(' ');
                return [filteredMatch];
            } else {
                let fallbackKeywords = text.split(/\s+/)
                                           .filter(word => !stopwords.includes(word.toLowerCase()))
                                           .map(word => word.replace(punctuationRegex, ''))
                                           .slice(0, 5)
                                           .join(' ');
                return [fallbackKeywords];
            }
        }
        return keywords.join(' '); 
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 
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
