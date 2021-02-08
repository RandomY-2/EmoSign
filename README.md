# EmoSign

## Inspiration
I gained this inspiration after seeing documentaries on the difficulty of deaf people, and I want to create a project to help them better express their ideas - both their text and their feelings - to others, even to those who are not familiar with the sign language. 

## What it does
This project is in the form of a React web app. The app has two main functionalities of sign detection and emotion detection. 

For the sign detection part, the app is capable of detecting american sign language alphabets through the webcam and show the translated text on user's screen. So people who are not familiar with ASL can also understand what others are expressing through the sign language. 

For the emotion detection part, the app can do a sentiment analysis on the translated text and detect the emotion the text conveys - positive or neutral. After making a prediction, a corresponded emoji will be shown on the screen. 

### Example:
Positive: 
![Positive](https://github.com/RandomY-2/EmoSign/blob/main/sample_images/positive_sentiment_analysis.png)

Negative: 
![Neutral](https://github.com/RandomY-2/EmoSign/blob/main/sample_images/neutral_sentiment_analysis.png)


## How we built it
The app is created using React, and I used Bootstrap for the front-end layout, so the app is also mobile responsive. Then for the two detection functionality, I used these procedures:

### Sign Part:
First, I trained a Convolutional Neutral Network that is capable of detecting and predicting ASL alphabets through Kaggle's [ASL Alphabet Dataset](https://www.kaggle.com/grassknoted/asl-alphabet)


## Challenges we ran into

## Accomplishments that we're proud of

## What we learned

## What's next for EmoSign
