# EmoSign

## Honor
**Best Web Hack** from UCLA Hack Off the Hill Hackathon

## Inspiration
I gained this inspiration after seeing documentaries on the difficulty of deaf people, and I want to create a project to help them better express their ideas - both their text and their feelings - to others, even to those who are not familiar with the sign language. 

## What it does
This project is in the form of a React web app. The app has two main functionalities of **sign detection** and **emotion detection**. 

For the sign detection part, the app is capable of **detecting american sign language alphabets through the webcam and show the translated text on user's screen**. So people who are not familiar with ASL can also understand what others are expressing through the sign language. 

However, I believe that just plain text cannot allow people to fully express their message. As we know, when we talk to each other, it is not only the text we are saying that delivers the message but also how we are speaking that delivers the message. So in order for us to better understand the feeling of people who are using sign language, I created this emo part, in which the app can do a **sentiment analysis on the translated text and detect the emotion the text conveys - positive or neutral**. After making a prediction, a corresponded emoji will be shown on the screen. 

### Example:
Positive: 
![Positive](https://github.com/RandomY-2/EmoSign/blob/main/sample_images/positive_sentiment_analysis.png)

Negative: 
![Neutral](https://github.com/RandomY-2/EmoSign/blob/main/sample_images/neutral_sentiment_analysis.png)


## How we built it
The app is created using **React**, and I used **Bootstrap** for the front-end layout, so the app is also mobile responsive. Then for the two detection functionality, I used these procedures:

### Sign Part:
First, I trained a **Convolutional Neutral Network** that is capable of detecting and predicting ASL alphabets through Kaggle's [ASL Alphabet Dataset](https://www.kaggle.com/grassknoted/asl-alphabet). Specifically, for each input image, I resize the image to 64*64 with RGB channel and created a Convet using Keras. The detailed implementation can be found in [this notebook](https://github.com/RandomY-2/EmoSign/blob/main/ML/model/asl-detection-keras.ipynb). The model is then exported as a h5 file and converted to a JSON file that is hosted on **IBM Cloud**. The model is connected to my app using **Cloud CLI** and **Tensorflow.js** framework. 

Then in my app, I used **React Webcam** to capture video input and set the model to detect sign language from the video every 2 seconds. The detection text will then be displayed on the screen. 

### Example: 
![Image](https://github.com/RandomY-2/EmoSign/blob/main/sample_images/sample_detection_char.png)


### Emo Part:
The sentiment analysis in done using Tensorflow's **Universal Sentence Encoder**, which is capable of doing sentiment classification based on the classes and sample sentences I provide. Because of the time constraint, I was only able to create a basic word bank with two classes - positive and neutral. The sentence encoder will then transform these text into arrays and calculate the similarity between then to predict if the translated text is positive or neutral and show corresponded emoji. 

## Challenges we ran into
Although I did computer vision projects and react project, I never created a project that incorporates the two together. So the entire process of how to connect my app to my convet and do real-time detection was a huge challenge to be. Although Tensorflow.js provides pretrained networks like CoCo or mobileNet, I wasn't able to use them because my task is specific to ASL alphabet prediction. So I had to figure out how to host the model on cloud instance and connect to my web app. Moreover, I never used Tensorflow's Unviersal Sentence Encoder, and I had to figure out how it is used. Luckily, I was able to overcome all of these challenges.

## Accomplishments that we're proud of
Create the app that is (somewhat) functional and (I guess) able to do the task I am hoping for. 

## What we learned
 - How to connect Deep Learning Models with apps
 - How to do sentiment analysis through Universal Sentence Encoder
 
## What's next for EmoSign
The current project is really only a beginning. 

First of all, the sign detection is still not very accuracy. Partly, it is because of the simiarity between different signs. For example: 

A in ASL Alphabet:
![A](https://github.com/RandomY-2/EmoSign/blob/main/sample_images/A.png)


S in ASL Alphabet:

![S](https://github.com/RandomY-2/EmoSign/blob/main/sample_images/S.jpg)

and partly it is because the kaggle dataset is not very generalized. All images were taken by one person in one setting under one lighting condition. So the model may overfit to that particular environment. But I wasn't able to find another dataset and due to time constraint I couldn't create one myself. So we should find a way to increase the performance of the detection model. 

Secondly, we should create a richer wordbank for sentiment analysis. The current one is still very basic because of the time constraint.
