import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import { CLASS } from './HelperFunc/mapLabel';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';

import './detect.css';
import posEmo from './img/positive-emoji.png';
import neuEmo from './img/neutral-emoji.png';

const positive = [
    'H,O,W, ,A,R,E, ,Y,O,U,', 'T,H,A,N,K, ,Y,O,U, ,S,O, ,M,U,C,H,', 'T,O,D,A,Y, ,I,S, ,A, ,N,I,C,E, ,D,A,Y,',
    'I, ,L,I,K,E, ,P,L,A,Y,I,N,G, ,T,E,N,N,I,S,', 'I, ,L,I,K,E, ,Y,O,U,R, ,P,H,O,N,E,', 'H,A,H,A,H,A,'
];

const negative = [
    'S,A,D,', 'U,N,H,A,P,P,Y,', 'D,E,P,R,E,E,S,S,E,D,', 'A,N,G,R,Y,', 'N,O,', 'H,A,T,E,'
]

const sentences = [
    // positive
    'H,O,W, ,A,R,E, ,Y,O,U,', 'T,H,A,N,K, ,Y,O,U, ,S,O, ,M,U,C,H,', 'T,O,D,A,Y, ,I,S, ,A, ,N,I,C,E, ,D,A,Y,',
    'I, ,L,I,K,E, ,P,L,A,Y,I,N,G, ,T,E,N,N,I,S,', 'I, ,L,I,K,E, ,Y,O,U,R, ,P,H,O,N,E,', 'H,A,H,A,H,A,',

    // negative
    'S,A,D,', 'U,N,H,A,P,P,Y,', 'D,E,P,R,E,E,S,S,E,D,', 'A,N,G,R,Y,', 'N,O,', 'H,A,T,E,'
];

function Detection() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [text, setText] = useState([]);
    const [emo_model, setModel] = useState(null);
    const [emotion, setEmotion] = useState('');
    const [loaded, setLoaded] = useState(false);

    const loadModel = async () => {
        const sign_model = await tf.loadLayersModel('https://cloud-object-storage-7g-cos-standard-40b.s3.us-east.cloud-object-storage.appdomain.cloud/model.json');
        const sentence_model = await use.load();

        setLoaded(true);
        setModel(sentence_model);

        setInterval(() => {
            detect(sign_model);
        }, 2000);
    };

    const emo_predict = async(input) => {
        sentences.push(input);
        const embeddings = await emo_model.embed(sentences);
    
        let score = -1;
        let index = -1;
        for (let i = 0; i < sentences.length-1; i++) {
            const sentenceI = tf.slice(embeddings, [i, 0], [1]);
            const sentenceJ = tf.slice(embeddings, [sentences.length-1, 0], [1]);
            const sentenceITranspose = false;
            const sentenceJTransepose = true;
            const tempScore = tf.matMul(sentenceI, sentenceJ, sentenceITranspose, sentenceJTransepose).dataSync()[0];
            console.log(tempScore + " " + sentences[i]);
            index = score > tempScore ? index : i;
            score = score > tempScore ? score : tempScore;
        }
    
        sentences.pop();
        
        if (score < 0.4) {
            console.log('neutral');
            setEmotion('neutral');
        } else if (positive.includes(sentences[index])) {
            console.log('positive'); 
            setEmotion('positive');
        } else {
            console.log('neutral');
            setEmotion('neutral');
        }
    }

    const detect = async (sign_model) => {
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ) {
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;
        
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;
        
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;
        
            // convert image size to (1, 50, 50, 3)
            const img = tf.browser.fromPixels(video);
            const resized = tf.image.resizeBilinear(img, [64,64]).reverse(1);
            const casted = resized.cast('int32');
            const expanded = resized.expandDims(0);
            const prediction = await sign_model.predict(expanded.div(255.0)).dataSync();
           
            let index = 0;
            let score = prediction[0];
            for (let i = 0; i < 29; i++) {
                index = score > prediction[i] ? index : i;
                score = score > prediction[i] ? score : prediction[i];
            }

            let label = CLASS[index];
            setText(text => [...text, label]);

            tf.dispose(img)
            tf.dispose(resized)
            tf.dispose(casted)
            tf.dispose(expanded)
        }
    };

    useEffect(()=>{loadModel()},[]);
    
    return (
        <div className='cam-background'>
            {!loaded ? 
            <Container>
                <Row>
                    <Col>
                        <h1>Loading Model...</h1>
                    </Col>
                </Row>
            </Container> :
            
            <Container>
                <Row>
                    <Col>
                        <h1>Translation:</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h4>{text}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button onClick={() => emo_predict(text.toString())} varaint='info'>Get Emotion!</Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {emotion === '' ? <div></div> : 
                         emotion === 'positive' ? <Image src={posEmo} /> : 
                                                  <Image src={neuEmo} />}
                    </Col>
                </Row>

                <Webcam
                        ref={webcamRef}
                        muted={true} 
                        style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        zindex: 9,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'black'
                        }}
                />

                <canvas
                        ref={canvasRef}
                        style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        zindex: 8,
                        width: '100%',
                        height: '100%'
                        }}
                />      
            </Container>
            }
        </div>
    )
}

export default Detection
