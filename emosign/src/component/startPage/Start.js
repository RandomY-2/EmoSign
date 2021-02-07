import React from 'react';
import {Link} from 'react-router-dom';
import {Row, Col} from 'react-bootstrap';

import './StartPage.css';

const Start = () => {
    return (
        <div id="welcomeSection" className="welcomeContainer welcome-container">
            <div className="welcome-Info">
                <h1 className="welcome-Info-Heading">Welcome to EmoSign</h1>
                <p className="welcome-Info-Subheading">where you can translate ASL alphabets using deep learning</p>
                <Row>
                    <Col>
                        <Link to='/detection' type="button" className="welcome-Info-Button">Start Detection</Link>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default Start;