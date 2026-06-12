# Feature Engineering in Aether

## Overview

Aether uses sophisticated feature engineering across multiple domains:
- Text & Document Features
- Graph Features
- User Behavior Features
- Mood & Temporal Features

## 1. Document Feature Engineering

### Text Features
- **TF-IDF vectors** (for keyword search)
- **Sentence-BERT embeddings** (`all-MiniLM-L6-v2`)
- **Named Entity Recognition** (spaCy)
- **SVO Triples** (Subject-Verb-Object)
- **Readability scores** (Flesch-Kincaid)
- **Keyword density**

### Graph Features (per page)
- Number of nodes / edges
- Average node degree
- Clustering coefficient
- Betweenness centrality
- PageRank scores
- Community detection (Louvain)

### Derived Features
- `relevance_score` = cosine similarity(query, chunk)
- `authority_score` = PageRank of source document
- `recency_score` = exponential decay based on upload date

## 2. Journal Feature Engineering

- Word count
- Sentiment polarity (via Gemini)
- Mood category (7 classes)
- Time-of-day writing pattern
- Topic clustering across entries
- Emotional volatility (mood change rate)

## 3. User Interaction Features

- Time spent on each page
- Number of PDF uploads per week
- Average journal entry length
- Frequency of XAI explanation requests
- Collaboration activity (WebSocket messages)

## 4. XAI Feature Importance

Every AI response includes:
- Top 3 contributing features
- Counterfactual analysis
- Confidence score
- Bias indicators (planned)

## 5. Feature Store (Future)

We plan to implement a lightweight feature store for:
- Real-time feature serving
- Feature versioning
- A/B testing of new features

---

This document is critical for anyone extending the intelligence layer of Aether.