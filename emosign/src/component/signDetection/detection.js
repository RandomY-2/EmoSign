import React, {useRef, useState, useEffect} from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import {CLASS} from './HelperFunc/mapLabel';
import {Container, Row, Col} from 'react-bootstrap';

import './detect.css';

// teachable machine URL: https://teachablemachine.withgoogle.com/models/4virVm-gp/

function Detection() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [text, setText] = useState([]);
    const [counter, setCounter] = useState(0);

    //const URL = 'https://teachablemachine.withgoogle.com/models/4virVm-gp/';

    const loadModel = async () => {
        const model = await tf.loadLayersModel('https://cloud-object-storage-7g-cos-standard-40b.s3.us-east.cloud-object-storage.appdomain.cloud/model.json')

        setInterval(() => {
            detect(model);
        }, 2000);
    }

    const detect = async (model) => {
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
            const prediction = await model.predict(expanded.div(255.0)).dataSync();
           
            // console.log(prediction);
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
        </div>
    )
}

export default Detection
